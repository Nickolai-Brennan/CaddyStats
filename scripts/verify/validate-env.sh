#!/usr/bin/env bash
set -euo pipefail

ENV_FILE="${1:-.env.example}"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "[env] missing file: $ENV_FILE" >&2
  exit 1
fi

python3 - "$ENV_FILE" <<'PY'
from pathlib import Path
import sys

env_file = Path(sys.argv[1])
required_vars = [
    "APP_ENV",
    "NODE_ENV",
    "APP_SECRET_KEY",
    "JWT_SECRET_KEY",
    "DATABASE_URL",
    "REDIS_URL",
    "VITE_API_URL",
    "CORS_ALLOWED_ORIGINS",
    "CSP_REPORT_ONLY",
    "RATE_LIMIT_ENABLED",
]
secret_vars = ["APP_SECRET_KEY", "JWT_SECRET_KEY", "POSTGRES_PASSWORD", "REDIS_PASSWORD"]
values = {}

for raw_line in env_file.read_text().splitlines():
    line = raw_line.strip()
    if not line or line.startswith("#") or "=" not in line:
        continue
    key, value = line.split("=", 1)
    values[key] = value

missing = [var for var in required_vars if var not in values]
if missing:
    print(f"[env] missing required vars in {env_file}: {' '.join(missing)}", file=sys.stderr)
    raise SystemExit(1)

if not env_file.name.endswith("example") and not env_file.name.endswith("sample"):
    placeholders = [
        var
        for var in secret_vars
        if not values.get(var) or values.get(var, "").startswith("change-me")
    ]
    for var in placeholders:
        print(f"[env] warning: {var} still uses a placeholder value in {env_file}")
    if placeholders:
        print(f"[env] review placeholder values before using {env_file} outside local development")

print(f"[env] validated {env_file}")
PY
