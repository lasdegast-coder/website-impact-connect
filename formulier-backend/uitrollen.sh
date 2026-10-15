#!/usr/bin/env bash
#
# Zet de code uit deze map bij Google en rolt hem uit naar de live webapp.
# Wordt automatisch aangeroepen door de pre-push hook; je kunt hem ook zelf
# draaien als je alleen de backend wilt bijwerken.
#
set -euo pipefail

HIER="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [ ! -f "$HIER/.clasp.json" ]; then
  echo "Nog niet gekoppeld. Voer eerst uit: ./formulier-backend/clasp-opzetten.sh" >&2
  exit 1
fi

# Het uitrollen doet uitrollen.js, een scriptje zonder bibliotheken. Clasp
# deed dit eerder, maar dat vraagt bij het inloggen het recht "cloud-platform"
# mee, en daar hangt Google's herauthenticatiebeleid aan: na een dag stopte
# elke push met invalid_grant. Zie de uitleg bovenin uitrollen.js.
uitleg_bij_fout() {
  if grep -q "has not enabled the Apps Script API" "$1"; then
    echo
    echo "✗ De Apps Script API staat uit op dit Google-account." >&2
    echo "  Zet hem aan op https://script.google.com/home/usersettings," >&2
    echo "  wacht een minuut, en draai dit script opnieuw." >&2
  elif grep -qi "invalid_grant\|inloggen\|niet vinden" "$1"; then
    echo
    echo "✗ De inlog klopt niet meer. Log opnieuw in met:" >&2
    echo "    cd formulier-backend && node uitrollen.js inloggen" >&2
    echo "  Staat creds.json er niet? Zie INSTRUCTIES.md." >&2
  else
    tail -20 "$1" >&2
  fi
}

LOGBOEK="$(mktemp)"
trap 'rm -f "$LOGBOEK"' EXIT

if ! ( cd "$HIER" && node uitrollen.js ) > "$LOGBOEK" 2>&1; then
  cat "$LOGBOEK" >&2
  uitleg_bij_fout "$LOGBOEK"
  exit 1
fi
cat "$LOGBOEK"
