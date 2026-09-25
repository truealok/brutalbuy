#!/usr/bin/env bash
# Builds a Shopify-uploadable zip of the Brutal Buy theme.
#
# Shopify requires the theme folders at the ROOT of the zip, so we deliberately
# exclude original-static/ (your untouched source site), README.md and macOS junk.
#
# Usage:  ./make-theme-zip.sh [output-name.zip]

set -euo pipefail

OUT="${1:-brutal-buy-theme.zip}"
DIRS=(assets config layout locales sections snippets templates)

# --- sanity check: is this actually a valid theme? ---
missing=0
for d in "${DIRS[@]}"; do
  [[ -d "$d" ]] || { echo "Missing theme folder: $d" >&2; missing=1; }
done
[[ -f layout/theme.liquid ]]           || { echo "Missing layout/theme.liquid" >&2; missing=1; }
[[ -f config/settings_schema.json ]]   || { echo "Missing config/settings_schema.json" >&2; missing=1; }
[[ -f assets/styles.css ]]             || { echo "Missing assets/styles.css" >&2; missing=1; }
[[ $missing -eq 0 ]] || { echo "Aborting — not a complete theme." >&2; exit 1; }

rm -f "$OUT"

if command -v zip >/dev/null 2>&1; then
  echo "Using zip..."
  zip -rq "$OUT" "${DIRS[@]}" -x "*.DS_Store" -x "__MACOSX/*" -x "*/.*"
elif command -v python >/dev/null 2>&1; then
  echo "zip not found — using python -m zipfile..."
  python -m zipfile -c "$OUT" "${DIRS[@]}"
elif command -v python3 >/dev/null 2>&1; then
  echo "zip not found — using python3 -m zipfile..."
  python3 -m zipfile -c "$OUT" "${DIRS[@]}"
elif command -v node >/dev/null 2>&1; then
  echo "zip not found — using node..."
  node make-theme-zip.js "$OUT" "${DIRS[@]}"
else
  echo "Need one of: zip, python, python3, or node. None found." >&2
  exit 1
fi

echo
echo "Built $OUT ($(du -h "$OUT" | cut -f1))"
echo
echo "Top-level entries (Shopify needs exactly these at the zip root):"
node -e '
  const fs = require("fs"), buf = fs.readFileSync(process.argv[1]);
  const seen = new Set();
  for (let i = 0; i < buf.length - 4; i++) {
    if (buf.readUInt32LE(i) !== 0x04034b50) continue;
    const n = buf.readUInt16LE(i + 26);
    const name = buf.slice(i + 30, i + 30 + n).toString("latin1");
    if (name) seen.add(name.split("/")[0]);
  }
  [...seen].sort().forEach(d => console.log("  " + d + "/"));
' "$OUT"

echo
echo "Upload: Shopify admin -> Online Store -> Themes -> Add theme -> Upload zip file"
