# De formulieren aansluiten

Hierna komt elke ingevulde vraag binnen op **contact@impactconnectutrecht.com** én in een
Google Sheet, en krijgt de student een bevestiging. Dat geldt voor allebei de formulieren:
het afspraakformulier ("Plan an appointment") en het alumniverzoek.

Werkt hetzelfde als bij Thermal Compost Systems, dus dit zal bekend voorkomen.

Doe dit vanaf het account dat de mailbox `contact@impactconnectutrecht.com` beheert, of in
elk geval een account dat blijft bestaan. Het script draait onder het account dat het
publiceert, en de bevestigingen aan studenten komen ook van dat adres.

Reken op een kwartier. Je hebt niets nodig behalve een browser.

---

## 1. Maak de sheet aan

1. Ga naar [sheets.new](https://sheets.new) terwijl je bent ingelogd op dat account.
2. Geef het bestand bovenaan een naam, bijvoorbeeld **Aanvragen Impact Connect**.

Je hoeft er verder niets in te zetten, ook geen koprij. Het script maakt zelf twee
tabbladen aan: **Afspraken** en **Alumniverzoeken**, elk met de juiste kolommen. Komt er
later een vraag bij in een formulier, dan zet het script die kolom er vanzelf achter.

> Let op: deze sheet bevat namen en mailadressen van studenten. Publiceer hem **niet** op
> internet (dat is iets anders dan delen met je team, dat kan gewoon).

## 2. Plak het script erin

1. Klik in die sheet op **Extensies → Apps Script**. Er opent een nieuw tabblad.
2. Er staat wat voorbeeldcode in (`function myFunction() { }`). Selecteer alles en verwijder het.
3. Open `Code.gs` uit deze map, kopieer de volledige inhoud en plak die in het lege venster.
4. Klik op het opslaan-icoon (of Cmd+S).
5. Geef het project bovenaan een naam, bijvoorbeeld **Formulieren website**.

## 3. Doe de zelftest

Zo weet je of het mailen en het wegschrijven werken, nog voordat de site eraan hangt.

1. Kies bovenin bij het keuzemenu naast "Uitvoeren" de functie **zelftest**.
2. Klik op **Uitvoeren**.
3. Google vraagt nu om toestemming. Dat hoort zo:
   - Klik **Machtigingen controleren** en kies het account waarmee je bent ingelogd.
   - Er verschijnt een waarschuwing dat Google de app niet heeft geverifieerd. Dat klopt,
     het is jullie eigen script. Klik op **Geavanceerd** en daarna op
     **Ga naar Formulieren website (onveilig)**.
   - Klik **Toestaan**.
4. Controleer daarna:
   - er staan twee testmails in de inbox van contact@impactconnectutrecht.com, één met
     "Appointment request" en één met "Alumni request" in het onderwerp
   - in de sheet zijn de tabbladen **Afspraken** en **Alumniverzoeken** verschenen, elk met
     een vetgedrukte koprij en één regel eronder

Werkt dit niet, stop dan hier en geef door wat er misgaat.

## 4. Publiceer het script

1. Klik rechtsboven op **Implementeren → Nieuwe implementatie**.
2. Klik op het tandwiel naast "Type selecteren" en kies **Web-app**.
3. Vul in:
   - **Beschrijving:** formulieren website
   - **Uitvoeren als:** Ikzelf
   - **Wie heeft toegang:** **Iedereen**

   Die laatste instelling is nodig omdat een student die op de site een formulier
   invult niet is ingelogd bij Google. Zet je hem op "Iedereen met een Google-account",
   dan krijgt hij een inlogscherm te zien in plaats van dat zijn aanvraag verstuurd
   wordt.

   **"Iedereen" maakt de sheet niet openbaar.** Dat komt door de instelling erboven,
   "Uitvoeren als: Ikzelf": het script draait onder jouw account en dat mag bij de
   sheet. De bezoeker komt er zelf nooit bij, hij praat alleen met het script en dat
   geeft niets terug behalve `{"ok":true}`. Wat "Iedereen" wél betekent: iedereen die
   het adres kent kan er berichten naartoe sturen. Niet om iets uit te lezen, alleen om
   iets in te sturen. Daarom zit er een rem op van 60 aanvragen per dag, zie onderaan.
4. Klik **Implementeren**.
5. Er verschijnt een **web-app-URL** die begint met `https://script.google.com/macros/s/`
   en eindigt op `/exec`. **Kopieer die URL.**

## 5. Controleer de publicatie

Plak de URL in een browser en druk op enter. Je hoort te zien:

```
{"ok":true,"bericht":"Formulierverwerking Impact Connect staat klaar."}
```

Zie je in plaats daarvan een inlogscherm van Google, dan staat "Wie heeft toegang" nog
niet op **Iedereen**. Ga terug naar stap 4.

## 6. Zet de URL in de website

Open `data.js` en zet de URL tussen de aanhalingstekens:

```js
const FORM_ENDPOINT = "https://script.google.com/macros/s/.../exec";
```

Meer is het niet. Test daarna op de site zelf: doorloop het afspraakformulier en verstuur
het met je eigen mailadres. Je hoort binnen een minuut twee mails te krijgen (de aanvraag
en de bevestiging) en een nieuwe regel in het tabblad **Afspraken**.

---

## Zolang stap 6 nog niet gedaan is

Dan werken de formulieren gewoon, maar op de oude manier: aan het eind opent het
mailprogramma van de student met alles er al in, en die drukt zelf op versturen. Je krijgt
de aanvraag dus wel, alleen staat er niets in de sheet en krijgt de student geen
bevestiging. Datzelfde gebeurt als het versturen om wat voor reden dan ook mislukt, dus er
gaat nooit een aanvraag verloren doordat de techniek hapert.

## Later iets wijzigen

Pas je de code aan, dan moet je opnieuw publiceren, anders draait de oude versie door:
**Implementeren → Implementaties beheren → potloodje → Versie: Nieuwe versie →
Implementeren.** De URL blijft dan hetzelfde.

Voeg je een vraag toe aan een formulier op de site, zet hem dan ook in `VRAGEN` bovenin
`Code.gs`. Dan komt hij vanzelf in de mail en krijgt hij een eigen kolom in de sheet.

## Wat je verder moet weten

- De bevestigingen aan studenten worden verstuurd vanaf het account dat het script heeft
  gepubliceerd. Vertrekt die persoon, dan moet iemand anders het opnieuw publiceren vanaf
  zijn eigen account.
- **Er zit een rem op van 60 aanvragen per dag** (`MAX_PER_DAG` bovenin `Code.gs`). Het
  adres van het script staat in `data.js` en is dus voor iedereen te lezen; wie het kent
  kan het aanroepen. Zonder rem zou iemand er nepaanvragen doorheen kunnen jagen, en dan
  staat je inbox vol en is je dagelijkse mailquotum bij Google op. Zestig ingevulde
  formulieren op één dag haal je in de praktijk niet. Gebeurt het toch, dan valt de
  website automatisch terug op het mailprogramma van de student, dus die aanvraag komt
  alsnog binnen. De teller staat bij het script (Project-instellingen →
  Scripteigenschappen, de regel `teller`) en begint elke dag opnieuw.
- Google kent daarnaast een eigen dagelijkse limiet op het aantal verstuurde mails (100
  bij een gratis account, 1500 bij Workspace). Daar kom je met dit gebruik niet aan.
- Alle aanvragen blijven ook in de sheet staan. Raakt een mail kwijt in een spamfilter, dan
  is de aanvraag dus niet weg. In de sheet staat achteraan een lege kolom **Afgehandeld**,
  handig om zelf bij te houden wie je al geholpen hebt.
- **De sheet gaat vóór de mail.** Het script schrijft de regel eerst weg en mailt daarna
  pas. Zo staat een aanvraag er altijd in, ook als het mailen om wat voor reden dan ook
  mislukt. En gaat alleen de bevestiging aan de student mis (bijvoorbeeld door een
  adres dat niet bestaat), dan geldt de aanvraag nog steeds als geslaagd: jullie hebben
  hem, en de student hoeft hem niet opnieuw te versturen.
- Het adres waar alles naartoe gaat staat op twee plekken, en die moeten hetzelfde zijn:
  `ONTVANGER` bovenin `Code.gs` en `CONTACT_MAIL` bovenin `data.js`.

---

# Het alumniloket aanzetten

Hierna staat op **alumni.html** de lijst met alumni, kunnen studenten er rechtstreeks
een vraag aan stellen, en kies jij per aanvraag uit drie kandidaten wie je voorstelt.

Je hebt hiervoor niets nieuws nodig: geen extra account, geen sleutels, geen tweede
server. Het loket draait in hetzelfde Apps Script en gebruikt hetzelfde adres als de
formulieren. Reken op tien minuten.

## 1. Zet het script erbij

1. Open de sheet met de formulieren en klik op **Extensies → Apps Script**.
2. Klik links op **+** naast "Bestanden" en kies **Script**.
3. Noem het bestand **Loket** (Apps Script maakt er zelf `Loket.gs` van).
4. Open `Loket.gs` uit deze map, kopieer de volledige inhoud en plak die in het lege
   venster. Opslaan met Cmd+S.
5. Open daarna `Code.gs` in de editor en vervang de inhoud door de nieuwe versie uit
   deze map. Daar zijn twee dingen aan veranderd: `doPost` stuurt aanvragen van het
   loket door, en `doGet` levert de alumnilijst uit.

## 2. Welke sheet gaat waarheen

Er zijn twee sheets in het spel. Je hoeft er geen nieuwe voor aan te maken.

**De alumnisheet — hier wordt alleen uit gelezen.**
Het antwoordbestand van jullie aanmeldformulier voor alumni. Het script schrijft hier
nooit in.

Eén ding instellen: **het id van dat bestand**. Open de alumnisheet en kijk naar de
adresbalk:

```
https://docs.google.com/spreadsheets/d/1aB2cD3eF4gH5iJ6kL7mN8oP9qR/edit#gid=0
                                       └────────── dit stuk ──────────┘
```

Kopieer het stuk tussen `/d/` en `/edit` en zet het bovenin `Loket.gs`:

```js
const ALUMNI_BESTAND_ID = '1aB2cD3eF4gH5iJ6kL7mN8oP9qR';
```

Het **tabblad** hoef je niet in te vullen. Het script gaat de tabbladen langs en pakt
het eerste met een naam-, mail- én toestemmingskolom in de koprij. Een antwoordblad van
Google Formulieren heet "Formulierreacties 1", en dat vindt hij dus zelf. Staan er
meerdere formulieren in één bestand, vul dan `ALUMNI_BLAD` in met de juiste naam.

De kolommen hoef je ook niet aan te passen: hij zoekt op woorden in de koprij, dus
"Full name " met een spurie spatie en "Do you hereby give us permission to be contact
by a student…" vinden allebei hun weg.

> Staat de alumnisheet in een ander Google-account dan het account dat het script
> draait? Deel hem dan met dat account (leesrechten is genoeg), anders kan het script
> er niet in kijken.

**De aanvragensheet — hier wordt in geschreven.**
Dat is de sheet waar dit script aan hangt, met de tabbladen Afspraken,
Alumniverzoeken en Berichten. Daar komt **Introducties** bij, en het script maakt dat
tabblad zelf aan. Je hoeft niets in te stellen.

Dat het daar komt en niet bij de alumni is een keuze: het is dezelfde soort inhoud
(een student die iets vraagt), je hoeft maar op één plek te kijken, en een script mag
zonder extra toestemming in zijn eigen sheet schrijven. Het houdt bovendien de
gegevens van studenten en die van alumni uit elkaar — twee groepen die niets met
elkaars gegevens te maken hebben.

> Wil je de introducties tóch in een eigen sheet, bijvoorbeeld omdat er meer mensen bij
> moeten kunnen dan bij de afspraken: maak die sheet aan, zet het id bij
> `LOKET_BESTAND_ID` bovenin `Loket.gs`, en verhuis een bestaand tabblad Introducties
> mee. Zonder die verhuizing begint het script opnieuw met tellen en denkt het dat
> iedereen weer ruimte heeft.

De kolommen hoef je niet aan te passen. Het script leest de koprij en zoekt zelf welke
kolom "Full name", "Permission to be contacted", "Preferred frequency" enzovoort is.
Hernoem je later een vraag in het formulier, kijk dan even in `KOLOM` bovenin.

> **De poort:** alleen rijen waar bij *permission to be contacted* iets als **Yes** of
> **Ja** staat komen ooit op de site. Bij twijfel of bij een leeg vakje verschijnt
> iemand niet. Dat is met opzet zo streng.

## 3. Publiceer opnieuw

Een gewijzigd script gaat pas live als je het opnieuw uitrolt:

1. Klik rechtsboven op **Implementeren → Implementaties beheren**.
2. Klik op het potlood, zet **Versie** op **Nieuwe versie** en klik **Implementeren**.

Doe dit **niet** via "Nieuwe implementatie", want dan krijg je een nieuw adres en
staat het oude nog in `data.js`.

## 4. Doe de zelftest

1. Kies in de editor de functie **zelftestLoket** en klik **Uitvoeren**.
2. In het logboek zie je hoeveel alumni er gevonden zijn en hoe het eerste profiel
   eruitziet zoals de website het krijgt. Staat daar een mailadres of telefoonnummer
   in, dan klopt er iets niet — die horen er niet in te staan.
3. Onderaan staat het adres van het script. Dat hoort hetzelfde te zijn als
   `FORM_ENDPOINT` in `data.js`.

Geen alumni gevonden? Dan bestaat het tabblad niet, of staat er nergens *yes* in de
toestemmingskolom.

## 5. Kijk op de site

Open `alumni.html`. Onder "Two ways to reach them" staat nu de lijst met filters.

Zie je nog de oude tekst? De lijst wordt vijf minuten vastgehouden zodat de pagina
snel blijft. Voer **wisAlumniCache** uit in de editor om dat af te dwingen; dat heb je
ook nodig als je net iemand hebt goedgekeurd en hem meteen wilt zien.

---

## Wat er gebeurt bij een aanvraag

1. De aanvraag komt in het tabblad **Introducties** te staan, met status `wacht`. Dit
   gaat vóór het mailen: gaat er daarna iets mis met de post, dan staat de aanvraag er
   nog steeds.
2. Jij krijgt één mail met de vraag en **drie kandidaten**: degene die de student koos,
   plus twee die het script erbij zoekt op gedeelde thema's, dezelfde studie en
   beschikbare ruimte. Onder elke naam staat waarom die er staat.
3. Je klikt op een naam. Er opent een pagina die vertelt wat er gaat gebeuren, met één
   knop. Pas die knop verstuurt de introductie.
4. De introductie gaat naar de alumnus, met de student in de cc en met *reply-to* op de
   student. Beantwoorden komt dus bij de student uit.

De knoppen werken zeven dagen en zijn eenmalig; een tweede klik doet niets meer. Ze
zijn ondertekend, dus ze zijn niet na te maken door een nummer in de adresbalk te
veranderen.

## De rem op overvragen

De kolom *Preferred frequency of contact* is de enige bescherming van je alumni, want
zij krijgen zelf geen ja/nee-knop per aanvraag. Het script telt in het tabblad
Introducties hoeveel introducties iemand deze maand of dit kwartaal al heeft gehad en
haalt hem daarna automatisch van de site tot de volgende periode. Staat er niets
ingevuld, dan geldt er geen limiet — dat is dus de kolom om aan te vullen.

Daarnaast mag één student niet meer dan twee aanvragen tegelijk open hebben staan.

## De thema's bijhouden

*Fields of interest* is een open tekstvak. Het script zet die antwoorden om in vaste
thema's, zodat er gefilterd kan worden. Voer af en toe **loketOverzicht** uit in de
editor: je ziet dan wie er vol zit, wie er nog geen enkel thema heeft, en welke woorden
nergens onder vielen. Dat laatste is je lijstje om `THEMAS` bovenin `Loket.gs` mee aan
te vullen. Elke toevoeging geldt meteen voor iedereen, ook met terugwerkende kracht.

---

# De navraag aanzetten

Drie weken na een introductie krijgt de student één mail: **hoe nuttig was het, van 1
tot 10, en wat kan er beter?** De cijfers staan als knop in de mail; één klik legt het
cijfer al vast. Op de pagina die dan opent kan er nog een toelichting bij, maar dat
hoeft niet.

De antwoorden komen in het tabblad **Introducties** te staan, in de kolommen *Cijfer*,
*Wat beter kan* en *Beantwoord op*.

Dit gaat niet vanzelf: Google moet één keer per dag gaan kijken welke introducties oud
genoeg zijn. Dat zet je aan met één functie:

1. Kies in de Apps Script-editor bovenin de functie **zetNavraagTriggerAan**
2. Klik **Uitvoeren**

Meer niet. Het script ruimt eerst eventuele oude triggers op (twee keer uitvoeren levert
dus geen dubbele mails op), zet er een nieuwe neer voor elke ochtend rond 9 uur, en laat
daarna meteen zien wie er op dit moment aan de beurt zou zijn.

Uitzetten kan met **zetNavraagTriggerUit**.

> Je kunt het ook met de hand doen via het klokje in de zijbalk (Triggers → Trigger
> toevoegen → `stuurNavragen`, tijdgestuurd, dagteller, 9:00). Het resultaat is
> hetzelfde; de functie is alleen minder klikwerk en voorkomt dubbele triggers.

## Krijgt dan niet iedereen tegelijk een mail?

Nee. Een regel komt pas in aanmerking als aan alle drie deze voorwaarden is voldaan:

1. de status is **voorgesteld** — er is dus echt een introductie verstuurd
2. **Besloten op** is minstens `NAVRAAG_DAGEN` (nu 21) dagen geleden
3. **Nagevraagd op** is nog leeg — wie het al heeft gehad, krijgt het nooit opnieuw

Aanvragen die je hebt afgewezen of die nog op een beslissing wachten tellen niet mee.

Wil je zeker weten wat er morgenochtend gaat gebeuren: draai **toonNavraagWachtrij**.
Die laat zien wie er aan de beurt is en verstuurt niets. Staat er "Niemand aan de beurt",
dan gebeurt er vannacht ook niets.

**Een keer met de hand proberen?** Kies de functie **stuurNavragen** en klik Uitvoeren.
Er gaat alleen post uit naar introducties die echt drie weken oud zijn, dus meestal
gebeurt er niets en zie je dat in het logboek.

**Anders dan drie weken?** Verander `NAVRAAG_DAGEN` bovenin `Loket.gs`. Pas dan ook de
tekst op de site aan (`al.s4.tekst` in `alumni.html` en in `vertalingen.js`), en de
regel in de introductiemail aan de student, anders beloof je iets anders dan je doet.

## Wat je aan die cijfers hebt

Het gemiddelde zegt weinig. Waar het om gaat is welke alumni structureel hoog scoren —
die wil je vaker inzetten en misschien om meer ruimte vragen — en welke introducties
laag scoren, want in de kolom *Wat beter kan* staat dan meestal precies waarom. Een
student die niets invult maar wel een 8 geeft, telt gewoon mee: het cijfer is al binnen
voordat de pagina opent.


---

# Alles met één push (clasp)

Standaard moet je `Code.gs` en `Loket.gs` met de hand in de Apps Script-editor plakken.
Dat werkt, maar het kan misgaan: een verkeerd geplakt accent, of een wijziging die je
in de repo doet en vergeet over te zetten. Dan draait er iets anders dan er in git
staat, en dat zie je pas als er iets stukgaat.

Met **clasp**, Google's eigen commandoregeltool, is `git push` voortaan genoeg. De hook
merkt dat er Apps Script-code is veranderd, stuurt die naar Google, rolt hem uit naar
de bestaande webapp, en pas daarna gaat de website weg.

## Eenmalig opzetten

```bash
cd "/Users/joukenabuurs/Documents/Impact connect/impact-connect-static"
./formulier-backend/clasp-opzetten.sh
```

Zet eerst `creds.json` klaar (zie hieronder), anders verloopt de inlog elke week
opnieuw. Daarna loopt het script vier stappen langs en vraagt het om twee dingen:

1. **Inloggen bij Google.** Er opent een browservenster. Kies
   contact@impactconnectutrecht.com, het account dat het script beheert.
2. **De Script-ID.** Die vind je in het Apps Script-project onder het tandwiel
   (Projectinstellingen).
3. Het haalt daarna de projectinstellingen op.
4. **De implementatie-ID** van de live webapp. Het script laat de lijst zien; kies die
   met een omschrijving, niet `@HEAD`. Zo wordt de bestaande webapp bijgewerkt en
   blijft het adres hetzelfde als in `data.js`.

Tot slot installeert het de pre-push hook. Klaar.

## Daarna

```bash
git push
```

Meer niet. Verander je alleen de website, dan gebeurt er niets extra's. Verander je
`Code.gs` of `Loket.gs`, dan zie je:

```
▸ Er is Apps Script-code gewijzigd. Die gaat eerst naar Google.
▸ Code naar Google sturen
▸ Uitrollen naar de bestaande webapp (adres blijft hetzelfde)
▸ Klaar. De wijziging is live.
```

Alleen de backend bijwerken, zonder de site aan te raken:

```bash
./formulier-backend/uitrollen.sh
```

## Als het misgaat

Mislukt het uitrollen, dan **stopt de push**. Dat is met opzet: een site die live gaat
terwijl de backend nog de oude versie draait, is precies de situatie waarin de
alumnilijst leeg blijft en niemand weet waarom.

Moet je toch alleen de site pushen:

```bash
git push --no-verify
```

## De sleutel waarmee je inlogt

Clasp heeft een eigen sleutel ingebouwd, maar die staat bij Google als "in test" en
daardoor verloopt zo'n inlog na een paar dagen. Dan stopt elke push met
`invalid_grant`. Daarom gebruiken we een eigen sleutel van het contact@-account; die
verloopt niet.

Staat `formulier-backend/creds.json` niet op jouw computer, maak hem dan zo aan. Log
eerst in als contact@impactconnectutrecht.com, het liefst in een privévenster.

1. [console.cloud.google.com](https://console.cloud.google.com) → projectkiezer →
   het project **Impact Connect**. Bestaat dat nog niet: zelf aanmaken.
2. Zet de [Apps Script API](https://console.cloud.google.com/apis/library/script.googleapis.com)
   aan.
3. [Toestemmingsscherm](https://console.cloud.google.com/auth/overview): app-naam
   *Impact Connect clasp*, doelgroep **Intern**, contact contact@.
4. [Clients](https://console.cloud.google.com/auth/clients) → *Client maken* → type
   **Desktop-app** → naam *clasp*. Klik daarna op de naam en kies **JSON downloaden**.
5. Sla dat bestand op als `formulier-backend/creds.json`.

Daarna één keer inloggen:

```bash
cd formulier-backend
npx --yes @google/clasp@3.4.1 login --creds creds.json
```

`creds.json` en de inlog die eruit volgt staan in `.gitignore`. Zet ze nooit in de
repo: die is openbaar.

## Wat er lokaal blijft

`formulier-backend/.clasp.json` en `.clasp-deployment` staan in `.gitignore`: dat is
jouw koppeling, niet die van het project. Je Google-inloggegevens staan in
`~/.clasprc.json`, buiten de repo. Er komt dus **geen enkel wachtwoord of token in
GitHub** te staan.

Werkt een collega ook aan de code, dan draait die hetzelfde opzetscript op zijn eigen
machine.
