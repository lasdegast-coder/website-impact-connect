/* ===================================================================
   HET ALUMNILOKET
   Draait in hetzelfde Apps Script als Code.gs, naast de formulieren.

   Wat er gebeurt, van klik tot introductie:

     1. De website haalt de alumnilijst hier op (doGet ?lijst=alumni).
        Daar zitten alleen de mensen in die toestemming hebben gegeven,
        en alleen de velden die een student mag zien. Mailadressen,
        telefoonnummers en LinkedIn gaan niet mee over de lijn; die
        blijven in de sheet.
     2. De student kiest iemand en stuurt zijn vraag in (formulier
        "loketverzoek"). Die gaat in het tabblad Introducties.
     3. Wij krijgen één mail met de vraag en drie kandidaten: degene die
        de student koos, plus twee die dit script erbij zoekt. Onder elke
        naam een knop.
     4. Op een knop klikken opent een bevestigingspagina met één knop.
        Dat is met opzet: mailprogramma's laden links soms vooraf in om
        ze te scannen, en dan zou een aanvraag zichzelf goedkeuren.
     5. Na die bevestiging gaat de introductie de deur uit: één mail aan
        de alumnus met de vraag en de gegevens van de student, met de
        student in de cc. Daarnaast een bericht aan de student zelf.

   De alumnigegevens staan in een tabblad dat uit jullie aanmeldformulier
   komt. Dit script leest de koprij en zoekt de kolommen zelf op, dus de
   volgorde mag veranderen en er mogen kolommen bij komen.
   =================================================================== */

/* ---- waar de alumni vandaan komen ---------------------------------
   Het antwoordbestand van jullie aanmeldformulier voor alumni. Google
   Formulieren maakt daar meestal een eigen bestand voor aan; staat dat los
   van de sheet waar dit script aan hangt, zet hier dan het id uit de
   adresbalk: docs.google.com/spreadsheets/d/HET-ID-STAAT-HIER/edit

   Laat je het leeg, dan wordt de sheet gebruikt waar dit script aan hangt;
   dat klopt alleen als de alumni daar als tabblad in staan.

   Hier wordt uitsluitend uit gelezen. Dit script schrijft er nooit in.
   ------------------------------------------------------------------- */
const ALUMNI_BESTAND_ID = '1bMsC5tPuzI195xlvU2UIm-ITMMsHyFR_bVTGqdmE3-Q';

/* Het tabblad met de aanmeldingen. Laat je dit leeg, dan zoekt het script
   het zelf op: het pakt het eerste tabblad met een naam-, mail- én
   toestemmingskolom in de koprij. Dat scheelt gedoe, want een antwoordblad
   van Google Formulieren heet "Formulierreacties 1" en niet "Alumni".
   Staan er meerdere formulieren in één bestand, vul dan de naam in. */
const ALUMNI_BLAD       = '';

/* ---- waar de aanvragen heen gaan ----------------------------------
   Standaard komt het tabblad Introducties in de sheet waar dit script aan
   hangt, naast Afspraken, Alumniverzoeken en Berichten. Dat is met opzet:
   het is dezelfde soort inhoud (een student die iets vraagt), je hoeft maar
   op één plek te kijken, en een script mag zonder extra toestemming in zijn
   eigen sheet schrijven.

   Wil je het toch apart, bijvoorbeeld omdat meer mensen bij de introducties
   moeten kunnen dan bij de afspraken: maak een nieuwe sheet, zet het id
   hieronder, en het tabblad wordt daar aangemaakt. Verhuis dan ook het
   bestaande tabblad, want het script kijkt daarna alleen nog in het nieuwe
   bestand en zou anders opnieuw bij nul beginnen met tellen.
   ------------------------------------------------------------------- */
const LOKET_BESTAND_ID  = '';

/* Een tabblad wordt opgezocht op zijn vaste nummer, niet op zijn naam. Dat
   nummer verandert nooit, ook niet als iemand het tabblad hernoemt; de naam
   wel. Dat is hier een keer misgegaan: de tabbladen kregen andere namen en
   het script maakte daarna vrolijk nieuwe lege tabbladen aan, waardoor de
   telling van hoe vaak een alumnus al benaderd was op nul stond.

   Het nummer staat in de adresbalk van de sheet achter #gid= als je op dat
   tabblad staat. De naam blijft eronder staan als terugval, en om een nieuw
   tabblad mee aan te maken als het er nog niet is. */
const LOKET_BLAD_ID     = 1881025143;
const LOKET_BLAD        = 'Alumni introducties';

/* Zoveel aanvragen mag één student tegelijk open hebben staan. Zonder rem
   stuurt iemand op één avond de hele lijst af en is het netwerk voor de
   rest van het jaar op. */
const MAX_OPEN_PER_STUDENT = 2;

/* Hoeveel dagen na de introductie we de student vragen hoe het ging. Drie
   weken is genoeg om een mail beantwoord te hebben en misschien al gesproken
   te hebben, en kort genoeg om het je nog te herinneren. */
const NAVRAAG_DAGEN = 21;

/* De cijferlink mag veel langer mee dan de besluitknoppen: die mail komt
   binnen op een moment dat niemand erop zit te wachten, en hij wordt vaak
   pas weken later opengeklikt. */
const FEEDBACK_DAGEN = 90;

/* Hoe lang de knoppen in onze mail blijven werken. Daarna is de link dood
   en moet je de aanvraag met de hand oppakken; dat is beter dan een knop
   die over een half jaar nog een introductie kan versturen. */
const TOKEN_DAGEN = 7;

/* ---- de kolommen uit jullie aanmeldformulier ----------------------
   Per veld een paar stukjes tekst die in de kop mogen staan. De
   vergelijking is hoofdletterongevoelig en kijkt of het stukje ergens in
   de kop voorkomt, dus "Email " en "E-mail address" vinden allebei hun weg.
   Hernoem je een vraag in het formulier, zet het nieuwe woord er dan bij.
   ------------------------------------------------------------------- */
const KOLOM = {
  naam:        ['full name', 'naam', 'name'],
  bsc:         ['bsc'],
  msc:         ['msc'],
  werk:        ['current occupation', 'occupation'],
  eerder:      ['previous occupation', 'previous role', 'eerdere rol'],
  interesses:  ['fields of interest', 'interest'],
  toestemming: ['permission'],
  kanaal:      ['prefer to be contact', 'contacted by'],
  telefoon:    ['phone'],
  mail:        ['email', 'e-mail'],
  linkedin:    ['linkedin'],
  frequentie:  ['frequency'],
};

/* Een regel waarvan de naam hiermee begint is een testprofiel. Die staat
   niet in de lijst die studenten zien, maar is wel te bereiken door
   ?test=1 achter het adres van de alumnipagina te zetten. Zo kun je de hele
   keten uitproberen — aanvraag, onze mail, de introductie, de navraag —
   zonder dat er een echte alumnus wordt lastiggevallen en zonder dat er een
   nepprofiel op de site staat. */
const TEST_VOORVOEGSEL = 'test';

function isTestNaam(naam) {
  return String(naam).trim().toLowerCase().indexOf(TEST_VOORVOEGSEL) === 0;
}

/* Wat "ja" mag betekenen in de toestemmingskolom. Alles wat hier niet in
   staat telt als nee: bij twijfel komt iemand niet op de site. */
const JA = ['ja', 'yes', 'y', 'true', 'x', '1', 'akkoord', 'agree'];

/* Hoeveel introducties iemand per periode krijgt. De sleutel is wat er in
   de kolom "Preferred frequency" kan staan; er wordt gekeken of een van
   deze woorden erin voorkomt. Herkent hij niets, dan geldt GEEN_LIMIET. */
const FREQUENTIES = [
  { woorden: ['once a month', '1 per month', 'maandelijks', 'per maand'], aantal: 1, periode: 'maand' },
  { woorden: ['twice a month', '2 per month'],                            aantal: 2, periode: 'maand' },
  { woorden: ['once a quarter', 'per quarter', 'per kwartaal'],           aantal: 1, periode: 'kwartaal' },
  { woorden: ['once a year', 'per year', 'per jaar'],                     aantal: 1, periode: 'jaar' },
];
const GEEN_LIMIET = { aantal: 99, periode: 'maand' };

/* ═══ 1. DE ALUMNILIJST LEZEN ═══════════════════════════════════════ */

/* Er zijn twee sheets in het spel, en het is belangrijk ze uit elkaar te
   houden:

     alumniBestand()  waar de aanmeldingen van alumni binnenkomen. Dat is
                      meestal het antwoordbestand van het Google Formulier,
                      en daar schrijven wij nooit in. Alleen lezen.

     loketBestand()   waar de aanvragen van studenten heen gaan. Standaard
                      de sheet waar dit script aan hangt, dezelfde waar de
                      formulieren al in terechtkomen; daar komt het tabblad
                      Introducties bij.

   Ze door elkaar halen zou betekenen dat er namen en vragen van studenten
   in het antwoordbestand van de alumni terechtkomen. Dat zijn twee groepen
   mensen die niets met elkaars gegevens te maken hebben. */
function alumniBestand() {
  return ALUMNI_BESTAND_ID
    ? SpreadsheetApp.openById(ALUMNI_BESTAND_ID)
    : SpreadsheetApp.getActiveSpreadsheet();
}

/* Zoekt een tabblad op nummer, en pas daarna op naam. Geeft null als het er
   niet is; de aanroeper bepaalt of hij het dan aanmaakt. */
function bladOp(bestand, nummer, naam) {
  if (!bestand) return null;
  if (nummer) {
    const bladen = bestand.getSheets();
    for (let i = 0; i < bladen.length; i++) {
      if (bladen[i].getSheetId() === nummer) return bladen[i];
    }
  }
  return naam ? bestand.getSheetByName(naam) : null;
}

function loketBestand() {
  return LOKET_BESTAND_ID
    ? SpreadsheetApp.openById(LOKET_BESTAND_ID)
    : SpreadsheetApp.getActiveSpreadsheet();
}

/* Zoekt per veld uit KOLOM welke kolom het is. Geeft { veld: index } terug;
   een veld dat niet gevonden wordt ontbreekt, en dat vangen we later op. */
function vindKolommen(kop) {
  const gevonden = {};
  const laag = kop.map(function (k) { return String(k).toLowerCase().trim(); });
  Object.keys(KOLOM).forEach(function (veld) {
    for (let i = 0; i < laag.length; i++) {
      const raak = KOLOM[veld].some(function (stuk) { return laag[i].indexOf(stuk) !== -1; });
      if (raak) { gevonden[veld] = i; return; }
    }
  });
  return gevonden;
}

/* Alleen de voornaam gaat naar de site. "Sanne Vermeulen" wordt "Sanne".
   Genoeg om iemand aan te spreken, te weinig om hem op te zoeken en buiten
   ons om te benaderen. De volledige naam blijft in de sheet staan en gaat
   pas mee in de introductiemail. */
function toonNaam(volledig) {
  return String(volledig).trim().split(/\s+/)[0] || '';
}

/* Niet iedereen schrijft "BSc" voor zijn opleiding; de een vult
   "Milieu-maatschappijwetenschappen" in, de ander "BSc Bestuurskunde".
   Op de kaart hoort het er altijd te staan, anders weet een student niet
   of hij naar een bachelor of een master kijkt. */
const GRADEN = ['bsc', 'msc', 'bachelor', 'master', 'ba ', 'ma ', 'llm', 'llb',
                'b.sc', 'm.sc', 'bs ', 'ms ', 'meng', 'beng'];
const LEEG = ['-', '—', '–', 'n/a', 'na', 'geen', 'none', 'nvt', 'n.v.t.', 'x'];

function metGraad(waarde, graad) {
  const ruw = String(waarde).trim();
  if (!ruw) return '';
  if (LEEG.indexOf(ruw.toLowerCase()) !== -1) return '';

  const laag = ruw.toLowerCase();
  const heeftAl = GRADEN.some(function (g) { return laag.indexOf(g) === 0; });
  return heeftAl ? ruw : graad + ' ' + ruw;
}

/* Een vast kenmerk per alumnus, afgeleid van het mailadres. Het mailadres
   zelf mag de site niet in, maar we hebben wel iets nodig om een aanvraag
   aan de juiste persoon te koppelen. Verhuist iemand naar een ander adres,
   dan krijgt die een nieuw kenmerk; openstaande aanvragen van dat moment
   moet je dan met de hand afhandelen. */
function alumniId(mail) {
  const ruw = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256, String(mail).toLowerCase().trim());
  return ruw.slice(0, 6).map(function (b) {
    return ('0' + (b & 0xff).toString(16)).slice(-2);
  }).join('');
}

function isJa(waarde) {
  const s = String(waarde).toLowerCase().trim();
  return JA.some(function (j) { return s === j || s.indexOf(j) === 0; });
}

function frequentieVan(tekst) {
  const s = String(tekst).toLowerCase();
  for (let i = 0; i < FREQUENTIES.length; i++) {
    if (FREQUENTIES[i].woorden.some(function (w) { return s.indexOf(w) !== -1; })) {
      return FREQUENTIES[i];
    }
  }
  return GEEN_LIMIET;
}

/* Leest het alumnitabblad uit. Geeft alles terug, inclusief de gegevens
   die niet naar de site mogen; wat er wél naartoe gaat wordt verderop
   in openbareLijst() bepaald. */
/* Zoekt het tabblad met de aanmeldingen. Is ALUMNI_BLAD ingevuld, dan is
   dat het; anders het eerste tabblad waarvan de koprij een naam, een
   mailadres en een toestemmingskolom heeft. */
function alumniBlad() {
  const bestand = alumniBestand();
  if (!bestand) return null;

  if (ALUMNI_BLAD) return bestand.getSheetByName(ALUMNI_BLAD);

  const bladen = bestand.getSheets();
  for (let i = 0; i < bladen.length; i++) {
    if (bladen[i].getName() === LOKET_BLAD) continue;     // ons eigen tabblad overslaan
    if (bladen[i].getLastRow() < 1) continue;
    const kop = bladen[i].getRange(1, 1, 1, bladen[i].getLastColumn()).getValues()[0];
    const k = vindKolommen(kop);
    if (k.naam !== undefined && k.mail !== undefined && k.toestemming !== undefined) {
      return bladen[i];
    }
  }
  return null;
}

function leesAlumni() {
  const blad = alumniBlad();
  if (!blad) {
    console.error('Geen alumnitabblad gevonden. Controleer ALUMNI_BESTAND_ID, of vul '
      + 'ALUMNI_BLAD in met de naam van het tabblad.');
    return [];
  }
  if (blad.getLastRow() < 2) return [];

  const alles = blad.getDataRange().getValues();
  const kolom = vindKolommen(alles[0]);
  if (kolom.naam === undefined || kolom.mail === undefined) {
    // Zonder naam of mailadres valt er niets te doen. Beter meteen leeg
    // dan een halve lijst waarvan niemand doorheeft dat hij fout is.
    console.error('Tabblad "' + blad.getName() + '": kolom Naam of Email niet gevonden.');
    return [];
  }

  const cel = function (rij, veld) {
    return kolom[veld] === undefined ? '' : String(rij[kolom[veld]] || '').trim();
  };

  const gebruikt = introductiesPerAlumnus();
  const lijst = [];

  alles.slice(1).forEach(function (rij) {
    const mail = cel(rij, 'mail');
    if (!mail) return;
    if (!isJa(cel(rij, 'toestemming'))) return;   // de poort: geen ja, geen profiel

    const id = alumniId(mail);
    const freq = frequentieVan(cel(rij, 'frequentie'));
    lijst.push({
      id: id,
      naam: toonNaam(cel(rij, 'naam')),
      volledigeNaam: cel(rij, 'naam'),
      bsc: metGraad(cel(rij, 'bsc'), 'BSc'),
      msc: metGraad(cel(rij, 'msc'), 'MSc'),
      werk: cel(rij, 'werk'),
      eerder: cel(rij, 'eerder'),
      interessesRuw: cel(rij, 'interesses'),
      themas: groepeerThemas(cel(rij, 'interesses')),
      kanaal: cel(rij, 'kanaal'),
      mail: mail,
      telefoon: cel(rij, 'telefoon'),
      linkedin: cel(rij, 'linkedin'),
      frequentie: cel(rij, 'frequentie'),
      test: isTestNaam(cel(rij, 'naam')),
      ruimte: ruimteVan(freq, gebruikt[id] || []),
    });
  });

  return lijst;
}

/* Hoeveel introducties er nog in kunnen. Telt alleen de introducties die
   in de lopende periode zijn verstuurd, dus aan het begin van een maand
   staat iedereen weer op nul. */
function ruimteVan(freq, datums) {
  const nu = new Date();
  const inPeriode = datums.filter(function (d) { return zelfdePeriode(d, nu, freq.periode); });
  const over = freq.aantal - inPeriode.length;
  return {
    vol: over <= 0,
    over: Math.max(0, over),
    van: freq.aantal,
    periode: freq.periode,
    onbeperkt: freq.aantal >= 99,
  };
}

function zelfdePeriode(a, b, periode) {
  if (!(a instanceof Date)) return false;
  if (a.getFullYear() !== b.getFullYear()) return false;
  if (periode === 'jaar') return true;
  if (periode === 'kwartaal') return Math.floor(a.getMonth() / 3) === Math.floor(b.getMonth() / 3);
  return a.getMonth() === b.getMonth();
}

/* ═══ 2. INTERESSES GROEPEREN ═══════════════════════════════════════

   "Fields of interest" is een open tekstvak, en dat blijft het: mensen
   schrijven nu eenmaal wat ze willen. Om erop te kunnen filteren zetten
   we die antwoorden om naar een vaste lijst thema's.

   De woordenlijst vangt het grootste deel. Wat er niet in past verdwijnt
   niet: dat komt als "?" terug in de beheerslijst (zie loketOverzicht),
   en dan zet je het woord hieronder erbij. Elke toevoeging geldt meteen
   voor iedereen, ook met terugwerkende kracht.
   ═══════════════════════════════════════════════════════════════════ */
/* Let op bij het toevoegen van een zoekterm: hij wordt als losse tekst in de
   hele zin gezocht, dus een woord dat ook in een ander vakgebied voorkomt
   levert verkeerde labels op. Zo gaf 'psycholog' aan iedereen met
   "environmental psychology" het label Health, en 'economie' maakte van
   "circulaire economie" iets financieels. Die zijn er daarom uit. Kies dus
   woorden die alleen in dat ene vakgebied voorkomen, en test met
   toonNietHerkend() of overzicht() in de editor. */
const THEMAS = {
  'Choosing a master’s': ['studiekeuze', 'master kiezen', 'vervolgopleiding', 'choosing a master', 'which master', 'study choice', 'master or work'],
  'Job hunting':              ['sollicit', 'cv', 'resume', 'motivatiebrief', 'cover letter', 'interview', 'loopbaan', 'carriere', 'career', 'arbeidsmarkt', 'vacature', 'netwerken', 'networking', 'job hunt', 'applying', 'application', 'job market', 'first job', 'recruit'],
  'Policy & government':      ['beleid', 'policy', 'overheid', 'government', 'gemeente', 'municipal', 'ministerie', 'ministry', 'public sector', 'politiek', 'politics', 'governance', 'lobby', 'ngo', 'non-profit', 'water management', 'waterschap', 'watermanagement'],
  'Consultancy':              ['consult', 'advies', 'advisory', 'strategie', 'big four', 'big 4'],
  'Engineering':              ['techniek', 'technisch', 'engineering', 'engineer', 'werktuigbouw', 'mechanical', 'civiel', 'civil', 'construction', 'manufacturing', 'logistics'],
  'IT & data':                ['ict', 'software', 'developer', 'programmeren', 'coding', 'data', 'machine learning', 'artificial intelligence', 'cyber', 'cloud', 'devops', 'informatica', 'computer science', 'analytics', 'ai', 'tech'],
  'Health':                   ['zorg', 'health', 'gezondheid', 'medisch', 'medical', 'geneeskunde', 'medicine', 'nursing', 'verpleeg', 'ziekenhuis', 'hospital', 'pharma', 'farma', 'patient'],
  'Research & PhD':           ['onderzoek', 'research', 'phd', 'promoveren', 'academ', 'wetenschap', 'postdoc', 'proefschrift', 'thesis', 'universit'],
  'Entrepreneurship':         ['onderneme', 'entrepreneur', 'startup', 'start-up', 'scale-up', 'eigen bedrijf', 'own business', 'zzp', 'freelance', 'self-employed', 'venture', 'founder'],
  'Marketing & communications': ['marketing', 'communicatie', 'communication', 'public relations', 'reclame', 'advertising', 'branding', 'content', 'social media', 'journalist', 'media', 'copywriting', 'growth', 'design'],
  'Finance':                  ['financ', 'accounting', 'accountancy', 'boekhoud', 'bank', 'investering', 'investment', 'private equity', 'audit', 'controlling', 'fintech', 'm&a'],
  'Sustainability':           ['duurzaam', 'sustainab', 'klimaat', 'climate', 'energie', 'energy', 'circulair', 'circular', 'milieu', 'environment', 'esg', 'green', 'transition'],
  'Education':                ['onderwijs', 'education', 'docent', 'teacher', 'lesgeven', 'teaching', 'school', 'training', 'coach', 'mentor'],
  'Law':                      ['recht', 'legal', 'juridisch', 'law', 'advocaat', 'lawyer', 'notaris', 'litigation'],
  'Working abroad':           ['buitenland', 'abroad', 'expat', 'emigr', 'global', 'overseas', 'relocat'],
};

/* Woorden van drie letters of korter zoeken we als heel woord op. Anders
   zit "ai" in "chain" en "cv" in "cvs", en dan krijgt iedereen alle thema's. */
const KORTE_WOORDEN = ['cv', 'ngo', 'ai', 'law', 'tech', 'm&a', 'esg', 'ict'];

function plat(tekst) {
  return String(tekst).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

function raaktWoord(schoon, woord) {
  if (KORTE_WOORDEN.indexOf(woord) === -1) return schoon.indexOf(woord) !== -1;
  const veilig = woord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp('(^|[^a-z0-9])' + veilig + '([^a-z0-9]|$)').test(schoon);
}

function groepeerThemas(tekst) {
  if (!tekst) return [];
  const schoon = plat(tekst);
  return Object.keys(THEMAS).filter(function (thema) {
    return THEMAS[thema].some(function (w) { return raaktWoord(schoon, w); });
  });
}

/* De losse stukjes die nergens onder vielen. Hiermee zie je in het
   overzicht welk woord je nog aan THEMAS moet toevoegen. */
function nietHerkend(tekst) {
  if (!tekst) return [];
  return String(tekst).split(/[,;/|]|\ben\b|\band\b|&/i)
    .map(function (f) { return f.trim(); })
    .filter(function (f) { return f.length > 2; })
    .filter(function (f) {
      const schoon = plat(f);
      return !Object.keys(THEMAS).some(function (thema) {
        return THEMAS[thema].some(function (w) { return raaktWoord(schoon, w); });
      });
    });
}

/* ═══ 3. WAT DE WEBSITE OPHAALT ═════════════════════════════════════ */

/* Alleen de velden die een student mag zien. Geen mailadres, geen
   telefoonnummer, geen LinkedIn, en ook geen achternaam: die staan wel in
   de sheet, maar ze gaan niet over de lijn. Wat hier niet in staat kan
   ook niet per ongeluk in de broncode van de pagina belanden. */
function openbareLijst(metTest) {
  return leesAlumni().filter(function (a) {
    return metTest || !a.test;          // testprofielen blijven uit de gewone lijst
  }).map(function (a) {
    return {
      id: a.id,
      // Geen naam meer. Die stond hier eerst wel, en dan staat hij in het
      // netwerkantwoord van de site ook al toont het kaartje hem niet. Wie
      // iemand is hoort de student pas te weten als wij de introductie maken.
      bsc: a.bsc,
      msc: a.msc,
      werk: a.werk,
      eerder: a.eerder,
      themas: a.themas,
      vol: a.ruimte.vol,
      over: a.ruimte.onbeperkt ? null : a.ruimte.over,
      periode: a.ruimte.periode,
      test: a.test || undefined,
    };
  });
}

/* De lijst verandert hooguit een paar keer per week, maar wordt bij elk
   bezoek opgehaald. Vijf minuten cache scheelt een hoop leeswerk in de
   sheet en houdt de pagina snel. Net een nieuwe alumnus goedgekeurd en wil
   je hem meteen zien? Voer wisAlumniCache() uit in de editor. */
function alumniJson(metTest, vers) {
  const cache = CacheService.getScriptCache();
  const sleutel = metTest ? 'alumnilijst-test' : 'alumnilijst';

  // Met ?vers=1 sla je de cache over. Handig als je net iets in de sheet hebt
  // aangepast en meteen wilt zien of het klopt, zonder vijf minuten te wachten
  // of de editor te openen. De verse lijst gaat wel weer in de cache, zodat de
  // volgende bezoeker er ook wat aan heeft.
  if (!vers) {
    const bewaard = cache.get(sleutel);
    if (bewaard) return bewaard;
  }

  const json = JSON.stringify({ ok: true, alumni: openbareLijst(metTest) });
  cache.put(sleutel, json, 300);
  return json;
}

function wisAlumniCache() {
  CacheService.getScriptCache().removeAll(['alumnilijst', 'alumnilijst-test']);
  console.log('Cache geleegd. De site haalt de lijst nu opnieuw op.');
}

/* ═══ 4. DE AANVRAAG VAN EEN STUDENT ════════════════════════════════ */

/* Wordt aangeroepen vanuit doPost in Code.gs bij formulier "loketverzoek". */
function loketVerzoek(d) {
  const naam  = eenRegel(tekstOf(d.naam, ''));
  const email = eenRegel(tekstOf(d.email, ''));
  const vraag = tekstOf(d.vraag, '');

  if (!naam || !email) return antwoord({ ok: false, fout: 'Naam en e-mailadres zijn verplicht.' });
  if (!geldigMailadres(email)) return antwoord({ ok: false, fout: 'Dat e-mailadres klopt niet.' });
  if (vraag.length < 80) return antwoord({ ok: false, fout: 'Schrijf iets meer over je vraag.' });

  const alle = leesAlumni();
  const gekozen = alle.filter(function (a) { return a.id === d.alumnus; })[0];
  if (!gekozen) return antwoord({ ok: false, fout: 'Die alumnus staat niet meer op de lijst.' });
  if (gekozen.ruimte.vol) return antwoord({ ok: false, fout: 'Die alumnus zit deze periode vol.' });

  const student = {
    naam: naam, email: email, vraag: vraag,
    studie: tekstOf(d.studie, ''),
    themas: tekstOf(d.themas, ''),
  };

  // Eén keer uitrekenen, en daarna zowel in de sheet als in de mail dezelfde
  // drie gebruiken. Twee keer rekenen kan twee verschillende rijtjes opleveren
  // als er ondertussen iemand vol raakt, en dan klopt het logboek niet meer
  // met wat je in je inbox hebt zien staan.
  const kandidaten = kiesKandidaten(gekozen, alle, student);

  // De rem en het wegschrijven horen bij elkaar: twee aanvragen op precies
  // hetzelfde moment mogen niet allebei langs een limiet van twee glippen.
  const uitkomst = metSlot(function () {
    if (openAanvragen(email) >= MAX_OPEN_PER_STUDENT) return 'teveel';
    return schrijfIntroductie(student, gekozen, kandidaten);
  });

  if (uitkomst === 'teveel') {
    return antwoord({ ok: false, fout: 'Je hebt al twee aanvragen openstaan. Wacht die eerst af.' });
  }

  mailLoketNaarOns(uitkomst, student, gekozen, kandidaten);
  try { mailLoketBevestiging(student, gekozen); } catch (err) { console.error(err); }

  return antwoord({ ok: true });
}

/* Hoeveel aanvragen van dit mailadres nog op een beslissing wachten. */
function openAanvragen(email) {
  const blad = bladOp(loketBestand(), LOKET_BLAD_ID, LOKET_BLAD);
  if (!blad || blad.getLastRow() < 2) return 0;
  const rijen = blad.getDataRange().getValues();
  const kop = rijen[0].map(String);
  const kEmail = kop.indexOf('E-mail student');
  const kStatus = kop.indexOf('Status');
  if (kEmail === -1 || kStatus === -1) return 0;
  return rijen.slice(1).filter(function (r) {
    return String(r[kEmail]).toLowerCase() === email.toLowerCase()
        && String(r[kStatus]) === 'wacht';
  }).length;
}

/* De drie namen die wij te zien krijgen: die van de student, plus twee die
   erbij passen. De volgorde is niet willekeurig maar ook geen oordeel; in
   de mail staat onder elke naam waaróm die er staat, zodat je hem kunt
   negeren als je iemand beter kent dan de sheet. */
function kiesKandidaten(gekozen, alle, student) {
  const studie = plat(student.studie);
  const anderen = alle
    .filter(function (a) { return a.id !== gekozen.id && !a.ruimte.vol; })
    .map(function (a) {
      const gedeeld = a.themas.filter(function (t) { return gekozen.themas.indexOf(t) !== -1; });
      const zelfdeStudie = !!studie && (plat(a.bsc).indexOf(studie) !== -1 || plat(a.msc).indexOf(studie) !== -1);
      let punten = gedeeld.length * 3;
      if (zelfdeStudie) punten += 4;
      if (a.ruimte.onbeperkt || a.ruimte.over > 1) punten += 1;
      return { a: a, punten: punten, gedeeld: gedeeld, zelfdeStudie: zelfdeStudie };
    })
    .sort(function (x, y) { return y.punten - x.punten; })
    .slice(0, 2);

  return [{ a: gekozen, voorkeur: true, gedeeld: [], zelfdeStudie: false }].concat(anderen);
}

/* De regel onder een naam in onze mail. */
function waarom(k) {
  const r = [];
  if (k.voorkeur) r.push('door de student zelf gekozen');
  if (k.zelfdeStudie) r.push('zelfde studie');
  if (k.gedeeld && k.gedeeld.length) r.push('ook actief in ' + k.gedeeld.join(' en ').toLowerCase());
  r.push(k.a.ruimte.onbeperkt ? 'geen limiet opgegeven'
        : k.a.ruimte.over + ' plek(ken) over deze ' + k.a.ruimte.periode);
  if (k.a.kanaal) r.push('wil contact via ' + k.a.kanaal.toLowerCase());
  return r.join(' · ');
}

/* ═══ 5. DE MAILS ═══════════════════════════════════════════════════ */

function webAdres() {
  return ScriptApp.getService().getUrl();
}

function mailLoketNaarOns(ref, student, gekozen, kandidaten) {
  const regels = [
    'ALUMNI DESK REQUEST',
    'Ref: ' + ref,
    '',
    'STUDENT',
    'Name:  ' + student.naam,
    'Email: ' + student.email,
    student.studie ? 'Study: ' + student.studie : null,
    student.themas ? 'Themes: ' + student.themas : null,
    '',
    'THE QUESTION',
    student.vraag,
    '',
    'KIES WIE JE VOORSTELT',
    'Klik op een van de drie. Je krijgt eerst een bevestigingspagina te zien;',
    'pas daarna gaat de introductie de deur uit.',
    '',
  ].filter(function (r) { return r !== null; });

  kandidaten.forEach(function (k, i) {
    regels.push((i + 1) + '. ' + k.a.volledigeNaam + ', ' + k.a.werk);
    regels.push('   ' + waarom(k));
    regels.push('   ' + besluitLink(ref, k.a.id));
    regels.push('');
  });

  regels.push('Past niemand van de drie:');
  regels.push('   ' + besluitLink(ref, 'geen'));
  regels.push('');
  regels.push('— Deze links werken ' + TOKEN_DAGEN + ' dagen en zijn eenmalig.');

  MailApp.sendEmail({
    to: ONTVANGER,
    subject: 'Alumni desk: ' + student.naam + ' → ' + gekozen.naam,
    body: regels.join('\n'),
    replyTo: student.email,
    name: 'Website ' + AFZENDERNAAM,
  });
}

function mailLoketBevestiging(student, gekozen) {
  const regels = [
    'Hi ' + student.naam.split(' ')[0] + ',',
    '',
    'Thanks for your question. We have it, and we\'ll go through it by hand.',
    'We\'ll email you back as soon as we can, at this address, so keep an eye on',
    'your inbox. Check your spam folder if it stays quiet.',
    '',
    // Bewust de functie en niet de naam. Deze mail gaat meteen bij het
    // insturen de deur uit, dus voor wij iets hebben goedgekeurd en voor de
    // alumnus is gevraagd. Stond hier de voornaam, dan kon iedereen die
    // ophalen door een willekeurige vraag in te sturen, en dan heeft het
    // weglaten van de naam op de site geen zin meer. De student weet zelf
    // wel wie hij koos; hij zag dat profiel.
    'You asked to speak to the ' + gekozen.werk + '.',
    'If we think someone else can help you better with this question, we\'ll say',
    'so and tell you why.',
    '',
    'THIS IS WHAT YOU SENT US',
    '',
    student.vraag,
    '',
    'Anything to add? Just reply to this mail.',
    '',
    'Best,',
    AFZENDERNAAM,
    ONTVANGER,
  ];

  MailApp.sendEmail({
    to: student.email,
    subject: 'Your alumni request at ' + AFZENDERNAAM,
    body: regels.join('\n'),
    name: AFZENDERNAAM,
    replyTo: ONTVANGER,
  });
}

/* De introductie zelf. Beiden in de kop en de vraag erin.

   Over de toon: we vragen hier om een echt antwoord, niet om een snel
   antwoord. De drie voorbeelden maken concreet wat een goed antwoord is,
   zodat een alumnus niet hoeft te raden wat er van hem verwacht wordt. En de
   uitnodiging voor een gesprek erna staat er met opzet in: één mail is
   zelden waar het bij blijft als het klikt.

   Dit kost wel wat: hoe meer je vraagt, hoe meer mensen het uitstellen. De
   herinnering na een week vangt dat op.

   De uitweg staat er los onder, zonder dat iemand zich hoeft te
   verantwoorden; dat levert meer eerlijke nee's op dan een alumnus die de
   mail maar laat liggen.

   Over "zij" en "hij": van studenten weten we het geslacht niet, en dat gaan
   we ook niet vragen. Daarom overal "they". */
function mailIntroductie(student, a) {
  const voornaam = student.naam.split(' ')[0];
  const kanaal = a.kanaal.toLowerCase();
  const perTelefoon = kanaal.indexOf('phone') !== -1 || kanaal.indexOf('telefo') !== -1;
  const perVideo = kanaal.indexOf('video') !== -1 || kanaal.indexOf('call') !== -1;

  // Een lijst regels en geen lange zin, want dit is een tekstmail: regels die
  // niet zijn afgebroken worden door het mailprogramma op een willekeurige
  // plek gevouwen en dat leest rommelig. Bij telefoon en video staat er een
  // lege regel achter, zodat het afspreken en de inhoud niet aan elkaar plakken.
  const opening = perTelefoon
    ? ['You told us you would rather talk than type. Let ' + voornaam + ' know when',
       'it suits you and they will call.', '']
    : perVideo
    ? ['You told us you prefer a video call. Send ' + voornaam + ' two times that suit',
       'you and they will set up the link.', '']
    : ['It would help ' + voornaam + ' a lot if you could write back, and take your time with it.'];

  // Bij telefoon en video is het gesprek al het plan, dus daar zou "en als er
  // ruimte is voor een gesprek" nergens op slaan.
  const vervolg = (perTelefoon || perVideo)
    ? ['And if it turns into more than one conversation, so much the better.']
    : ['And if there is room for a call afterwards, do say so. The conversations',
       'that stick rarely fit in one email.'];

  const regels = [
    'Hi ' + a.volledigeNaam.split(' ')[0] + ',',
    '',
    'You told us students are welcome to approach you with career questions.',
    voornaam + (student.studie ? ', ' + student.studie : '')
      + ', has one we think you\'re the right person for.',
    voornaam + ' is in the copy of this mail, so your reply reaches them directly.',
    '',
    'THE QUESTION',
    '',
    student.vraag,
    '',
    voornaam.toUpperCase() + '’S DETAILS',
    'Name:  ' + student.naam,
    'Email: ' + student.email,
    student.studie ? 'Study: ' + student.studie : null,
    '',
  ].concat(opening).concat([
    'What you actually did, what you would do differently, what nobody told you',
    'at the time: that is the kind of answer a student cannot find anywhere else.',
    '',
  ]).concat(vervolg).concat([
    '',
    'Not a good moment? Let us know and we will pick it up from there. No need',
    'to explain yourself.',
    '',
    'Thank you,',
    AFZENDERNAAM,
    ONTVANGER,
    '',
    '— We have you down as: ' + (a.frequentie || 'no frequency given')
      + (a.kanaal ? ', contact by ' + a.kanaal.toLowerCase() : '') + '.',
    '  Want to pause or change that? Reply to this mail and we\'ll sort it.',
  ]).filter(function (r) { return r !== null; });

  MailApp.sendEmail({
    to: a.mail,
    cc: student.email,
    // "Impact Connect (UU)" staat vooraan omdat dit voor de alumnus vaak de
    // eerste mail van ons is sinds hij zich aanmeldde. Zonder die afzender in
    // het onderwerp leest het als een vreemde die zomaar iets vraagt.
    subject: 'Impact Connect (UU) request: ' + voornaam
      + (student.studie ? ' (' + student.studie + ')' : '')
      + ' has a question for you',
    body: regels.join('\n'),
    replyTo: student.email,
    name: AFZENDERNAAM,
  });
}

/* Bericht aan de student dat de introductie eruit is. Koos je iemand anders
   dan hij vroeg, dan staat dat er in één zin bij; zonder die zin voelt het
   als een omgeleide aanvraag in plaats van als bemiddeling. */
function mailIntroductieStudent(student, a, gevraagd) {
  const anders = gevraagd && gevraagd.id !== a.id;
  const regels = [
    'Hi ' + student.naam.split(' ')[0] + ',',
    '',
    'Good news: your question has gone to ' + a.naam + ', ' + a.werk + '.',
    'You\'re in the cc of that mail, so you have the address.',
    '',
    anders ? 'You asked for ' + gevraagd.naam + '. We think ' + a.naam.split(' ')[0]
      + ' can help you further with this question right now'
      + (gevraagd.ruimte.vol ? ', as ' + gevraagd.naam + ' is full this period' : '')
      + '. Would you rather wait for your first choice? Let us know.' : null,
    anders ? '' : null,
    'Three things that help: reply within a day when you hear something, keep',
    'your question concrete, and tell us afterwards how it went. Nothing after',
    'a week? We\'ll send a reminder.',
    '',
    'In three weeks we\'ll send you one mail asking how useful it was. One click',
    'is all it takes, and it is how we decide who to keep asking.',
    '',
    'Good luck,',
    AFZENDERNAAM,
    ONTVANGER,
  ].filter(function (r) { return r !== null; });

  MailApp.sendEmail({
    to: student.email,
    subject: 'You’ve been introduced to ' + a.naam,
    body: regels.join('\n'),
    name: AFZENDERNAAM,
    replyTo: ONTVANGER,
  });
}

/* Niemand van de drie. De student krijgt alternatieven mee, want een
   afwijzing zonder vervolg is het einde van zijn zoektocht. */
function mailLoketAfwijzing(student, gevraagd) {
  const alternatieven = leesAlumni()
    .filter(function (a) {
      return a.id !== gevraagd.id && !a.ruimte.vol
        && a.themas.some(function (t) { return gevraagd.themas.indexOf(t) !== -1; });
    })
    .slice(0, 2);

  let regels = [
    'Hi ' + student.naam.split(' ')[0] + ',',
    '',
    // Ook hier de functie in plaats van de naam: er is niemand geintroduceerd,
    // dus de student hoort nog niet te weten wie dit zijn. En het werkt beter:
    // op de site staan de kaartjes op functie, dus hiermee vindt hij ze terug.
    'Thanks for your question. We looked at who could help you best, and right',
    'now none of them has room, the ' + gevraagd.werk + ' included.',
    '',
  ];

  if (alternatieven.length) {
    regels.push('Your question is too good to leave sitting, so here are two alumni who');
    regels.push('probably will have time in a few weeks:');
    regels.push('');
    alternatieven.forEach(function (a) {
      regels.push('  ' + a.werk);
      regels.push('  ' + (a.msc || a.bsc));
      regels.push('');
    });
    regels.push('Click either of them on the site and your request is back in a minute.');
  } else {
    regels.push('We\'ll come back to you as soon as someone has room again.');
  }

  regels = regels.concat([
    '',
    'Best,',
    AFZENDERNAAM,
    ONTVANGER,
    '',
    '— None of your details were shared with anyone.',
  ]);

  MailApp.sendEmail({
    to: student.email,
    subject: 'About your alumni request',
    body: regels.join('\n'),
    name: AFZENDERNAAM,
    replyTo: ONTVANGER,
  });
}

/* ═══ 6. DE KNOPPEN IN ONZE MAIL ════════════════════════════════════

   Een link die meteen iets doet is hier gevaarlijk: mailprogramma's laden
   links soms vooraf in om ze te scannen op virussen, en dan zou een
   aanvraag zichzelf goedkeuren zonder dat iemand hem gelezen heeft.
   Daarom doet de link uit de mail niets anders dan een pagina tonen, en
   pas de knop op die pagina voert de introductie uit.

   De link is ondertekend, zodat niemand hem kan namaken door een ander
   nummer in de adresbalk te zetten.
   ═══════════════════════════════════════════════════════════════════ */

function loketSleutel() {
  const winkel = PropertiesService.getScriptProperties();
  let sleutel = winkel.getProperty('loketsleutel');
  if (!sleutel) {
    sleutel = Utilities.getUuid() + Utilities.getUuid();
    winkel.setProperty('loketsleutel', sleutel);
  }
  return sleutel;
}

function handtekening(inhoud) {
  return Utilities.base64EncodeWebSafe(
    Utilities.computeHmacSha256Signature(inhoud, loketSleutel()));
}

/* De soort staat in het token zelf. Zonder dat zou een cijferlink uit de
   mail aan de student ook als besluitknop werken: die twee zien er van
   buiten hetzelfde uit. */
function maakToken(soort, ref, keuze, dagen) {
  const inhoud = Utilities.base64EncodeWebSafe(JSON.stringify({
    s: soort, r: ref, k: keuze, tot: Date.now() + dagen * 24 * 3600 * 1000,
  }));
  return inhoud + '.' + handtekening(inhoud);
}

/* Geeft { ref, keuze } terug, of null als de link niet klopt, verlopen is,
   of van de verkeerde soort is. */
function leesToken(token, soort) {
  const delen = String(token || '').split('.');
  if (delen.length !== 2) return null;
  if (handtekening(delen[0]) !== delen[1]) return null;
  let p;
  try {
    p = JSON.parse(Utilities.newBlob(Utilities.base64DecodeWebSafe(delen[0])).getDataAsString());
  } catch (e) { return null; }
  if (!p || !p.tot || Date.now() > p.tot) return null;
  if (p.s !== soort) return null;
  return { ref: p.r, keuze: p.k };
}

function besluitLink(ref, keuze) {
  return webAdres() + '?besluit='
    + encodeURIComponent(maakToken('besluit', ref, keuze, TOKEN_DAGEN));
}

function feedbackLink(ref, cijfer) {
  return webAdres() + '?feedback='
    + encodeURIComponent(maakToken('feedback', ref, String(cijfer), FEEDBACK_DAGEN));
}

/* De pagina die je ziet als je in de mail op een naam klikt. */
function loketBesluitPagina(token) {
  const p = leesToken(token, 'besluit');
  if (!p) return loketPagina('Deze link werkt niet meer',
    'Hij is verlopen of al gebruikt. Zoek de aanvraag op in het tabblad Introducties en handel hem met de hand af.');

  const rij = vindIntroductie(p.ref);
  if (!rij) return loketPagina('Aanvraag niet gevonden',
    'Ref ' + p.ref + ' staat niet in het tabblad ' + LOKET_BLAD + '.');
  if (rij.status !== 'wacht') return loketPagina('Al afgehandeld',
    'Deze aanvraag is op ' + rij.beslotenOp + ' al afgehandeld. Er gebeurt nu niets meer.');

  const alle = leesAlumni();
  const doel = alle.filter(function (a) { return a.id === p.keuze; })[0];
  const gevraagd = alle.filter(function (a) { return a.id === rij.voorkeur; })[0];

  if (p.keuze !== 'geen' && !doel) return loketPagina('Die alumnus staat niet meer op de lijst',
    'Waarschijnlijk is de toestemming ingetrokken of het mailadres gewijzigd.');

  const wat = p.keuze === 'geen'
    ? 'Je wijst deze aanvraag af. ' + rij.naam + ' krijgt een vriendelijke mail met '
      + 'twee alternatieven. Er worden geen gegevens gedeeld.'
    : 'Je stelt <b>' + ontsnap(rij.naam) + '</b> voor aan <b>' + ontsnap(doel.volledigeNaam) + '</b>. '
      + 'Er gaat één mail naar ' + ontsnap(doel.volledigeNaam) + ' met de vraag en de contactgegevens '
      + 'van de student, met de student in de cc.'
      + (gevraagd && gevraagd.id !== doel.id
         ? ' De student vroeg om ' + ontsnap(gevraagd.naam) + ' en krijgt te lezen waarom het iemand anders werd.'
         : '');

  return loketPagina('Weet je het zeker?',
    wat + '<div class="vraag">' + ontsnap(rij.vraag) + '</div>',
    '<form method="post" action="' + webAdres() + '">'
    + '<input type="hidden" name="formulier" value="loketbesluit">'
    + '<input type="hidden" name="token" value="' + ontsnap(token) + '">'
    + '<button type="submit">' + (p.keuze === 'geen' ? 'Ja, afwijzen' : 'Ja, versturen') + '</button>'
    + '</form>');
}

/* Wordt aangeroepen vanuit doPost als de knop op die pagina wordt ingedrukt. */
function loketBesluitUitvoeren(parameter) {
  const p = leesToken(parameter.token, 'besluit');
  if (!p) return loketPagina('Deze link werkt niet meer', 'Hij is verlopen of al gebruikt.');

  // De lijst eerst ophalen: hij is zowel binnen het slot nodig, om de naam
  // van de gekozen alumnus weg te schrijven, als daarna voor de mails.
  const alle = leesAlumni();
  const doel = alle.filter(function (a) { return a.id === p.keuze; })[0];

  const uitkomst = metSlot(function () {
    const rij = vindIntroductie(p.ref);
    if (!rij) return { fout: 'Aanvraag ' + p.ref + ' niet gevonden.' };
    if (rij.status !== 'wacht') return { fout: 'Deze aanvraag is al afgehandeld.' };
    zetIntroductieStatus(p.ref, p.keuze === 'geen' ? 'afgewezen' : 'voorgesteld',
      p.keuze, doel ? doel.volledigeNaam : '');
    return { rij: rij };
  });
  if (uitkomst.fout) return loketPagina('Er gebeurt niets', uitkomst.fout);

  const rij = uitkomst.rij;
  const gevraagd = alle.filter(function (a) { return a.id === rij.voorkeur; })[0];
  const student = {
    naam: rij.naam, email: rij.email, vraag: rij.vraag, studie: rij.studie,
  };

  // De cache bevat nog de oude ruimte-telling; na een introductie klopt die niet meer.
  wisAlumniCache();

  if (p.keuze === 'geen') {
    mailLoketAfwijzing(student, gevraagd || { id: '', naam: 'de gevraagde alumnus', themas: [], ruimte: {} });
    return loketPagina('Afgewezen', 'De student heeft bericht gekregen, met twee alternatieven.');
  }

  if (!doel) return loketPagina('Die alumnus staat niet meer op de lijst',
    'De aanvraag staat nu op "voorgesteld" maar er is niets verstuurd. Handel hem met de hand af.');

  mailIntroductie(student, doel);
  try { mailIntroductieStudent(student, doel, gevraagd); } catch (err) { console.error(err); }

  return loketPagina('Verstuurd',
    ontsnap(doel.volledigeNaam) + ' heeft de vraag van ' + ontsnap(rij.naam)
    + ' gekregen, met de student in de cc. Je kunt dit venster sluiten.');
}

/* Eén opmaak voor alle pagina's die dit script toont. Geen stylesheet van
   de site erbij: die staat op een ander adres en zou hier niet laden. */
function loketPagina(titel, tekst, extra) {
  const html =
    '<!doctype html><html lang="nl"><head><meta charset="utf-8">'
    + '<meta name="viewport" content="width=device-width,initial-scale=1">'
    + '<title>' + ontsnap(titel) + ' · Impact Connect</title><style>'
    + 'body{margin:0;background:#F4EFE3;color:#23291F;'
    + 'font:16px/1.6 "Familjen Grotesk",system-ui,-apple-system,sans-serif;'
    + 'display:flex;align-items:center;justify-content:center;min-height:100vh;padding:24px}'
    + '.kaart{background:#FFFDF7;border:1px solid #E2DAC7;border-radius:14px;'
    + 'padding:34px;max-width:520px;box-shadow:0 10px 30px -18px rgba(35,41,31,.4)}'
    + 'h1{font-family:Georgia,serif;font-size:27px;margin:0 0 14px;color:#13352A;line-height:1.15}'
    + 'p{margin:0 0 18px;color:#4B5044}'
    + '.vraag{border-left:2px solid #C2683A;background:#F6E5DB;padding:14px 16px;'
    + 'border-radius:0 8px 8px 0;margin:18px 0;font-style:italic}'
    + 'textarea{font:inherit;width:100%;box-sizing:border-box;background:#F4EFE3;'
    + 'border:1px solid #E2DAC7;border-radius:9px;padding:11px 13px;margin-bottom:16px;'
    + 'resize:vertical;color:#23291F}'
    + 'textarea:focus{outline:none;border-color:#2B6B4F;box-shadow:0 0 0 3px rgba(43,107,79,.15)}'
    + 'button{font:inherit;font-weight:600;background:#13352A;color:#F4EFE3;border:0;'
    + 'border-radius:99px;padding:12px 26px;cursor:pointer}'
    + 'button:hover{background:#2B6B4F}'
    + '</style></head><body><div class="kaart"><h1>' + ontsnap(titel) + '</h1>'
    + '<p>' + tekst + '</p>' + (extra || '') + '</div></body></html>';

  return HtmlService.createHtmlOutput(html)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/* Alles wat in een pagina terechtkomt en van een bezoeker of uit de sheet
   komt, gaat hier eerst doorheen. Anders kan een vraag met HTML erin de
   pagina overnemen. */
function ontsnap(s) {
  return String(s === undefined || s === null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/* ═══ 7. HET TABBLAD INTRODUCTIES ═══════════════════════════════════ */

/* De kolommen van het tabblad, in de volgorde waarin ze worden aangemaakt als
   het tabblad nog niet bestaat. Daarna doet deze volgorde er niet meer toe:
   er wordt geschreven op kolomnaam, niet op positie. Je mag de kolommen dus
   verslepen zoals je wilt.

   De volgorde volgt het verhaal van één regel: iemand vraagt iets, wij kiezen
   iemand, en drie weken later komt er een oordeel. Wat er gebeurde staat
   vooraan, de details en de administratie erachter. */
const LOKET_KOP = ['Datum', 'Student', 'Alumnus', 'Status', 'Cijfer',
  'Wat beter kan', 'Studie', 'E-mail student', 'Vraag', 'Thema’s',
  'Kandidaten', 'Voorkeur', 'Besloten op', 'Ref', 'Gekozen',
  'Nagevraagd op', 'Beantwoord op'];

function loketBlad() {
  const bestand = loketBestand();
  let blad = bladOp(bestand, LOKET_BLAD_ID, LOKET_BLAD);
  if (!blad) {
    blad = bestand.insertSheet(LOKET_BLAD);
    blad.getRange(1, 1, 1, LOKET_KOP.length).setValues([LOKET_KOP]).setFontWeight('bold');
    blad.setFrozenRows(1);
  }
  return blad;
}

/* Schrijft de aanvraag weg en geeft het referentienummer terug. Dit gaat
   vóór het mailen: gaat er daarna iets mis met de post, dan staat de
   aanvraag er nog en kun je hem met de hand oppakken. */
function schrijfIntroductie(student, gekozen, kandidaten) {
  const blad = loketBlad();
  const ref = 'REQ-' + Utilities.formatDate(new Date(), 'Europe/Amsterdam', 'yyyyMMdd')
    + '-' + ('000' + (blad.getLastRow())).slice(-3);

  schrijfOpNaam(blad, {
    'Datum': new Date(),
    'Ref': ref,
    'Student': student.naam,
    'Studie': student.studie,
    'E-mail student': student.email,
    'Vraag': student.vraag,
    'Thema’s': student.themas,
    'Voorkeur': gekozen.id,
    'Kandidaten': kandidaten.map(function (k) { return k.a.naam; }).join(' | '),
    'Status': 'wacht',
  });
  return ref;
}

/* Schrijft een regel op kolomnaam in plaats van op positie. Dat maakt het
   ongevoelig voor het verslepen van kolommen, en het vult wat er niet in het
   object staat met een lege cel. Ontbreekt een kolom helemaal, dan komt hij
   er achteraan bij; zo gaat er nooit iets verloren.

   Dezelfde aanpak als schrijfInBlad() in Code.gs. */
function schrijfOpNaam(blad, waardenPerKolom) {
  let kop = [];
  if (blad.getLastColumn() > 0) {
    kop = blad.getRange(1, 1, 1, blad.getLastColumn()).getValues()[0]
      .map(function (v) { return String(v).trim(); })
      .filter(function (v) { return v !== ''; });
  }

  const nieuw = Object.keys(waardenPerKolom).filter(function (n) { return kop.indexOf(n) === -1; });
  if (nieuw.length) {
    blad.getRange(1, kop.length + 1, 1, nieuw.length).setValues([nieuw]);
    kop = kop.concat(nieuw);
    blad.getRange(1, 1, 1, kop.length).setFontWeight('bold');
  }

  blad.appendRow(kop.map(function (n) {
    return Object.prototype.hasOwnProperty.call(waardenPerKolom, n) ? waardenPerKolom[n] : '';
  }));
}

function vindIntroductie(ref) {
  const blad = loketBlad();
  if (blad.getLastRow() < 2) return null;
  const rijen = blad.getDataRange().getValues();
  const kop = rijen[0].map(String);
  const k = function (naam) { return kop.indexOf(naam); };

  for (let i = 1; i < rijen.length; i++) {
    if (String(rijen[i][k('Ref')]) !== ref) continue;
    return {
      regel: i + 1,
      ref: ref,
      naam:   String(rijen[i][k('Student')]),
      studie: String(rijen[i][k('Studie')]),
      email:  String(rijen[i][k('E-mail student')]),
      vraag:  String(rijen[i][k('Vraag')]),
      voorkeur: String(rijen[i][k('Voorkeur')]),
      gekozen: String(rijen[i][k('Gekozen')]),
      status: String(rijen[i][k('Status')]),
      beslotenOp: String(rijen[i][k('Besloten op')]),
      cijfer: String(rijen[i][k('Cijfer')]),
      beantwoordOp: String(rijen[i][k('Beantwoord op')]),
    };
  }
  return null;
}

function zetIntroductieStatus(ref, status, gekozen, naam) {
  const blad = loketBlad();
  const rij = vindIntroductie(ref);
  if (!rij) return;
  const kop = blad.getRange(1, 1, 1, blad.getLastColumn()).getValues()[0].map(String);
  const zet = function (kolom, waarde) {
    const i = kop.indexOf(kolom);
    if (i !== -1) blad.getRange(rij.regel, i + 1).setValue(waarde);
  };
  zet('Status', status);
  zet('Gekozen', gekozen === 'geen' ? '' : gekozen);
  // De naam erbij, want in Gekozen staat een intern kenmerk waar je bij het
  // teruglezen niets aan hebt.
  zet('Alumnus', gekozen === 'geen' ? '' : (naam || ''));
  zet('Besloten op', new Date());
}

/* Per alumnus de datums waarop er een introductie is verstuurd. Hiermee
   telt ruimteVan() hoeveel er deze maand of dit kwartaal al zijn geweest. */
function introductiesPerAlumnus() {
  const blad = bladOp(loketBestand(), LOKET_BLAD_ID, LOKET_BLAD);
  if (!blad || blad.getLastRow() < 2) return {};
  const rijen = blad.getDataRange().getValues();
  const kop = rijen[0].map(String);
  const kGekozen = kop.indexOf('Gekozen');
  const kDatum = kop.indexOf('Besloten op');
  if (kGekozen === -1 || kDatum === -1) return {};

  const per = {};
  rijen.slice(1).forEach(function (r) {
    const id = String(r[kGekozen]).trim();
    if (!id) return;
    const datum = r[kDatum];
    if (!(datum instanceof Date)) return;
    (per[id] = per[id] || []).push(datum);
  });
  return per;
}

/* ═══ 8. DRIE WEKEN LATER: HOE GING HET? ════════════════════════════

   Eén keer per dag kijkt dit script welke introducties drie weken geleden
   zijn verstuurd en nog niet zijn nagevraagd. Die studenten krijgen een
   mail met de vraag hoe nuttig het was, van 1 tot 10, en waar het beter kan.

   De cijfers staan als knop in de mail. Eén klik is genoeg; op de pagina
   die dan opent kan de student er nog iets bij schrijven, maar dat hoeft
   niet. Wie op de knop drukt en de pagina wegklikt, heeft zijn cijfer al
   gegeven — dat scheelt een hoop antwoorden die anders nooit binnenkomen.

   Aanzetten doe je met een tijdtrigger; zie INSTRUCTIES.md. Zonder trigger
   werkt de rest van het loket gewoon, er wordt dan alleen nooit nagevraagd.
   ═══════════════════════════════════════════════════════════════════ */

/* Welke regels vandaag aan de beurt zijn. Drie voorwaarden, en alle drie
   moeten kloppen: er is echt een introductie verstuurd, die is minstens
   NAVRAAG_DAGEN geleden, en er is nog niet eerder nagevraagd. Wie eenmaal een
   navraag heeft gehad krijgt hem dus nooit een tweede keer.

   Zowel stuurNavragen() als toonNavraagWachtrij() gebruikt deze functie, zodat
   wat je in de proefdraai ziet precies is wat er verstuurd wordt. */
function navraagWachtrij() {
  const blad = bladOp(loketBestand(), LOKET_BLAD_ID, LOKET_BLAD);
  if (!blad || blad.getLastRow() < 2) return { blad: null, kolom: null, regels: [] };

  const rijen = blad.getDataRange().getValues();
  const kop = rijen[0].map(String);
  const k = function (naam) { return kop.indexOf(naam); };
  if (k('Nagevraagd op') === -1) {
    console.error('Tabblad ' + LOKET_BLAD + ' mist de kolom "Nagevraagd op". '
      + 'Voeg de kolommen Nagevraagd op, Cijfer, Wat beter kan en Beantwoord op toe.');
    return { blad: null, kolom: null, regels: [] };
  }

  const grens = new Date(Date.now() - NAVRAAG_DAGEN * 24 * 3600 * 1000);
  const regels = [];

  for (let i = 1; i < rijen.length; i++) {
    const rij = rijen[i];
    if (String(rij[k('Status')]) !== 'voorgesteld') continue;     // nooit voorgesteld
    if (String(rij[k('Nagevraagd op')]).trim()) continue;          // al gehad
    const besloten = rij[k('Besloten op')];
    if (!(besloten instanceof Date) || besloten > grens) continue; // nog te vers

    regels.push({
      regel: i + 1,
      ref: String(rij[k('Ref')]),
      naam: String(rij[k('Student')]),
      email: String(rij[k('E-mail student')]),
      besloten: besloten,
    });
  }
  return { blad: blad, kolom: k('Nagevraagd op') + 1, regels: regels };
}

/* Kijken wie er aan de beurt zou zijn, zonder iets te versturen. Draai dit
   gerust als je wilt weten wat de trigger morgenochtend gaat doen. */
function toonNavraagWachtrij() {
  const wacht = navraagWachtrij();
  if (!wacht.regels.length) {
    console.log('Niemand aan de beurt. Er wordt vannacht dus niets verstuurd.');
    console.log('Een regel komt pas in aanmerking als er een introductie is verstuurd,'
      + ' die minstens ' + NAVRAAG_DAGEN + ' dagen geleden is, en er nog niet is nagevraagd.');
    return;
  }
  console.log(wacht.regels.length + ' student(en) zouden nu een navraag krijgen:');
  wacht.regels.forEach(function (r) {
    console.log('  ' + r.ref + '  ' + r.naam + '  <' + r.email + '>  '
      + 'voorgesteld op ' + Utilities.formatDate(r.besloten, 'Europe/Amsterdam', 'd MMMM yyyy'));
  });
}

function stuurNavragen() {
  const wacht = navraagWachtrij();
  let verstuurd = 0;

  wacht.regels.forEach(function (r) {
    try {
      mailNavraag(r.naam, r.email, r.ref);
      // Pas na een geslaagde verzending stempelen. Gaat het mailen mis, dan
      // staat de regel er morgen weer bij in plaats van stil te verdwijnen.
      wacht.blad.getRange(r.regel, wacht.kolom).setValue(new Date());
      verstuurd++;
    } catch (err) {
      console.error('Navraag ' + r.ref + ' mislukt: ' + err);
    }
  });

  console.log(verstuurd ? verstuurd + ' navraagmail(s) verstuurd.' : 'Niemand aan de beurt.');
}

/* ---- de trigger aan- en uitzetten --------------------------------
   Draai zetNavraagTriggerAan() één keer in de editor. Daarna kijkt Google
   elke ochtend zelf of er introducties van drie weken oud zijn. Dit hoeft
   niet via het klokje in de zijbalk; een script mag zijn eigen trigger
   aanmaken.
   ------------------------------------------------------------------- */
function zetNavraagTriggerAan() {
  // Eerst opruimen. Twee keer uitvoeren zou anders twee triggers opleveren,
  // en dan gaat elke navraag dubbel de deur uit.
  const oud = ScriptApp.getProjectTriggers().filter(function (t) {
    return t.getHandlerFunction() === 'stuurNavragen';
  });
  oud.forEach(function (t) { ScriptApp.deleteTrigger(t); });
  if (oud.length) console.log(oud.length + ' bestaande trigger(s) verwijderd.');

  ScriptApp.newTrigger('stuurNavragen').timeBased().atHour(9).everyDays(1).create();
  console.log('Klaar. Elke ochtend rond 9 uur kijkt het script of er introducties'
    + ' van ' + NAVRAAG_DAGEN + ' dagen oud zijn die nog geen navraag hebben gehad.');
  toonNavraagWachtrij();
}

/* De navraagmail nu versturen in plaats van over drie weken te wachten.
   Pakt de laatste introductie die is verstuurd en mailt daar de cijfervraag
   over. Er wordt niets in de sheet veranderd: de echte navraag komt gewoon
   nog op zijn eigen moment. Puur om te zien hoe het eruitziet. */
function testNavraagNu() {
  const blad = bladOp(loketBestand(), LOKET_BLAD_ID, LOKET_BLAD);
  if (!blad || blad.getLastRow() < 2) {
    console.log('Er staat nog geen enkele aanvraag in ' + LOKET_BLAD + '.');
    return;
  }

  const rijen = blad.getDataRange().getValues();
  const kop = rijen[0].map(String);
  const k = function (naam) { return kop.indexOf(naam); };

  let laatste = null;
  for (let i = 1; i < rijen.length; i++) {
    if (String(rijen[i][k('Status')]) === 'voorgesteld') laatste = rijen[i];
  }
  if (!laatste) {
    console.log('Er is nog geen introductie verstuurd, dus er valt niets na te vragen.');
    return;
  }

  const naam = String(laatste[k('Student')]);
  const email = String(laatste[k('E-mail student')]);
  mailNavraag(naam, email, String(laatste[k('Ref')]));

  console.log('Navraagmail verstuurd naar ' + naam + ' <' + email + '>.');
  console.log('Er is niets in de sheet veranderd; de echte navraag komt nog op'
    + ' zijn eigen moment, ' + NAVRAAG_DAGEN + ' dagen na de introductie.');
}

function zetNavraagTriggerUit() {
  const oud = ScriptApp.getProjectTriggers().filter(function (t) {
    return t.getHandlerFunction() === 'stuurNavragen';
  });
  oud.forEach(function (t) { ScriptApp.deleteTrigger(t); });
  console.log(oud.length ? 'Trigger uitgezet.' : 'Er stond geen trigger aan.');
}

/* De mail met de cijfers als knop. Er gaat ook een gewone tekstversie mee:
   niet elk mailprogramma toont opmaak, en dan moet die student nog steeds
   iets kunnen aanklikken. */
function mailNavraag(naam, email, ref) {
  const voornaam = String(naam).split(' ')[0];
  const cijfers = [1,2,3,4,5,6,7,8,9,10];

  const knoppen = cijfers.map(function (c) {
    return '<a href="' + feedbackLink(ref, c) + '" '
      + 'style="display:inline-block;width:34px;height:34px;line-height:34px;'
      + 'margin:0 3px 6px 0;text-align:center;border-radius:99px;'
      + 'background:#EDE6D4;color:#13352A;text-decoration:none;'
      + 'font-weight:700;font-size:14px">' + c + '</a>';
  }).join('');

  const html =
    '<div style="font:15px/1.6 -apple-system,BlinkMacSystemFont,\'Segoe UI\',sans-serif;color:#23291F;max-width:520px">'
    + '<p>Hi ' + ontsnap(voornaam) + ',</p>'
    + '<p>Three weeks ago we introduced you to an alumni. We\'d like to know whether '
    + 'it was worth your time. It tells us who to keep asking, and how to make the '
    + 'next introduction better.</p>'
    + '<p style="margin-bottom:8px"><b>How useful was it?</b><br>'
    + '<span style="font-size:13px;color:#666">1 = not at all, 10 = really helped me</span></p>'
    + '<p style="margin:0 0 4px">' + knoppen + '</p>'
    + '<p style="font-size:13px;color:#666">One click is enough. On the page that opens '
    + 'you can tell us how it went, but you don\'t have to.</p>'
    + '<p>Thanks,<br>' + AFZENDERNAAM + '</p></div>';

  const tekst = [
    'Hi ' + voornaam + ',',
    '',
    'Three weeks ago we introduced you to an alumni. We\'d like to know whether it',
    'was worth your time.',
    '',
    'How useful was it? 1 = not at all, 10 = really helped me.',
    'Click the number that fits:',
    '',
  ].concat(cijfers.map(function (c) {
    return '  ' + (c < 10 ? ' ' : '') + c + '  ' + feedbackLink(ref, c);
  })).concat([
    '',
    'One click is enough. On the page that opens you can tell us how it went,',
    'but you don\'t have to.',
    '',
    'Thanks,',
    AFZENDERNAAM,
    ONTVANGER,
  ]).join('\n');

  MailApp.sendEmail({
    to: email,
    subject: 'How did it go with the alumni we introduced you to?',
    body: tekst,
    htmlBody: html,
    name: AFZENDERNAAM,
    replyTo: ONTVANGER,
  });
}

/* De pagina achter een cijferknop. Het cijfer is op dat moment al bewaard;
   het tekstvak is een extraatje. */
function loketFeedbackPagina(token) {
  const p = leesToken(token, 'feedback');
  if (!p) return loketPagina('This link no longer works',
    'It has expired. Just reply to our mail instead, we read everything.');

  const rij = vindIntroductie(p.ref);
  if (!rij) return loketPagina('We can\'t find that request',
    'Reply to our mail and we\'ll sort it out.');

  const cijfer = Math.max(1, Math.min(10, parseInt(p.keuze, 10) || 0));
  const alGegeven = !!String(rij.beantwoordOp).trim();

  // Het cijfer meteen vastleggen. Wie hierna niets meer doet, heeft toch
  // geantwoord; alleen de toelichting ontbreekt dan.
  metSlot(function () { bewaarFeedback(p.ref, cijfer, null); });

  // De vraag gaat over het contact zelf en niet over ons proces. Het cijfer
  // zegt al of het nuttig was; wat we hier willen weten is wat er in dat
  // contact gebeurde. Wat wij anders moeten doen staat er als bijzin achter.
  // Geen naam van de alumnus erin: die is een student na drie weken misschien
  // al kwijt, en dan is de vraag verwarrend in plaats van behulpzaam.
  return loketPagina(
    'Thanks, you gave it a ' + cijfer + ' out of 10',
    (alGegeven ? 'We\'ve updated your score. ' : '')
    + 'One more thing, if you have a minute: how did it go with the alumni we '
    + 'introduced you to? What they told you, and whether it got you further. '
    + 'And if there is something we should do differently, put that in at the end.',
    '<form method="post" action="' + webAdres() + '">'
    + '<input type="hidden" name="formulier" value="loketfeedback">'
    + '<input type="hidden" name="token" value="' + ontsnap(token) + '">'
    + '<textarea name="tekst" rows="5" placeholder="Did they write back, did you '
    + 'speak, what did you take from it?"></textarea>'
    + '<button type="submit">Send</button>'
    + '</form>');
}

/* Wordt aangeroepen vanuit doPost als het tekstvak wordt verstuurd. */
function loketFeedbackOpslaan(parameter) {
  const p = leesToken(parameter.token, 'feedback');
  if (!p) return loketPagina('This link no longer works', 'Just reply to our mail instead.');

  const cijfer = Math.max(1, Math.min(10, parseInt(p.keuze, 10) || 0));
  const tekst = tekstOf(parameter.tekst, '');
  metSlot(function () { bewaarFeedback(p.ref, cijfer, tekst); });

  return loketPagina('Thank you',
    tekst
      ? 'We\'ve got it. This is exactly what we use to make the next introduction better.'
      : 'Your score is in. You can close this window.');
}

/* Schrijft cijfer en toelichting weg. Een tweede klik op een ander cijfer
   overschrijft het eerste; wie zich bedenkt, mag dat. Een lege toelichting
   laat een eerder geschreven tekst staan. */
function bewaarFeedback(ref, cijfer, tekst) {
  const blad = bladOp(loketBestand(), LOKET_BLAD_ID, LOKET_BLAD);
  if (!blad) return;
  const rij = vindIntroductie(ref);
  if (!rij) return;

  const kop = blad.getRange(1, 1, 1, blad.getLastColumn()).getValues()[0].map(String);
  const kolom = function (naam) { return kop.indexOf(naam) + 1; };
  if (!kolom('Cijfer')) return;

  blad.getRange(rij.regel, kolom('Cijfer')).setValue(cijfer);
  if (tekst) blad.getRange(rij.regel, kolom('Wat beter kan')).setValue(tekst);
  blad.getRange(rij.regel, kolom('Beantwoord op')).setValue(new Date());
}

/* ═══ 9. OVERZICHT VOOR ONSZELF ═════════════════════════════════════
   Voer dit uit in de editor als je wilt zien hoe de lijst ervoor staat:
   wie er vol zit, en welke woorden uit "Fields of interest" nog nergens
   onder vallen. Dat laatste is je lijstje om THEMAS mee aan te vullen.
   ═══════════════════════════════════════════════════════════════════ */
/* Waarom staat iemand op vol? Laat per alumnus zien wat er letterlijk in de
   frequentiekolom staat, hoe het script dat leest, en hoeveel introducties er
   in de lopende periode al zijn geweest. Zonder argument toont hij iedereen
   die vol zit; geef je een stukje naam mee, dan alleen die persoon. */
function toonRuimte(zoek) {
  const lijst = leesAlumni();
  const gebruikt = introductiesPerAlumnus();
  const filter = String(zoek || '').toLowerCase();

  const tonen = lijst.filter(function (a) {
    return filter ? a.volledigeNaam.toLowerCase().indexOf(filter) !== -1 : a.ruimte.vol;
  });

  if (!tonen.length) {
    console.log(filter ? 'Niemand gevonden met "' + zoek + '" in de naam.'
                       : 'Niemand zit vol.');
    return;
  }

  tonen.forEach(function (a) {
    const freq = frequentieVan(a.frequentie);
    const datums = gebruikt[a.id] || [];
    const nu = new Date();
    const inPeriode = datums.filter(function (d) { return zelfdePeriode(d, nu, freq.periode); });

    console.log(a.volledigeNaam);
    console.log('  in de kolom staat: "' + a.frequentie + '"');
    console.log('  gelezen als:       ' + (freq.aantal >= 99 ? 'geen limiet'
      : freq.aantal + ' per ' + freq.periode));
    console.log('  introducties totaal: ' + datums.length
      + ', waarvan in de lopende ' + freq.periode + ': ' + inPeriode.length);
    inPeriode.forEach(function (d) {
      console.log('    ' + Utilities.formatDate(d, 'Europe/Amsterdam', 'd MMMM yyyy'));
    });
    console.log('  resultaat: ' + (a.ruimte.vol ? 'VOL' : a.ruimte.over + ' plek(ken) over'));
    console.log('');
  });
}

function loketOverzicht() {
  const lijst = leesAlumni();
  console.log(lijst.length + ' alumni met toestemming.');

  const vol = lijst.filter(function (a) { return a.ruimte.vol; });
  console.log(vol.length + ' zitten deze periode vol: '
    + vol.map(function (a) { return a.naam; }).join(', '));

  const zonderThema = lijst.filter(function (a) { return !a.themas.length; });
  if (zonderThema.length) {
    console.log('Zonder enig thema (' + zonderThema.length + '): '
      + zonderThema.map(function (a) { return a.naam + ' [' + a.interessesRuw + ']'; }).join(' · '));
  }

  const rest = {};
  lijst.forEach(function (a) {
    nietHerkend(a.interessesRuw).forEach(function (w) { rest[w] = (rest[w] || 0) + 1; });
  });
  const woorden = Object.keys(rest).sort(function (x, y) { return rest[y] - rest[x]; });
  console.log(woorden.length
    ? 'Nog niet herkend, meest voorkomend eerst: ' + woorden.map(function (w) { return w + ' (' + rest[w] + ')'; }).join(', ')
    : 'Alles herkend.');
}

/* ═══ 10. ZELFTEST ══════════════════════════════════════════════════
   Voer deze functie één keer uit nadat je het loket hebt aangesloten.
   Er wordt niets verstuurd naar echte alumni: de test doet alleen de
   dingen die je zonder post kunt controleren.
   ═══════════════════════════════════════════════════════════════════ */
function zelftestLoket() {
  const blad = alumniBlad();
  console.log(blad
    ? 'Alumni worden gelezen uit bestand "' + blad.getParent().getName()
      + '", tabblad "' + blad.getName() + '".'
    : 'GEEN alumnitabblad gevonden.');
  console.log('Aanvragen worden geschreven in bestand "'
    + loketBestand().getName() + '", tabblad "' + LOKET_BLAD + '".');

  const lijst = leesAlumni();
  if (!lijst.length) {
    console.log('Geen alumni met toestemming gevonden. Controleer of er een kolom met '
      + '"permission" in de koprij staat, en of daar Yes of Ja in staat.');
    return;
  }
  const testprofielen = lijst.filter(function (a) { return a.test; });
  console.log('Gevonden: ' + lijst.length + ' alumni met toestemming, waarvan '
    + testprofielen.length + ' testprofiel(en): '
    + (testprofielen.map(function (a) { return a.naam; }).join(', ') || 'geen'));
  console.log('Studenten zien er ' + openbareLijst(false).length + '.');
  console.log('Eerste profiel zoals de site het krijgt:');
  console.log(JSON.stringify(openbareLijst()[0], null, 2));

  const token = maakToken('besluit', 'TEST-000', lijst[0].id, TOKEN_DAGEN);
  const goed = leesToken(token, 'besluit');
  const fout = leesToken(token, 'feedback');   // hoort null te zijn
  console.log(goed && goed.ref === 'TEST-000' && !fout
    ? 'Ondertekende links werken, en een besluitlink telt niet als cijferlink.'
    : 'LET OP: de ondertekening klopt niet.');

  console.log('Adres van dit script: ' + webAdres());
  console.log('Dat hoort hetzelfde te zijn als FORM_ENDPOINT in data.js;'
    + ' de lijst en de formulieren gebruiken één adres.');
}
