-- =============================================================================
-- 004-stats.sql
-- Schema: stats
-- Domain: Stats and Competition
-- Owns: players, courses, tournaments, tournament_entries, rounds,
--       model_runs, model_metrics, projections, markets, market_selections
-- Depends on: 001-bootstrap.sql
-- =============================================================================

-- ---------------------------------------------------------------------------
-- stats.players
-- Canonical golfer profiles. provider_ids stores third-party identifiers
-- (DataGolf, PGA Tour, ESPN, etc.) as a JSONB map keyed by provider slug.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS stats.players (
  id              UUID        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug            TEXT        NOT NULL UNIQUE,
  display_name    TEXT        NOT NULL,
  first_name      TEXT        NOT NULL,
  last_name       TEXT        NOT NULL,
  nationality     TEXT,
  country_code    CHAR(2),
  handedness      TEXT        CHECK (handedness IN ('right','left','unknown')),
  birth_date      DATE,
  turned_pro      INTEGER,
  active          BOOLEAN     NOT NULL DEFAULT TRUE,
  world_ranking   INTEGER,
  owgr_points     NUMERIC(10,4),
  pga_tour_id     TEXT,
  datagolf_id     TEXT,
  provider_ids    JSONB       NOT NULL DEFAULT '{}',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- stats.courses
-- Venue and course setup metadata. Architecture notes and surface traits
-- feed course-fit models and editorial content.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS stats.courses (
  id                  UUID        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug                TEXT        NOT NULL UNIQUE,
  name                TEXT        NOT NULL,
  location_city       TEXT,
  location_state      TEXT,
  location_country    TEXT,
  country_code        CHAR(2),
  par                 INTEGER,
  yardage             INTEGER,
  grass_type_fairway  TEXT,
  grass_type_green    TEXT,
  surface_notes       TEXT,
  architecture_notes  TEXT,
  stimpmeter_avg      NUMERIC(4,1),
  elevation_ft        INTEGER,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- stats.tournaments
-- Canonical tournament/event definitions. One row per event per season.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS stats.tournaments (
  id               UUID        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug             TEXT        NOT NULL UNIQUE,
  name             TEXT        NOT NULL,
  season           INTEGER     NOT NULL,
  tour             TEXT        NOT NULL DEFAULT 'pga'
                     CHECK (tour IN ('pga','lpga','korn_ferry','dp_world','liv','major','other')),
  start_date       DATE,
  end_date         DATE,
  status           TEXT        NOT NULL DEFAULT 'scheduled'
                     CHECK (status IN ('scheduled','in_progress','completed','cancelled','postponed')),
  course_id        UUID        REFERENCES stats.courses(id) ON DELETE SET NULL,
  purse_usd        BIGINT,
  fedex_cup_points INTEGER,
  field_size       INTEGER,
  is_major         BOOLEAN     NOT NULL DEFAULT FALSE,
  provider_ids     JSONB       NOT NULL DEFAULT '{}',
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- stats.tournament_entries
-- Player participation in a tournament. Tracks field status, tee times,
-- withdrawals, and provider sync state.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS stats.tournament_entries (
  id                   UUID        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tournament_id        UUID        NOT NULL REFERENCES stats.tournaments(id) ON DELETE CASCADE,
  player_id            UUID        NOT NULL REFERENCES stats.players(id) ON DELETE CASCADE,
  field_status         TEXT        NOT NULL DEFAULT 'in_field'
                         CHECK (field_status IN ('in_field','alternate','withdrew','disqualified','cut','not_in_field')),
  tee_time             TIMESTAMPTZ,
  starting_hole        INTEGER,
  withdrawal_reason    TEXT,
  provider_sync_status TEXT        NOT NULL DEFAULT 'pending'
                         CHECK (provider_sync_status IN ('pending','synced','failed','stale')),
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_tournament_entry UNIQUE (tournament_id, player_id)
);

-- ---------------------------------------------------------------------------
-- stats.rounds
-- One player's scoring and strokes-gained performance in one round.
-- All strokes-gained values are against the field average (baseline zero).
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS stats.rounds (
  id                         UUID        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tournament_id              UUID        NOT NULL REFERENCES stats.tournaments(id) ON DELETE CASCADE,
  player_id                  UUID        NOT NULL REFERENCES stats.players(id) ON DELETE CASCADE,
  round_number               INTEGER     NOT NULL CHECK (round_number BETWEEN 1 AND 5),
  score                      INTEGER,
  score_to_par               INTEGER,
  position                   INTEGER,
  -- strokes gained categories
  sg_total                   NUMERIC(6,3),
  sg_off_tee                 NUMERIC(6,3),
  sg_approach                NUMERIC(6,3),
  sg_around_green            NUMERIC(6,3),
  sg_putting                 NUMERIC(6,3),
  sg_tee_to_green            NUMERIC(6,3),
  -- traditional stats
  fairways_hit               INTEGER,
  fairways_attempted         INTEGER,
  greens_in_regulation       INTEGER,
  holes_played               INTEGER,
  putts                      INTEGER,
  birdies                    INTEGER,
  eagles                     INTEGER,
  bogeys                     INTEGER,
  double_bogeys              INTEGER,
  -- source metadata
  source_timestamp           TIMESTAMPTZ,
  data_source                TEXT,
  created_at                 TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                 TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_round UNIQUE (tournament_id, player_id, round_number)
);

-- ---------------------------------------------------------------------------
-- stats.model_runs
-- Execution record for a projection or evaluation pipeline. Every projection
-- row must trace back to exactly one model_run for full lineage.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS stats.model_runs (
  id                  UUID        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  model_name          TEXT        NOT NULL,
  model_version       TEXT        NOT NULL,
  run_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  input_window_start  DATE,
  input_window_end    DATE,
  tournament_id       UUID        REFERENCES stats.tournaments(id) ON DELETE SET NULL,
  status              TEXT        NOT NULL DEFAULT 'pending'
                        CHECK (status IN ('pending','running','completed','failed')),
  config              JSONB       NOT NULL DEFAULT '{}',
  notes               TEXT,
  duration_ms         INTEGER,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- stats.model_metrics
-- Performance and calibration records for a model run or model version.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS stats.model_metrics (
  id                    UUID        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  model_run_id          UUID        NOT NULL REFERENCES stats.model_runs(id) ON DELETE CASCADE,
  metric_name           TEXT        NOT NULL,
  metric_value          NUMERIC(12,6) NOT NULL,
  evaluation_window     TEXT,
  benchmark_comparison  NUMERIC(12,6),
  notes                 TEXT,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- stats.projections
-- Model-derived expectations for a player in a tournament or market context.
-- percentile_outcomes stores p10/p25/p50/p75/p90 as a JSONB map.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS stats.projections (
  id                  UUID        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  player_id           UUID        NOT NULL REFERENCES stats.players(id) ON DELETE CASCADE,
  tournament_id       UUID        NOT NULL REFERENCES stats.tournaments(id) ON DELETE CASCADE,
  model_run_id        UUID        NOT NULL REFERENCES stats.model_runs(id) ON DELETE CASCADE,
  projection_type     TEXT        NOT NULL
                        CHECK (projection_type IN ('finish_position','make_cut','sg_total',
                                                   'score_round','win_probability','top5','top10','top20')),
  projected_value     NUMERIC(10,4),
  percentile_outcomes JSONB       NOT NULL DEFAULT '{}',
  confidence_notes    TEXT,
  is_fresh            BOOLEAN     NOT NULL DEFAULT TRUE,
  is_publishable      BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- stats.markets
-- Betting or fantasy market definitions. One market covers one market_type
-- for one tournament from one provider.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS stats.markets (
  id           UUID        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tournament_id UUID       NOT NULL REFERENCES stats.tournaments(id) ON DELETE CASCADE,
  market_type  TEXT        NOT NULL,
  provider     TEXT        NOT NULL,
  open_at      TIMESTAMPTZ,
  last_seen_at TIMESTAMPTZ,
  status       TEXT        NOT NULL DEFAULT 'open'
                 CHECK (status IN ('open','suspended','closed','settled','cancelled')),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_market UNIQUE (tournament_id, market_type, provider)
);

-- ---------------------------------------------------------------------------
-- stats.market_selections
-- Player-level line or odds within a market. Append-only for history;
-- latest record per (market_id, player_id) is the current line.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS stats.market_selections (
  id                UUID        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  market_id         UUID        NOT NULL REFERENCES stats.markets(id) ON DELETE CASCADE,
  player_id         UUID        NOT NULL REFERENCES stats.players(id) ON DELETE CASCADE,
  odds_decimal      NUMERIC(8,4),
  odds_american     INTEGER,
  line              NUMERIC(8,4),
  implied_probability NUMERIC(6,4),
  last_updated      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- stats.player_season_stats
-- Aggregated season-level performance for a player. Populated by the
-- projections worker or ETL pipeline; not computed at query time.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS stats.player_season_stats (
  id                  UUID        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  player_id           UUID        NOT NULL REFERENCES stats.players(id) ON DELETE CASCADE,
  season              INTEGER     NOT NULL,
  tour                TEXT        NOT NULL DEFAULT 'pga',
  events_played       INTEGER,
  cuts_made           INTEGER,
  wins                INTEGER,
  top5                INTEGER,
  top10               INTEGER,
  top25               INTEGER,
  earnings_usd        BIGINT,
  fedex_cup_points    INTEGER,
  avg_sg_total        NUMERIC(6,3),
  avg_sg_off_tee      NUMERIC(6,3),
  avg_sg_approach     NUMERIC(6,3),
  avg_sg_around_green NUMERIC(6,3),
  avg_sg_putting      NUMERIC(6,3),
  avg_driving_distance NUMERIC(6,1),
  avg_driving_accuracy NUMERIC(5,2),
  avg_gir             NUMERIC(5,2),
  data_thru           DATE,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_player_season UNIQUE (player_id, season, tour)
);
