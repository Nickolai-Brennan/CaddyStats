# Changelog

## 2026-05-15 — Selective Strawberry GraphQL for Editorial, Admin, and Dashboards

- Added:
  - `services/api/app/graphql/types.py` with Strawberry GraphQL types for:
    - Content domain: ArticleType, ArticleBlockType, ArticleListType, AuthorType, TagType, TemplateType
    - Auth domain (admin-gated): UserType, RoleType, PermissionType
    - Billing domain: SubscriptionType, BillingPlanType, EntitlementType
    - AI workflows: AIWorkflowType, AIPromptVersionType, AIOutputLogType
    - Dashboard aggregates: DashboardStatsType, RecentActivityType
    - Input types: ArticleCreateInput, ArticleUpdateInput, ArticleBlockInput, AuthorCreateInput, AuthorUpdateInput, AIWorkflowReviewInput
  - `services/api/app/graphql/queries.py` with Query resolvers for:
    - Article discovery (list with filtering, single by slug)
    - Author metadata (list, single by slug)
    - Tag browsing
    - User self-view (authenticated) and admin user list (admin-gated)
    - Editorial dashboard stats (total articles, drafts, published, AI-assisted, word count, average read time)
    - Recent editorial activity timeline
  - `services/api/app/graphql/mutations.py` with Mutation operations for:
    - Article CRUD (create, update, delete) with nested block editing
    - Author CRUD (create, update)
    - Admin user role assignment
    - AI workflow review (approve/reject editorial output with notes)
  - `services/api/app/graphql/schema.py` combining Query and Mutation into Strawberry schema
  - Dashboard query methods in `services/api/app/repositories/content.py`:
    - `get_dashboard_stats()` for editorial analytics aggregations
    - `get_recent_activity()` for activity timeline
  - Repository classes for content domain: `AuthorRepository`, `TagRepository`, `TemplateRepository`
  - GraphQL ASGI mount in `services/api/app/main.py` at `/graphql` endpoint
- Changed:
  - `services/api/app/main.py` now imports and mounts Strawberry GraphQL schema with debug mode conditional on environment
  - `services/api/app/repositories/content.py` expanded with dashboard stats methods and new repository classes
- Fixed:
  - N/A
- Plugins:
  - N/A
- Commands:
  - N/A
- Notes:
  - GraphQL schema validates RBAC permissions inline at resolver level using existing `require_permission` pattern
  - Selective coverage prioritizes article editing workflows, admin user management, and dashboard queries
  - All GraphQL types and resolvers compile without static errors
  - REST endpoints remain primary data interface; GraphQL provides query-flexible reads for editorial and dashboard consumption

## 2026-05-15 — REST Endpoint Expansion Across Core Domains

- Added:
  - New API routers for missing domains:
    - `services/api/app/api/v1/stats.py`
    - `services/api/app/api/v1/projections.py`
    - `services/api/app/api/v1/betting.py`
    - `services/api/app/api/v1/rankings.py`
    - `services/api/app/api/v1/ai_workflows.py`
    - `services/api/app/api/v1/content.py`
    - `services/api/app/api/v1/billing.py`
    - `services/api/app/api/v1/admin.py`
  - New operational schemas in `services/api/app/schemas/operations.py` for stats overview, AI workflow runs/status, billing objects, and admin responses
  - New service modules:
    - `services/api/app/services/ai.py`
    - `services/api/app/services/billing.py`
    - `services/api/app/services/admin.py`
- Changed:
  - `services/api/app/main.py` now registers all new v1 routers for stats/projections/betting/rankings/ai/content/billing/admin
  - `services/api/app/services/stats.py` expanded with overview, leaderboard, rankings, round history, player projections, and market retrieval methods
  - `services/api/app/repositories/stats.py` expanded with market, leaderboard, ranking, round-history, and player-projection query helpers
  - `services/api/app/services/content.py` and `services/api/app/repositories/content.py` expanded with tag/author/template listing operations
  - `services/api/app/schemas/stats.py` expanded with leaderboard/ranking/round response models
  - `services/api/app/repositories/auth.py` role assignment made idempotent for admin role-management endpoint behavior
- Fixed:
  - Pagination contract consistency (`has_next`) for paginated stats/content responses
- Plugins:
  - N/A
- Commands:
  - N/A
- Notes:
  - Static diagnostics completed on all changed files with no reported errors

## 2026-05-15 — API Security Hardening (JWT, API Keys, RBAC, Rate Limits, Structured Errors)

- Added:
  - `services/api/app/core/errors.py` for sanitized and structured API error envelopes with request metadata
  - `services/api/app/middleware/rate_limit.py` for fixed-window per-client rate limiting with Redis-first and in-memory fallback
- Changed:
  - `services/api/app/main.py` now registers global HTTP/validation/unhandled exception handlers and rate-limit middleware
  - `services/api/app/core/config.py` now includes API key and rate-limit settings (`API_KEY_HEADER_NAME`, `API_KEY_STATIC_KEYS`, `RATE_LIMIT_*`)
  - `services/api/app/dependencies/auth.py` now supports API key principals in addition to JWT bearer auth and unifies RBAC checks across principals
  - `services/api/app/services/auth.py` now persists access token hashes in sessions, rotates refresh sessions safely, updates last-login timestamp, and returns `expires_in` consistently
  - `services/api/app/middleware/request_id.py` now stores request IDs on request scope/state for uniform error response metadata
  - `services/api/app/api/v1/articles.py` permission keys aligned with seeded RBAC permissions (`content.write`, `content.delete`)
- Fixed:
  - token response contract mismatch (`expires_in` vs `expires_at`) in auth token responses
  - article write permission checks referenced non-seeded permission keys
- Plugins:
  - N/A
- Commands:
  - N/A
- Notes:
  - Validation executed with editor diagnostics (`get_errors`) and all changed files returned no static errors

## 2026-05-14 — Multi-database analytics connection setup

- Added:
  - `services/api/app/db/analytics.py` with PostgreSQL, DuckDB, and MotherDuck connection helpers plus pandas DataFrame query helpers for graph-ready analytics workflows
  - `services/api/tests/test_analytics_connections.py` for URL conversion, MotherDuck URL construction, and DuckDB DataFrame helper coverage
- Changed:
  - `services/api/app/core/config.py` now includes `DUCKDB_PATH`, `MOTHERDUCK_TOKEN`, `MOTHERDUCK_DATABASE`, `MOTHERDUCK_URL`, and `PANDAS_QUERY_ROW_LIMIT` settings
  - default connection values now use PostgreSQL `postgres/postgres` with `db_golf` and MotherDuck database `CaddyStats`
  - `services/api/app/db/__init__.py` now exports analytics connection helper functions
  - `services/api/requirements/base.txt` now includes `duckdb`, `pandas`, and `psycopg[binary]`
  - `database/README.md` environment variable table now documents DuckDB/MotherDuck/pandas helper variables
- Fixed:
  - N/A
- Plugins:
  - N/A
- Commands:
  - N/A
- Notes:
  - `make lint` and `make test` baseline initially failed in this environment before edits due missing local Python tools (`ruff`, `pytest`) and were re-run after dependency installation for this change

## 2026-05-14 — Phase 1 bootstrap, CI, and contributor baseline

- Added:
  - `CONTRIBUTING.md` defining the repository contributor workflow and validation expectations
  - `docs/devops/local-development-bootstrap.md`, `docs/devops/environment-and-secrets-strategy.md`, and `docs/devops/platform-baseline.md`
  - `config/environments/` example overlays for local, development, test, staging, and production
  - `scripts/verify/` checks for env validation, docs entrypoints, architecture drift, and Docker validation
  - standard GitHub issue templates, pull request template, `architecture-drift.yml`, and `deploy.yml`
  - shared package foundations for `ui`, `types`, `config`, `utils`, `analytics`, and `seo`
  - top-level responsibility README stubs for repository domain boundaries
- Changed:
  - `Makefile` and `scripts/setup/bootstrap.sh` now expose setup, verify, lint, typecheck, test, and docker validation entrypoints
  - `.env.example`, `README.md`, `docs/README.md`, `docs/governance/NAMING_CONVENTIONS.md`, and `docs/governance/REPOSITORY_STRUCTURE_AND_OWNERSHIP.md` now document the Phase 1 baseline
  - `.github/workflows/ci.yml`, `docs-check.yml`, `dependency-review.yml`, `stack-verify.yml`, and `verify-environment.yml` now align to the current repo structure
  - `docs/planning/Master Task List Consolidated.md` now marks the targeted Phase 1 baseline items complete
- Fixed:
  - moved GitHub issue and PR templates into standard repository locations
  - removed duplicate workflow copies that were causing avoidable drift
  - aligned web Docker validation with a committed nginx config and docker ignore baseline
- Plugins:
  - N/A
- Commands:
  - N/A
- Notes:
  - validation will rely on local dependency installation (`pnpm install` and `python -m pip install -r services/api/requirements/dev.txt`) before running `make lint`, `make typecheck`, `make test`, and `make docker-validate`

## 2026-05-14 — Monorepo structure and ownership lock

- Added:
  - `docs/governance/REPOSITORY_STRUCTURE_AND_OWNERSHIP.md` defining canonical monorepo boundaries, ownership mapping, and root tooling standards
  - `.github/CODEOWNERS` for repository-domain reviewer ownership coverage
  - canonical target-boundary directories: `frontend/`, `backend/`, `api/`, `plugins/`, `commands/`, `automation/`
  - `.githooks/pre-commit` as the standardized repository pre-commit hook entrypoint
- Changed:
  - `pnpm-workspace.yaml` to include canonical target-domain workspace globs in addition to active app/service globs
  - `Makefile` root build configuration to centralize API path variables and add `make hooks`
  - `package.json` root scripts to standardize git hook installation
  - `README.md`, `docs/README.md`, and `.env.example` references to reflect approved boundary model and active-path mapping
  - `docs/governance/ENGINEERING_STANDARDS_AND_GOVERNANCE.md` scope and ownership model to include canonical target domains and automation/plugins/commands
- Fixed:
  - Reduced structure drift between approved canonical domains and active runtime folder layout
- Plugins:
  - Introduced `plugins/` canonical boundary directory
- Commands:
  - Introduced `commands/` canonical boundary directory
- Notes:
  - `make lint` and `make test` continue to fail in this environment due missing local tooling (`ruff`, `pytest`)

## 2026-05-14 — Documentation consolidation and audit

- Added:
  - `docs/README.md` — single-entry documentation map for canonical, planning, and legacy material
  - `docs/governance/DOCUMENTATION_CONSOLIDATION_AUDIT.md` — tracked remaining overlapping docs to trim later
- Changed:
  - moved planning artifacts into `docs/planning/`
  - moved workflow guidance to `docs/workflow.md`
  - moved ADR source files to `docs/governance/adr/records/`
  - expanded thin summary and index docs so they better match the depth of the stronger repository docs
- Fixed:
  - removed contradictory references to `Support/docs/` and top-level `Planning/` as current documentation roots
  - aligned changelog, workflow, ADR, and template references to the consolidated `docs/` tree
- Plugins:
  - N/A
- Commands:
  - N/A
- Notes:
  - `make lint` and `make test` were run before the edit window; they currently fail in this environment because `ruff` and `pytest` are unavailable

## 2026-05-14 — Documentation foundation

- Added: canonical core, product, governance, architecture, and strategy documentation under `docs/`
- Changed: root `README.md` now points to the canonical documentation map instead of acting as a build-system spec
- Fixed: documentation entry points now distinguish canonical `docs/` content from legacy `docs/legacy/support/` source material
- Plugins:
- Commands:
- Notes: `make lint` and `make test` were run before and after the edit window; both currently fail in this environment because `ruff` and `pytest` are unavailable

## 2026-05-14 — Phase 0 Tracker Closure: Provenance, Roadmap, and Compliance Tasks

- Added:
  - N/A (documentation already created in prior session)
- Changed:
  - `docs/planning/Master Task List Consolidated.md` — marked three Phase 0 items complete:
    - Define stat provenance, AI grounding rules, editorial-vs-computed content boundaries, and data retention policy
    - Maintain roadmap, milestones, validation gates, changelog flow, and dependency-aware sequencing
    - Add compliance and disclosure documentation including privacy, terms, affiliate disclosure, retention, and related operational policy docs
- Fixed:
  - Closed tracker gap where Phase 0 documentation tasks were complete in docs but still shown as unchecked in the master task list
- Plugins:
  - N/A
- Commands:
  - N/A
- Notes:
  - All three tasks were satisfied by documents created on 2026-05-13:
    - `docs/data/stat-grounding-policy.md`
    - `docs/roadmap/build-phases.md`
    - `docs/compliance/` (privacy-policy, terms-of-use, affiliate-disclosure, data-retention-policy, operational-compliance-policy, README)

## 2026-05-13 — Provenance, Compliance, and Roadmap Governance Expansion

- Added:
  - `docs/compliance/privacy-policy.md`
  - `docs/compliance/terms-of-use.md`
  - `docs/compliance/affiliate-disclosure.md`
  - `docs/compliance/data-retention-policy.md`
  - `docs/compliance/operational-compliance-policy.md`
  - `docs/compliance/README.md`
- Changed:
  - `docs/data/stat-grounding-policy.md` expanded with stricter provenance field expectations, explicit AI grounding states, and retention-policy alignment
  - `docs/roadmap/build-phases.md` expanded with milestone framework, validation-gate model, changelog flow, and dependency-aware sequencing rules
- Fixed:
  - Closed policy documentation gaps around retention governance, compliance disclosures, and roadmap validation flow
- Plugins:
  - N/A
- Commands:
  - N/A
- Notes:
  - Documentation-only update to strengthen governance before downstream implementation phases

## 2026-05-13 — Security Standards Documentation Expansion

- Added:
  - `docs/security/auth-rbac.md` expanded into a broader security standards reference covering authentication, authorization, RBAC, secrets handling, logging/redaction requirements, security governance, and incident expectations
- Changed:
  - Consolidated previously partial auth/RBAC guidance into a more complete Phase 0 policy document aligned with runtime config, database RBAC/RLS assumptions, and structured logging expectations
- Fixed:
  - Filled the documentation gap for authentication, RBAC, secrets handling, security governance, and logging/redaction standards called out in the consolidated master task list
- Plugins:
  - N/A
- Commands:
  - N/A
- Notes:
  - This update is documentation-only and establishes the canonical baseline security policy pending future implementation ADRs and operational runbooks

## 2026-05-13 — ADR Governance and System Blueprint

- Added:
  - `docs/governance/adr/README.md` — formal ADR governance document covering the ADR template, numbering convention, status lifecycle, review process, mandatory triggers and a navigable ADR index
  - `docs/architecture/system-blueprint.md` — detailed system blueprint covering service boundaries, API strategy, schema separation, analytics pipeline architecture, caching and CDN topology, observability, workers, and AI injection architecture
- Changed:
  - N/A
- Fixed:
  - N/A
- Plugins:
  - N/A
- Commands:
  - N/A
- Notes:
  - The ADR README formalizes the process described informally in engineering-standards-and-governance.md section 4.4 and provides a single navigable index of all accepted ADRs
  - The system blueprint consolidates decisions from ADR-001 through ADR-010 into one comprehensive architectural reference; the existing system-overview.md remains the entry-level introduction

## 2026-05-13 — Engineering Standards and Governance

- Added:
  - `docs/governance/ENGINEERING_STANDARDS_AND_GOVERNANCE.md` defining repository-wide engineering standards, documentation ownership, release governance, migration governance, naming conventions, branching strategy, commit standards, code review expectations, and production readiness controls
- Changed:
  - Governance coverage now formalizes architecture-first delivery controls, documentation update requirements, ADR triggers, release readiness expectations, and production approval checkpoints
- Fixed:
  - N/A
- Plugins:
  - N/A
- Commands:
  - N/A
- Notes:
  - This update establishes the baseline repository governance policy for engineering execution, review, and release management

## 2026-05-13 — Consolidated Master Task List

- Added:
  - `docs/planning/Master Task List Consolidated.md` with unified cross-phase matrix, missing-task priorities, and phase-sourced additions from `docs/planning/Master Task List Phase 0.md` through `docs/planning/Master Task List Phase X.md`
- Changed:
  - Consolidated planning now includes phase-derived implementation scope callouts to complement the master matrix
- Fixed:
  - N/A
- Plugins:
  - N/A
- Commands:
  - N/A
- Notes:
  - This pass focused on planning artifact consolidation and scope completeness; no application runtime code changed

## 2026-05-13 — Stage 1: Repository & Infrastructure Bootstrap

- Added:
  - Monorepo root folder scaffold (apps/, services/, packages/, workers/, database/, infrastructure/, ai/, docs/, scripts/, tests/, config/)
  - `pnpm-workspace.yaml` — pnpm monorepo workspace configuration
  - `turbo.json` — TurboRepo pipeline configuration (build, dev, lint, typecheck, test)
  - `package.json` — root workspace package with turbo + prettier + typescript
  - `tsconfig.base.json` — shared TypeScript base config
  - `.prettierrc` — shared formatting config
  - `.env.example` — complete environment variable template with all required variables
  - `.gitignore` — comprehensive root gitignore
  - `docker-compose.yml` — full dev stack (postgres, redis, api, web, nginx)
  - `docker-compose.test.yml` — isolated test stack
  - `services/api/Dockerfile` — multi-stage FastAPI Dockerfile (dev + prod)
  - `apps/web/Dockerfile` — multi-stage React/Vite Dockerfile (dev + prod)
  - `infrastructure/nginx/nginx.conf` + `conf.d/default.conf` — reverse proxy config
  - `services/api/` — FastAPI app bootstrap (main.py, config, logging, health endpoints, request ID middleware)
  - `services/api/requirements/` — base, prod, dev requirements
  - `services/api/pyproject.toml` — ruff, mypy, pytest configuration
  - `apps/web/` — React/Vite/TypeScript/Tailwind app scaffold
  - `.github/workflows/ci.yml` — full CI pipeline (lint, typecheck, test, docker build, CI gate)
  - `.github/workflows/dependency-review.yml` — daily dependency audit
  - `.github/workflows/code-cleanup.yml` — weekly formatting/lint sweep
  - `.github/templates/pull_request_template.md` — PR template
  - `.github/templates/issue-template/` — bug and feature request templates
  - `Makefile` — local dev commands (dev, test, lint, format, db-migrate, db-shell, etc.)
  - `scripts/setup/bootstrap.sh` — local environment bootstrap script
- Changed:
  - Repository structure transitioned from documentation-only to active monorepo implementation
- Fixed:
  - N/A
- Plugins:
  - N/A
- Commands:
  - N/A
- Notes:
  - Stage 1 complete. Validation gate: local stack can boot with `make dev`. CI pipeline operational on push/PR.

## 2026-05-13 — Database Foundation

- Added:
  - Alembic configuration under `services/api/alembic*` with an initial baseline migration for core schemas, tables, indexes, triggers, RLS scaffolding, and materialized views
  - SQLAlchemy database scaffolding under `services/api/app/db/`
  - Seed framework at `services/api/scripts/database/seed.py` with sample auth, content, stats, analytics, and betting records
  - Database validation coverage in `services/api/tests/test_database_foundation.py`
  - Bootstrap SQL in `database/schemas/001-bootstrap.sql`
- Changed:
  - `services/api/app/core/config.py` defaults now avoid hardcoded secret literals while keeping local development safe
  - `App Build/database/README.md` now documents the active database foundation
- Fixed:
  - Existing API lint issues in `services/api/app/main.py`
- Plugins:
  - N/A
- Commands:
  - `make db-migrate`
  - `make db-seed`
- Notes:
  - Validation gate now covers migration upgrade/downgrade, index presence, materialized views, and seed-data loading against PostgreSQL

## 2026-05-12 — Master Task List Audit

- Added:
  - Additional required task coverage across `docs/planning/Master Task List Phase 0.md` through `docs/planning/Master Task List Phase 12.md` and `docs/planning/Master Task List Phase X.md`
- Changed:
  - Standardized markdown structure in the phase master task lists with consistent headings and checklist-style task blocks
- Fixed:
  - Filled cross-phase planning gaps around governance, observability, compliance, validation, monetization, and recovery planning
- Plugins:
  - N/A
- Commands:
  - N/A
- Notes:
  - This pass focused on documentation quality and planning completeness; no application code or build tooling changed

## 2026-05-12 — Documentation Foundation

- Added:
  - Initial product requirements documentation in `docs/legacy/support/00-root/product-requirements-doc.md`
  - Product strategy documents under `docs/legacy/support/01-product/`
  - Core ADR set under `docs/governance/adr/records/`
  - Build and implementation planning docs (`build-system.md`, `caddy-stats-building-plan.md`)
- Changed:
  - Established build-order-first project direction across docs
- Fixed:
  - N/A
- Plugins:
  - N/A
- Commands:
  - N/A
- Notes:
  - Repository entered architecture-first documentation phase

## 2026-05-12 — Documentation Expansion Pass

- Added:
  - New foundational docs for project overview, vision/goals, and roadmap:
    - `docs/legacy/support/00-root/project-overview.md`
    - `docs/legacy/support/00-root/vision-and-goals.md`
    - `docs/legacy/support/00-root/roadmap.md`
  - Full workflow guidance in `docs/workflow.md`
- Changed:
  - Expanded root `README.md` with project summary and documentation index
  - Standardized documentation navigation references across root docs
- Fixed:
  - Filled previously empty or placeholder documentation files
- Plugins:
  - N/A
- Commands:
  - N/A
- Notes:
  - Documentation coverage now includes core strategic, operational, and roadmap context
