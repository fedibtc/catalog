#!/usr/bin/env bash

set -euo pipefail

REPO_ROOT=$(git rev-parse --show-toplevel)
MODE=${MODE:-check}

pushd "$REPO_ROOT" >/dev/null

echo "Installing dependencies..."
bun install

if [[ -n "${CI:-}" ]]; then
    echo "Running UI code checks in CI"

    echo "Running lint..."
    bun run lint

    echo "Running format..."
    bun run format

    popd >/dev/null
    CHANGES=$(git status --porcelain)
    if [[ -z "$CHANGES" ]]; then
        echo "All UI code is correctly linted and formatted"
    else
        echo "The following files must be linted/formatted. Run 'MODE=write ./scripts/check-ui-code.sh' to fix the errors"
        echo "$CHANGES"
        exit 1
    fi

    pushd "$REPO_ROOT" >/dev/null
    echo "Running type check..."
    bun run type-check

    echo "All checks passed!"
else
    if [[ "$MODE" == "write" ]]; then
        echo "Running UI code checks in fix mode"

        echo "Fixing lint errors..."
        bun run lint

        echo "Fixing format errors..."
        bun run format

        echo "Running type check..."
        bun run type-check

        echo "All fixes applied and checks passed!"
    else
        echo "Running UI code checks in check mode"

        echo "Checking lint..."
        bun run lint:check

        echo "Checking format..."
        bun run format:check

        echo "Running type check..."
        bun run type-check

        echo "All checks passed!"
    fi
fi

popd >/dev/null
