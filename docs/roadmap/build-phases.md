# Build Phases

## Purpose

This roadmap translates the planning document into an implementation-guiding delivery sequence. It preserves the required build order so later work depends on approved upstream outputs instead of ad hoc assumptions.

## Phase Order

1. Documentation
2. Folder Setup
3. Database
4. Backend
5. Frontend
6. Editor
7. Templates
8. SEO
9. AI
10. Hosting
11. Admin
12. Integrations
13. Scale
14. Business

## Delivery Rules

- a phase should not start in force until its required predecessor outputs exist
- every phase should produce document, folder, schema, API, UI, or deployment artifacts
- architectural deviations should be captured in ADRs before dependent implementation spreads
- validation checks should be defined as part of the phase, not added after the fact

## Phase 0 — Documentation

### Goal

Define product, architecture, governance, and roadmap constraints before deeper implementation.

### Core outputs

- product vision and scope
- system overview and domain model
- auth/RBAC and stat-grounding policy
- delivery roadmap and ADR expectations

### Dependency value

Provides the contract for later folder, schema, API, and UI work.

## Phase 1 — Folder Setup

### Goal

Stabilize the repository structure and ownership boundaries needed for sustained delivery.

### Core outputs

- canonical root structure
- ownership/readme guidance
- base config and environment templates
- contribution and validation conventions

### Depends on

- approved documentation boundaries from Phase 0

## Phase 2 — Database

### Goal

Establish PostgreSQL as the source of truth for stats, content, auth, subscriptions, and auditability.

### Core outputs

- canonical schema definitions
- migration strategy
- indexes and materialized-view plan
- ERD and data-governance alignment

### Depends on

- domain entities and policy docs from Phase 0
- repo structure from Phase 1

## Phase 3 — Backend

### Goal

Create the FastAPI service layer and API contracts that sit in front of the source-of-truth database.

### Core outputs

- auth and RBAC foundation
- stats/content/admin REST endpoints
- selective GraphQL read patterns
- repository/service separation
- structured error, logging, and rate-limiting patterns

### Depends on

- stable database objects from Phase 2

## Phase 4 — Frontend

### Goal

Deliver the public and authenticated React/Vite experiences for discovery and premium research.

### Core outputs

- app shell and routing
- public entity pages
- premium dashboard foundations
- shared table/query patterns

### Depends on

- usable backend contracts from Phase 3

## Phase 5 — Editor

### Goal

Enable structured content authoring, review, and publishing workflows.

### Core outputs

- article editor
- draft/review workflow states
- metadata and publishing controls
- stat insertion and structured block composition

### Depends on

- content model from Phase 2
- internal APIs from Phase 3
- foundational UI from Phase 4

## Phase 6 — Templates

### Goal

Create reusable page and article templates for consistent, scalable publishing.

### Core outputs

- template schema and render contracts
- reusable block sets
- programmatic content patterns

### Depends on

- editor workflows from Phase 5

## Phase 7 — SEO

### Goal

Make public content discoverable, indexable, and performant.

### Core outputs

- metadata and canonical rules
- schema.org implementation plan
- internal linking patterns
- programmatic page generation tied to verified data

### Depends on

- stable public page patterns from Phases 4 through 6

## Phase 8 — AI

### Goal

Introduce grounded AI-assisted workflows with auditability.

### Core outputs

- grounding service contracts
- prompt/version logging
- editorial assist review loop
- model-performance and quality controls

### Depends on

- stat-grounding policy
- editor workflows
- audit-capable backend and database layers

## Phase 9 — Hosting

### Goal

Define and harden runtime environments, CI/CD, and production deployment controls.

### Core outputs

- local, staging, and production environment definitions
- secrets management approach
- deployment topology for frontend, backend, database, and worker services
- CI release gates and rollback expectations

### Depends on

- a deployable slice of frontend, backend, and database work

## Phase 10 — Admin

### Goal

Add operational tools for internal management and governance.

### Core outputs

- user and role management
- subscription support tooling
- audit review surfaces
- provider and job health visibility

### Depends on

- auth foundation
- audit logging
- stable internal API contracts

## Phase 11 — Integrations

### Goal

Harden external provider and platform integrations.

### Core outputs

- sports/stat provider ingestion
- odds provider ingestion
- payments and webhook handling
- analytics/search integrations

### Depends on

- internal data contracts
- operational visibility from prior phases

## Phase 12 — Scale

### Goal

Optimize reliability, performance, and cost efficiency.

### Core outputs

- caching and invalidation tuning
- query optimization and materialized-view refinement
- queue/worker throughput improvements
- reliability testing and incident readiness

### Depends on

- production traffic patterns and validated bottlenecks

## Phase X — Business

### Goal

Refine monetization and growth systems after the platform foundation is dependable.

### Core outputs

- pricing and packaging experiments
- affiliate optimization
- retention systems
- expansion decisions guided by product data

### Depends on

- stable product value delivery from prior phases

## MVP Grouping

### MVP Foundation

- Phase 0 Documentation
- Phase 1 Folder Setup
- Phase 2 Database
- Phase 3 Backend auth and core stats/content APIs
- Phase 4 Public frontend shell

### MVP Core Product

- tournament, player, and course pages
- projection views
- member/subscriber access controls
- initial editorial workflows

### MVP Expansion

- reusable templates
- SEO scaling
- AI editorial assist with logging
- admin operations and subscriptions

## Key Dependencies and Risks

### Dependencies

- domain definitions must stabilize before schema sprawl
- auth/RBAC decisions must precede internal tooling
- structured content modeling must precede editor and template scale
- grounding policy must exist before AI-assisted publication

### Risks

- schema drift between stats and content domains
- premium gating implemented in UI but not enforced in APIs
- editorial workflows shipping before structured content contracts are stable
- AI features arriving before provenance and review controls
- deployment complexity growing faster than observability and rollback readiness

## ADR and Decision Log Expectations

- create ADRs for architectural choices that affect multiple subsystems
- ADRs should be added before or alongside implementation, not after widespread adoption
- decisions around schema boundaries, GraphQL scope, caching, provider precedence, AI review, and deployment topology should always be documented

## Environment and Deployment References

- local development should remain reproducible through documented setup steps and containerized dependencies where practical
- staging should mirror production enough to validate auth, provider workflows, and publishing behavior
- production should use managed hosting, enforced HTTPS, and environment-specific secrets

## Exit Criteria for Any Phase

A phase is ready to hand off when:

- scoped outputs exist
- dependencies are satisfied
- validation checks are defined and run
- documentation reflects the current implementation contract
