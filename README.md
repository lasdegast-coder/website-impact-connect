# Impact Connect — website

Statische website voor Impact Connect: internships, thesis-plekken, events en programma's
voor studenten die impact willen maken naast hun studie.

Gebouwd met pure HTML/CSS/JS — **geen build-stap, geen dependencies, geen Node.js nodig.**
Precies zoals de Thermal Compost Systems-site.

---

## Bestanden

```
index.html               Home
internships.html         Partner internships
thesis.html              Thesis internships
other-internships.html   Other internships
events.html              Events
alumni.html              Ask an alumnus: om een oud-student vragen om mee te praten
programmes.html          Programmes
about.html               About us

styles.css               Ontwerpsysteem: kleuren, layout, animaties
data.js                  ALLE inhoud: vacatures, events, programma's, partners
icons.js                 De 29 icoontjes (Lucide) als SVG
vertalingen.js           Het Nederlands, plus de taalknop in de balk
script.js                Alle werking: zoeken, filteren, detailpaneel, formulier

assets/logos/            Bedrijfslogo's en het UU-logo
assets/programmes/       Logo's van de programma's (ook voor de logoband)
assets/team/             Teamportretten (600x600) en de groepsfoto (1400x933)
serve.py                 Lokale previewserver (alleen voor ontwikkelen)

formulier-backend/       Het script achter de twee formulieren (Google Apps
                         Script). Hoort niet op de website, dit draait bij
                         Google. Zie INSTRUCTIES.md in die map.
```

---

## Bekijken

Dubbelklik gewoon `index.html`. Verder niets nodig.

Wil je liever een echte server (aanrader tijdens het werken, dan zie je wijzigingen
meteen zonder cache-gedoe):

```bash
python3 serve.py
```

Open daarna http://127.0.0.1:8124. Stoppen met Ctrl+C.

---

## Iets aanpassen

**Teksten op een pagina** — open het HTML-bestand van die pagina en pas de tekst aan.
De koppen, alinea's en knoppen staan er gewoon als leesbare HTML in.

**Een internship, event of programma toevoegen of wijzigen** — open `data.js`.
Daar staan alle lijsten:

| Lijst             | Waarvoor                                             |
|-------------------|------------------------------------------------------|
| `INTERNSHIPS`     | Internships (`kind: "partner"` of `kind: "open"`)     |
| `THESIS`          | Thesis-plekken                                       |
| `WORKSTUDENT`     | Werkstudent-banen                                    |
| `EVENTS`          | De eventskalender                                    |
| `PROGRAMMES_DATA` | De 111 programma's                                   |
| `WALL`            | De partnermuur op de homepage                        |
| `THEMES`          | Themakleuren en -namen                               |

Een item kopiëren, aanpassen en opslaan is genoeg — de tellers, filters en de
zoekfunctie passen zich vanzelf aan.

> Partner-internships komen automatisch op `internships.html`, de rest op
> `other-internships.html`. Dat wordt bepaald door `kind: "partner"`.

**Events die geweest zijn verdwijnen vanzelf.** De site kijkt naar de datum van
vandaag en laat alleen zien wat nog komt: op de homepage, in de tijdlijn op
`events.html`, bij "Next up" en in alle tellers. Een meerdaags event blijft staan
zolang de laatste dag nog niet voorbij is, en staat er alleen een maand ("September
2026"), dan blijft het die hele maand staan. `Year-round` en een onbekende datum
verlopen nooit. Je hoeft dus niets weg te halen uit `EVENTS` — een oud event mag er
gewoon in blijven staan, het wordt alleen niet meer getoond. Let er wel op dat een
jaarlijks terugkerend event (Duurzame Dinsdag, Springtij) een vaste datum met jaartal
heeft: als dat jaar voorbij is verdwijnt hij, dus zet er dan het nieuwe jaar in.

**De knoppenrij op de eventspagina maakt zichzelf.** Boven de tijdlijn staat een rij
vakgebieden met het aantal komende events erachter. Die wordt niet met de hand
bijgehouden: hij telt `cat` uit `EVENTS` (of uit de sheet) en toont alleen vakgebieden
waar ook echt iets in zit. Meerdere tegelijk aanklikken mag; "All fields" zet ze weer
uit. Het labeltje **Next up** hangt aan het eerstvolgende event mét datum binnen wat je
gekozen hebt, dus dat verspringt mee. Wil je de namen of de kleuren anders, pas dan
`THEMES` bovenin `data.js` aan; de volgorde van die lijst is ook de volgorde van de rij.

**Het icoontje in het browsertabblad** staat in `assets/favicon.svg` en wordt op elke
pagina ingeladen met één regel in de `<head>`. Het is het merkteken, maar met dikkere
lijnen dan `bridgeMark()` in `script.js`: op zestien pixels overleeft de dunne versie
niet. Verander je het logo, verander dan allebei.

**De site staat in twee talen.** Engels is de standaard; het Nederlands staat in
`vertalingen.js`. In de HTML blijft de Engelse tekst gewoon leesbaar staan, met een
sleutel ernaast:

```html
<a class="nav-link" data-t="nav.home" href="index.html">Home</a>
```

Een Engelse zin verander je dus in de HTML zoals altijd, en het Nederlandse
tegenhangertje in `vertalingen.js` bij die sleutel. Teksten die `script.js` zelf
opbouwt (de formulieren, de kaartjes, "Coming soon") staan er wél in twee talen in;
die herken je aan de `en:` die erbij staat.

Nieuwe tekst vertalen: zet de sleutel in de HTML, de Nederlandse zin in
`vertalingen.js`, en open de pagina daarna met **`?check=taal`** erachter. De console
somt dan op welke sleutels nog geen Nederlands hebben. Met `?lang=nl` of `?lang=en`
dwing je een taal af, handig om iemand een link in een bepaalde taal te sturen.

Drie dingen om te weten:

- **Wisselen herlaadt de pagina.** Dat is met opzet: de helft van wat je ziet wordt
  door `script.js` opgebouwd, en een halve pagina omzetten gaat een keer mis. De
  keuze staat in `localStorage`, dus hij geldt meteen op alle pagina's.
- **Wat iemand in een formulier aanklikt wordt in het Engels opgeslagen**, ook als de
  site in het Nederlands staat. Alleen het label op het scherm is vertaald. Anders
  staat in één kolom van je sheet door elkaar "Paid only" en "Alleen betaald", en kun
  je er niet meer op filteren.
- **De eventomschrijvingen staan tweetalig in `data.js`**, als `desc` en `descNl`.
  Voeg je een event toe zonder `descNl`, dan blijft daar de Engelse zin staan; dat is
  geen fout, alleen nog niet vertaald. De programmanamen uit de Google Sheets blijven
  zoals ze zijn — dat zijn eigennamen.

**Toon van het Nederlands.** Het is geen woord-voor-woordvertaling van het Engels;
waar de letterlijke zin stroef werd, staat er wat een student zelf zou zeggen. Een
paar keuzes die vastliggen, zodat het consistent blijft als je iets toevoegt:

- Engelse woorden die studenten zelf gebruiken blijven staan: *events*, *community*,
  *matchen*, *cv*, *fellowship*, *startup*, *changemaker*, *consultancy*. Vertaal ze
  niet alsnog — "evenementen" klinkt als een gemeentelijke agenda.
- Voor scriptiestages staat overal **afstuderen** (afstudeerstage, afstudeerplek,
  afstudeeronderwerp), niet door elkaar met "scriptie". Alleen de scriptie zelf heet
  een scriptie.
- Vaste kreten uit `data.js` (prijs, tijd, locatie) vertaalt `VELDEN_NL` op de tekst
  zelf. Kloktijden als `13:00 to 17:00` gaan automatisch via een patroon in `veld()`;
  staat er iets tussen haakjes achter, dan moet die tijd los in de lijst.

**Kleuren of lettertypes** — bovenaan `styles.css` staan alle kleuren als variabelen.
Verander die op één plek en de hele site verandert mee.

**Een logo toevoegen** — zet het bestand in `assets/logos/`, voeg het toe aan `LOGOS`
bovenin `script.js`, en verwijs ernaar met `logo: "naam"` in `data.js`.

**Een programmalogo toevoegen** — zet het bestand in `assets/programmes/` en koppel het
in `PROGRAMME_LOGOS` in `data.js` aan de naam van het programma (hoofdletters en
leestekens maken niet uit). Het verschijnt dan meteen op het programmakaartje én in de
lopende logoband op de homepage. Is het logo wit, zet de naam er dan ook bij in
`PROGRAMME_LOGOS_ON_DARK`, dan krijgt het een donker vlakje eronder. Staat er een kolom
`Logo` in de sheet, dan gaat die voor op deze lijst.

**De programma's komen live uit een Google Sheet.** Dat is *LINKED TO WEBSITE
Programmes Database (Google Sheets)*, van het contact@-account, met per categorie een
tabblad. Je past de sheet aan, de bezoeker ververst, en de wijziging staat erop —
`data.js` hoeft niet mee. In `data.js` staat alleen het nummer van de sheet en per
categorie het nummer van het tabblad. Een categorie met een lege regel komt uit
`PROGRAMMES_DATA` in dit bestand, en gaat het ophalen mis, dan valt de site daar
automatisch op terug zodat de pagina nooit leeg is.

De site leest de tabbladen rechtstreeks; publiceren op internet hoeft niet. Wel moet
de sheet op **Iedereen met de link → Viewer** blijven staan. Zet iemand dat uit, dan
verdwijnen de nieuwste programma's stilletjes en toont de site de lijst uit
`PROGRAMMES_DATA`.

Een tabblad toevoegen: open het in de sheet, neem het nummer achter `gid=` uit de
adresbalk over in `PROGRAMME_SHEETS` en zet de categorie erbij in `PROGRAMME_CATS`
ernaast. De kopregel moet `Programme Name | Description | Sign up date | Duration |
Language | Experience level | URL | Location | Costs` zijn; de volgorde van de
kolommen maakt niet uit.

**Een teamlid wijzigen** — het team staat als gewone HTML onderaan `about.html`,
onder "The people you'll meet". Naam, functie en foto staan bij elkaar in één blokje.
Een nieuwe foto zet je vierkant in `assets/team/`; 600x600 is ruim genoeg. Uitsnijden
kan zonder extra programma's:

```bash
sips -c 4000 4000 origineel.jpg --out vierkant.jpg
sips -Z 600 vierkant.jpg --out assets/team/naam.jpg
```

(Het eerste getal is de zijde van het vierkant in de originele foto — neem de kortste
zijde van het origineel. De uitsnede wordt vanuit het midden gemaakt.)

---

## Online zetten

De site staat op **impactconnectutrecht.com**, via GitHub Pages vanuit de repo
`lasdegast-coder/website-impact-connect`. Elke push naar `main` staat binnen een minuut live.

Werk je hier met iemand samen, lees dan eerst `CLAUDE.md`. Daar staat hoe je
voorkomt dat je elkaars werk overschrijft, en wat er al eens is misgegaan.

---

## Nog te doen

Een paar dingen zijn bewust nog placeholders, net als in de vorige versie:

- **De internships staan op "Coming soon".** Ze mogen van de Universiteit Utrecht nog
  niet naar buiten. Er is niets weggehaald: de kaarten, de filters, het detailpaneel en
  de zoekfunctie staan er precies zoals ze gebouwd zijn. Bovenin `data.js` staat één
  schakelaar:

  ```js
  const INTERNSHIPS_LIVE = false;
  ```

  Staat die op `false`, dan tonen `internships.html`, `thesis.html` en
  `other-internships.html` een "Coming soon" in plaats van de lijst, blijft de balk met
  de drie knoppen gewoon werken, staat er op de homepage "Coming soon" bij de teller in
  plaats van een aantal, en komen de plekken niet in de zoekbalk (⌘K) terecht. Zet hem
  op `true` en alles staat er weer; verder hoeft er niets veranderd te worden. De tekst
  van het "Coming soon"-blok staat in `LISTS` bovenin `script.js` (`label` en `soon` per
  tabblad), de opmaak in `.soon-state` in `styles.css`.

- **De formulieren zijn aangesloten.** Er zijn er twee: het afspraakformulier (de knop
  "Plan an appointment") en het alumniverzoek op `alumni.html`. Ze sturen hun antwoorden
  naar het Apps Script uit de map `formulier-backend`, dat ze wegschrijft in de Google
  Sheet, ze naar contact@impactconnectutrecht.com mailt en de student een bevestiging
  stuurt. Het adres van dat script staat in `data.js` bij `FORM_ENDPOINT`. Wijzig je iets
  aan `Code.gs`, publiceer dan opnieuw, anders draait de oude versie door; zie
  `formulier-backend/INSTRUCTIES.md`.
- **Het bewaarvlaggetje in de menubalk is verborgen** zolang `INTERNSHIPS_LIVE`
  op `false` staat. Bewaren kan namelijk alleen op de internshipkaartjes, en die
  zijn er nu niet; een teller die iets telt wat je nergens kunt aanklikken is
  alleen maar verwarrend. Het staat in `script.js` in het opstartblok onderaan.
  Let op: ook als de internships wél live gaan blijft het een teller zonder
  bestemming — je kunt nergens je bewaarde plekken teruglezen. Wil je dat wel,
  dan moet er een pagina of paneel bij.
- **De alumnilijst zelf bestaat nog niet.** De pagina en het formulier staan er; wie
  de vragen beantwoordt moeten jullie nog verzamelen (de knop "Sign up as an alumnus"
  onderaan de pagina is daarvoor bedoeld).
- **De volgorde van de homepage** is: hero, logoband, We're not a job board, Four ways in,
  Coming up, slot-CTA. Bewust zo: veel studenten kennen Impact Connect nog
  niet, dus eerst kort uitleggen wat het is en dan pas de vier ingangen. Het blok
  "The problem isn't motivation" stond hier ook; dat is verhuisd naar `about.html`
  onder "Why we exist", want dat verhaal is voor partners en de faculteit.
- **De partnermuur en het citaat staan uit.** Op de homepage stond "What's possible", een
  raster met twintig bedrijven, en daaronder een donkere sectie met een quote van "Pieter,
  MSc Energy Science" over een stage bij KLM. Allebei verzonnen, dus allebei weggehaald;
  ze staan als commentaar in `index.html` en de werking is intact (`WALL` in `data.js` en
  `initWall()` in `script.js` voor de muur, `.quote-section` in `styles.css` voor het
  citaat). Vul `WALL` met echte partners, of zet er een echte student met naam neer, en
  haal de commentaartekens weg.
- **De WhatsApp-community-knop** op `events.html` wijst nog naar `#`, en de QR-code
  is een placeholder. Dit is nu de belangrijkste knop van de pagina: de kop van
  `events.html` is de uitnodiging voor de community geworden (`.wa-hero` in
  `styles.css`), met de knop en de QR-code als zwaarste elementen. Zet de
  uitnodigingslink in de `href` van `.wa-join`, en vervang het blokje in
  `.wa-hero-qr` door een `<img>` van de echte QR-code. Op een telefoon staat die
  code er bewust niet: die kun je niet scannen met het toestel waarmee je kijkt,
  dus daar wordt de knop schermbreed.
- **Foto's ontbreken buiten het team.** De teamportretten zijn echt; bij de events en
  de categoriepanelen staat nog een getekende illustratie in de huisstijl.
- **De opportunities zijn voorbeelden.** De events zijn echt, de internships en
  thesis-plekken zijn nog verzonnen. Die staan nu toch achter de "Coming soon", dus
  vervang ze door de echte voordat `INTERNSHIPS_LIVE` op `true` gaat.
- **Bedrijven waarvan je je kunt afvragen of ze hier thuishoren staan er niet in.**
  Shell, KLM, BP, Heineken, PwC, Engie, Coolblue en Bol zijn uit `INTERNSHIPS`,
  `THESIS`, `WORKSTUDENT` en `WALL` gehaald, en hun logo's uit `LOGOS` in `script.js`.
  De afweging: geen olie en gas, geen luchtvaart, geen grote accountantskantoren en
  geen webwinkels, want daar staat Impact Connect niet met zijn naam achter. Houd die
  lijn aan als je de echte plekken invult. De logobestanden staan nog wel in
  `assets/logos/`; die mag je weggooien.

---

## Ontwerp

- **Stijl:** editorial, aards en warm — papier, bosgroen en terracotta
- **Kleur:** diep bosgroen (`#13352A`) + terracotta (`#C2683A`) op bone (`#F4EFE3`)
- **Merkteken:** de Vollers Bridge, een dekbalk met daaronder een boog. Nagetekend als
  SVG naar het merkboard (`impact-connect/Logo Impact Connect.JPG`). Het staat in één
  functie, `bridgeMark()` bovenin `script.js`, die header, footer en formulier voedt.
  Het woordmerk is de lockup van het board: Impact · brug · Connect

- **Typografie:** Fraunces (koppen) + Familjen Grotesk (tekst), via Google Fonts
- **Animaties:** scroll-reveals, marquees en hover-panelen via `transform`/`opacity`,
  met respect voor `prefers-reduced-motion`
- **De hero krimpt mee met de hoogte van het venster.** Onderaan `styles.css` staan
  twee `@media (max-height: …)`-blokken. Doel: de lopende band onder de hero staat
  meteen in beeld, ook op een laptop met 125% schaling (~745px venster). Werkt tot
  ongeveer 600px vensterhoogte; maak je het venster nog platter, dan zakt de band
  eronder. Pas je de hero aan, kijk dan of die blokken nog kloppen
- **Sneltoets:** ⌘K (of Ctrl+K) opent de zoekbalk over alle opportunities heen.
  De knop ernaartoe staat niet meer in de balk; de sneltoets zelf werkt nog wel
- **Bewaarde items** worden onthouden in je browser (`localStorage`)
