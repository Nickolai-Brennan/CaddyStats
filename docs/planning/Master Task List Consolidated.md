# Consolidated Master Task List

## Purpose

Provide a single master planning artifact that combines:

1. The cross-phase consolidated roadmap task matrix
2. Missing-but-critical tasks identified in planning review
3. Additional tasks sourced directly from `docs/planning/Master Task List Phase 0.md` through `docs/planning/Master Task List Phase 12.md`

---

## A. Consolidated Cross-Phase Task Matrix

| ID | Phase | Category | Task | Attached agent/skill |
|---|---|---|---|---|
| 0.1 | 0 Documentation | Product | Finalize vision, personas, monetization, subscription tiers | project-startup-agent |
| 0.2 | 0 Documentation | Governance | Define engineering standards, branching, review, release policy | documentation-agent |
| 0.3 | 0 Documentation | Architecture | Formalize ADR system and seed foundational ADRs | documentation-generator |
| 0.4 | 0 Documentation | Architecture | Publish system blueprint, service map, data flow, cache/worker strategy | system-architect-agent |
| 0.5 | 0 Documentation | Security | Document auth, RBAC, secrets handling, logging/redaction | documentation-agent |
| 0.6 | 0 Documentation | Data governance | Define stat provenance, AI grounding, editorial-vs-computed rules | documentation-agent |
| 0.7 | 0 Documentation | Delivery | Maintain roadmap, milestones, validation gates, changelog flow | project-planner |
| 0.8 | 0 Documentation | Missing: compliance | Add privacy, terms, affiliate disclosure, data retention requirements | documentation-agent |
| 1.1 | 1 Folder Setup | Repository structure | Lock canonical monorepo structure and ownership boundaries | project-startup-agent |
| 1.2 | 1 Folder Setup | Configuration | Standardize root configs, env templates, workspace tooling | stack-verifier-agent |
| 1.3 | 1 Folder Setup | DX | Add setup/bootstrap, lint/test entrypoints, contributor workflow | stack-verifier |
| 1.4 | 1 Folder Setup | CI | Establish baseline PR checks and deterministic automation | workflow-builder-agent |
| 1.5 | 1 Folder Setup | Missing: design system foundation | Define shared UI package and naming/token conventions | frontend-agent |
| 2.1 | 2 Database | Schema | Build `stats` schema: players, tournaments, rounds, courses, odds, projections | database-agent |
| 2.2 | 2 Database | Schema | Build `content` schema: articles, blocks, templates, metadata, slugs | database-designer |
| 2.3 | 2 Database | Auth/Billing | Build users, roles, permissions, subscriptions, entitlements | database-agent |
| 2.4 | 2 Database | Audit | Add AI output logs, editorial review logs, model execution logs | database-agent |
| 2.5 | 2 Database | Performance | Add indexes, partitions, materialized views, query standards | database-designer |
| 2.6 | 2 Database | Operations | Baseline migrations, seeds, rollback validation, backup strategy | database-agent |
| 2.7 | 2 Database | Missing: disaster recovery | Document restore testing and backup verification cadence | deployment-planner |
| 3.1 | 3 Backend | Core backend | Bootstrap FastAPI app, settings, DI, logging, errors | backend-agent |
| 3.2 | 3 Backend | Security | Implement JWT, RBAC, rate limiting, sanitized responses | backend-builder |
| 3.3 | 3 Backend | REST API | Build stats, tournaments, courses, projections, content, admin endpoints | api-agent |
| 3.4 | 3 Backend | GraphQL | Add selective Strawberry GraphQL for dashboards/editorial composition | api-designer |
| 3.5 | 3 Backend | Services | Implement business logic in services and DB access in repositories | backend-agent |
| 3.6 | 3 Backend | Observability | Health checks, structured logs, tracing, error reporting | backend-agent |
| 3.7 | 3 Backend | Missing: background job contracts | Define worker APIs, retry rules, idempotency, queue contracts | workflow-builder-agent |
| 4.1 | 4 Frontend | App shell | Set up routing, layouts, auth/session plumbing, query client | frontend-builder |
| 4.2 | 4 Frontend | Public pages | Build home, player, tournament, course, rankings, article pages | frontend-agent |
| 4.3 | 4 Frontend | Analytics UI | Build tables, filters, dashboards, premium research views | frontend-builder |
| 4.4 | 4 Frontend | Shared UI | Create reusable primitives, charts, tables, forms, empty/loading states | frontend-agent |
| 4.5 | 4 Frontend | Accessibility | Ensure semantic HTML, keyboard flow, labels, focus states | frontend-agent |
| 4.6 | 4 Frontend | Missing: error/performance UX | Add error boundaries, skeletons, latency and caching UX patterns | frontend-builder |
| 5.1 | 5 Editor | CMS | Build editor UI, structured blocks, save/preview/publish workflow | frontend-agent |
| 5.2 | 5 Editor | Roles | Add author/editor/admin review states and approval flow | backend-agent |
| 5.3 | 5 Editor | Safety | Sanitize content, preserve metadata, log editorial actions | backend-builder |
| 5.4 | 5 Editor | Missing: content operations | Add content calendar, assignment workflow, revision compare/restore | workflow-builder-agent |
| 6.1 | 6 Templates | Content templates | Define reusable article and page templates backed by data | documentation-generator |
| 6.2 | 6 Templates | Programmatic pages | Create player/course/tournament template systems | frontend-builder |
| 6.3 | 6 Templates | Metadata | Standardize schema fields, internal linking blocks, affiliate placements | plugin-agent |
| 6.4 | 6 Templates | Missing: template governance | Version templates and approval rules for editorial changes | documentation-agent |
| 7.1 | 7 SEO | Metadata | Titles, descriptions, canonicals, OG, Schema.org | seo-agent / plugin-agent |
| 7.2 | 7 SEO | Programmatic SEO | Build indexable data-backed landing pages | frontend-agent |
| 7.3 | 7 SEO | Performance | Rendering/cache strategy for crawlability and speed | deployment-planner |
| 7.4 | 7 SEO | Internal linking | Related players/events/articles modules | seo-engine / plugin-agent |
| 7.5 | 7 SEO | Missing: search console workflow | Add sitemap, indexing, SEO monitoring and regression checks | workflow-builder-agent |
| 8.1 | 8 AI | Grounding | Implement prompt injection + stats grounding layer | backend-agent |
| 8.2 | 8 AI | Editorial assist | Drafting, summarization, QA assist with review visibility | ai-editorial / plugin-agent |
| 8.3 | 8 AI | Governance | Prompt versioning, AI logs, reviewer controls | documentation-agent |
| 8.4 | 8 AI | Evaluation | Grounding tests, hallucination checks, model-performance review | eval-runner |
| 8.5 | 8 AI | Missing: prompt security | Add prompt-injection abuse cases and red-team evals | testing-agent |
| 9.1 | 9 Hosting | Infra | Finalize Docker, environment topology, secrets strategy | deployment-agent |
| 9.2 | 9 Hosting | CI/CD | PR CI, contract checks, deploy workflows, rollback path | deployment-planner |
| 9.3 | 9 Hosting | Runtime | Frontend hosting, API hosting, DB connectivity, CDN/SSL | deployment-agent |
| 9.4 | 9 Hosting | Missing: incident readiness | Add runbooks, on-call basics, outage recovery checklist | documentation-agent |
| 10.1 | 10 Admin | Admin tools | Build admin dashboards for content, users, analytics, ops | frontend-agent |
| 10.2 | 10 Admin | Permissions | Enforce admin/editor/owner scopes and audit logging | backend-agent |
| 10.3 | 10 Admin | Moderation | Review queues, publishing overrides, AI content review | workflow-builder-agent |
| 10.4 | 10 Admin | Missing: revenue/admin reporting | Add subscription, affiliate, funnel, and churn dashboards | frontend-builder |
| 11.1 | 11 Integrations | Sports data | Integrate stats, odds, weather, schedule providers | backend-agent |
| 11.2 | 11 Integrations | Payments | Integrate Stripe subscriptions, entitlements, webhook handling | backend-builder |
| 11.3 | 11 Integrations | Analytics | Integrate GA/Search Console/product analytics | plugin-agent |
| 11.4 | 11 Integrations | Publishing | Add social publishing and outbound content workflows | plugin-builder |
| 11.5 | 11 Integrations | Missing: identity resolution | Add provider mapping, duplicate resolution, source QA tooling | database-agent |
| 12.1 | 12 Scale | Performance | Tune queries, caching, bundles, render paths, workers | stack-verifier-agent |
| 12.2 | 12 Scale | Reliability | Load tests, queue resilience, timeout/retry hardening | testing-agent |
| 12.3 | 12 Scale | Cost | Optimize infra, storage, model usage, refresh cadence | deployment-agent |
| 12.4 | 12 Scale | Missing: feature flags | Add controlled rollout and experiment toggles | workflow-builder-agent |
| X.1 | X Business | Monetization | Refine pricing, premium packaging, affiliate placements | project-startup-agent |
| X.2 | X Business | Growth | Funnel optimization, retention loops, conversion experiments | project-planner |
| X.3 | X Business | Content strategy | Editorial expansion tied to SEO and premium value | documentation-agent |
| X.4 | X Business | Missing: partner operations | Add sponsor/partner workflow, reporting, and offer governance | project-planner |

---

## B. Pulled-Forward Missing-but-Important Priorities

1. Compliance/privacy/disclosure docs
2. Disaster recovery and restore testing
3. Background job/idempotency contracts
4. Design system foundation
5. Prompt-security/red-team AI evals
6. Incident runbooks
7. Revenue/admin reporting
8. Feature flags/experimentation

---

## C. Phase 0–12 Source-Synced Additions

The following additions are sourced directly from `docs/planning/Master Task List Phase 0.md` through `docs/planning/Master Task List Phase 12.md` and should be tracked alongside Section A.

### Phase 0 — Documentation & Foundational Architecture
- Add explicit standards docs for API conventions, frontend architecture, SEO/content engineering, security architecture, and DevOps planning.
- Include database architecture planning deliverables (schema strategy, indexing, partitioning, materialized views, backup strategy).
- Track validation gates for governance approvals and architecture sign-off.

### Phase 1 — Folder Setup
- Finalize monorepo boundaries, root repository layout, and domain ownership stubs.
- Add naming conventions, git workflow initialization, and build tooling bootstrap standards.
- Include baseline automation artifacts: CODEOWNERS, issue/PR templates, docs-check/architecture-drift placeholders, and env/bootstrap placeholders.

### Phase 2 — Database
- Add explicit standards for migrations, naming, UUID PK strategy, JSONB usage, indexing, partitioning, RLS, functions/triggers, and seed strategy.
- Add analytics infrastructure details: materialized views, caching strategy, observability, reliability, ingestion standards, and roles.
- Add provenance, retention/archive, rollback test, restore validation, and entitlement-boundary requirements.

### Phase 3 — Backend
- Add contract-level route inventories (REST + GraphQL), service/repository boundaries, middleware/error-handling standards, and API performance rules.
- Add authz/authn requirements with cache and observability instrumentation.
- Add billing/entitlement API contracts, OpenAPI/GraphQL contract validation, and idempotent webhook/job audit requirements.

### Phase 4 — Frontend
- Add detailed standards for routing, query caching, typed API client contracts, component architecture, table/chart systems, and premium gating UX.
- Add accessibility acceptance criteria and performance budgets for high-traffic pages.
- Add page-level SEO/schema hooks and entitlement-aware loading/error states.

### Phase 5 — Editor
- Add structured block registry contracts, SEO-editor field requirements, and stats-grounded block rules.
- Add editorial workflow controls: review states, approvals, publish audit trails, autosave conflict handling, and preview safety.
- Add AI draft provenance/citation visibility and revision diff/rollback recovery requirements.

### Phase 6 — Templates
- Add template schema contracts across article, dashboard, SEO, structured data, email, report, and export templates.
- Add template registry/versioning with rollback and non-destructive historical rendering guarantees.
- Add schema validation, sanitization, premium-slot/affiliate rules, and internal-link/schema.org requirements.

### Phase 7 — SEO
- Add canonical/metadata/JSON-LD standards by route class, sitemap/robots strategy, slug/redirect governance, and premium crawl-safe rules.
- Add internal linking and breadcrumb system requirements.
- Add CI validation for metadata/schema, Lighthouse/CWV budgets, sitemap diffing, and search-index health checks.

### Phase 8 — AI
- Add prompt/version registry governance, grounding/source registry architecture, and AI claim validation workflows.
- Add AI service/client requirements (timeouts, retries, usage logging, fallback, redaction, endpoint RBAC/rate limits).
- Add prompt-injection red-team testing, citation/evidence surfacing, moderation queues, and retention policies.

### Phase 9 — Hosting
- Add environment strategy (local/dev/staging/prod), production Docker standards, managed DB/Redis/object storage requirements, and CDN/SSL policy.
- Add CI/CD deployment, migration rollout/rollback controls, and worker deployment contracts.
- Add explicit DR requirements: RTO/RPO, restore testing, secret rotation, scanning, WAF/origin protection, and rollback rehearsal checkpoints.

### Phase 10 — Admin
- Add detailed admin role/permission matrices and module coverage (users, roles, subscriptions, billing, content, AI audit, ingestion, model ops, flags, health).
- Add admin security controls (MFA, step-up auth, impersonation auditing) and audit/export reporting requirements.
- Add dispute/refund/reconciliation, entitlement override, and moderation-history operational workflows.

### Phase 11 — Integrations
- Add provider abstraction, retry/timeouts, webhook verification/idempotency, quota handling, and integration health/error standards.
- Add integrations coverage for sports data, sportsbook odds normalization, payments, analytics, affiliate, AI provider, email, storage, and webhooks.
- Add vendor SLA/fallback mode, secret ownership/rotation controls, dead-letter handling, and disclosure/attribution validation tasks.

### Phase 12 — Scale
- Add scale tasks for DB/API/cache/worker/frontend performance, SEO at scale, AI cost controls, security/reliability hardening, and observability maturity.
- Add load testing, throughput benchmarking, cache invalidation audits, and query-budget enforcement.
- Add resilience drills (failover, queue backpressure, degraded mode) and cross-vendor cost observability targets.

---

## D. Tracking Rule

When a task appears in both the consolidated matrix and a phase source list, treat the matrix row as the canonical tracker and the phase-sourced addition as implementation detail scope.
