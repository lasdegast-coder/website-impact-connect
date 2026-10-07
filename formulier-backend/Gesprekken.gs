/* ===================================================================
   Gesprekken inplannen
   ===================================================================
   In het afspraakformulier kiest een student een tijdslot. Dit bestand
   bepaalt welke sloten er zijn, kijkt in de agenda welke al bezet zijn, en
   zet een gekozen gesprek in die agenda met de student als gast. De student
   krijgt daardoor ook een agenda-uitnodiging.

   De agenda heet "Gesprekken" en hoort bij het contact@-account. Hij is
   gedeeld met Zoya en Noah, zodat zij de afspraken zien. Wat erin staat
   bepaalt wat de site laat zien:
     - elk gesprek dat via de site is geboekt telt mee voor het maximum
       per dag;
     - elke afspraak in die agenda, ook een die je zelf neerzet
       ("Zoya vrij"), maakt de sloten die hij raakt onbeschikbaar. Een hele
       dag dicht: zet er een afspraak voor de hele dag in;
     - verwijder of verplaats je een gesprek, dan komt dat slot vanzelf
       weer vrij.

   Eén keer nodig nadat dit bestand erbij is gekomen: voer agendaTest() uit
   in de Apps Script-editor. Google vraagt dan toestemming om de agenda te
   gebruiken. Zolang dat niet is gebeurd werkt géén enkel formulier, want
   Google vraagt die toestemming voor het hele script tegelijk.
   =================================================================== */

const AGENDA_NAAM = 'Gesprekken';
const GESPREK_PLEK = 'The Playground in Building VMC';
const TIJDZONE = 'Europe/Amsterdam';

/* Het vaste rooster. dag: 1 = maandag, 2 = dinsdag, ... 5 = vrijdag.
   van en tot zijn hele uren; tot 17 betekent dat het laatste slot om 16:00
   begint. Een slot is een uur: GESPREK_MINUTEN gesprek en de rest van het uur
   als uitloop. De student kiest dus altijd een heel uur.
   "wie" komt in de titel van de afspraak. Op woensdag is een van de twee er;
   wie het gesprek doet zet zijn naam er zelf in. */
const SPREEKUUR = [
  { dag: 2, van: 9,  tot: 17, wie: 'Zoya' },
  { dag: 3, van: 15, tot: 17, wie: 'Zoya/Noah' },
  { dag: 4, van: 13, tot: 17, wie: 'Noah' },
];
const SPREEKUUR_WEKEN = 3;           // zoveel hele weken ziet een student
const SPREEKUUR_MINIMAAL_UUR = 48;   // zo kort van tevoren op z'n vroegst
const SPREEKUUR_MAX_PER_DAG = 3;     // meer gesprekken op één dag kan niet
const GESPREK_MINUTEN = 45;

/* Uit de gewone agenda van het account tellen alleen korte afspraken mee: een
   overleg of een pitch sluit een uur, maar een werksessie van negen tot vijf
   of een afspraak van de hele dag niet. Anders is het spreekuur op zo'n dag
   meteen helemaal weg. Wil je een dag echt dicht, zet dan een afspraak in de
   agenda "Gesprekken"; daar blokkeert alles. */
const EIGEN_AGENDA_MAX_UREN = 4;

/* Zo herkent het script een gesprek dat via de site is geboekt. Alleen die
   tellen mee voor het maximum per dag; een eigen afspraak ("Zoya vrij")
   maakt wel sloten dicht, maar is geen gesprek. */
const GESPREK_LABEL = 'impactconnect';

function gesprekAgenda() {
  const lijst = CalendarApp.getCalendarsByName(AGENDA_NAAM);
  if (lijst.length) return lijst[0];
  // Een spatie achter de naam of een andere hoofdletter zie je in Google
  // Agenda niet, maar dan vindt de gewone zoekopdracht hem niet.
  const gezocht = AGENDA_NAAM.trim().toLowerCase();
  const alle = CalendarApp.getAllCalendars().filter(function (a) {
    return a.getName().trim().toLowerCase() === gezocht;
  });
  return alle.length ? alle[0] : null;
}

function gesprekTwee(n) {
  return (n < 10 ? '0' : '') + n;
}

/* Een datum als "2026-09-22" plus een tijd, in Nederlandse tijd. */
function gesprekMoment(dag, uur, minuut) {
  return Utilities.parseDate(dag + ' ' + gesprekTwee(uur) + ':' + gesprekTwee(minuut),
    TIJDZONE, 'yyyy-MM-dd HH:mm');
}

function gesprekDag(d) {
  return Utilities.formatDate(d, TIJDZONE, 'yyyy-MM-dd');
}

/* 1 = maandag ... 7 = zondag */
function gesprekWeekdag(d) {
  return Number(Utilities.formatDate(d, TIJDZONE, 'u'));
}

function gesprekRegel(weekdag) {
  for (let i = 0; i < SPREEKUUR.length; i++) {
    if (SPREEKUUR[i].dag === weekdag) return SPREEKUUR[i];
  }
  return null;
}

/* "Tuesday 22 September, 09:00–09:30" */
function gesprekTekst(van) {
  const tot = new Date(van.getTime() + GESPREK_MINUTEN * 60000);
  return Utilities.formatDate(van, TIJDZONE, 'EEEE d MMMM, HH:mm')
    + '–' + Utilities.formatDate(tot, TIJDZONE, 'HH:mm');
}

/* ---- wat een uur bezet maakt ----------------------------------------
   Twee agenda's tellen mee:
     - "Gesprekken": daar blokkeert alles, ook een afspraak van de hele dag;
     - de gewone agenda van het contact@-account: daar blokkeren alleen
       afspraken korter dan EIGEN_AGENDA_MAX_UREN.
   Een afspraak die je hebt afgewezen telt nooit mee; anders blokkeert een
   uitnodiging waar je "nee" op hebt gezegd alsnog een uur. Alleen gesprekken
   uit "Gesprekken" tellen mee voor het maximum per dag.

   Geeft alles terug wat er in de agenda's staat, met per afspraak of hij
   blokkeert. agendaTest laat daarmee ook zien wat er genegeerd wordt.
   ------------------------------------------------------------------- */
function gesprekBlokkades(agenda, van, tot) {
  const agendas = [agenda];
  const eigen = CalendarApp.getDefaultCalendar();
  if (eigen && eigen.getId() !== agenda.getId()) agendas.push(eigen);

  const blokken = [];
  agendas.forEach(function (a) {
    const isGesprekkenAgenda = a.getId() === agenda.getId();
    a.getEvents(van, tot).forEach(function (e) {
      let afgezegd = false;
      // Niet elke afspraak heeft gasten; dan geeft getMyStatus een fout.
      try { afgezegd = e.getMyStatus() === CalendarApp.GuestStatus.NO; } catch (err) { afgezegd = false; }
      if (afgezegd) return;
      const van2 = e.getStartTime().getTime();
      const tot2 = e.getEndTime().getTime();
      const langOfHeleDag = e.isAllDayEvent() || (tot2 - van2) >= EIGEN_AGENDA_MAX_UREN * 3600000;
      blokken.push({
        van: van2,
        tot: tot2,
        gesprek: isGesprekkenAgenda && e.getTag(GESPREK_LABEL) === 'gesprek',
        titel: e.getTitle(),
        waar: a.getName(),
        blokkeert: isGesprekkenAgenda || !langOfHeleDag,
      });
    });
  });
  return blokken;
}

/* ---- welke sloten er vrij zijn ---------------------------------------
   Geeft alle spreekuurdagen van SPREEKUUR_WEKEN hele weken terug, met per
   dag de vrije sloten. De eerste week is de eerste waarin na de 48 uur nog
   iets te kiezen valt. Dagen die al te dichtbij zijn blijven erin staan,
   zodat een student altijd drie keer dezelfde drie dagen ziet.
   ------------------------------------------------------------------- */
function gesprekDagen(nu, agenda) {
  const vroegst = nu.getTime() + SPREEKUUR_MINIMAAL_UUR * 3600000;

  // Rekenen vanaf twaalf uur 's middags: dan schuift een wissel naar zomer-
  // of wintertijd nooit een dag op.
  const middag = gesprekMoment(gesprekDag(nu), 12, 0);
  function plusDagen(d, n) { return new Date(d.getTime() + n * 86400000); }

  let eerste = null;
  for (let i = 0; i < 14 && !eerste; i++) {
    const d = plusDagen(middag, i);
    const regel = gesprekRegel(gesprekWeekdag(d));
    if (regel && gesprekMoment(gesprekDag(d), regel.tot - 1, 0).getTime() >= vroegst) eerste = d;
  }
  if (!eerste) return [];
  const maandag = plusDagen(eerste, -(gesprekWeekdag(eerste) - 1));
  const na = plusDagen(maandag, SPREEKUUR_WEKEN * 7);

  // Alle afspraken in die weken in één keer ophalen, uit beide agenda's.
  const blokken = gesprekBlokkades(agenda,
    gesprekMoment(gesprekDag(maandag), 0, 0), gesprekMoment(gesprekDag(na), 0, 0));

  const dagen = [];
  for (let i = 0; i < SPREEKUUR_WEKEN * 7; i++) {
    const d = plusDagen(maandag, i);
    const regel = gesprekRegel(gesprekWeekdag(d));
    if (!regel) continue;
    const dag = gesprekDag(d);
    const begin = gesprekMoment(dag, 0, 0).getTime();
    const eind = begin + 86400000;

    const gesprekken = blokken.filter(function (b) {
      return b.gesprek && b.van >= begin && b.van < eind;
    }).length;
    const vol = gesprekken >= SPREEKUUR_MAX_PER_DAG;

    const vrij = [];
    let allesTeVroeg = true;
    for (let uur = regel.van; uur < regel.tot; uur++) {
      const van = gesprekMoment(dag, uur, 0).getTime();
      const tot = van + 3600000;
      const teVroeg = van < vroegst;
      if (!teVroeg) allesTeVroeg = false;
      const bezet = blokken.some(function (b) { return b.blokkeert && b.van < tot && b.tot > van; });
      if (!bezet && !vol && !teVroeg) vrij.push(dag + 'T' + gesprekTwee(uur) + ':00');
    }
    dagen.push({
      datum: dag,
      wie: regel.wie,
      vrij: vrij,
      reden: vrij.length ? null : (allesTeVroeg ? 'tekort' : 'vol'),
    });
  }
  return dagen;
}

/* Wat de website opvraagt met ?lijst=tijden. Alleen datums en tijden, geen
   namen van studenten en geen titels uit de agenda. */
function gesprekTijden() {
  try {
    const agenda = gesprekAgenda();
    if (!agenda) return { ok: false, fout: 'Geen agenda "' + AGENDA_NAAM + '" gevonden.' };
    const dagen = gesprekDagen(new Date(), agenda).map(function (d) {
      return { datum: d.datum, vrij: d.vrij, reden: d.reden };
    });
    return { ok: true, plek: GESPREK_PLEK, duur: GESPREK_MINUTEN, dagen: dagen };
  } catch (err) {
    console.error(err);
    return { ok: false };
  }
}

/* ---- een slot boeken -------------------------------------------------
   Wordt aangeroepen vanuit doPost, binnen het slot (metSlot), zodat twee
   studenten die tegelijk hetzelfde tijdstip kiezen het niet allebei krijgen.
   Kijkt opnieuw in de agenda; wat de browser eerder zag kan verouderd zijn.

   Geeft terug:
     { status: 'geboekt',  tekst }   in de agenda gezet, uitnodiging verstuurd
     { status: 'bezet' }             niet (meer) vrij, of geen geldig slot
     { status: 'mislukt', tekst, reden }  wel een geldig slot, maar de agenda
                                     lukte niet; de aanvraag komt gewoon binnen
   ------------------------------------------------------------------- */
function gesprekBoeken(d) {
  const sleutel = String(d.tijdslot || '');
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:00$/.test(sleutel)) return { status: 'bezet' };
  const dag = sleutel.slice(0, 10);
  const van = gesprekMoment(dag, Number(sleutel.slice(11, 13)), 0);
  const tekst = gesprekTekst(van);

  const agenda = gesprekAgenda();
  if (!agenda) return { status: 'mislukt', tekst: tekst, reden: 'geen agenda "' + AGENDA_NAAM + '"' };

  const dagen = gesprekDagen(new Date(), agenda);
  let gevonden = null;
  for (let i = 0; i < dagen.length; i++) if (dagen[i].datum === dag) gevonden = dagen[i];
  if (!gevonden || gevonden.vrij.indexOf(sleutel) === -1) return { status: 'bezet' };

  const naam = tekstOf(d.naam, 'student');
  // Een kenmerk per gesprek. Het staat op de afspraak én op de regel in de
  // sheet, zodat de opvolging later weet over welk gesprek het gaat.
  const ref = 'GSP-' + Utilities.formatDate(van, TIJDZONE, 'yyyyMMdd-HHmm') + '-'
    + Utilities.getUuid().slice(0, 4);
  const afspraak = agenda.createEvent(
    'Impact Connect × ' + naam + ' (' + gevonden.wie + ')',
    van,
    new Date(van.getTime() + GESPREK_MINUTEN * 60000),
    {
      location: GESPREK_PLEK,
      description: gesprekOmschrijving(d),
      guests: d.email,
      sendInvites: true,
    });
  afspraak.setTag(GESPREK_LABEL, 'gesprek');
  afspraak.setTag('ref', ref);
  d.ref = ref;
  d.gesprekOp = van;
  d.door = gevonden.wie;
  return { status: 'geboekt', tekst: tekst };
}

/* De omschrijving in de agenda. Die ziet de student ook, dus hierin staat
   alleen wat hij zelf heeft ingevuld. */
function gesprekOmschrijving(d) {
  return ['A ' + GESPREK_MINUTEN + '-minute conversation with Impact Connect at ' + GESPREK_PLEK + '.', '']
    .concat(antwoordRegels('afspraak', d))
    .concat(['', 'Can\'t make it? Reply to your confirmation email, or write to ' + ONTVANGER + '.'])
    .join('\n');
}

/* ---- zelftest voor de agenda -------------------------------------------
   Voer deze functie één keer uit in de Apps Script-editor. Google vraagt
   dan toestemming voor de agenda. Er wordt niets geboekt; je ziet in het
   logboek welke tijden de site nu zou tonen.
   ------------------------------------------------------------------- */
function agendaTest() {
  // Het id van de hoofdagenda is het mailadres van het account.
  console.log('Dit script draait als: ' + CalendarApp.getDefaultCalendar().getId());
  const agenda = gesprekAgenda();
  if (!agenda) {
    console.log('Geen agenda met de naam "' + AGENDA_NAAM + '" gevonden in dit account.');
    console.log('Agenda\'s die dit account wel ziet: ' + CalendarApp.getAllCalendars()
      .map(function (a) { return '"' + a.getName() + '"'; }).join(', '));
    return;
  }
  console.log('Agenda gevonden: ' + agenda.getName());
  const dagen = gesprekDagen(new Date(), agenda);
  dagen.forEach(function (d) {
    console.log(d.datum + ' (' + d.wie + '): '
      + (d.vrij.length ? d.vrij.map(function (s) { return s.slice(11); }).join(' ') : d.reden));
  });

  // Wat er in die weken tijd dichthoudt, en uit welke agenda het komt.
  if (!dagen.length) return;
  const van = gesprekMoment(dagen[0].datum, 0, 0);
  const tot = new Date(gesprekMoment(dagen[dagen.length - 1].datum, 0, 0).getTime() + 86400000);
  const blokken = gesprekBlokkades(agenda, van, tot);
  console.log('Afspraken die tijd dichthouden: '
    + blokken.filter(function (b) { return b.blokkeert; }).length
    + ' (en ' + blokken.filter(function (b) { return !b.blokkeert; }).length + ' genegeerd)');
  blokken.forEach(function (b) {
    console.log('   ' + Utilities.formatDate(new Date(b.van), TIJDZONE, 'EEE d MMM HH:mm')
      + '-' + Utilities.formatDate(new Date(b.tot), TIJDZONE, 'HH:mm')
      + '  [' + b.waar + ']  ' + b.titel
      + (b.gesprek ? '  (geboekt gesprek)' : '')
      + (b.blokkeert ? '' : '  → GENEGEERD, te lang of hele dag'));
  });
}
