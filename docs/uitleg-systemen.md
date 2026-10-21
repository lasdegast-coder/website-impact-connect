# Hoe de systemen van Impact Connect werken

Dit document beschrijft stap voor stap wat er gebeurt bij elk van de drie diensten voor studenten. Het is bedoeld om in één keer door te lezen: wat doet de student, wat gaat vanzelf, en wat moeten wij zelf doen.

**Laatst bijgewerkt:** 21 oktober 2026

**Houd dit bij.** Verandert er iets aan de werking, dan hoort die wijziging hier meteen in. Dat staat ook als afspraak in CLAUDE.md, in de repo van de website en in die van de WhatsApp-bot, zodat iedereen die met Claude Code aan een van beide werkt dit document bijwerkt in dezelfde beurt als de wijziging zelf.

---

## Dienst 1 — een gesprek voeren

Een student boekt zelf een gesprek, wij spreken hem, en daarna loopt de hele nazorg automatisch: hij krijgt onze aanbevelingen, geeft een cijfer, en een maand later vertelt hij wat ervan gekomen is.

### Wat de student doet

1. Klikt op **Plan an appointment** en doorloopt vijf stappen: wat brengt je hier, je interesses, wat praktisch past (ervaring, tijd, betaald of niet, taal), een moment kiezen, en je gegevens.
2. Kiest een tijdslot uit het vaste rooster: **dinsdag 9 tot 17 uur (Zoya), woensdag 15 tot 17 uur (een van ons twee), donderdag 13 tot 17 uur (Noah)**. Hij ziet drie weken vooruit, kan niet binnen 48 uur boeken, en er passen maximaal drie gesprekken op één dag. Een slot is een heel uur; het gesprek duurt 45 minuten, in **The Playground in Building VMC**.
3. Past er niets, dan kiest hij "None of these times work for me". Dan nemen wij zelf contact op om een moment te zoeken.

### Wat er automatisch gebeurt

4. De afspraak komt in de Google Agenda **Gesprekken** van contact@impactconnectutrecht.com, gedeeld met Zoya en Noah. De student krijgt een agenda-uitnodiging en een bevestigingsmail.
5. Er komt een regel in de sheet *LINKED TO BOT*, tabblad **aanvragen voor gesprekken**, met alles uit het formulier, een kenmerk, de datum en wie het gesprek doet.
6. **Een half uur na afloop** van het gesprek krijgt contact@ de mail *"What did you recommend to …?"*, met een link naar onze eigen invulpagina.

### Wat wij zelf doen: één handeling

7. Open die link en vink aan welke programma's je hebt genoemd, typ eventueel een losse tip, en vink de alumni aan die passen. De pagina stelt er vijf voor; de hele lijst staat eronder. Klik op **Opslaan**.

### Wat daarna weer automatisch gaat

8. De student krijgt meteen zijn mail: de aangeraden programma's met klikbare namen, de alumni zonder naam (alleen studie en huidige rol, met een knop om een introductie aan te vragen), de losse tip als zin, en vijf knoppen om het gesprek een cijfer te geven. Is het na 20:00 uur, dan gaat de mail de volgende ochtend om 09:00 uur.
9. Vergeten wij het formulier? Na **twee dagen** komt er een herinnering bij contact@. Na **zeven dagen** krijgt de student de cijfervraag hoe dan ook, maar dan zonder het rijtje programma's.
10. Klikt hij op een cijfer, dan staat dat meteen vast. Op de pagina die opent kiest hij wat hij ermee gaat doen, kan hij in eigen woorden iets typen, en kan hij een recensie achterlaten voor op de website.
11. Geeft hij een **1 of een 2**, dan krijgt contact@ diezelfde dag een seintje, zodat we er nog iets mee kunnen.
12. **Dertig dagen** na het gesprek volgt één laatste mail: *"Did anything come of it?"* met vier knoppen en daarachter een tekstvak.

### Waar alles terechtkomt

13. Alles landt op dezelfde regel in *aanvragen voor gesprekken*: Teammail op, Aangeraden programma's, Extra tip, Voorgestelde alumni, Vastgelegd op, Nagevraagd op, Cijfer, Vervolg, Toelichting, Maandmail op, Uitkomst en Uitkomst toelichting.
14. Recensies komen in het tabblad **Recensies**. Ze verschijnen pas op de website nadat iemand van ons in de kolom "Op de site" yes zet.

### Uitzonderingen die vanzelf goed gaan

15. Haal je de afspraak uit de agenda, dan stopt de hele keten.
16. Verzet je de afspraak, dan telt alles vanaf de nieuwe datum.
17. Elke mail heeft onderaan een link waarmee de student verdere post over dat gesprek stopt. Tussen 20:00 en 09:00 uur versturen we studenten niets.

### Waar het in de code staat

- Het rooster, de 48 uur, de drie weken en het maximum per dag: formulier-backend/Gesprekken.gs
- De hele nazorg, de mails en de pagina's erachter: formulier-backend/Opvolging.gs
- Het boekingsformulier op de site: script.js

---

## Dienst 2 — evenementen bezoeken

### Wat de student doet

1. Opent **Events** op de site en ziet alles wat eraan komt, met het aantal erbij. Hij kan filteren op thema: energie, bestuur, ecologie en voedsel, steden, business en innovatie, en algemeen.
2. Klikt op een event en komt op de aanmeldpagina van de organisator. Wij regelen de inschrijving niet; wij brengen het onder de aandacht.
3. Wordt lid van de **WhatsApp-community** via de knop op die pagina of de QR-code: één algemene groep en vijf themagroepen. Gratis, en je kunt er altijd weer uit.
4. Mist hij iets, dan stuurt hij het ons via **Tip ons een event**; dat opent een mail naar contact@.

### Waar de events vandaan komen

5. Uit één Google Sheet: **LINKED TO BOT Events Database**. De site leest dat tabblad bij elk bezoek opnieuw, dus wie er iets in zet hoeft niets te pushen en niemand hoeft iets te publiceren.
6. De kolommen die meetellen: Event, Short description, Date, Time, Location, Cost, Registration link en Category.
7. Zet je **Good to send?** op `No`, dan verdwijnt het event van de site én gaat de bot er niets mee doen. **Leeg laten telt als ja.**
8. Staan er twee thema's in één cel ("Energy, Governance"), dan pakt de site het eerste. Een onbekend thema belandt onder Algemeen.
9. Een event waarvan de datum voorbij is, valt vanzelf van de site. Alleen een maand invullen mag ook ("November 2026"), maar dan kan de bot er geen herinnering voor rekenen.

### Wat de bot doet (Impact Radar, draait op Railway)

10. Leest dezelfde sheet en stuurt per event **ongeveer drie weken van tevoren** een herinnering naar de themagroep die bij de categorie hoort, of naar de algemene groep als het thema onbekend is.
11. Verstuurt alleen op **dinsdag, woensdag en donderdag om 12:50**, Nederlandse tijd. Dat is het lunchmoment, want dan wordt er gelezen.
12. Reageert iemand met een **duim** op zo'n herinnering, dan krijgt die een privébericht met een agenda-uitnodiging: een Google Agenda-link en een los bestand voor Apple en de rest. De bot onthoudt 120 dagen wie dat al kreeg, zodat niemand het dubbel krijgt, en stuurt er maximaal 150 per dag.
13. Het **maandoverzicht staat uit sinds 14 oktober 2026**, omdat het team de maand zelf aankondigt met een poster. Weer aanzetten kan in Railway, met de schakelaar SEND_OVERVIEW.
14. De bot hangt aan een WhatsApp-account op een eigen simkaart. Raakt die verbinding los, dan moet hij opnieuw gekoppeld worden met een QR-code.

### Wat wij zelf doen

15. Events in de sheet zetten en bijhouden: naam, datum, tijd, plek, kosten, aanmeldlink en categorie. Iets niet rondsturen? `No` in Good to send?.
16. De poster maken voor de maandaankondiging.
17. Verandert er iets aan de code van de bot, dan is pushen niet genoeg: in **Railway** moet er nog op Deploy geklikt worden.

### Waar het in de code staat

- De site: EVENT_SHEET en EVENT_COLS in data.js en script.js, de pagina zelf is events.html
- De bot: de map whatsapp-bot, met de instellingen in src/config.js en het rooster in src/scheduler.js

---

## Dienst 3 — alumni benaderen

*Volgt.*
