# Caddy Stats — Product Requirements Document (PRD)

Version: 2.0
Status: Active MVP Development
Parent Brand: Strik3Zone
Product Type: Golf Analytics, Betting Intelligence, Editorial, and Projection Platform
Last Updated: 2026-05-12

---

# 1. Executive Overview

## Product Name

Caddy Stats

## Parent Brand

Strik3Zone

## Product Summary

Caddy Stats is a production-grade golf analytics and betting intelligence platform focused on PGA Tour analytics, projections, fantasy golf research, betting tools, and SEO-driven editorial content.

The platform combines:

- structured golf statistics
- projection modeling
- betting intelligence
- AI-assisted editorial workflows
- premium subscriber tools
- SEO-focused publishing

into a unified scalable analytics system.

## Primary Goal

Convert golf search traffic and betting interest into recurring subscription revenue through premium analytics and differentiated data products.

---

# 2. Problem Statement

Golf bettors, DFS players, and fantasy golf users currently rely on fragmented information spread across:

- sportsbook apps
- spreadsheets
- stat providers
- social media threads
- shallow betting blogs
- disconnected research tools

Current market gaps:

- Lack of transparent golf-specific projection systems
- Poor explainability for betting recommendations
- Weak integration between analytics and editorial workflows
- Generic betting content without structured data grounding
- Limited golf-specific premium intelligence products

Caddy Stats solves these problems through:

- centralized golf analytics
- explainable projections
- stat-grounded editorial systems
- premium betting intelligence tools
- scalable SEO architecture

---

# 3. Product Goals

## Core Product Goals

- Build a trusted golf analytics platform
- Deliver transparent projection-based betting intelligence
- Publish scalable SEO content
- Support premium subscriptions
- Create reusable sports analytics infrastructure

## Business Goals

- Generate organic traffic through SEO
- Convert anonymous visitors into free users
- Convert free users into paid subscribers
- Generate sportsbook and DFS affiliate revenue
- Build proprietary long-term sports data assets

## Technical Goals

- API-first architecture
- Database-first system design
- Scalable analytics infrastructure
- AI-assisted editorial workflows
- High-performance caching and projections

---

# 4. Target Users

## 4.1 Free Readers

### Needs

- Tournament previews
- Course guides
- Betting articles
- Golfer rankings
- Search-accessible analytics

### Monetization Path

SEO → newsletter signup → account creation → premium trial

---

## 4.2 Serious Golf Bettors

### Needs

- Projection-driven betting models
- Matchup analysis
- Value ratings
- Outright rankings
- Top-10/Top-20 probabilities
- Explainable betting edges

### Monetization Path

Free stats → premium projections → subscription

---

## 4.3 DFS / Fantasy Golf Players

### Needs

- Salary-adjusted projections
- Ownership leverage
- Course fit metrics
- Recent form weighting
- Lineup research tools

### Monetization Path

Free rankings → advanced projections → subscription

---

## 4.4 Internal Editors / Admins

### Needs

- CMS workflows
- AI-assisted drafting
- SEO controls
- Publishing tools
- Stat injection systems
- Projection embedding

### Business Value

Increase publishing speed while maintaining data integrity.

---

# 5. MVP Scope

## Included in MVP

- Public marketing site
- Tournament pages
- Golfer profile pages
- Course pages
- Projection tables
- Betting intelligence tools
- Structured editorial CMS
- Admin dashboard
- Authentication
- Stripe subscriptions
- SEO metadata system
- AI-assisted editorial workflows
- Docker deployment pipeline

## Excluded From MVP

- Native mobile applications
- Automated sportsbook bet placement
- Live odds engine
- Community/social systems
- Multi-sport expansion
- Real-time streaming architecture

---

# 6. Core Product Features

# 6.1 Public Website

## Description

SEO-optimized frontend delivering golf analytics, editorial content, rankings, and premium tool access.

## Requirements

- Homepage
- Tournament hub
- Golfer index
- Course index
- Articles index
- Pricing page
- Login/register
- Premium upgrade flow

## Success Criteria

- Lighthouse score >90
- Mobile-first rendering
- Dynamic metadata for all public pages
- Indexed by search engines

---

# 6.2 Tournament Pages

## Description

Dedicated tournament hubs with:

- field analysis
- projections
- betting rankings
- course fit metrics
- editorial previews

## API Endpoints

```text
GET /api/tournaments
GET /api/tournaments/{slug}
GET /api/tournaments/{slug}/field
GET /api/tournaments/{slug}/projections
```

## Database Tables

```text
stats.tournaments
stats.tournament_fields
stats.tournament_results
stats.projections
content.articles
```

## Success Criteria

- Generated fully from database records
- Premium projections gated server-side
- SEO schema implemented

---

# 6.3 Golfer Profile Pages

## Description

Stat-grounded golfer profiles with:

- recent form
- strokes gained metrics
- course history
- projections
- betting indicators

## Success Criteria

- All statistics sourced from structured data
- Search-indexable profile pages
- No hallucinated analytics

---

# 6.4 Projection System

## Description

Projection engine generating tournament expectations using:

- course fit
- historical performance
- recent form
- weighted strokes gained metrics
- betting value calculations

## Core Metrics

```text
projected_finish
win_probability
top_5_probability
top_10_probability
top_20_probability
made_cut_probability
course_fit_score
recent_form_score
long_term_skill_score
value_rating
```

## Success Criteria

- Projection versioning required
- Auditable model runs
- Explainability fields supported

---

# 6.5 Betting Intelligence

## Description

Model-grounded betting tools and rankings.

## Features

- Outright rankings
- Top-10 rankings
- Top-20 rankings
- Matchup analysis
- Betting edge explanations
- Value ratings

## Compliance Rules

- No guarantee language
- Responsible gambling disclaimers required
- Analytics separated from financial advice

---

# 6.6 Content Management System

## Description

Structured editorial system for scalable SEO publishing.

## Features

- Rich article editor
- Structured content blocks
- Stat blocks
- Projection blocks
- SEO metadata
- Publishing workflow
- Author system
- Draft/published states

## Success Criteria

- AI content limited to injected stats
- Structured reusable blocks
- Scalable article templates

---

# 6.7 Admin Dashboard

## Description

Internal admin/editor interface.

## Features

- Article management
- Projection embedding
- SEO controls
- AI assist panel
- User management
- Subscription management
- Audit logging

## Security Requirements

- Admin-only access
- Role-based permissions
- Server-side route protection

---

# 6.8 Authentication & Roles

## Roles

```text
anonymous
free_user
subscriber
editor
admin
```

## Requirements

- JWT authentication
- Refresh tokens
- Password hashing
- Premium route protection
- Admin route protection

## Success Criteria

- Server-side access enforcement
- Secure token handling
- No secrets exposed to frontend

---

# 6.9 Subscription System

## Description

Premium subscription system powered by Stripe.

## Plans

- Free tier
- Monthly premium
- Annual premium

## Features

- Stripe checkout
- Webhook synchronization
- Subscription status sync
- Premium gating

## Success Criteria

- Stripe events logged
- Failed payments downgrade safely
- Premium access validated server-side

---

# 7. Data Architecture

## PostgreSQL Schemas

```text
content
stats
```

## content Schema

Editorial and SEO content.

### Core Tables

```text
content.authors
content.articles
content.article_blocks
content.categories
content.tags
content.article_tags
```

## stats Schema

Golf analytics and platform systems.

### Core Tables

```text
stats.golfers
stats.tournaments
stats.courses
stats.tournament_fields
stats.tournament_results
stats.golfer_stats
stats.model_runs
stats.projections
stats.projection_factors
stats.users
stats.subscriptions
stats.payment_events
```

## Database Standards

- Migration-driven schema management
- Indexed high-read tables
- JSONB only when flexibility is required
- Materialized views for projections
- Audit logging enabled

---

# 8. Technical Stack

## Frontend

- React
- Vite
- TypeScript
- Tailwind CSS
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
- Materialized views
- JSONB blocks
- Indexed analytics tables

## Infrastructure

- Docker
- GitHub Actions
- Vercel frontend hosting
- Railway/Render backend hosting
- Neon PostgreSQL
- CDN + SSL

---

# 9. API Architecture

## REST APIs

High-read cacheable endpoints.

```text
/api/golfers
/api/tournaments
/api/projections
/api/betting
/api/articles
```

## GraphQL

Used for:

- admin workflows
- nested dashboard queries
- editorial systems

### Production Rules

- Playground disabled in production
- Rate limiting required
- Admin mutations require auth

---

# 10. AI Requirements

## Core Rule

AI may never invent statistics.

## Requirements

- AI receives injected stats only
- Generated content requires review
- AI outputs separated from computed values
- Prompt injection protection required
- AI cannot auto-publish

## Use Cases

- Tournament outline generation
- Betting article drafting
- Projection explanations
- Meta description generation
- Internal linking suggestions

---

# 11. SEO Requirements

## Page Types

- Tournament pages
- Golfer pages
- Course pages
- Betting previews
- DFS articles
- Evergreen strategy pages

## SEO Systems

- Dynamic metadata
- Open Graph tags
- Canonical URLs
- XML sitemap
- Robots.txt
- Internal linking engine
- Structured schema markup

## Success Criteria

- Metadata exists on all indexable pages
- Sitemap auto-updates
- Pages optimized for mobile search

---

# 12. Monetization Model

## Revenue Streams

1. Premium subscriptions
2. Sportsbook affiliate links
3. DFS affiliate partnerships
4. Newsletter sponsorships
5. Premium analytics tools
6. Future data/API licensing

## Premium Value Drivers

- Projection engine
- Betting edge tables
- Advanced comparison tools
- Explainable analytics
- Subscriber-only articles

---

# 13. Non-Functional Requirements

## Performance Targets

| Metric          | Target       |
| --------------- | ------------ |
| API response    | <150ms local |
| Cached endpoint | <100ms       |
| Lighthouse      | >90          |
| Availability    | 99.9%        |

## Security Requirements

- JWT auth
- RBAC permissions
- Password hashing
- Rate limiting
- CSP headers
- Sanitized content blocks
- Secrets never logged

## Reliability Requirements

- Schema migrations required
- Projection runs versioned
- Payment events logged
- Audit logging enabled

---

# 14. Repository Structure

```text
caddy-stats/
├── docs/
├── frontend/
├── backend/
├── database/
├── api/
├── tests/
├── automation/
├── scripts/
├── infra/
├── plugins/
├── commands/
└── config/
```

---

# 15. MVP Build Phases

## Phase 0 — Documentation

Deliverables:

- PRD
- Architecture docs
- Database plan
- API contracts
- SEO strategy
- AI safety plan

---

## Phase 1 — Folder Setup

Deliverables:

- Monorepo structure
- Frontend scaffold
- Backend scaffold
- Docker setup
- Environment config

---

## Phase 2 — Database

Deliverables:

- PostgreSQL schemas
- Core tables
- Indexes
- Alembic migrations
- Seed data

---

## Phase 3 — Backend

Deliverables:

- FastAPI services
- Auth endpoints
- Stats APIs
- Billing APIs
- GraphQL admin schema

---

## Phase 4 — Frontend

Deliverables:

- Public pages
- Tournament pages
- Golfer pages
- Auth flows
- Premium gating

---

## Phase 5 — Editor

Deliverables:

- Admin dashboard
- Article editor
- SEO panel
- Projection block tools

---

## Phase 6 — SEO

Deliverables:

- Metadata engine
- Schema markup
- Sitemap generation
- Internal linking system

---

## Phase 7 — AI

Deliverables:

- AI assist workflows
- Grounding layer
- Prompt templates
- Validation rules

---

## Phase 8 — Hosting

Deliverables:

- Docker production builds
- Managed Postgres
- SSL
- CDN
- CI/CD

---

# 16. Risks & Mitigation

## Data Risk

### Risk

Inconsistent golf stat sourcing.

### Mitigation

- Source metadata tracking
- Versioned imports
- Validation rules
- Projection auditing

---

## Betting Compliance Risk

### Risk

Regulatory and trust concerns.

### Mitigation

- Responsible gambling messaging
- Affiliate disclosure systems
- No misleading claims

---

## SEO Risk

### Risk

Thin commodity content.

### Mitigation

- Structured data
- Model-grounded insights
- Evergreen SEO pages
- Strong internal linking

---

## AI Risk

### Risk

Hallucinated analytics.

### Mitigation

- Strict grounding layer
- Human review required
- Prompt validation
- Output logging

---

# 17. Success Metrics

## Product Metrics

- 100+ public pages launched
- 80+ indexed pages
- 3+ premium tools launched
- 4+ editorial templates
- 1+ production projection model

## Performance Metrics

- Lighthouse >90
- Cached API response <100ms
- Local API response <150ms
- 100% migration success

## Business Metrics

- Subscriber conversion rate
- Affiliate click-through rate
- Email signup rate
- Organic impressions growth
- Premium trial starts

---

# 18. Launch Criteria

Caddy Stats MVP launches when:

- Public site deployed
- Database migrated
- Tournament pages functional
- Golfer pages functional
- Projection tables operational
- Auth + subscriptions operational
- Admin editor operational
- SEO systems implemented
- AI grounding enforced
- Secrets secured
- Performance targets met

---

# 19. Validation Checklist

- [ ] PRD approved
- [ ] Architecture document completed
- [ ] Folder structure created
- [ ] PostgreSQL schemas created
- [ ] Migrations tested
- [ ] Backend API implemented
- [ ] Frontend pages implemented
- [ ] Admin editor implemented
- [ ] Auth and roles implemented
- [ ] Stripe billing implemented
- [ ] SEO system implemented
- [ ] AI grounding implemented
- [ ] Docker production build works
- [ ] Deployment pipeline configured
- [ ] Monitoring enabled
- [ ] Launch checklist completed

---

# 20. Final Definition of Done

Caddy Stats MVP is complete when a user can:

1. Discover a tournament article through search
2. View tournament and golfer statistics
3. Create a free account
4. Upgrade to premium
5. Access premium projections
6. Read model-grounded betting analysis
7. Trust every displayed statistic is data-backed
8. Return weekly for updated tournament intelligence
