-- =============================================================================
-- 005-analytics.sql
-- Schema: analytics
-- Domain: Analytics and Instrumentation
-- Owns: page_views, events, feature_usage, conversion_events,
--       search_queries, ab_test_assignments
-- Depends on: 001-bootstrap.sql, 002-auth.sql
-- =============================================================================

-- ---------------------------------------------------------------------------
-- analytics.page_views
-- Client-side page impressions. user_id is nullable for anonymous visitors.
-- entity_type + entity_id allow attribution to specific golf entities.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS analytics.page_views (
  id            UUID        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id    TEXT        NOT NULL,
  user_id       UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  url           TEXT        NOT NULL,
  referrer      TEXT,
  entity_type   TEXT,       -- 'player', 'tournament', 'article', 'course', etc.
  entity_id     UUID,
  duration_ms   INTEGER,
  bot_score     NUMERIC(4,2),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
) PARTITION BY RANGE (created_at);

-- Monthly partitions bootstrapped for the first two years
CREATE TABLE IF NOT EXISTS analytics.page_views_2025_01 PARTITION OF analytics.page_views
  FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');
CREATE TABLE IF NOT EXISTS analytics.page_views_2025_q2 PARTITION OF analytics.page_views
  FOR VALUES FROM ('2025-04-01') TO ('2025-07-01');
CREATE TABLE IF NOT EXISTS analytics.page_views_2025_q3 PARTITION OF analytics.page_views
  FOR VALUES FROM ('2025-07-01') TO ('2025-10-01');
CREATE TABLE IF NOT EXISTS analytics.page_views_2025_q4 PARTITION OF analytics.page_views
  FOR VALUES FROM ('2025-10-01') TO ('2026-01-01');
CREATE TABLE IF NOT EXISTS analytics.page_views_2026_q1 PARTITION OF analytics.page_views
  FOR VALUES FROM ('2026-01-01') TO ('2026-04-01');
CREATE TABLE IF NOT EXISTS analytics.page_views_2026_q2 PARTITION OF analytics.page_views
  FOR VALUES FROM ('2026-04-01') TO ('2026-07-01');
CREATE TABLE IF NOT EXISTS analytics.page_views_2026_q3 PARTITION OF analytics.page_views
  FOR VALUES FROM ('2026-07-01') TO ('2026-10-01');
CREATE TABLE IF NOT EXISTS analytics.page_views_2026_q4 PARTITION OF analytics.page_views
  FOR VALUES FROM ('2026-10-01') TO ('2027-01-01');
CREATE TABLE IF NOT EXISTS analytics.page_views_future PARTITION OF analytics.page_views
  FOR VALUES FROM ('2027-01-01') TO ('2099-01-01');

-- ---------------------------------------------------------------------------
-- analytics.events
-- Named client-side or server-side events. properties is a flexible JSONB
-- payload for event-specific attributes.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS analytics.events (
  id          UUID        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id  TEXT        NOT NULL,
  user_id     UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  event_name  TEXT        NOT NULL,
  properties  JSONB       NOT NULL DEFAULT '{}',
  ip_address  INET,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- analytics.feature_usage
-- Tracks which features authenticated users interact with.
-- Used for product analytics and entitlement-aware usage reports.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS analytics.feature_usage (
  id          UUID        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  feature_key TEXT        NOT NULL,
  action      TEXT        NOT NULL,
  context     JSONB       NOT NULL DEFAULT '{}',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- analytics.conversion_events
-- Funnel step completions for subscription and onboarding flows.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS analytics.conversion_events (
  id          UUID        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id  TEXT,
  funnel_step TEXT        NOT NULL,
  source      TEXT,
  properties  JSONB       NOT NULL DEFAULT '{}',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- analytics.search_queries
-- Captures internal site search activity for content discovery and SEO gaps.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS analytics.search_queries (
  id           UUID        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id   TEXT        NOT NULL,
  user_id      UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  query_text   TEXT        NOT NULL,
  result_count INTEGER,
  clicked_id   UUID,
  clicked_type TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- analytics.ab_test_assignments
-- Variant assignments for A/B or multivariate experiments.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS analytics.ab_test_assignments (
  id             UUID        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  experiment_key TEXT        NOT NULL,
  variant_key    TEXT        NOT NULL,
  user_id        UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id     TEXT,
  assigned_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_ab_assignment UNIQUE (experiment_key, user_id, session_id)
);
