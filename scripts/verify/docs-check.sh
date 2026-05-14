#!/usr/bin/env bash
set -euo pipefail

required_docs=(
  README.md
  CONTRIBUTING.md
  docs/README.md
  docs/workflow.md
  docs/changelog.md
  docs/devops/local-development-bootstrap.md
  docs/devops/environment-and-secrets-strategy.md
  docs/devops/platform-baseline.md
)

missing=()
for path in "${required_docs[@]}"; do
  [[ -f "$path" ]] || missing+=("$path")
done

if [[ ${#missing[@]} -gt 0 ]]; then
  printf '[docs] missing required docs:\n' >&2
  printf ' - %s\n' "${missing[@]}" >&2
  exit 1
fi

echo "[docs] required documentation entrypoints verified"
