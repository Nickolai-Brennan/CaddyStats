# copilot-instructions.md

## Project Overview

Caddy Stats is a production-grade full-stack golf analytics, content, and betting intelligence platform under Strik3Zone.

The platform combines structured golf data, statistical models, editorial workflows, SEO content systems, admin tooling, and AI-assisted analysis into one scalable application.

Primary domains:
- PGA/golf statistics and player analytics
- Tournament, course, and field intelligence
- Betting and fantasy research tools
- Projection and model-performance dashboards
- SEO-driven editorial content
- Admin publishing workflows
- AI-assisted content generation grounded in verified stats
- Subscription, affiliate, and monetization systems

Primary goals:
- Build a data-first analytics platform, not a demo blog
- Keep all statistics grounded in database-backed or fetched data
- Maintain clean separation between content, stats, API, and UI layers
- Optimize for performance, SEO, extensibility, and monetization
- Preserve production-grade security and deployment standards

---

# Approved Tech Stack

## Frontend
- React
- Vite
- TypeScript
- Tailwind CSS
- TanStack Query
- TanStack Table

## Backend
- Python
- FastAPI
- Strawberry GraphQL
- REST endpoints for stats and operational APIs
- Pydantic validation
- SQLAlchemy or equivalent typed database access layer

## Database
- PostgreSQL
- Schemas:
  - `content` for editorial, CMS, blocks, templates, publishing metadata
  - `stats` for golf data, projections, model outputs, events, players, courses, and markets
- JSONB only where flexible block structures or evolving metrics require it
- Materialized views for high-read projection and analytics queries

## Infrastructure
- Docker
- GitHub Actions
- Managed PostgreSQL: Neon, Supabase, or equivalent
- Frontend hosting: Vercel or equivalent CDN-backed host
- Backend hosting: Render, Railway, Fly.io, or equivalent
- SSL enforced in production

## AI Layer
- Prompt injection layer
- Stats grounding layer
- Editor AI assist
- Model-performance analysis
- AI output logging and review controls

## Security
- JWT authentication
- Role-based permissions
- Rate limiting
- Sanitized HTML/content blocks
- Secrets never logged
- GraphQL playground disabled in production

---

# Build Order Rule

Build phases must proceed in this order unless explicitly overridden for a documented reason:

0. Documentation
1. Folder Setup
2. Database
3. Backend
4. Frontend
5. Editor
6. Templates
7. SEO
8. AI
9. Hosting
10. Admin
11. Integrations
12. Scale
X. Business

If a requested change violates this order, identify the correct phase and explain the dependency before generating code.

---

# Architecture Rules

Every implementation decision must map to at least one of the following:
- A document
- A folder
- A database object
- An API endpoint
- A UI component
- A deployment step

If it does not map to one of these, do not treat it as part of the system.

## Folder Ownership

Preferred root structure:

```txt
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
frontend/
backend/
database/
api/
tests/
scripts/
docs/
config/
```

Domain ownership:

```txt
frontend/   -> frontend-agent
backend/    -> backend-agent
database/   -> database-agent
api/        -> api-agent
tests/      -> testing-agent
docs/       -> documentation-agent
scripts/    -> deployment-agent + stack-verifier-agent
config/     -> stack-verifier-agent + system-architect-agent
plugins/    -> plugin-agent
commands/   -> command-agent
```

---

# Data Integrity Rules

Caddy Stats is data-first.

Always follow these rules:
- Never hallucinate player stats, odds, projections, rankings, or model results
- Only reference statistics from injected data, fetched data, database queries, or explicitly provided inputs
- Clearly separate computed values from editorial narrative
- Expose or log model calculations where relevant
- Do not generate betting claims without supporting data
- Do not invent sportsbook lines, tournament fields, injuries, withdrawals, or tee times
- If current sports data is required, require source verification before finalizing output

## Database Standards

Use PostgreSQL as the source of truth.

Required patterns:
- Use migrations for schema changes
- Index high-read fields
- Avoid unbounded queries
- Use materialized views for expensive projections and leaderboards
- Use JSONB only for flexible blocks, templates, or variable metric payloads
- Keep `content` and `stats` schema boundaries clear
- Prefer normalized tables for stable entities such as players, tournaments, courses, rounds, markets, and projections

---

# Backend Standards

## FastAPI Structure

Preferred structure:

```txt
backend/app/
  main.py
  core/
  auth/
  routes/
  services/
  repositories/
  models/
  schemas/
  graphql/
  workers/
  middleware/
```

Rules:
- Routes parse requests and format responses only
- Business logic belongs in services
- Database access belongs in repositories/data-access layers
- Pydantic schemas validate request and response payloads
- Auth checks must be explicit on protected routes
- Never expose internal stack traces to API consumers
- Use structured error responses
- Use rate limiting on auth, expensive analytics, and AI-assisted endpoints

## REST + GraphQL

Use REST for:
- stats endpoints
- operational APIs
- auth
- admin actions
- health checks
- webhook handlers

Use Strawberry GraphQL for:
- flexible editorial queries
- admin dashboard composition
- nested content/data views where GraphQL adds clear value

Do not use GraphQL as a dumping ground for every endpoint.

---

# Frontend Standards

## React Structure

Preferred structure:

```txt
frontend/src/
  components/
  features/
  pages/
  routes/
  hooks/
  services/
  layouts/
  tables/
  styles/
  utils/
  types/
```

Rules:
- Use TypeScript throughout
- Use TanStack Query for server state
- Use TanStack Table for sortable/filterable analytics tables
- Keep local UI state local unless it must be shared
- Avoid unnecessary global state
- Keep components focused and reusable
- Build mobile-first layouts
- Preserve accessibility basics: semantic HTML, labels, keyboard behavior, focus states
- Avoid frontend coupling directly to database structures; consume API contracts

## UI Priorities

Caddy Stats UI should support:
- Public SEO pages
- Player pages
- Tournament pages
- Course pages
- Projection dashboards
- Model-performance pages
- Betting/fantasy research views
- Admin dashboard
- Editorial editor
- Template management
- AI-assisted writing tools

---

# Content + Editorial Standards

Caddy Stats editorial content must be:
- Structured
- Analytical
- Model-grounded
- Transparent
- Readable
- SEO-optimized
- Mobile-first

Avoid:
- Fluff betting tout language
- Unsupported claims
- Fabricated confidence levels
- Generic SEO filler
- Uncited current facts

When building CMS/editor features, support:
- Structured blocks
- Sanitized HTML
- Reusable templates
- Metadata fields
- Internal linking
- Schema.org structured data
- Review status
- Author/editor roles
- AI-generated draft flags

---

# SEO Standards

Public-facing pages should support:
- Unique title tags
- Meta descriptions
- Canonical URLs
- Open Graph metadata
- Internal linking modules
- Schema.org where applicable
- Fast page load
- Indexable content
- Programmatic content templates backed by real data

Do not generate SEO pages that rely on invented data.

---

# AI Standards

AI systems must be grounded and auditable.

Required rules:
- Prompt versions must be stored or documented
- AI output should include input context references where possible
- Critical betting, projection, and recommendation workflows require human review
- AI-generated content must not silently override verified data
- AI usage should be logged for debugging and quality control
- Distinguish model output from verified source data

Preferred AI folders:

```txt
prompts/
evals/
backend/app/services/ai/
backend/app/services/grounding/
docs/ai.md
```

---

# Security Standards

Required:
- JWT auth
- Role-based access control
- HTTPS in production
- Secrets stored in environment variables
- `.env.example` maintained
- No committed `.env` files
- Input sanitization
- Output escaping where relevant
- Rate limiting
- Audit logging for admin actions
- No GraphQL playground in production
- No secrets in logs

Roles should include, at minimum:
- anonymous
- user
- subscriber
- editor
- admin
- owner

---

# Performance Standards

Targets:
- Local API response time: under 150ms for common endpoints
- Cached endpoint response time: under 100ms
- Lighthouse score: above 90 where practical
- Indexed high-read database tables
- Paginated list endpoints
- Optimized analytical queries
- CDN-backed static assets

Watch for:
- N+1 queries
- unnecessary JSONB scans
- missing indexes
- oversized frontend bundles
- excessive client re-renders
- unbounded table queries
- slow materialized view refreshes

---

# Testing Standards

Required test areas:
- Backend unit tests for services
- API integration tests
- Database migration validation
- Frontend smoke tests
- Table/query behavior tests
- Auth and role-permission tests
- AI grounding tests
- Plugin/command validation tests where applicable

Preferred commands:

```bash
bash scripts/test-all.sh
bash scripts/verify-stack.sh
python scripts/validate-plugins.py
python scripts/validate-commands.py
python scripts/benchmark.py
```

---

# Automation and CI Standards

Use GitHub Actions for deterministic checks.

Recommended workflows:

```txt
.github/workflows/
  ci.yml
  code-cleanup.yml
  dependency-review.yml
  api-contract.yml
  docs-check.yml
  architecture-drift.yml
```

Cadence:
- `ci.yml` -> every PR
- `api-contract.yml` -> every PR
- `docs-check.yml` -> every PR
- `dependency-review.yml` -> daily
- `code-cleanup.yml` -> weekly
- `architecture-drift.yml` -> weekly

Rule:
- If it can produce deterministic pass/fail output, automate it in CI
- If it requires judgment, keep it as an AI review prompt or scheduled report

---

# Pre-Edit Capability Inventory Gate

Before editing any file, perform a routing decision.

Required output:

```txt
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

Rules:
- Inspect the target file before editing
- Identify the relevant skill, instruction, agent, tool, and validator
- Never overwrite originals without a backup or explicit intent
- Preserve formatting and metadata where applicable
- Run validation after edits
- Produce a short summary of what changed

---

# Output Standards

When generating implementation output, use this structure unless a smaller answer is clearly sufficient:

1. Overview
2. Architecture Plan
3. Folder/File Breakdown
4. Code or Config
5. Validation Checklist
6. Risks & Considerations

When producing code:
- Include file paths
- Include imports
- Include typing
- Include validation
- Include error handling
- Avoid placeholder fluff
- Avoid unrelated refactors
- Follow the approved stack

---

# Git Standards

Commit message format:

```txt
feat: add new feature
fix: resolve bug
refactor: improve structure
docs: update documentation
chore: maintenance task
test: add or update tests
plugin: add or update plugin
command: add or update command
```

Pull requests should include:
- Scope summary
- Files changed
- Test/validation notes
- Migration notes if applicable
- Documentation updates if applicable

---

# Documentation Standards

Required docs:

```txt
README.md
docs/project-overview.md
docs/architecture.md
docs/stack.md
docs/frontend.md
docs/backend.md
docs/database.md
docs/api.md
docs/agents.md
docs/skills.md
docs/workflows.md
docs/plugins.md
docs/commands.md
docs/setup.md
docs/changelog.md
```

Every major task should update `docs/changelog.md`.

Changelog format:

```md
## YYYY-MM-DD — [Task ID]
- Added:
- Changed:
- Fixed:
- Plugins:
- Commands:
- Notes:
```

---

# Monetization Alignment

Features should connect to at least one of:
- Subscription value
- Affiliate value
- Data differentiation
- SEO leverage
- User retention
- Admin/editorial efficiency

If a feature does not support growth, monetization, operational quality, or data advantage, flag it before implementation.

---

# Avoid

Do not:
- Switch frameworks casually
- Add unnecessary dependencies
- Generate mock stats as if real
- Build UI before stable data/API contracts when the feature depends on backend data
- Put business logic in route handlers
- Put database logic in frontend code
- Use JSONB where normalized tables are better
- Leave setup undocumented
- Skip validation after changes
- Expose secrets or internal errors
- Create generic files with no system purpose

---

# Final Guidance

For Caddy Stats, default to architecture-first, data-first, and validation-first execution.

When uncertain:
1. Preserve the approved stack
2. Protect data integrity
3. Follow the build order
4. Keep database/API contracts stable
5. Document decisions
6. Validate after changes
