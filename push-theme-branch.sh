#!/usr/bin/env bash
# Creates (or updates) a clean branch containing ONLY the Shopify theme
# folders, and pushes it to origin.
#
# Why this exists:
#   Shopify's GitHub integration requires the theme files at the ROOT of the
#   connected branch, with no unrelated files or folders mixed in. Your repo
#   also holds original-static/, README.md and the build scripts, which belong
#   in version control but must NOT be on the branch Shopify reads.
#
# How it works:
#   It builds the commit through a throwaway git index (GIT_INDEX_FILE), so it
#   never switches branches and never touches your working tree or your real
#   index. Nothing can be lost if it fails halfway.
#
# Usage:
#   ./push-theme-branch.sh                 # branch defaults to shopify-theme
#   ./push-theme-branch.sh my-branch-name

set -euo pipefail

BRANCH="${1:-shopify-theme}"
DIRS=(assets config layout locales sections snippets templates)

say()  { printf '\n\033[1m%s\033[0m\n' "$*"; }
fail() { printf '\nERROR: %s\n' "$*" >&2; exit 1; }

# ---------- preflight ----------
git rev-parse --is-inside-work-tree >/dev/null 2>&1 \
  || fail "Not a git repository yet.
   Run this first:
     git init -b main
     git add .
     git commit -m \"Brutal Buy storefront as a Shopify theme\""

for d in "${DIRS[@]}"; do
  [[ -d "$d" ]] || fail "Missing theme folder: $d"
done
[[ -f layout/theme.liquid ]]         || fail "Missing layout/theme.liquid"
[[ -f config/settings_schema.json ]] || fail "Missing config/settings_schema.json"

git remote get-url origin >/dev/null 2>&1 \
  || fail "No 'origin' remote yet.
   Run: git remote add origin https://github.com/<your-username>/<your-repo>.git"

CURRENT_BRANCH="$(git rev-parse --abbrev-ref HEAD)"
say "Current branch: $CURRENT_BRANCH (this will not change)"

# ---------- build the commit in a temporary index ----------
GIT_DIR_PATH="$(git rev-parse --absolute-git-dir)"
TMP_INDEX="$GIT_DIR_PATH/bb-theme-branch.index"
cleanup() { rm -f "$TMP_INDEX"; }
trap cleanup EXIT

rm -f "$TMP_INDEX"
export GIT_INDEX_FILE="$TMP_INDEX"

git read-tree --empty
git add "${DIRS[@]}"
TREE="$(git write-tree)"

# Inspect the tree we just built (not a diff against HEAD, which would also
# list the files we are deliberately leaving behind).
TOPLEVEL="$(git ls-tree --name-only "$TREE" | sort -u)"
UNEXPECTED="$(comm -23 <(echo "$TOPLEVEL") <(printf '%s\n' "${DIRS[@]}" | sort))"
if [[ -n "$UNEXPECTED" ]]; then
  echo "$UNEXPECTED" | sed 's/^/  /'
  fail "Unexpected top-level entries in the snapshot — aborting so nothing wrong gets pushed."
fi

FILE_COUNT="$(git ls-tree -r --name-only "$TREE" | wc -l | tr -d ' ')"

say "Snapshot for '$BRANCH' — $FILE_COUNT files, top level:"
echo "$TOPLEVEL" | sed 's/^/  /'

# Keep history linear: parent = existing branch tip, if any.
PARENT="$(git rev-parse --verify --quiet "refs/heads/$BRANCH" || true)"

# Check BEFORE creating anything, so an unchanged run leaves no stray commit
# behind (which would put the local branch ahead of origin).
if [[ -n "$PARENT" ]] && [[ "$(git rev-parse "$PARENT^{tree}")" == "$TREE" ]]; then
  say "Theme files are identical to the last push — nothing to do."
  exit 0
fi

if [[ -n "$PARENT" ]]; then
  NEW_COMMIT="$(git commit-tree "$TREE" -p "$PARENT" -m "Update Shopify theme files")"
else
  NEW_COMMIT="$(git commit-tree "$TREE" -m "Brutal Buy theme (theme folders only, for Shopify GitHub sync)")"
fi
git update-ref "refs/heads/$BRANCH" "$NEW_COMMIT"

say "Branch '$BRANCH' now points at $NEW_COMMIT"

# ---------- push ----------
say "Pushing to origin..."
git push origin "$BRANCH:$BRANCH"

cat <<EOF

$(printf '\033[1mDone.\033[0m')

Your working tree is untouched and you are still on '$CURRENT_BRANCH'.

Now connect it in Shopify:

  Online Store -> Themes -> Add theme -> Connect from GitHub
    -> authorize the Shopify GitHub app
    -> choose this repository
    -> click Connect next to the branch: $BRANCH

'original-static/' and the build scripts stay on '$CURRENT_BRANCH' only, so the
branch Shopify reads contains exactly the 7 theme folders.
EOF
