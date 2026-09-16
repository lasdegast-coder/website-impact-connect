/* ===================================================================
   Formulierverwerking Impact Connect
   Draait in Google Apps Script, gekoppeld aan één Google Sheet.

   De website heeft twee formulieren en ze komen allebei hier binnen:

     "afspraak"  het afspraakformulier (de knop "Plan an appointment",
                 die overal op de site staat)
     "alumnus"   het alumniverzoek op alumni.html

   Wat dit script per aanvraag doet, in deze volgorde:
     1. schrijft de aanvraag weg in een tabblad, een per formulier. Dit
        gaat eerst, want dit is het vaste bewijs dat de aanvraag er is.
        Gaat er daarna iets mis met het mailen, dan staat hij er nog
     2. mailt de aanvraag naar ons, met antwoordadres op de student,
        zodat je meteen op "Beantwoorden" kunt drukken
     3. mailt de student een bevestiging met wat hij heeft ingevuld

   Kiest de student bij een afspraak een tijdslot, dan zet het script het
   gesprek eerst in de agenda "Gesprekken". Dat staat in Gesprekken.gs.

   De tabbladen en de kolommen maakt het script zelf aan. Komt er later
   een vraag bij in een formulier, dan zet het script die kolom er vanzelf
   achter; je hoeft de sheet nooit met de hand bij te werken.

   Zie INSTRUCTIES.md voor het aansluiten.
   =================================================================== */

const ONTVANGER    = 'contact@impactconnectutrecht.com';
const AFZENDERNAAM = 'Impact Connect';

/* Hoeveel aanvragen we per dag verwerken. Het adres van dit script staat in
   de website en is dus voor iedereen te lezen; wie het kent kan het aanroepen.
   Zonder rem zou iemand er duizend nepaanvragen doorheen kunnen jagen, en dan
   staat je inbox vol en is je dagelijkse mailquotum bij Google op.

   60 is ruim: dat zijn zestig ingevulde formulieren op één dag. Word je toch
   een keer geraakt, dan valt de website automatisch terug op het
   mailprogramma van de student, dus zijn aanvraag komt alsnog binnen. */
const MAX_PER_DAG = 60;

/* Per formulier: het tabblad, het onderwerp van onze mail, en de tekst
   die de student in zijn bevestiging leest. */
const FORMULIEREN = {
  afspraak: {
    tabblad: 'aanvragen voor gesprekken',
    tabbladId: 1236646472,
    onzeTitel: 'APPOINTMENT REQUEST',
    onderwerp: 'Appointment request',
    bevestiging: [
      'Thanks for reaching out. We\'ve got your request and one of us will get',
      'back to you, usually within a few days, to plan a short appointment.',
    ],
  },
  contact: {
    tabblad: 'Berichten',
    tabbladId: 0,                    // bestaat nog niet; wordt op naam aangemaakt
    onzeTitel: 'MESSAGE VIA THE WEBSITE',
    onderwerp: 'Message via the website',
    bevestiging: [
      'Thanks for writing. We\'ve got your message and one of us will get back',
      'to you, usually within a few days.',
    ],
  },
  alumnus: {
    tabblad: 'Alumni die we nog missen',
    tabbladId: 1891756643,
    onzeTitel: 'ALUMNUS WANTED',
    onderwerp: 'Alumni request',
    bevestiging: [
      'Thanks for reaching out. We\'ll go through our alumni list by hand and come',
      'back to you with a LinkedIn profile, plus a phone number if they have',
      'given us one. Send them a message first; a call comes later, only if you',
      'both want one.',
    ],
  },
};

/* De vragen per formulier, in de volgorde waarin ze op de site staan.
   sleutel = wat de website meestuurt, label = wat er in de mail en boven
   de kolom komt te staan. Voeg je een vraag toe aan een formulier, zet hem
   dan hier ook neer; dan komt hij vanzelf in de mail en in de sheet. */
const VRAGEN = {
  afspraak: [
    { sleutel: 'zoekt',     label: 'Looking for' },
    { sleutel: 'themas',    label: 'Themes' },
    { sleutel: 'niveau',    label: 'Experience level' },
    { sleutel: 'tijd',      label: 'Time they can commit' },
    { sleutel: 'betaald',   label: 'Paid or unpaid' },
    { sleutel: 'taal',      label: 'Language' },
    // Deze zet het script zelf (zie doPost), niet de browser.
    { sleutel: 'tijdslotTekst', label: 'Time slot' },
    { sleutel: 'notities',  label: 'Anything else' },
  ],
  contact: [
    { sleutel: 'soort',   label: 'Writing as' },
    { sleutel: 'studie',  label: 'Study / organisation' },
    { sleutel: 'bericht', label: 'Message' },
  ],
  alumnus: [
    { sleutel: 'vakgebied',   label: 'Field' },
    { sleutel: 'organisatie', label: 'Kind of organisation' },
    { sleutel: 'specifiek',   label: 'Specific role or organisation' },
    { sleutel: 'doel',        label: 'What they want out of it' },
  ],
};

/* Wordt aangeroepen als een formulier op de website wordt verstuurd. */
function doPost(e) {
  try {
    const d = lees(e);

    // Spamval: als er ooit een gewoon HTML-formulier aan gehangen wordt,
    // krijgt dat een onzichtbaar veld "website". Vult iets het in, dan is
    // het een bot. We doen alsof alles goed ging en gooien het weg.
    if (d.website) return antwoord({ ok: true });

    // Het alumniloket heeft zijn eigen afhandeling: drie kandidaten in
    // onze mail en ondertekende knoppen. Die staat in Loket.gs.
    if (d.formulier === 'loketverzoek') return loketVerzoek(d);

    // De bevestigingsknop uit die mail. Die verwacht een pagina terug,
    // geen JSON, want er kijkt een mens naar.
    if (d.formulier === 'loketbesluit') return loketBesluitUitvoeren(d);

    // Het tekstvak uit de navraagmail, drie weken na een introductie.
    if (d.formulier === 'loketfeedback') return loketFeedbackOpslaan(d);

    // hasOwnProperty en niet FORMULIEREN[...], want elk object in JavaScript
    // heeft van zichzelf al namen als "constructor" en "toString". Zonder
    // deze controle zou iemand die "constructor" meestuurt het script laten
    // struikelen op een formulier dat niet bestaat.
    const soort = Object.prototype.hasOwnProperty.call(FORMULIEREN, d.formulier)
      ? d.formulier : 'afspraak';

    // naam en adres op één regel: een regeleinde hoort niet in het onderwerp
    // van een mail thuis
    d.naam  = eenRegel(tekstOf(d.naam, ''));
    d.email = eenRegel(tekstOf(d.email, ''));
    if (!d.naam || !d.email) {
      return antwoord({ ok: false, fout: 'Naam en e-mailadres zijn verplicht.' });
    }
    if (!geldigMailadres(d.email)) {
      return antwoord({ ok: false, fout: 'Dat e-mailadres klopt niet.' });
    }

    // Het tijdslot zetten we zelf in de mail en de sheet, met of het echt in
    // de agenda staat. Wat de browser hier meestuurt telt niet.
    d.tijdslotTekst = '';
    let boeking = null;

    // De teller, de sheet en de agenda zijn alle drie "lezen, veranderen,
    // terugschrijven". Komen er twee aanvragen op precies hetzelfde moment
    // binnen, dan mogen die elkaar niet in de weg zitten: dan telt de rem
    // verkeerd, schrijven ze allebei een koprij, of krijgen twee studenten
    // hetzelfde tijdslot. Vandaar het slot.
    const uitkomst = metSlot(function () {
      if (!binnenDagLimiet()) return 'limiet';
      if (soort === 'afspraak' && d.tijdslot) {
        try {
          boeking = gesprekBoeken(d);
        } catch (err) {
          console.error(err);
          boeking = { status: 'mislukt', tekst: d.tijdslot, reden: 'fout bij het boeken' };
        }
        if (boeking.status === 'bezet') return 'bezet';
      }
      if (soort === 'afspraak' && Object.prototype.hasOwnProperty.call(d, 'tijdslot')) {
        d.tijdslotTekst = !boeking ? 'None of the times worked'
          : boeking.status === 'geboekt' ? boeking.tekst + ' (in de agenda)'
          : boeking.tekst + ' (NIET in de agenda: ' + boeking.reden + ')';
      }
      schrijfInBlad(soort, d);
      return 'ok';
    });
    if (uitkomst === 'limiet') return antwoord({ ok: false, fout: 'Te veel aanvragen vandaag.' });
    // Net door iemand anders gekozen: de site laat de student een ander
    // tijdstip kiezen, met de nieuwe stand erbij.
    if (uitkomst === 'bezet') return antwoord({ ok: false, fout: 'bezet', tijden: gesprekTijden() });

    mailNaarOns(soort, d);

    // De bevestiging aan de student is het minst belangrijke van de drie.
    // Gaat die mis, dan staat de aanvraag al in de sheet en ligt hij al bij
    // ons in de mail; dan hoort de student niet alsnog "er ging iets mis" te
    // zien en zijn aanvraag voor de tweede keer te versturen.
    const geboekt = !!(boeking && boeking.status === 'geboekt');
    try {
      // In de mail aan de student staat het gesprek bovenaan; de regel met
      // "(in de agenda)" is voor ons.
      d.tijdslotTekst = '';
      mailNaarStudent(soort, d, geboekt ? [
        'Thanks for reaching out. Your conversation is booked:',
        '',
        '    ' + boeking.tekst,
        '    ' + GESPREK_PLEK,
        '',
        'A calendar invitation is on its way in a separate email. Can\'t make it',
        'after all? Just reply to this mail and we\'ll find another time.',
      ] : null);
    } catch (err) { console.error(err); }

    return antwoord({ ok: true, geboekt: geboekt });
  } catch (err) {
    // De echte fout blijft in het logboek van Apps Script staan (Uitvoeringen).
    // Naar buiten gaat alleen dat het misging: de bezoeker heeft niets aan de
    // details, en een buitenstaander hoeft niet te zien hoe dit werkt.
    console.error(err);
    return antwoord({ ok: false, fout: 'Er ging iets mis bij het verwerken.' });
  }
}

/* Wordt aangeroepen als iemand het adres van dit script in een browser
   opent, en door de website als die de alumnilijst ophaalt. */
function doGet(e) {
  const p = (e && e.parameter) || {};

  // De alumnilijst voor op de site. Alleen wie toestemming gaf, en alleen
  // de velden die een student mag zien; zie openbareLijst() in Loket.gs.
  if (p.lijst === 'alumni') {
    // ?test=1 laat ook de testprofielen zien. Die staan niet in de gewone
    // lijst, zodat je de hele keten kunt uitproberen zonder dat studenten
    // een nepprofiel te zien krijgen.
    return ContentService.createTextOutput(alumniJson(p.test === '1', p.vers === '1'))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // De vrije tijdsloten voor een gesprek; zie Gesprekken.gs.
  if (p.lijst === 'tijden') return antwoord(gesprekTijden());

  // De pagina achter een knop uit onze eigen mail. Hij toont alleen wat er
  // gaat gebeuren; pas de knop op die pagina voert het uit.
  if (p.besluit) return loketBesluitPagina(p.besluit);

  // Een cijfer uit de navraagmail. Het cijfer wordt meteen bewaard; de
  // pagina vraagt daarna nog om een toelichting.
  if (p.feedback) return loketFeedbackPagina(p.feedback);

  return antwoord({ ok: true, bericht: 'Formulierverwerking Impact Connect staat klaar.' });
}

/* ---- de dagrem ----------------------------------------------------
   Houdt bij hoeveel aanvragen er vandaag verwerkt zijn. De teller staat bij
   het script zelf, niet in de sheet, en begint elke dag opnieuw. Wil je hem
   met de hand op nul zetten: Project-instellingen → Scripteigenschappen →
   de regel "teller" verwijderen.
   ------------------------------------------------------------------- */
function binnenDagLimiet() {
  const winkel = PropertiesService.getScriptProperties();
  const vandaag = Utilities.formatDate(new Date(), 'Europe/Amsterdam', 'yyyy-MM-dd');

  let staat = {};
  try { staat = JSON.parse(winkel.getProperty('teller') || '{}'); } catch (e) { staat = {}; }
  if (staat.dag !== vandaag) staat = { dag: vandaag, aantal: 0 };

  if (staat.aantal >= MAX_PER_DAG) return false;
  staat.aantal += 1;
  winkel.setProperty('teller', JSON.stringify(staat));
  return true;
}

/* ---- inlezen ------------------------------------------------------ */
/* Accepteert zowel een JSON-bericht als een gewone formulierverzending. */
function lees(e) {
  if (e && e.postData && e.postData.contents) {
    try { return JSON.parse(e.postData.contents); } catch (err) { /* dan hieronder */ }
  }
  return (e && e.parameter) || {};
}

/* Eén cel in Google Sheets kan niet meer dan 50.000 tekens hebben, en dan
   mislukt de hele regel. Wie een heel proefschrift in een tekstvak plakt
   krijgt hem dus afgekapt in plaats van dat zijn aanvraag verdwijnt. */
const MAX_TEKENS = 5000;

function tekstOf(waarde, alsLeeg) {
  if (Array.isArray(waarde)) waarde = waarde.join(', ');
  let s = (waarde === undefined || waarde === null) ? '' : String(waarde).trim();
  if (s.length > MAX_TEKENS) s = s.slice(0, MAX_TEKENS) + ' […hier afgekapt]';
  return s || alsLeeg;
}

/* Alles op één regel. Voor het onderwerp van een mail en voor het adres. */
function eenRegel(s) {
  return String(s).replace(/[\r\n\t]+/g, ' ').trim();
}

/* Eén gewoon mailadres, verder niets. Een komma of een puntkomma zou
   betekenen dat de bevestiging naar meerdere adressen tegelijk gaat, en dat
   is precies wat iemand zou proberen die dit script wil misbruiken om vanaf
   jullie account post rond te sturen. */
function geldigMailadres(s) {
  return /^[^\s@,;<>"]+@[^\s@,;<>"]+\.[A-Za-z]{2,}$/.test(s);
}

/* Voert iets uit met de zekerheid dat er niets anders tegelijk draait.
   Lukt het slot niet binnen 20 seconden, dan gooit waitLock een fout en
   vangt doPost hem op; de website valt dan terug op het mailprogramma. */
function metSlot(werk) {
  const slot = LockService.getScriptLock();
  slot.waitLock(20000);
  try {
    return werk();
  } finally {
    slot.releaseLock();
  }
}

/* ---- de aanvraag als leesbare regels ------------------------------ */
function antwoordRegels(soort, d) {
  const regels = [];
  VRAGEN[soort].forEach(function (v) {
    const waarde = tekstOf(d[v.sleutel], '');
    if (!waarde) return;                       // niet ingevulde vragen slaan we over
    // een lang antwoord krijgt zijn eigen regel eronder, dat leest prettiger
    if (waarde.length > 60 || waarde.indexOf('\n') !== -1) {
      regels.push(v.label + ':', waarde, '');
    } else {
      regels.push(v.label + ': ' + waarde);
    }
  });
  // een lang laatste antwoord laat een lege regel achter; die halen we weg
  while (regels.length && regels[regels.length - 1] === '') regels.pop();
  return regels;
}

/* ---- de mail aan onszelf ------------------------------------------ */
function mailNaarOns(soort, d) {
  const cfg = FORMULIEREN[soort];
  const regels = [cfg.onzeTitel, '']
    .concat(antwoordRegels(soort, d))
    .concat([
      '',
      'STUDENT',
      'Name:  ' + tekstOf(d.naam, '-'),
      'Email: ' + tekstOf(d.email, '-'),
      tekstOf(d.studie, '') ? 'Study: ' + tekstOf(d.studie, '') : null,
      '',
      '— Verstuurd vanaf de Impact Connect-site. Druk op Beantwoorden om',
      '  de student rechtstreeks te mailen.',
    ].filter(function (r) { return r !== null; }));

  MailApp.sendEmail({
    to: ONTVANGER,
    subject: cfg.onderwerp + ': ' + tekstOf(d.naam, 'onbekend'),
    body: regels.join('\n'),
    replyTo: tekstOf(d.email, ONTVANGER),
    name: 'Website ' + AFZENDERNAAM,
  });
}

/* ---- de bevestiging aan de student -------------------------------- */
/* bevestiging: eigen openingstekst, bijvoorbeeld als er een gesprek is
   geboekt. Zonder komt de vaste tekst uit FORMULIEREN. */
function mailNaarStudent(soort, d, bevestiging) {
  const cfg = FORMULIEREN[soort];
  const voornaam = tekstOf(d.naam, 'there').split(' ')[0];

  const regels = ['Hi ' + voornaam + ',', '']
    .concat(bevestiging || cfg.bevestiging)
    .concat([
      '',
      'This is what you sent us:',
      '',
    ])
    .concat(antwoordRegels(soort, d))
    .concat([
      '',
      'Anything to add or change? Just reply to this mail.',
      '',
      'Best,',
      AFZENDERNAAM,
      ONTVANGER,
    ]);

  MailApp.sendEmail({
    to: d.email,
    subject: 'Your ' + cfg.onderwerp.toLowerCase() + ' at ' + AFZENDERNAAM,
    body: regels.join('\n'),
    name: AFZENDERNAAM,
    replyTo: ONTVANGER,
  });
}

/* ---- wegschrijven in de sheet -------------------------------------
   Elk formulier krijgt zijn eigen tabblad en elke vraag zijn eigen kolom,
   zodat je kunt sorteren en filteren. Komt er een vraag bij, dan zet het
   script die kolom er zelf achter.
   ------------------------------------------------------------------- */
function rijGegevens(soort, d) {
  const rij = {
    'Datum': new Date(),
    'Naam': tekstOf(d.naam, ''),
    'E-mail': tekstOf(d.email, ''),
    'Studie': tekstOf(d.studie, ''),
  };
  VRAGEN[soort].forEach(function (v) {
    rij[v.label] = tekstOf(d[v.sleutel], '');
  });
  // Geen kolom "Afgehandeld" meer: die is vervangen door Status en Contact
  // person, die met de hand vooraan in het tabblad zijn gezet. Zou hij hier
  // blijven staan, dan kwam hij bij de volgende aanvraag weer achteraan
  // terug naast de kolommen die jullie zelf bijhouden.
  return rij;
}

function schrijfInBlad(soort, d) {
  const bestand = SpreadsheetApp.getActiveSpreadsheet();
  if (!bestand) return;           // script staat los van een sheet: dan alleen mailen

  // Op nummer zoeken en pas daarna op naam: een hernoemd tabblad zou anders
  // stilletjes een nieuw leeg tabblad opleveren. Zie bladOp() in Loket.gs.
  const naam = FORMULIEREN[soort].tabblad;
  let blad = bladOp(bestand, FORMULIEREN[soort].tabbladId, naam);
  if (!blad) {
    blad = bestand.insertSheet(naam);
    blad.setFrozenRows(1);
  }

  const rij = rijGegevens(soort, d);
  const namen = Object.keys(rij);

  // bestaande koprij ophalen
  let kop = [];
  if (blad.getLastColumn() > 0) {
    kop = blad.getRange(1, 1, 1, blad.getLastColumn()).getValues()[0]
      .map(function (v) { return String(v).trim(); })
      .filter(function (v) { return v !== ''; });
  }

  // kolommen die er nog niet zijn achteraan toevoegen
  const nieuw = namen.filter(function (n) { return kop.indexOf(n) === -1; });
  if (nieuw.length) {
    blad.getRange(1, kop.length + 1, 1, nieuw.length).setValues([nieuw]);
    kop = kop.concat(nieuw);
    blad.getRange(1, 1, 1, kop.length).setFontWeight('bold');
  }

  // waarden op volgorde van de koprij, lege cellen voor wat ontbreekt
  const waarden = kop.map(function (n) {
    return Object.prototype.hasOwnProperty.call(rij, n) ? rij[n] : '';
  });
  blad.appendRow(waarden);
}

/* ---- antwoord aan de website -------------------------------------- */
function antwoord(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/* ---- zelftest ------------------------------------------------------
   Voer deze functie één keer handmatig uit in de Apps Script-editor.
   Google vraagt dan om toestemming, en je ziet meteen of het mailen en het
   wegschrijven werken. Er komen twee testaanvragen binnen op ONTVANGER, en
   in de sheet verschijnen beide tabbladen met één regel.
   -------------------------------------------------------------------- */
function zelftest() {
  doPost({ postData: { contents: JSON.stringify({
    formulier: 'afspraak',
    naam: 'Testaanvraag Student',
    email: ONTVANGER,
    zoekt: ['I\'m not sure yet', 'A programme'],
    themas: ['Energy & climate', 'Water & coasts'],
    niveau: 'Some experience',
    tijd: '1 day/week',
    betaald: 'Either is fine',
    taal: 'English',
    notities: 'Dit is een test vanuit de Apps Script-editor.',
  }) } });

  doPost({ postData: { contents: JSON.stringify({
    formulier: 'alumnus',
    naam: 'Testverzoek Student',
    email: ONTVANGER,
    studie: 'MSc Sustainable Development, year 1',
    vakgebied: ['Water', 'Policy and government'],
    organisatie: ['Government'],
    specifiek: 'Policy advisor at a ministry',
    doel: 'Ik twijfel tussen beleid en onderzoek en wil weten hoe iemand die keuze heeft gemaakt.',
  }) } });

  console.log('Zelftest uitgevoerd. Controleer ' + ONTVANGER
    + ' en de tabbladen Afspraken en Alumniverzoeken.');
}
