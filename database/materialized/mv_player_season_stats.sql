-- =============================================================================
-- mv_player_season_stats.sql
-- Materialized view: stats.mv_player_season_stats
-- Aggregated season-level strokes-gained and scoring from rounds data.
-- Refresh: after each ingestion batch completes for the season.
-- =============================================================================

CREATE MATERIALIZED VIEW IF NOT EXISTS stats.mv_player_season_stats AS
SELECT
  r.player_id,
  t.season,
  t.tour,
  p.display_name                           AS player_name,
  p.slug                                   AS player_slug,
  p.world_ranking,
  COUNT(DISTINCT t.id)                     AS events_played,
  COUNT(DISTINCT r.id)                     AS rounds_played,
  ROUND(AVG(r.sg_total)::NUMERIC, 3)       AS avg_sg_total,
  ROUND(AVG(r.sg_off_tee)::NUMERIC, 3)     AS avg_sg_off_tee,
  ROUND(AVG(r.sg_approach)::NUMERIC, 3)    AS avg_sg_approach,
  ROUND(AVG(r.sg_around_green)::NUMERIC, 3) AS avg_sg_around_green,
  ROUND(AVG(r.sg_putting)::NUMERIC, 3)     AS avg_sg_putting,
  ROUND(AVG(r.sg_tee_to_green)::NUMERIC, 3) AS avg_sg_tee_to_green,
  SUM(r.birdies)                           AS total_birdies,
  SUM(r.eagles)                            AS total_eagles,
  SUM(r.bogeys)                            AS total_bogeys,
  ROUND(AVG(r.score_to_par)::NUMERIC, 2)   AS avg_score_to_par,
  MAX(r.updated_at)                        AS data_updated_at
FROM stats.rounds r
JOIN stats.tournaments t  ON r.tournament_id = t.id
JOIN stats.players p      ON r.player_id = p.id
WHERE t.status IN ('in_progress', 'completed')
GROUP BY r.player_id, t.season, t.tour, p.display_name, p.slug, p.world_ranking
WITH DATA;

CREATE UNIQUE INDEX IF NOT EXISTS uq_mv_player_season_stats
  ON stats.mv_player_season_stats (player_id, season, tour);

CREATE INDEX IF NOT EXISTS idx_mv_season_player
  ON stats.mv_player_season_stats (player_id);

CREATE INDEX IF NOT EXISTS idx_mv_season_ranking
  ON stats.mv_player_season_stats (season, avg_sg_total DESC NULLS LAST);
