#!/usr/bin/env bash
#
# Eenmalige koppeling tussen deze map en het Apps Script-project.
# Daarna is `git push` genoeg: de pre-push hook stuurt de backend mee.
#
#   ./formulier-backend/clasp-opzetten.sh [Script-ID]
#
# De Script-ID staat in de Apps Script-editor onder het tandwiel
# (Projectinstellingen). Geef je hem mee, dan wordt er niet naar gevraagd.
#
set -euo pipefail

CLASP="npx --yes @google/clasp@2.4.2"
HIER="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO="$(cd "$HIER/.." && pwd)"

echo "▸ Stap 1 van 4: inloggen bij Google"
if [ -f "$HOME/.clasprc.json" ]; then
  echo "  Je bent al ingelogd. (Ander account nodig? Voer eerst '$CLASP logout' uit.)"
else
  echo "  Er opent een browservenster. Kies het account dat het script beheert."
  $CLASP login
fi

echo
echo "▸ Stap 2 van 4: welk Apps Script-project?"
BEKEND=""
SCRIPT_ID="${1:-}"
if [ -n "$SCRIPT_ID" ]; then
  echo "  Meegegeven: $SCRIPT_ID"
elif [ -f "$HIER/.clasp.json" ]; then
  BEKEND="$(sed -n 's/.*"scriptId":"\([^"]*\)".*/\1/p' "$HIER/.clasp.json")"
fi
if [ -n "$SCRIPT_ID" ]; then
  :
elif [ -n "$BEKEND" ]; then
  echo "  Al bekend: $BEKEND"
  read -r -p "  Enter om deze te houden, of plak een andere Script-ID: " SCRIPT_ID
  SCRIPT_ID="${SCRIPT_ID:-$BEKEND}"
else
  echo "  Open het project, ga naar het tandwiel (Projectinstellingen) en"
  echo "  kopieer de Script-ID."
  read -r -p "  Script-ID: " SCRIPT_ID
fi
# Plakken in een Windows-terminal zet er een onzichtbaar regeleinde of een
# spatie achter, en dan klopt het instellingenbestand niet meer.
SCRIPT_ID="$(printf '%s' "$SCRIPT_ID" | tr -d '\r[:space:]')"
[ -n "$SCRIPT_ID" ] || { echo "Geen ID opgegeven. Gestopt."; exit 1; }

echo
echo "▸ Stap 3 van 4: ophalen wat er nu bij Google staat"
# Dit doen we in een tijdelijke map, want een gewone 'clasp pull' zou onze
# eigen Code.gs overschrijven met de versie die nu bij Google staat — precies
# andersom dan de bedoeling.
#
# Wat we wél overnemen is appsscript.json: de projectinstellingen (tijdzone,
# wie de webapp mag aanroepen). Die moeten blijven zoals ze zijn, anders
# verandert straks stilletjes wie er bij het script mag.
TIJDELIJK="$(mktemp -d)"
trap 'rm -rf "$TIJDELIJK"' EXIT
# Met fileExtension, anders heten de opgehaalde bestanden Code.js en slaat
# de vergelijking hieronder ze stilletjes over.
printf '{"scriptId":"%s","rootDir":".","fileExtension":"gs"}\n' "$SCRIPT_ID" > "$TIJDELIJK/.clasp.json"
( cd "$TIJDELIJK" && $CLASP pull >/dev/null )

if [ ! -f "$TIJDELIJK/appsscript.json" ]; then
  echo "  Geen appsscript.json gevonden. Klopt de Script-ID, en heeft dit account toegang?"
  exit 1
fi

# Alles wat er nu bij Google staat bewaren voordat er ooit iets overheen gaat.
# Er kan in de editor iets zijn aangepast dat nooit in de repo is beland; dat
# zou de eerste push weggooien zonder dat iemand het merkt.
KOPIE="$HIER/.backup-google-$(date '+%Y%m%d-%H%M%S')"
mkdir -p "$KOPIE"
cp "$TIJDELIJK"/* "$KOPIE"/ 2>/dev/null || true
echo "  Kopie van de huidige versie bij Google:"
echo "    ${KOPIE#"$REPO/"}"
ls "$KOPIE" | sed 's/^/      /'

# Verschilt een scriptbestand bij Google van de laatst vastgelegde versie in
# de repo? Dan is er in de editor gewerkt, en moet je even kijken wat je
# weggooit. We vergelijken met de laatste commit en niet met je map, zodat
# eigen wijzigingen die nog niet gepusht zijn geen vals alarm geven.
# Regeleindes tellen niet mee.
ANDERS=""
for BIJ_GOOGLE in "$KOPIE"/*.gs; do
  [ -f "$BIJ_GOOGLE" ] || continue
  NAAM="$(basename "$BIJ_GOOGLE")"
  if ! IN_REPO="$(git -C "$REPO" show "HEAD:formulier-backend/$NAAM" 2>/dev/null)"; then
    IN_REPO="$(cat "$HIER/$NAAM" 2>/dev/null || true)"
  fi
  if [ "$(tr -d '\r' < "$BIJ_GOOGLE")" != "$(printf '%s' "$IN_REPO" | tr -d '\r')" ]; then
    ANDERS="$ANDERS $NAAM"
  fi
done
if [ -n "$ANDERS" ]; then
  echo
  echo "  LET OP: deze bestanden bij Google zijn niet gelijk aan die in de repo:$ANDERS"
  echo "  De eerste push vervangt de versie bij Google. Vergelijk ze eerst, bijvoorbeeld:"
  for NAAM in $ANDERS; do
    echo "    diff \"${KOPIE#"$REPO/"}/$NAAM\" formulier-backend/$NAAM"
  done
  echo
  read -r -p "  Toch doorgaan? (j/n) " AKKOORD
  [ "$AKKOORD" = "j" ] || { echo "  Gestopt. Er is niets veranderd."; exit 1; }
fi

cp "$TIJDELIJK/appsscript.json" "$HIER/appsscript.json"
printf '{"scriptId":"%s","rootDir":".","fileExtension":"gs"}\n' "$SCRIPT_ID" > "$HIER/.clasp.json"
echo "  Gelukt. De projectinstellingen staan nu in formulier-backend/appsscript.json."

echo
echo "▸ Stap 4 van 4: welke implementatie is de live webapp?"
# Er kunnen er meerdere zijn. We willen de bestaande bijwerken en niet een
# nieuwe maken, want een nieuwe implementatie krijgt een nieuw adres en dan
# wijst de website nog naar de oude.
# In de map met .clasp.json draaien, anders weet clasp niet welk project je
# bedoelt. En als het opvragen mislukt mag dat de opzet niet afbreken: de
# implementatie-ID kun je ook met de hand invullen.
#
# De site roept de webapp aan via FORM_ENDPOINT in data.js, en de ID zit in
# dat adres. Dat is dus per definitie de goede; alleen als hij daar niet te
# vinden is vragen we erom.
DEPLOY_ID="$(sed -n 's|.*FORM_ENDPOINT *= *"https://script.google.com/macros/s/\([^/"]*\)/exec".*|\1|p' "$REPO/data.js")"
if [ -n "$DEPLOY_ID" ]; then
  echo "  Uit FORM_ENDPOINT in data.js: $DEPLOY_ID"
else
  ( cd "$HIER" && $CLASP deployments 2>&1 || true ) | sed 's/^/  /'
  echo
  echo "  Hierboven staan de implementaties. De live webapp is meestal die met"
  echo "  een omschrijving, niet die met @HEAD."
  echo "  Zie je hier niets bruikbaars, kijk dan in de editor onder"
  echo "  Implementeren → Implementaties beheren."
  read -r -p "  Implementatie-ID (leeg laten = alleen code pushen, niet uitrollen): " DEPLOY_ID
fi
if [ -n "$DEPLOY_ID" ]; then
  echo "$DEPLOY_ID" > "$HIER/.clasp-deployment"
  echo "  Opgeslagen."
else
  rm -f "$HIER/.clasp-deployment"
  echo "  Overgeslagen. Je moet dan zelf uitrollen via Implementeren → Implementaties beheren."
fi

echo
echo "▸ De hook installeren"
cp "$HIER/pre-push" "$REPO/.git/hooks/pre-push"
chmod +x "$REPO/.git/hooks/pre-push"
echo "  Klaar. Vanaf nu stuurt 'git push' de backend automatisch mee."
echo
echo "Probeer het uit met:  ./formulier-backend/uitrollen.sh"
