# System Overview

## Purpose

This document describes the high-level platform architecture for Caddy Stats. It is implementation-guiding rather than exhaustive and should be used to anchor future database, API, UI, and deployment work.

## Platform Summary

Caddy Stats is a data-first platform composed of:

- a **React + Vite frontend** for public, member, subscriber, and internal experiences
- a **FastAPI backend** for stats, content, auth, subscriptions, operational APIs, and selected GraphQL queries
- **PostgreSQL** as the source of truth for structured stats, content, identity, entitlements, and audit records
- an **AI grounding and review layer** for editorial assistance and model-analysis workflows
- **admin and internal tooling** for publishing, operations, permissions, and audit review
- **external integrations** for sports data, odds, payments, analytics, and search visibility

## Architecture Goals

- keep statistics and editorial systems grounded in verified data
- separate user-facing experiences from internal operational workflows
- preserve clear boundaries between content, stats, auth, and audit concerns
- support SEO-heavy public traffic and premium authenticated usage
- make AI-assisted workflows auditable and reviewable

## Major Subsystems

## 1. Frontend Experience Layer

Primary responsibility: render public pages, premium research surfaces, and internal dashboards.

Key responsibilities:

- public SEO pages for players, tournaments, courses, rankings, and articles
- authenticated member and subscriber experiences
- admin/editor/analyst interfaces
- client-side routing, query orchestration, and analytics tables
- metadata, canonical, and structured-data rendering

Expected implementation shape:

- public web app in React/Vite
- internal admin/editor surfaces may be separate frontend apps or protected route groups

## 2. API and Application Layer

Primary responsibility: enforce contracts, permissions, and orchestration.

Key responsibilities:

- REST endpoints for stats, auth, subscriptions, admin actions, health checks, and integrations
- selective GraphQL queries for nested editorial and dashboard use cases
- request validation and structured error handling
- rate limiting and access enforcement
- composition of repository, service, and AI-grounding logic

## 3. Data Persistence Layer

Primary responsibility: act as the platform source of truth.

Key responsibilities:

- store normalized golf stats and provider references
- store editorial content, templates, tags, and publishing metadata
- store users, roles, permissions, subscriptions, and entitlements
- store audit records for model runs, AI outputs, admin actions, and editorial reviews
- support read-heavy analytics through indexes and materialized views

Logical schema boundaries:

- `stats` for sports data, markets, projections, and model-performance data
- `content` for articles, versions, blocks, templates, metadata, and publishing structures
- identity, billing, and audit tables may live in dedicated schemas or clearly separated table groups

## 4. AI and Model Layer

Primary responsibility: assist generation and analysis without overriding verified data.

Key responsibilities:

- prepare grounded input contexts for prompts
- enforce provenance checks before AI-assisted output is shown or published
- log prompt version, model version, source references, reviewer state, and final disposition
- support model-performance review and comparison

## 5. Integration Layer

Primary responsibility: ingest and synchronize external signals.

Key responsibilities:

- sports/stat provider ingestion
- odds and market ingestion
- payment and subscription events
- analytics and search-console integrations
- outbound publishing or notification hooks where needed

## 6. Operations and Governance Layer

Primary responsibility: keep the platform secure, observable, and operable.

Key responsibilities:

- RBAC and session enforcement
- audit/event review
- provider health and job monitoring
- content review workflows
- deployment promotion and environment controls

## Request and Data Flows

## Public Content Flow

1. Provider and internal data pipelines write normalized stats and content records to PostgreSQL.
2. FastAPI reads current published content plus verified supporting stats.
3. Frontend renders SEO-ready pages with metadata and structured content blocks.
4. CDN and application caching serve repeated public traffic safely.

## Premium Analytics Flow

1. Authenticated user requests projections, research tables, or premium dashboards.
2. Backend validates JWT, role, and entitlement status.
3. Services read projections, model summaries, and related stats from PostgreSQL or materialized views.
4. Frontend renders gated analytics with explanation and freshness metadata.

## Editorial Workflow Flow

1. Editor opens a draft or template in an internal tool.
2. Backend loads content blocks, source stats, and AI grounding context.
3. AI assistance may generate draft text or summaries using grounded inputs only.
4. Output, source references, prompt/model versions, and review actions are logged.
5. Approved content is published and invalidates relevant caches.

## Provider Ingestion Flow

1. Scheduled jobs or workers fetch provider data.
2. Normalization pipelines validate provider payloads and map them to canonical entities.
3. Conflict and freshness rules determine whether data is accepted, flagged, or withheld.
4. Derived tables and materialized views are refreshed for read-heavy experiences.

## Deployment and Environment Overview

## Environments

- **local** for developer setup and integration work
- **staging** for pre-production validation with production-like services
- **production** for public traffic and live subscriptions

## Expected deployment shape

- frontend hosted on a CDN-backed platform such as Vercel
- backend hosted on Render, Railway, Fly.io, or equivalent
- PostgreSQL hosted on Neon, Supabase, or equivalent managed service
- Redis or equivalent cache/queue support where needed
- Docker for local and CI consistency
- GitHub Actions for deterministic validation and deployment gates

## Cross-Cutting Concerns

## Authentication and Authorization

- JWT-based authentication for authenticated experiences
- explicit role and entitlement checks on backend routes and GraphQL resolvers
- internal tools protected separately from public routes

## Observability

- structured logs with request correlation
- metrics for API latency, ingestion health, job failures, and cache performance
- audit events for content, AI, billing, and admin changes

## Security

- secrets stored in environment management, never in source control
- redaction rules for logs, prompts, and provider payloads where sensitive
- rate limits on auth, expensive analytics, and AI-assisted endpoints
- no GraphQL playground in production

## SEO

- canonical URLs, metadata, and structured data are part of page contracts
- public pages should remain indexable and backed by real entities and content
- programmatic pages must be tied to verified data, not invented filler

## AI Auditability

- every AI-assisted output must retain source references or a failure state
- prompt and model versions must be persisted
- human review is required for sensitive betting or projection narratives
- AI output cannot silently replace verified stats or editorial approval

## Implementation Notes

- treat this document as the logical architecture even if repository folders evolve during implementation
- future ADRs should refine subsystem boundaries, especially around GraphQL scope, caching, ingestion, and AI review workflows
