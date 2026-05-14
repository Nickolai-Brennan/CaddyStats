#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$REPO_ROOT"

build_images=false
if [[ "${1:-}" == "--build" ]]; then
  build_images=true
fi

docker compose -f docker-compose.yml config >/dev/null
docker compose -f docker-compose.test.yml config >/dev/null
echo "[docker] compose files validated"

if [[ "$build_images" == true ]]; then
  docker compose build api web
  echo "[docker] api and web image builds validated"
fi
