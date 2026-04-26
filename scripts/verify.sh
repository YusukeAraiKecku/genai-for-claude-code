#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

echo "== Verify started =="

# Phase 1: Node monorepo gates
if [ -f package.json ]; then
  echo "== Node project detected =="

  if npm run 2>/dev/null | grep -q "typecheck"; then
    echo "-- typecheck --"
    npm run typecheck
  fi

  if npm run 2>/dev/null | grep -q "lint"; then
    echo "-- lint --"
    npm run lint
  fi

  if npm run 2>/dev/null | grep -q "build"; then
    echo "-- build --"
    npm run build
  fi

  if npm run 2>/dev/null | grep -q "test"; then
    echo "-- unit tests --"
    npm test
  fi
else
  echo "No package.json found. Bootstrap not complete; skipping Node gates."
fi

# Phase 2: Smoke compile of bundled examples
CLI="node packages/cli/dist/index.js"

if [ -f packages/cli/dist/index.js ]; then
  for ex in proposal-review contract-review-lite meeting-to-actions; do
    if [ -f "examples/${ex}/gennai.recipe.yml" ]; then
      echo "-- compile example: ${ex} --"
      OUT="$(mktemp -d)/${ex}"
      $CLI compile --recipe "examples/${ex}/gennai.recipe.yml" --out "$OUT"
      test -f "$OUT/SKILL.md"
      test -f "$OUT/input.schema.json"
      echo "-- validate example: ${ex} --"
      $CLI validate "$OUT"
    fi
  done
else
  echo "CLI not built yet; skipping smoke compile."
fi

echo "== Verify passed =="
