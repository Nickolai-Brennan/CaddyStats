# Local Development Bootstrap

## Purpose

Define the baseline bootstrap flow for contributors working on CaddyStats locally.

## Required tools

- Git
- Docker with Compose v2
- Node.js 20+
- pnpm 9+
- Python 3.12+

## Bootstrap flow

1. Clone the repository.
2. Run `make setup`.
3. Review `.env` and `.env.local` before starting any service.
4. Run `make verify` to confirm env, docs, and architecture baselines.
5. Start the local stack with `make dev`.

## Local validation entrypoints

- `make verify` — repository baseline checks
- `make lint` — API Ruff + workspace linting
- `make typecheck` — API mypy + workspace type checking
- `make test` — API pytest + web Vitest entrypoint
- `make docker-validate` — Compose config and container build validation

## Contributor expectations

- Keep `.env` files local only.
- Prefer `config/environments/*.example` when documenting environment-specific behavior.
- Update docs and changelog entries with any new bootstrap, verification, or workflow behavior.
