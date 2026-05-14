# Database — CaddyStats

This folder contains raw SQL assets for the CaddyStats PostgreSQL database: bootstrap schema, views, materialized views, functions, triggers, and seed stubs. Application-level migrations live in [`services/api/alembic/`](../services/api/alembic/).

---

## Table of Contents

- [Overview](#overview)
- [Supported Databases](#supported-databases)
  - [Local PostgreSQL (Docker)](#local-postgresql-docker)
  - [Neon (Managed PostgreSQL)](#neon-managed-postgresql)
  - [MotherDuck (DuckDB Cloud)](#motherduck-duckdb-cloud)
- [Schema Architecture](#schema-architecture)
- [Core Tables](#core-tables)
- [Materialized Views](#materialized-views)
- [Row Level Security](#row-level-security)
- [Folder Structure](#folder-structure)
- [Migrations](#migrations)
- [Seeding](#seeding)
- [Make Commands](#make-commands)
- [Environment Variables](#environment-variables)
- [Standards](#standards)

---

## Overview

CaddyStats uses **PostgreSQL 16** as the primary source of truth for all golf statistics, editorial content, projections, betting intelligence, and user data.

The database is organized into purpose-separated schemas, uses Alembic for version-controlled migrations, and enforces Row Level Security (RLS) on sensitive tables.

---

## Supported Databases

### Local PostgreSQL (Docker)

The recommended development environment. Spun up automatically with Docker Compose.

```bash
# Start the full stack (includes PostgreSQL on port 5432)
make dev

# Open a psql shell
make db-shell
```

Default connection string (from `.env.example`):

```
postgresql+asyncpg://postgres:postgres@localhost:5432/db_golf
```

---

### Neon (Managed PostgreSQL)

[Neon](https://neon.tech) is the preferred managed PostgreSQL provider for staging and production. It supports instant branching, serverless scaling, and connection pooling out of the box.

**Setup:**

1. Create a project at [neon.tech](https://neon.tech).
2. Copy the connection string from the Neon dashboard.
3. Set it in `.env`:

```env
DATABASE_URL=postgresql+asyncpg://<user>:<password>@<host>.neon.tech/caddystats?sslmode=require
```

**Branching (recommended for PRs and testing):**

```bash
# Install the Neon CLI
npm install -g neonctl

# Create a branch for your feature
neonctl branches create --name feature/my-branch

# Connect to a branch
neonctl connection-string feature/my-branch
```

> Neon branches are ephemeral copies of your database — ideal for testing migrations without touching production data.

---

### MotherDuck (DuckDB Cloud)

[MotherDuck](https://motherduck.com) is a DuckDB-based cloud analytics warehouse. It is used for **offline analytics, projection modeling, and bulk data analysis** — not as a transactional store.

**Use cases:**

- Exploratory analysis of historical golf stats exports
- Bulk projection model runs outside the production database
- Cross-database joins against external datasets

**Setup:**

1. Sign up at [motherduck.com](https://motherduck.com).
2. Authenticate with the MotherDuck CLI:

```bash
pip install duckdb
python -c "import duckdb; con = duckdb.connect('md:?motherduck_token=<YOUR_TOKEN>'); print(con.sql('SHOW DATABASES'))"
```

3. Attach a remote DuckDB database:

```python
import duckdb

con = duckdb.connect("md:CaddyStats?motherduck_token=<YOUR_TOKEN>")
con.sql("SELECT * FROM player_stats LIMIT 10").show()
```

> MotherDuck is **not** used for the live application API. Keep transactional data in PostgreSQL and use MotherDuck for analytics workloads.

---

## Schema Architecture

| Schema      | Purpose                                                     |
| ----------- | ----------------------------------------------------------- |
| `auth`      | Users, roles, permissions, RBAC join tables                 |
| `content`   | Articles, article blocks, editorial CMS data                |
| `stats`     | Players, tournaments, rounds, betting lines                 |
| `analytics` | Projections, materialized views (form, leaderboard, models) |
| `ai`        | AI prompt logs, grounding records, output audit trails      |
| `system`    | Shared utility functions (`set_updated_at`, RLS helpers)    |
| `ingestion` | Raw inbound data from external APIs before transformation   |
| `billing`   | Subscriptions, Stripe events, payment records               |

---

## Core Tables

### `auth` Schema

| Table                   | Description                            |
| ----------------------- | -------------------------------------- |
| `auth.users`            | Platform user accounts                 |
| `auth.roles`            | Role definitions (admin, editor, etc.) |
| `auth.permissions`      | Granular permission keys               |
| `auth.user_roles`       | User ↔ role join table                 |
| `auth.role_permissions` | Role ↔ permission join table           |

### `content` Schema

| Table                    | Description                               |
| ------------------------ | ----------------------------------------- |
| `content.articles`       | Editorial articles (slug, status, author) |
| `content.article_blocks` | Structured content blocks (JSONB)         |

### `stats` Schema

| Table                 | Description                                   |
| --------------------- | --------------------------------------------- |
| `stats.players`       | PGA player registry                           |
| `stats.tournaments`   | Tournament calendar                           |
| `stats.rounds`        | Per-round scorecards with strokes gained      |
| `stats.betting_lines` | Sportsbook odds by market type and sportsbook |

### `analytics` Schema

| Table                   | Description                                       |
| ----------------------- | ------------------------------------------------- |
| `analytics.projections` | Model-generated player projections per tournament |

---

## Materialized Views

Materialized views power high-read analytics dashboards and leaderboard queries. They must be refreshed after data loads.

| View                            | Description                                                    |
| ------------------------------- | -------------------------------------------------------------- |
| `analytics.player_recent_form`  | Last 8 rounds scored and strokes gained per player             |
| `analytics.leaderboard_summary` | Cumulative tournament scores and strokes gained                |
| `analytics.projection_overview` | Denormalized projection rows joined to player/tournament names |

**Refresh a materialized view:**

```sql
REFRESH MATERIALIZED VIEW CONCURRENTLY analytics.player_recent_form;
REFRESH MATERIALIZED VIEW CONCURRENTLY analytics.leaderboard_summary;
REFRESH MATERIALIZED VIEW CONCURRENTLY analytics.projection_overview;
```

---

## Row Level Security

RLS is enabled on sensitive tables. Access is controlled by two session-level settings:

| Setting               | Usage                                               |
| --------------------- | --------------------------------------------------- |
| `app.current_user_id` | UUID of the authenticated user                      |
| `app.current_role`    | Role string (`admin`, `editor`, `subscriber`, etc.) |

**Roles recognized by RLS policies:**

| Role         | Access Level                               |
| ------------ | ------------------------------------------ |
| `anonymous`  | Public published articles only             |
| `user`       | Own account data                           |
| `subscriber` | Betting lines + standard analytics         |
| `editor`     | Read/write editorial content               |
| `admin`      | Full write access to all non-system tables |
| `owner`      | Unrestricted access                        |

---

## Folder Structure

```text
database/
├── schemas/          # Bootstrap SQL files (run once at container init)
│   └── 001-bootstrap.sql
├── views/            # Standalone SQL view definitions (not materialized)
├── materialized/     # Materialized view SQL for documentation/replay
├── functions/        # Stored function definitions
├── triggers/         # Trigger definitions
└── seeds/            # Dev/test seed SQL stubs
```

> **Note:** Migrations are managed by Alembic and live in `services/api/alembic/versions/`. The SQL files in this folder are reference assets and used for Docker container initialization via `docker-entrypoint-initdb.d`.

---

## Migrations

Migrations use [Alembic](https://alembic.sqlalchemy.org/) and run inside the Docker API container.

```bash
# Apply all pending migrations
make db-migrate

# Roll back the last migration
make db-rollback

# Manually run Alembic from inside the container
docker compose exec api alembic upgrade head
docker compose exec api alembic downgrade -1

# Generate a new migration
docker compose exec api alembic revision --autogenerate -m "describe your change"
```

Migration files: `services/api/alembic/versions/`

---

## Seeding

Development seed data populates the database with sample players, tournaments, rounds, and content.

```bash
# Seed from the Makefile
make db-seed

# Or run manually inside the container
docker compose exec api python -m scripts.database.seed
```

Seed script: `services/api/scripts/database/seed.py`

---

## Make Commands

| Command            | Description                                  |
| ------------------ | -------------------------------------------- |
| `make dev`         | Start the full stack including PostgreSQL    |
| `make db-migrate`  | Apply all pending Alembic migrations         |
| `make db-rollback` | Roll back the last migration                 |
| `make db-seed`     | Seed development data                        |
| `make db-shell`    | Open a `psql` shell inside the container     |
| `make db-reset`    | Drop and recreate the database (destructive) |

---

## Environment Variables

Copy `.env.example` to `.env` and set these database variables:

| Variable                 | Description                                    | Example                                                    |
| ------------------------ | ---------------------------------------------- | ---------------------------------------------------------- |
| `POSTGRES_HOST`          | PostgreSQL host                                | `postgres` (Docker) or Neon hostname                       |
| `POSTGRES_PORT`          | PostgreSQL port                                | `5432`                                                     |
| `POSTGRES_DB`            | Database name                                  | `db_golf`                                                  |
| `POSTGRES_USER`          | Database user                                  | `postgres`                                                 |
| `POSTGRES_PASSWORD`      | Database password                              | `postgres`                                                 |
| `DATABASE_URL`           | Full async connection string (used by FastAPI) | `postgresql+asyncpg://postgres:postgres@host:5432/db_golf` |
| `DUCKDB_PATH`            | Local DuckDB file path                         | `./data/caddystats.duckdb`                                 |
| `MOTHERDUCK_URL`         | MotherDuck connection target                   | `md:CaddyStats`                                            |
| `MOTHERDUCK_TOKEN`       | MotherDuck auth token                          | `<SECRET>`                                                 |
| `PANDAS_QUERY_ROW_LIMIT` | Max rows returned by API pandas helpers        | `5000`                                                     |

For Neon, append `?sslmode=require` to `DATABASE_URL`.

---

## Standards

- All schema changes go through Alembic migrations — never alter production tables directly.
- Index all high-read fields (`tournament_id`, `player_id`, `status`, `published_at`, etc.).
- Use `JSONB` only for flexible structures like content blocks, projection inputs, and metadata payloads.
- Use materialized views for expensive aggregate queries on projections and leaderboards.
- `CONCURRENT` refresh on materialized views to avoid locking reads.
- Enable RLS on tables that contain user-specific or access-controlled data.
- Prefer normalized tables for stable entities: players, tournaments, rounds, users, roles.
- Never commit `.env` files containing real credentials.
