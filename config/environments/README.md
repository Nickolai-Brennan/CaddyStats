# Environment Overlay Templates

This directory holds environment-specific example overlays for CaddyStats.

## Files

- `.env.local.example` — local developer defaults layered on top of `.env.example`
- `.env.development.example` — shared development environment overrides
- `.env.test.example` — test and CI-safe overrides
- `.env.staging.example` — staging topology and secret-handling expectations
- `.env.production.example` — production-only runtime expectations

## Rules

- Keep real secrets out of this directory.
- Update `.env.example` when a variable is required across all environments.
- Use these files as documented overlays, not as committed runtime secrets.
- Environment-specific secret values must come from GitHub Actions secrets, managed secret stores, or platform environment configuration.
