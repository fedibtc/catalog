#!/usr/bin/env bash

set -euo pipefail

REPO_ROOT=$(git rev-parse --show-toplevel)
cd "$REPO_ROOT"

BASE_REF=${1:-origin/master}

mapfile -t added < <(git diff --name-only --diff-filter=A "$BASE_REF" HEAD -- 'mods/*/*/meta.json')

if [[ ${#added[@]} -eq 0 ]]; then
    echo "No mods added in this branch"
    exit 0
fi

echo "Mods added in this branch:"
printf '  %s\n' "${added[@]}"

bun install
bunx playwright install --with-deps chromium
bun scripts/check-mod-icons.ts "${added[@]}"
