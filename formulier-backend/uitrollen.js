#!/usr/bin/env node
'use strict';
/*
 * Zet de .gs-bestanden uit deze map bij Google en rolt ze uit naar de
 * bestaande webapp. Wordt aangeroepen door uitrollen.sh, dus door de
 * pre-push hook.
 *
 * Waarom niet clasp? Clasp vraagt bij het inloggen altijd het recht
 * "cloud-platform" mee. Google's herauthenticatiebeleid hangt daaraan, en
 * daardoor stopte elke push na een dag met invalid_grant (invalid_rapt).
 * Dit script vraagt alleen de twee rechten die nodig zijn om code bij te
 * werken en uit te rollen, en daar geldt dat beleid niet voor. Eén keer
 * inloggen is dus genoeg.
 *
 * Eenmalig per computer:   node uitrollen.js inloggen
 * Daarna vanzelf:          ./uitrollen.sh   (of gewoon git push)
 * Alleen code, nog niet live:  node uitrollen.js alleen-code
 *
 * Wat waar staat:
 *   creds.json        de eigen sleutel van contact@ (niet in de repo)
 *   .clasp-auth.json  de inlog die daaruit volgt (niet in de repo)
 *   .clasp.json       welk Apps Script-project (scriptId)
 *   .clasp-deployment het adres van de live webapp dat hetzelfde moet blijven
 */

const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');
const crypto = require('crypto');

const HIER = __dirname;
const SLEUTEL = path.join(HIER, 'creds.json');
const INLOG = path.join(HIER, '.clasp-auth.json');
const PROJECT = path.join(HIER, '.clasp.json');
const IMPLEMENTATIE = path.join(HIER, '.clasp-deployment');

// Alleen deze twee. Code bijwerken, en uitrollen naar de bestaande webapp.
const RECHTEN = [
  'https://www.googleapis.com/auth/script.projects',
  'https://www.googleapis.com/auth/script.deployments',
].join(' ');

function lees(bestand, wat) {
  if (!fs.existsSync(bestand)) {
    stop('Ik kan ' + path.basename(bestand) + ' niet vinden. ' + wat);
  }
  return JSON.parse(fs.readFileSync(bestand, 'utf8'));
}

function stop(bericht) {
  console.error('');
  console.error('✗ ' + bericht);
  process.exit(1);
}

/* ---- praten met Google ----------------------------------------------- */

function verstuur(adres, opties, inhoud) {
  return new Promise(function (klaar, mis) {
    const verzoek = https.request(adres, opties, function (res) {
      let tekst = '';
      res.on('data', function (d) { tekst += d; });
      res.on('end', function () {
        let data = null;
        try { data = JSON.parse(tekst); } catch (err) { /* geen json */ }
        klaar({ status: res.statusCode, data: data, tekst: tekst });
      });
    });
    verzoek.on('error', mis);
    if (inhoud) verzoek.write(inhoud);
    verzoek.end();
  });
}

function formulier(velden) {
  return Object.keys(velden)
    .map(function (k) { return encodeURIComponent(k) + '=' + encodeURIComponent(velden[k]); })
    .join('&');
}

async function tokenVerzoek(velden) {
  const inhoud = formulier(velden);
  const res = await verstuur('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(inhoud),
    },
  }, inhoud);
  if (res.status !== 200 || !res.data) {
    stop('Google wilde geen toegang geven: ' + res.tekst.slice(0, 300));
  }
  return res.data;
}

/* ---- eenmalig inloggen ----------------------------------------------- */

function inloggen() {
  const sleutel = lees(SLEUTEL, 'Zie INSTRUCTIES.md: dat is de eigen sleutel van contact@.').installed;
  return new Promise(function (klaar) {
    const staat = crypto.randomBytes(16).toString('hex');
    const server = http.createServer(async function (req, res) {
      const adres = new URL(req.url, 'http://localhost');
      const code = adres.searchParams.get('code');
      if (!code) {
        res.writeHead(400).end('Geen code ontvangen.');
        return;
      }
      if (adres.searchParams.get('state') !== staat) {
        res.writeHead(400).end('Dit antwoord hoort niet bij deze inlog.');
        return;
      }
      const tokens = await tokenVerzoek({
        code: code,
        client_id: sleutel.client_id,
        client_secret: sleutel.client_secret,
        redirect_uri: 'http://localhost:' + server.address().port,
        grant_type: 'authorization_code',
      });
      if (!tokens.refresh_token) {
        res.writeHead(500).end('Google gaf geen blijvende toegang terug.');
        stop('Google gaf geen refresh_token. Haal de toegang weg op '
          + 'https://myaccount.google.com/permissions en log opnieuw in.');
      }
      fs.writeFileSync(INLOG, JSON.stringify({
        client_id: sleutel.client_id,
        client_secret: sleutel.client_secret,
        refresh_token: tokens.refresh_token,
      }, null, 2));
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
        .end('<p style="font:16px system-ui">Gelukt. Je kunt dit venster sluiten.</p>');
      console.log('✓ Inlog opgeslagen in ' + path.basename(INLOG));
      server.close();
      klaar();
    });
    server.listen(0, '127.0.0.1', function () {
      const adres = 'https://accounts.google.com/o/oauth2/v2/auth?' + formulier({
        client_id: sleutel.client_id,
        redirect_uri: 'http://localhost:' + server.address().port,
        response_type: 'code',
        access_type: 'offline',
        prompt: 'consent',
        state: staat,
        scope: RECHTEN,
      });
      console.log('Open deze link en log in met contact@impactconnectutrecht.com:');
      console.log('');
      console.log(adres);
      console.log('');
    });
  });
}

async function toegang() {
  const inlog = lees(INLOG, 'Log eerst eenmalig in: node uitrollen.js inloggen');
  const tokens = await tokenVerzoek({
    client_id: inlog.client_id,
    client_secret: inlog.client_secret,
    refresh_token: inlog.refresh_token,
    grant_type: 'refresh_token',
  });
  return tokens.access_token;
}

/* ---- de code naar Google en uitrollen --------------------------------- */

function bestanden() {
  const uit = [];
  fs.readdirSync(HIER).sort().forEach(function (naam) {
    if (naam.endsWith('.gs')) {
      uit.push({
        name: naam.slice(0, -3),
        type: 'SERVER_JS',
        source: fs.readFileSync(path.join(HIER, naam), 'utf8'),
      });
    }
  });
  uit.push({
    name: 'appsscript',
    type: 'JSON',
    source: fs.readFileSync(path.join(HIER, 'appsscript.json'), 'utf8'),
  });
  return uit;
}

async function uitrollen(alleenCode) {
  const scriptId = lees(PROJECT, 'Draai eerst ./clasp-opzetten.sh').scriptId;
  const token = await toegang();
  const kop = {
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'application/json; charset=utf-8',
  };
  const stuur = async function (adres, methode, lijf) {
    const inhoud = lijf === undefined ? null : JSON.stringify(lijf);
    const res = await verstuur(adres, {
      method: methode,
      headers: Object.assign({}, kop, inhoud
        ? { 'Content-Length': Buffer.byteLength(inhoud) } : {}),
    }, inhoud);
    if (res.status < 200 || res.status >= 300) {
      const fout = res.data && res.data.error ? res.data.error.message : res.tekst.slice(0, 300);
      stop('Google gaf een fout terug (' + res.status + '): ' + fout);
    }
    return res.data;
  };

  const lijst = bestanden();
  console.log('▸ Code naar Google sturen');
  lijst.forEach(function (b) { console.log('└─ ' + b.name); });
  await stuur('https://script.googleapis.com/v1/projects/' + scriptId + '/content',
    'PUT', { files: lijst });

  if (alleenCode) {
    console.log('▸ Klaar. De code staat bij Google; de live versie is nog niet bijgewerkt.');
    return;
  }

  if (!fs.existsSync(IMPLEMENTATIE)) {
    console.log('▸ Code staat bij Google, maar er is geen implementatie ingesteld.');
    console.log('  Rol zelf uit: Implementeren → Implementaties beheren → Nieuwe versie.');
    return;
  }

  const omschrijving = new Date().toISOString().slice(0, 16).replace('T', ' ') + ' via git push';
  const versie = await stuur('https://script.googleapis.com/v1/projects/' + scriptId + '/versions',
    'POST', { description: omschrijving });
  const implementatie = fs.readFileSync(IMPLEMENTATIE, 'utf8').trim();
  console.log('▸ Uitrollen naar de bestaande webapp (adres blijft hetzelfde)');
  await stuur('https://script.googleapis.com/v1/projects/' + scriptId
    + '/deployments/' + implementatie, 'PUT', {
    deploymentConfig: {
      scriptId: scriptId,
      versionNumber: versie.versionNumber,
      manifestFileName: 'appsscript',
      description: omschrijving,
    },
  });
  console.log('▸ Klaar. Versie ' + versie.versionNumber + ' is live.');
}

const opdracht = process.argv[2];
(opdracht === 'inloggen' ? inloggen()
  : uitrollen(opdracht === 'alleen-code')).catch(function (err) {
  stop(err && err.message ? err.message : String(err));
});
