Phase 3 — Backend/API Implementation

Phase Objective

Build the FastAPI + Strawberry GraphQL backend layer for Caddy Stats, including authentication, REST stats endpoints, GraphQL content APIs, service/repository boundaries, caching, security, and observability.


---

3.1 Backend Architecture

Stack

FastAPI

Strawberry GraphQL

SQLAlchemy 2.x

Alembic

PostgreSQL

Redis

Pydantic

JWT auth


Backend Location

services/api/


---

3.2 Folder Structure

services/api/
│
├── app/
│   ├── main.py
│   ├── api/
│   ├── graphql/
│   ├── core/
│   ├── db/
│   ├── models/
│   ├── schemas/
│   ├── services/
│   ├── repositories/
│   ├── middleware/
│   ├── dependencies/
│   ├── security/
│   ├── caching/
│   ├── observability/
│   └── workers/
│
├── tests/
├── alembic/
├── requirements/
├── Dockerfile
└── pyproject.toml


---

3.3 Core Backend Modules

app/core

app/core/
├── config.py
├── logging.py
├── exceptions.py
├── constants.py
└── lifecycle.py

app/db

app/db/
├── session.py
├── base.py
├── init.py
└── health.py

app/security

app/security/
├── jwt.py
├── password.py
├── permissions.py
├── dependencies.py
└── rate_limit.py


---

3.4 API Boundary Rules

GraphQL Use Cases

Use GraphQL for:

editorial content

admin dashboards

article editing

flexible frontend queries

AI-assisted editor flows


REST Use Cases

Use REST for:

stats endpoints

projections

betting lines

leaderboards

cached high-read data

health checks



---

3.5 REST Endpoint Structure

app/api/
├── v1/
│   ├── auth.py
│   ├── players.py
│   ├── tournaments.py
│   ├── stats.py
│   ├── projections.py
│   ├── betting.py
│   ├── rankings.py
│   ├── health.py
│   └── admin.py
└── router.py

Required REST Routes

GET    /api/v1/health
POST   /api/v1/auth/login
POST   /api/v1/auth/refresh
GET    /api/v1/players
GET    /api/v1/players/{player_id}
GET    /api/v1/tournaments
GET    /api/v1/tournaments/{tournament_id}
GET    /api/v1/stats/player/{player_id}
GET    /api/v1/projections
GET    /api/v1/projections/{player_id}
GET    /api/v1/betting/edges
GET    /api/v1/rankings/current


---

3.6 GraphQL Structure

app/graphql/
├── schema.py
├── context.py
├── queries/
├── mutations/
├── types/
├── inputs/
├── permissions/
└── dataloaders/

Required GraphQL Domains

Articles

Authors

Tags

Categories

SEO metadata

Article versions

AI generation requests

Admin users



---

3.7 Repository Layer

Purpose

Repositories own database access.

app/repositories/
├── player_repository.py
├── tournament_repository.py
├── stats_repository.py
├── projection_repository.py
├── betting_repository.py
├── article_repository.py
├── user_repository.py
└── ai_repository.py

Rule

No route, resolver, or service should contain raw SQL unless explicitly approved for performance-critical analytics queries.


---

3.8 Service Layer

Purpose

Services own business logic.

app/services/
├── auth_service.py
├── player_service.py
├── stats_service.py
├── projection_service.py
├── betting_service.py
├── article_service.py
├── seo_service.py
├── ai_grounding_service.py
└── audit_service.py


---

3.9 Authentication

Required Features

JWT access tokens

Refresh tokens

Password hashing

Role-based access control

API key support

Audit logging


Roles

admin
editor
analyst
subscriber
free_user
service


---

3.10 Authorization

Permission Format

resource:action

Examples

article:create
article:update
article:publish
projection:read
projection:premium_read
admin:manage_users
ai:generate


---

3.11 Caching Layer

Redis Cache Location

app/caching/
├── redis.py
├── keys.py
├── decorators.py
└── invalidation.py

Cache Priority

leaderboards

projections

rankings

player summaries

tournament pages

betting edges



---

3.12 API Performance Rules

Targets

REST stats endpoint: <150ms

Cached endpoint: <100ms

Materialized-view backed endpoint: <50ms

GraphQL admin query: <300ms


Required Protections

pagination

query limits

GraphQL depth limits

GraphQL complexity limits

Redis cache TTLs

database index validation



---

3.13 Observability

Module

app/observability/
├── metrics.py
├── tracing.py
├── logging.py
├── sentry.py
└── health.py

Required Signals

request latency

error rates

slow queries

cache hit rate

GraphQL complexity

failed auth attempts

background job failures



---

3.14 Error Handling

Standard Error Shape

{
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "Player not found",
    "details": {}
  }
}

Error Categories

validation_error

unauthorized

forbidden

not_found

conflict

rate_limited

internal_error



---

3.15 Middleware

app/middleware/
├── request_id.py
├── timing.py
├── cors.py
├── security_headers.py
├── rate_limit.py
└── audit.py


---

3.16 AI Grounding API

Required Backend Services

prompt injection service

source validation service

AI generation logger

hallucination flagging

editorial approval workflow


Required Endpoints

POST /api/v1/ai/editorial-assist
POST /api/v1/ai/validate-generation
GET  /api/v1/ai/generations/{generation_id}


---

3.17 Background Job Hooks

Worker Integration Points

projection recalculation

leaderboard refresh

betting line ingestion

article SEO regeneration

AI validation batch jobs

materialized view refresh



---

3.18 Testing Strategy

tests/
├── unit/
├── integration/
├── graphql/
├── security/
├── performance/
└── fixtures/

Required Coverage

auth

permissions

REST endpoints

GraphQL resolvers

repository queries

cache behavior

AI grounding validation



---

3.19 Docker Requirements

API Dockerfile Must Include

non-root user

locked dependencies

healthcheck

production-safe command

no dev reload in production



---

3.20 Backend Validation Checklist

Architecture

[ ] FastAPI app scaffolded

[ ] REST and GraphQL boundaries established

[ ] Repository layer implemented

[ ] Service layer implemented


Security

[ ] JWT auth implemented

[ ] RBAC enforced

[ ] Rate limiting prepared

[ ] GraphQL playground disabled in production


Performance

[ ] Redis caching implemented

[ ] Pagination enforced

[ ] Query limits enforced

[ ] Hot endpoints benchmarked


Observability

[ ] Structured logging active

[ ] Health checks exposed

[ ] Metrics emitted

[ ] Error tracking configured


Testing

[ ] Unit tests added

[ ] Integration tests added

[ ] Security tests added

[ ] API contract tests added



---

Phase 3 Exit Condition

Phase 3 is complete only when:

Backend service is production-structured

REST stats endpoints are operational

GraphQL editorial API is operational

Auth and RBAC are enforced

Redis caching is active

Observability is configured

AI grounding endpoints exist

Tests validate core backend behavior


Only after completion may Phase 4 Frontend Implementation begin.
