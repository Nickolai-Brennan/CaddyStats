# STEP 2 — CADDY STATS PROJECT BUILD SYSTEM

## STEP 2 OBJECTIVE

Define and connect the universal AI orchestration layer to the Caddy Stats production platform.

Execution Model:

```text
Universal AI Control Layer
→ Caddy Stats Project Stack
→ App Build Layer
→ Domain Agents
→ Domain Skills
→ Domain Plugins
→ Domain Commands
→ Project Workflows
```

---

# REQUIRED PROJECT INTAKE

| Field                    | Value                                                                                                                           |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------- |
| Project Name             | Caddy Stats                                                                                                                     |
| Project Type             | Full-Stack Golf Analytics Platform                                                                                              |
| Project Summary          | Production-grade golf analytics, betting intelligence, editorial publishing, and AI-assisted content platform under Strik3Zone. |
| Target Users             | Golf bettors, DFS players, golf analysts, fantasy sports users, sports media readers                                            |
| Core Features            | PGA stats database, projections, betting models, editorial CMS, AI-assisted workflows, dashboards, player/course analytics      |
| Revenue Model            | Subscription memberships, affiliate sportsbook revenue, premium dashboards, sponsorships                                        |
| Frontend Stack           | React + Vite + TypeScript + Tailwind + TanStack Query/Table                                                                     |
| Backend Stack            | FastAPI + Strawberry GraphQL + Python                                                                                           |
| Database                 | PostgreSQL                                                                                                                      |
| API Layer                | REST + GraphQL                                                                                                                  |
| Authentication           | JWT + role-based access control                                                                                                 |
| Admin Panel              | Custom React admin dashboard                                                                                                    |
| CMS Needed               | Yes                                                                                                                             |
| Analytics Needed         | Yes                                                                                                                             |
| Payments Needed          | Yes — Stripe                                                                                                                    |
| Social Publishing Needed | Yes                                                                                                                             |
| Content Calendar Needed  | Yes                                                                                                                             |
| Plugins Needed           | CMS, analytics, social publishing, projections, betting models, SEO, editorial workflows                                        |
| Commands Needed          | Schema generation, route generation, content publishing, projections refresh, AI review commands                                |
| Hosting                  | Vercel + Railway/Render + Neon PostgreSQL                                                                                       |
| Integrations             | Stripe, OpenAI, Sports APIs, Odds APIs, Google Analytics, Search Console                                                        |
| AI Tools                 | OpenAI, ChatGPT, Copilot                                                                                                        |

---

# CADDY STATS STACK

## Frontend

- React
- Vite
- TypeScript
- TailwindCSS
- TanStack Query
- TanStack Table
- React Router
- Framer Motion

## Backend

- FastAPI
- Strawberry GraphQL
- Python 3.12+
- Pydantic
- SQLAlchemy
- Alembic

## Database

- PostgreSQL
- Two schemas:
  - `content`
  - `stats`

- Materialized views
- Indexed analytics tables
- JSONB blocks for flexible editorial structures

## AI Layer

- OpenAI APIs
- Prompt injection layer
- AI-assisted editorial workflows
- Projection analysis pipelines
- Stats grounding layer

## Infrastructure

- Docker
- GitHub Actions
- Vercel frontend hosting
- Railway/Render backend hosting
- Neon PostgreSQL
- CDN delivery

---

# PROJECT ROOT STRUCTURE

```text
caddystats/
├── .github/
├── agents/
├── skills/
├── instructions/
├── workflows/
├── prompts/
├── templates/
├── evals/
├── plugins/
├── commands/
├── frontend/
├── backend/
├── database/
├── api/
├── tests/
├── automation/
├── scripts/
├── docs/
└── config/
```

---

# LAYER MODEL

## Layer 1 — AI Control Layer

Folders:

```text
.github/
agents/
skills/
instructions/
workflows/
prompts/
templates/
evals/
plugins/
commands/
```

Purpose:

- Controls AI behavior
- Routes project workflows
- Executes plugin orchestration
- Generates reusable commands
- Maintains architecture standards
- Runs evaluations and QA loops

---

## Layer 2 — App Build Layer

Folders:

```text
frontend/
backend/
database/
api/
tests/
```

Purpose:

- Stores production application code
- Separates frontend/backend/database responsibilities
- Supports modular scaling
- Supports production deployment

---

## Layer 3 — Support Layer

Folders:

```text
scripts/
docs/
config/
automation/
```

Purpose:

- Stores automation scripts
- Maintains project documentation
- Maintains stack configs
- Handles recurring review workflows

---

# PROJECT-SPECIFIC AGENT MAP

## Repo-Level Agent

```text
.github/copilot-instructions.md
```

Purpose:

- Enforce architecture rules
- Enforce database-first development
- Prevent stack drift
- Maintain documentation standards
- Route tasks to correct domain agents

---

## Domain Agents

| Agent                  | Responsibility                      |
| ---------------------- | ----------------------------------- |
| project-startup-agent  | Intake and project planning         |
| stack-verifier-agent   | Verify stack and environments       |
| frontend-agent         | React frontend systems              |
| backend-agent          | FastAPI services and business logic |
| database-agent         | PostgreSQL schema and performance   |
| api-agent              | REST and GraphQL APIs               |
| documentation-agent    | Docs and onboarding                 |
| testing-agent          | Unit/integration/eval testing       |
| deployment-agent       | Docker, CI/CD, hosting              |
| code-cleaner-agent     | Refactors and consistency           |
| plugin-agent           | Plugin systems                      |
| command-agent          | Reusable commands                   |
| workflow-builder-agent | Workflow orchestration              |

---

# SKILL INTEGRATION MAP

| Skill                   | Primary Usage               |
| ----------------------- | --------------------------- |
| project-planner         | Planning and sequencing     |
| stack-verifier          | Environment validation      |
| frontend-builder        | React/TanStack generation   |
| backend-builder         | FastAPI service generation  |
| database-designer       | PostgreSQL schema design    |
| api-designer            | REST/GraphQL contracts      |
| documentation-generator | Markdown/system docs        |
| eval-runner             | Testing/evals               |
| deployment-planner      | CI/CD and Docker            |
| plugin-builder          | Plugin creation             |
| command-builder         | Reusable command generation |

---

# CADDY STATS PLUGINS

```text
plugins/
├── cms/
├── admin-dashboard/
├── analytics/
├── projections-engine/
├── betting-models/
├── social-publishing/
├── content-calendar/
├── seo-engine/
├── ai-editorial/
└── search-recommendations/
```

## Core Plugin Responsibilities

| Plugin             | Purpose                            |
| ------------------ | ---------------------------------- |
| cms                | Editorial publishing               |
| analytics          | Golf analytics and dashboards      |
| projections-engine | Player projections and simulations |
| betting-models     | Odds and betting intelligence      |
| social-publishing  | Cross-platform publishing          |
| seo-engine         | Metadata/schema optimization       |
| ai-editorial       | AI-assisted content workflows      |

---

# COMMAND SYSTEM

```text
commands/
├── setup/
├── frontend/
├── backend/
├── database/
├── api/
├── projections/
├── analytics/
├── ai/
├── seo/
└── docs/
```

## Example Commands

| Command                  | Purpose                  |
| ------------------------ | ------------------------ |
| setup/initialize-project | Bootstrap environment    |
| database/create-schema   | Generate schema objects  |
| backend/create-service   | Create FastAPI services  |
| api/create-contract      | Generate typed contracts |
| projections/run-model    | Execute projection model |
| ai/review-article        | AI editorial QA          |
| seo/generate-schema      | SEO schema generation    |

---

# AUTOMATION LAYER

```text
automation/
├── prompts/
├── reports/
├── scripts/
└── metrics/
```

## Initial Automation Workflows

| Workflow                  | Cadence    |
| ------------------------- | ---------- |
| code-cleanup-review       | Weekly     |
| dependency-review         | Daily      |
| architecture-drift-review | Weekly     |
| api-contract-validation   | Every PR   |
| docs-sync-check           | Every PR   |
| queue-health-review       | Continuous |

---

# GITHUB ACTIONS WORKFLOWS

```text
.github/workflows/
├── ci.yml
├── code-cleanup.yml
├── dependency-review.yml
├── api-contract.yml
├── docs-check.yml
└── architecture-drift.yml
```

---

# DATABASE ARCHITECTURE

## Schemas

```text
content
stats
```

## Core Database Responsibilities

- PGA stats ingestion
- Tournament modeling
- Editorial content blocks
- Betting odds storage
- Projection materialized views
- Historical trend analytics

## Standards

- Migration-based changes only
- Indexed high-read tables
- JSONB only where flexibility is required
- Materialized views for projections
- Audit logging enabled

---

# API ARCHITECTURE

## REST Responsibilities

- Stats endpoints
- Odds endpoints
- Public editorial APIs
- SEO payloads

## GraphQL Responsibilities

- Dashboard aggregation
- Admin/editorial workflows
- Flexible analytics queries

---

# FRONTEND ARCHITECTURE

## Primary Views

- Homepage
- Tournament hub
- Player profile pages
- Betting tools
- DFS dashboards
- Editorial article pages
- Premium dashboards
- Admin CMS

## Frontend Standards

- Mobile-first UI
- Typed API clients
- TanStack Query for server state
- Reusable UI primitives
- Lighthouse score >90

---

# SECURITY STANDARDS

- JWT authentication
- Role-based access control
- Rate limiting
- CSP headers
- Sanitized HTML blocks
- Secrets managed via environment variables
- Production-safe Docker images
- No GraphQL playground in production

---

# PERFORMANCE TARGETS

| Metric            | Target       |
| ----------------- | ------------ |
| API response time | <150ms local |
| Cached endpoints  | <100ms       |
| Lighthouse score  | >90          |
| Availability      | 99.9%        |

---

# EXECUTION ORDER

```text
1. Project intake
2. Stack verification
3. AI control layer
4. Plugin layer
5. Command layer
6. Database layer
7. Backend layer
8. API layer
9. Frontend layer
10. Testing layer
11. Documentation layer
12. Deployment layer
13. Automation layer
14. Optimization/review
```

---

# PRE-EDIT CAPABILITY INVENTORY GATE

## Mandatory First Gate

Before editing any file:

```text
1. Inspect target file
2. Query capability registry
3. Match required agents/skills/tools
4. Select execution stack
5. Explain routing decision
6. Execute edits
7. Run validations
8. Generate diff summary
```

## Required Output

```text
File:
Detected file type:
Requested edit:
Available relevant automations:
Available relevant skills:
Available relevant instructions:
Available relevant agents:
Selected combination:
Reason for selection:
Risks:
Validation checks:
Proceeding edit plan:
```

---

# VALIDATION FRAMEWORK

## Structural Validation

- File integrity
- Dependency validation
- Schema validation
- API contract validation

## Semantic Validation

- Requested edits completed
- No unrelated changes introduced
- Meaning preserved

## Functional Validation

- Code compiles
- APIs validate
- Database migrations succeed
- Frontend builds
- Tests pass

---

# SUCCESS STATE

Caddy Stats Step 2 is complete when:

- AI orchestration layer is connected to the stack
- Agents are mapped to domains
- Skills are mapped to workflows
- Plugins are mapped to systems
- Commands are mapped to execution paths
- Database-first build order is enforced
- CI/CD and automation layers exist
- Documentation standards are enforced
- Security and performance rules are embedded into workflows
