#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$REPO_ROOT"

required_dirs=(
  .github
  ai
  api
  apps
  automation
  backend
  commands
  config
  database
  docs
  frontend
  infrastructure
  packages
  plugins
  scripts
  services
  tests
  workers
)

required_files=(
  README.md
  CONTRIBUTING.md
  .github/CODEOWNERS
  .github/pull_request_template.md
  .github/ISSUE_TEMPLATE/bug_report.md
  .github/ISSUE_TEMPLATE/feature_request.md
  docs/changelog.md
  docs/workflow.md
)

package_dirs=(ui types config utils analytics seo)
root_readmes=(
  ai/README.md
  api/README.md
  apps/README.md
  automation/README.md
  backend/README.md
  commands/README.md
  config/README.md
  database/README.md
  docs/README.md
  frontend/README.md
  infrastructure/README.md
  packages/README.md
  plugins/README.md
  scripts/README.md
  services/README.md
  tests/README.md
  workers/README.md
)

missing=()
for path in "${required_dirs[@]}"; do
  [[ -d "$path" ]] || missing+=("$path/")
done
for path in "${required_files[@]}"; do
  [[ -f "$path" ]] || missing+=("$path")
done
for path in "${root_readmes[@]}"; do
  [[ -f "$path" ]] || missing+=("$path")
done
for path in "${package_dirs[@]}"; do
  [[ -d "packages/$path" ]] || missing+=("packages/$path/")
  [[ -f "packages/$path/README.md" ]] || missing+=("packages/$path/README.md")
done

if [[ ${#missing[@]} -gt 0 ]]; then
  printf '[architecture] missing required paths:\n' >&2
  printf ' - %s\n' "${missing[@]}" >&2
  exit 1
fi

echo "[architecture] repository boundaries and ownership stubs verified"
