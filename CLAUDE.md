# Impact Connect — afspraken voor wie hier werkt

Dit bestand leest Claude Code bij elke sessie in deze map. Het staat in de repo,
dus iedereen die aan de site werkt krijgt dezelfde afspraken mee. Wat hier
staat is een keer misgegaan of bewust zo besloten; verander het niet zonder
het eerst voor te leggen.

**Met wie je praat.** Er werken twee mensen aan deze site, allebei met Claude
Code, en geen van beiden is programmeur. Praat Nederlands en leg dingen uit in
gewone taal. Noem bij een webpagina de precieze plek en knop. Waarschuw vóór
iets dat moeilijk terug te draaien is. Bij een grotere wijziging (opmaak,
nieuwe sectie, iets aan de alumni) eerst voorstellen en bespreken, dan pas
bouwen.

## Voordat je iets aanpast

1. **Haal eerst binnen wat de ander heeft gedaan:** `git pull --rebase`. Doe
   dat aan het begin van elke sessie en nog een keer vlak voor het pushen.
   Geeft dat een conflict, stop dan en leg uit wat er botst. Nooit
   `git push --force`: dan gooi je het werk van de ander weg.
2. **Staat de hook erin?** `ls .git/hooks/pre-push`. Zo niet:
   `cp formulier-backend/pre-push .git/hooks/pre-push && chmod +x .git/hooks/pre-push`.
   Git neemt hooks niet mee bij het binnenhalen van de repo, dus wie de map
   nieuw heeft moet dit één keer doen.

## Hoe iets live komt

- De repo is `github.com/lasdegast-coder/website-impact-connect`, branch `main`.
  GitHub Pages zet elke push binnen een minuut op **impactconnectutrecht.com**.
  Er zit geen controle tussen: gepusht is live.
- Bekijk het eerst lokaal: `python3 serve.py`, dan http://127.0.0.1:8124.
  Open de pagina die je hebt veranderd, en bij tekst ook op mobielformaat.
- De hook controleert bij elke push of `data.js`, `script.js`,
  `vertalingen.js` en `icons.js` nog te lezen zijn, en stopt de push als er
  een komma of haakje mist. Omzeil dat niet met `--no-verify`.
- Commit en push alleen als de gebruiker erom vraagt. Schrijf de commit in het
  Nederlands, over wat een bezoeker merkt.
- **De repo is openbaar.** Nooit mailadressen of telefoonnummers van mensen,
  wachtwoorden, tokens of gegevens uit de antwoordsheets committen.

## Waar wat staat

Geen build-stap, geen dependencies. De volledige bestandslijst staat in
README.md.

- `data.js` — alle inhoud en de schakelaars. Kopieer een bestaand item om er
  een toe te voegen.
- `vertalingen.js` — het Nederlands. `script.js` — alle werking.
- Events, programma's en alumni komen **live uit Google Sheets**. Wie daar iets
  verandert hoeft niets te pushen; de site leest bij elk bezoek opnieuw.

## De schakelaars

Alle drie staan bewust uit. Zet ze alleen om als de gebruiker dat vraagt.

| schakelaar | waar | waarom uit |
|---|---|---|
| `INTERNSHIPS_LIVE` | data.js | De Universiteit Utrecht heeft de internships nog niet vrijgegeven. De pagina's zijn af. |
| `UU_BRANDING` | data.js | Nog geen toestemming om het UU-logo te voeren. De regel "Supported by…" in de voettekst blijft wel staan. |
| `NEDERLANDS_LIVE` | vertalingen.js | De Nederlandse versie is nog niet klaar. De taalknop is verborgen. |

## Wat al eens is misgegaan

- **"null" op de Engelse site.** Engels staat in de HTML met `data-t="sleutel"`,
  Nederlands in `vertalingen.js`. Maar tekst die `script.js` zelf maakt met
  `t("sleutel")` heeft in `vertalingen.js` **zowel `en:` als `nl:`** nodig.
  Ontbreekt `en:`, dan staat er letterlijk "null".
- **Te weinig events.** Een gepubliceerde sheet moet het adres van één
  tabblad hebben (met `gid=` erin), niet dat van het "hele document". Dat
  laatste geeft een fout, en dan valt de site stilletjes terug op de
  ingebouwde lijst. Dat leek te werken, maar er stonden 21 events in plaats van 48.
  Vergelijk na elke wijziging aan een bron de tellers op de homepage met de sheet.
- **Favicon onzichtbaar.** In `assets/favicon.svg` mag niets vóór `<svg>`
  staan, ook geen commentaar.
- **Geen sterretjes of glinsters als icoon.** Dat leest als een AI-logo. Waar
  een icoon nodig is gebruiken we de brug uit ons eigen logo.

## Privacy: hier geen uitzonderingen

- **Geen namen van alumni op de site.** Alleen hun rol, werkgever, eerdere rol
  en opleiding. Namen gaan pas over en weer in de introductiemail, en alleen
  nadat wij een aanvraag hebben goedgekeurd.
- Wat de browser te zien krijgt bepaalt `openbareLijst()` in
  `formulier-backend/Loket.gs`. Een veld verbergen in de kaart is niet genoeg:
  zolang die functie het meestuurt, staat het leesbaar in het netwerkverkeer.
- De antwoordsheets van de formulieren (studenten, organisaties, alumni) worden
  **nooit "gepubliceerd op internet"**. Delen met het team mag wel.
- Een alumnus staat alleen op de site als de toestemmingskolom "yes" zegt.

## De backend (Apps Script)

De formulieren en het alumniloket draaien op Google Apps Script:
`formulier-backend/Code.gs` en `Loket.gs`, onder het account
contact@impactconnectutrecht.com.

- **Pas het script altijd hier aan, nooit in de editor van Google.** De
  volgende push overschrijft wat daar staat.
- De hook zet een gewijzigd `.gs`-bestand bij een push vanzelf bij Google
  (met clasp 2.4.2) en stopt de push als dat mislukt, zodat de site nooit
  live gaat terwijl de oude backend nog draait.
- **Eenmalig per computer**, door de gebruiker zelf in de terminal, want
  daarbij opent een browser om in te loggen met het contact@-account:
  ```
  npx --yes @google/clasp@2.4.2 login
  ./formulier-backend/clasp-opzetten.sh <Script-ID>
  ```
  De Script-ID staat in de Apps Script-editor onder het tandwiel
  (Projectinstellingen). Klaagt clasp over de API: zet die aan op
  https://script.google.com/home/usersettings.
- `invalid_grant` bij een push betekent dat de inlog is verlopen. Log opnieuw
  in met de eerste regel hierboven. Let op: gewoon `npx clasp login` werkt niet.
- **Nooit een nieuwe implementatie maken.** Die krijgt een nieuw `/exec`-adres
  en dan praat de site met niets meer. Het script werkt de bestaande bij.
- Zet `&vers=1` achter `FORM_ENDPOINT?lijst=alumni` om de cache van vijf
  minuten over te slaan als je een verse versie wilt controleren.
