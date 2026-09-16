// Alle inhoud van de site staat hier. Pas een tekst of een regel aan en
// hij verandert overal waar hij getoond wordt.

/* ── de knop voor de internships ─────────────────────────────────────
   De drie internshippagina's zijn af: de kaarten, de filters, het
   detailpaneel, de zoekfunctie, alles staat er nog precies zoals het
   gebouwd is. Ze mogen alleen van de Universiteit Utrecht nog niet naar
   buiten, dus staat deze schakelaar uit. Dan tonen de drie pagina's een
   "Coming soon" in plaats van de lijst, blijven de knoppen erboven werken,
   en komen de plekken niet in de zoekbalk (⌘K) of in de teller op de
   homepage terecht.

   Zodra het mag: zet hier true neer en de hele sectie staat er weer.
   Verder hoeft er niets veranderd te worden.                          */
const INTERNSHIPS_LIVE = false;

/* ── Het UU-logo en de vermelding ────────────────────────────────────
   De Universiteit Utrecht heeft nog geen toestemming gegeven om haar
   beeldmerk te voeren, dus staat dit uit. Dan verdwijnt op alle acht de
   pagina's het logo rechts in de menubalk en dat in de voettekst.

   Weg gaat: het blokje rechts in de menubalk, logo en woordmerk samen.
   Zonder logo bleef daar alleen "Utrecht University" zweven naast de
   knop, en dat leest als een losse regel tekst.

   Blijft staan: de regel onderaan, "Ondersteund door de Universiteit
   Utrecht · Faculteit Geowetenschappen", alleen zonder logo. Dat is een
   zin die de samenwerking noemt, geen merkteken.

   De HTML blijft op alle acht de pagina's staan, dus true zetten is
   genoeg om het logo in een keer terug te halen.

   Zodra het mag: zet hier true neer. Aan de HTML hoeft niets te
   veranderen, die staat op alle acht de pagina's al klaar.            */
const UU_BRANDING = false;

/* ── waar de formulieren naartoe gaan ────────────────────────────────
   Het afspraakformulier en het alumniverzoek sturen hun antwoorden naar
   een Google Apps Script. Dat script mailt ons, mailt de student een
   bevestiging, en schrijft alles weg in een Google Sheet. De code en de
   stappen staan in de map `formulier-backend`.

   Zolang hier niets staat, valt de site terug op het mailprogramma van de
   bezoeker: die krijgt dan een kant-en-klare mail te zien die hij zelf moet
   versturen. Dat werkt, maar dan staat er niets in de sheet.

   Zet hier de web-app-URL neer die je krijgt bij stap 4 van de
   instructies. Hij begint met https://script.google.com/macros/s/ en
   eindigt op /exec.                                                   */
const FORM_ENDPOINT = "https://script.google.com/macros/s/AKfycbyziDZqzeT_rYUhrINzFJ-dgMprZnJQnk4fWDt8vikc_ao5kBdmB4F_1ybw9roMaVa9/exec";

/* Ons adres. Staat op één plek, zodat je het overal tegelijk verandert:
   de knoppen op de site, de fallback-mails en de bevestigingen. */
const CONTACT_MAIL = "contact@impactconnectutrecht.com";

const THEMES = [
  { id: "all", label: "All themes", color: "#13352A" },
  { id: "energy", label: "Energy", color: "#C2683A" },
  { id: "governance", label: "Governance", color: "#2B6B4F" },
  { id: "business", label: "Business & Innovation", color: "#5AB97F" },
  { id: "ecology", label: "Ecology & Food", color: "#2B6B4F" },
  { id: "cities", label: "Sustainable Cities", color: "#3F7C6A" },
  { id: "general", label: "General", color: "#13352A" },
];

const LEVELS = { 1: "Beginner-friendly", 2: "Some experience", 3: "Advanced", 4: "Highly competitive" };

/* Let op: dit zijn nog voorbeelden, geen echte plekken (zie INTERNSHIPS_LIVE
   bovenaan). Bedrijven waarvan je je kunt afvragen of ze thuishoren op een
   site over impact staan er bewust niet in: geen olie en gas, geen
   luchtvaart, geen grote accountantskantoren, geen webwinkels. Zet ze er ook
   niet in als je de lijst met echte plekken vult; wat hier staat is waar
   Impact Connect met zijn naam achter staat. */
const INTERNSHIPS = [
  { org: "SDG Challenge", logo: null, theme: "business", paid: false, hours: "1 day / week", loc: "Remote / NL", lang: "EN", level: 1, deadline: "2026-01-15", kind: "partner", contactPerson: "Sanne de Boer", contactEmail: "s.deboer@sdg-challenge.example", contact: "via Impact Connect",
    desc: "A consultancy project advising a company on a concrete sustainability challenge. Wide variety of companies and topics, and strong for CV building in the consultancy space.",
    looking: "Motivated students from any discipline who want hands-on consultancy experience. No prior experience required.",
    alumni: [{ name: "Lotte, MSc Sustainable Development", quote: "I advised a logistics firm on cutting emissions, it's the project that got me my first consulting interview." }] },
  { org: "WWF-NL Youth Advisory Council", logo: null, theme: "ecology", paid: false, hours: "A few hrs / week", loc: "Zeist", lang: "EN", level: 2, deadline: "2026-02-28", kind: "partner", contactPerson: "Tim Jansen", contactEmail: "t.jansen@wwf-nl.example", contact: "Dedicated WWF liaison",
    desc: "Advise WWF on a topic of your choice across short research cycles, conservation, green finance, blue carbon, youth engagement.",
    looking: "Students with a clear topic interest who can do independent research over a 1–2 month cycle.",
    alumni: [{ name: "Sam, BSc Biology", quote: "Presenting our findings straight to WWF staff was unreal." }] },
  { org: "Arcadis · Water Resilience Intern", salary: "€600–800 / mo", logo: "arcadis", theme: "cities", paid: true, hours: "Full-time, 5 mo", loc: "Amersfoort", lang: "EN", level: 2, deadline: "2026-03-01", kind: "partner", contactPerson: "Lara Visser", contactEmail: "l.visser@arcadis.example", contact: "our Arcadis liaison",
    desc: "Support climate-adaptation and flood-resilience projects for Dutch municipalities within a global design and consultancy firm.",
    looking: "Students in water, earth sciences or spatial planning comfortable with GIS and stakeholder work.",
    alumni: [{ name: "Daan, MSc Earth Surface & Water", quote: "Real projects, real clients. The mentoring was excellent." }] },
  { org: "Royal HaskoningDHV · Sustainability Intern", salary: "€650 / mo", logo: "haskoning", theme: "cities", paid: true, hours: "Full-time, 4–6 mo", loc: "Amersfoort", lang: "EN", level: 2, deadline: "2026-02-20", kind: "partner", contactPerson: "Mark de Wit", contactEmail: "m.dewit@rhdhv.example", contact: "via Impact Connect",
    desc: "Work on circular-built-environment and infrastructure-sustainability projects with an engineering consultancy.",
    looking: "Students in environmental or civil fields with an interest in the built environment.", alumni: [] },
  { org: "Green Office UU", logo: null, theme: "general", paid: false, hours: "Flexible", loc: "Utrecht", lang: "EN", level: 1, deadline: "Year-round", kind: "open", apply: "https://www.uu.nl",
    desc: "Run sustainability projects across campus with the university's own student-led office.",
    looking: "Any UU student who wants to make campus more sustainable.", alumni: [] },
];

const THESIS = [
  /* Een "defined" thesis: de partner heeft de vraag al klaarliggen. Deze
     staat er als voorbeeld, omdat de site dit type anders opmaakt dan een
     open thesis (titel en onderzoeksvraag in plaats van een vakgebied).
     Vervang hem door een echte zodra die er is. */
  { org: "Example partner · Defined thesis (placeholder)", context: "Voorbeeld, nog geen echte plek.", salary: "€700 / mo", logo: null, theme: "energy", thesisType: "defined", paid: true, hours: "Full-time, 6 mo", loc: "Utrecht", lang: "EN", level: 3, deadline: "Year-round", kind: "partner", contactPerson: "Naam contactpersoon", contactEmail: "contact@voorbeeld.example", contact: "via Impact Connect",
    title: "Titel van de onderzoeksvraag",
    question: "De vraag die de partner beantwoord wil hebben, in één of twee zinnen.",
    desc: "Een partner biedt een afgebakende MSc-scriptie aan, met begeleiding vanuit de organisatie zelf.",
    looking: "Wie er goed bij past: studierichting, niveau, vaardigheden.", alumni: [] },
  { org: "Rijkswaterstaat · Open Thesis (Water)", logo: "rws", theme: "cities", thesisType: "open", paid: false, hours: "Flexible, 5–6 mo", loc: "Utrecht", lang: "NL", level: 2, deadline: "Year-round", kind: "partner", contactPerson: "Iris Kuiper", contactEmail: "i.kuiper@rws.example", contact: "via Impact Connect",
    field: "Water management, climate adaptation, infrastructure",
    desc: "Rijkswaterstaat welcomes open thesis applications: bring your own research question in water and infrastructure, and they'll provide data and supervision.",
    looking: "Students who can frame their own research question in the water/infrastructure domain. Dutch helpful.",
    alumni: [{ name: "Eva, MSc Spatial Planning", quote: "They were open to my own angle on river management, total freedom with great support." }] },
  { org: "TNO · Open Thesis (Applied Research)", salary: "€650 / mo", logo: "tno", theme: "energy", thesisType: "open", paid: true, hours: "Full-time, 6 mo", loc: "Utrecht / Delft", lang: "EN", level: 3, deadline: "Year-round", kind: "partner", contactPerson: "Bram Hendriks", contactEmail: "b.hendriks@tno.example", contact: "via Impact Connect",
    field: "Energy systems, circular economy, environmental modelling",
    desc: "The Netherlands' applied-research institute hosts open thesis projects across its sustainability programmes.",
    looking: "Strong MSc students who can work independently within a research group.",
    alumni: [{ name: "Noor, MSc Energy Science", quote: "Working inside an actual research team raised my whole game." }] },
];

const WORKSTUDENT = [
  { org: "ProRail · Working Student (Infra)", salary: "€17 / hr", logo: "prorail", theme: "cities", paid: true, hours: "8–16 hrs / week", loc: "Utrecht", lang: "NL", level: 2, deadline: "Year-round", kind: "open", apply: "https://www.werkenbijprorail.nl",
    desc: "Contribute to sustainable rail-infrastructure projects at the Dutch national rail manager.",
    looking: "Students in civil, spatial or environmental fields.", alumni: [] },
  { org: "Heijmans · Sustainable Construction", salary: "€16 / hr", logo: "heijmans", theme: "cities", paid: true, hours: "Flexible", loc: "NL", lang: "NL", level: 2, deadline: "Year-round", kind: "open", apply: "https://www.heijmans.nl",
    desc: "Paid working-student role supporting sustainable building and circular-construction projects.",
    looking: "Students in built-environment or engineering fields.", alumni: [] },
];

// Niet in gebruik op de site (stond ook ongebruikt in de React-versie),
// bewaard zodat de inhoud niet verloren gaat.
const PROGRAMMES = [
  { org: "NAHSS", logo: null, theme: "business", duration: "Mar–Aug (incl. summer school)", commit: "A few hrs / week + 3.5 wks", loc: "NL / Asia", lang: "EN", level: 2, deadline: "2026-01-15", apply: "https://www.nahss.nl",
    desc: "A selective consultancy + summer-school programme connecting top Dutch bachelor students with Asia-focused projects.",
    looking: "2nd/3rd-year bachelor students with honours, distinctive extracurriculars or grades ≥7.5.",
    alumni: [{ name: "Ruben, BSc GSS", quote: "The Asia summer school and the network were genuinely life-changing." }] },
  { org: "United Netherlands · Delegation", logo: null, theme: "governance", duration: "First semester", commit: "Every Friday + prep", loc: "Utrecht + Oxford/Harvard", lang: "EN", level: 3, deadline: "2026-06-01", apply: "https://unitednetherlands.org",
    desc: "Public speaking and international relations programme built around two Model UN conferences at Oxford and Harvard.",
    looking: "Ambitious students who love debate and public speaking. Competitive entry.", alumni: [{ name: "Anna, MSc International Development", quote: "Harvard MUN with this delegation opened doors I didn't know existed." }] },
  { org: "Enactus Utrecht", logo: null, theme: "business", duration: "Full year", commit: "Your choice", loc: "Utrecht", lang: "EN", level: 1, deadline: "Year-round", apply: "https://enactus.nl",
    desc: "Build and run a sustainability-focused student startup, with a €2,000 grant and a route to national and world competitions.",
    looking: "Entrepreneurial students wanting to launch real ventures.", alumni: [] },
  { org: "Solve Consulting", logo: null, theme: "business", duration: "8-week cycles", commit: "8 hrs / week", loc: "Utrecht", lang: "NL", level: 2, deadline: "2026-10-01", apply: "https://www.solve-consulting.nl",
    desc: "Student consultancy delivering social-impact projects for non-profits, with coaching from professional firms.",
    looking: "Students who want structured consulting experience for good causes.", alumni: [] },
  { org: "Jonge Rewilders Nederland", logo: null, theme: "ecology", duration: "Year-round events", commit: "Flexible", loc: "Nationwide (ARK)", lang: "NL", level: 1, deadline: "Year-round", apply: "https://arkrewilding.nl",
    desc: "The youth network of ARK Rewilding, free rewilding trips, seminars and events for students passionate about nature.",
    looking: "Anyone enthusiastic about rewilding and ecology.", alumni: [{ name: "Lisa, BSc Biology", quote: "Multi-day trips to rewilding sites, almost free. Brilliant for the CV and the soul." }] },
  { org: "Humanity in Action · Fellowship", logo: null, theme: "governance", duration: "Summer + action project", commit: "Intensive (summer)", loc: "Amsterdam", lang: "EN", level: 2, deadline: "2026-02-01", apply: "https://humanityinaction.org",
    desc: "An educational summer fellowship on human rights and democracy, paired with a self-led action project.",
    looking: "Students passionate about human rights, democracy and social justice.", alumni: [] },
];

/* ═══════════════════════════════════════════════════════════════════
   LIVE KOPPELING VOOR DE EVENTS
   ═══════════════════════════════════════════════════════════════════
   LET OP: gebruik het adres van een specifiek tabblad (met gid= erin), niet
   dat van "hele document". Publiceer je later een los tabblad, dan vervalt
   de publicatie van het hele document en geeft dat adres HTTP 400. De site
   valt dan stilzwijgend terug op de lijst hieronder; dat is precies wat er
   op 6 september 2026 gebeurde.

   Plak hier het adres van het gepubliceerde tabblad uit de sheet
   "Linked to bot events Database" (Bestand → Delen → Publiceren op
   internet → tabblad → CSV). Dat is dezelfde sheet die de WhatsApp-bot
   voedt, dus één lijst voor allebei: zet je er een event in, dan staat
   het binnen een paar minuten op de site én in de community.

   Leeg laten kan: dan komt de lijst hieronder uit dit bestand. Gaat het
   ophalen mis, dan valt de site daar ook op terug, zodat de pagina nooit
   leeg is.

   Verwachte kolommen (kopregel bovenaan) — deze staan al goed in de sheet:
     Event | Short description | Date | Time | Location | Cost |
     Registration link | Category

   De Category-kolom mag "General", "Energy", "Ecology and food",
   "Cities", "Governance" of "Business and innovation" zijn. Staan er
   twee thema's in één cel ("Energy, Governance"), dan pakt de site het
   eerste; zie rowsToEvents in script.js.

   Let op: events uit de sheet hebben geen Nederlandse beschrijving.
   Op de Nederlandse site staat er dan de Engelse tekst. Wil je dat
   vertaald, zet dan een kolom "Short description NL" in de sheet en
   zeg het even, dan lees ik die ook uit.
   ═══════════════════════════════════════════════════════════════════ */
/* ═══════════════════════════════════════════════════════════════════
   DE WHATSAPP-GROEPEN
   ═══════════════════════════════════════════════════════════════════
   Dezelfde zes thema's als de themakiezer op de eventspagina, en ook
   dezelfde als de groepen waar de bot zijn events naartoe stuurt. De
   knop bovenaan die pagina volgt het filter: kiest iemand "Cities",
   dan wijst de knop naar de Cities-groep.

   "all" is de knop als er geen thema gekozen is, en tegelijk de terugval
   voor een thema zonder eigen link. Er bestaat geen aparte community-
   groep, dus staat daar dezelfde link als bij "general": wie nog geen
   vakgebied heeft gekozen, heeft nog geen vakgebied. Wil je daar liever
   de aankondigingengroep, vervang dan alleen die ene regel.

   Een link ophalen: WhatsApp → groep openen → op de groepsnaam tikken
   → Uitnodigen via link → Link kopiëren. Het stukje "?mode=..." dat
   WhatsApp erachter plakt mag eraf.

   Let op: met zo'n link kan iedereen erin. Zet in de groepsinstellingen
   "Nieuwe leden goedkeuren" aan voor je hem publiek maakt.
   ═══════════════════════════════════════════════════════════════════ */
/* ═══════════════════════════════════════════════════════════════════
   LINKEDIN
   ═══════════════════════════════════════════════════════════════════
   Leeg laten mag. Bij een teamlid zonder adres verschijnt er gewoon geen
   icoontje, en staat de link in de voettekst er niet; er komt dus nooit
   een knop die nergens heen gaat.

   De sleutel is de naam zoals die op de over-onspagina staat.
   ═══════════════════════════════════════════════════════════════════ */
const LINKEDIN_IMPACT_CONNECT = "https://www.linkedin.com/company/impact-connect-utrecht/";

const LINKEDIN_TEAM = {
  "Valentijn Roorda": "https://www.linkedin.com/in/valentijn-roorda-934735239/",
  "Zoya Frumau":      "https://www.linkedin.com/in/zoya-frumau-4980a334a/",
  "Noah van Sprang":  "",   // heeft geen LinkedIn; blijft dus zonder icoontje
  "Jouke Nabuurs":    "https://www.linkedin.com/in/jouke-nabuurs/",
};

const WHATSAPP_GROEPEN = {
  all:        "https://chat.whatsapp.com/FwZa8qR1HdK70ZBJfkpfxe",   // zelfde als general, zie hieronder
  energy:     "https://chat.whatsapp.com/J0NAq2MFgGzDoeLlraA5Ma",
  governance: "https://chat.whatsapp.com/DOQcZV4wPqb3k2YfRELoZ4",
  business:   "https://chat.whatsapp.com/I37kQkrT0w40Kn1fUYyuF5",
  ecology:    "https://chat.whatsapp.com/GvMiJ2HlnR13GLEje27WTm",
  cities:     "https://chat.whatsapp.com/KX9nOo1xooJ55CGfleKfEt",
  general:    "https://chat.whatsapp.com/FwZa8qR1HdK70ZBJfkpfxe",
};

const EVENT_SHEET = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTrUbw_rA5cng3cegScM_f8J13UT389W8TUdGio_zThzOscCeyeeWQ7x1yx70_2N2NR4TEJPET_yVm4/pub?gid=1320948588&single=true&output=csv";

const EVENTS = [
  {"name": "Sustainability Career Event", "date": "06-02-2026", "time": "10:00 to 17:00", "loc": "Jaarbeurs, Utrecht", "cost": "Free for students", "link": "https://sustainabilitycareerevent.nl", "cat": "general", "desc": "A career fair connecting students directly with employers hiring for sustainability roles across the Netherlands.", "descNl": "Een banenbeurs die studenten rechtstreeks in contact brengt met werkgevers die mensen zoeken voor duurzaamheidsfuncties door heel Nederland."},
  {"name": "Sustainable Switch (career fair, 2+ yrs experience)", "date": "06-02-2026", "time": "time tbc", "loc": "Jaarbeurs, Utrecht", "cost": "Free (register)", "link": "https://www.sustainablemotion.nl", "cat": "general", "desc": "A career fair aimed at professionals with a few years' experience looking to move into sustainability-focused work.", "descNl": "Een banenbeurs voor mensen met een paar jaar werkervaring die de overstap naar duurzaam werk willen maken."},
  {"name": "Green Career Fair (Students4Sustainability)", "date": "Dates tbc", "time": "tbc", "loc": "Varies (NL)", "cost": "Free for students", "link": "https://www.students4sustainability.nl", "cat": "general", "desc": "A student-run fair bringing together green employers, NGOs and changemakers for those starting their careers.", "descNl": "Een beurs door studenten zelf, met groene werkgevers, ngo's en changemakers, voor wie net begint."},
  {"name": "Springtij Forum", "date": "23-09-2026 to 25-09-2026", "time": "09:30 to 17:00", "loc": "Terschelling", "cost": "Paid (professional fee)", "link": "https://www.springtij.nu", "cat": "general", "desc": "A multi-day sustainability forum on Terschelling where leaders and thinkers debate the future of the transition.", "descNl": "Een meerdaags duurzaamheidsforum op Terschelling waar bestuurders en denkers de toekomst van de transitie bespreken."},
  {"name": "Groene Vloot (Green Fleet, student/young-pro sail week incl. Springtij)", "date": "September 2026", "time": "multi-day program", "loc": "Harlingen to Terschelling", "cost": "Paid (program fee)", "link": "https://degroenevloot.com", "cat": "general", "desc": "A sailing week for students and young professionals combining workshops, networking and the Springtij Forum.", "descNl": "Een zeilweek voor studenten en jonge professionals met workshops, netwerken en het Springtij Forum."},
  {"name": "Afrika Dag", "date": "November 2026", "time": "tbc", "loc": "Amsterdam (typical)", "cost": "Paid (modest)", "link": "link to confirm", "cat": "general", "desc": "The Netherlands' largest event on Africa, covering development, climate and partnerships across the continent.", "descNl": "Het grootste Afrika-evenement van Nederland, over ontwikkeling, klimaat en partnerschap."},
  {"name": "World Cleanup Day (NL)", "date": "20-09-2026", "time": "times vary", "loc": "Nationwide (cleanup actions)", "cost": "Free", "link": "https://www.worldcleanupday.nl", "cat": "general", "desc": "A nationwide day of local clean-up actions tackling litter and waste in public spaces.", "descNl": "Een landelijke dag met lokale opruimacties tegen zwerfafval in de openbare ruimte."},
  {"name": "Solar Solutions Amsterdam (renamed Sustainable Solutions from 2027)", "date": "10-03-2026 to 12-03-2026", "time": "10:00 to 17:00", "loc": "Expo Greater Amsterdam, Vijfhuizen", "cost": "Free with partner code", "link": "https://www.solarsolutions.nl", "cat": "energy", "desc": "The Benelux's biggest trade fair for solar energy and storage technology, with talks and live demos.", "descNl": "De grootste vakbeurs van de Benelux voor zonne-energie en opslag, met lezingen en demonstraties."},
  {"name": "Vakbeurs Energie", "date": "October 2026", "time": "tbc", "loc": "Brabanthallen, Den Bosch", "cost": "Free (register)", "link": "https://www.vakbeursenergie.nl", "cat": "energy", "desc": "A national trade fair on energy efficiency and the transition for professionals and students alike.", "descNl": "Een landelijke vakbeurs over energiebesparing en de energietransitie, voor professionals \u00e9n studenten."},
  {"name": "Open Energiedag (renewable-energy open day)", "date": "Dates tbc", "time": "tbc", "loc": "Nationwide (energy projects)", "cost": "Free", "link": "https://www.nvde.nl", "cat": "energy", "desc": "An open day where renewable-energy projects across the country welcome visitors behind the scenes.", "descNl": "Een open dag waarop duurzame-energieprojecten door het hele land bezoekers ontvangen."},
  {"name": "Offshore Energy Exhibition & Conference (OEEC)", "date": "24-11-2026 to 25-11-2026", "time": "09:30 to 18:00", "loc": "RAI Amsterdam", "cost": "Paid (professional)", "link": "https://oeec.biz", "cat": "energy", "desc": "A major conference and expo on offshore wind and marine energy, drawing the international sector to Amsterdam.", "descNl": "Een groot congres met beurs over offshore wind en energie op zee, waar de hele sector samenkomt."},
  {"name": "Vonk! (energy & heat community co-creation day)", "date": "02-10-2026", "time": "time tbc", "loc": "Location tbc (NL)", "cost": "Paid (program fee)", "link": "link to confirm", "cat": "energy", "desc": "A co-creation day where communities and experts shape local energy and heat solutions together.", "descNl": "Een co-creatiedag waarop bewoners en experts samen lokale energie- en warmteoplossingen bedenken."},
  {"name": "Plant FWD (Europe's biggest alternative-protein conference)", "date": "08-04-2026 to 09-04-2026", "time": "09:30 to 17:00", "loc": "Midden Nederland Hallen, Barneveld", "cost": "Paid", "link": "https://www.plantfwd.com", "cat": "ecology", "desc": "Europe's largest conference on alternative proteins, from plant-based to cultivated food innovation.", "descNl": "Het grootste Europese congres over alternatieve eiwitten, van plantaardig tot gekweekt."},
  {"name": "Funky Vegan Festival", "date": "31-05-2026", "time": "11:00 to 19:00", "loc": "Oker, Schipluiden (near Delft)", "cost": "EUR 11.40", "link": "https://funkyveganfestival.nl", "cat": "ecology", "desc": "A lively festival celebrating plant-based food, music and a sustainable lifestyle near Delft.", "descNl": "Een uitbundig festival rond plantaardig eten, muziek en een duurzame leefstijl."},
  {"name": "Planty of Food Festival", "date": "06-06-2026", "time": "time tbc", "loc": "Westenenkerpark, Apeldoorn", "cost": "Free / donation", "link": "https://zerowasteapeldoorn.nl", "cat": "ecology", "desc": "A free, donation-based festival showcasing local plant-based food and zero-waste living in Apeldoorn.", "descNl": "Een gratis festival op donatiebasis met lokaal plantaardig eten en afvalvrij koken."},
  {"name": "GreenTech Amsterdam (horticulture technology)", "date": "09-06-2026 to 11-06-2026", "time": "10:00 to 18:00 (Thu to 16:00)", "loc": "RAI Amsterdam", "cost": "Paid (student rates)", "link": "https://www.greentech.nl", "cat": "ecology", "desc": "A leading trade fair on horticulture technology and sustainable food production, with student rates.", "descNl": "Een toonaangevende vakbeurs over tuinbouwtechnologie en duurzame voedselproductie."},
  {"name": "Landelijke Jonge Rewilders Dag (ARK)", "date": "November 2026", "time": "tbc", "loc": "Varies (ARK)", "cost": "Free / low", "link": "https://arkrewilding.nl", "cat": "ecology", "desc": "A national day for young people interested in rewilding, with talks, fieldwork and networking via ARK.", "descNl": "Een landelijke dag voor jongeren die iets met rewilding willen, met lezingen en veldwerk."},
  {"name": "ARK Rewilding events", "date": "Year-round", "time": "see agenda", "loc": "Nationwide", "cost": "Varies (many free)", "link": "https://arkrewilding.nl/agenda", "cat": "ecology", "desc": "Year-round excursions and events from one of the Netherlands' biggest rewilding organisations.", "descNl": "Excursies en activiteiten door het hele jaar heen van een van de grootste natuurherstelorganisaties van Nederland."},
  {"name": "Week van de Biodiversiteit (KNNV)", "date": "May 2027", "time": "tbc", "loc": "Nationwide", "cost": "Free", "link": "https://knnv.nl/week-van-de-biodiversiteit", "cat": "ecology", "desc": "A nationwide week of activities and excursions celebrating and protecting Dutch biodiversity.", "descNl": "Een landelijke week vol activiteiten en excursies rond het beschermen van de Nederlandse natuur."},
  {"name": "VeggieWorld Netherlands (vegan lifestyle fair)", "date": "Dates tbc", "time": "tbc", "loc": "Expo Houten", "cost": "Paid", "link": "link to confirm", "cat": "ecology", "desc": "A fair dedicated to vegan food, products and lifestyle, with tastings and exhibitors at Expo Houten.", "descNl": "Een beurs helemaal gewijd aan veganistisch eten, producten en leefstijl, met proeverijen en standhouders."},
  {"name": "We Make the City (urban festival)", "date": "June 2026", "time": "tbc", "loc": "Amsterdam (region)", "cost": "Mixed (many free)", "link": "https://wemakethe.city", "cat": "cities", "desc": "A festival of ideas and projects making cities greener, fairer and more liveable across the Amsterdam region.", "descNl": "Een festival vol ideeën en projecten die steden groener, eerlijker en leefbaarder maken."},
  {"name": "Building Holland (sustainable built environment)", "date": "Dates tbc", "time": "tbc", "loc": "RAI Amsterdam", "cost": "Free (register)", "link": "https://www.buildingholland.nl", "cat": "cities", "desc": "A trade event on innovation and sustainability in the built environment, from materials to circular design.", "descNl": "Een vakevenement over innovatie en duurzaamheid in de gebouwde omgeving, van materialen tot circulair ontwerp."},
  {"name": "Nationale Klimaatexpo (climate adaptation)", "date": "15-04-2027", "time": "time tbc", "loc": "Expo Houten", "cost": "Free / low", "link": "https://nationaleklimaatexpo.nl", "cat": "cities", "desc": "An accessible expo on climate adaptation, showing how the Netherlands is preparing for a changing climate.", "descNl": "Een toegankelijke expo over klimaatadaptatie, die laat zien hoe Nederland zich voorbereidt op een veranderend klimaat."},
  {"name": "Dutch Design Week", "date": "17-10-2026 to 25-10-2026", "time": "hours vary by venue", "loc": "Eindhoven", "cost": "From EUR 15 (students)", "link": "https://ddw.nl", "cat": "cities", "desc": "The largest design event in Northern Europe, with a strong thread of sustainable and circular design.", "descNl": "Het grootste designevenement van Noord-Europa, met een stevige duurzaamheidslijn door het programma."},
  {"name": "Stadmakerscongres (Rotterdam city-making congress)", "date": "13-11-2026", "time": "time tbc", "loc": "Theater Zuidplein, Rotterdam", "cost": "Paid / low (students welcome)", "link": "https://stadmakerscongres.nl", "cat": "cities", "desc": "A congress for citizens and professionals shaping the future of Rotterdam and other Dutch cities.", "descNl": "Een congres voor bewoners en professionals die aan de toekomst van Rotterdam en andere steden werken."},
  {"name": "SDG Action Day", "date": "24-09-2026", "time": "time tbc", "loc": "Amersfoort", "cost": "Free / low", "link": "https://www.sdgactionday.nl", "cat": "governance", "desc": "A day of workshops and action focused on advancing the UN Sustainable Development Goals in the Netherlands.", "descNl": "Een dag vol workshops en actie rond de duurzame ontwikkelingsdoelen van de VN."},
  {"name": "Klimaatweek (Nationale Klimaatweek)", "date": "02-11-2026 to 08-11-2026", "time": "various activities", "loc": "Nationwide", "cost": "Free", "link": "https://klimaatweek.nl", "cat": "governance", "desc": "A national week of activities raising awareness and driving action on climate across the country.", "descNl": "Een landelijke week met activiteiten die het klimaat op de agenda zetten en tot actie aanzetten."},
  {"name": "Duurzame Dinsdag (Sustainable Tuesday)", "date": "01-09-2026", "time": "13:00 to 17:00", "loc": "Den Haag", "cost": "Free", "link": "https://www.duurzamedinsdag.nl", "cat": "governance", "desc": "An annual event in The Hague where citizens hand their sustainability ideas to government in a symbolic suitcase.", "descNl": "Een jaarlijks evenement in Den Haag waar burgers hun duurzame ideeën in een koffer aan de politiek overhandigen."},
  {"name": "Week van de Circulaire Economie (350+ events)", "date": "19-03-2026 to 27-03-2026", "time": "various activities", "loc": "Nationwide", "cost": "Mostly free", "link": "https://deweekvandecirculaireeconomie.nl", "cat": "business", "desc": "A nationwide week with hundreds of events on reuse, repair and the shift to a circular economy.", "descNl": "Een landelijke week met honderden activiteiten over hergebruik, reparatie en de circulaire economie."},
  {"name": "Congres Circulair Ondernemen", "date": "19-03-2026", "time": "time tbc", "loc": "Werkspoorkathedraal, Utrecht", "cost": "Paid", "link": "https://deweekvandecirculaireeconomie.nl/evenement/congres-circulair-ondernemen", "cat": "business", "desc": "A congress for entrepreneurs and organisations putting circular business models into practice.", "descNl": "Een congres voor ondernemers en organisaties die circulair werken in de praktijk brengen."},
  {"name": "Upstream Festival (startups; Climate & Energy track)", "date": "21-05-2026", "time": "time tbc", "loc": "Van Nelle Fabriek, Rotterdam", "cost": "Student tickets available", "link": "https://www.upstreamfestival.com", "cat": "business", "desc": "A startup festival in Rotterdam with a dedicated climate and energy track and student tickets.", "descNl": "Een startupfestival in Rotterdam met een eigen programma rond klimaat en energie."},
  {"name": "Impact Trade Fair", "date": "April 2026", "time": "tbc", "loc": "Varies (NL)", "cost": "Paid (B2B)", "link": "link to confirm", "cat": "business", "desc": "A B2B fair connecting impact-driven organisations, investors and partners across the Netherlands.", "descNl": "Een zakelijke beurs die organisaties met impact, investeerders en partners bij elkaar brengt."},
  {"name": "Nationale Conferentie Circulaire Economie (NCCE 2027)", "date": "11-03-2027", "time": "time tbc", "loc": "Rotterdam", "cost": "Free (register; professional)", "link": "https://deweekvandecirculaireeconomie.nl", "cat": "business", "desc": "The national conference bringing together policymakers and industry on the circular-economy transition.", "descNl": "De landelijke conferentie waar beleidsmakers en bedrijfsleven elkaar treffen rond de circulaire economie."},
  {"name": "Dutch Sustainable Fashion Week (DSFW)", "date": "07-10-2026 to 11-10-2026", "time": "times vary by venue", "loc": "Multiple cities (NL); opening Haarlem", "cost": "Mostly free", "link": "https://www.dsfw.nl", "cat": "business", "desc": "A week of events across Dutch cities exploring sustainable and circular fashion, much of it free to attend.", "descNl": "Een week met activiteiten in verschillende Nederlandse steden over duurzame en circulaire mode."}
];

const WALL_CATS = [
  { id: "all", label: "Everyone" },
  { id: "energy", label: "Energy & Climate" },
  { id: "water", label: "Water & Infrastructure" },
  { id: "consult", label: "Consulting & Finance" },
  { id: "food", label: "Food & Retail" },
  { id: "research", label: "Research & Public" },
];

/* Deze muur staat uit (zie het commentaarblok in index.html). De bedrijven
   waarvan je je kunt afvragen of ze hier thuishoren zijn eruit gehaald, in
   dezelfde beweging als bij de internships: anders staan Shell en KLM er
   zodra iemand de muur weer aanzet. Vul hem met echte partners. */
const WALL = [
  { name: "Vattenfall", logo: null, cat: "energy", offer: "Internships · Work-student" },
  { name: "Eneco", logo: null, cat: "energy", offer: "Work-student · Energy" },
  { name: "Rijkswaterstaat", logo: "rws", cat: "water", offer: "Open thesis · Work-student", big: true },
  { name: "Arcadis", logo: "arcadis", cat: "water", offer: "Internships · Water resilience" },
  { name: "Royal HaskoningDHV", logo: "haskoning", cat: "water", offer: "Internships" },
  { name: "Van Oord", logo: null, cat: "water", offer: "Internships · Marine" },
  { name: "ProRail", logo: "prorail", cat: "water", offer: "Work-student · Infra" },
  { name: "Heijmans", logo: "heijmans", cat: "water", offer: "Work-student · Construction" },
  { name: "Triodos Bank", logo: null, cat: "consult", offer: "Internships · Green finance", big: true },
  { name: "Tony's Chocolonely", logo: null, cat: "food", offer: "Internships · Fair chains" },
  { name: "Fairphone", logo: null, cat: "food", offer: "Internships · Circularity" },
  { name: "TNO", logo: "tno", cat: "research", offer: "Open thesis · Applied research", big: true },
  { name: "NPO", logo: "npo", cat: "research", offer: "Internships · Media" },
];

/* De categorieën volgen de tabbladen van de Google Sheet, zie
   PROGRAMME_SHEETS hieronder. Een programma in PROGRAMMES_DATA met een
   categorie die hier niet in staat, wordt genegeerd. */
const PROGRAMME_CATS = [
  { id: "volunteer",  label: "Volunteering" },
  { id: "youth",      label: "Youth organisations" },
  { id: "impact",     label: "Impact-driven" },
  { id: "university", label: "Other universities" },
  { id: "paid",       label: "Paid programmes" },
  { id: "summer",     label: "Summer schools" },
];

/* ═══════════════════════════════════════════════════════════════════
   LIVE KOPPELING MET DE GOOGLE SHEET
   ═══════════════════════════════════════════════════════════════════
   De programma's staan in één Google Sheet, met per categorie een
   tabblad:

     LINKED TO WEBSITE Programmes Database (Google Sheets)
     https://docs.google.com/spreadsheets/d/1jIjZ15sPo5i6OIOW4dlv1kAlTT-2qObawFDdMUF4Ejc/edit

   Je past de sheet aan, de bezoeker ververst, en de wijziging staat op
   de site. Publiceren hoeft niet; de site leest het tabblad
   rechtstreeks. Daarvoor moet de sheet wél op "Iedereen met de link →
   Viewer" blijven staan. Zet je dat uit, dan valt de site terug op
   PROGRAMMES_DATA hieronder en verdwijnen de nieuwste programma's
   stilletjes.

   Een tabblad erbij? Open het in de sheet en kijk in de adresbalk:
   achter "gid=" staat het nummer van dat tabblad. Zet dat nummer
   hieronder neer en de categorie erbij in PROGRAMME_CATS hierboven.

   Een regel leeg laten kan: die categorie komt dan uit PROGRAMMES_DATA
   hieronder. Gaat het ophalen mis, dan valt de site daar ook op terug,
   zodat de pagina nooit leeg is.

   Verwachte kolommen in het tabblad (kopregel bovenaan):
     Programme Name | Description | Sign up date | Duration |
     Language | Experience level | URL | Location | Costs
   ═══════════════════════════════════════════════════════════════════ */
const PROGRAMME_SHEET = "1jIjZ15sPo5i6OIOW4dlv1kAlTT-2qObawFDdMUF4Ejc";
const tabblad = (gid) =>
  `https://docs.google.com/spreadsheets/d/${PROGRAMME_SHEET}/export?format=csv&gid=${gid}`;

const PROGRAMME_SHEETS = {
  volunteer:  tabblad(562032160),    // tabblad "Volunteer work"
  youth:      tabblad(1221317339),   // tabblad "Youth Organizations"
  impact:     tabblad(1914001672),   // tabblad "Impact Driven Programmes"
  university: tabblad(1861492196),   // tabblad "Programs from other university"
  paid:       tabblad(1646247199),   // tabblad "Paid Impact Programmes"
  summer:     tabblad(6575484),      // tabblad "Summer School Programmes"

  // Het summerschool-tabblad heeft een kolom "Host university/institution"
  // die de site niet toont; de instelling staat meestal al in de naam.
};
/* ═══════════════════════════════════════════════════════════════════
   LOGO'S BIJ PROGRAMMA'S
   ═══════════════════════════════════════════════════════════════════
   Sleutel = de naam zoals hij in de sheet staat; hoofdletters, spaties
   en leestekens maken bij het opzoeken niet uit. Waarde = bestand in
   assets/programmes/. Staat een programma hier niet, dan toont het
   kaartje de letterbadge.

   Zet je een kolom "Logo" in de Google Sheet, dan gaat die voor op
   deze lijst — handig om er zelf een beter logo tegenaan te zetten.

   De logo's zijn opgehaald van de website van de organisatie zelf en
   staan er alleen ter herkenning; ze betekenen niet dat er een
   samenwerking is.
   ═══════════════════════════════════════════════════════════════════ */
const PROGRAMME_LOGOS = {
  "A SEED Europe":                                                                      "assets/programmes/a-seed-europe.png",
  "AZC (Asielzoekerscentrum) - Volunteering as Dutch language teacher / Event helper":  "assets/programmes/azc-asielzoekerscentrum-volunteering-as-dutc.png",
  "ActionAid Netherlands":                                                              "assets/programmes/actionaid-netherlands.png",
  "Amnesty International Student Groups":                                               "assets/programmes/amnesty-international-student-groups.png",
  "Biobased Innovation Student Challenge (BISC-E)":                                     "assets/programmes/bisc-e.png",
  "Biobased Transition / Biobased Technology (minor, WUR)":                             "assets/programmes/biobased-transition-biobased-technology-mino.png",
  "Blue Book Traineeship EU":                                                           "assets/programmes/blue-book-traineeship-eu.png",
  "CHOICE for Youth and Sexuality":                                                     "assets/programmes/choice-for-youth-and-sexuality.png",
  "CNV Jong":                                                                           "assets/programmes/cnv-jong.png",
  "Climate-Resilient Crops: Interdisciplinary Approaches (minor, WUR)":                 "assets/programmes/climate-resilient-crops-interdisciplinary-ap.png",
  "DKC":                                                                                "assets/programmes/dkc.png",
  "DareEducation":                                                                      "assets/programmes/darel-education.png",
  "De Reparatiebalie":                                                                  "assets/programmes/de-reparatiebalie.png",
  "DeGoedeZaak":                                                                        "assets/programmes/degoedezaak.png",
  "Deep Canvassing":                                                                    "assets/programmes/deep-canvassing.png",
  "Defensity College":                                                                  "assets/programmes/defensity-college.png",
  "Dierenambulance":                                                                    "assets/programmes/dierenambulance.png",
  "Dutch Dairy Challenge (DDSC)":                                                       "assets/programmes/dutch-dairy-challenge.jpg",
  "Dwars (youth organization GroenLinks / GreenLeft)":                                  "assets/programmes/dwars-youth-organization-groenlinks-greenlef.png",
  "Ecological fieldwork (bats / vleermuizen)":                                          "assets/programmes/ecological-fieldwork-bats-vleermuizen.svg",
  "Enactus":                                                                            "assets/programmes/enactus.png",
  "Energie Student":                                                                    "assets/programmes/energie-student.png",
  "Erasmus Plus projects":                                                              "assets/programmes/erasmus-plus.svg",
  "European Sustainable Development Network (ESDN)":                                    "assets/programmes/european-sustainable-development-network-esd.png",
  "Examentraining (e.g. Eindsprint)":                                                   "assets/programmes/examentraining-e-g-eindsprint.png",
  "Exchange to Sciences Po":                                                            "assets/programmes/exchange-to-sciences-po.png",
  "Externship":                                                                         "assets/programmes/externship.png",
  "FNV Jong":                                                                           "assets/programmes/fnv-jong.png",
  "Fair Future Generators (Milieudefensie)":                                            "assets/programmes/fair-future-generators-milieudefensie.png",
  "Feminist Climate Academy":                                                           "assets/programmes/feminist-climate-academy.png",
  "Financing Sustainable Transitions (minor, WUR)":                                     "assets/programmes/financing-sustainable-transitions-minor-wur.png",
  "Forward Inc.":                                                                       "assets/programmes/forward-inc.png",
  "FutureWater":                                                                        "assets/programmes/futurewater.png",
  "GSS-track (Wageningen)":                                                             "assets/programmes/gss-track-wageningen.png",
  "Gender and Diversity for Sustainable Worlds (minor, WUR)":                           "assets/programmes/gender-and-diversity-for-sustainable-worlds-.png",
  "Generation C consulting":                                                            "assets/programmes/generation-c-consulting.png",
  "Groentetas Utrecht":                                                                 "assets/programmes/groentetas-utrecht.png",
  "Humanity in Action fellowship":                                                      "assets/programmes/humanity-in-action-fellowship.png",
  "ISO / U-raad":                                                                       "assets/programmes/iso-u-raad.png",
  "Idea League Challenge Programme (Delft)":                                            "assets/programmes/idea-league-challenge-programme-delft.png",
  "Innovation & Entrepreneurship (minor, WUR)":                                         "assets/programmes/innovation-entrepreneurship-minor-wur.png",
  "JongRegio":                                                                          "assets/programmes/jongregio.png",
  "Jonge Klimaatbeweging":                                                              "assets/programmes/jonge-klimaatbeweging.png",
  "Jonge Rewilders Nederland":                                                          "assets/programmes/jonge-rewilders-nederland.png",
  "KWR Water Research Institute":                                                       "assets/programmes/kwr-water-research-institute.png",
  "Kringloopwinkels (Thrift stores)":                                                   "assets/programmes/kringloopwinkels-thrift-stores.png",
  "Leger des Heils (Salvation Army Netherlands)":                                       "assets/programmes/leger-des-heils-salvation-army-netherlands.png",
  "Leiden University":                                                                  "assets/programmes/leiden-university.png",
  "MDT":                                                                                "assets/programmes/mdt-missie.png",
  "MDT Jongerenpanel":                                                                  "assets/programmes/mdt-jongerenpanel.png",
  "MDT missie":                                                                         "assets/programmes/mdt-missie.png",
  "Meer Bomen Nu":                                                                      "assets/programmes/meer-bomen-nu.png",
  "Milieudefensie Jong":                                                                "assets/programmes/milieudefensie-jong.png",
  "NAHSS":                                                                              "assets/programmes/nahss.png",
  "NJR":                                                                                "assets/programmes/njr.png",
  "Nationale Denktank":                                                                 "assets/programmes/nationale-denktank.png",
  "Nationale weerbaarheidstraining (Defensie)":                                         "assets/programmes/nationale-weerbaarheidstraining-defensie.png",
  "Nelen & Schuurmans":                                                                 "assets/programmes/nelen-schuurmans.png",
  "Nimble":                                                                             "assets/programmes/nimble.png",
  "Ocean Love":                                                                         "assets/programmes/ocean-love.png",
  "Oma's Soep":                                                                         "assets/programmes/oma-s-soep.png",
  "Operation Social Response":                                                          "assets/programmes/operation-social-response.png",
  "Ouderenzorg / Careibu â Elderly Care/Utrecht: Fietsen voor 2":                     "assets/programmes/ouderenzorg-careibu-elderly-care-utrecht-fie.png",
  "Plastics in the Environment and Society (minor, WUR)":                               "assets/programmes/plastics-in-the-environment-and-society-mino.png",
  "Race Against Waste":                                                                 "assets/programmes/race-against-waste.png",
  "Rewrite":                                                                            "assets/programmes/rewrite.png",
  "SDG Challenge":                                                                      "assets/programmes/sdg-challenge.png",
  "Schwarzman Scholars":                                                                "assets/programmes/schwarzman-scholars.png",
  "Serve the city Utrecht":                                                             "assets/programmes/serve-the-city-utrecht.png",
  "Smarttimer (Rijkswaterstaat)":                                                       "assets/programmes/smarttimer-rijkswaterstaat.png",
  "Solve Consulting":                                                                   "assets/programmes/solve-consulting.png",
  "Stichting Move":                                                                     "assets/programmes/stichting-move.png",
  "Studenten voor Morgen (Students for Tomorrow)":                                      "assets/programmes/studenten-voor-morgen-students-for-tomorrow.png",
  "Teia":                                                                               "assets/programmes/teia.png",
  "Thirty030":                                                                          "assets/programmes/thirty030.png",
  "TreesForAll â Trees for Schools":                                                  "assets/programmes/treesforall-trees-for-schools.png",
  "UUMUN":                                                                              "assets/programmes/uumun.png",
  "Unicef Utrecht":                                                                     "assets/programmes/unicef-utrecht.png",
  "Unipartners":                                                                        "assets/programmes/unipartners.png",
  "United Netherlands delegation":                                                      "assets/programmes/united-netherlands-delegation.png",
  "United Netherlands public speaking course (5 weeks)":                                "assets/programmes/united-netherlands-public-speaking-course-5-.png",
  "Utrecht University Volunteer Opportunities (Resource List)":                         "assets/programmes/utrecht-university-volunteer-opportunities-r.png",
  "VC Utrecht / Vrijwilligerscentrale Utrecht":                                         "assets/programmes/vc-utrecht-vrijwilligerscentrale-utrecht.png",
  "Voedselbank (Food Bank Netherlands)":                                                "assets/programmes/voedselbank-food-bank-netherlands.png",
  "WECF â Funding Fairer Futures":                                                    "assets/programmes/wecf-funding-fairer-futures.png",
  "WNF (World Wildlife Fund Netherlands)":                                              "assets/programmes/wnf-world-wildlife-fund-netherlands.png",
  "WO=MEN, Dutch Gender Platform":                                                      "assets/programmes/wo-men-dutch-gender-platform.png",
  "WWF-NL Youth Advisory Committee":                                                    "assets/programmes/wwf-nl-youth-advisory-committee.png",
  "WWOOF Netherlands":                                                                  "assets/programmes/wwoof-netherlands.png",
  "Waterhandjes":                                                                       "assets/programmes/waterhandjes.png",
  "Waterprof":                                                                          "assets/programmes/waterprof.png",
  "Waterschap De Stichtse Rijnlanden":                                                  "assets/programmes/waterschap-de-stichtse-rijnlanden.png",
  "Werken voor Nederland":                                                              "assets/programmes/werken-voor-nederland.png",
  "Werkstudent BAM":                                                                    "assets/programmes/werkstudent-bam.png",
  "West Wing":                                                                          "assets/programmes/west-wing.png",
  "Workaway":                                                                           "assets/programmes/workaway.png",
  "World's Youth for Climate Justice (WYCJ)":                                           "assets/programmes/world-s-youth-for-climate-justice-wycj.png",
  "Worldpackers":                                                                       "assets/programmes/worldpackers.png",
  "YEP Programmes":                                                                     "assets/programmes/yep-programmes.png",
  "Young Lady Business Academy":                                                        "assets/programmes/young-lady-business-academy.png",
  "Young Rewilders Network (EYR)":                                                      "assets/programmes/young-rewilders-network-eyr.png",
  "Youth Advisory Group (YAG)":                                                         "assets/programmes/youth-advisory-group-yag.svg",
  "Youth and Environment Europe (YEE)":                                                 "assets/programmes/youth-and-environment-europe-yee.png",
  "inClimate":                                                                          "assets/programmes/inclimate.png",
  "Nimble Processing":                                          "assets/programmes/nimble.png",
  "Oak Consultants":                                             "assets/programmes/oak-consultants.png",
  "Klimaatroute":                                                "assets/programmes/klimaatroute.png",
};

/* Logo's die wit zijn (gemaakt voor een donkere achtergrond). Die
   krijgen op het kaartje een donkergroen vlak, anders zie je niets. */
const PROGRAMME_LOGOS_ON_DARK = ["Ocean Love"];

/* Logo's per instelling. Heeft een programma zelf geen logo, dan kijkt
   de site in de kolom "Host university/institution" van de sheet. Staat
   daar een van de namen hieronder in, dan krijgt het kaartje dat logo.
   Zo krijgt een nieuwe summer school van een bekende universiteit
   vanzelf het goede logo.

   De eerste naam die past telt. Zet een specifieke naam (IDEA League)
   dus boven een algemene (TU Delft), anders wint de algemene. */
const INSTELLING_LOGOS = [
  ["IDEA League",                             "assets/programmes/idea-league-challenge-programme-delft.png"],
  ["Utrecht University",                      "assets/programmes/utrecht-university-volunteer-opportunities-r.png"],
  ["HU University of Applied Sciences",       "assets/programmes/hu-utrecht.png"],
  ["Wageningen",                              "assets/programmes/financing-sustainable-transitions-minor-wur.png"],
  ["Leiden University",                       "assets/programmes/leiden-university.png"],
  ["University of Groningen",                 "assets/programmes/university-of-groningen.png"],
  ["Hanze",                                   "assets/programmes/hanze.png"],
  ["VU Amsterdam",                            "assets/programmes/vu-amsterdam.png"],
  ["TU Delft",                                "assets/programmes/tu-delft.png"],
  ["IHE Delft",                               "assets/programmes/ihe-delft.png"],
  ["Maastricht University",                   "assets/programmes/maastricht-university.png"],
  ["Radboud University",                      "assets/programmes/radboud-university.png"],
  ["Erasmus University",                      "assets/programmes/erasmus-university-rotterdam.png"],
  ["University of Twente",                    "assets/programmes/university-of-twente.png"],
  ["NIOZ",                                    "assets/programmes/nioz.png"],
  ["Wadden Sea",                              "assets/programmes/wadden-sea-world-heritage.png"],
  ["Netherlands Centre for Coastal Research", "assets/programmes/nck.png"],
];

const PROGRAMMES_DATA = [
  { cat: "volunteer", name: "VC Utrecht / Vrijwilligerscentrale Utrecht", desc: "Central platform for volunteer work in Utrecht. Similar volunteer organizations exist in other Dutch cities (‘vrijwilligerscentrales’).", url: "https://www.vcutrecht.nl/", lang: "English/Dutch", level: null, duration: "Always", signup: null, loc: "Utrecht", paid: null, cost: null },
  { cat: "volunteer", name: "WWOOF Netherlands", desc: "Connects volunteers (“WWOOFers”) to organic farms to help and learn about sustainable agriculture.", url: "https://wwoof.nl", lang: "English/Dutch", level: null, duration: "Always", signup: null, loc: null, paid: null, cost: null },
  { cat: "volunteer", name: "Workaway", desc: "Global platform matching volunteers to hosts for helping out on projects, households, schools, farms, and more.", url: "https://www.workaway.info", lang: "English/Dutch", level: null, duration: "Always", signup: null, loc: null, paid: null, cost: null },
  { cat: "volunteer", name: "AZC (Asielzoekerscentrum) - Volunteering as Dutch language teacher / Event helper", desc: "Volunteer roles supporting refugees/asylum-seekers in language learning, integration, and events.", url: "https://www.coa.nl/en/voluntary-work", lang: null, level: null, duration: "Always", signup: null, loc: null, paid: null, cost: null },
  { cat: "volunteer", name: "Ouderenzorg / Careibu: Elderly Care/Utrecht: Fietsen voor 2", desc: "Connects volunteers and students with elderly people for companionship, activities, and support, including cycling together in Utrecht.", url: "https://careibu.com", lang: null, level: null, duration: "Always", signup: null, loc: null, paid: null, cost: null },
  { cat: "volunteer", name: "Meer Bomen Nu", desc: "National biodiversity initiative focused on tree-planting and rewilding, with activities for schools/universities.", url: "https://meerbomen.nu/ik-doe-mee/ik-ben-een-onderwijsinstelling/", lang: null, level: null, duration: "Always", signup: null, loc: null, paid: null, cost: null },
  { cat: "volunteer", name: "TreesForAll: Trees for Schools", desc: "NGO helping schools and students green their campuses via tree planting and workshops.", url: "https://treesforall.nl/trees-for-schools/", lang: null, level: null, duration: "Always", signup: null, loc: null, paid: null, cost: null },
  { cat: "volunteer", name: "Groentetas Utrecht", desc: "Student-led initiative providing bags of local, organic vegetables, promotes sustainable eating and student engagement.", url: "No direct URL, check your university’s sustainability/student groups or Google \"Groentetas Utrecht\"", lang: null, level: null, duration: "Always", signup: null, loc: null, paid: null, cost: null },
  { cat: "volunteer", name: "WNF (World Wildlife Fund Netherlands)", desc: "Leading conservation charity, with youth/student programs and volunteering projects (search for 'studenten' or 'vrijwilligerswerk').", url: "https://www.wnf.nl/", lang: null, level: null, duration: "Always", signup: null, loc: null, paid: null, cost: null },
  { cat: "volunteer", name: "Leger des Heils (Salvation Army Netherlands)", desc: "Charitable organization operating nationwide, supporting vulnerable people via food banks, shelters, and events.", url: "https://www.legerdesheils.nl/", lang: null, level: null, duration: "Always", signup: null, loc: null, paid: null, cost: null },
  { cat: "volunteer", name: "Dierenambulance", desc: "Nationwide animal ambulance, providing rescue and emergency assistance for animals.", url: "Search “Dierenambulance vrijwilligers” for your city (requirements may vary)", lang: null, level: null, duration: "Always", signup: null, loc: null, paid: null, cost: null },
  { cat: "volunteer", name: "Voedselbank (Food Bank Netherlands)", desc: "Provides free food to people in need, run largely by volunteers. Each city has its own organization.", url: "https://www.voedselbank.nl/", lang: null, level: null, duration: "Always", signup: null, loc: null, paid: null, cost: null },
  { cat: "volunteer", name: "Kringloopwinkels (Thrift stores)", desc: "Second-hand shops, affordable shopping for students and vulnerable groups.", url: "Search “Kringloopwinkel vrijwilligers” for your city", lang: null, level: null, duration: "Always", signup: null, loc: null, paid: null, cost: null },
  { cat: "volunteer", name: "Stichting Move", desc: "Social organization empowering youth and children via local projects.", url: "https://stichtingmove.nl/", lang: null, level: null, duration: "Always", signup: null, loc: null, paid: null, cost: null },
  { cat: "volunteer", name: "Unicef Utrecht", desc: "Student-led fundraising and event teams for children’s rights in Utrecht.", url: "https://www.unicef.nl/verenigingen/unicef-student-team-utrecht", lang: null, level: null, duration: "Always", signup: null, loc: null, paid: null, cost: null },
  { cat: "volunteer", name: "MDT (Maatschappelijke Diensttijd)", desc: "National voluntary service for youth (usually aged 14–27), supports skill development by combining volunteering with workshops and training.", url: "https://www.doemeemetmdt.nl/", lang: null, level: null, duration: "Always", signup: null, loc: null, paid: null, cost: null },
  { cat: "volunteer", name: "Utrecht University Volunteer Opportunities (Resource List)", desc: "Curated resource page with links to organizations, job boards, and volunteering options for UU students.", url: "https://students.uu.nl/begeleiding-en-ontwikkeling/career-services/zelf-aan-de-slag/cv-building/waar-kan-ik-vrijwilligerswerk-doen", lang: null, level: null, duration: "Always", signup: null, loc: null, paid: null, cost: null },
  { cat: "volunteer", name: "De Reparatiebalie", desc: "De Reparatiebalie is a non-profit repair service in the centre of Utrecht (Hoog Catharijne) where volunteers fix broken household appliances, clothing and toys for a reasonable fee. Instead of throwing things away, people can drop off their items, and pick them up later once they are repaired, helping to reduce waste and support a circular economy.", url: "https://dereparatiebalie.nl/", lang: null, level: null, duration: "Always", signup: null, loc: null, paid: null, cost: null },
  { cat: "volunteer", name: "Deep Canvassing", desc: "A grassroots movement that uses door-to-door “conversations for change” to reduce polarization in Dutch society. Volunteers visit people at home to talk openly and non-judgmentally about difficult political topics, such as migration, and look for shared values instead of winning a debate. From the Netherlands they organise campaigns and trainings around this method to counter exclusionary politics and build more social justice. You can join by becoming a canvasser, taking an online introduction or conversation training", url: "https://deepcanvassing.nl/", lang: null, level: null, duration: "Always", signup: null, loc: null, paid: null, cost: null },
  { cat: "volunteer", name: "DeGoedeZaak", desc: "DeGoedeZaak is a Dutch grassroots movement that mobilizes citizens to campaign for a fairer, more sustainable, inclusive, and democratic society. Volunteers support campaigns, petitions, and advocacy efforts on issues such as climate justice, equality, housing, and democracy, while helping amplify the voices of communities that are often underrepresented. By organizing people, building public support, and putting pressure on decision-makers, volunteers contribute to creating tangible social and political change.", url: "https://www.degoedezaak.org/", lang: null, level: null, duration: "Always", signup: null, loc: null, paid: null, cost: null },
  { cat: "volunteer", name: "Serve the city Utrecht", desc: "Serve the City Utrecht is a youth volunteering organisation that connects young people (around 16–30) with residents in the city who have little social network or limited financial resources. Volunteers help in very practical ways, from gardening, moving and painting to buddy projects, visits to lonely elderly people, or activities in neighbourhoods. The goal is to reduce loneliness and individualism and to make Utrecht a more caring city.", url: "https://www.stcutrecht.nl/", lang: null, level: null, duration: "Always", signup: null, loc: null, paid: null, cost: null },
  { cat: "volunteer", name: "Worldpackers", desc: "Community that has a lot of volunteer work opportunities abroad in exchange for shelter. All kind of different interests. Perfect for students who want to travel for some time and want to be involved in local communities.", url: "https://www.worldpackers.com/", lang: null, level: null, duration: "Always", signup: null, loc: null, paid: null, cost: null },
  { cat: "youth", name: "NJR", desc: "Umbrella organization for national youth organizations (ages 12-30). They promote youth participation, advise on youth policy, and support youth representatives at the UN and other platforms. Two options: (1) Youth representative is a 2-year official role, Year 1: learn and work with your co-rep; Year 2: mentor the new representative, involving guest lectures, policy meetings and international conferences. (2) Join a working group.", url: "https://www.njr.nl/projecten/jongerenvertegenwoordigers", lang: "Dutch", level: "1", duration: "2-year role / working group", signup: "September and February", loc: "Netherlands", paid: null, cost: null },
  { cat: "youth", name: "Milieudefensie Jong", desc: "Milieudefensie Jong connects young people interested in environmental and climate issues. They organize campaigns, workshops and actions around topics such as corporate accountability, sustainable living and fair climate policies. Part of the wider Milieudefensie movement. There are 3 national teams (campaigns, communication, community) meeting once every 2 weeks; you can also join local groups and events. Utrecht has a separate group.", url: "https://milieudefensiejong.nl/", lang: "Dutch", level: "1", duration: "Own choice", signup: "Throughout the year", loc: "Netherlands (Utrecht group)", paid: null, cost: null },
  { cat: "youth", name: "Jonge Klimaatbeweging", desc: "The Youth Climate Movement (JKB) is the voice of young people in the Netherlands on climate and sustainability. They represent thousands of students and young people, creating future visions, like the Youth Climate Agenda 2040, to make the country greener and fairer. They have several vacancies; you can become a volunteer or join the board.", url: "https://www.jongeklimaatbeweging.nl/vacatures/", lang: "Dutch", level: "1", duration: "Own choice", signup: "Throughout the year", loc: "Netherlands", paid: null, cost: null },
  { cat: "youth", name: "Studenten voor Morgen (Students for Tomorrow)", desc: "The daily board of Students for Tomorrow is a team of young, enthusiastic, sustainability-minded students responsible for everything within the organisation: projects, finances and support for member organisations. The board is the face of SvM and works to put it firmly on the map. It is also possible to become a volunteer.", url: null, lang: "Dutch", level: "1", duration: "1 year (board) / volunteer", signup: "Board year starts 1 July", loc: "Netherlands", paid: null, cost: null },
  { cat: "youth", name: "Dwars (youth organization GroenLinks / GreenLeft)", desc: "DWARS, the youth branch of GroenLinks (GreenLeft), brings together young people aged 14–28 who want to create a fair, sustainable and progressive future. They organize debates, actions and campaigns on issues like climate justice, equality and freedom. There are many different functions across working groups, ranging from topics like housing and democracy to technology.", url: null, lang: "Dutch", level: "1", duration: "Varies by function", signup: "Whole year", loc: "Netherlands", paid: null, cost: null },
  { cat: "youth", name: "CHOICE for Youth and Sexuality", desc: "CHOICE for Youth and Sexuality is a youth-led organisation based in the Netherlands working globally to ensure young people have access to sexual & reproductive health and rights (SRHR). Their programs include youth leadership, international advocacy and creating safe spaces for all young people. They work with paid staff and volunteers; volunteers are recruited once a year in February.", url: null, lang: "International", level: "1", duration: "Varies by function", signup: "February (once a year)", loc: "Netherlands", paid: null, cost: null },
  { cat: "youth", name: "JongRegio", desc: "JongRegio gives young people the opportunity to share their perspectives on regional issues such as sustainability, mobility, housing and energy. They organize meetings, dialogues and workshops where youth can exchange ideas with policymakers and contribute to the development of their region.", url: null, lang: "Dutch", level: "1", duration: "Regional team (0–4 hrs/wk) or national board (16 hrs/wk)", signup: "Throughout the year", loc: "Netherlands", paid: null, cost: null },
  { cat: "youth", name: "ISO / U-raad", desc: "ISO works with student councils and student political groups across universities and universities of applied sciences. They develop policy positions, conduct advocacy and negotiate with national bodies (like the Ministry of Education) on issues such as student financing, quality of higher education and equal access to education. They collaborate with many local member organisations. For the U-raad, 12 students are elected each year, you join a student party at Utrecht University and then get elected.", url: null, lang: "International", level: "1", duration: "Unknown", signup: "Elections once a year", loc: "Netherlands (Utrecht: U-raad)", paid: null, cost: null },
  { cat: "youth", name: "FNV Jong", desc: "FNV Young represents and supports young workers, students and those entering the labour market. They focus on fair wages, safe working conditions, contracts, income security and participation in policymaking relevant to young people, engaging with national bodies like the Social and Economic Council (SER). 6 people form the board per year; you need to be active as a volunteer first. Biggest union in the Netherlands, with over 1 million members.", url: null, lang: "Dutch", level: "1", duration: "Unknown", signup: "Throughout the year", loc: "Netherlands", paid: null, cost: null },
  { cat: "youth", name: "CNV Jong", desc: "CNV Jongeren is the youth branch of the CNV trade union, representing people aged 13 to 30 in the Netherlands. It supports young people in education and the labour market with advice on contracts, internships and workplace rights, plus training to ease the step from study to work, and ensures youth voices are heard in politics. 6 people form the board per year; you need to be active as a volunteer first. Second biggest union, with 300,000 members.", url: null, lang: "Dutch", level: "1", duration: "Unknown", signup: "Throughout the year", loc: "Netherlands", paid: null, cost: null },
  { cat: "youth", name: "WWF-NL Youth Advisory Committee", desc: "Two options: join the board (an official role with board meetings, not intensive; you will likely also join a project team and other WWF events), or join a project team (choose a topic to advise WWF-NL on in cycles of 1-2 months: brainstorm with WWF employees, deep dive, evaluate WWF's work and competitors, do literature research and interviews, gather new ideas, then present findings in a document and possibly a presentation). Possible subjects: marketing strategy, conservation, youth engagement, blue carbon credits, forest foresight funding, green/impact finance.", url: "https://www.wwf.nl/", lang: "International", level: "1", duration: "A couple of hours a week / 1–2 month cycles", signup: "Any time", loc: "Netherlands", paid: null, cost: null },
  { cat: "youth", name: "World's Youth for Climate Justice (WYCJ)", desc: "A global campaign taking climate change and human rights to the International Court of Justice (ICJ). The advisory opinion seeks to clarify the obligations of states to protect the rights of current and future generations from the adverse effects of climate change. They have groups all over the world, including Europe and the Netherlands, a good way to become active on climate justice and meet other motivated people.", url: "https://www.wy4cj.org/", lang: "International", level: "1", duration: "Own choice", signup: "Throughout the year", loc: "Netherlands / Global", paid: null, cost: null },
  { cat: "youth", name: "A SEED Europe", desc: "A SEED (Action for Solidarity, Equality, Environment and Diversity) is an international youth organisation based in Amsterdam focused on sustainable food systems, environmental justice and social equality. They run awareness campaigns and organise debates, workshops, festivals and training on issues like food sovereignty, climate change and sustainable agriculture. Year-long volunteer positions open every September via the European Solidarity Corps (posted in late spring); intern call-outs for the spring semester around December or January; or help with a specific event by emailing them.", url: "https://aseed.net/", lang: "International", level: "1", duration: "A couple of hours/week up to full time", signup: "ESC opens September; interns Dec/Jan; events year-round", loc: "Amsterdam", paid: null, cost: null },
  { cat: "youth", name: "Youth and Environment Europe (YEE)", desc: "YEE supports, facilitates and organises campaigns, workshops, exchanges and seminars that raise knowledge and awareness about environmental issues among young people. It promotes cooperation between member organisations, shares ideas, and encourages voluntary action for environmental protection. All activities are led by young people (under 30) across multiple European countries. Note: this is more of a network organisation, not really something to join as an individual student.", url: "https://yeenet.eu/", lang: "International", level: "1", duration: "Varies", signup: "Throughout the year", loc: "Europe", paid: null, cost: null },
  { cat: "youth", name: "European Sustainable Development Network (ESDN)", desc: "A network focused on implementing the Sustainable Development Goals (SDGs) across Europe.", url: "https://www.esdn.eu/", lang: "International", level: "1", duration: "Varies", signup: "Throughout the year", loc: "Europe", paid: null, cost: null },
  { cat: "youth", name: "MDT Jongerenpanel", desc: "A youth panel that works on improving the MDT (Maatschappelijke Diensttijd / national voluntary service). They look for new members every March.", url: "https://www.njr.nl/projecten/mdt-jongerenpanel", lang: "Dutch", level: "1", duration: "Varies", signup: "March", loc: "Netherlands", paid: null, cost: null },
  { cat: "youth", name: "WECF, Funding Fairer Futures", desc: "Initiates and supports climate-justice and gender-transformative projects in the EU, including the Netherlands, with targeted funding and capacity-building for civil society and feminist organizations. Activities include calls for proposals across five climate funds (including the Feminist Climate Action Fund) and awareness, advocacy and networking at a Netherlands-wide level.", url: "https://www.wecf.org/", lang: "International", level: "1", duration: "Varies", signup: "Grant applications open November", loc: "Netherlands / EU", paid: null, cost: null },
  { cat: "youth", name: "WO=MEN, Dutch Gender Platform", desc: "WO=MEN, the Dutch Gender Platform, is the largest gender-equality network in Europe. It brings together NGOs, activists, experts, students, entrepreneurs, academics and policymakers working on women's rights, gender equality and inclusive peace and security, in the Netherlands and worldwide. It influences national and international policy, shares knowledge, monitors gender-related developments and strengthens organizations working on human rights, conflict prevention and equal participation. You can join as an individual member and take part in work groups.", url: "https://www.wo-men.nl/", lang: "International", level: "1", duration: "Varies (work groups)", signup: "Throughout the year", loc: "Netherlands", paid: null, cost: null },
  { cat: "youth", name: "Oma's Soep", desc: "Oma's Soep is a Dutch social enterprise that brings young people and elderly people together to combat loneliness. Volunteers cook fresh soups and meals together with elderly participants, creating meaningful social contact while preventing food waste by using leftover vegetables. The soups are also sold in supermarkets, with profits supporting community activities and weekly 'Soepmaatjes' visits to lonely seniors.", url: "https://omassoep.nl/", lang: "Dutch", level: "1", duration: "Student board or separate events", signup: "Throughout the year", loc: "Netherlands", paid: null, cost: null },
  { cat: "youth", name: "Amnesty International Student Groups", desc: "A human-rights and activism organization with student groups in cities across the Netherlands, running educational campaigns and volunteering opportunities. The Student Group Introduction Day kicks off the university student Amnesty groups (including Utrecht: AISU), with year-round volunteer actions, local meetups and community-building.", url: "https://www.amnesty.nl/", lang: "International", level: "1", duration: "Year-round", signup: "Student Group Introduction Day (September)", loc: "Netherlands (Utrecht: AISU)", paid: null, cost: null },
  { cat: "youth", name: "ActionAid Netherlands", desc: "ActionAid Netherlands is a human-rights organization fighting for gender equality, climate justice and fair working conditions worldwide. From the Netherlands, they support women and communities in the Global South by campaigning against exploitation, pushing for responsible business practices and influencing Dutch and EU policy, working with local partners, activists and young changemakers. They run the Feminist Climate Academy (2–4 hrs/week) with a training weekend, sessions on feminism and the energy transition, an online exchange with activists in affected countries, a public event at Pakhuis de Zwijger, a networking event and your own action.", url: "https://actionaid.nl/doe-mee/feminist-climate-academy/", lang: "Dutch", level: "1", duration: "2–4 hours/week", signup: "Feminist Climate Academy (later in the year)", loc: "Netherlands", paid: null, cost: null },
  { cat: "youth", name: "Thirty030", desc: "Thirty030 is a collective of thirty young residents of Utrecht (all under 30) who act as 'city ambassadors'. Together they create projects that make the city more fun, inclusive, sustainable and creative, organise campaigns and events in public space, advise the municipality and local organisations as a youth think tank, and act as spokespeople and moderators at Utrecht events. You can apply to become a city ambassador for one year if you are 18–30 and live in Utrecht, spending a few hours per week on your own projects, meet-ups and trainings.", url: null, lang: "Dutch", level: "1", duration: "1 year (a few hours/week)", signup: "Apply for 1-year ambassadorship", loc: "Utrecht", paid: null, cost: null },
  { cat: "youth", name: "Ocean Love", desc: "A global collective based in the Netherlands of people working on marine-life conservation. They run an unofficial board programme and recruit content creators for ocean activism on behalf of NGOs, design, film, composing songs, writing, campaigning and more. Both volunteer and board roles are available.", url: "https://www.oceanloveawards.com/", lang: "International", level: "1", duration: "Varies (volunteers & board)", signup: "Throughout the year", loc: "Netherlands / Global", paid: null, cost: null },
  { cat: "impact", name: "Externship", desc: "Online externship platform connecting people worldwide (from Kathmandu to Kenya) with companies, aimed at giving job opportunities to people in remote areas. Programmes run a couple of months and build international connections online. The National Geographic externship requires a video and short interview, is highly international (roughly one person per country per cohort, three cohorts a year), adds you to an alumni LinkedIn group and involves a big GIS project.", url: "https://www.extern.com/externships", lang: "International", level: "1", duration: "A couple of months", signup: "3 cohorts per year", loc: "International (online)", paid: false, cost: "Not paid (€10 platform fee)" },
  { cat: "impact", name: "SDG Challenge", desc: "Do a project for a company focused on making them more sustainable, across a wide variation of companies and topics. At least 10 challenges per month and easy to join.", url: "https://sdg-challenge.com/netherlands", lang: "International", level: "1", duration: "Depends on project; ~1 day a week", signup: "Throughout the year", loc: "International / Netherlands", paid: false, cost: "Not paid" },
  { cat: "impact", name: "Jonge Rewilders Nederland", desc: "Group anyone can join where you get invited to rewilding projects, seminars and other free events. You only pay for some food. Great for the CV.", url: "https://arkrewilding.nl/samen-rewilden-samen-wilde-natuur-ontwikkelen/ark-jonge-rewilders-netwerk", lang: "International", level: "1", duration: "Own choice", signup: "Throughout the year", loc: "Netherlands", paid: false, cost: "Not paid (small food costs)" },
  { cat: "impact", name: "Young Rewilders Network (EYR)", desc: "As a member of the European Young Rewilders you get dedicated channels to communicate with fellow young rewilders and the EYR team, exclusive content and (online) events, visibility for your work, and general support for engaging in or initiating rewilding initiatives. More for CV building and event opportunities (no guaranteed job placement).", url: "https://rewildingeurope.com/", lang: "International", level: "1", duration: "Own choice", signup: "Open throughout the year", loc: "International (Europe)", paid: false, cost: "Not paid" },
  { cat: "impact", name: "NAHSS", desc: "Netherlands Asia Honours Summer School. A ~4-month consultancy project (a couple of hours a week, not intense) plus a 3.5-week summer school from mid-July through August. For 2nd/3rd-year bachelor students at a Dutch research university with affinity for Asia; requires fluent English and excellence (honours track, distinctive extracurriculars, or grades ≥7.5/10). Focus on business and international relations.", url: "https://www.nahss.nl/nl/", lang: "International (English)", level: "2", duration: "Block 3 & 4, a few hours/week + 3.5 weeks summer", signup: "Deadline mid-January; starts around March", loc: "Netherlands / Asia", paid: false, cost: "Not paid" },
  { cat: "impact", name: "United Netherlands delegation", desc: "First half of the academic year. Every Friday a full day plus a couple of hours a week preparation. Lots of public speaking and international relations, with two Model UNs in Oxford and Harvard. Amazing networking opportunities; hard to get in.", url: "https://unitednetherlands.org/delegation/", lang: "International", level: "3", duration: "Half-year; every Friday + prep", signup: "Towards the end of the academic year (block 1 & 2)", loc: "International (Oxford & Harvard trips)", paid: false, cost: "Not paid" },
  { cat: "impact", name: "United Netherlands public speaking course (5 weeks)", desc: "Every Monday evening for 5 weeks (2-3 hours). Small and low-key, held in Utrecht. Good for skills development and the CV, less about networking. Autumn and spring editions.", url: "https://unitednetherlands.org/the-public-speaking-program/the-sessions/", lang: "International", level: "1", duration: "5 weeks, 1 evening a week", signup: "Autumn and spring editions", loc: "Utrecht", paid: false, cost: "Not paid" },
  { cat: "impact", name: "Humanity in Action fellowship", desc: "For those passionate about human rights, democracy and social justice. The Amsterdam Fellowship is an educational summer programme with 20 students combined with a self-implemented action project. Themes include human rights, democracy, inclusivity, social justice and the rule of law. Also offers shorter trainings, action projects and networking events that combine well with study.", url: "https://humanityinaction.org/fellowship-amsterdam/", lang: "International", level: "2", duration: "During summer break", signup: "Summer programme", loc: "International (Amsterdam)", paid: false, cost: "Not paid" },
  { cat: "impact", name: "Solve Consulting", desc: "Student consultancy organisation in the Netherlands (Utrecht, Rotterdam, Amsterdam) focused on social impact for non-profits and social enterprises. Interdisciplinary student teams take on advisory questions with guidance, training and coaching from partners such as Deloitte and Berenschot.", url: "https://www.solve-consulting.nl/", lang: "Dutch", level: "1-2", duration: "8 hours a week", signup: "Apply before 1 October", loc: "Netherlands (Utrecht/Rotterdam/Amsterdam)", paid: false, cost: "Not paid" },
  { cat: "impact", name: "DKC", desc: "Connects students with social organisations, start-ups and small businesses needing strategic advice they often can't afford from large firms. Student teams work voluntarily on business strategy, marketing & communication, organisational development and sustainability/social impact, guided by experienced professionals and trainings from top consultancies (Kearney, BCG, Bain, McKinsey, Strategy&, OC&C).", url: "https://dekleineconsultant.nl/", lang: "Dutch", level: "2", duration: "10-15 hours/week, 8-week project", signup: "September, January or April", loc: "Netherlands", paid: false, cost: "Not paid" },
  { cat: "impact", name: "Unipartners", desc: "Connects students with organisations, start-ups and small businesses needing strategic advice. Student teams work on business strategy, marketing & communication, organisational development and sustainability/social impact, with professional guidance and trainings from top consultancies (Kearney, BCG, Bain, McKinsey, Strategy&, OC&C).", url: "https://www.unipartners.nl/", lang: "Dutch", level: "1-2", duration: "10-15 hours/week, 8-10-week project", signup: "Throughout the year", loc: "Netherlands", paid: false, cost: "Not paid" },
  { cat: "impact", name: "Generation C consulting", desc: "Dutch student consultancy focused on tech and data, with occasional sustainability work. Hard to get in. Rotterdam based.", url: null, lang: "Dutch (maybe international)", level: null, duration: null, signup: null, loc: "Rotterdam", paid: null, cost: null },
  { cat: "impact", name: "Young Lady Business Academy", desc: "Dutch only. Twice a year a selected group joins a week of activities (ages 15-25) designed to help you achieve the career you want, overcome obstacles and learn skills. Very good for networking, with prizes such as mentorship and training programmes. Requires pitching and submitting your career vision. Edition 15: pre-registration by 27 Oct 2025, pitch rounds 12-13 Nov, Academy week 24-28 Nov 2025 at Dotslash Utrecht.", url: "https://www.ylba.nl/", lang: "Dutch", level: "1", duration: "1 week + a few days on location", signup: "Edition 15: 27 October 2025 (twice a year)", loc: "Utrecht", paid: null, cost: null },
  { cat: "impact", name: "West Wing", desc: "Official youth think tank of and for the Ministry of Foreign Affairs and the Advisory Council on International Affairs. Around 70 young professionals and students from diverse academic backgrounds advise the Ministry on Dutch foreign policy and write unsolicited advice with the Advisory Council. Each year a new group volunteers for one year.", url: "https://www.thewestwing.nl/en", lang: "Dutch", level: "3", duration: "1 year; less than a day per week (maybe half)", signup: "Apply before 9 September", loc: "Netherlands", paid: false, cost: "Not paid" },
  { cat: "impact", name: "Erasmus Plus projects", desc: "Range of European youth projects. Check their Instagram page for which projects are currently offered.", url: "https://www.instagram.com/erasmus_plus_projects", lang: "International", level: null, duration: "Varies per project", signup: "Varies per project", loc: "International (Europe)", paid: null, cost: null },
  { cat: "impact", name: "MDT missie", desc: "A 40-hour army camp focused on self-improvement, self-exploration and challenging yourself, plus another 40 hours volunteering for an organisation of your choice.", url: null, lang: "Dutch/English (A2 Dutch needed; open to internationals)", level: "1", duration: "40-hour camp + 40 hours volunteering", signup: "Throughout the year", loc: "Netherlands", paid: false, cost: "Not paid" },
  { cat: "impact", name: "UUMUN", desc: "As a UUMUN delegate you develop public speaking, lobbying, negotiating and writing skills. You train every Wednesday and Saturday with your delegation, UUMUN alumni and partners, aiming for a good result at the MUN conferences in Oxford (October) and Harvard (February).", url: null, lang: "English", level: "2-3", duration: "16-20 hours", signup: "April 13", loc: "International (Oxford & Harvard)", paid: false, cost: "Not paid" },
  { cat: "impact", name: "Idea League Challenge Programme (Delft)", desc: "For students interested in future leadership roles in the public and private sector, drawn to the intersection of technology and society (leadership, politics, entrepreneurship, policy making). Four complementary modules hosted alternately at partner universities (Milan, Zurich, Aachen, Chalmers) over a series of long weekends. Typically 3rd-year bachelor's or 1st-year master's students. Only for Delft students.", url: "https://idealeague.org/students/challenge-programme/", lang: "International", level: "3", duration: "4 long weekends (3 days each)", signup: "28 July", loc: "International (Milan, Zurich, Aachen, Chalmers)", paid: false, cost: "Not paid (€1000 travel stipend)" },
  { cat: "impact", name: "Young Executives Programme Foodservice", desc: "Young executives programme in foodservice. Now closed.", url: null, lang: null, level: null, duration: null, signup: "Now closed", loc: null, paid: null, cost: null },
  { cat: "impact", name: "YEP Programmes", desc: "Young Experts Programme on sustainability, connecting young experts with developing nations. Now closed.", url: "https://www.yepprogrammes.com/young-experts/application", lang: "International", level: null, duration: null, signup: "Now closed", loc: "International (developing nations)", paid: null, cost: null },
  { cat: "impact", name: "Enactus", desc: "Student association focused on creating sustainability-driven startups that are started and run entirely by students. The board of Enactus Utrecht supports this with a €2000 grant for startups that pitch for it. Teams from every city compete each year to become national champion and go to the World Cup, hosted in a different city around the world each year.", url: "https://www.enactus.nl/", lang: "International", level: "1", duration: "Own choice", signup: "Whole year", loc: "International", paid: false, cost: "Not paid" },
  { cat: "impact", name: "Biobased Innovation Student Challenge (BISC-E)", desc: "Competition where student teams develop innovative ideas for a sustainable, biobased economy, designing concepts, products or processes that replace fossil-based resources with renewable, biological alternatives. Hands-on project development, expert feedback and competition at national and European levels. You set up your own team and can apply at any time; contacts and supportive professors are available to help shape the right project.", url: "https://www.bisc-e.eu/", lang: "International", level: null, duration: "One day a week for several months", signup: "Once a year registration period", loc: "International (Europe)", paid: false, cost: "Not paid" },
  { cat: "impact", name: "Agroecology & Sustainable Food Systems summer school (ISARA-Lyon)", desc: "Summer school in Lyon on agroecology and sustainable food systems, hosted by ISARA-Lyon.", url: "https://isara.fr/en/how-to-apply/summer-school/agroecology-summer-school/", lang: "English", level: null, duration: "4-5 weeks in summer break", signup: "Registration period in spring", loc: "Lyon, France", paid: false, cost: "Not paid (paying fee)" },
  { cat: "impact", name: "Dutch Dairy Challenge (DDSC)", desc: "Interdisciplinary programme where bachelor and master students work with farmers, industry and government to explore how dairy farming can remain sustainable, healthy and economically viable from the perspective of animals, environment and farmers. Active participation in team projects, farm visits, workshops and stakeholder discussions to develop innovative proposals. For 3rd-year bachelor and master students; can be taken as one course. Unclear if running this year.", url: "https://ewuu.nl/en/education/challenges/dutch-dairy-student-challenge-ddsc/", lang: "English", level: null, duration: "~1 day a week (6-8 hours) over several months", signup: "March till May (uncertain if running this year)", loc: "Netherlands", paid: null, cost: null },
  { cat: "impact", name: "MDT", desc: "Choose one of around 200 projects to join; most are easily doable alongside studies. Good projects in Utrecht include Missie 030, VP School of Experience, Stichting Move, Young Peacebuilders, Sprint, MDT voor Dementie and MDT tegen Eenzaamheid.", url: "https://www.doemeemetmdt.nl/projecten", lang: "Dutch", level: "1", duration: "Doable alongside studies", signup: "Throughout the year", loc: "Netherlands (Utrecht)", paid: false, cost: "Not paid" },
  { cat: "impact", name: "Fair Future Generators (Milieudefensie)", desc: "Four-month climate traineeship of at least 8 hours per week, run by Milieudefensie.", url: "https://milieudefensie.nl/actie/fairfuturegenerators", lang: "Dutch", level: "1", duration: "4 months, at least 8 hours/week", signup: "Apply from 3 November, start 24 February", loc: "Netherlands (Utrecht)", paid: false, cost: "Not paid" },
  { cat: "impact", name: "Forward Inc.", desc: "Amsterdam-based, internationally operating non-profit helping newcomers (people with a refugee/forced-migration background and others from non-OECD countries) start and grow businesses through free entrepreneurship programmes. Digital Entrepreneurship Program (DEP): 8-week free online course (~8h/week) covering mindset, idea validation, value proposition, lean canvas, marketing, finance and pitching. Student Consultant Program: volunteer role (~8h/week for 5 months) supporting newcomer entrepreneurs in small teams with a business coach, building real consulting and startup experience.", url: "https://www.newcomersforward.com/get-involved/#student-consultants", lang: "International", level: "1", duration: "~8 hours a week (5 months for consultant role)", signup: "Different rounds a year", loc: "Netherlands (Amsterdam) / International", paid: false, cost: "Not paid" },
  { cat: "impact", name: "Rewrite", desc: "REWRITE is a Horizon Europe research project to rewild and restore intertidal soft-sediment ecosystems (saltmarshes, seagrass meadows, mudflats) to boost biodiversity, climate resilience and carbon benefits along European shorelines. Runs 1 Oct 2023 - 30 Sep 2028, coordinated by Nantes Universite, budget ~€7.93M. Dutch demonstrator areas are the Wadden Sea and the Scheldt Estuary (Westerschelde/Saeftinghe), combining field and lab work with remote sensing, modelling and Multi-Actor Labs. A large ocean rewilding organisation.", url: "https://rewriteproject.eu/", lang: "International", level: "1", duration: null, signup: null, loc: "International (Netherlands sites)", paid: false, cost: "Not paid" },
  { cat: "impact", name: "Feminist Climate Academy", desc: "Climate academy run by ActionAid, requiring roughly 2 to 4 hours a week. Runs later in the year.", url: "https://actionaid.nl/doe-mee/feminist-climate-academy/", lang: "Dutch", level: "1", duration: "2-4 hours a week", signup: "Later in the year", loc: "Netherlands", paid: false, cost: "Not paid" },
  { cat: "university", name: "Exchange to Sciences Po", desc: "Exchange option for students interested in Politics. Other exchange destinations still to be explored.", url: null, lang: "French / English", level: null, duration: null, signup: null, loc: "Sciences Po (France)", paid: null, cost: null },
  { cat: "university", name: "Schwarzman Scholars", desc: "Prestigious fully-funded one-year master's leadership scholarship programme based in China.", url: null, lang: "English", level: null, duration: null, signup: null, loc: "China", paid: null, cost: null },
  { cat: "university", name: "GSS-track (Wageningen)", desc: "Global Sustainability Science track at Wageningen University (WUR).", url: null, lang: null, level: null, duration: null, signup: null, loc: "Wageningen University (WUR)", paid: null, cost: null },
  { cat: "university", name: "Biobased Transition / Biobased Technology (minor, WUR)", desc: "From a fossil to a biobased economy, technology and societal aspects. Relevant across focus areas: Energy; Water, Climate & Ecosystems (ecological impact of biobased solutions on ecosystems); Economics (economic sides of the biobased economy); Food (new food and biomass chains).", url: null, lang: null, level: null, duration: null, signup: null, loc: "Wageningen University (WUR)", paid: null, cost: null },
  { cat: "university", name: "Financing Sustainable Transitions (minor, WUR)", desc: "How financing and investment enable energy transitions and sustainable innovations. Focus areas: Energy; Governance & Societal Transformation (governance of money flows & policy in transitions); Economics (economic mechanisms behind sustainable transitions).", url: null, lang: null, level: null, duration: null, signup: null, loc: "Wageningen University (WUR)", paid: null, cost: null },
  { cat: "university", name: "Innovation & Entrepreneurship (minor, WUR)", desc: "Sustainable entrepreneurship and innovation, often linked to energy & technology. Focus areas: Energy; Governance & Societal Transformation (governance of innovation & new initiatives); Economics (markets & business models for sustainable solutions).", url: null, lang: null, level: null, duration: null, signup: null, loc: "Wageningen University (WUR)", paid: null, cost: null },
  { cat: "university", name: "Gender and Diversity for Sustainable Worlds (minor, WUR)", desc: "Social dimensions of sustainability, inclusion, equality and ethics. Focus area: Governance & Societal Transformation.", url: null, lang: null, level: null, duration: null, signup: null, loc: "Wageningen University (WUR)", paid: null, cost: null },
  { cat: "university", name: "Plastics in the Environment and Society (minor, WUR)", desc: "Policy and societal approach to plastic pollution. Focus areas: Governance & Societal Transformation (policy/societal approach); Water, Climate & Ecosystems (effect of plastic on ecosystems & water quality); Food (plastics in food chains & packaging issues).", url: null, lang: null, level: null, duration: null, signup: null, loc: "Wageningen University (WUR)", paid: null, cost: null },
  { cat: "university", name: "Climate-Resilient Crops: Interdisciplinary Approaches (minor, WUR)", desc: "Adapting crops and farming systems to climate change. Focus areas: Water, Climate & Ecosystems; Food (food security & agricultural adaptation).", url: null, lang: null, level: null, duration: null, signup: null, loc: "Wageningen University (WUR)", paid: null, cost: null },
  { cat: "university", name: "Leiden University", desc: "Programmes to be explored / added.", url: null, lang: null, level: null, duration: null, signup: null, loc: "Leiden University", paid: null, cost: null },
  { cat: "university", name: "Nationale weerbaarheidstraining (Defensie)", desc: "10-week military basic training alongside your studies, after which you have the option to become a reservist.", url: null, lang: "Dutch", level: null, duration: "10 weeks (alongside studies)", signup: null, loc: "Ministry of Defence (Netherlands)", paid: null, cost: null },
  { cat: "university", name: "Military Technology, Processes & Systems (master, Defensie)", desc: "Defence master's programme.", url: null, lang: "Dutch", level: null, duration: null, signup: null, loc: "Ministry of Defence (Netherlands)", paid: null, cost: null },
  { cat: "university", name: "Defence Management of Compliance and Innovation (master, Defensie)", desc: "Defence master's programme.", url: null, lang: "Dutch", level: null, duration: null, signup: null, loc: "Ministry of Defence (Netherlands)", paid: null, cost: null },
  { cat: "paid", name: "Defensity College", desc: "Minimum 100 ECTS needed; hard to get in and the application takes a while. Paid work of 1 or more days a week, with lots of opportunities for sustainability work in the army. After a 2-week military (basic) training, more training weeks are available if you want. €18/hour at the start, €23 after a year. Dutch students only.", url: "https://defensitycollege.nl/", lang: "Dutch", level: "3", duration: "1 or more days a week", signup: "Apply any time (long process)", loc: "Netherlands", paid: true, cost: "Paid (€18/hr; €23 after a year)" },
  { cat: "paid", name: "Youth Advisory Group (YAG)", desc: "Connects students with social organisations, start-ups and small businesses needing strategic advice. Student teams work voluntarily on projects such as business strategy, marketing & communication, organisational development and sustainability/social impact, with guidance and trainings from top consultancies (Kearney, BCG, Bain, McKinsey, Strategy&, OC&C). Note: SSC consulting - sustainability.", url: null, lang: "Dutch", level: "1-2", duration: "15-20 hrs/week, 8-10 week project", signup: "Throughout the year", loc: "Netherlands", paid: true, cost: "Paid" },
  { cat: "paid", name: "Blue Book Traineeship EU", desc: "Paid traineeship/internship offered by the European Commission, lasting 5 months. Held twice a year: an October session (applications open February) and a March session (applications open around July-August). You can do an administrative traineeship or a translation traineeship (DGT). Work areas vary widely: policy, HR, environmental policy, law, translation, communication. Mostly in Brussels, but also Luxembourg or other EU locations.", url: "https://traineeships.ec.europa.eu/", lang: "International", level: "3", duration: "5 months full-time", signup: "29 August", loc: "International (Brussels)", paid: true, cost: "€1,493 per month" },
  { cat: "paid", name: "Nationale Denktank", desc: "Dutch only. A 4-month full-time programme, once a year, paid and hard to get in. Starts with a summer school in August. You work on solutions for a sustainability problem, with a big focus on personal development and professional skills through external trainings. Amazing for networking.", url: "https://nationale-denktank.nl/", lang: "Dutch", level: "4", duration: "4 months full-time", signup: "Once a year, apply before summer", loc: "Netherlands", paid: true, cost: "Paid" },
  { cat: "paid", name: "Energie Student", desc: "Platform where students apply their knowledge and skills to real-life challenges in the energy transition. Students work in multidisciplinary teams on projects for companies, municipalities and other organisations engaged in sustainable energy and innovation, combining practical experience with collaboration alongside professionals. Several hours a week of research and consultancy, supported by training and guidance; builds work experience, network and sustainability/energy expertise.", url: "https://energiestudent.nl/", lang: "Dutch", level: "1", duration: "At least one day a week (depends on fit)", signup: "Whole year", loc: "Netherlands", paid: true, cost: "Paid" },
  { cat: "paid", name: "Werken voor Nederland", desc: "Government job portal for positions across the Dutch national government and ministries, including sustainability and policy roles.", url: null, lang: "Dutch", level: null, duration: "Varies", signup: "Open application / vacancies", loc: "Netherlands", paid: true, cost: "Paid" },
  { cat: "paid", name: "Ecological fieldwork (bats / vleermuizen)", desc: "Field-ecology work via green agencies (e.g. Bureau Waardenburg, Faya, Rangswijk and others). Tips from Alonso & Kevin: bat monitoring is goud waard, with a little experience you find work fast, and after a few years you can move into management. Use open applications (these work very well); avoid recruiters (they take a big cut of your pay) and Indeed (vacancies cost firms money, so less wanted). Provinces and environmental agencies pay more than commercial firms but the work (quality-checking fieldwork) is duller. EcoLogisch is rated a weak agency (many projects, low quality).", url: null, lang: "Dutch", level: "1", duration: "Varies", signup: "Open application", loc: "Netherlands", paid: true, cost: "Paid" },
  { cat: "paid", name: "Teia", desc: "Ecological consultancy/fieldwork agency that often needs students for field projects (contact: Damien, met at the Sustainable Switch event).", url: "https://teia.nl/", lang: "Dutch", level: null, duration: "Varies", signup: "Open application", loc: "Netherlands", paid: true, cost: "Paid" },
  { cat: "paid", name: "inClimate", desc: "Job board for sustainability roles in the Netherlands.", url: null, lang: "Dutch / English", level: null, duration: "Varies", signup: "Open application", loc: "Netherlands", paid: true, cost: "Paid" },
  { cat: "paid", name: "Examentraining (e.g. Eindsprint)", desc: "Give intensive exam-training courses to secondary-school pupils. People often report learning a lot about leadership, as you stand in front of a class, give intensive trainings and get a lot of responsibility quickly.", url: "https://www.eindsprint.nl/", lang: "Dutch", level: null, duration: "Short intensive periods", signup: "Apply any time", loc: "Netherlands", paid: true, cost: "Paid" },
  { cat: "paid", name: "Operation Social Response", desc: "Door-to-door fundraising for charities.", url: "https://social-response.nl/solliciteren/", lang: "Dutch", level: null, duration: "Varies", signup: "Apply any time", loc: "Netherlands", paid: true, cost: "Paid" },
  { cat: "paid", name: "Klimaatroute", desc: "Company that visits people at home to advise them on making their houses more sustainable.", url: null, lang: "Dutch", level: null, duration: "Varies", signup: "Open application", loc: "Netherlands", paid: true, cost: "Paid" },
  { cat: "paid", name: "DareEducation", desc: "Guest teacher at secondary schools giving masterclasses about the energy transition; you also receive a daily allowance.", url: null, lang: "Dutch", level: null, duration: "Varies", signup: "Open application", loc: "Netherlands", paid: true, cost: "Paid (day allowance)" },
  { cat: "paid", name: "Race Against Waste", desc: "Dutch social enterprise (founder: Timmy de Vos) inspiring people (especially children) to join the circular-economy transition. Through school competitions like the E-waste Race and Textile Race, primary-school classes collect old electronics and textiles, repair items and learn about reuse, recycling and saving raw materials. Students can take a side-job with a training track and then run/give these school waste competitions, with lots of contact with schools, teachers, children and municipalities.", url: null, lang: "Dutch", level: null, duration: "Flexible (side-job)", signup: "Open application", loc: "Netherlands", paid: true, cost: "Paid" },
  { cat: "paid", name: "Nimble", desc: "Sustainable food processor; interested in working students.", url: null, lang: null, level: null, duration: "Varies", signup: "Open application", loc: "Netherlands", paid: true, cost: "Paid" },
  { cat: "paid", name: "Smarttimer (Rijkswaterstaat)", desc: "Working-student programme at Rijkswaterstaat / Ministry of Infrastructure & Water Management, working alongside your studies on real projects in your field. You choose your hours (roughly 8–16 per week). Head office in Utrecht.", url: null, lang: "Dutch", level: null, duration: "8–16 hours/week (your choice)", signup: "Open application", loc: "Utrecht", paid: true, cost: "€19 per hour" },
  { cat: "paid", name: "Waterhandjes", desc: "Deploys enthusiastic students on water-sector projects, project support, fieldwork, communications or IT, giving clients fast, flexible help while students gain field experience. Has placed students on 90+ projects for 25 clients.", url: null, lang: "Dutch", level: null, duration: "Flexible", signup: "Open application", loc: "Netherlands", paid: true, cost: "Paid" },
  { cat: "paid", name: "KWR Water Research Institute", desc: "Internationally renowned water research institute (Nieuwegein) bridging water science and practice with utilities, governments, universities and companies. Has an open-application option; interesting as a water research body.", url: null, lang: "Dutch / English", level: null, duration: "Varies", signup: "Open application", loc: "Nieuwegein", paid: true, cost: "Paid" },
  { cat: "paid", name: "Werkstudent BAM", desc: "Koninklijke BAM Group designs, builds and maintains buildings, homes and infrastructure. As a working student you gain hands-on experience on real building, infrastructure and utility projects, backgrounds from civil engineering, construction, IT, mechanical/electrical engineering to communication or finance. Tasks range from project/team support to site preparation and input on digitalisation and innovation. Sustainability (“Building a sustainable tomorrow”) is a key theme.", url: null, lang: "Dutch", level: null, duration: "Varies", signup: "Open application", loc: "Netherlands", paid: true, cost: "Paid" },
  { cat: "paid", name: "Waterschap De Stichtse Rijnlanden", desc: "Regional water authority that is often looking for people. Twan de Ruiter sat on a youth council for water authorities; contact Daan can connect you even without an open vacancy.", url: null, lang: "Dutch", level: null, duration: "Varies", signup: "Open application (via contact)", loc: "Utrecht region", paid: true, cost: "Paid" },
  { cat: "paid", name: "Waterprof", desc: "Consultancy in water, spatial planning and sustainability.", url: "https://waterprof.nl/vacature/", lang: "Dutch", level: null, duration: "Varies", signup: "Vacancies / open application", loc: "Utrecht", paid: true, cost: "Paid" },
  { cat: "paid", name: "FutureWater", desc: "Consultancy in water, spatial planning and sustainability.", url: "https://www.futurewater.nl/", lang: "Dutch / English", level: null, duration: "Varies", signup: "Open application", loc: "Wageningen", paid: true, cost: "Paid" },
  { cat: "paid", name: "Oak Consultants", desc: "Consultancy in water, spatial planning and sustainability.", url: "https://oakconsultants.nl/oakconsult/", lang: "Dutch", level: null, duration: "Varies", signup: "Open application", loc: "Utrecht", paid: true, cost: "Paid" },
  { cat: "paid", name: "Nelen & Schuurmans", desc: "Consultancy in water, spatial planning and sustainability.", url: "https://nelen-schuurmans.nl/en/home/", lang: "Dutch / English", level: null, duration: "Varies", signup: "Open application", loc: "Utrecht", paid: true, cost: "Paid" },
];

const FIELD_OPTIONS = ["Energy & climate", "Water & coasts", "Ecology & nature", "Food & agriculture", "Cities & mobility", "Circular economy", "Policy & governance", "Business & innovation", "International development", "Data & GIS"];

const TYPE_OPTIONS = [
  { id: "unsure", label: "I'm not sure yet", icon: "Sparkles", desc: "Inspire me from your programmes" },
  { id: "programme", label: "A programme", icon: "Rocket", desc: "Learn & build my CV" },
  { id: "direction", label: "General direction", icon: "Globe", desc: "Help me find my path" },
  { id: "specific", label: "Something specific", icon: "FileText", desc: "I have an idea in mind" },
];
