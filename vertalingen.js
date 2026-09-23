/* ═══════════════════════════════════════════════════════════════════
   TWEE TALEN
   ═══════════════════════════════════════════════════════════════════

   De site staat in het Engels; het Nederlands komt hiervandaan.

   Hoe het werkt, in het kort:

   1. In de HTML staat de Engelse tekst gewoon leesbaar op zijn plek, met
      een sleutel ernaast:

          <a class="nav-link" data-t="nav.home" href="index.html">Home</a>

      Het Engels blijft dus staan waar je het verwacht. Wil je een Engelse
      zin veranderen, dan doe je dat in de HTML zoals altijd. Alleen het
      Nederlands staat in dit bestand.

   2. Teksten die script.js zelf maakt (de formulieren, het detailpaneel,
      de kaartjes) staan er wél in twee talen in, want daar is geen HTML
      om het Engels uit te halen. Die herken je aan het feit dat er een
      `en` bij staat.

   3. Wisselen van taal herlaadt de pagina. Dat is met opzet: de helft van
      wat je ziet wordt door script.js opgebouwd, en een halve pagina
      omzetten gaat een keer mis. De keuze staat in localStorage, dus je
      bent meteen weer waar je was en het onthoudt het de volgende keer.

   Iets vertalen dat er nog niet in staat? Zet de sleutel in de HTML en de
   Nederlandse zin hieronder. Open de site daarna met ?check=taal in de
   adresbalk, dan somt de console op welke sleutels nog missen.
═══════════════════════════════════════════════════════════════════ */

const TALEN = ["en", "nl"];
const TAAL_OPSLAG = "impact-connect:taal";
const STANDAARDTAAL = "en";

/* ── Staat het Nederlands aan? ───────────────────────────────────────
   De vertaling is af, maar mag nog niet naar buiten. Staat dit uit, dan
   verdwijnt het NL-knopje uit de balk en blijft de site Engels, ook als
   iemand ?lang=nl in het adres zet of eerder Nederlands had gekozen.

   Dit hoort hier en niet in data.js, want dit bestand wordt eerder
   ingeladen en bepaalt de taal al bij het opstarten.

   Zodra het mag: zet hier true neer. Verder hoeft er niets te gebeuren,
   alle vertalingen staan gewoon hieronder klaar.                       */
const NEDERLANDS_LIVE = false;

/* De vertalingen. Per sleutel altijd `nl`, en `en` alleen als de tekst
   niet uit de HTML te halen is (dus voor alles wat script.js maakt). */
const VERTALINGEN = {

  /* ── menubalk en voettekst, op alle acht de pagina's hetzelfde ── */
  "nav.skip":          { nl: "Naar de inhoud" },
  "nav.home":          { nl: "Home" },
  "nav.programmes":    { nl: "Programma's" },
  "nav.events":        { nl: "Events" },
  "nav.alumni":        { nl: "Vraag het een alumni" },
  "nav.internships":   { nl: "Stages" },
  "nav.about":         { nl: "Over ons" },
  "nav.appointment":   { nl: "Plan een afspraak", en: "Plan an appointment" },
  "nav.menu":         { en: "Open the menu", nl: "Open het menu" },
  "nav.uu":            { nl: "Universiteit<br />Utrecht" },

  "footer.blurb":      { nl: "We slaan een brug tussen studenten en kansen, en maken van passie impact nog voordat je afstudeert." },
  "footer.internships": { nl: "Stages" },
  "footer.partner":    { nl: "Partnerstages" },
  "footer.thesis":     { nl: "Afstudeerstages" },
  "footer.other":      { nl: "Overige stages" },
  "footer.programmes": { nl: "Programma's" },
  "footer.explore":    { nl: "Ontdekken" },
  // Home, Events en "Vraag een alumni" staan in de voettekst precies zoals
  // in de balk, dus die delen de nav-sleutels hierboven. Alleen "About us"
  // is anders dan "About" en heeft daarom een eigen regel.
  "footer.about":      { nl: "Over ons" },
  "footer.uu":         { nl: "Ondersteund door de Universiteit Utrecht · Faculteit Geowetenschappen" },

  /* ── homepage ──────────────────────────────────────────────────
     De kop is opgesplitst in drie regels omdat hij op de pagina ook in
     drie regels binnenrolt. In het Nederlands valt de klemtoon anders,
     dus staat "impact" hier op regel 1 in plaats van regel 2. */
  "titel.home":        { nl: "Impact Connect" },
  "omschrijving.home": { nl: "Impact Connect helpt studenten aan ervaring naast hun studie, ook als je nog niet weet wat je wilt doen." },
  "home.hero1":        { nl: "Vind je" },
  "home.hero2":        { nl: "<span class=\"ital\">impact</span> naast" },
  "home.hero3":        { nl: "je studie." },
  /* "come talk to us for a real introduction" stond hier eerst als "voor een
     echte introductie". Dat is woord voor woord vertaald en zo zegt niemand
     het; bovendien klinkt "introductie" alsof je aan iemand wordt voorgesteld,
     terwijl dat lang niet altijd gebeurt (zie stap 03). Het gaat erom dat er
     een mens tegenover je zit die met je meedenkt. */
  "home.lead":         { nl: "Impact Connect <b>brengt Utrechtse studenten in contact met stages, scripties, programma's, events en alumni.</b> Kijk vrij rond, of kom langs, dan helpen we je persoonlijk verder." },

  "home.tick.stages":  { nl: "STAGES <i>✦</i>" },
  "home.tick.thesis":  { nl: "AFSTUDEERSTAGES <i>✦</i>" },
  "home.tick.werk":    { nl: "WERKSTUDENTBANEN <i>✦</i>" },
  "home.tick.prog":    { nl: "PROGRAMMA'S <i>✦</i>" },
  "home.tick.events":  { nl: "EVENTS <i>✦</i>" },
  "home.tick.alumni":  { nl: "ALUMNI <i>✦</i>" },

  "home.geen.kop":     { nl: "We zijn geen vacaturebank<span class=\"dot-clay\">.</span>" },
  "home.geen.lead":    { nl: "Impact Connect is een matchingprogramma. Alles op deze site is er om je te laten zien wat er mogelijk is; het echte werk begint zodra je bij ons aanschuift." },
  "home.stap1.kop":    { nl: "Rondkijken" },
  "home.stap1.tekst":  { nl: "Blader door stages, programma's, events en alumni. Gratis, en zonder account." },
  "home.stap2.kop":    { nl: "Kom langs" },
  "home.stap2.tekst":  { nl: "Een half uur met een student die precies weet waar jij nu zit. Je hoeft geen plan of cv mee te nemen, daar is het gesprek juist voor." },
  /* Stap 03 beloofde eerst dat we je persoonlijk voorstellen aan "de
     partner, het programma of de alumni". Bij een programma gebeurt dat
     niet: daar geven we richting en meld je je zelf aan. Bij een alumni of
     een partner leggen we het contact wel. Nu staat het er zoals het is. */
  "home.stap3.kop":    { nl: "Je krijgt richting" },
  "home.stap3.tekst":  { nl: "Je gaat weg met concrete programma's, plekken en mensen die bij je passen. En waar een introductie helpt, bij een van onze alumni of bij een partner, leggen wij het contact." },

  "home.ingangen.kop": { nl: "Vier ingangen<span class=\"dot-clay\">.</span>" },
  "home.in1.kop":      { nl: "Programma's" },
  "home.in1.tekst":    { nl: "Selectieve programma's die je vaardigheden en je cv opbouwen, kom er met ons over praten" },
  "home.in2.kop":      { nl: "Events" },
  "home.in2.tekst":    { nl: "Congressen, banenbeurzen en festivals vol mensen met dezelfde passie als jij" },
  "home.in3.kop":      { nl: "Vraag het een alumni" },
  "home.in3.tekst":    { nl: "Vertel ons met wie je wilt praten, wij gaan onze lijst langs en geven je hun gegevens" },
  "home.in4.kop":      { nl: "Stages" },
  "home.in4.tekst":    { nl: "Partnerstages, afstudeerstages en werkstudentbanen, wij leggen het contact" },

  "home.events.kop":   { nl: "Binnenkort<span class=\"dot-clay\">.</span>" },
  "home.events.alle1": { nl: "Bekijk alle" },
  "home.events.alle2": { nl: "events" },

  "home.slot.kop":     { nl: "Het begint<br />als je bij ons <em>aanschuift</em>." },
  "home.slot.tekst":   { nl: "Kijk zo veel rond als je wilt. En wil je meer dan rondkijken, plan dan een afspraak: een half uur, zonder plan, en we gaan met de hand langs wat bij je past." },

  /* ── events ────────────────────────────────────────────────────
     "Events" laten we staan: dat zegt iedereen zo, en "evenementen"
     klinkt als een gemeentelijke agenda. */
  "titel.events":        { nl: "Events · Impact Connect" },
  "omschrijving.events": { nl: "Congressen, banenbeurzen en festivals door heel Nederland voor studenten die impact willen maken." },
  "ev.tag":            { nl: "Events, Impact Connect" },
  "ev.kop":            { nl: "Events<i>.</i>" },
  "ev.lead":           { nl: "Congressen, banenbeurzen en festivals door heel Nederland, de meeste gratis voor studenten. Ze worden allemaal als eerste aangekondigd in onze WhatsApp-community." },
  // script.js bouwt deze knop nu zelf op (paintJoin), dus moet het
  // Engels er ook in staan; uit de HTML halen kan niet meer.
  "ev.join":           { en: "Join the community", nl: "Word lid van de community" },
  "ev.join.thema":     { en: "Join the {thema} group", nl: "Word lid van de groep {thema}" },
  "ev.linkvolgt":      { en: "Community link coming soon", nl: "Community-link volgt binnenkort" },
  "ev.gratis":         { nl: "Gratis, en je kunt er altijd weer uit." },
  "ev.qrsoon":         { nl: "QR VOLGT" },
  "ev.scan":           { nl: "Scan om lid te worden" },
  "ev.tip.kop":        { nl: "Weet je een event dat hier mist?" },
  "ev.tip.tekst":      { nl: "We houden deze agenda met de hand bij, dus hij is zo goed als wat we te horen krijgen. Mis je iets? Stuur het ons." },
  "ev.tip.knop":       { nl: "Tip ons een event" },

  /* ── programma's ───────────────────────────────────────────────── */
  "titel.programmes":        { nl: "Programma's · Impact Connect" },
  "omschrijving.programmes": { nl: "Programma's die je vaardigheden, je netwerk en je cv opbouwen." },
  "prog.kop":          { nl: "Programma's<i>.</i>" },
  "prog.lead1":        { nl: "Ruim" },
  "prog.lead2":        { nl: "programma's die je vaardigheden, je netwerk en een cv opbouwen waarmee deuren opengaan, van vrijwilligerswerk tot betaalde fellowships. De details bewaren we voor een gesprek, want een goede match begint bij <em>jou</em> leren kennen." },
  "prog.hint":         { nl: "Hou je muis erboven voor een voorproefje, klik om het gesprek te beginnen." },
  "prog.rechten":      { nl: "De organisaties hier zijn degenen die deze programma's draaien. We noemen ze zodat studenten weten dat ze bestaan, niet omdat ze met ons samenwerken. Hun namen en logo's zijn van henzelf. Liever niet vermeld? Mail <a href=\"mailto:contact@impactconnectutrecht.com\">contact@impactconnectutrecht.com</a> en we halen het weg." },
  "prog.cta.kop":      { nl: "Word je <span class=\"ital\" style=\"font-weight:500\">enthousiast</span> van deze programma's?" },
  "prog.cta.tekst":    { nl: "Kom langs. We zoeken samen uit welk programma bij je ambities past, en helpen je erin te komen." },
  "prog.cta.knop":     { nl: "Kom met ons praten" },

  /* ── de drie stagepagina's ─────────────────────────────────────── */
  "sub.partner":       { nl: "Partnerstages" },
  "sub.thesis":        { nl: "Afstudeerstages" },
  "sub.other":         { nl: "Overige stages" },
  "filter.betaald":    { nl: "Alleen betaald" },
  "filter.zoek":       { nl: "Zoeken…" },
  "banner.kop":        { nl: "Weet je niet waar je moet beginnen?" },
  "banner.tekst":      { nl: "Plan een afspraak, dan laten we je de programma's uit onze database zien die bij je ambities passen." },

  "titel.listing.partner":        { nl: "Partnerstages · Impact Connect" },
  "omschrijving.listing.partner": { nl: "Plekken bij organisaties waar we rechtstreeks mee werken; wij stellen je persoonlijk voor." },
  "titel.listing.thesis":         { nl: "Afstudeerstages · Impact Connect" },
  "omschrijving.listing.thesis":  { nl: "Schrijf je scriptie bij een van onze partners, met begeleiding van twee kanten." },
  "titel.listing.other":          { nl: "Overige stages · Impact Connect" },
  "omschrijving.listing.other":   { nl: "Stages die we gevonden hebben en goed vinden; nog geen partnerschap, dus je solliciteert zelf." },
  "stage.partner.kop":  { nl: "Partnerstages<i>.</i>" },
  "stage.partner.lead": { nl: "Plekken bij organisaties waar we rechtstreeks mee werken; laat weten dat je interesse hebt en we stellen je persoonlijk voor" },
  "stage.thesis.kop":   { nl: "Afstudeerstages<i>.</i>" },
  "stage.thesis.lead":  { nl: "Schrijf je scriptie bij een van onze partners, kies een uitgewerkt onderwerp of breng je eigen vraag mee, wij leggen het contact" },
  "stage.other.kop":    { nl: "Overige stages<i>.</i>" },
  "stage.other.lead":   { nl: "Stages die we gevonden hebben en goed vinden; nog geen partnerschap, dus je solliciteert zelf" },
  "thesis.cop.tag":     { nl: "Inspiratie nodig voor je scriptie?" },
  "thesis.cop.tekst":   { nl: "Blader interactief door echte studentenscripties, een goede plek om ideeën op te doen voor je eigen onderzoek." },
  "thesis.cop.knop":    { nl: "Open de explorer" },

  /* ── over ons ──────────────────────────────────────────────────── */
  "titel.about":        { nl: "Over ons · Impact Connect" },
  "omschrijving.about": { nl: "Impact Connect helpt studenten aan ervaring naast hun studie, ook als je nog niet weet wat je wilt doen." },
  "ab.kop":            { nl: "Over ons<span class=\"dot-clay\">.</span>" },
  "ab.foto":           { nl: "Het team van Impact Connect" },
  "ab.intro1":         { nl: "Impact Connect helpt Utrechtse studenten aan ervaring naast hun studie. Opgezet door studenten en ondersteund door de Universiteit Utrecht zoeken we met de hand stages, afstudeerplekken, events en programma's uit, en gaan we daarna met je om tafel om te kijken welke jouw tijd waard is." },
  "ab.intro2":         { nl: "De meeste studenten weten nog niet wat ze willen doen. Dat is niet iets om eerst uit te zoeken; het is juist de reden om te beginnen, want door het te doen kom je erachter. We vragen dus niet of je met een plan komt. Vertel waar je nieuwsgierig naar bent, dan pakken wij het op." },
  "ab.waarom.kop":     { nl: "Het probleem dat we proberen op te lossen<span class=\"dot-green\">.</span>" },
  "ab.waarom.lead":    { nl: "Ambitie is zelden het probleem bij studenten. Weten wat je ermee moet wel. Vier dingen zitten in de weg." },
  "ab.k1.kop":         { nl: "Je weet het nog niet" },
  "ab.k1.tekst":       { nl: "Je komt erachter wat bij je past door iets te dóen. Maar dat eerste ding regelen is precies wat je niet alleen voor elkaar krijgt, en zonder dat weet je ook niet waar je naar moet zoeken." },
  "ab.k2.kop":         { nl: "Versnipperd" },
  "ab.k2.tekst":       { nl: "Stages, scripties, banen en programma's staan verspreid over tientallen websites, nieuwsbrieven en wat je toevallig van iemand hoort. Er is geen plek waar het bij elkaar staat." },
  "ab.k3.kop":         { nl: "Te laat" },
  "ab.k3.tekst":       { nl: "Van veel van de mooiste plekken horen studenten pas als de deadline al voorbij is, áls ze er al van horen." },
  "ab.k4.kop":         { nl: "Moeilijk te matchen" },
  "ab.k4.tekst":       { nl: "En zelfs als je iets vindt, is het lastig in te schatten of het bij je niveau en je interesses past, zeker als je nog aan het uitzoeken bent wat die precies zijn." },
  "ab.team.kop":       { nl: "Wie je te spreken krijgt<span class=\"dot-green\">.</span>" },
  "ab.team.lead":      { nl: "Wij zijn zelf ook studenten en hebben hetzelfde pad bewandeld. Plan een afspraak en je zit tegenover een van ons." },
  "ab.rol.prog":       { nl: "Programmacoördinator" },
  "ab.rol.partners":   { nl: "Head of partnerships" },
  "ab.rol.promo":      { nl: "Head of promotions" },
  "ab.rol.tech":       { nl: "Technisch coördinator" },
  "ab.cta.kop":        { nl: "Zin om te praten?" },
  "ab.cta.tekst":      { nl: "Twee minuten vragen beantwoorden, dan een echt gesprek. Meer is er niet nodig om gematcht te worden." },

  /* ── vraag een alumni ──────────────────────────────────────────── */
  "titel.alumni":        { nl: "Vraag het een alumni · Impact Connect" },
  "omschrijving.alumni": { nl: "Vertel ons welke alumni je wilt spreken. Impact Connect gaat de lijst langs en stuurt je hun gegevens." },
  "al.kop":            { nl: "Vraag het een alumni<span class=\"dot-clay\">.</span>" },
  "al.lead":           { nl: "De snelste manier om erachter te komen of een vakgebied bij je past, is praten met iemand die er al in zit. Studenten die vóór jou bij ons langskwamen werken nu in klimaatbeleid, consultancy, onderzoek, waterbeheer en hun eigen onderneming, en ze staan open voor de studenten die na hen komen. Kies wie je wilt spreken, vertel ons wat je wilt vragen, en wij stellen jullie per mail aan elkaar voor." },
  "al.routes.kop":     { nl: "Twee manieren om ze te bereiken<span class=\"dot-green\">.</span>" },
  "al.r1.kop":         { nl: "Je weet wie je zoekt" },
  "al.r1.tekst":       { nl: "Kijk wie er op de lijst staat, kies degene wiens pad op het jouwe lijkt, en stuur je vraag. Wij lezen hem, bepalen wie je het beste kan helpen, en stellen jullie per mail aan elkaar voor." },
  "al.r1.meta":        { nl: "Kost twee minuten · we mailen je zo snel mogelijk terug" },
  // Ook de kop van het alumnivenster, dat script.js opbouwt. Zonder
  // Engels stond daar letterlijk "null" op de Engelse site.
  "al.r1.knop":        { en: "See who's on the list", nl: "Bekijk wie er op de lijst staan" },

  /* ── de lijst zelf ─────────────────────────────────────────────── */
  "al.lijst.kop":      { nl: "Wie er op de lijst staan<span class=\"dot-clay\">.</span>" },
  "al.lijst.lead":     { nl: "Dit zijn alumni die ons hebben laten weten dat een student ze mag benaderen. Je ziet wat ze doen en waar ze bij kunnen helpen. Hun contactgegevens blijven bij ons tot jullie echt aan elkaar zijn voorgesteld, zodat niemand een mail uit het niets krijgt." },
  "al.lijst.laden":    { nl: "De lijst wordt opgehaald…" },
  "al.geen.tekst":     { nl: "Staat er niemand tussen die bij je vraag past?" },
  "al.geen.knop":      { en: "Describe who you're after instead", nl: "Beschrijf dan wie je zoekt" },
  "al.r2.kop":         { nl: "Je weet nog niet wie je nodig hebt" },
  "al.r2.tekst":       { nl: "Als de echte vraag is \"wat moet ik eigenlijk gaan doen?\", begin dan bij ons. Plan een korte afspraak, we nemen door wat jou drijft, en zoeken samen uit wie het waard is om te spreken." },
  "al.r2.meta":        { nl: "Een gesprek van een half uur met het team" },
  "al.vragen.kop":     { nl: "Waar mensen naar vragen<span class=\"dot-clay\">.</span>" },
  "al.vragen.lead":    { nl: "Van alles eigenlijk. Deze komen het vaakst voorbij. Klik er een aan om je vraag ermee te beginnen." },
  "al.v1":             { nl: "Hoe ben je in dit vakgebied terechtgekomen?" },
  "al.v2":             { nl: "Was de master het waard?" },
  "al.v3":             { nl: "Hoe ziet een gewone werkweek eruit?" },
  "al.v4":             { nl: "Hoe schreef je je scriptie bij een bedrijf?" },
  "al.v5":             { nl: "Zou je het weer zo doen?" },
  "al.v6":             { nl: "Wat had je willen weten in je eerste jaar?" },
  "al.v7":             { nl: "Is er ruimte om er echt impact te maken?" },
  "al.v8":             { nl: "Hoe ben je in het buitenland beland?" },
  "al.hoe.kop":        { nl: "Hoe het werkt<span class=\"dot-green\">.</span>" },
  "al.s1.kop":         { nl: "Jij kiest iemand" },
  "al.s1.tekst":       { nl: "Loop de lijst langs en stuur je vraag naar degene wiens pad op het jouwe lijkt. Twee minuten." },
  "al.s2.kop":         { nl: "Wij lezen hem" },
  "al.s2.tekst":       { nl: "We kijken naar je vraag en naar wie er ruimte heeft. Meestal is dat degene die je koos; soms kennen we iemand die er beter bij past." },
  "al.s3.kop":         { nl: "Wij stellen jullie voor" },
  "al.s3.tekst":       { nl: "Er gaat één mail uit met je vraag en je gegevens, en jij staat in de kopie. Zo heb jij hun adres, en weten zij dat je eraan komt." },
  "al.s4.kop":         { nl: "Jij gaat verder" },
  "al.s4.tekst":       { nl: "Ze kunnen gewoon op Beantwoorden drukken. Willen jullie allebei een gesprek, dan komt dat daarna. Drie weken later sturen we jou één mail: hoe nuttig was het, van 1 tot 10, en wat kon er beter." },
  "al.zelf.kop":       { nl: "Ben je zelf alumni?" },
  "al.zelf.tekst":     { nl: "Heb je hier gestudeerd en vind je het leuk om af en toe van een student te horen, dan zetten we je er graag bij. Stuur ons je LinkedIn, en alleen een telefoonnummer als je wilt dat we dat doorgeven. Verder delen we niets, en jij bepaalt over welke onderwerpen je iets wilt zeggen." },
  "al.zelf.knop":      { nl: "Meld je aan als alumni" },

  /* ── thema's ───────────────────────────────────────────────────
     De Engelse namen staan in THEMES in data.js; hier alleen de
     Nederlandse, zodat er één lijst met thema's blijft. */
  "thema.all":         { nl: "Alle thema's" },
  "thema.energy":      { nl: "Energie" },
  "thema.governance":  { nl: "Bestuur & beleid" },
  "thema.business":    { nl: "Ondernemen & innovatie" },
  "thema.ecology":     { nl: "Ecologie & voedsel" },
  "thema.cities":      { nl: "Duurzame steden" },
  "thema.general":     { nl: "Algemeen" },

  /* ── wat script.js op de eventspagina maakt ──────────────────────
     {n}, {totaal}, {themas} en {gratis} worden ingevuld met getallen.
     Laat ze staan, en zet ze in de zin waar het Nederlands ze wil
     hebben — dat hoeft niet dezelfde plek te zijn als in het Engels. */
  "ev.alle":           { en: "All fields", nl: "Alle vakgebieden" },
  "ev.nextup":         { en: "Next up", nl: "Eerstvolgende" },
  "ev.aanmelden":      { en: "Sign up", nl: "Aanmelden" },
  "ev.geenlink":       { en: "Link to confirm", nl: "Link volgt nog" },
  "ev.telling.alles":  { en: "{totaal} events coming up · {gratis} free for students · kept up by hand",
                         nl: "{totaal} events op komst · {gratis} gratis voor studenten · met de hand bijgehouden" },
  "ev.telling.filter": { en: "{n} of {totaal} events in {themas} · {gratis} free for students",
                         nl: "{n} van de {totaal} events in {themas} · {gratis} gratis voor studenten" },
  "ev.leeg":           { en: "Nothing coming up in that field right now. Pick another one, or join the WhatsApp community and we'll tell you when there is.",
                         nl: "In dat vakgebied staat op dit moment niets op de agenda. Kies een ander, of word lid van de WhatsApp-community, dan laten we het weten zodra er wel iets is." },

  /* ── de "Coming soon" op de drie stagepagina's ─────────────────── */
  "lijst.partner":      { en: "Partner internships", nl: "Partnerstages" },
  "lijst.thesis":       { en: "Thesis internships", nl: "Afstudeerstages" },
  "lijst.other":        { en: "Other internships", nl: "Overige stages" },
  "lijst.soon.partner": { en: "roles at organisations we work with directly, with a personal introduction from us",
                          nl: "plekken bij organisaties waar we rechtstreeks mee werken, met een persoonlijke introductie van ons" },
  "lijst.soon.thesis":  { en: "thesis placements at companies, institutes and ministries, with a supervisor on both sides",
                          nl: "afstudeerplekken bij bedrijven, instituten en ministeries, met begeleiding van twee kanten" },
  "lijst.soon.other":   { en: "open internships and work-student jobs you can apply to yourself",
                          nl: "open stages en werkstudentbanen waar je zelf op kunt solliciteren" },
  "soon.badge":        { en: "Coming soon", nl: "Binnenkort" },
  "soon.kop":          { en: "{lijst} aren't open yet", nl: "{lijst} kunnen nog niet online" },
  "soon.reden":        { en: "Utrecht University still has to give us the go-ahead before we can put this part of the site online. When they do, this is where you'll find {wat}.",
                          nl: "De Universiteit Utrecht moet ons nog groen licht geven voordat we dit deel van de site online mogen zetten. Zodra dat er is, vind je hier {wat}." },
  "soon.gesprek":      { en: "You don't have to wait for that, though. Impact Connect was never a list to scroll through, the matching happens in a conversation. Tell us what you're after and we'll go through what fits you by hand.",
                          nl: "Daar hoef je trouwens niet op te wachten. Impact Connect was nooit een lijst om doorheen te scrollen; het matchen gebeurt in een gesprek. Vertel ons wat je zoekt, dan gaan we met de hand langs wat bij je past." },
  "soon.rest":         { en: "Or keep looking around: <a href=\"programmes.html\">programmes</a>, <a href=\"events.html\">events</a> and <a href=\"alumni.html\">asking an alumni</a> are all open.",
                          nl: "Of kijk verder rond: <a href=\"programmes.html\">programma's</a>, <a href=\"events.html\">events</a> en <a href=\"alumni.html\">een alumni vragen</a> zijn wel gewoon open." },

  /* ── datums in de tijdlijn ─────────────────────────────────────── */
  "datum.jaarrond":      { en: "Year-round & ongoing", nl: "Het hele jaar door" },
  "datum.jaarrond.kort": { en: "Year-round", nl: "Hele jaar" },
  "datum.tbc":           { en: "Dates to be confirmed", nl: "Datum nog onbekend" },

  /* ── programma's, wat script.js daar tekent ────────────────────── */
  "progcat.volunteer":  { nl: "Vrijwilligerswerk" },
  "progcat.youth":      { nl: "Jongerenorganisaties" },
  "progcat.impact":     { nl: "Impactgedreven" },
  "progcat.university": { nl: "Andere universiteiten" },
  "progcat.paid":       { nl: "Betaalde programma's" },
  "progcat.summer":     { nl: "Zomerscholen" },
  "prog.betaald":       { en: "Paid", nl: "Betaald" },
  "prog.onbetaald":     { en: "Unpaid", nl: "Onbetaald" },
  "prog.kaart.voet":    { en: "Excited? Let's talk", nl: "Spreekt dit aan? Kom praten" },
  "prog.partner":       { en: "Partner", nl: "Partner" },
  "prog.pop.partner":   { en: "We work with {naam}. We can introduce you directly.",
                          nl: "Wij werken samen met {naam}. We kunnen je rechtstreeks voorstellen." },
  "prog.pop.kicker":    { en: "Interested in this programme?", nl: "Interesse in dit programma?" },
  "prog.pop.tekst":     { en: "We keep the details for a conversation, that's how we find the right fit for <em>you</em>. Reach out and we'll take it from there.",
                          nl: "De details bewaren we voor een gesprek, want zo vinden we wat bij <em>jou</em> past. Laat van je horen, dan pakken wij het op." },
  "prog.pop.mail":      { en: "Email us directly", nl: "Mail ons rechtstreeks" },
  "prog.mail.vraag":    { en: "Question about", nl: "Vraag over" },
  "prog.mail.afspraak": { en: "Appointment request", nl: "Aanvraag afspraak" },
  "prog.mail.vraag.tekst": {
    en: "Hi Impact Connect,\n\nI'd love to know more about \"{naam}\" and whether it could be a fit for me. Could we plan half an hour?\n\nThanks!",
    nl: "Hoi Impact Connect,\n\nIk zou graag meer willen weten over \"{naam}\" en of het bij me past. Kunnen we een half uur inplannen?\n\nAlvast bedankt!" },
  "prog.mail.afspraak.tekst": {
    en: "Hi Impact Connect,\n\nI'd like to plan an appointment to talk about \"{naam}\" (and other programmes that might fit me).\n\nMy name:\nMy study programme:\nWhen I'm free:\n\nThanks!",
    nl: "Hoi Impact Connect,\n\nIk wil graag een afspraak plannen om over \"{naam}\" te praten (en over andere programma's die bij me zouden passen).\n\nMijn naam:\nMijn studie:\nWanneer ik kan:\n\nAlvast bedankt!" },

  "sluiten":            { en: "Close", nl: "Sluiten" },

  /* ── wat beide formulieren delen ───────────────────────────────── */
  "form.naam":         { en: "Your name", nl: "Je naam" },
  "form.naam.hint":    { en: "First and last name", nl: "Voor- en achternaam" },
  "form.email":        { en: "University email", nl: "Je studentenmailadres" },
  "form.optioneel":    { en: "(optional)", nl: "(niet verplicht)" },
  "form.stapvan":      { en: "Step {n} of {totaal}", nl: "Stap {n} van {totaal}" },
  "form.annuleer":     { en: "Cancel", nl: "Annuleren" },
  "form.vorige":       { en: "Back", nl: "Terug" },
  "form.verder":       { en: "Continue", nl: "Verder" },
  "form.terug":        { en: "Back to browsing", nl: "Terug naar de site" },
  "form.dank":         { en: "Thanks, {naam}!", nl: "Bedankt, {naam}!" },
  "form.jij":          { en: "there", nl: "en tot snel" },
  "form.viamail":      { en: "We couldn't send it from the site itself, so your mail programme should have opened with the whole request in it. Press send there and it reaches us.",
                          nl: "Het versturen vanaf de site zelf lukte niet, dus je mailprogramma zou nu open moeten staan met het hele verzoek erin. Druk daar op versturen en het komt bij ons aan." },
  "form.viamail.niets": { en: "Nothing opened? Write to {adres} yourself.",
                          nl: "Er ging niets open? Mail dan zelf naar {adres}." },
  "form.versturen":    { en: "Sending…", nl: "Versturen…" },

  /* ── het afspraakformulier ─────────────────────────────────────── */
  "afspr.stap1":       { en: "What brings you here?", nl: "Wat brengt je hier?" },
  "afspr.stap2":       { en: "Your interests", nl: "Waar je warm van wordt" },
  "afspr.stap3":       { en: "Practical fit", nl: "Wat praktisch past" },
  "afspr.stap4":       { en: "Your details", nl: "Je gegevens" },
  "afspr.staptijd":    { en: "Pick a time", nl: "Kies een moment" },
  "tijd.info":         { en: "A 30-minute conversation in person at {plek}.", nl: "Een gesprek van een half uur, op locatie in {plek}." },
  "tijd.laden":        { en: "Looking up free times…", nl: "Vrije tijden ophalen…" },
  "tijd.vol":          { en: "Fully booked", nl: "Vol" },
  "tijd.tekort":       { en: "Less than 48 hours away", nl: "Binnen 48 uur" },
  "tijd.geen":         { en: "None of these times work for me", nl: "Geen van deze tijden past" },
  "tijd.geen.uitleg":  { en: "No problem. Send your request and we'll email you to find a time that does.", nl: "Geen probleem. Stuur je aanvraag, dan mailen we je om een moment te vinden dat wel past." },
  "tijd.gekozen":      { en: "Your conversation: {moment}", nl: "Je gesprek: {moment}" },
  "tijd.mail":         { en: "Time slot", nl: "Tijdslot" },
  "tijd.fout":         { en: "We couldn't load the free times just now. Send your request anyway and we'll email you to find a time.", nl: "We konden de vrije tijden nu niet ophalen. Stuur je aanvraag toch, dan mailen we je om een moment te vinden." },
  "tijd.weg":          { en: "Someone just picked that time. Please choose another one.", nl: "Iemand anders koos net dat moment. Kies een ander tijdstip." },
  "tijd.geboekt":      { en: "Your conversation is booked for {moment}. A confirmation and a calendar invitation are on their way to your inbox.", nl: "Je gesprek staat vast op {moment}. Een bevestiging en een agenda-uitnodiging komen naar je mailbox." },
  "tijd.onbekend":     { en: "Your request is in. Check your inbox: the confirmation tells you whether your time is booked.", nl: "Je aanvraag is binnen. Kijk in je mailbox: in de bevestiging staat of je moment vaststaat." },
  "soort.unsure":      { en: "I'm not sure yet", nl: "Ik weet het nog niet" },
  "soort.unsure.sub":  { en: "Inspire me from your programmes", nl: "Laat me zien wat er is" },
  "soort.programme":   { en: "A programme", nl: "Een programma" },
  "soort.programme.sub": { en: "Learn & build my CV", nl: "Leren en mijn cv opbouwen" },
  "soort.direction":   { en: "General direction", nl: "Een richting" },
  "soort.direction.sub": { en: "Help me find my path", nl: "Help me mijn pad te vinden" },
  "soort.specific":    { en: "Something specific", nl: "Iets specifieks" },
  "soort.specific.sub": { en: "I have an idea in mind", nl: "Ik heb al iets in gedachten" },
  "afspr.themas.hint": { en: "Pick the themes that excite you, choose as many as you like.",
                          nl: "Kies de thema's waar je enthousiast van wordt, zo veel als je wilt." },
  "afspr.anders.vraag": { en: "Which field is that?", nl: "Welk vakgebied is dat?" },
  "afspr.anders.hint":  { en: "Marine biology, urban mobility, climate law…", nl: "Mariene biologie, stedelijke mobiliteit, klimaatrecht…" },
  "afspr.niveau":      { en: "Your experience level", nl: "Hoeveel ervaring je hebt" },
  "afspr.tijd":        { en: "Time you can commit", nl: "Hoeveel tijd je hebt" },
  "afspr.betaald":     { en: "Paid or unpaid?", nl: "Betaald of onbetaald?" },
  "afspr.taal":        { en: "Language", nl: "Taal" },
  "afspr.rest":        { en: "Anything else?", nl: "Nog iets anders?" },
  "afspr.rest.hint":   { en: "Dream role, specific companies, constraints…", nl: "Droomplek, bepaalde organisaties, dingen waar we rekening mee moeten houden…" },
  "afspr.privacy":     { en: "We'll use this only to plan your appointment and suggest relevant programmes. You can ask us to delete your details anytime.",
                          nl: "We gebruiken dit alleen om je afspraak te plannen en passende programma's voor te stellen. Je kunt ons altijd vragen je gegevens te verwijderen." },
  "afspr.verstuur":    { en: "Request appointment", nl: "Afspraak aanvragen" },
  "afspr.gelukt":      { en: "We've got your request, and a copy is on its way to your own inbox. The Impact Connect team will reach out (usually within a few days) to plan the half hour and go through the programmes and places that fit where you want to go.",
                          nl: "We hebben je aanvraag binnen, en er is een kopie onderweg naar je eigen inbox. Het team van Impact Connect neemt contact op (meestal binnen een paar dagen) om dat half uur te plannen en de programma's en plekken langs te gaan die passen bij waar jij heen wilt." },

  /* ── het alumniformulier ───────────────────────────────────────── */
  "al.stap1":          { en: "Who are you looking for?", nl: "Wie zoek je?" },
  "al.stap2":          { en: "What do you want out of it?", nl: "Wat wil je eruit halen?" },
  "al.stap1.hint":     { en: "The more precise you are, the better the match. We go through our alumni list by hand.",
                          nl: "Hoe preciezer je bent, hoe beter de match. We gaan onze alumnilijst met de hand langs." },
  "al.vakgebied":      { en: "Field they work in", nl: "Vakgebied waarin ze werken" },
  "al.welkvak":        { en: "Which field is that?", nl: "Welk vakgebied is dat?" },
  "al.welkvak.hint":   { en: "Marine biology, urban mobility, climate law…", nl: "Mariene biologie, stedelijke mobiliteit, klimaatrecht…" },
  "al.soortorg":       { en: "Kind of organisation", nl: "Soort organisatie" },
  "al.specifiek":      { en: "A specific role, company or organisation?", nl: "Een specifieke functie, bedrijf of organisatie?" },
  "al.specifiek.hint": { en: "Policy advisor at a ministry, someone at Witteveen+Bos…", nl: "Beleidsadviseur bij een ministerie, iemand bij Witteveen+Bos…" },
  "al.stap2.hint":     { en: "Write it in your own words. This tells us who's actually useful to you, not just who works in the right field.",
                          nl: "Schrijf het in je eigen woorden. Daaraan zien we wie je écht verder helpt, en niet alleen wie in het juiste vakgebied werkt." },
  "al.doel":           { en: "What would you like to get out of the conversation?", nl: "Wat wil je uit het gesprek halen?" },
  "al.doel.hint":      { en: "Where you are now, what you're doubting, and what you'd most like to find out. A few sentences is plenty.",
                          nl: "Waar je nu staat, waar je over twijfelt, en wat je het liefst te weten komt. Een paar zinnen is genoeg." },
  "al.studie":         { en: "Study and year", nl: "Studie en jaar" },

  /* ── het alumniloket: teksten die script.js zelf opbouwt ────────── */
  "lok.nu":            { en: "Now", nl: "Nu" },
  "lok.eerder":        { en: "Before", nl: "Eerder" },
  "lok.titel":         { en: "Ask an alumni", nl: "Vraag het een alumni" },
  "lok.test":          { en: "Test profile", nl: "Testprofiel" },
  "lok.stap1":         { en: "Your question", nl: "Je vraag" },
  "lok.stap2":         { en: "About you", nl: "Wie ben je" },
  "lok.geenthema":     { en: "Your field not here?", nl: "Staat je vakgebied er niet bij?" },
  "lok.alle":          { en: "All", nl: "Alles" },
  "lok.telling":       { en: "{n} of {totaal} profiles", nl: "{n} van {totaal} profielen" },
  "lok.beschikbaar":   { en: "Available", nl: "Beschikbaar" },
  "lok.plek1":         { en: "One place left {periode}", nl: "Nog één plek {periode}" },
  "lok.vol":           { en: "Not available {periode}", nl: "Niet beschikbaar {periode}" },
  "lok.volknop":       { en: "Not available", nl: "Niet beschikbaar" },
  "lok.periode.maand":    { en: "this month", nl: "deze maand" },
  "lok.periode.kwartaal": { en: "this quarter", nl: "dit kwartaal" },
  "lok.periode.jaar":     { en: "this year", nl: "dit jaar" },
  "lok.vraagknop":     { en: "Ask this alumni", nl: "Stel deze alumni een vraag" },
  "lok.themas":        { en: "What's it about?", nl: "Waar gaat het over?" },
  "lok.vraag":         { en: "Your question", nl: "Je vraag" },
  "lok.vraag.hint":    { en: "Say what you're stuck on and why you're asking this person. A few sentences is plenty.",
                         nl: "Vertel waar je op vastloopt en waarom je het juist deze persoon vraagt. Een paar zinnen is genoeg." },
  "lok.kort":          { en: "{n} characters to go. Write at least a couple of sentences, otherwise there's little to answer.",
                         nl: "Nog {n} tekens. Schrijf minstens een paar zinnen, anders valt er weinig te beantwoorden." },
  "lok.langgenoeg":    { en: "Clear enough. You can send it.", nl: "Duidelijk genoeg. Je kunt hem versturen." },
  "lok.akkoord":      { en: "By sending this you agree that we may share your name, study, email and question with the alumni if we go ahead. Nothing is shared before that.",
                         nl: "Door dit te versturen ga je ermee akkoord dat we je naam, studie, mailadres en vraag met de alumni delen als we doorgaan. Daarvoor delen we niets." },
  "lok.verstuur":      { en: "Send my question", nl: "Verstuur mijn vraag" },
  "lok.gelukt":       { en: "We've got it, and a copy is already in your inbox. We read every question by hand, so keep an eye on your email, because that is where our answer comes. We'll get back to you as soon as we can. If we think someone else can help you better, we'll say so and tell you why.",
                         nl: "We hebben het binnen, en er staat al een kopie in je inbox. We lezen elke vraag met de hand, dus houd je mail in de gaten, want daar komt ons antwoord. We komen zo snel mogelijk bij je terug. Denken we dat iemand anders je beter kan helpen, dan zeggen we dat erbij met de reden." },
  "lok.leeg":          { en: "There's nobody on the list yet. Use the button below to tell us who you're after and we'll look ourselves.",
                         nl: "Er staat nog niemand op de lijst. Gebruik de knop hieronder om te vertellen wie je zoekt, dan kijken wij zelf." },
  "lok.fout":          { en: "The list can't be loaded right now. Use the button below and we'll look ourselves.",
                         nl: "De lijst kan nu niet geladen worden. Gebruik de knop hieronder, dan kijken wij zelf." },
  "lok.uit":           { en: "The list isn't switched on yet. Use the button below and we'll look ourselves.",
                         nl: "De lijst staat nog niet aan. Gebruik de knop hieronder, dan kijken wij zelf." },
  "lok.ond.Choosing a master’s": { en: "Choosing a master's", nl: "Een master kiezen" },
  "lok.ond.Applying for jobs":   { en: "Applying for jobs", nl: "Solliciteren" },
  "lok.ond.Exploring a field":   { en: "Exploring a field", nl: "Een vakgebied verkennen" },
  "lok.ond.Internships":         { en: "Internships", nl: "Stages" },
  "lok.ond.Starting something":  { en: "Starting something", nl: "Zelf iets beginnen" },
  "lok.ond.Working abroad":      { en: "Working abroad", nl: "Werken in het buitenland" },
  "al.studie.hint":    { en: "MSc Sustainable Development, year 1", nl: "MSc Sustainable Development, jaar 1" },
  "al.privacy":        { en: "We check our alumni list ourselves and mail you back a LinkedIn profile, plus a phone number if they've given us one. You send them a message first; a call comes later, only if you both want one. Everyone on the list has agreed to be approached this way. Your details stay with us and you can ask us to delete them anytime.",
                          nl: "We gaan onze alumnilijst zelf langs en mailen je een LinkedIn-profiel terug, plus een telefoonnummer als ze dat hebben gegeven. Jij stuurt eerst een bericht; bellen komt later, en alleen als jullie dat allebei willen. Iedereen op de lijst heeft aangegeven dat we ze zo mogen benaderen. Je gegevens blijven bij ons en je kunt ons altijd vragen ze te verwijderen." },
  "al.verstuur":       { en: "Send request", nl: "Verzoek versturen" },
  "al.klaar":          { en: "Request sent", nl: "Verzoek verstuurd" },
  "al.klaar.mail":     { en: "Your mail is ready", nl: "Je mail staat klaar" },
  "al.mailopnieuw":    { en: "Open the mail again", nl: "Open de mail opnieuw" },
  "al.viamail.niets":  { en: "Nothing opened? {opnieuw}, or write to {adres} yourself.",
                          nl: "Er ging niets open? {opnieuw}, of mail zelf naar {adres}." },
  "al.gelukt":         { en: "We've got it, and a copy is on its way to your own inbox. We'll go through our alumni list and come back with a LinkedIn profile, and a phone number if we have one, so you can send them a message yourself.",
                          nl: "We hebben het binnen, en er is een kopie onderweg naar je eigen inbox. We gaan onze alumnilijst langs en komen terug met een LinkedIn-profiel, en een telefoonnummer als we dat hebben, zodat je zelf een bericht kunt sturen." },

  /* ── de stagekaartjes en het detailpaneel ────────────────────────
     Staat nu achter INTERNSHIPS_LIVE, maar wel vertaald: anders is het
     halve Engels het eerste wat je ziet als die schakelaar omgaat. */
  "opp.stage":         { en: "Internship", nl: "Stage" },
  "opp.thesis":        { en: "Thesis internship", nl: "Afstudeerstage" },
  "opp.programma":     { en: "Programme", nl: "Programma" },
  "opp.werkstudent":   { en: "Work-student job", nl: "Werkstudentbaan" },
  "opp.uitgewerkt":    { en: "Defined topic", nl: "Vast onderwerp" },
  "opp.open":          { en: "Open application", nl: "Open sollicitatie" },
  "opp.deadline":      { en: "Closing soon", nl: "Sluit binnenkort" },
  "opp.voorstel":      { en: "Proposed thesis topic", nl: "Voorgesteld afstudeeronderwerp" },
  "opp.vraag":         { en: "Research question:", nl: "Onderzoeksvraag:" },
  "opp.openthesis":    { en: "Open thesis application", nl: "Open afstudeerplek" },
  "opp.eigenvraag":    { en: "Bring your own research question in {veld}. The organisation provides data and supervision.",
                          nl: "Breng je eigen onderzoeksvraag mee binnen {veld}. De organisatie levert data en begeleiding." },
  "opp.eigenonderwerp": { en: "Bring your own topic in:", nl: "Breng je eigen onderwerp mee binnen:" },
  "opp.alumni.prog":   { en: "Students who joined", nl: "Studenten die dit deden" },
  "opp.alumni.rol":    { en: "Students who did this role", nl: "Studenten die deze plek hadden" },
  "opp.partner":       { en: "Partner of Impact Connect.", nl: "Partner van Impact Connect." },
  "opp.partner.tekst": { en: "We set up this connection and keep the relationship warm in the background, reaching out is up to you. Use the contact and concept email below to get the ball rolling.",
                          nl: "Wij hebben dit contact gelegd en houden de band op de achtergrond warm; het benaderen doe jij zelf. Gebruik de contactgegevens en de voorbeeldmail hieronder om te beginnen." },
  "opp.contact":       { en: "Your contact at {org}", nl: "Je contactpersoon bij {org}" },
  "opp.conceptmail":   { en: "Concept email, make it yours", nl: "Voorbeeldmail, maak hem van jezelf" },
  "opp.haakjes":       { en: "Fill in the [brackets] before sending.", nl: "Vul de [haakjes] in voordat je verstuurt." },
  "opp.knop.eigen":    { en: "Apply with your topic", nl: "Aanmelden met je eigen onderwerp" },
  "opp.knop.prog":     { en: "Go to programme", nl: "Naar het programma" },
  "opp.knop.site":     { en: "Apply on their site", nl: "Solliciteer op hun site" },
  "opp.over":          { en: "About this opportunity", nl: "Over deze plek" },
  "opp.over.prog":     { en: "About this programme", nl: "Over dit programma" },
  "lijst.leeg":        { en: "Nothing here yet for these filters.", nl: "Met deze filters staat hier nog niets." },

  /* ── de zoekbalk achter ⌘K ─────────────────────────────────────── */
  "cmdk.titel":        { en: "Impact Connect quick search", nl: "Snelzoeken in Impact Connect" },
  "cmdk.hint":         { en: "Search opportunities or jump to a page…", nl: "Zoek een plek of ga naar een pagina…" },
  "cmdk.leeg":         { en: "No matches. Try another search.", nl: "Niets gevonden. Probeer iets anders." },
  "cmdk.ganaar":       { en: "Go to", nl: "Ga naar" },
  "cmdk.pagina":       { en: "Page", nl: "Pagina" },
  "cmdknav.index.html":            { nl: "Home" },
  "cmdknav.programmes.html":       { nl: "Programma's" },
  "cmdknav.events.html":           { nl: "Events" },
  "cmdknav.alumni.html":           { nl: "Vraag het een alumni" },
  "cmdknav.internships.html":      { nl: "Partnerstages" },
  "cmdknav.thesis.html":           { nl: "Afstudeerstages" },
  "cmdknav.other-internships.html": { nl: "Overige stages" },
  "cmdknav.about.html":            { nl: "Over ons" },

  /* ── tellertjes op de vier ingangen ────────────────────────────── */
  "teller.programmas": { en: "programmes", nl: "programma's" },
  "teller.alumninamen": { en: "alumni", nl: "alumni" },
  "teller.alumni":     { en: "Get matched", nl: "Wij koppelen je" },
  "teller.open":       { en: "open", nl: "open" },

  /* ── contactformulier (homepage en onderaan Over ons) ──────────── */
  "ct.eyebrow":        { nl: "Contact" },
  "ct.kop":            { nl: "Stuur ons een bericht<span class=\"dot-clay\">.</span>" },
  "ct.lead":           { nl: "Een vraag, een idee, een event dat we moeten kennen, of je schrijft gewoon liever dan dat je het afspraakformulier invult. Vertel wat er speelt, dan komt een van ons erop terug." },
  "ct.termijn":        { nl: "Meestal antwoord binnen een paar dagen" },
  "ct.soort":          { nl: "Wie schrijft er?" },
  "ct.soort.student":  { nl: "Ik ben student" },
  "ct.soort.org":      { nl: "Ik ben een organisatie" },
  /* Deze vier maakt script.js, want ze wisselen met de keuze hierboven. */
  "ct.lead.student":   { en: "A question, an idea, an event we should know about, or you would simply rather write than fill in the appointment form. Tell us what is on your mind and one of us gets back to you.",
                         nl: "Een vraag, een idee, een event dat we moeten kennen, of je schrijft gewoon liever dan dat je het afspraakformulier invult. Vertel wat er speelt, dan komt een van ons erop terug." },
  "ct.lead.org":       { en: "Thinking about working together, offering a placement, or running an event with us? Tell us what you have in mind and we'll come back to you.",
                         nl: "Denk je aan samenwerken, een stageplek aanbieden of samen een event doen? Vertel wat je voor ogen hebt, dan komen we bij je terug." },
  "ct.veld.student":   { en: "Study and year", nl: "Studie en jaar" },
  "ct.veld.org":       { en: "Organisation and your role", nl: "Organisatie en je functie" },
  "ct.hint.student":   { en: "MSc Sustainable Development, year 1", nl: "MSc Sustainable Development, jaar 1" },
  "ct.hint.org":       { en: "Witteveen+Bos, recruiter", nl: "Witteveen+Bos, recruiter" },
  "ct.naam":           { nl: "Je naam" },
  "ct.email":          { nl: "Je mailadres" },
  "ct.bericht":        { nl: "Je bericht" },
  "ct.bericht.hint":   { nl: "Vraag ons wat je wilt..." },
  "ct.knop":           { nl: "Verstuur bericht" },
  "ct.privacy":        { nl: "We gebruiken dit alleen om je te antwoorden. Je kunt ons altijd vragen je gegevens te verwijderen." },
  // Deze drie maakt script.js, dus die hebben ook het Engels nodig.
  "ct.mis":            { en: "Please fill in your name, a valid email and a message.",
                         nl: "Vul je naam, een geldig mailadres en een bericht in." },
  "ct.gelukt":         { en: "Thanks {naam}, we've got your message. One of us will get back to you, usually within a few days.",
                         nl: "Bedankt {naam}, we hebben je bericht binnen. Een van ons komt erop terug, meestal binnen een paar dagen." },
  "ct.viamail":        { en: "Sending from the site didn't work, so your mail programme should open with the same message in it. Press send there and it reaches us.",
                         nl: "Versturen vanaf de site lukte niet, dus je mailprogramma zou nu open moeten gaan met hetzelfde bericht erin. Druk daar op versturen en het komt bij ons aan." },

  "taal.wissel":       { nl: "Switch to English", en: "Bekijk in het Nederlands" },
};

/* ── korte veldjes uit data.js ───────────────────────────────────────
   Prijs, tijdstip en locatie van een event zijn geen zinnen maar vaste
   kreten die steeds terugkomen ("Free for students", "time tbc"). Die
   vertalen we op de tekst zelf in plaats van met een sleutel: het zijn er
   weinig, ze herhalen zich, en zo hoeft er niets bij in data.js. Staat er
   iets niet bij, dan blijft het Engels gewoon staan — geen leeg vlak.
------------------------------------------------------------------- */
const VELDEN_NL = {
  // prijs
  "Free": "Gratis",
  "Free (register)": "Gratis (aanmelden)",
  "Free (register; professional)": "Gratis (aanmelden; voor professionals)",
  "Free for students": "Gratis voor studenten",
  "Free / low": "Gratis / goedkoop",
  "Free / donation": "Gratis / op donatiebasis",
  "Free with partner code": "Gratis met partnercode",
  "Mostly free": "Grotendeels gratis",
  "Mixed (many free)": "Wisselend (veel gratis)",
  "Varies (many free)": "Wisselend (veel gratis)",
  "Paid": "Betaald",
  "Paid (modest)": "Betaald (bescheiden)",
  "Paid (program fee)": "Betaald (deelnamekosten)",
  "Paid (professional)": "Betaald (voor professionals)",
  "Paid (professional fee)": "Betaald (tarief voor professionals)",
  "Paid (student rates)": "Betaald (studententarief)",
  "Paid (B2B)": "Betaald (zakelijk)",
  "Paid / low (students welcome)": "Betaald / goedkoop (studenten welkom)",
  "From EUR 15 (students)": "Vanaf € 15 (studenten)",
  "EUR 11.40": "€ 11,40",
  "Student tickets available": "Studentenkaarten beschikbaar",
  // tijdstip
  "tbc": "nog onbekend",
  "time tbc": "tijd nog onbekend",
  "times vary": "tijden wisselen",
  "times vary by venue": "tijden verschillen per locatie",
  "hours vary by venue": "openingstijden verschillen per locatie",
  "various activities": "verschillende activiteiten",
  "multi-day program": "meerdaags programma",
  "see agenda": "zie de agenda",
  // locatie en datum
  "Nationwide": "Door heel Nederland",
  "Nationwide (cleanup actions)": "Door heel Nederland (opruimacties)",
  "Nationwide (energy projects)": "Door heel Nederland (energieprojecten)",
  "Location tbc (NL)": "Locatie nog onbekend (NL)",
  "Varies (NL)": "Wisselend (NL)",
  "Varies (ARK)": "Wisselend (ARK)",
  "Dates tbc": "Datum nog onbekend",
  "Harlingen to Terschelling": "Harlingen naar Terschelling",
  // Deze openingstijd heeft een uitzondering tussen haakjes en past daardoor
  // niet op het patroon hieronder in veld(); daarom staat hij hier los.
  "10:00 to 18:00 (Thu to 16:00)": "10:00 tot 18:00 (do tot 16:00)",
};

/* De antwoordmogelijkheden in de formulieren. Belangrijk: wat de student
   aanklikt wordt in het Engels opgeslagen en zo ook naar de sheet en de
   mail gestuurd. Alleen wat op het scherm staat is Nederlands. Anders
   krijg je in één kolom van je sheet door elkaar "Paid only" en "Alleen
   betaald" staan, en kun je er niet meer op filteren of tellen. */
const KEUZES_NL = {
  // thema's in stap 2
  "Energy & climate": "Energie & klimaat",
  "Water & coasts": "Water & kust",
  "Ecology & nature": "Ecologie & natuur",
  "Food & agriculture": "Voedsel & landbouw",
  "Cities & mobility": "Steden & mobiliteit",
  "Circular economy": "Circulaire economie",
  "Policy & governance": "Beleid & bestuur",
  "Business & innovation": "Ondernemen & innovatie",
  "International development": "Internationale ontwikkeling",
  "Data & GIS": "Data & GIS",
  // ervaring, tijd, betaald, taal in stap 3
  "Beginner": "Beginner",
  "Some experience": "Enige ervaring",
  "Advanced": "Gevorderd",
  "A few hrs/week": "Een paar uur per week",
  "1 day/week": "1 dag per week",
  "2–3 days/week": "2–3 dagen per week",
  "Full-time": "Fulltime",
  "Paid only": "Alleen betaald",
  "Unpaid only": "Alleen onbetaald",
  "Either is fine": "Allebei prima",
  "Doesn't matter": "Maakt niet uit",
  "English": "Engels",
  "Dutch": "Nederlands",
  "Either": "Allebei",
  // vakgebieden in het alumniformulier
  "Climate and energy": "Klimaat en energie",
  "Water": "Water",
  "Nature and biodiversity": "Natuur en biodiversiteit",
  "Circular economy and waste": "Circulaire economie en afval",
  "Food and agriculture": "Voedsel en landbouw",
  "Policy and government": "Beleid en overheid",
  "Consultancy": "Consultancy",
  "Research and academia": "Onderzoek en wetenschap",
  "NGO and non-profit": "Ngo's en non-profit",
  "Startups and own venture": "Startups en eigen onderneming",
  "Corporate sustainability": "Duurzaamheid binnen bedrijven",
  "Something else": "Iets anders",
  // soorten organisatie
  "NGO": "Ngo",
  "Government": "Overheid",
  "Research or university": "Onderzoek of universiteit",
  "Company": "Bedrijf",
  "Own venture": "Eigen onderneming",
};

/** Het Nederlandse label bij een opgeslagen (Engelse) keuze. */
function keuzeLabel(waarde) {
  if (TAAL !== "nl" || waarde == null) return waarde;
  return KEUZES_NL[String(waarde)] || waarde;
}

/** Vertaalt zo'n kort veldje, of geeft het onveranderd terug. */
function veld(tekst) {
  if (TAAL !== "nl" || tekst == null) return tekst;
  const schoon = String(tekst).trim();
  if (VELDEN_NL[schoon]) return VELDEN_NL[schoon];
  // Kloktijden staan er als "13:00 to 17:00". Die staan hierboven niet
  // één voor één in, want het zijn er te veel; alleen het woordje ertussen
  // hoeft te veranderen.
  const tijden = schoon.match(/^(\d{1,2}[:.]\d{2})\s+to\s+(\d{1,2}[:.]\d{2})$/);
  if (tijden) return `${tijden[1]} tot ${tijden[2]}`;
  return tekst;
}

/* ── de taal bepalen ─────────────────────────────────────────────────
   Volgorde: wat in het adres staat (?lang=nl) wint, dan wat je eerder
   koos, en anders Engels. Het adres wint zodat je iemand een link in een
   bepaalde taal kunt sturen.
------------------------------------------------------------------- */
function huidigeTaal() {
  if (!NEDERLANDS_LIVE) return "en";
  try {
    const uitAdres = new URLSearchParams(location.search).get("lang");
    if (TALEN.includes(uitAdres)) return uitAdres;
  } catch (e) { /* oude browser, geen ramp */ }
  try {
    const bewaard = localStorage.getItem(TAAL_OPSLAG);
    if (TALEN.includes(bewaard)) return bewaard;
  } catch (e) { /* privémodus */ }
  return STANDAARDTAAL;
}

let TAAL = huidigeTaal();

/** De vertaling van één sleutel, of null als hij er niet is. */
function t(sleutel) {
  const rij = VERTALINGEN[sleutel];
  if (!rij) return null;
  const tekst = rij[TAAL];
  if (tekst != null) return tekst;
  // Nederlands ontbreekt: liever het Engels dan een leeg vlak.
  return rij.en != null ? rij.en : null;
}

/* ── de pagina omzetten ──────────────────────────────────────────────
   Loopt langs alles met data-t en de attribuutvarianten. Het Engels uit
   de HTML wordt eerst bewaard, zodat terugwisselen ook werkt zonder dat
   het Engels twee keer in de code staat.
------------------------------------------------------------------- */
/* Welke pagina dit is, voor de titel en de Google-omschrijving. De drie
   stagepagina's hebben alle drie data-page="listing" en verschillen alleen
   in data-list, dus daar plakken we die achter: "listing.partner". */
function paginaSleutel() {
  const pagina = document.body.dataset.page || "";
  const lijst = document.body.dataset.list;
  return lijst ? `${pagina}.${lijst}` : pagina;
}

function pasTaalToe() {
  document.documentElement.lang = TAAL;

  document.querySelectorAll("[data-t]").forEach((el) => {
    if (el.dataset.tEn == null) el.dataset.tEn = el.innerHTML;
    const nieuw = TAAL === "en" ? el.dataset.tEn : t(el.dataset.t);
    if (nieuw != null) el.innerHTML = nieuw;
  });

  document.querySelectorAll("[data-t-placeholder]").forEach((el) => zetAttribuut(el, "placeholder", el.dataset.tPlaceholder));
  document.querySelectorAll("[data-t-aria]").forEach((el) => zetAttribuut(el, "aria-label", el.dataset.tAria));
  document.querySelectorAll("[data-t-title]").forEach((el) => zetAttribuut(el, "title", el.dataset.tTitle));
  document.querySelectorAll("[data-t-alt]").forEach((el) => zetAttribuut(el, "alt", el.dataset.tAlt));

  // paginatitel en de omschrijving die Google laat zien
  const pagina = paginaSleutel();
  const titel = t(`titel.${pagina}`);
  if (titel) document.title = titel;
  const omschrijving = t(`omschrijving.${pagina}`);
  const meta = document.querySelector('meta[name="description"]');
  if (omschrijving && meta) meta.setAttribute("content", omschrijving);
}

function zetAttribuut(el, attr, sleutel) {
  const bewaarNaam = "tAttr" + attr.replace(/[^a-z]/gi, "");
  if (el.dataset[bewaarNaam] == null) el.dataset[bewaarNaam] = el.getAttribute(attr) || "";
  const nieuw = TAAL === "en" ? el.dataset[bewaarNaam] : t(sleutel);
  if (nieuw != null) el.setAttribute(attr, nieuw);
}

/* ── het knopje in de balk ───────────────────────────────────────────
   Eén knop die de andere taal aanbiedt, niet twee knoppen waarvan er één
   aan staat: er zijn maar twee talen, dus "NL" betekent onmiskenbaar
   "ga naar Nederlands". Scheelt ook ruimte in een balk die al vol is.
------------------------------------------------------------------- */
function kiesTaal(nieuw) {
  if (!TALEN.includes(nieuw) || nieuw === TAAL) return;
  try { localStorage.setItem(TAAL_OPSLAG, nieuw); } catch (e) { /* privémodus */ }
  // ?lang in het adres zou de opgeslagen keuze blijven overrulen
  const adres = new URL(location.href);
  adres.searchParams.delete("lang");
  location.replace(adres.toString());
}

function initTaalknop() {
  document.querySelectorAll("[data-taalknop]").forEach((knop) => {
    if (!NEDERLANDS_LIVE) { knop.style.display = "none"; return; }
    const ander = TAAL === "en" ? "nl" : "en";
    knop.textContent = ander.toUpperCase();
    knop.setAttribute("aria-label", TAAL === "en"
      ? "Bekijk deze pagina in het Nederlands" : "View this page in English");
    knop.setAttribute("lang", ander);
    knop.addEventListener("click", () => kiesTaal(ander));
  });
}

/* ── controle voor onszelf ───────────────────────────────────────────
   Open de site met ?check=taal erachter en de console vertelt precies
   welke sleutels in de HTML staan maar nog geen Nederlands hebben, en
   welke vertalingen nergens meer gebruikt worden.
------------------------------------------------------------------- */
function controleerVertalingen() {
  const gebruikt = new Set();
  document.querySelectorAll("[data-t]").forEach((el) => gebruikt.add(el.dataset.t));
  ["tPlaceholder", "tAria", "tTitle", "tAlt"].forEach((k) => {
    document.querySelectorAll(`[data-${k.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase())}]`)
      .forEach((el) => gebruikt.add(el.dataset[k]));
  });
  const pagina = paginaSleutel();
  gebruikt.add(`titel.${pagina}`);
  gebruikt.add(`omschrijving.${pagina}`);

  const zonderNl = [...gebruikt].filter((s) => !VERTALINGEN[s] || VERTALINGEN[s].nl == null);
  console.info(`[taal] ${gebruikt.size} sleutels op deze pagina, ${zonderNl.length} zonder Nederlands`);
  if (zonderNl.length) console.warn("[taal] nog te vertalen:", zonderNl);
}
