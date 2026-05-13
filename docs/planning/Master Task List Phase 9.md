# Phase 9 — Hosting & Infrastructure Deployment

## Phase Objective

Deploy Caddy Stats into a production-ready hosting environment with secure containers, managed PostgreSQL, Redis, CDN, SSL, CI/CD, monitoring, logging, backups, and rollback procedures.

---

## 9.1 Infrastructure Architecture

### Core Services

- Production Infrastructure

```text
├── Web frontend
├── Editor app
├── Admin app
├── FastAPI backend
├── PostgreSQL
├── Redis
├── Background workers
├── Nginx reverse proxy
├── CDN
├── Object storage
├── Monitoring
└── CI/CD
```

---

## 9.2 Environment Strategy

### Required Environments

- local
- development
- staging
- production

### Environment Rules

- production secrets isolated

- staging mirrors production

- local uses Docker Compose

- development supports seeded data

- production disables debug tooling

- GraphQL playground disabled outside local

---

## 9.3 Hosting Responsibilities

### Frontend Hosting

frontend

CDN-backed static hosting

cache headers

SSL enabled

route fallback for React Router

### Editor Hosting

frontend/editor

protected behind auth

noindex headers

restricted access policy

### Admin Hosting

frontend/admin

restricted access

noindex headers

stronger RBAC enforcement

### API Hosting

backend

containerized FastAPI

autoscaling-ready

health checks

rate limiting

---

## 9.4 Docker Architecture

```text
infrastructure/docker/
├── api/
│   └── Dockerfile
├── web/
│   └── Dockerfile
├── editor/
│   └── Dockerfile
├── admin/
│   └── Dockerfile
├── worker/
│   └── Dockerfile
├── nginx/
│   └── nginx.conf
└── postgres/
    └── init.sql
```

---

## 9.5 Production Docker Standards

### Required

- multi-stage builds

- non-root runtime users

- pinned dependency versions

- minimal base images

- no dev reload commands

- health checks

- explicit environment variables

- secrets injected at runtime

- no secrets baked into images

---

## 9.6 Docker Compose Local Stack

### File

docker-compose.yml

### Services

- postgres
- redis
- api
- web
- editor
- admin
- worker
- nginx

### Local Requirements

- seeded PostgreSQL data

- Redis cache

- hot reload where appropriate

- isolated local volumes

- health checks for all services

---

## 9.7 Managed PostgreSQL

### Requirements

- automated backups

- point-in-time recovery

- SSL required

- private networking preferred

- read replica support

- connection pooling

- monitoring enabled

- restricted roles

### Production Add-ons

- pgBouncer

- read replica

- WAL archiving

- slow query logging

---

## 9.8 Redis Hosting

### Use Cases

API response cache

session-adjacent cache

rate limiting

job queues

materialized view refresh locks

### Requirements

- managed Redis preferred

- TLS enabled

- eviction policy documented

- persistence strategy defined

- restricted network access

---

## 9.9 Object Storage

### Use Cases

article images

generated OG images

export files

reports

media uploads

temporary AI artifacts

### Requirements

- private bucket by default

- CDN-backed public assets

- signed upload URLs

- lifecycle policies

- malware scanning hook

---

## 9.10 CDN Strategy

CDN Responsibilities

serve static frontend

serve media assets

cache public API responses where safe

cache sitemap files

cache public images

protect origin

Cache Categories

static assets: 1 year immutable
article pages: 5–15 minutes
sitemaps: 1 hour
API public rankings: 1–5 minutes
premium/API auth: no shared cache

---

## 9.11 Nginx Reverse Proxy

Responsibilities

route traffic to API/web/editor/admin

gzip/brotli compression

security headers

request size limits

timeout controls

upstream health checks

Routes

/                  → web
/api/              → api
/graphql           → api
/editor/           → editor
/admin/            → admin

---

## 9.12 SSL & Domain Strategy

### Required Domains

caddystats.com
www.caddystats.com
api.caddystats.com
editor.caddystats.com
admin.caddystats.com
cdn.caddystats.com

### Requirements

- HTTPS everywhere

- automatic certificate renewal

- HSTS enabled

- canonical domain redirect

- www/non-www policy documented

---

## 9.13 CI/CD Architecture

GitHub Actions

```text
.github/workflows/
├── ci.yml
├── test.yml
├── security.yml
├── build-images.yml
├── deploy-staging.yml
└── deploy-production.yml
```

---

## 9.14 CI Pipeline

Required Checks

TypeScript type check

frontend lint

backend lint

backend tests

frontend tests

database migration check

Docker build check

dependency vulnerability scan

secret scan

---

## 9.15 Deployment Pipeline

Staging

deploy on merge to develop

run migrations

smoke test API

smoke test web

validate sitemap

validate GraphQL disabled settings

notify deployment channel

Production

deploy from tagged release

manual approval required

backup before migration

run migrations

deploy API

deploy workers

deploy frontend

run smoke tests

verify monitoring

record changelog entry

---

## 9.16 Secrets Management

### Rules

- no secrets in repo

- no secrets in images

- rotate production secrets

- scoped service credentials

- encrypted CI secrets

- environment-specific secrets

- audit secret access

- Required Secrets

- DATABASE_URL
- REDIS_URL
- JWT_SECRET
- ENCRYPTION_KEY
- OPENAI_API_KEY
- SENTRY_DSN
- OBJECT_STORAGE_KEY
- OBJECT_STORAGE_SECRET
- CDN_PURGE_TOKEN

---

## 9.17 Observability Stack

Required Tools

structured logs

metrics

tracing

error tracking

uptime checks

database monitoring

Redis monitoring

Suggested Stack

Prometheus
Grafana
Loki
Sentry
OpenTelemetry

---

## 9.18 Monitoring Dashboards

Required Dashboards

API latency

error rate

request volume

database performance

Redis cache hit rate

worker queue depth

AI token usage

projection job duration

sitemap generation status

subscription/payment health

---

## 9.19 Alerting Rules

Critical Alerts

API down

database unavailable

Redis unavailable

migration failure

worker queue stalled

high 5xx rate

auth failure spike

storage upload failure

backup failure

Warning Alerts

high API latency

low cache hit rate

slow queries

high token cost

stale projections

sitemap generation failure

---

## 9.20 Logging Standards

Required Log Fields

timestamp
level
request_id
user_id
service
route
latency_ms
status_code
error_code
environment

### Rules

- redact secrets

- redact tokens

- redact raw payment data

- redact sensitive user fields

- preserve audit logs separately

---

## 9.21 Background Worker Deployment

Worker Types

projection_worker
simulation_worker
ingestion_worker
seo_worker
ai_validation_worker
email_worker

### Requirements

- isolated queue names

- retry policies

- dead-letter queues

- concurrency limits

- idempotent jobs

- job timeout limits

---

## 9.22 Database Migration Deployment

### Rules

- migrations run before app rollout when backward-compatible

- destructive migrations require two-step rollout

- backup before production migrations

- migration logs stored

- rollback plan required

- migrations executed by migration_role

---

## 9.23 Backup & Recovery

### Required

- nightly PostgreSQL backups

- point-in-time recovery

- object storage lifecycle backups

- Redis persistence policy

- backup restore testing

- disaster recovery runbook

- Recovery Targets

- RPO: 15 minutes for database

- RTO: 2 hours for critical API recovery

---

## 9.24 Security Headers

Required Headers

Strict-Transport-Security
Content-Security-Policy
X-Content-Type-Options
X-Frame-Options
Referrer-Policy
Permissions-Policy

---

## 9.25 Rate Limiting

API Rate Limit Categories

anonymous_public
authenticated_free
subscriber
editor
admin
service_internal

High-Risk Routes

login

password reset

AI generation

media upload

GraphQL

betting edges export

---

## 9.26 Production Health Checks

### API

GET /api/v1/health
GET /api/v1/health/db
GET /api/v1/health/redis
GET /api/v1/health/workers

### Frontend

root page loads

article route loads

rankings route loads

premium gate route loads

---

## 9.27 Rollback Strategy

Required Rollback Types

frontend rollback

API image rollback

worker rollback

database rollback

config rollback

feature flag rollback

### Rule

Database rollback must be planned before migration, not after failure.

---

## 9.28 Feature Flags

Required Flags

premium_dashboard_enabled

ai_editor_assist_enabled

betting_edges_enabled

public_projections_enabled

new_rankings_model_enabled

editor_workflow_enabled

---

## 9.29 Infrastructure Documentation

```text
docs/devops/
├── environment-strategy.md
├── deployment-runbook.md
├── rollback-runbook.md
├── monitoring.md
├── secrets-management.md
├── backup-recovery.md
├── incident-response.md
└── production-checklist.md
```

---

## 9.17 Additional Required Tasks Identified

### Tasks

- Add explicit RTO, RPO, failover, and disaster-recovery runbook requirements.
- Add secret rotation, container or dependency scanning, and environment-promotion control tasks.
- Add CDN or WAF caching, origin protection, and rollout verification requirements.
- Add deployment rollback rehearsals and restore-validation checkpoints.

## Phase 9 Validation Checklist

Hosting

[ ] Production hosting selected

[ ] Domains mapped

[ ] SSL configured

[ ] CDN enabled

Containers

[ ] Dockerfiles production-safe

[ ] Non-root users configured

[ ] Health checks added

[ ] Docker Compose works locally

### Database

[ ] Managed PostgreSQL configured

[ ] Backups enabled

[ ] SSL required

[ ] Connection pooling configured

Redis

[ ] Redis provisioned

[ ] TLS enabled

[ ] Cache policy documented

CI/CD

[ ] CI workflow added

[ ] Security workflow added

[ ] Staging deploy configured

[ ] Production deploy gated

Observability

[ ] Metrics configured

[ ] Logs structured

[ ] Error tracking enabled

[ ] Alerts configured

Security

[ ] Secrets isolated

[ ] Security headers configured

[ ] Rate limits active

[ ] GraphQL playground disabled in production

Recovery

[ ] Backups verified

[ ] Rollback process documented

[ ] Disaster recovery runbook created

---

## Phase 9 Exit Condition

Phase 9 is complete only when:

Production hosting architecture is defined

Docker builds are production-safe

Managed PostgreSQL and Redis are configured

CI/CD pipelines are operational

SSL and CDN are active

Secrets are isolated

Observability is live

Alerts are configured

Backups are tested

Rollback runbooks exist

Production smoke tests pass

Only after completion may Phase 10 Admin Systems begin.
---
