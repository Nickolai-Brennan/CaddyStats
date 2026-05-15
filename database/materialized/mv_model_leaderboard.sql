-- =============================================================================
-- mv_model_leaderboard.sql
-- Materialized view: stats.mv_model_leaderboard
-- Most recent model run projections ranked by win probability per tournament.
-- Refresh: after each model_run completes with status = 'completed'.
-- =============================================================================

CREATE MATERIALIZED VIEW IF NOT EXISTS stats.mv_model_leaderboard AS
WITH latest_run AS (
  SELECT DISTINCT ON (tournament_id)
    id AS model_run_id,
    tournament_id,
    model_name,
    model_version,
    run_at
  FROM stats.model_runs
  WHERE status = 'completed'
  ORDER BY tournament_id, run_at DESC
)
SELECT
  lr.tournament_id,
  lr.model_run_id,
  lr.model_name,
  lr.model_version,
  lr.run_at                                       AS model_run_at,
  t.name                                          AS tournament_name,
  t.slug                                          AS tournament_slug,
  t.start_date,
  pr.player_id,
  p.display_name                                  AS player_name,
  p.slug                                          AS player_slug,
  p.world_ranking,
  pr.projected_value                              AS win_probability,
  pr.percentile_outcomes,
  pr.confidence_notes,
  RANK() OVER (
    PARTITION BY lr.tournament_id
    ORDER BY pr.projected_value DESC NULLS LAST
  )                                               AS model_rank
FROM latest_run lr
JOIN stats.tournaments t   ON lr.tournament_id = t.id
JOIN stats.projections pr  ON pr.model_run_id = lr.model_run_id
                          AND pr.tournament_id = lr.tournament_id
                          AND pr.projection_type = 'win_probability'
                          AND pr.is_publishable = TRUE
JOIN stats.players p       ON pr.player_id = p.id
WITH DATA;

CREATE UNIQUE INDEX IF NOT EXISTS uq_mv_model_leaderboard
  ON stats.mv_model_leaderboard (tournament_id, player_id);

CREATE INDEX IF NOT EXISTS idx_mv_leaderboard_tournament
  ON stats.mv_model_leaderboard (tournament_id, model_rank);

CREATE INDEX IF NOT EXISTS idx_mv_leaderboard_player
  ON stats.mv_model_leaderboard (player_id);
