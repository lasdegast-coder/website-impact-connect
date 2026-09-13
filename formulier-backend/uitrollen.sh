#!/usr/bin/env bash
#
# Zet de code uit deze map bij Google en rolt hem uit naar de live webapp.
# Wordt automatisch aangeroepen door de pre-push hook; je kunt hem ook zelf
# draaien als je alleen de backend wilt bijwerken.
#
set -euo pipefail

CLASP="npx --yes @google/clasp@2.4.2"
HIER="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [ ! -f "$HIER/.clasp.json" ]; then
  echo "Nog niet gekoppeld. Voer eerst uit: ./formulier-backend/clasp-opzetten.sh" >&2
  exit 1
fi

# clasp braakt bij een fout een half scherm JSON uit. De twee dingen die in
# de praktijk misgaan vangen we hier af en leggen we in één zin uit.
uitleg_bij_fout() {
  if grep -q "has not enabled the Apps Script API" "$1"; then
    echo
    echo "✗ De Apps Script API staat uit op dit Google-account." >&2
    echo "  Zet hem aan op https://script.google.com/home/usersettings," >&2
    echo "  wacht een minuut, en draai dit script opnieuw." >&2
  elif grep -qi "invalid credentials\|unauthorized\|login" "$1"; then
    echo
    echo "✗ De inlog is verlopen. Log opnieuw in met:" >&2
    echo "    npx --yes @google/clasp@2.4.2 login" >&2
  else
    tail -20 "$1" >&2
  fi
}

LOGBOEK="$(mktemp)"
trap 'rm -f "$LOGBOEK"' EXIT

echo "▸ Code naar Google sturen"
if ! ( cd "$HIER" && $CLASP push --force ) > "$LOGBOEK" 2>&1; then
  grep -E "^└─|Pushed" "$LOGBOEK" || true
  uitleg_bij_fout "$LOGBOEK"
  exit 1
fi
grep -E "^└─|Pushed" "$LOGBOEK" || true

if [ -f "$HIER/.clasp-deployment" ]; then
  DEPLOY_ID="$(cat "$HIER/.clasp-deployment")"
  echo "▸ Uitrollen naar de bestaande webapp (adres blijft hetzelfde)"
  if ! ( cd "$HIER" && $CLASP deploy -i "$DEPLOY_ID" -d "$(date '+%Y-%m-%d %H:%M') via git push" ) > "$LOGBOEK" 2>&1; then
    echo "  De code staat wél bij Google, maar het uitrollen mislukte." >&2
    uitleg_bij_fout "$LOGBOEK"
    exit 1
  fi
  echo "▸ Klaar. De wijziging is live."
else
  echo "▸ Code staat bij Google, maar er is geen implementatie ingesteld."
  echo "  Rol zelf uit: Implementeren → Implementaties beheren → Nieuwe versie."
fi
