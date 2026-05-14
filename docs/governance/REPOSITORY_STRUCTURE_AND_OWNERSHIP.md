# Repository Structure and Ownership

Last Updated: 2026-05-14

## Purpose

Lock a canonical monorepo structure and ownership boundaries across runtime, data, platform, AI, documentation, and automation domains.

## Canonical Domain Boundaries

### Runtime + Product Domains

- `apps/` — active frontend application surfaces (`apps/web`, `apps/admin`, `apps/editor`)
- `services/` — active backend services (`services/api`)
- `packages/` — shared libraries and typed contracts
- `workers/` — asynchronous and scheduled execution workloads
- `database/` — schema assets, references, and database-level artifacts
- `infrastructure/` — deployment and runtime infrastructure definitions
- `ai/` — AI pipelines, injections, and evaluation assets

### Governance + Support Domains

- `docs/` — canonical, planning, and archived support documentation
- `scripts/` — operational and setup scripts
- `tests/` — cross-domain test suites
- `config/` — repository and platform configuration assets
- `automation/` — non-runtime automation assets and reports

### Approved Target Aliases

The following directories are approved canonical targets and may host direct implementations as migration progresses:

- `frontend/` (frontend ownership boundary)
- `backend/` (backend ownership boundary)
- `api/` (contract/API ownership boundary)
- `database/`
- `tests/`
- `docs/`
- `config/`
- `plugins/`
- `commands/`

Current active implementations in `apps/` and `services/` remain valid and authoritative until migration work explicitly moves them.

## Ownership Mapping

- `apps/` and `frontend/` → frontend owner
- `services/`, `backend/`, `workers/` → backend owner
- `api/` → API owner
- `database/` → database owner
- `infrastructure/`, `config/`, `scripts/`, `automation/` → platform/DevOps owner
- `ai/` → AI systems owner
- `packages/` → shared platform owner (with consuming domain reviewers)
- `tests/` → testing owner (with affected domain reviewers)
- `docs/` → documentation owner (with domain reviewer support)
- `plugins/` → plugin owner
- `commands/` → command owner

Operational reviewer enforcement is defined by `.github/CODEOWNERS`.

## Root Tooling Standard

- Workspace management: `pnpm-workspace.yaml`
- Task graph: `turbo.json`
- Root scripts: `package.json`
- Build/validation command entrypoints: `Makefile`
- Environment baseline: `.env.example`
- Git hooks: `.githooks/` via `git config core.hooksPath .githooks`

Root configuration must preserve compatibility with active domains (`apps/`, `services/`) while allowing incremental adoption of approved target aliases.
