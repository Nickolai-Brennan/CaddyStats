## Database Foundation

- PostgreSQL is the source of truth for operational, editorial, and analytics data.
- Foundational schemas: `auth`, `content`, `stats`, `analytics`, `ai`, `system`, `ingestion`, `billing`.
- Alembic migrations live under `/home/runner/work/CaddyStats/CaddyStats/services/api/alembic`.
- Local seed entrypoint: `cd /home/runner/work/CaddyStats/CaddyStats/services/api && python -m scripts.database.seed`

### Initial database objects

- Core tables: `auth.users`, `auth.roles`, `auth.permissions`, `content.articles`, `content.article_blocks`, `stats.players`, `stats.tournaments`, `stats.rounds`, `analytics.projections`, `stats.betting_lines`
- RLS scaffolding on auth, editorial, projections, and betting tables
- Materialized views:
  - `analytics.player_recent_form`
  - `analytics.leaderboard_summary`
  - `analytics.projection_overview`

### Validation targets

- Alembic upgrade/downgrade smoke-tested in `services/api/tests/test_database_foundation.py`
- Seed data loader refreshes the initial materialized views after inserts
- High-read indexes verified by automated integration assertions

