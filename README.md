# Caddy Stats

Caddy Stats is Strik3Zone's production-grade golf analytics, betting intelligence, and editorial publishing platform.

The product combines verified golf data, projection workflows, SEO-ready content systems, premium research tools, and AI-assisted analysis into one auditable platform.

## What the platform is built to do

- turn fragmented golf research into one trusted workflow
- ground public and premium claims in database-backed or provider-backed data
- support editorial publishing without sacrificing statistical integrity
- create differentiated subscription and affiliate value through explainable tools
- preserve clear boundaries across product, data, API, UI, and operations

## Current repository layout

This repository currently contains:

- `apps/web/` for the public React + Vite frontend
- `apps/admin/` for internal admin interfaces
- `apps/editor/` for editorial tooling surfaces
- `services/api/` for the FastAPI backend
- `frontend/`, `backend/`, and `api/` as canonical target ownership boundaries for future direct implementations
- `packages/` for shared workspace packages
- `database/` for shared database assets and references
- `docs/` for canonical docs, planning artifacts, and legacy documentation archives
- `tests/`, `scripts/`, `infrastructure/`, `workers/`, `ai/`, and `config/` for support and runtime concerns
- `plugins/`, `commands/`, and `automation/` for extensibility and deterministic automation workflows
- `AI Control/` for imported agentic assets and workflow support material

## Documentation map

### Canonical docs

- `docs/README.md`
- `docs/core/PROJECT_OVERVIEW.md`
- `docs/product/VISION_AND_GOALS.md`
- `docs/architecture/SYSTEM_ARCHITECTURE_OVERVIEW.md`
- `docs/governance/ENGINEERING_STANDARDS_AND_GOVERNANCE.md`
- `docs/governance/adr/README.md`
- `docs/workflow.md`
- `docs/changelog.md`

### Detailed supporting docs

- `docs/architecture/system-overview.md`
- `docs/architecture/system-blueprint.md`
- `docs/architecture/domain-model.md`
- `docs/data/stat-grounding-policy.md`
- `docs/security/auth-rbac.md`
- `docs/roadmap/build-phases.md`
- `docs/compliance/`

### Planning and historical context

- `docs/planning/` for active planning and task-sequencing artifacts
- `docs/legacy/support/` for archived support material retained for provenance
- `docs/governance/DOCUMENTATION_CONSOLIDATION_AUDIT.md` for remaining overlap to trim later

## Build and validation entry points

- `make setup` bootstraps local development
- `make dev` starts the local stack with Docker Compose
- `make lint` runs the repository linting entrypoints
- `make test` runs the repository test entrypoints
- `make hooks` installs standardized repository git hooks (`.githooks/`)

## 🚀 Local Development

### Quick Start
```bash
# macOS/Linux
./dev.sh up

# Windows (PowerShell)
.\dev.cmd up

# Windows (Command Prompt)
dev.cmd up

# Open frontend
open http://localhost:3000
```

**Note for Windows PowerShell users**: Use `.\dev.cmd up` (with the `.\` prefix)

**See `QUICKREF.md` for a one-page cheat sheet.**

### Full Development Setup
- **`LOCAL_DEVELOPMENT.md`** - Complete guide for running all services locally
- **`DEVELOPMENT_SETUP.md`** - Environment configuration and setup options
- **`API_TESTING.md`** - API testing tools and examples
- **`QUICKREF.md`** - One-page developer reference

### Environment Access
- Copy `.env.example` to `.env` for local development, or let `./dev.sh up` / `dev.cmd up` create `.env` automatically on first run.
- Use `config/environments/` for environment-specific reference files and overlay examples.
- Local Docker defaults are:
	- `APP_ENV=development`
	- PostgreSQL database: `caddystats`
	- PostgreSQL user: `caddystats`
	- PostgreSQL password: `caddystats_dev`
- Compose uses the repo-scoped `CADDYSTATS_POSTGRES_*` variables to avoid collisions with machine-level `POSTGRES_*` environment variables.
- If you change `.env`, restart the stack with `./dev.sh restart` or `dev.cmd restart` so containers pick up the new values.

### Service URLs (after running `./dev.sh up`)
| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| API Docs | http://localhost:8000/docs |
| GraphQL | http://localhost:8000/graphql |
| Database | localhost:5432 |
| Redis | localhost:6379 |

### Making Changes
- **Backend**: Edit `backend/app/` - auto-reload enabled
- **Frontend**: Edit `apps/web/src/` - HMR enabled
- **Database**: Run migrations, changes auto-sync
- **Tests**: `docker-compose exec api pytest` or `docker-compose exec web npm run test`

## Contributor quickstart

- `make setup` bootstraps local dependencies, hooks, env files, and repository verification.
- `make verify` validates environment templates, documentation entrypoints, and architecture boundaries.
- `make lint`, `make typecheck`, and `make test` are the canonical local validation entrypoints.
- `make docker-validate` verifies Compose configuration and container image builds.
- `CONTRIBUTING.md` documents the expected contributor workflow.

### Start developing
1. Read `QUICKREF.md` (2 min)
2. Run `./dev.sh up` (1 min)
3. Open http://localhost:3000 (10 sec)
4. Start coding!

## Environment and platform baseline

- `.env.example` defines the shared variable contract.
- `config/environments/` contains environment-specific example overlays for local, development, test, staging, and production.
- `docs/devops/local-development-bootstrap.md`, `docs/devops/environment-and-secrets-strategy.md`, and `docs/devops/platform-baseline.md` define the bootstrap, environment, and security baseline.

## Documentation rules

- durable project docs belong under `docs/`
- `docs/planning/` is the active planning area, but not the canonical architecture or governance source by default
- `docs/legacy/support/` is historical reference material only
- major architecture or governance changes should update the nearest canonical doc and ADR references
- documentation should stay aligned with real repository structure, contracts, and operating rules

## Product principles

1. Data first.
2. Explainability over hype.
3. Clear system boundaries.
4. Editorial structure over ad hoc publishing.
5. Monetization aligned to real user value.
6. Security and auditability are product requirements.

## Related references

- `docs/README.md`
- `docs/workflow.md`
- `docs/product/vision.md`
- `docs/architecture/system-overview.md`
- `docs/architecture/system-blueprint.md`
- `docs/changelog.md`
