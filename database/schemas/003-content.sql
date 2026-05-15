-- =============================================================================
-- 003-content.sql
-- Schema: content
-- Domain: Content and Publishing
-- Owns: authors, tags, templates, articles, article_versions,
--       article_blocks, article_tags
-- Depends on: 001-bootstrap.sql, 002-auth.sql
-- =============================================================================

-- ---------------------------------------------------------------------------
-- content.authors
-- Public-facing editorial identities. May map to an internal auth.users
-- record but supports external or byline-only authors without system accounts.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS content.authors (
  id           UUID        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  display_name TEXT        NOT NULL,
  bio          TEXT,
  slug         TEXT        NOT NULL UNIQUE,
  avatar_url   TEXT,
  twitter_handle TEXT,
  is_active    BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- content.tags
-- Editorial classification and SEO topic labels applied to articles.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS content.tags (
  id          UUID        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT        NOT NULL UNIQUE,
  slug        TEXT        NOT NULL UNIQUE,
  description TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- content.templates
-- Reusable content composition patterns. block_schema defines allowed block
-- types and required fields as a JSONB schema descriptor.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS content.templates (
  id                UUID        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name              TEXT        NOT NULL UNIQUE,
  purpose           TEXT,
  block_schema      JSONB       NOT NULL DEFAULT '{}',
  metadata_defaults JSONB       NOT NULL DEFAULT '{}',
  is_active         BOOLEAN     NOT NULL DEFAULT TRUE,
  created_by        UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- content.articles
-- Canonical content objects. Status drives publishing state machine.
-- SEO fields are denormalized here for fast reads on public pages.
-- Foreign keys to stats entities are nullable for general editorial content.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS content.articles (
  id              UUID        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title           TEXT        NOT NULL,
  slug            TEXT        NOT NULL UNIQUE,
  summary         TEXT,
  status          TEXT        NOT NULL DEFAULT 'draft'
                    CHECK (status IN ('draft','in_review','scheduled','published','unpublished','archived')),
  publish_at      TIMESTAMPTZ,
  unpublish_at    TIMESTAMPTZ,
  canonical_url   TEXT,
  seo_title       TEXT,
  seo_description TEXT,
  og_image_url    TEXT,
  schema_org_type TEXT        DEFAULT 'Article',
  template_id     UUID        REFERENCES content.templates(id) ON DELETE SET NULL,
  author_id       UUID        NOT NULL REFERENCES content.authors(id) ON DELETE RESTRICT,
  -- optional stat entity associations
  tournament_id   UUID,       -- FK applied after stats schema; enforced at app layer
  course_id       UUID,
  player_id       UUID,
  -- editorial tracking
  ai_assisted     BOOLEAN     NOT NULL DEFAULT FALSE,
  reviewed_by     UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at     TIMESTAMPTZ,
  word_count      INTEGER,
  read_time_minutes INTEGER,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- content.article_versions
-- Immutable revision history for articles. Each save or publish action
-- creates a new version. ai_output_log_id links AI-assisted drafts
-- to the ai.output_logs record for auditability.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS content.article_versions (
  id               UUID        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  article_id       UUID        NOT NULL REFERENCES content.articles(id) ON DELETE CASCADE,
  version_number   INTEGER     NOT NULL,
  content_snapshot JSONB       NOT NULL DEFAULT '{}',
  review_state     TEXT        NOT NULL DEFAULT 'pending'
                     CHECK (review_state IN ('pending','approved','rejected','published')),
  ai_output_log_id UUID,       -- FK applied after ai schema
  reviewer_id      UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewer_notes   TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_article_version UNIQUE (article_id, version_number)
);

-- ---------------------------------------------------------------------------
-- content.article_blocks
-- Structured content units composing an article page. payload is JSONB to
-- support flexible block types (text, stat-embed, projection-card, odds-table,
-- image, cta, etc.) while keeping the container normalized.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS content.article_blocks (
  id             UUID        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  article_id     UUID        NOT NULL REFERENCES content.articles(id) ON DELETE CASCADE,
  block_type     TEXT        NOT NULL,
  order_index    INTEGER     NOT NULL,
  payload        JSONB       NOT NULL DEFAULT '{}',
  render_rules   JSONB       NOT NULL DEFAULT '{}',
  visibility     TEXT        NOT NULL DEFAULT 'public'
                   CHECK (visibility IN ('public','subscriber','admin')),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_article_block_order UNIQUE (article_id, order_index)
);

-- ---------------------------------------------------------------------------
-- content.article_tags
-- Many-to-many join between articles and tags.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS content.article_tags (
  article_id UUID NOT NULL REFERENCES content.articles(id) ON DELETE CASCADE,
  tag_id     UUID NOT NULL REFERENCES content.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (article_id, tag_id)
);

-- ---------------------------------------------------------------------------
-- content.internal_links
-- Tracks structured internal linking between content objects for SEO and
-- related-content modules. Prevents relying on free-text URL matching.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS content.internal_links (
  id            UUID        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  source_id     UUID        NOT NULL REFERENCES content.articles(id) ON DELETE CASCADE,
  target_id     UUID        NOT NULL REFERENCES content.articles(id) ON DELETE CASCADE,
  link_context  TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_internal_link UNIQUE (source_id, target_id)
);
