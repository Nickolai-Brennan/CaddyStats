#!/usr/bin/env bash
set -euo pipefail

RESET="\033[0m"
GREEN="\033[32m"
YELLOW="\033[33m"
RED="\033[31m"
BOLD="\033[1m"

log()    { echo -e "${GREEN}[setup]${RESET} $*"; }
warn()   { echo -e "${YELLOW}[warn]${RESET}  $*"; }
error()  { echo -e "${RED}[error]${RESET} $*" >&2; exit 1; }
header() { echo -e "\n${BOLD}$*${RESET}"; }

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
NODE_MAJOR_REQUIRED=20
PYTHON_MINOR_REQUIRED=12

require_command() {
  local command="$1"
  local message="$2"
  command -v "$command" >/dev/null 2>&1 || error "$message"
}

header "CaddyStats — Local Bootstrap"
cd "$REPO_ROOT"

header "Checking prerequisites"
require_command git "Git is required."
require_command docker "Docker is required. Install from https://docs.docker.com/get-docker/"
require_command node "Node.js >=${NODE_MAJOR_REQUIRED} is required."
require_command python3 "Python 3.${PYTHON_MINOR_REQUIRED}+ is required."

docker compose version >/dev/null 2>&1 || error "Docker Compose v2 is required."

NODE_VERSION=$(node -v | sed 's/^v//' | cut -d. -f1)
if [[ "$NODE_VERSION" -lt "$NODE_MAJOR_REQUIRED" ]]; then
  error "Node.js >=${NODE_MAJOR_REQUIRED} is required. Found $(node -v)."
fi

PYTHON_VERSION=$(python3 -c 'import sys; print(f"{sys.version_info.major}.{sys.version_info.minor}")')
PYTHON_MINOR=$(python3 -c 'import sys; print(sys.version_info.minor)')
if [[ "$PYTHON_MINOR" -lt "$PYTHON_MINOR_REQUIRED" ]]; then
  error "Python 3.${PYTHON_MINOR_REQUIRED}+ is required. Found ${PYTHON_VERSION}."
fi

if ! command -v pnpm >/dev/null 2>&1; then
  log "pnpm not found — enabling via corepack"
  corepack enable
  corepack prepare pnpm@9.15.9 --activate
fi

log "Prerequisites OK"

header "Preparing environment files"
if [[ ! -f .env ]]; then
  cp .env.example .env
  log "Created .env from .env.example"
else
  log ".env already exists — leaving it in place"
fi

if [[ ! -f .env.local ]]; then
  cp config/environments/.env.local.example .env.local
  log "Created .env.local from config/environments/.env.local.example"
else
  log ".env.local already exists — leaving it in place"
fi

header "Installing workspace dependencies"
pnpm install
log "pnpm install complete"

header "Installing API development dependencies"
python3 -m pip install -r services/api/requirements/dev.txt
log "API dependencies installed"

header "Installing repository hooks"
make hooks

header "Running baseline verification"
bash scripts/verify/validate-env.sh .env.example
bash scripts/verify/validate-env.sh .env
bash scripts/verify/architecture-drift.sh
bash scripts/verify/docs-check.sh

header "Bootstrap complete"
echo ""
echo "  make verify           # validate env/docs/architecture baselines"
echo "  make lint             # run repo lint checks"
echo "  make typecheck        # run repo type checks"
echo "  make test             # run API + web tests"
echo "  make dev              # start the local Docker stack"
echo "  make docker-validate  # validate compose files and image builds"
echo ""
