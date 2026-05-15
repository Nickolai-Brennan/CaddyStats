-- =============================================================================
-- 008-ingestion.sql
-- Schema: ingestion
-- Domain: Data Ingestion and Provider Sync
-- Owns: providers, sync_batches, sync_records, jobs, job_logs
-- Depends on: 001-bootstrap.sql
-- =============================================================================

-- ---------------------------------------------------------------------------
-- ingestion.providers
-- Registered external data providers. auth_config stores credentials
-- references (not raw keys) — actual secrets live in environment variables.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ingestion.providers (
  id           UUID        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name         TEXT        NOT NULL UNIQUE,
  slug         TEXT        NOT NULL UNIQUE,
  base_url     TEXT,
  auth_type    TEXT        NOT NULL DEFAULT 'api_key'
                 CHECK (auth_type IN ('api_key','oauth2','basic','none')),
  auth_config  JSONB       NOT NULL DEFAULT '{}',  -- stores key names, not values
  rate_limit   INTEGER,    -- requests per minute
  is_active    BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- ingestion.sync_batches
-- A single fetch operation against a provider for a given entity type.
-- Captures throughput and error counts for observability.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ingestion.sync_batches (
  id                UUID        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_id       UUID        NOT NULL REFERENCES ingestion.providers(id) ON DELETE CASCADE,
  batch_type        TEXT        NOT NULL,  -- 'players','rounds','odds','rankings','field', etc.
  tournament_id     UUID,                  -- nullable; populated for event-scoped fetches
  status            TEXT        NOT NULL DEFAULT 'pending'
                      CHECK (status IN ('pending','running','completed','partial','failed')),
  records_fetched   INTEGER     NOT NULL DEFAULT 0,
  records_processed INTEGER     NOT NULL DEFAULT 0,
  records_failed    INTEGER     NOT NULL DEFAULT 0,
  started_at        TIMESTAMPTZ,
  completed_at      TIMESTAMPTZ,
  duration_ms       INTEGER,
  error_summary     TEXT,
  metadata          JSONB       NOT NULL DEFAULT '{}',
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- ingestion.sync_records
-- Individual entity-level sync outcomes within a batch.
-- payload stores the raw fetched data (or a digest) for debugging.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ingestion.sync_records (
  id                  UUID        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  batch_id            UUID        NOT NULL REFERENCES ingestion.sync_batches(id) ON DELETE CASCADE,
  entity_type         TEXT        NOT NULL,
  provider_entity_id  TEXT        NOT NULL,
  internal_entity_id  UUID,
  status              TEXT        NOT NULL DEFAULT 'pending'
                        CHECK (status IN ('pending','inserted','updated','skipped','failed')),
  payload             JSONB,
  error_detail        TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- ingestion.jobs
-- Scheduled ingestion job definitions. schedule_cron uses standard cron
-- syntax. Jobs are claimed and executed by the ingestion worker.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ingestion.jobs (
  id              UUID        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_type        TEXT        NOT NULL UNIQUE,
  description     TEXT,
  provider_id     UUID        REFERENCES ingestion.providers(id) ON DELETE SET NULL,
  schedule_cron   TEXT,
  is_active       BOOLEAN     NOT NULL DEFAULT TRUE,
  last_run_at     TIMESTAMPTZ,
  last_status     TEXT,
  next_run_at     TIMESTAMPTZ,
  config          JSONB       NOT NULL DEFAULT '{}',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- ingestion.job_logs
-- Execution history for ingestion jobs. Links back to sync_batches when
-- the run produces one.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ingestion.job_logs (
  id            UUID        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id        UUID        NOT NULL REFERENCES ingestion.jobs(id) ON DELETE CASCADE,
  batch_id      UUID        REFERENCES ingestion.sync_batches(id) ON DELETE SET NULL,
  status        TEXT        NOT NULL CHECK (status IN ('started','completed','failed')),
  message       TEXT,
  duration_ms   INTEGER,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- ingestion.entity_id_maps
-- Cross-reference table mapping internal UUIDs to provider-specific IDs.
-- Avoids repeated JOIN lookups into provider_ids JSONB columns.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ingestion.entity_id_maps (
  id                  UUID        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  entity_type         TEXT        NOT NULL,  -- 'player','tournament','course'
  internal_id         UUID        NOT NULL,
  provider_slug       TEXT        NOT NULL REFERENCES ingestion.providers(slug) ON DELETE CASCADE,
  provider_entity_id  TEXT        NOT NULL,
  is_primary          BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_entity_id_map UNIQUE (entity_type, provider_slug, provider_entity_id)
);
