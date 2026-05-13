# System Blueprint

Version: 1.0
Status: Active
Last Updated: 2026-05-13

## Purpose

This document is the authoritative engineering reference for the Caddy Stats platform architecture. It describes service boundaries, API strategy, schema separation, analytics pipeline, caching and CDN topology, observability model, worker architecture, and AI injection architecture.

The system overview at `docs/architecture/system-overview.md` describes the *what*. This blueprint describes the *how* — the structural decisions, integration contracts, and operational constraints that govern each layer.

---

## 1. Service Boundaries

The platform is divided into the following runtime service domains. Each domain owns its own logic boundary and may not access another domain's persistence layer directly.

### 1.1 Public Web Application

- **Technology:** React + Vite + TypeScript + Tailwind CSS
- **Responsibility:** render all public-facing and authenticated user experiences
- **Folder:** `apps/web/` or `frontend/`
- **Consumes:** REST and GraphQL APIs from the API layer; no direct database access
- **Boundary rules:**
  - Must not contain business logic
  - Must consume stable API contracts
  - SEO and metadata must be part of page output contracts

### 1.2 API Service

- **Technology:** FastAPI (Python), Strawberry GraphQL, Pydantic
- **Responsibility:** enforce contracts, permissions, orchestration, and composition
- **Folder:** `services/api/` or `backend/`
- **Boundary rules:**
  - Routes parse and respond only; business logic lives in services
  - All protected routes require explicit auth and role checks
  - Rate limiting is enforced for auth, AI-assisted, and expensive analytics endpoints
  - GraphQL playground is disabled in production

### 1.3 Worker Service

- **Technology:** Python workers (domain-queued)
- **Responsibility:** execute all asynchronous and scheduled workloads outside request paths
- **Folder:** `workers/` or `backend/app/workers/`
- **Boundary rules:**
  - Workers call service and repository layers; no direct route or request coupling
  - All jobs must be idempotent
  - Retry policies use bounded exponential backoff

### 1.4 Database Layer

- **Technology:** PostgreSQL (managed: Neon, Supabase, or equivalent)
- **Responsibility:** serve as the single source of truth for all canonical data
- **Folder:** `database/` (migrations, seeds, schemas)
- **Boundary rules:**
  - All schema changes through Alembic migrations
  - Direct production DDL is prohibited without emergency procedure
  - No application logic inside PostgreSQL functions unless documented and reviewed

### 1.5 Infrastructure and Reverse Proxy

- **Technology:** Nginx, Docker, GitHub Actions
- **Responsibility:** local and CI environment consistency; production deployment topology
- **Folder:** `infrastructure/`

---

## 2. API Strategy

Caddy Stats uses a dual API model. The boundary between REST and GraphQL is fixed by scope, not convenience.

### 2.1 REST

REST is used for:

- stats endpoints (players, tournaments, courses, projections, markets)
- authentication and session management
- subscription and entitlement operations
- admin actions
- health checks and internal monitoring
- webhook receivers
- cache invalidation triggers

REST route design rules:

- Use resource-oriented paths
- Return structured error objects with status codes and error codes
- Validate all inputs with Pydantic schemas
- Avoid leaking internal DB structure in response shapes

### 2.2 GraphQL

Strawberry GraphQL is used for:

- flexible editorial content composition (admin/editor dashboards)
- nested content and data retrieval where query flexibility has real value

GraphQL rules:

- Disable playground in production
- Require explicit auth checks at all resolver boundaries
- Apply query complexity and depth limits
- Avoid business logic inside resolvers; resolvers call services
- Log operation names and latency

### 2.3 Versioning Policy

- REST endpoints must not break existing consumers without a versioned path
- GraphQL types evolve additively; breaking type changes require a review and notice period
- Internal contracts between services may evolve with coordinated deployment

---

## 3. Schema Separation

PostgreSQL is partitioned into named schemas with strict ownership boundaries.

### 3.1 Schema Definitions

| Schema | Responsibility |
|---|---|
| `stats` | golfers, tournaments, courses, rounds, tournament entries, markets, market selections, projections, model runs, model metrics |
| `content` | articles, article versions, article blocks, templates, tags, authors, publishing metadata |
| `auth` | users, roles, permissions, role assignments |
| `billing` | subscriptions, entitlements, billing events, invoice records |
| `audit` | AI output logs, editorial review logs, operational audit events |

### 3.2 Cross-Schema Rules

- Cross-schema joins are permitted in read queries but must be indexed
- Write operations must respect schema ownership — a content service does not write to `stats`
- Materialized views may aggregate across schemas but are owned by the primary read domain
- Foreign key references across schemas are allowed where enforced and indexed

### 3.3 Migration Rules

- All schema changes via Alembic migrations
- Prefer expand/contract pattern for high-risk changes
- Migration files include backward-compatibility risk notes
- See `Support/docs/00-root/engineering-standards-and-governance.md` section 6 for full migration governance

---

## 4. Analytics Pipeline Architecture

The analytics pipeline converts raw provider data into queryable, display-ready analytics surfaces.

### 4.1 Pipeline Stages

```
Provider / External Source
        ↓
  Ingestion Worker (normalize, validate, conflict-check)
        ↓
  PostgreSQL stats schema (canonical tables)
        ↓
  Projection Service (model runs, stat calculations)
        ↓
  PostgreSQL stats schema (projection, model run tables)
        ↓
  Materialized View Refresh Worker
        ↓
  PostgreSQL materialized views (mv_projection_leaderboard, mv_player_form, etc.)
        ↓
  API reads (low-latency analytics endpoints)
        ↓
  Frontend analytics tables and dashboards
```

### 4.2 Ingestion Rules

- Workers validate provider payloads before any write
- Conflicting or stale data is flagged, not silently overwritten
- Source timestamps and provider IDs are preserved alongside canonical records
- Normalization failures are logged and surfaced in worker metrics

### 4.3 Projection Pipeline Rules

- Projections always reference a `ModelRun` record
- Projection inputs and outputs are immutable for a given model run
- New model runs generate new projection records; they do not overwrite history
- Model performance metrics are versioned alongside model runs

### 4.4 Materialized View Refresh Policy

- Scheduled refresh for predictable windows: pre-tournament and cadence-based updates
- Event-triggered refresh for critical upstream changes
- Concurrent refresh used where query availability must be maintained
- View definitions are versioned through migrations
- Refresh latency and failure rates are tracked in observability layer
- Freshness timestamps are exposed in API responses where users depend on data recency

---

## 5. Caching and CDN Architecture

### 5.1 Cache Layers

| Layer | Technology | Scope |
|---|---|---|
| Application cache | Redis or equivalent | API response cache, session store, queue broker |
| Edge cache | CDN (Vercel, Cloudflare, or equivalent) | Public HTML pages and public REST responses |
| Database cache | PostgreSQL materialized views | High-read analytics surfaces |

### 5.2 Caching Policy by Surface

| Surface | Cache Type | TTL Strategy |
|---|---|---|
| Static assets (JS, CSS, images) | Edge (CDN) | Long TTL with content-hash immutability |
| Public player/tournament/course pages | Edge (CDN) | Short-to-medium TTL, stale-while-revalidate |
| Public editorial articles | Edge (CDN) | Short-to-medium TTL, purge on publish |
| Public REST APIs (non-authenticated) | Edge + application cache | Short TTL, stale-while-revalidate |
| Premium authenticated APIs | Application cache only | No shared edge caching |
| Admin and internal APIs | No caching | Always fresh |

### 5.3 Invalidation Strategy

- Purge by entity key (tournament, player, article slug) on data or content updates
- Publish and projection refresh pipelines emit purge events automatically
- Emergency cache-bypass controls available for incident response
- Cache hit rate and stale response events are tracked in observability layer

### 5.4 Cache Safety Rules

- Authenticated or role-gated responses must never be cached at the edge
- Subscription or entitlement checks may not be bypassed by cached responses
- AI-generated outputs are not served from edge cache

---

## 6. Observability Architecture

All runtime components emit structured telemetry. The observability model follows ADR-007.

### 6.1 Telemetry Layers

| Layer | Signal Type | Examples |
|---|---|---|
| API service | Logs, Metrics, Traces | request count, latency, error count, auth failures |
| Worker service | Logs, Metrics | queue depth, job duration, retry count, dead-letter count |
| Database | Slow query logs, connection metrics | query latency, connection pool usage |
| Cache layer | Metrics | hit rate, eviction rate, miss count |
| AI workflows | Logs, Audit records | grounding status, review state, output disposition |
| Ingestion | Metrics, Logs | provider health, normalization failures, batch durations |

### 6.2 Structured Log Format

All logs must include:

- `timestamp` (ISO 8601)
- `level` (info, warn, error)
- `service` (api, worker-ingest, worker-projection, etc.)
- `correlation_id` (injected at API edge, propagated through async context)
- `message`
- Relevant domain context (player_id, tournament_id, article_id, job_id, etc.)

Secrets, tokens, and PII must never appear in logs.

### 6.3 SLO Targets

| Surface | Target |
|---|---|
| Core public API endpoints | p99 < 300ms |
| Premium analytics endpoints | p99 < 500ms |
| Materialized view freshness | ≤ configured refresh cadence |
| Ingestion pipeline success rate | ≥ 99% |
| Worker dead-letter rate | alert threshold per domain queue |

### 6.4 Alerting Policy

- Alert on error budget burn relative to defined SLOs
- Alert on critical queue lag in worker domains
- Alert on ingestion failure spikes
- Alert on AI output error rate or human review queue growth

---

## 7. Worker Architecture

All asynchronous and scheduled workloads run in dedicated worker processes, separated by domain queue. This follows ADR-005.

### 7.1 Domain Queues

| Queue | Workloads |
|---|---|
| `ingest` | provider data fetching, normalization, conflict resolution |
| `projections` | model run triggers, projection computation, model metric capture |
| `editorial-ai` | AI assist generation, review queue processing, output logging |
| `indexing` | search index sync, reindex jobs, index health checks |
| `maintenance` | materialized view refresh, cache warming, analytics backfills |

### 7.2 Worker Execution Rules

- API routes enqueue tasks and return immediately
- Workers execute idempotent handlers with deterministic job keys
- Retries use bounded exponential backoff with explicit limits
- Dead-letter handling is explicit per queue — not silently dropped
- Job status, duration, and error metadata are observable

### 7.3 Worker Entry Points

```
backend/app/workers/
  ingest/
  projections/
  editorial_ai/
  indexing/
  maintenance/
```

### 7.4 Job Design Rules

- Jobs call service and repository layers only; no direct request logic
- Critical workflows include manual replay tooling for operational recovery
- Jobs must be safe to re-run after failure (idempotent writes, deduplication by job key)

---

## 8. AI Injection Architecture

The AI layer assists editorial workflows and analysis without replacing verified data. This follows ADR-006.

### 8.1 Architecture Overview

```
User / Editor Request
        ↓
  API Route (editorial-ai endpoints)
        ↓
  Grounding Service
    - load verified stats context (from database)
    - load source article structure (if applicable)
    - attach prompt version and model version metadata
        ↓
  AI Provider Call (versioned prompt template + grounded context)
        ↓
  Output Validation Layer
    - check for unsupported betting guarantees
    - check for non-provided statistics
    - validate output structure
        ↓
  AIOutputLog record created
    (prompt version, model version, grounding status, source refs, output status)
        ↓
  Human Review Gate (required for betting / projection recommendations)
        ↓
  Approved output available for editorial use
```

### 8.2 Grounding Rules

- Only verified structured inputs may be injected into high-trust workflows
- Source references (player IDs, projection IDs, article IDs) must be attached to every AI context
- AI-generated narrative is distinguished from verified facts in output structures
- Prompt templates are versioned and referenced by workflow ID

### 8.3 Safety Controls

- Block unsupported betting guarantee language in output validation
- Reject outputs that introduce non-provided statistics or odds
- Preserve full audit traces for editorial compliance review
- AI-generated content is flagged and not auto-published without human review

### 8.4 AI Service Folders

```
backend/app/services/ai/         — provider clients, generation orchestration
backend/app/services/grounding/  — context preparation and validation
prompts/                         — versioned prompt templates
evals/                           — evaluation sets for output quality
```

### 8.5 AI Observability Requirements

Every AI workflow must log:

- `prompt_version`
- `model_id`
- `grounding_status` (verified / partial / failed)
- `source_references` (list of entity IDs used in context)
- `output_status` (approved / flagged / rejected)
- `reviewer_state` (pending / approved / rejected)
- `created_by` (user ID)

---

## 9. Deployment Topology

### 9.1 Environment Structure

| Environment | Purpose |
|---|---|
| `local` | Developer setup and integration work (Docker Compose) |
| `staging` | Pre-production validation with production-like services |
| `production` | Live public traffic and active subscriptions |

### 9.2 Service Hosting Targets

| Component | Hosting |
|---|---|
| Frontend (React/Vite) | Vercel or equivalent CDN-backed host |
| API service (FastAPI) | Render, Railway, Fly.io, or equivalent |
| Worker service | Same host as API or dedicated worker tier |
| PostgreSQL | Neon, Supabase, or equivalent managed service |
| Redis / cache / queue | Managed Redis or equivalent |
| CI/CD | GitHub Actions |

### 9.3 Deployment Rules

- Frontend and API deployments are independent with coordinated API version gates
- Database migrations run before application deployment in a migration-first gate
- Staging must pass smoke tests before production promotion for high-risk changes
- Rollback paths must be defined before any production deployment

---

## 10. Cross-Cutting Concerns Summary

| Concern | Governing Document |
|---|---|
| Service boundaries | This document, ADR-001 |
| API strategy | This document, ADR-002 |
| Schema separation | This document, ADR-003 |
| Materialized views | ADR-004 |
| Worker orchestration | ADR-005 |
| AI grounding and safety | ADR-006 |
| Observability | ADR-007 |
| Edge caching and CDN | ADR-008 |
| Search indexing | ADR-009 |
| Editorial rendering | ADR-010 |
| Engineering governance | `Support/docs/00-root/engineering-standards-and-governance.md` |
| Domain model | `docs/architecture/domain-model.md` |
| ADR process | `Support/docs/architectural-decision-records/README.md` |

---

## Implementation Notes

- This document reflects the logical architecture and is the reference point for all future ADRs.
- When a subsystem decision changes materially, a new ADR must be filed and this blueprint updated to reference it.
- The system overview (`docs/architecture/system-overview.md`) remains the entry-level introduction; this blueprint is the detailed engineering reference.
