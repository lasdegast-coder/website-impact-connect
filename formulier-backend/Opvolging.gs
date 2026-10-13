/* ===================================================================
   Opvolging na een gesprek
   ===================================================================
   Wat er na een gesprek vanzelf gebeurt:

     1. een half uur na afloop krijgen wij een mail: welke programma's heb
        je aangeraden? Eén knop, en op die pagina vink je ze aan;
     2. zodra dat is opgeslagen krijgt de student een mail met het cijfer
        1 tot 5, en daarna de vraag of hij er iets mee gaat doen;
     3. is er na twee dagen niets vastgelegd, dan krijgen wij een
        herinnering. Na vier dagen gaat de mail naar de student sowieso,
        zonder de zin over de programma's, anders raken we zijn cijfer kwijt;
     4. dertig dagen na het gesprek vragen we de student wat het geworden is.

   Alles komt terecht op de regel van die student in het tabblad met de
   aanvragen voor gesprekken. Het script zet de kolommen er zelf bij.

   Het script draait niet uit zichzelf: Google maakt het wakker. Eén keer
   per kwartier voor de mail aan ons, en één keer per dag om 09:00 voor de
   herinneringen en de maandmail. Aanzetten doe je met zetOpvolgingAan().

   Geen mail aan studenten tussen 20:00 en 09:00: wie 's avonds laat iets
   opslaat, laat de student 's ochtends pas een mail krijgen.
   =================================================================== */

/* De programmasheet, voor de keuzelijst op onze eigen pagina. Dezelfde sheet
   die de website uitleest; zie PROGRAMME_SHEET in data.js. */
const PROGRAMMA_BESTAND_ID = '1jIjZ15sPo5i6OIOW4dlv1kAlTT-2qObawFDdMUF4Ejc';

/* Wat er in de mail aan de student komt te staan. */
const SITE_ADRES    = 'https://impactconnectutrecht.com';
const WHATSAPP_LINK = 'https://chat.whatsapp.com/IFJQL3ews8J624ZF2EY42T';

const OPVOLGING_NA_MINUTEN   = 30;   // zo lang na afloop krijgen wij de mail
const OPVOLGING_HERINNERING  = 2;    // dagen zonder invullen tot de herinnering
const OPVOLGING_UITERLIJK    = 4;    // dagen tot de student hoe dan ook mailt
const OPVOLGING_MAAND        = 30;   // dagen tot "wat is het geworden?"
const OPVOLGING_STIL_VANAF   = 20;   // 's avonds geen studentmail meer
const OPVOLGING_STIL_TOT     = 9;    // 's ochtends weer wel
const CIJFER_MAX             = 5;
const CIJFER_LAAG            = 2;    // hierbij of lager krijgen wij een seintje

/* Hoe lang de links in de mails blijven werken. De pagina voor ons mag kort;
   die mail lees je dezelfde dag. De student krijgt ruim de tijd. */
const OPVOLGING_LINK_TEAM    = 30;
const OPVOLGING_LINK_STUDENT = 120;

/* De vier antwoorden op "wat is het geworden?", in de volgorde van de mail. */
const UITKOMSTEN = [
  { id: 'programma', knop: 'I started / signed up a programme and/or approached an Alumni' },
  { id: 'zoekend',   knop: 'I am still looking' },
  { id: 'niets',     knop: 'I did not do anything after the conversation' },
  { id: 'anders',    knop: 'Something else' },
];

/* En de drie antwoorden op "ga je er iets mee doen?", meteen na het cijfer. */
const VERVOLGEN = [
  { id: 'aangemeld', knop: 'I signed up' },
  { id: 'bekijken',  knop: 'I\'m going to look into it' },
  { id: 'nee',       knop: 'Not for me' },
];

/* De kolommen die dit bestand bijhoudt. Ontbreken ze, dan zet het script ze
   er zelf achter; verslepen mag, hernoemen niet. */
const OPVOLGING_KOLOMMEN = [
  'Ref', 'Gesprek op', 'Door', 'Teammail op', 'Herinnerd op',
  'Aangeraden programma\'s', 'Extra tip', 'Voorgestelde alumni', 'Vastgelegd op',
  'Nagevraagd op', 'Cijfer', 'Vervolg', 'Toelichting', 'Beantwoord op',
  'Maandmail op', 'Uitkomst', 'Uitkomst toelichting', 'Uitkomst op',
  'Geen mail meer',
];

/* ---- het tabblad -----------------------------------------------------
   Dezelfde regel als waar het afspraakformulier in schrijft, dus alles over
   één student staat bij elkaar.
   ------------------------------------------------------------------- */
function opvolgingBlad() {
  const bestand = SpreadsheetApp.getActiveSpreadsheet();
  if (!bestand) return null;
  const cfg = FORMULIEREN.afspraak;
  const blad = bladOp(bestand, cfg.tabbladId, cfg.tabblad);
  if (!blad) return null;

  // ontbrekende kolommen achteraan erbij
  const laatste = blad.getLastColumn();
  let kop = laatste ? blad.getRange(1, 1, 1, laatste).getValues()[0].map(function (v) {
    return String(v).trim();
  }) : [];
  const nieuw = OPVOLGING_KOLOMMEN.filter(function (n) { return kop.indexOf(n) === -1; });
  if (nieuw.length) {
    blad.getRange(1, kop.length + 1, 1, nieuw.length).setValues([nieuw]);
    blad.getRange(1, 1, 1, kop.length + nieuw.length).setFontWeight('bold');
    kop = kop.concat(nieuw);
  }
  return { blad: blad, kop: kop };
}

/* Alle regels als objecten, zodat de rest van dit bestand niet met
   kolomnummers hoeft te rekenen. */
function opvolgingRegels() {
  const b = opvolgingBlad();
  if (!b || b.blad.getLastRow() < 2) return [];
  const waarden = b.blad.getDataRange().getValues();
  const kop = waarden[0].map(function (v) { return String(v).trim(); });
  const uit = [];
  for (let i = 1; i < waarden.length; i++) {
    const rij = waarden[i];
    const lees = function (naam) {
      const k = kop.indexOf(naam);
      return k === -1 ? '' : rij[k];
    };
    uit.push({
      regel: i + 1,
      blad: b.blad,
      kop: kop,
      ref: String(lees('Ref')).trim(),
      naam: String(lees('Naam')).trim(),
      email: String(lees('E-mail')).trim(),
      status: String(lees('Status')).trim().toLowerCase(),
      gesprekOp: lees('Gesprek op'),
      door: String(lees('Door')).trim(),
      // Wat de student in het afspraakformulier invulde; daarmee zoeken we alumni.
      zoekt: String(lees('Looking for')).trim(),
      themas: String(lees('Themes')).trim(),
      notities: String(lees('Anything else')).trim(),
      alumni: String(lees('Voorgestelde alumni')).trim(),
      teammailOp: String(lees('Teammail op')).trim(),
      herinnerdOp: String(lees('Herinnerd op')).trim(),
      programmas: String(lees('Aangeraden programma\'s')).trim(),
      extra: String(lees('Extra tip')).trim(),
      vastgelegdOp: String(lees('Vastgelegd op')).trim(),
      nagevraagdOp: String(lees('Nagevraagd op')).trim(),
      cijfer: String(lees('Cijfer')).trim(),
      maandmailOp: String(lees('Maandmail op')).trim(),
      uitkomstOp: String(lees('Uitkomst op')).trim(),
      geenMail: String(lees('Geen mail meer')).trim(),
    });
  }
  return uit;
}

function opvolgingSchrijf(regel, naam, waarde) {
  const k = regel.kop.indexOf(naam);
  if (k === -1) return;
  regel.blad.getRange(regel.regel, k + 1).setValue(waarde);
}

function opvolgingZoek(ref) {
  const schoon = String(ref || '').trim();
  if (!schoon) return null;
  const regels = opvolgingRegels();
  for (let i = 0; i < regels.length; i++) if (regels[i].ref === schoon) return regels[i];
  return null;
}

/* ---- kleine hulpjes -------------------------------------------------- */

function opvolgingNu() { return new Date(); }

function opvolgingUur(d) {
  return Number(Utilities.formatDate(d, TIJDZONE, 'H'));
}

/* Tussen 20:00 en 09:00 sturen we studenten niets. De dagelijkse controle van
   09:00 pakt het dan de volgende ochtend op. */
function magStudentNuMailen() {
  const uur = opvolgingUur(opvolgingNu());
  return uur >= OPVOLGING_STIL_TOT && uur < OPVOLGING_STIL_VANAF;
}

/* Hele dagen, niet op het uur nauwkeurig. Een gesprek van dinsdag 10:00 is
   op donderdagochtend "twee dagen geleden"; met klokuren zou dat pas
   donderdagmiddag zo zijn en kwam elke mail een dag te laat. */
function dagenGeleden(datum) {
  if (!(datum instanceof Date)) return null;
  const dag = function (d) { return Utilities.formatDate(d, TIJDZONE, 'yyyy-MM-dd'); };
  const naarGetal = function (tekst) {
    const d = tekst.split('-').map(Number);
    return Date.UTC(d[0], d[1] - 1, d[2]);
  };
  return (naarGetal(dag(opvolgingNu())) - naarGetal(dag(datum))) / 86400000;
}

function opvolgingDatumTekst(d) {
  return Utilities.formatDate(d, TIJDZONE, 'EEEE d MMMM, HH:mm');
}

function voornaam(naam) {
  return String(naam || '').trim().split(' ')[0] || 'there';
}

/* Een regel overslaan? Afgemeld, geen adres, of door jullie met de hand op
   "niet gekomen" gezet. */
function opvolgingSlaOver(regel) {
  if (!regel.email || !geldigMailadres(regel.email)) return true;
  if (regel.geenMail) return true;
  return regel.status.indexOf('niet gekomen') !== -1 || regel.status.indexOf('no show') !== -1;
}

/* Staat de afspraak nog in de agenda, en zo ja: wanneer? Een afgezegd gesprek
   hoort geen navraag te krijgen, en een verplaatst gesprek moet vanaf de
   nieuwe datum tellen. We kijken daarom ruim rond het oude tijdstip en zetten
   een nieuwe datum meteen in de sheet. Zonder agenda doen we niet moeilijk en
   houden we aan wat er in de sheet staat. */
function gesprekInAgenda(regel) {
  if (!(regel.gesprekOp instanceof Date)) return null;
  const agenda = gesprekAgenda();
  if (!agenda) return regel.gesprekOp;
  const van = new Date(regel.gesprekOp.getTime() - 14 * 86400000);
  const tot = new Date(regel.gesprekOp.getTime() + 30 * 86400000);
  const gevonden = agenda.getEvents(van, tot).filter(function (e) {
    return e.getTag('ref') === regel.ref;
  });
  if (!gevonden.length) return null;
  const start = gevonden[0].getStartTime();
  if (start.getTime() !== regel.gesprekOp.getTime()) {
    opvolgingSchrijf(regel, 'Gesprek op', start);
    regel.gesprekOp = start;
  }
  return start;
}

/* ---- de mail aan ons, een half uur na het gesprek -------------------- */

function stuurTeamMail(regel) {
  const link = SITE_ADRES + '/invullen.html?t='
    + encodeURIComponent(maakToken('gteam', regel.ref, '', OPVOLGING_LINK_TEAM));
  const wanneer = regel.gesprekOp instanceof Date ? opvolgingDatumTekst(regel.gesprekOp) : 'vandaag';

  MailApp.sendEmail({
    to: ONTVANGER,
    subject: 'What did you recommend to ' + voornaam(regel.naam) + '?',
    name: 'Website ' + AFZENDERNAAM,
    body: [
      'Your conversation with ' + tekstOf(regel.naam, 'the student') + ' was ' + wanneer + '.',
      '',
      'Take half a minute to note down which programmes you recommended. As soon',
      'as you save it, ' + voornaam(regel.naam) + ' gets the question how the',
      'conversation went:',
      '',
      link,
      '',
      'Nothing to recommend? Save it empty, then we know that too.',
    ].join('\n'),
  });
  opvolgingSchrijf(regel, 'Teammail op', opvolgingNu());
}

function stuurHerinnering(regel) {
  const link = SITE_ADRES + '/invullen.html?t='
    + encodeURIComponent(maakToken('gteam', regel.ref, '', OPVOLGING_LINK_TEAM));
  MailApp.sendEmail({
    to: ONTVANGER,
    subject: 'Reminder: what did you recommend to ' + voornaam(regel.naam) + '?',
    name: 'Website ' + AFZENDERNAAM,
    body: [
      'Your conversation with ' + tekstOf(regel.naam, 'the student') + ' was two days ago',
      'and the programmes you recommended are not in yet:',
      '',
      link,
      '',
      'In two days we ask ' + voornaam(regel.naam) + ' how it went anyway, but then',
      'without mentioning what you talked about.',
    ].join('\n'),
  });
  opvolgingSchrijf(regel, 'Herinnerd op', opvolgingNu());
}

/* ---- de mail aan de student ------------------------------------------ */

/* De mail gaat er twee keer in: als opgemaakte versie en als kale tekst.
   Vrijwel iedereen ziet de eerste, waarin de naam van een programma zelf de
   link is. Wie opmaak heeft uitgezet krijgt de tweede, met de adressen
   voluit. Zo staat er nooit een rij kale scriptlinks in beeld. */

// Let op: enkele aanhalingstekens om Segoe UI. De hele stijl komt in een
// style="..." te staan; met dubbele knipt de browser de regel daar af.
const MAIL_BLAD = "font:16px/1.6 -apple-system,BlinkMacSystemFont,'Segoe UI',"
  + "Helvetica,Arial,sans-serif;color:#23291F;max-width:560px";
const MAIL_LINK = 'color:#13352A;font-weight:600';
const MAIL_KOP = 'font-weight:600;color:#13352A;margin:26px 0 6px';
const MAIL_CIJFER = 'display:inline-block;min-width:34px;padding:9px 0;margin:0 6px 6px 0;'
  + 'border:1.5px solid #13352A;border-radius:99px;text-align:center;'
  + 'text-decoration:none;color:#13352A;font-weight:600';
const MAIL_KLEIN = 'font-size:13px;color:#6B7065';

function cijferLinks(ref) {
  const uit = [];
  for (let c = 1; c <= CIJFER_MAX; c++) {
    uit.push({
      cijfer: c,
      url: SITE_ADRES + '/feedback.html?score=' + c + '&t='
        + encodeURIComponent(maakToken('gcijfer', ref, String(c), OPVOLGING_LINK_STUDENT)),
    });
  }
  return uit;
}

function afmeldLink(ref) {
  return SITE_ADRES + '/feedback.html?stop=1&t='
    + encodeURIComponent(maakToken('gstop', ref, '', OPVOLGING_LINK_STUDENT));
}

function afmeldRegel(ref) {
  return 'No more mails about this conversation: ' + afmeldLink(ref);
}

function stuurCijferMail(regel) {
  MailApp.sendEmail({
    to: regel.email,
    subject: 'Your follow-up from ' + AFZENDERNAAM,
    name: AFZENDERNAAM,
    replyTo: ONTVANGER,
    body: opvolgMailTekst(regel),
    htmlBody: opvolgMailHtml(regel),
  });
  opvolgingSchrijf(regel, 'Nagevraagd op', opvolgingNu());
}

/* ---- kleine tekstklusjes --------------------------------------------- */

function deelLijst(waarde) {
  return String(waarde || '').split(/\s*;\s*/)
    .map(function (s) { return s.trim(); })
    .filter(String);
}

/* De beschrijving in de programmasheet is soms een hele alinea. In de mail
   willen we één regel, anders wordt het rijtje een lap tekst. */
function korteZin(tekst) {
  let s = String(tekst || '').replace(/\s+/g, ' ').trim();
  if (s.length <= 150) return s;
  const kort = s.slice(0, 150);
  const spatie = kort.lastIndexOf(' ');
  return (spatie > 60 ? kort.slice(0, spatie) : kort).replace(/[,;:.]$/, '') + '...';
}

/* Een losse tip uit het invulformulier eindigt lang niet altijd op een punt. */
function zinAf(tekst) {
  const s = String(tekst || '').trim();
  if (!s) return '';
  return /[.!?]$/.test(s) ? s : s + '.';
}

/* ---- waar de mail uit bestaat ----------------------------------------
   Eén keer verzamelen, zodat de opgemaakte en de kale versie niet uit elkaar
   kunnen gaan lopen. Een programma zonder adres in de sheet wijst naar onze
   eigen programmapagina, zodat er nooit een dood rijtje in de mail staat.
   ------------------------------------------------------------------- */
function opvolgMailDelen(regel) {
  const details = programmaDetails();
  const programmas = deelLijst(regel.programmas).map(function (naam) {
    const p = details[naam] || {};
    return {
      naam: naam,
      zin: korteZin(p.zin),
      url: p.url || (SITE_ADRES + '/programmes.html'),
    };
  });
  const alumni = alumniUitSheet(regel).map(function (a) {
    return {
      tekst: alumniTeaser(a),
      url: SITE_ADRES + '/alumni.html?alumnus=' + encodeURIComponent(a.id),
    };
  });
  return {
    voornaam: voornaam(regel.naam),
    programmas: programmas,
    alumni: alumni,
    tip: zinAf(regel.extra),
    cijfers: cijferLinks(regel.ref),
    afmeld: afmeldLink(regel.ref),
    ondertekening: ondertekening(regel),
  };
}

const MAIL_INTRO = [
  'We hope the meeting with us inspired you or helped you find the next step',
  'of your journey. We really enjoyed the conversation and getting to know you',
  'a bit better.',
];
const MAIL_ALUMNI = [
  'In addition, we have some alumni who might be interesting to talk to.',
  'We can introduce you. One click and we\'ll arrange it:',
];
const MAIL_CIJFERVRAAG = 'How was the conversation?';
const MAIL_CIJFERUITLEG = [
  'One click, and on the next page you can tell us what you are going to do',
  'with it. 1 means it did not help much, 5 means it really did.',
];

/* De kale versie. */
function opvolgMailTekst(regel) {
  const d = opvolgMailDelen(regel);
  const r = ['Hi ' + d.voornaam + ',', ''].concat(MAIL_INTRO);

  if (d.programmas.length) {
    r.push('', 'Based on what you shared, here are a few leads worth a look:', '');
    d.programmas.forEach(function (p) {
      r.push(' * ' + p.naam + (p.zin ? ': ' + p.zin : ''));
      r.push('   ' + p.url);
    });
  }

  if (d.alumni.length) {
    r.push.apply(r, [''].concat(MAIL_ALUMNI).concat(['']));
    d.alumni.forEach(function (a) {
      r.push(' * ' + a.tekst);
      r.push('   ' + a.url);
    });
  }

  if (d.tip) r.push('', 'One more thing we noted down for you: ' + d.tip);

  r.push.apply(r, ['', MAIL_CIJFERVRAAG].concat(MAIL_CIJFERUITLEG).concat(['']));
  d.cijfers.forEach(function (c) { r.push('  ' + c.cijfer + ' - ' + c.url); });

  r.push('',
    'Join our WhatsApp community: ' + WHATSAPP_LINK,
    'Our door stays open: reply to this mail or write to ' + ONTVANGER + '.',
    'You are always welcome to book another conversation: ' + SITE_ADRES,
    '', 'If you still have any questions, please don\'t hesitate to ask them!',
    '', 'Good luck, and we hope to hear from you soon.',
    '', 'Warm regards,', d.ondertekening, AFZENDERNAAM,
    '', afmeldRegel(regel.ref));

  return r.join('\n');
}

/* En dezelfde mail met opmaak. */
function opvolgMailHtml(regel) {
  const d = opvolgMailDelen(regel);
  const h = ['<div style="' + MAIL_BLAD + '">'];
  h.push('<p>Hi ' + ontsnap(d.voornaam) + ',</p>');
  h.push('<p>' + MAIL_INTRO.join(' ') + '</p>');

  if (d.programmas.length) {
    h.push('<p>Based on what you shared, here are a few leads worth a look:</p>');
    h.push('<ul style="padding-left:20px;margin:0">');
    d.programmas.forEach(function (p) {
      h.push('<li style="margin:0 0 12px"><a href="' + ontsnap(p.url) + '" style="'
        + MAIL_LINK + '">' + ontsnap(p.naam) + '</a>'
        + (p.zin ? '<br><span style="color:#4B5044">' + ontsnap(p.zin) + '</span>' : '')
        + '</li>');
    });
    h.push('</ul>');
  }

  if (d.alumni.length) {
    h.push('<p>' + MAIL_ALUMNI.join(' ') + '</p>');
    h.push('<ul style="padding-left:20px;margin:0">');
    d.alumni.forEach(function (a) {
      h.push('<li style="margin:0 0 12px"><a href="' + ontsnap(a.url) + '" style="'
        + MAIL_LINK + '">' + ontsnap(a.tekst) + '</a></li>');
    });
    h.push('</ul>');
  }

  if (d.tip) {
    h.push('<p>One more thing we noted down for you: ' + ontsnap(d.tip) + '</p>');
  }

  h.push('<p style="' + MAIL_KOP + '">' + MAIL_CIJFERVRAAG + '</p>');
  h.push('<p style="margin:0 0 12px">' + MAIL_CIJFERUITLEG.join(' ') + '</p>');
  h.push('<p style="margin:0 0 22px">' + d.cijfers.map(function (c) {
    return '<a href="' + ontsnap(c.url) + '" style="' + MAIL_CIJFER + '">' + c.cijfer + '</a>';
  }).join('') + '</p>');

  h.push('<p><a href="' + ontsnap(WHATSAPP_LINK) + '" style="' + MAIL_LINK + '">Join our '
    + 'WhatsApp community</a><br>Our door stays open: reply to this mail or write to '
    + '<a href="mailto:' + ontsnap(ONTVANGER) + '" style="' + MAIL_LINK + '">'
    + ontsnap(ONTVANGER) + '</a>.<br>You are always welcome to '
    + '<a href="' + ontsnap(SITE_ADRES) + '" style="' + MAIL_LINK + '">book another '
    + 'conversation</a>.</p>');

  h.push('<p>If you still have any questions, please don&#39;t hesitate to ask them!</p>');
  h.push('<p>Good luck, and we hope to hear from you soon.</p>');
  h.push('<p>Warm regards,<br>' + ontsnap(d.ondertekening) + '<br>'
    + ontsnap(AFZENDERNAAM) + '</p>');
  h.push('<p style="' + MAIL_KLEIN + '"><a href="' + ontsnap(d.afmeld) + '" style="'
    + MAIL_KLEIN + '">No more mails about this conversation</a></p>');
  h.push('</div>');
  return h.join('');
}

/* Onder de mail de naam van wie het gesprek deed. Op woensdag staat er in de
   agenda "Zoya/Noah" en weten we het niet zeker; dan tekenen we als team. */
function ondertekening(regel) {
  const wie = String(regel.door || '').trim();
  return wie && wie.indexOf('/') === -1 ? wie : 'The team';
}

/* De alumni die jullie hebben aangevinkt, opgehaald uit de alumnilijst. Wie
   inmiddels zijn toestemming heeft ingetrokken of vol zit, valt vanzelf af. */
function alumniUitSheet(regel) {
  const ids = String(regel.alumni || '').split(/\s*;\s*/).filter(String);
  if (!ids.length) return [];
  return leesAlumni().filter(function (a) {
    return ids.indexOf(a.id) !== -1 && !a.ruimte.vol;
  });
}

function stuurMaandMail(regel) {
  const keuzes = UITKOMSTEN.map(function (u) {
    return {
      knop: u.knop,
      url: SITE_ADRES + '/feedback.html?outcome=' + encodeURIComponent(u.id) + '&t='
        + encodeURIComponent(maakToken('guitkomst', regel.ref, u.id, OPVOLGING_LINK_STUDENT)),
    };
  });
  const opening = ['Hi ' + voornaam(regel.naam) + ',', '',
    'A month ago we talked about what you could do beside your studies.',
    'Where did you land?'];
  const slot = 'One click, and you can add a line on the next page.';

  const tekst = opening.concat([''])
    .concat(keuzes.map(function (k) { return '  ' + k.knop + ' - ' + k.url; }))
    .concat(['', slot, '', 'Best,', AFZENDERNAAM, ONTVANGER, '', afmeldRegel(regel.ref)])
    .join('\n');

  const html = ['<div style="' + MAIL_BLAD + '">',
    '<p>Hi ' + ontsnap(voornaam(regel.naam)) + ',</p>',
    '<p>A month ago we talked about what you could do beside your studies. '
      + 'Where did you land?</p>',
    '<p style="margin:0 0 6px">' + keuzes.map(function (k) {
      return '<a href="' + ontsnap(k.url) + '" style="display:inline-block;'
        + 'border:1.5px solid #13352A;border-radius:99px;padding:9px 16px;'
        + 'margin:0 6px 8px 0;text-decoration:none;color:#13352A;font-weight:600">'
        + ontsnap(k.knop) + '</a>';
    }).join('') + '</p>',
    '<p>' + slot + '</p>',
    '<p>Best,<br>' + ontsnap(AFZENDERNAAM) + '<br><a href="mailto:' + ontsnap(ONTVANGER)
      + '" style="' + MAIL_LINK + '">' + ontsnap(ONTVANGER) + '</a></p>',
    '<p style="' + MAIL_KLEIN + '"><a href="' + ontsnap(afmeldLink(regel.ref))
      + '" style="' + MAIL_KLEIN + '">No more mails about this conversation</a></p>',
    '</div>'].join('');

  MailApp.sendEmail({
    to: regel.email,
    subject: 'Did anything come of it?',
    name: AFZENDERNAAM,
    replyTo: ONTVANGER,
    body: tekst,
    htmlBody: html,
  });
  opvolgingSchrijf(regel, 'Maandmail op', opvolgingNu());
}

/* ---- wat Google elk kwartier doet ------------------------------------
   Kijkt of er een gesprek is afgelopen waar wij nog geen mail over hebben
   gehad. Buiten de spreekuren is er niets te doen en stopt dit meteen.
   ------------------------------------------------------------------- */
function opvolgingKwartier() {
  const agenda = gesprekAgenda();
  if (!agenda) return;
  const nu = opvolgingNu();
  const grens = new Date(nu.getTime() - OPVOLGING_NA_MINUTEN * 60000);
  const afgelopen = agenda.getEvents(new Date(nu.getTime() - 24 * 3600000), nu)
    .filter(function (e) {
      return e.getTag(GESPREK_LABEL) === 'gesprek' && e.getEndTime() <= grens;
    });
  if (!afgelopen.length) return;

  const start = opvolgingStartMoment();
  metSlot(function () {
    afgelopen.forEach(function (e) {
      if (start && e.getEndTime() < start) return;          // van vóór het aanzetten
      const regel = opvolgingZoek(e.getTag('ref'));
      if (!regel || regel.teammailOp) return;
      if (opvolgingSlaOver(regel)) return;
      stuurTeamMail(regel);
    });
  });
}

/* ---- en wat Google elke ochtend om 09:00 doet ------------------------ */
function opvolgingDagelijks() {
  metSlot(function () {
    opvolgingRegels().forEach(function (regel) {
      if (!regel.ref || opvolgingSlaOver(regel)) return;
      // Afgezegd? Dan stopt alles. Verplaatst? Dan tellen we vanaf de nieuwe datum.
      if (!gesprekInAgenda(regel)) return;
      const dagen = dagenGeleden(regel.gesprekOp);
      if (dagen === null || dagen < 0) return;

      // 1. herinnering aan ons
      if (!regel.vastgelegdOp && !regel.herinnerdOp && regel.teammailOp
        && dagen >= OPVOLGING_HERINNERING) {
        stuurHerinnering(regel);
        return;
      }
      // 2. de student: zodra wij hebben ingevuld, of uiterlijk na vier dagen
      if (!regel.nagevraagdOp && (regel.vastgelegdOp || dagen >= OPVOLGING_UITERLIJK)) {
        stuurCijferMail(regel);
        return;
      }
      // 3. en een maand later: wat is het geworden?
      if (regel.nagevraagdOp && !regel.maandmailOp && dagen >= OPVOLGING_MAAND) {
        stuurMaandMail(regel);
      }
    });
  });
}

/* ---- de pagina's achter de knoppen ----------------------------------- */

/* Onze eigen pagina: welke programma's heb je aangeraden?
   Boven de alumni staan de vijf die het beste bij de vraag passen, met de
   reden erbij. Ben je het daar niet mee eens, dan staat de hele lijst er
   onder; het zoekveld bovenaan zoekt in allebei. */
function opvolgingTeamPagina(token) {
  const p = leesToken(token, 'gteam');
  if (!p) return loketPagina('Deze link werkt niet meer',
    'Vul het bij de hand in de sheet in, in de kolom "Aangeraden programma\'s".');
  const regel = opvolgingZoek(p.ref);
  if (!regel) return loketPagina('Die aanvraag kan ik niet vinden',
    'Kijk even in de sheet; misschien is de regel verwijderd.');

  const gekozen = regel.programmas.split(/\s*[;,]\s*/).filter(String);
  const lijst = programmaKeuzes().map(function (groep) {
    const items = groep.items.map(function (p) {
      const aan = gekozen.indexOf(p.naam) !== -1 ? ' checked' : '';
      return '<label class="keuze"><input type="checkbox" name="programma" value="'
        + ontsnap(p.naam) + '"' + aan + '> ' + ontsnap(p.naam) + '</label>';
    }).join('');
    return '<h2>' + ontsnap(groep.naam) + '</h2><div class="groep">' + items + '</div>';
  }).join('');

  // Alumni: hier staan de namen wel, want dit is onze eigen pagina. In de mail
  // aan de student staan ze niet; die vraagt zelf een introductie aan.
  const alGekozen = deelLijst(regel.alumni);
  const gesorteerd = alumniVoorstellen(regel, 0);
  const vinkje = function (v, metReden) {
    const aan = alGekozen.indexOf(v.a.id) !== -1 ? ' checked' : '';
    const reden = alumniReden(v);
    return '<label class="keuze"><input type="checkbox" name="alumnus" value="'
      + ontsnap(v.a.id) + '"' + aan + '> <strong>' + ontsnap(v.a.naam) + '</strong> — '
      + ontsnap(alumniTeaser(v.a))
      + (metReden ? '<br><span class="reden">' + ontsnap(reden) + '</span>' : '')
      + '</label>';
  };
  const voorstellen = gesorteerd.slice(0, 5).map(function (v) { return vinkje(v, true); }).join('');
  const overige = gesorteerd.slice(5);
  const rest = overige.length
    ? '<details id="rest"><summary>Liever iemand anders? Alle ' + overige.length
      + ' andere alumni</summary><div class="groep">'
      + overige.map(function (v) { return vinkje(v, false); }).join('')
      + '</div></details>'
    : '';

  return loketPagina('Wat heb je ' + ontsnap(voornaam(regel.naam)) + ' aangeraden?',
    'Vink aan wat je hebt genoemd. Zodra je opslaat, krijgt '
      + ontsnap(voornaam(regel.naam)) + ' de vraag hoe het gesprek was.',
    '<input id="zoek" placeholder="Zoeken in programma\'s en alumni…" oninput="filter(this.value)">'
    + '<form method="post" action="' + webAdres() + '">'
    + '<input type="hidden" name="formulier" value="gesprekteam">'
    + '<input type="hidden" name="token" value="' + ontsnap(token) + '">'
    + '<div id="lijst">' + lijst + '</div>'
    + '<label class="los">Iets anders (een stage, een persoon, een tip)</label>'
    + '<textarea name="anders" rows="2">' + ontsnap(regel.extra) + '</textarea>'
    + (voorstellen
      ? '<div id="alumni"><h2>Alumni die zouden passen</h2>'
        + '<p class="uitleg">In de mail staat geen naam. De student ziet alleen de '
        + 'studie en de huidige rol, met een knop om een introductie aan te vragen. '
        + 'Die aanvraag komt bij ons langs zoals altijd. Je mag er meerdere aanvinken.</p>'
        + voorstellen + rest + '</div>'
      : '')
    + '<button type="submit">Opslaan</button></form>'
    + '<style>#zoek{font:inherit;width:100%;box-sizing:border-box;padding:11px 13px;'
    + 'border:1px solid #E2DAC7;border-radius:9px;margin-bottom:14px}'
    + 'h2{font:600 13px/1.4 system-ui;text-transform:uppercase;letter-spacing:.5px;'
    + 'color:#7a7468;margin:16px 0 6px}.keuze{display:block;padding:5px 0;font-size:15px}'
    + '.los{display:block;font-weight:600;margin:16px 0 6px}'
    + '.reden{color:#7a7468;font-size:12.5px}'
    + 'summary{cursor:pointer;color:#13352A;font-size:14px;margin:10px 0 4px}'
    + '.uitleg{font-size:13px;color:#4B5044;margin:0 0 10px}</style>'
    + '<script>function filter(q){q=q.toLowerCase();'
    + 'document.querySelectorAll("#lijst .keuze,#alumni .keuze").forEach(function(l){'
    + 'l.style.display=l.textContent.toLowerCase().indexOf(q)===-1?"none":"block";});'
    + 'document.querySelectorAll("#lijst h2").forEach(function(h){var g=h.nextElementSibling;'
    + 'h.style.display=g.querySelector(".keuze:not([style*=none])")?"block":"none";});'
    // Zoeken terwijl de rest dichtgeklapt is, zou treffers verstoppen.
    + 'var r=document.getElementById("rest");if(r)r.open=q.length>0;}</script>');
}

/* De programma's uit de programmasheet, per tabblad, met de korte zin en het
   adres erbij. Dat is dezelfde sheet die de website uitleest, dus een nieuw
   programma staat hier vanzelf bij, en de zin in de mail is dezelfde zin die
   jullie daar al hebben geschreven. */
function programmaKeuzes() {
  try {
    const bestand = SpreadsheetApp.openById(PROGRAMMA_BESTAND_ID);
    return bestand.getSheets().map(function (blad) {
      const laatsteRij = blad.getLastRow();
      const laatsteKolom = blad.getLastColumn();
      if (laatsteRij < 2 || laatsteKolom < 1) return null;
      const alles = blad.getRange(1, 1, laatsteRij, laatsteKolom).getValues();
      const kop = alles[0].map(function (v) { return String(v).trim().toLowerCase(); });
      const vind = function (begin) {
        for (let i = 0; i < kop.length; i++) if (kop[i].indexOf(begin) === 0) return i;
        return -1;
      };
      const kNaam = vind('programme name');
      // De programmasheet heeft (nog) geen kolom one-liner; dan pakken we de
      // beschrijving. In de mail korten we die in tot één regel.
      let kZin = vind('one-liner');
      if (kZin === -1) kZin = vind('description');
      const kUrl = vind('url');
      if (kNaam === -1) return null;

      const items = [];
      for (let i = 1; i < alles.length; i++) {
        const naam = String(alles[i][kNaam] || '').trim();
        if (!naam) continue;
        const adres = kUrl === -1 ? '' : String(alles[i][kUrl] || '').match(/https?:\/\/[^\s"'<>]+/);
        items.push({
          naam: naam,
          zin: kZin === -1 ? '' : String(alles[i][kZin] || '').trim(),
          url: adres ? adres[0] : '',
        });
      }
      return items.length ? { naam: blad.getName(), items: items } : null;
    }).filter(Boolean);
  } catch (err) {
    console.error(err);
    return [];
  }
}

/* Naam → zin en adres, om de mail mee te vullen. */
function programmaDetails() {
  const uit = {};
  programmaKeuzes().forEach(function (groep) {
    groep.items.forEach(function (p) { uit[p.naam] = p; });
  });
  return uit;
}

/* ---- welke alumni zouden passen -------------------------------------
   Dezelfde rekensom als het alumniloket: drie punten per gedeeld thema, en
   een punt als iemand nog ruimte heeft. Alumni die vol zitten of geen
   toestemming gaven doen niet mee; die laatste staan al niet in de lijst.

   Dit is een voorstel, geen besluit. Namen gaan pas de deur uit als een
   student zelf een introductie aanvraagt en jullie die goedkeuren; in de mail
   staat alleen wat er ook op de site staat, zonder naam.
   ------------------------------------------------------------------- */
function alumniVoorstellen(regel, hoeveel) {
  const vraag = [regel.themas, regel.zoekt, regel.notities].filter(String).join(' ');
  const themas = groepeerThemas(vraag);
  return leesAlumni()
    .filter(function (a) { return !a.test && !a.ruimte.vol; })
    .map(function (a) {
      const gedeeld = a.themas.filter(function (t) { return themas.indexOf(t) !== -1; });
      let punten = gedeeld.length * 3;
      if (a.ruimte.onbeperkt || a.ruimte.over > 1) punten += 1;
      return { a: a, punten: punten, gedeeld: gedeeld };
    })
    .sort(function (x, y) { return y.punten - x.punten; })
    .slice(0, hoeveel === 0 ? undefined : (hoeveel || 5));
}

/* Hoe een alumnus in de mail staat: zonder naam, net als op de site. */
function alumniTeaser(a) {
  const opleiding = [a.msc, a.bsc].filter(function (x) { return x && x !== '—'; }).join(' · ');
  return [opleiding, a.werk].filter(String).join(', now ') || 'An alumnus from our network';
}

/* Opslaan van wat wij hebben aangevinkt, en meteen de student mailen. */
/* Het vastleggen zelf. Zowel onze pagina op de site als de oude pagina op
   Google komen hier uit, zodat er maar één plek is die in de sheet schrijft
   en bepaalt of de student zijn mail nu krijgt. */
function opvolgingTeamVastleggen(regel, gekozen, anders, alumni) {
  let gemaild = false;
  let alEerder = false;
  metSlot(function () {
    opvolgingSchrijf(regel, 'Aangeraden programma\'s', gekozen.join('; '));
    opvolgingSchrijf(regel, 'Extra tip', anders);
    opvolgingSchrijf(regel, 'Voorgestelde alumni', alumni.join('; '));
    opvolgingSchrijf(regel, 'Vastgelegd op', opvolgingNu());
    const vers = opvolgingZoek(regel.ref);
    if (!vers || opvolgingSlaOver(vers)) return;
    if (vers.nagevraagdOp) { alEerder = true; return; }
    if (magStudentNuMailen()) {
      stuurCijferMail(vers);
      gemaild = true;
    }
  });
  return { gemaild: gemaild, alEerder: alEerder };
}

/* Waarom iemand wordt voorgesteld, in één regel. */
function alumniReden(v) {
  return [
    v.gedeeld.length ? v.gedeeld.length + ' gedeeld thema' + (v.gedeeld.length === 1 ? '' : "'s")
      + ' (' + v.gedeeld.join(', ') + ')' : 'geen gedeeld thema',
    v.a.ruimte.onbeperkt ? 'onbeperkt beschikbaar' : 'nog ' + v.a.ruimte.over + ' plek'
      + (v.a.ruimte.over === 1 ? '' : 'ken') + ' deze ' + v.a.ruimte.periode,
  ].join(' · ');
}

function opvolgingTeamOpslaan(parameter) {
  const p = leesToken(parameter.token, 'gteam');
  if (!p) return loketPagina('Deze link werkt niet meer', 'Vul het in de sheet in.');
  const regel = opvolgingZoek(p.ref);
  if (!regel) return loketPagina('Die aanvraag kan ik niet vinden', 'Kijk even in de sheet.');

  // Meerdere vinkjes komen binnen als parameters met dezelfde naam.
  let gekozen = parameter.programma || [];
  if (!Array.isArray(gekozen)) gekozen = [gekozen];
  let alumni = parameter.alumnus || [];
  if (!Array.isArray(alumni)) alumni = [alumni];
  // De losse tip krijgt een eigen kolom. Stond hij tussen de programma's,
  // dan kwam hij in de mail als los programma in het rijtje te staan.
  const anders = tekstOf(parameter.anders, '');

  const uit = opvolgingTeamVastleggen(regel, gekozen, anders, alumni);

  const naam = ontsnap(voornaam(regel.naam));
  const wat = gekozen.length
    ? 'Vastgelegd: ' + ontsnap(gekozen.join('; ')) + '. '
    : (anders ? 'Vastgelegd. ' : 'Niets aangeraden, ook goed. ');
  const hoe = uit.alEerder
    ? naam + ' heeft de mail al gehad, dus die gaat niet nog een keer de deur uit.'
    : uit.gemaild
      ? 'De mail is onderweg naar ' + naam + '.'
      : 'Het is nu buiten mailtijd, dus ' + naam + ' krijgt de mail morgenochtend om 09:00.';
  return loketPagina('Opgeslagen', wat + hoe);
}

/* ---- de knoppen uit de mails, afgehandeld vanaf onze eigen site -------
   De student klikt op impactconnectutrecht.com/feedback.html, en die pagina
   stuurt het hierheen, net zoals de formulieren op de site dat doen. Daarom
   geven we hier gegevens terug en geen pagina.

   Waarom niet gewoon een pagina op script.google.com, zoals eerst? Google
   stuurt zo'n adres door naar het Google-account waarmee de bezoeker toevallig
   is ingelogd (.../macros/u/4/s/...). Kent dat account dit script niet, dan
   krijgt hij "Kan het bestand momenteel niet openen" te zien en is zijn cijfer
   weg. Op onze eigen site speelt dat niet.

   De pagina's hieronder (opvolgingCijferPagina en de rest) blijven bestaan
   voor de mails die al verstuurd waren.
   ------------------------------------------------------------------- */
function opvolgingWeb(d) {
  const stap = String(d.stap || '');
  const soort = (stap === 'teamlezen' || stap === 'teamopslaan') ? 'gteam'
    : (stap === 'uitkomst' || stap === 'uitkomsttekst') ? 'guitkomst'
    : stap === 'stop' ? 'gstop' : 'gcijfer';
  const p = leesToken(d.token, soort);
  if (!p) return antwoord({ ok: false, reden: 'link' });
  const regel = opvolgingZoek(p.ref);
  if (!regel) return antwoord({ ok: false, reden: 'onbekend' });

  // ---- ons eigen formulier: wat heb je aangeraden? ----
  if (stap === 'teamlezen') {
    const maak = function (v) {
      return { id: v.a.id, naam: v.a.naam, teaser: alumniTeaser(v.a), reden: alumniReden(v) };
    };
    const gesorteerd = alumniVoorstellen(regel, 0);
    return antwoord({
      ok: true,
      naam: voornaam(regel.naam),
      groepen: programmaKeuzes().map(function (g) {
        return { naam: g.naam, items: g.items.map(function (x) { return x.naam; }) };
      }),
      gekozen: deelLijst(regel.programmas),
      extra: regel.extra,
      voorstellen: gesorteerd.slice(0, 5).map(maak),
      overige: gesorteerd.slice(5).map(maak),
      alumniGekozen: deelLijst(regel.alumni),
    });
  }

  if (stap === 'teamopslaan') {
    const lijstje = function (w) { return Array.isArray(w) ? w.map(String) : (w ? [String(w)] : []); };
    const gekozen = lijstje(d.programma);
    const anders = tekstOf(d.anders, '');
    const uit = opvolgingTeamVastleggen(regel, gekozen, anders, lijstje(d.alumnus));
    return antwoord({
      ok: true,
      naam: voornaam(regel.naam),
      vastgelegd: gekozen.join('; '),
      tip: !!anders,
      gemaild: uit.gemaild,
      alEerder: uit.alEerder,
    });
  }

  if (stap === 'cijfer') {
    const cijfer = Math.max(1, Math.min(CIJFER_MAX, parseInt(p.keuze, 10) || 0));
    metSlot(function () {
      opvolgingSchrijf(regel, 'Cijfer', cijfer);
      opvolgingSchrijf(regel, 'Beantwoord op', opvolgingNu());
    });
    if (cijfer <= CIJFER_LAAG) meldLaagCijfer(regel, cijfer);
    return antwoord({ ok: true, cijfer: cijfer, max: CIJFER_MAX, vervolgen: VERVOLGEN });
  }

  if (stap === 'vervolg') {
    const keuze = tekstOf(d.vervolg, '');
    const tekst = tekstOf(d.tekst, '');
    metSlot(function () {
      if (keuze) opvolgingSchrijf(regel, 'Vervolg', vervolgTekst(keuze));
      if (tekst) opvolgingSchrijf(regel, 'Toelichting', tekst);
    });
    return antwoord({ ok: true, iets: !!(keuze || tekst) });
  }

  if (stap === 'uitkomst') {
    const keuze = UITKOMSTEN.filter(function (u) { return u.id === p.keuze; })[0];
    metSlot(function () {
      opvolgingSchrijf(regel, 'Uitkomst', keuze ? keuze.knop : String(p.keuze));
      opvolgingSchrijf(regel, 'Uitkomst op', opvolgingNu());
    });
    return antwoord({ ok: true, knop: keuze ? keuze.knop : '' });
  }

  if (stap === 'uitkomsttekst') {
    const tekst = tekstOf(d.tekst, '');
    if (tekst) metSlot(function () { opvolgingSchrijf(regel, 'Uitkomst toelichting', tekst); });
    return antwoord({ ok: true });
  }

  if (stap === 'stop') {
    metSlot(function () { opvolgingSchrijf(regel, 'Geen mail meer', opvolgingNu()); });
    return antwoord({ ok: true });
  }

  return antwoord({ ok: false, reden: 'stap' });
}

/* Het cijfer van de student. De klik in de mail legt het cijfer meteen vast;
   daarna staat alles op één pagina. Je kiest wat je ermee gaat doen en typt
   erbij wat je van plan bent, en pas op Send gaat het weg. Eerder sloot een
   klik op zo'n keuze de pagina meteen af, en dan hadden we wel een vinkje
   maar geen enkel woord. */
function opvolgingCijferPagina(token) {
  const p = leesToken(token, 'gcijfer');
  if (!p) return loketPagina('This link no longer works',
    'Just reply to our mail instead, we read everything.');
  const regel = opvolgingZoek(p.ref);
  if (!regel) return loketPagina('We can\'t find that conversation',
    'Reply to our mail and we\'ll sort it out.');

  const cijfer = Math.max(1, Math.min(CIJFER_MAX, parseInt(p.keuze, 10) || 0));
  metSlot(function () {
    opvolgingSchrijf(regel, 'Cijfer', cijfer);
    opvolgingSchrijf(regel, 'Beantwoord op', opvolgingNu());
  });
  if (cijfer <= CIJFER_LAAG) meldLaagCijfer(regel, cijfer);

  const keuzes = VERVOLGEN.map(function (v) {
    return '<label class="keuze"><input type="radio" name="vervolg" value="'
      + ontsnap(v.id) + '"><span>' + ontsnap(v.knop) + '</span></label>';
  }).join('');

  return loketPagina('Thanks, you gave it a ' + cijfer + ' out of ' + CIJFER_MAX,
    'One more thing: are you going to do something with what we discussed?',
    '<form method="post" action="' + webAdres() + '">'
    + '<input type="hidden" name="formulier" value="gesprekcijfer">'
    + '<input type="hidden" name="token" value="' + ontsnap(token) + '">'
    + '<div class="keuzes">' + keuzes + '</div>'
    + '<label class="los">What are you planning to do next? And is there anything '
    + 'we should do differently?</label>'
    + '<textarea name="tekst" rows="4"></textarea>'
    + '<button type="submit">Send</button></form>'
    + '<style>.keuzes{margin:0 0 22px}'
    + '.keuze{display:inline-block;margin:0 8px 8px 0;cursor:pointer}'
    + '.keuze input{position:absolute;opacity:0;width:0;height:0}'
    + '.keuze span{display:inline-block;border:1.5px solid #13352A;border-radius:99px;'
    + 'padding:9px 16px;font-size:14px;color:#13352A}'
    + '.keuze input:checked+span{background:#13352A;color:#F4EFE3}'
    + '.keuze input:focus+span{box-shadow:0 0 0 3px rgba(43,107,79,.25)}'
    + '.los{display:block;font-weight:600;margin:0 0 6px}</style>');
}

/* De losse knoppen uit mails van vóór deze pagina. Die blijven werken. */
function opvolgingVervolgPagina(token) {
  const p = leesToken(token, 'gvervolg');
  if (!p) return loketPagina('This link no longer works', 'Just reply to our mail instead.');
  const regel = opvolgingZoek(p.ref);
  if (!regel) return loketPagina('We can\'t find that conversation', 'Reply to our mail.');
  metSlot(function () { opvolgingSchrijf(regel, 'Vervolg', vervolgTekst(p.keuze)); });
  return loketPagina('Noted', 'Thanks, that helps us a lot. You can close this window.');
}

function vervolgTekst(id) {
  const gevonden = VERVOLGEN.filter(function (v) { return v.id === id; })[0];
  return gevonden ? gevonden.knop : String(id || '');
}

function opvolgingTekstOpslaan(parameter) {
  const p = leesToken(parameter.token, 'gcijfer');
  if (!p) return loketPagina('This link no longer works', 'Just reply to our mail instead.');
  const regel = opvolgingZoek(p.ref);
  if (!regel) return loketPagina('We can\'t find that conversation', 'Reply to our mail.');

  const keuze = tekstOf(parameter.vervolg, '');
  const tekst = tekstOf(parameter.tekst, '');
  metSlot(function () {
    if (keuze) opvolgingSchrijf(regel, 'Vervolg', vervolgTekst(keuze));
    if (tekst) opvolgingSchrijf(regel, 'Toelichting', tekst);
  });

  return loketPagina('Thank you', keuze || tekst
    ? 'We\'ve got it. This is exactly what we use to make the next conversation better.'
    : 'Your score is in. You can close this window.');
}

/* De maandmail: wat is het geworden? */
function opvolgingUitkomstPagina(token) {
  const p = leesToken(token, 'guitkomst');
  if (!p) return loketPagina('This link no longer works', 'Just reply to our mail instead.');
  const regel = opvolgingZoek(p.ref);
  if (!regel) return loketPagina('We can\'t find that conversation', 'Reply to our mail.');

  const keuze = UITKOMSTEN.filter(function (u) { return u.id === p.keuze; })[0];
  metSlot(function () {
    opvolgingSchrijf(regel, 'Uitkomst', keuze ? keuze.knop : String(p.keuze));
    opvolgingSchrijf(regel, 'Uitkomst op', opvolgingNu());
  });

  return loketPagina('Thanks for letting us know',
    'Tell us a bit more if you like: which programme or place, and how it is going?',
    '<form method="post" action="' + webAdres() + '">'
    + '<input type="hidden" name="formulier" value="gesprekuitkomst">'
    + '<input type="hidden" name="token" value="' + ontsnap(token) + '">'
    + '<textarea name="tekst" rows="3"></textarea>'
    + '<button type="submit">Send</button></form>');
}

function opvolgingUitkomstOpslaan(parameter) {
  const p = leesToken(parameter.token, 'guitkomst');
  if (!p) return loketPagina('This link no longer works', 'Just reply to our mail instead.');
  const regel = opvolgingZoek(p.ref);
  if (!regel) return loketPagina('We can\'t find that conversation', 'Reply to our mail.');
  const tekst = tekstOf(parameter.tekst, '');
  if (tekst) metSlot(function () { opvolgingSchrijf(regel, 'Uitkomst toelichting', tekst); });
  return loketPagina('Thank you', 'That\'s all we needed. You can close this window.');
}

/* Afmelden: dan houdt het op voor dit gesprek. */
function opvolgingStopPagina(token) {
  const p = leesToken(token, 'gstop');
  if (!p) return loketPagina('This link no longer works', 'Just reply to our mail instead.');
  const regel = opvolgingZoek(p.ref);
  if (!regel) return loketPagina('We can\'t find that conversation', 'Reply to our mail.');
  metSlot(function () { opvolgingSchrijf(regel, 'Geen mail meer', opvolgingNu()); });
  return loketPagina('Done', 'You won\'t hear from us about this conversation again.');
}

/* Een laag cijfer willen we meteen weten, niet pas bij het doornemen van de
   sheet. Dan kun je dezelfde dag nog iets rechtzetten. */
function meldLaagCijfer(regel, cijfer) {
  try {
    MailApp.sendEmail({
      to: ONTVANGER,
      subject: 'Let op: ' + tekstOf(regel.naam, 'een student') + ' gaf een ' + cijfer,
      name: 'Website ' + AFZENDERNAAM,
      replyTo: regel.email || ONTVANGER,
      body: [tekstOf(regel.naam, 'Een student') + ' (' + regel.email + ') gaf het gesprek'
        + ' een ' + cijfer + ' van ' + CIJFER_MAX + '.',
        '', 'Misschien goed om zelf even contact op te nemen. Druk op Beantwoorden.',
      ].join('\n'),
    });
  } catch (err) { console.error(err); }
}

/* ---- aan- en uitzetten ----------------------------------------------
   Draai zetOpvolgingAan() één keer in de editor. Vanaf dat moment krijgen
   alleen gesprekken die dáárna zijn afgelopen een mail, zodat niemand met
   terugwerkende kracht post krijgt over een gesprek van weken geleden.
   ------------------------------------------------------------------- */
function zetOpvolgingAan() {
  zetOpvolgingUit();
  ScriptApp.newTrigger('opvolgingKwartier').timeBased().everyMinutes(15).create();
  ScriptApp.newTrigger('opvolgingDagelijks').timeBased().atHour(OPVOLGING_STIL_TOT).everyDays(1).create();
  PropertiesService.getScriptProperties().setProperty('opvolgingStart', String(Date.now()));
  console.log('Opvolging staat aan. Gesprekken die vanaf nu aflopen krijgen de keten:'
    + ' onze mail na ' + OPVOLGING_NA_MINUTEN + ' minuten, daarna de student.');
}

function zetOpvolgingUit() {
  const oud = ScriptApp.getProjectTriggers().filter(function (t) {
    return t.getHandlerFunction() === 'opvolgingKwartier'
      || t.getHandlerFunction() === 'opvolgingDagelijks';
  });
  oud.forEach(function (t) { ScriptApp.deleteTrigger(t); });
  if (oud.length) console.log(oud.length + ' bestaande trigger(s) verwijderd.');
}

function opvolgingStartMoment() {
  const v = PropertiesService.getScriptProperties().getProperty('opvolgingStart');
  return v ? new Date(Number(v)) : null;
}

/* ---- meekijken zonder te versturen ----------------------------------- */
function opvolgingOverzicht() {
  const start = opvolgingStartMoment();
  console.log(start ? 'Opvolging staat aan sinds ' + opvolgingDatumTekst(start)
    : 'Opvolging staat UIT. Draai zetOpvolgingAan() om hem aan te zetten.');
  const regels = opvolgingRegels().filter(function (r) { return r.ref; });
  console.log(regels.length + ' gesprek(ken) met een kenmerk in de sheet.');
  regels.forEach(function (r) {
    const dagen = dagenGeleden(r.gesprekOp);
    const wacht = !r.teammailOp ? 'wacht op onze mail'
      : !r.vastgelegdOp ? 'wacht op invullen door ons'
      : !r.nagevraagdOp ? 'wacht op de cijfervraag'
      : !r.cijfer ? 'cijfervraag verstuurd, nog geen antwoord'
      : !r.maandmailOp ? 'cijfer ' + r.cijfer + ', maandmail volgt'
      : 'klaar' + (r.uitkomstOp ? '' : ', wacht op de uitkomst');
    console.log('  ' + r.ref + '  ' + (dagen === null ? '?' : Math.floor(dagen) + ' dgn')
      + '  ' + r.naam + '  → ' + wacht + (opvolgingSlaOver(r) ? '  (overgeslagen)' : ''));
  });
}
