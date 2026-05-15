-- =============================================================================
-- 010-indexes.sql
-- Performance indexes for all schemas.
-- Run after all schema files. Indexes are created CONCURRENTLY where possible
-- in production to avoid table locks (remove CONCURRENTLY for initial setup).
-- =============================================================================

-- ---------------------------------------------------------------------------
-- auth
-- ---------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_users_email         ON auth.users (lower(email));
CREATE INDEX IF NOT EXISTS idx_users_status        ON auth.users (account_status);
CREATE INDEX IF NOT EXISTS idx_users_provider      ON auth.users (auth_provider, auth_provider_id);
CREATE INDEX IF NOT EXISTS idx_role_assignments_uid ON auth.role_assignments (user_id);
CREATE INDEX IF NOT EXISTS idx_role_assignments_rid ON auth.role_assignments (role_id);
CREATE INDEX IF NOT EXISTS idx_sessions_user       ON auth.sessions (user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires    ON auth.sessions (expires_at)
  WHERE revoked_at IS NULL;

-- ---------------------------------------------------------------------------
-- content
-- ---------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_articles_slug       ON content.articles (slug);
CREATE INDEX IF NOT EXISTS idx_articles_status     ON content.articles (status);
CREATE INDEX IF NOT EXISTS idx_articles_author     ON content.articles (author_id);
CREATE INDEX IF NOT EXISTS idx_articles_publish    ON content.articles (publish_at)
  WHERE status = 'scheduled';
CREATE INDEX IF NOT EXISTS idx_articles_tournament ON content.articles (tournament_id)
  WHERE tournament_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_articles_player     ON content.articles (player_id)
  WHERE player_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_articles_course     ON content.articles (course_id)
  WHERE course_id IS NOT NULL;
-- Full-text search on title + summary
CREATE INDEX IF NOT EXISTS idx_articles_fts        ON content.articles
  USING gin (to_tsvector('english', coalesce(title,'') || ' ' || coalesce(summary,'')));

CREATE INDEX IF NOT EXISTS idx_article_versions_article ON content.article_versions (article_id);
CREATE INDEX IF NOT EXISTS idx_article_blocks_article   ON content.article_blocks (article_id, order_index);
CREATE INDEX IF NOT EXISTS idx_article_tags_tag         ON content.article_tags (tag_id);
CREATE INDEX IF NOT EXISTS idx_tags_slug                ON content.tags (slug);
CREATE INDEX IF NOT EXISTS idx_authors_slug             ON content.authors (slug);
CREATE INDEX IF NOT EXISTS idx_authors_user             ON content.authors (user_id)
  WHERE user_id IS NOT NULL;

-- ---------------------------------------------------------------------------
-- stats
-- ---------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_players_slug          ON stats.players (slug);
CREATE INDEX IF NOT EXISTS idx_players_active        ON stats.players (active)
  WHERE active = TRUE;
CREATE INDEX IF NOT EXISTS idx_players_ranking       ON stats.players (world_ranking)
  WHERE world_ranking IS NOT NULL;
-- Trigram index for player name search
CREATE INDEX IF NOT EXISTS idx_players_name_trgm     ON stats.players
  USING gin (display_name gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_tournaments_slug      ON stats.tournaments (slug);
CREATE INDEX IF NOT EXISTS idx_tournaments_season    ON stats.tournaments (season);
CREATE INDEX IF NOT EXISTS idx_tournaments_status    ON stats.tournaments (status);
CREATE INDEX IF NOT EXISTS idx_tournaments_dates     ON stats.tournaments (start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_courses_slug          ON stats.courses (slug);

CREATE INDEX IF NOT EXISTS idx_entries_tournament    ON stats.tournament_entries (tournament_id);
CREATE INDEX IF NOT EXISTS idx_entries_player        ON stats.tournament_entries (player_id);
CREATE INDEX IF NOT EXISTS idx_entries_status        ON stats.tournament_entries (field_status);

CREATE INDEX IF NOT EXISTS idx_rounds_tournament     ON stats.rounds (tournament_id);
CREATE INDEX IF NOT EXISTS idx_rounds_player         ON stats.rounds (player_id);
CREATE INDEX IF NOT EXISTS idx_rounds_tp             ON stats.rounds (tournament_id, player_id);

CREATE INDEX IF NOT EXISTS idx_projections_player    ON stats.projections (player_id);
CREATE INDEX IF NOT EXISTS idx_projections_tournament ON stats.projections (tournament_id);
CREATE INDEX IF NOT EXISTS idx_projections_model_run ON stats.projections (model_run_id);
CREATE INDEX IF NOT EXISTS idx_projections_publishable ON stats.projections (is_publishable, is_fresh)
  WHERE is_publishable = TRUE AND is_fresh = TRUE;

CREATE INDEX IF NOT EXISTS idx_markets_tournament    ON stats.markets (tournament_id);
CREATE INDEX IF NOT EXISTS idx_market_sel_market     ON stats.market_selections (market_id);
CREATE INDEX IF NOT EXISTS idx_market_sel_player     ON stats.market_selections (player_id);
CREATE INDEX IF NOT EXISTS idx_market_sel_updated    ON stats.market_selections (last_updated DESC);

CREATE INDEX IF NOT EXISTS idx_model_runs_tournament ON stats.model_runs (tournament_id)
  WHERE tournament_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_model_runs_status     ON stats.model_runs (status);
CREATE INDEX IF NOT EXISTS idx_model_metrics_run     ON stats.model_metrics (model_run_id);

CREATE INDEX IF NOT EXISTS idx_season_stats_player   ON stats.player_season_stats (player_id, season);

-- ---------------------------------------------------------------------------
-- analytics
-- ---------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_page_views_user       ON analytics.page_views (user_id)
  WHERE user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_page_views_entity     ON analytics.page_views (entity_type, entity_id)
  WHERE entity_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_events_user           ON analytics.events (user_id)
  WHERE user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_events_name           ON analytics.events (event_name);
CREATE INDEX IF NOT EXISTS idx_feature_usage_user    ON analytics.feature_usage (user_id, feature_key);
CREATE INDEX IF NOT EXISTS idx_conversion_user       ON analytics.conversion_events (user_id)
  WHERE user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_conversion_funnel     ON analytics.conversion_events (funnel_step);

-- ---------------------------------------------------------------------------
-- ai
-- ---------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_output_logs_user      ON ai.output_logs (user_id)
  WHERE user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_output_logs_status    ON ai.output_logs (output_status, reviewer_state);
CREATE INDEX IF NOT EXISTS idx_output_logs_article   ON ai.output_logs (article_version_id)
  WHERE article_version_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_editorial_review_article ON ai.editorial_review_logs (article_id);
CREATE INDEX IF NOT EXISTS idx_editorial_review_actor   ON ai.editorial_review_logs (actor_id)
  WHERE actor_id IS NOT NULL;

-- ---------------------------------------------------------------------------
-- system
-- ---------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_audit_actor          ON system.audit_events (actor_id)
  WHERE actor_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_audit_target         ON system.audit_events (target_type, target_id)
  WHERE target_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_config_key           ON system.config (key);
CREATE INDEX IF NOT EXISTS idx_health_service       ON system.health_checks (service_name, checked_at DESC);
CREATE INDEX IF NOT EXISTS idx_bg_jobs_status       ON system.background_jobs (status, scheduled_for)
  WHERE status = 'pending';

-- ---------------------------------------------------------------------------
-- ingestion
-- ---------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_sync_batches_provider  ON ingestion.sync_batches (provider_id);
CREATE INDEX IF NOT EXISTS idx_sync_batches_status    ON ingestion.sync_batches (status);
CREATE INDEX IF NOT EXISTS idx_sync_records_batch     ON ingestion.sync_records (batch_id);
CREATE INDEX IF NOT EXISTS idx_sync_records_entity    ON ingestion.sync_records (entity_type, internal_entity_id)
  WHERE internal_entity_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_entity_id_maps_internal ON ingestion.entity_id_maps (entity_type, internal_id);
CREATE INDEX IF NOT EXISTS idx_entity_id_maps_provider ON ingestion.entity_id_maps (provider_slug, provider_entity_id);

-- ---------------------------------------------------------------------------
-- billing
-- ---------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_subscriptions_user     ON billing.subscriptions (user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_plan     ON billing.subscriptions (plan_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status   ON billing.subscriptions (status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_period   ON billing.subscriptions (current_period_end)
  WHERE status IN ('active','trialing');
CREATE INDEX IF NOT EXISTS idx_entitlements_user      ON billing.entitlements (user_id, capability_key);
CREATE INDEX IF NOT EXISTS idx_entitlements_active    ON billing.entitlements (user_id)
  WHERE revoked_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_billing_events_sub     ON billing.billing_events (subscription_id)
  WHERE subscription_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_invoice_user           ON billing.invoice_records (user_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_links_code   ON billing.affiliate_links (tracking_code);
CREATE INDEX IF NOT EXISTS idx_affiliate_conv_link    ON billing.affiliate_conversions (link_id);
