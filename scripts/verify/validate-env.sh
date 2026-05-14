#!/usr/bin/env bash
set -euo pipefail

ENV_FILE="${1:-.env.example}"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "[env] missing file: $ENV_FILE" >&2
  exit 1
fi

required_vars=(
  APP_ENV
  NODE_ENV
  APP_SECRET_KEY
  JWT_SECRET_KEY
  DATABASE_URL
  REDIS_URL
  VITE_API_URL
  CORS_ALLOWED_ORIGINS
  CSP_REPORT_ONLY
  RATE_LIMIT_ENABLED
)

missing=()
for var in "${required_vars[@]}"; do
  if ! grep -Eq "^${var}=" "$ENV_FILE"; then
    missing+=("$var")
  fi
done

if [[ ${#missing[@]} -gt 0 ]]; then
  echo "[env] missing required vars in $ENV_FILE: ${missing[*]}" >&2
  exit 1
fi

if [[ "$ENV_FILE" != *"example" && "$ENV_FILE" != *".sample" ]]; then
  placeholder_hits=0
  for secret_var in APP_SECRET_KEY JWT_SECRET_KEY POSTGRES_PASSWORD REDIS_PASSWORD; do
    value=$(grep -E "^${secret_var}=" "$ENV_FILE" | sed "s/^${secret_var}=//" || true)
    if [[ -z "$value" || "$value" == change-me* ]]; then
      echo "[env] warning: $secret_var still uses a placeholder value in $ENV_FILE"
      placeholder_hits=$((placeholder_hits + 1))
    fi
  done

  if [[ "$placeholder_hits" -gt 0 ]]; then
    echo "[env] review placeholder values before using $ENV_FILE outside local development"
  fi
fi

echo "[env] validated $ENV_FILE"
