-- =============================================================================
-- 002-billing-plans.sql
-- Seed: subscription plan tiers and entitlement capability keys.
-- Idempotent: uses INSERT ... ON CONFLICT DO NOTHING.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Plans
-- ---------------------------------------------------------------------------
INSERT INTO billing.plans
  (name, slug, description, price_monthly_cents, price_annual_cents, currency,
   features, trial_days, is_active, is_public, sort_order)
VALUES
  (
    'Free',
    'free',
    'Public stats, player pages, and published articles. No account required.',
    0, 0, 'USD',
    '["stats.read","content.read","market.read","projection.view"]'::jsonb,
    0, TRUE, TRUE, 1
  ),
  (
    'Pro',
    'pro',
    'Full projection access, premium model outputs, historical odds, and advanced analytics.',
    999, 9990, 'USD',
    '["stats.read_premium","projection.view_premium","market.read_history","analytics.read_own"]'::jsonb,
    7, TRUE, TRUE, 2
  ),
  (
    'Analyst',
    'analyst',
    'Everything in Pro plus model management, data export, and priority support.',
    2999, 29990, 'USD',
    '["stats.read_premium","projection.view_premium","projection.manage","market.read_history","analytics.read_own","stats.write"]'::jsonb,
    7, TRUE, TRUE, 3
  ),
  (
    'Team',
    'team',
    'Multi-seat analyst access for media, betting, or fantasy organizations.',
    9900, 99000, 'USD',
    '["stats.read_premium","projection.view_premium","projection.manage","market.read_history","analytics.read_own","stats.write","analytics.read_all"]'::jsonb,
    14, TRUE, FALSE, 4
  )
ON CONFLICT (slug) DO NOTHING;

-- ---------------------------------------------------------------------------
-- Ingestion provider stubs
-- ---------------------------------------------------------------------------
INSERT INTO ingestion.providers
  (name, slug, base_url, auth_type, auth_config, rate_limit, is_active)
VALUES
  (
    'DataGolf',
    'datagolf',
    'https://feeds.datagolf.com',
    'api_key',
    '{"key_env_var": "DATAGOLF_API_KEY"}'::jsonb,
    60,
    TRUE
  ),
  (
    'PGA Tour Stats',
    'pga_tour',
    'https://statdata.pgatour.com',
    'none',
    '{}'::jsonb,
    30,
    TRUE
  ),
  (
    'The Odds API',
    'the_odds_api',
    'https://api.the-odds-api.com/v4',
    'api_key',
    '{"key_env_var": "ODDS_API_KEY"}'::jsonb,
    60,
    TRUE
  )
ON CONFLICT (slug) DO NOTHING;

-- ---------------------------------------------------------------------------
-- Ingestion job definitions
-- ---------------------------------------------------------------------------
INSERT INTO ingestion.jobs
  (job_type, description, schedule_cron, is_active, config)
VALUES
  (
    'sync_player_rankings',
    'Sync OWGR and DataGolf rankings for all active players',
    '0 6 * * MON',
    TRUE,
    '{"provider": "datagolf", "entity_type": "players"}'::jsonb
  ),
  (
    'sync_tournament_field',
    'Sync tournament field and tee times for upcoming events',
    '0 */4 * * *',
    TRUE,
    '{"provider": "datagolf", "entity_type": "field", "days_ahead": 7}'::jsonb
  ),
  (
    'sync_live_odds',
    'Sync outright and matchup odds for active tournaments',
    '*/15 * * * *',
    TRUE,
    '{"provider": "the_odds_api", "markets": ["h2h","outrights"]}'::jsonb
  ),
  (
    'sync_round_scores',
    'Sync round-by-round scoring for in-progress tournaments',
    '*/5 * * * *',
    TRUE,
    '{"provider": "datagolf", "entity_type": "rounds", "in_progress_only": true}'::jsonb
  ),
  (
    'sync_season_stats',
    'Sync full-season strokes-gained stats for all active players',
    '0 3 * * *',
    TRUE,
    '{"provider": "datagolf", "entity_type": "season_stats"}'::jsonb
  )
ON CONFLICT (job_type) DO NOTHING;

-- ---------------------------------------------------------------------------
-- System config defaults
-- ---------------------------------------------------------------------------
INSERT INTO system.config (key, value, description, is_secret) VALUES
  ('platform.name',           '"CaddyStats"',          'Platform display name',                              FALSE),
  ('platform.environment',    '"development"',          'Current deployment environment',                    FALSE),
  ('content.ai_assist_enabled', 'true',                 'Enable AI-assisted content drafting',               FALSE),
  ('content.review_required', 'true',                   'Require editorial review before publishing',        FALSE),
  ('analytics.retention_days', '730',                   'Days to retain raw analytics event data',           FALSE),
  ('ingestion.batch_size',    '500',                    'Default record batch size for ingestion workers',   FALSE),
  ('projections.stale_hours', '12',                     'Hours before a projection is marked stale',         FALSE)
ON CONFLICT (key) DO NOTHING;

-- ---------------------------------------------------------------------------
-- System feature flags
-- ---------------------------------------------------------------------------
INSERT INTO system.feature_flags (key, description, is_enabled, enabled_for_roles) VALUES
  ('projections_v2',        'New projection model output format',       FALSE, '["analyst","admin","owner"]'::jsonb),
  ('ai_article_draft',      'AI-assisted article drafting in editor',   FALSE, '["editor","admin","owner"]'::jsonb),
  ('live_odds_widget',      'Live odds widget on tournament pages',      FALSE, '["subscriber","analyst","admin","owner"]'::jsonb),
  ('fantasy_tools',         'Fantasy DFS lineup builder tools',         FALSE, '["subscriber","analyst"]'::jsonb),
  ('dark_mode',             'Dark mode UI toggle',                       TRUE,  '[]'::jsonb)
ON CONFLICT (key) DO NOTHING;
