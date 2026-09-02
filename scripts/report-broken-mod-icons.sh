#!/usr/bin/env bash

set -euo pipefail

REPO_ROOT=$(git rev-parse --show-toplevel)
cd "$REPO_ROOT"

TITLE="Mod icons are not loading"
RUN_URL="${GITHUB_SERVER_URL:-https://github.com}/${GITHUB_REPOSITORY:-fedibtc/catalog}/actions/runs/${GITHUB_RUN_ID:-}"

broken=$(grep '^FAIL ' icon-check.log | sed 's/^FAIL /- /' | sort -u)

if [[ -z "$broken" ]]; then
    broken="- the icon check failed without naming a mod, read the run log"
fi

body="These mods show a blank card on https://fedi-catalog.vercel.app:

$broken

Point each one at a url its own site serves to everyone, or take the mod out. A host that blocks cross-origin embeds answers curl fine and still renders blank, so check a Vercel preview rather than a status code.

$RUN_URL"

existing=$(gh issue list --state open --search "$TITLE in:title" --json number,title \
    --jq "[.[] | select(.title == \"$TITLE\")][0].number")

if [[ -n "$existing" && "$existing" != "null" ]]; then
    echo "Commenting on issue #$existing"
    gh issue comment "$existing" --body "$body"
else
    echo "Opening a new issue"
    gh issue create --title "$TITLE" --body "$body"
fi
