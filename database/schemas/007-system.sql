-- =============================================================================
-- 007-system.sql
-- Schema: system
-- Domain: System Operations and Audit
-- Owns: audit_events, config, health_checks, feature_flags
-- Depends on: 001-bootstrap.sql, 002-auth.sql
-- =============================================================================

-- ---------------------------------------------------------------------------
-- system.audit_events
-- Generic operational event log for sensitive, privileged, or destructive
-- actions. before_summary and after_summary capture minimal change context
-- without storing full payloads; never store secrets here.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS system.audit_events (
  id              UUID        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  actor_id        UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  actor_role      TEXT,
  action          TEXT        NOT NULL,
  target_type     TEXT        NOT NULL,
  target_id       UUID,
  target_slug     TEXT,
  before_summary  JSONB       DEFAULT '{}',
  after_summary   JSONB       DEFAULT '{}',
  request_context JSONB       DEFAULT '{}',  -- {ip, user_agent, request_id} — no raw headers
  outcome         TEXT        NOT NULL DEFAULT 'success'
                    CHECK (outcome IN ('success','failure','partial')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
) PARTITION BY RANGE (created_at);

CREATE TABLE IF NOT EXISTS system.audit_events_2025 PARTITION OF system.audit_events
  FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');
CREATE TABLE IF NOT EXISTS system.audit_events_2026 PARTITION OF system.audit_events
  FOR VALUES FROM ('2026-01-01') TO ('2027-01-01');
CREATE TABLE IF NOT EXISTS system.audit_events_future PARTITION OF system.audit_events
  FOR VALUES FROM ('2027-01-01') TO ('2099-01-01');

-- ---------------------------------------------------------------------------
-- system.config
-- Runtime key-value configuration store. is_secret flags prevent values
-- from being returned in general-purpose config queries. Secrets must
-- never be stored here; use this only for non-sensitive runtime settings.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS system.config (
  id          UUID        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key         TEXT        NOT NULL UNIQUE,
  value       JSONB       NOT NULL DEFAULT 'null',
  description TEXT,
  is_secret   BOOLEAN     NOT NULL DEFAULT FALSE,
  updated_by  UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- system.health_checks
-- Periodic service liveness and readiness snapshots written by workers.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS system.health_checks (
  id           UUID        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_name TEXT        NOT NULL,
  status       TEXT        NOT NULL CHECK (status IN ('healthy','degraded','unhealthy','unknown')),
  details      JSONB       NOT NULL DEFAULT '{}',
  checked_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- system.feature_flags
-- Runtime feature gates. enabled_for_roles is a JSONB array of role names.
-- Rollout_percentage drives percentage-based gradual rollouts (0–100).
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS system.feature_flags (
  id                  UUID        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key                 TEXT        NOT NULL UNIQUE,
  description         TEXT,
  is_enabled          BOOLEAN     NOT NULL DEFAULT FALSE,
  enabled_for_roles   JSONB       NOT NULL DEFAULT '[]',
  rollout_percentage  INTEGER     NOT NULL DEFAULT 0
                        CHECK (rollout_percentage BETWEEN 0 AND 100),
  metadata            JSONB       NOT NULL DEFAULT '{}',
  updated_by          UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- system.background_jobs
-- Registry for scheduled or queued background jobs. Provides a lightweight
-- job ledger before a dedicated queue system is added.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS system.background_jobs (
  id             UUID        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_type       TEXT        NOT NULL,
  status         TEXT        NOT NULL DEFAULT 'pending'
                   CHECK (status IN ('pending','running','completed','failed','cancelled')),
  payload        JSONB       NOT NULL DEFAULT '{}',
  result         JSONB,
  error_detail   TEXT,
  priority       INTEGER     NOT NULL DEFAULT 5,
  scheduled_for  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  started_at     TIMESTAMPTZ,
  completed_at   TIMESTAMPTZ,
  retry_count    INTEGER     NOT NULL DEFAULT 0,
  max_retries    INTEGER     NOT NULL DEFAULT 3,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
