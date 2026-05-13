#!/usr/bin/env bash
# =============================================================================
# CaddyStats — Local Development Bootstrap
# =============================================================================
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

header "CaddyStats — Bootstrap"

# ---------------------------------------------------------------------------
# Check prerequisites
# ---------------------------------------------------------------------------
header "Checking prerequisites..."

command -v docker   >/dev/null 2>&1 || error "Docker is required. Install from https://docs.docker.com/get-docker/"
command -v node     >/dev/null 2>&1 || error "Node.js >=20 is required."
command -v pnpm     >/dev/null 2>&1 || warn  "pnpm not found — installing via corepack..."
command -v python3  >/dev/null 2>&1 || error "Python 3.12+ is required."

log "Prerequisites OK"

# ---------------------------------------------------------------------------
# Environment file
# ---------------------------------------------------------------------------
header "Environment setup..."

cd "$REPO_ROOT"

if [[ ! -f .env ]]; then
  cp .env.example .env
  log ".env created from .env.example"
  warn "Please review and update .env with real values before starting services"
else
  log ".env already exists — skipping"
fi

# ---------------------------------------------------------------------------
# Install Node dependencies
# ---------------------------------------------------------------------------
header "Installing Node dependencies..."

if command -v pnpm >/dev/null 2>&1; then
  pnpm install
  log "pnpm install complete"
else
  npm install -g pnpm
  pnpm install
  log "pnpm installed and packages installed"
fi

# ---------------------------------------------------------------------------
# Validate secret values
# ---------------------------------------------------------------------------
header "Validating environment..."

REQUIRED_VARS=(
  "POSTGRES_PASSWORD"
  "REDIS_PASSWORD"
  "JWT_SECRET_KEY"
  "APP_SECRET_KEY"
)

source .env 2>/dev/null || true

MISSING=0
for var in "${REQUIRED_VARS[@]}"; do
  val="${!var:-}"
  if [[ -z "$val" || "$val" == "change-me"* ]]; then
    warn "⚠  $var is not set or uses the default placeholder"
    MISSING=$((MISSING + 1))
  fi
done

if [[ $MISSING -gt 0 ]]; then
  warn "$MISSING environment variable(s) still need configuration in .env"
fi

# ---------------------------------------------------------------------------
# Done
# ---------------------------------------------------------------------------
header "Bootstrap complete!"
echo ""
echo "  Run services:     make dev"
echo "  Run tests:        make test"
echo "  View logs:        make logs"
echo "  DB migrations:    make db-migrate"
echo "  Help:             make help"
echo ""
