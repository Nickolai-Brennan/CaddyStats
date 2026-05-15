-- =============================================================================
-- 011-triggers.sql
-- Attaches set_updated_at() to all tables with an updated_at column.
-- Depends on: 001-bootstrap.sql (defines set_updated_at function)
-- =============================================================================

-- ---------------------------------------------------------------------------
-- auth
-- ---------------------------------------------------------------------------
CREATE OR REPLACE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE OR REPLACE TRIGGER trg_roles_updated_at
  BEFORE UPDATE ON auth.roles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ---------------------------------------------------------------------------
-- content
-- ---------------------------------------------------------------------------
CREATE OR REPLACE TRIGGER trg_articles_updated_at
  BEFORE UPDATE ON content.articles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE OR REPLACE TRIGGER trg_article_blocks_updated_at
  BEFORE UPDATE ON content.article_blocks
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE OR REPLACE TRIGGER trg_authors_updated_at
  BEFORE UPDATE ON content.authors
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE OR REPLACE TRIGGER trg_templates_updated_at
  BEFORE UPDATE ON content.templates
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ---------------------------------------------------------------------------
-- stats
-- ---------------------------------------------------------------------------
CREATE OR REPLACE TRIGGER trg_players_updated_at
  BEFORE UPDATE ON stats.players
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE OR REPLACE TRIGGER trg_courses_updated_at
  BEFORE UPDATE ON stats.courses
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE OR REPLACE TRIGGER trg_tournaments_updated_at
  BEFORE UPDATE ON stats.tournaments
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE OR REPLACE TRIGGER trg_tournament_entries_updated_at
  BEFORE UPDATE ON stats.tournament_entries
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE OR REPLACE TRIGGER trg_rounds_updated_at
  BEFORE UPDATE ON stats.rounds
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE OR REPLACE TRIGGER trg_projections_updated_at
  BEFORE UPDATE ON stats.projections
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE OR REPLACE TRIGGER trg_markets_updated_at
  BEFORE UPDATE ON stats.markets
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE OR REPLACE TRIGGER trg_player_season_stats_updated_at
  BEFORE UPDATE ON stats.player_season_stats
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ---------------------------------------------------------------------------
-- ai
-- ---------------------------------------------------------------------------
CREATE OR REPLACE TRIGGER trg_grounding_sources_updated_at
  BEFORE UPDATE ON ai.grounding_sources
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ---------------------------------------------------------------------------
-- system
-- ---------------------------------------------------------------------------
CREATE OR REPLACE TRIGGER trg_config_updated_at
  BEFORE UPDATE ON system.config
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE OR REPLACE TRIGGER trg_feature_flags_updated_at
  BEFORE UPDATE ON system.feature_flags
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE OR REPLACE TRIGGER trg_bg_jobs_updated_at
  BEFORE UPDATE ON system.background_jobs
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ---------------------------------------------------------------------------
-- ingestion
-- ---------------------------------------------------------------------------
CREATE OR REPLACE TRIGGER trg_providers_updated_at
  BEFORE UPDATE ON ingestion.providers
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE OR REPLACE TRIGGER trg_jobs_updated_at
  BEFORE UPDATE ON ingestion.jobs
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ---------------------------------------------------------------------------
-- billing
-- ---------------------------------------------------------------------------
CREATE OR REPLACE TRIGGER trg_plans_updated_at
  BEFORE UPDATE ON billing.plans
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE OR REPLACE TRIGGER trg_subscriptions_updated_at
  BEFORE UPDATE ON billing.subscriptions
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE OR REPLACE TRIGGER trg_affiliate_programs_updated_at
  BEFORE UPDATE ON billing.affiliate_programs
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE OR REPLACE TRIGGER trg_affiliate_links_updated_at
  BEFORE UPDATE ON billing.affiliate_links
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
