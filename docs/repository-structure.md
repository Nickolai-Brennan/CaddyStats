# Repository Structure

## Purpose
Define the approved root folder scaffold for CaddyStats and establish ownership boundaries across application code, shared packages, infrastructure, data, AI, documentation, and operational tooling.

## Goals
- Keep domain boundaries explicit
- Separate deployable apps from shared libraries
- Keep infrastructure and database concerns organized
- Support editorial, AI, and analytics workflows without mixing responsibilities
- Make onboarding and navigation predictable

## Approved Root Structure

```text
.github/
apps/
services/
packages/
workers/
database/
infrastructure/
ai/
docs/
scripts/
tests/
config/
```

## Directory Contracts

### `.github/`
Repository automation and contribution workflows.
- workflows
- issue templates
- PR templates
- CODEOWNERS
- dependency and policy automation

**Owner:** Platform / Engineering Productivity

---

### `apps/`
User-facing deployable applications.
- `apps/web/` — public frontend and authenticated editorial/admin UI shell as appropriate

**Rules**
- Apps may depend on `packages/`
- Apps must not contain infrastructure-specific deployment secrets
- UI-specific composition belongs here, not shared business logic

**Owner:** Frontend Engineering

---

### `services/`
Primary backend/API services.
- `services/api/` — FastAPI REST + GraphQL service

**Rules**
- Service-specific runtime wiring belongs here
- Cross-service reusable logic should be moved to `packages/` where practical
- Services own API exposure and request lifecycle orchestration

**Owner:** Backend Engineering

---

### `packages/`
Shared libraries, schemas, types, utilities, and SDKs.
Potential examples:
- `packages/types/`
- `packages/config/`
- `packages/ui/`
- `packages/seo/`
- `packages/contracts/`

**Rules**
- No app-only assumptions
- Reusable, versioned interfaces preferred
- Shared contracts should be stable and documented

**Owner:** Engineering, by package

---

### `workers/`
Background jobs and asynchronous processing.
Potential examples:
- ingestion jobs
- projection refresh jobs
- materialized view refresh jobs
- AI audit or enrichment jobs

**Rules**
- Workers should consume stable contracts from services/database/packages
- Long-running or scheduled tasks belong here, not inside request handlers

**Owner:** Backend / Platform / Data

---

### `database/`
Database lifecycle and source-of-truth artifacts.
- migrations
- schema docs
- seeds
- reference SQL
- materialized views

**Rules**
- Schema changes must be migration-backed
- Data contracts must align with backend schemas and docs
- Critical analytics queries should be documented

**Owner:** Backend Engineering / Data

---

### `infrastructure/`
Runtime environment and deployment configuration.
Potential examples:
- nginx
- docker
- compose
- terraform
- hosting configs
- observability config

**Rules**
- Environment-specific deployment logic belongs here
- Secrets must not be committed
- Health, readiness, and operational concerns should be represented here

**Owner:** Platform / DevOps

---

### `ai/`
AI-specific system assets and operational rules.
Potential examples:
- prompts
- instructions
- policies
- evaluation configs
- guardrail configs
- source-grounding templates

**Rules**
- AI prompts must reference grounding and audit policies
- Experimental prompt assets should still be traceable and versioned
- AI output assumptions must never bypass editorial or provenance rules

**Owner:** AI/ML + Editorial Governance

---

### `docs/`
Implementation-facing technical and operational documentation.

**Owner:** Shared ownership by subsystem

---

### `scripts/`
Developer and CI helper scripts.
Potential examples:
- bootstrap
- local setup
- migration helpers
- seed loaders
- validation tools

**Rules**
- Scripts must be idempotent where feasible
- Scripts should be documented if used in CI/CD or local onboarding

**Owner:** Engineering / Platform

---

### `tests/`
Cross-cutting and top-level test suites.
Potential examples:
- integration tests
- e2e tests
- contract tests
- fixture sets

**Rules**
- Unit tests may also live near implementation
- Cross-service and end-to-end suites should live here

**Owner:** Shared engineering ownership

---

### `config/`
Shared configuration and standards.
Potential examples:
- lint config
- formatting config
- tsconfig base
- environment templates
- policy config

**Owner:** Engineering Productivity / Platform

## Ownership Boundaries
| Directory | Primary Responsibility | Must Not Become |
|---|---|---|
| `apps/` | UI composition and user workflows | Shared utility dumping ground |
| `services/` | API/runtime orchestration | Monolithic everything-folder |
| `packages/` | Reusable contracts and libraries | App-specific code clone |
| `workers/` | Background processing | Hidden API side effects |
| `database/` | Persistent data definition | Unreviewed SQL dumping ground |
| `infrastructure/` | Deploy/runtime setup | App business logic |
| `ai/` | Prompting, guardrails, evaluation | Untracked content generation zone |
| `docs/` | System truth and planning | Stale archive only |

## Naming Guidance
- Use kebab-case for folders unless ecosystem conventions require otherwise
- Use explicit domain names over generic labels
- Prefer `services/api` over vague names like `services/backend`
- Prefer `packages/contracts` over `packages/shared`

## Required README Coverage
Each major root directory should eventually contain a local README that explains:
- purpose
- ownership
- what belongs there
- what does not belong there
- local commands or workflows if relevant

## Change Control
Changes to root structure should require:
- documentation update
- rationale in PR description
- downstream impact review for CI, Docker, imports, and developer workflows
