# Caddy Stats — Stack Environments & Connectivity

## Document Purpose
Define the required stack environments for Caddy Stats and ensure the frontend, backend, API, databases, Redis, workers, and supporting services are connected, active, observable, and production-ready.

---

# 1. Environment Strategy

## Required Environments

```txt
local
staging
production
```

## Global Service Graph

```txt
frontend → API → PostgreSQL
frontend → API → Redis
API → workers → PostgreSQL
API → workers → Redis
API → object storage
API → AI provider
API → email provider
API → payment provider
```

---

# 2. Core Services

```txt
apps/web
apps/editor
apps/admin
services/api
postgres
redis
workers
nginx
object_storage
monitoring
```

---

# 3. Local Environment

## Local URLs

```txt
web:      http://localhost:3000
editor:   http://localhost:3001
admin:    http://localhost:3002
api:      http://localhost:8000
graphql:  http://localhost:8000/graphql
postgres: localhost:5432
redis:    localhost:6379
```

## Local Environment Variables

```env
APP_ENV=local

DATABASE_URL=postgresql+asyncpg://caddystats:caddystats@postgres:5432/caddystats_local
REDIS_URL=redis://redis:6379/0

VITE_API_URL=http://localhost:8000/api/v1
VITE_GRAPHQL_URL=http://localhost:8000/graphql
```

---

# 4. Staging Environment

## Domains

```txt
staging.caddystats.com
api-staging.caddystats.com
editor-staging.caddystats.com
admin-staging.caddystats.com
```

---

# 5. Production Environment

## Domains

```txt
caddystats.com
api.caddystats.com
editor.caddystats.com
admin.caddystats.com
cdn.caddystats.com
```

---

# 6. API Health Endpoints

```txt
GET /api/v1/health
GET /api/v1/health/db
GET /api/v1/health/redis
GET /api/v1/health/workers
GET /api/v1/health/storage
GET /api/v1/health/integrations
```

---

# 7. Frontend Connection Requirements

## Web App

```txt
apps/web
```

Must connect to:

```txt
VITE_API_URL
VITE_GRAPHQL_URL
VITE_CDN_URL
```

---

# 8. Backend Connection Requirements

## FastAPI Service

```txt
services/api
```

Must connect to:

```txt
PostgreSQL
Redis
Object storage
AI provider
Email provider
Payment provider
Data providers
```

---

# 9. PostgreSQL Requirements

## Required Schemas

```txt
auth
content
stats
analytics
ai
system
ingestion
billing
```

---

# 10. Redis Requirements

## Queue Names

```txt
ingestion
projections
simulations
seo
ai_validation
email
billing
```

---

# 11. Docker Compose Requirements

## Required Services

```yaml
services:
  postgres:
    image: postgres:16

  redis:
    image: redis:7

  api:
    build: ./services/api

  web:
    build: ./apps/web

  editor:
    build: ./apps/editor

  admin:
    build: ./apps/admin

  worker:
    build: ./services/api

  nginx:
    build: ./infrastructure/docker/nginx
```

---

# 12. Reverse Proxy Routing

```txt
/             → web
/api/         → api
/graphql      → api
/editor/      → editor
/admin/       → admin
```

---

# 13. Environment Startup Order

```txt
1. PostgreSQL
2. Redis
3. Database migrations
4. API
5. Workers
6. Web frontend
7. Editor frontend
8. Admin frontend
9. Nginx/CDN routing
10. Health checks
```

---

# 14. Smoke Tests

## Local

```txt
GET http://localhost:8000/api/v1/health
GET http://localhost:8000/api/v1/health/db
GET http://localhost:8000/api/v1/health/redis
GET http://localhost:3000
GET http://localhost:3001
GET http://localhost:3002
```

---

# 15. Monitoring Requirements

## Required Metrics

```txt
api_up
database_up
redis_up
worker_queue_depth
api_latency_ms
api_error_rate
frontend_5xx_rate
database_connection_count
redis_cache_hit_rate
migration_status
```

---

# 16. Validation Gate

## Local Must Pass

- Docker Compose boots all services
- API health endpoint returns ok
- API connects to PostgreSQL
- API connects to Redis
- Web frontend reaches API
- Editor reaches API
- Admin reaches API
- Workers connect to Redis queues
- Migrations are current

---

# 17. Final Exit Condition

The stack environment is considered active only when:

- frontend apps load successfully
- API health endpoint returns ok
- API connects to PostgreSQL
- API connects to Redis
- workers connect to queues
- migrations are current
- database schemas exist
- CORS is environment-specific
- SSL is active outside local
- monitoring confirms service health
- smoke tests pass
- failures are observable
- rollback path exists
