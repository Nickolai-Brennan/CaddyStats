# Caddy Stats Building Plan

## 0. Documentation

### Goal
Define the platform before implementation so every later task maps to a document, folder, database object, API endpoint, UI component, or deployment step.

### Tasks
- Create core product documentation:
  - product vision
  - scope and non-goals
  - architecture overview
  - domain model
  - glossary
- Define system requirements:
  - frontend requirements
  - backend requirements
  - database requirements
  - AI safety/grounding requirements
  - SEO/content requirements
- Create delivery docs:
  - roadmap
  - milestones
  - decision log / ADRs
  - environment setup guide
  - deployment strategy
- Create security documentation:
  - auth model
  - RBAC matrix
  - secrets handling policy
  - logging/redaction policy
- Create data governance docs:
  - stat provenance rules
  - model output audit rules
  - editorial vs computed-content separation rules

### Categories
- Product docs
- Architecture docs
- Security docs
- Data governance docs
- Delivery docs

### Deliverables
- `docs/product/vision.md`
- `docs/architecture/system-overview.md`
- `docs/architecture/domain-model.md`
- `docs/security/auth-rbac.md`
- `docs/data/stat-grounding-policy.md`
- `docs/roadmap/build-phases.md`

---

## 1. Folder Setup

### Goal
Establish the approved root structure and ownership boundaries.

### Tasks
- Create root directories:
  - `.github/`
  - `agents/`
  - `skills/`
  - `instructions/`
  - `workflows/`
  - `prompts/`
  - `templates/`
  - `evals/`
  - `plugins/`
  - `commands/`
  - `frontend/`
  - `backend/`
  - `database/`
  - `api/`
  - `tests/`
  - `scripts/`
  - `docs/`
  - `config/`
- Add README files for ownership and purpose
- Define code standards and contribution rules
- Add linting/formatting configs for frontend and backend
- Add environment file templates

### Categories
- Repository structure
- Ownership boundaries
- Developer experience
- Configuration

### Deliverables
- folder scaffold
- `docs/repository-structure.md`
- `config/` base configs
- root `README.md`

---

## 2. Database

### Goal
Design PostgreSQL as the source of truth for content and stats.

### Tasks
#### Schema design
- Define `stats` schema:
  - players
  - tournaments
  - courses
  - rounds
  - field entries
  - scorecards
  - strokes gained metrics
  - betting markets
  - projections
  - model runs
  - model performance
- Define `content` schema:
  - articles
  - article versions
  - blocks
  - templates
  - slugs
  - tags
  - authors
  - publishing metadata
  - affiliate placements
- Define auth-related tables:
  - users
  - roles
  - permissions
  - subscriptions
  - entitlements
- Define audit tables:
  - AI output logs
  - editorial review logs
  - model execution logs

#### Migration system
- Set up migration tooling
- Create baseline migrations
- Add seed scripts for local development

#### Performance
- Add indexes on high-read fields
- Identify materialized views for:
  - leaderboard summaries
  - player form trends
  - projection rankings
  - model performance snapshots

### Categories
- Stats schema
- Content schema
- Auth schema
- Audit schema
- Performance/database optimization

### Deliverables
- `database/migrations/`
- `database/schema/`
- `database/seeds/`
- ERD documentation
- materialized view definitions

---

## 3. Backend

### Goal
Build a production-grade FastAPI backend with clear service and repository separation.

### Tasks
#### Core app setup
- Create backend structure under:
  - `backend/app/main.py`
  - `core/`
  - `auth/`
  - `routes/`
  - `services/`
  - `repositories/`
  - `models/`
  - `schemas/`
  - `graphql/`
  - `workers/`
  - `middleware/`
- Configure app startup, settings, dependency injection, logging

#### Auth and security
- JWT auth
- role-based authorization
- request validation
- rate limiting
- secrets-safe logging
- CORS and environment-based settings

#### API domains
- Player stats endpoints
- Tournament endpoints
- Course endpoints
- Projection endpoints
- Market/betting intelligence endpoints
- Content endpoints
- Admin operational endpoints

#### GraphQL
- Add Strawberry GraphQL for structured analytics/content querying
- Disable playground in production
- Add auth guards

#### Services and repositories
- Repository layer for all DB access
- Service layer for:
  - projection calculations
  - field analysis
  - editorial content assembly
  - AI grounding
  - model evaluation

### Categories
- Core backend infrastructure
- Auth/security
- REST APIs
- GraphQL APIs
- Service layer
- Repository layer

### Deliverables
- FastAPI app bootstrap
- auth module
- stats/content routes
- repository/service abstractions
- OpenAPI and GraphQL schema docs

---

## 4. Frontend

### Goal
Build the React/Vite app for analytics, content, and user workflows.

### Tasks
#### Foundation
- Set up React + Vite + TypeScript
- Add Tailwind
- Add TanStack Query
- Add TanStack Table
- Configure routing, layouts, and app shell

#### Public pages
- homepage
- player pages
- tournament pages
- course pages
- betting research pages
- article pages
- rankings/projections pages

#### Data UI
- stat tables
- filters
- leaderboard views
- comparison tools
- trend visualizations
- market cards

#### Shared systems
- design tokens
- reusable UI components
- loading/error states
- auth-aware navigation
- SEO metadata helpers

### Categories
- Frontend foundation
- Public experience
- Analytics UI
- Shared component system
- Performance and SEO support

### Deliverables
- `frontend/` app scaffold
- routing system
- page templates
- reusable stat components
- query hooks and tables

---

## 5. Editor

### Goal
Build editorial workflows for creating, reviewing, and publishing golf content.

### Tasks
- Create article editor UI
- Support structured content blocks
- Add draft/publish workflow
- Add revision history
- Add authoring metadata
- Add stat embed blocks
- Add validation for sourced stats
- Add editorial review states

### Categories
- CMS/editor
- Workflow/state management
- Content validation
- Revision control

### Deliverables
- editor screens
- content block schema
- publish workflow endpoints
- revision/audit support

---

## 6. Templates

### Goal
Create reusable page and article templates for scalable publishing.

### Tasks
- Define article templates:
  - player profile
  - tournament preview
  - betting card
  - DFS/value plays
  - course breakdown
  - recap/results
- Define landing page templates
- Define block rendering contracts
- Add template-to-data binding rules

### Categories
- Editorial templates
- Landing page templates
- Rendering contracts
- Data binding rules

### Deliverables
- `templates/` definitions
- frontend renderers
- backend template resolvers

---

## 7. SEO

### Goal
Ensure search-optimized, structured, scalable content and analytics pages.

### Tasks
- Slug generation rules
- Canonical URL handling
- Meta title/meta description generation
- Open Graph/Twitter metadata
- Internal linking strategy
- Schema.org structured data
- XML sitemap generation
- Robots and indexing controls
- Programmatic SEO page rules for players/events/courses

### Categories
- Technical SEO
- Metadata
- Structured data
- Programmatic SEO

### Deliverables
- SEO utilities
- sitemap generation
- metadata components
- indexing policies

---

## 8. AI

### Goal
Implement AI-assisted workflows grounded in verified stats and audit controls.

### Tasks
- Build prompt injection layer
- Build stats grounding layer
- Add source attachment requirements
- Add AI output logging
- Add human review controls
- Add AI assist for editors
- Add model-performance analysis summaries
- Add safeguards against unsupported betting/stat claims

### Categories
- Prompt system
- Grounding/verification
- Editorial AI assist
- Audit/logging
- Safety controls

### Deliverables
- `prompts/`
- `instructions/`
- AI service layer
- grounding validators
- AI audit log tables and UI

---

## 9. Hosting

### Goal
Prepare secure production deployment for frontend, backend, and database.

### Tasks
- Dockerize services
- Create environment configs
- Configure managed PostgreSQL
- Configure frontend hosting
- Configure backend hosting
- Enforce SSL
- Add secrets management
- Add deployment workflows
- Add health checks and readiness checks

### Categories
- Containerization
- Infra config
- Deploy pipelines
- Security hardening
- Runtime observability

### Deliverables
- `Dockerfile`s
- deployment configs
- GitHub Actions workflows
- environment documentation

---

## 10. Admin

### Goal
Build internal tooling for operators, editors, and analysts.

### Tasks
- Admin dashboard
- user and role management
- content moderation/publishing controls
- AI review console
- model run monitoring
- projection ingestion controls
- affiliate placement management
- audit/event viewer

### Categories
- User administration
- Editorial administration
- AI operations
- Data operations
- Monetization administration

### Deliverables
- admin UI
- admin APIs
- RBAC-protected routes
- internal dashboards

---

## 11. Integrations

### Goal
Connect external providers and internal automation systems.

### Tasks
- Sports/stat data provider integration
- odds/market provider integration
- email/subscription integration
- affiliate link integration
- analytics integration
- webhook/event ingestion
- external content syndication where applicable

### Categories
- Sports data
- Betting/market data
- Subscription systems
- Affiliate systems
- Analytics/events

### Deliverables
- ingestion jobs
- provider adapters
- sync monitoring
- failure/retry policies

---

## 12. Scale

### Goal
Prepare the system for growth, reliability, and high-read analytics workloads.

### Tasks
- caching strategy
- materialized view refresh strategy
- background job processing
- query optimization
- load testing
- monitoring/alerting
- error budgets/SLOs
- partitioning strategy for historical stats
- CDN strategy for public content

### Categories
- Performance
- Reliability
- Observability
- Data scaling
- Cost control

### Deliverables
- performance dashboards
- refresh workers
- scale runbooks
- monitoring and alerting configs

---

## X. Business

### Goal
Support monetization, subscriptions, partnerships, and business ops.

### Tasks
- subscription tiers
- entitlement mapping
- paywall rules
- affiliate attribution
- sponsor placements
- premium research products
- conversion funnel tracking
- business KPI dashboards

### Categories
- Subscription monetization
- Affiliate monetization
- Revenue analytics
- Product operations

### Deliverables
- pricing/entitlement model
- affiliate reporting
- premium access controls
- KPI dashboards

---

# Master Task Categories

Here is a cleaner category map across the whole build:

1. **Documentation**
2. **Repository Structure**
3. **Database & Data Modeling**
4. **Backend APIs & Services**
5. **Frontend Experience**
6. **Editorial/CMS**
7. **Template System**
8. **SEO & Discoverability**
9. **AI & Grounding**
10. **Infrastructure & Deployment**
11. **Admin & Operations**
12. **External Integrations**
13. **Scaling & Reliability**
14. **Business & Monetization**
15. **Security & Compliance**
16. **Testing & QA**

---

# Cross-Cutting Task List

These should exist across all phases:

## Security
- JWT auth
- RBAC
- secrets handling
- rate limiting
- input validation
- sanitized content rendering
- audit logs

## Testing
- backend unit tests
- frontend component tests
- integration tests
- API contract tests
- migration tests
- end-to-end tests
- AI grounding validation tests

## Observability
- structured logs
- error monitoring
- metrics
- tracing for critical backend flows
- model run logging

## Governance
- ADRs for architectural decisions
- schema change review
- stat provenance review
- AI output review workflow

---

# Suggested Immediate Next Tasks

If you want the most correct start according to your rules, do these first:

1. Create documentation structure in `docs/`
2. Create approved root folder scaffold
3. Define initial PostgreSQL schema plan
4. Write backend architecture contract
5. Define frontend route map
6. Define CMS/editor content model
7. Define AI grounding and audit requirements

---

# Suggested MVP Task Breakdown

## MVP Phase 1
- docs
- folder setup
- database schema
- backend auth
- player/tournament/course APIs
- basic frontend app shell

## MVP Phase 2
- stats dashboards
- article system
- editorial workflows
- SEO pages

## MVP Phase 3
- AI editorial assist
- betting intelligence tools
- admin dashboards
- subscriptions/affiliate systems

---

If you want, I can turn this into one of these next:

1. a **GitHub issue breakdown by phase**,  
2. a **checklist-style `plan.md` rewrite**, or  
3. a **repo-ready folder/file blueprint** for `Nickolai-Brennan/CaddyStats`.
