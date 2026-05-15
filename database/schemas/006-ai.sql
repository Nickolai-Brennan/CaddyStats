-- =============================================================================
-- 006-ai.sql
-- Schema: ai
-- Domain: AI, Governance, and Audit
-- Owns: prompt_versions, output_logs, editorial_review_logs
-- Depends on: 001-bootstrap.sql, 002-auth.sql
-- =============================================================================

-- ---------------------------------------------------------------------------
-- ai.prompt_versions
-- Versioned prompt templates used by AI-assisted workflows. Only one version
-- per name should be active at a time; enforced at application layer.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ai.prompt_versions (
  id           UUID        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name         TEXT        NOT NULL,
  version      TEXT        NOT NULL,
  content      TEXT        NOT NULL,
  model_hint   TEXT,       -- suggested model identifier for this prompt
  purpose      TEXT,       -- 'article_draft','block_generation','seo_meta','model_analysis', etc.
  is_active    BOOLEAN     NOT NULL DEFAULT FALSE,
  created_by   UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_prompt_version UNIQUE (name, version)
);

-- ---------------------------------------------------------------------------
-- ai.output_logs
-- Immutable audit record for every AI-assisted generation or transformation.
-- output_status tracks whether output was used, modified, or discarded.
-- source_refs is a JSONB array of {type, id} references grounding the output.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ai.output_logs (
  id                UUID        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  prompt_version_id UUID        REFERENCES ai.prompt_versions(id) ON DELETE SET NULL,
  user_id           UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  article_version_id UUID,      -- FK applied after content schema; nullable for non-content AI
  model_identifier  TEXT        NOT NULL,
  grounding_status  TEXT        NOT NULL DEFAULT 'unverified'
                      CHECK (grounding_status IN ('unverified','grounded','partially_grounded','failed')),
  output_status     TEXT        NOT NULL DEFAULT 'pending'
                      CHECK (output_status IN ('pending','used','modified','discarded','flagged')),
  reviewer_state    TEXT        NOT NULL DEFAULT 'pending'
                      CHECK (reviewer_state IN ('pending','approved','rejected','skipped')),
  reviewer_id       UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at       TIMESTAMPTZ,
  input_summary     JSONB       NOT NULL DEFAULT '{}',
  output_text       TEXT,
  source_refs       JSONB       NOT NULL DEFAULT '[]',
  token_count_in    INTEGER,
  token_count_out   INTEGER,
  latency_ms        INTEGER,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- ai.editorial_review_logs
-- Audit trail for content review and publishing decisions. Every status
-- transition on an article that involves a human actor is recorded here.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ai.editorial_review_logs (
  id                 UUID        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  article_id         UUID        NOT NULL,  -- FK applied after content schema
  article_version_id UUID,
  action             TEXT        NOT NULL
                       CHECK (action IN ('submitted','reviewed','approved','rejected',
                                         'published','unpublished','archived','flagged')),
  actor_id           UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  notes              TEXT,
  decision           TEXT,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- ai.grounding_sources
-- Named data sources that can be cited as grounding evidence in output_logs.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ai.grounding_sources (
  id          UUID        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT        NOT NULL UNIQUE,
  source_type TEXT        NOT NULL
                CHECK (source_type IN ('database_query','api_response','document','manual','calculated')),
  description TEXT,
  is_trusted  BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
