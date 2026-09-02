#!/usr/bin/env bash

set -uo pipefail

REPO_ROOT=$(git rev-parse --show-toplevel)
cd "$REPO_ROOT"

bun install
bunx playwright install --with-deps chromium

bun scripts/check-mod-icons.ts --all 2>&1 | tee icon-check.log
exit "${PIPESTATUS[0]}"
