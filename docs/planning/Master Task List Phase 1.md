# Phase 1 — Folder Setup & Repository Structure

## Phase Objective

Establish the production-grade repository structure, module boundaries, configuration standards, environment strategy, and workspace organization required before database or application implementation begins.

Phase 1 creates the operational foundation for all future development.

---

## 1.1 Monorepo Strategy

### Architecture Decision

- Use a structured monorepo with isolated application domains and shared infrastructure modules.

### Repository Structure

```

```text
caddystats/
│
├── frontend/
├── backend/
├── packages/
├── infrastructure/
├── database/
├── workers/
├── ai/
├── docs/
├── scripts/
├── tests/
├── .github/
└── docker/
```

```

---

## 1.2 Root Repository Structure

### Master Folder Layout

```text
caddystats/
│
├── frontend/
│   ├── src/
│   ├── admin/
│   └── editor/
│
├── backend/
│   ├── app/
│   ├── requirements/
│   └── tests/
│
├── packages/
│   ├── ui/
│   ├── types/
│   ├── config/
│   ├── utils/
│   ├── analytics/
│   └── seo/
│
├── workers/
│   ├── simulations/
│   ├── projections/
│   ├── scraping/
│   ├── rankings/
│   └── ai-processing/
│
├── database/
│   ├── migrations/
│   ├── seeds/
│   ├── functions/
│   ├── views/
│   ├── materialized/
│   ├── triggers/
│   └── schemas/
│
├── infrastructure/
│   ├── docker/
│   ├── nginx/
│   ├── monitoring/
│   ├── terraform/
│   └── kubernetes/
│
├── ai/
│   ├── prompts/
│   ├── injections/
│   ├── evaluations/
│   ├── pipelines/
│   └── grounding/
│
├── docs/
│
├── scripts/
│   ├── setup/
│   ├── database/
│   ├── deployment/
│   └── maintenance/
│
├── tests/
│   ├── integration/
│   ├── performance/
│   ├── security/
│   └── e2e/
│
├── .github/
│   ├── workflows/
│   ├── ISSUE_TEMPLATE/
│   └── PULL_REQUEST_TEMPLATE/
│
├── docker/
│
├── .env.example
├── .gitignore
├── docker-compose.yml
├── Makefile
├── README.md
├── pnpm-workspace.yaml
└── turbo.json
```

---

## 1.3 Frontend Application Structure

frontend

```text
frontend/
│
├── public/
├── src/
│   ├── api/
│   ├── app/
│   ├── components/
│   ├── features/
│   ├── hooks/
│   ├── layouts/
│   ├── pages/
│   ├── routes/
│   ├── services/
│   ├── state/
│   ├── styles/
│   ├── types/
│   └── utils/
│
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## 1.4 Backend Service Structure

backend

```text
backend/
│
├── app/
│   ├── api/
│   ├── graphql/
│   ├── core/
│   ├── models/
│   ├── schemas/
│   ├── services/
│   ├── repositories/
│   ├── middleware/
│   ├── dependencies/
│   ├── workers/
│   ├── caching/
│   ├── observability/
│   └── security/
│
├── tests/
├── alembic/
├── requirements/
├── Dockerfile
└── pyproject.toml
```

---

## 1.5 Shared Package Standards

packages/ui

```text
packages/ui/
│
├── src/
│   ├── components/
│   ├── layouts/
│   ├── charts/
│   ├── tables/
│   ├── forms/
│   └── themes/
│
├── package.json
└── tsconfig.json
```

packages/types

```text
packages/types/
│
├── src/
│   ├── api/
│   ├── stats/
│   ├── projections/
│   ├── editorial/
│   └── betting/
```

---

## 1.6 Database Folder Standards

Schema Separation

```text
database/schemas/
│
├── content/
├── stats/
├── auth/
├── analytics/
├── ai/
└── system/
```

Migration Strategy

```text
database/migrations/
│
├── content/
├── stats/
├── auth/
├── analytics/
└── shared/
```

---

## 1.7 Infrastructure Standards

Docker Organization

```text
infrastructure/docker/
│
├── api/
├── frontend/
├── postgres/
├── redis/
├── workers/
└── nginx/
```

Monitoring Structure

```text
infrastructure/monitoring/
│
├── grafana/
├── prometheus/
├── loki/
└── alerts/
```

---

## 1.8 AI System Organization

Prompt Architecture

```text
ai/prompts/
│
├── editorial/
├── seo/
├── projections/
├── summaries/
└── betting/
```

Grounding Architecture

```text
ai/grounding/
│
├── injections/
├── validators/
├── sources/
└── observability/
```

---

## 1.9 Environment Configuration Standards

Required Environment Files

.env
.env.local
.env.development
.env.production
.env.staging
.env.test
.env.example

Environment Categories

Infrastructure

DATABASE_URL

REDIS_URL

CDN_URL

Security

JWT_SECRET

ENCRYPTION_KEY

API_KEYS

### AI

OPENAI_API_KEY

MODEL_ROUTER_KEY

Monitoring

SENTRY_DSN

GRAFANA_URL

---

## 1.10 Root Configuration Standards

Required Root Files

Tooling

turbo.json

pnpm-workspace.yaml

.editorconfig

.prettierrc

.eslintrc

.python-version

CI/CD

.github/workflows/ci.yml

.github/workflows/deploy.yml

Containers

docker-compose.yml

Build

Makefile

---

## 1.11 Naming Convention Standards

Folder Naming

kebab-case for infrastructure

snake_case for database objects

PascalCase for React components

lowercase package names

File Naming

### Frontend

PlayerCard.tsx
TournamentTable.tsx
useProjections.ts

Backend

projection_service.py
player_repository.py
stats_resolver.py

---

## 1.12 Git Workflow Initialization

Branch Structure

main
develop
staging
feature/*
hotfix/*

Commit Standard

feat:
fix:
docs:
refactor:
perf:
test:
infra:
security:

---

## 1.13 Build Tooling Setup

### Frontend

Vite

TypeScript

TanStack Query

TanStack Table

React Router

Backend

FastAPI

Strawberry GraphQL

SQLAlchemy

Alembic

Shared

pnpm workspaces

TurboRepo

---

## 1.14 Initial DevOps Bootstrap

Base Services

- postgres
- redis
- api
- web
- nginx
- worker

Required Containers

PostgreSQL

Redis

FastAPI

React frontend

Nginx reverse proxy

Background workers

---

## 1.15 Security Baseline Setup

Required Defaults

Git

secret scanning

branch protection

Backend

environment validation

CORS policy

rate limiting prep

### Frontend

CSP planning

secure env separation

---

## 1.16 Documentation Initialization

Required Files

README.md
CHANGELOG.md
CONTRIBUTING.md
ARCHITECTURE.md
SECURITY.md

---

## 1.17 Repository Automation

GitHub Actions

CI Pipeline

lint

test

type-check

security scan

Deployment Pipeline

build containers

push registry

deploy staging

deploy production

---

## 1.18 Scalability Preparation

Early Structure Requirements

horizontal worker expansion

modular service isolation

reusable analytics packages

AI pipeline isolation

multi-author editorial support

---
---

## 1.16 Additional Required Tasks Identified

### Tasks

- Align the target root structure with the approved `frontend/`, `backend/`, `database/`, `api/`, `tests/`, `docs/`, `config/`, `plugins/`, and `commands/` ownership model.
- Add CODEOWNERS, issue templates, pull request templates, and baseline docs-check or architecture-drift automation placeholders.
- Add `.env.example`, secret-handling conventions, and local bootstrap or verification script placeholders.
- Add README or ownership stubs for each top-level domain directory so later phases inherit clear responsibilities.

## PHASE 1 VALIDATION CHECKLIST

Repository

[ ] Monorepo initialized

[ ] Workspace tooling configured

[ ] Folder structure finalized

### Frontend

[ ] React apps scaffolded

[ ] Shared UI package initialized

Backend

[ ] FastAPI services scaffolded

[ ] GraphQL structure prepared

### Database

[ ] Migration folders initialized

[ ] Schema separation established

Infrastructure

[ ] Docker structure initialized

[ ] Monitoring folders prepared

### AI

[ ] Prompt architecture initialized

[ ] Grounding structure prepared

DevOps

[ ] CI/CD workflow stubs created

[ ] Environment strategy documented

Security

[ ] Security baseline established

[ ] Secret handling rules defined

---

## PHASE 1 EXIT CONDITION

Phase 1 is complete only when:

Repository structure is production-ready

Shared package architecture exists

Environment strategy is established

CI/CD scaffolding exists

Docker structure is prepared

Security baselines are initialized

All services have defined boundaries

Folder standards are enforced

Only after completion may Phase 2 Database Implementation begin.
