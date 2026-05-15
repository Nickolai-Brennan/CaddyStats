-- =============================================================================
-- vw_player_profile.sql
-- View: stats.vw_player_profile
-- Full player profile with current season stats and ranking.
-- Used by player pages and projection dashboards.
-- =============================================================================

CREATE OR REPLACE VIEW stats.vw_player_profile AS
SELECT
  p.id,
  p.slug,
  p.display_name,
  p.first_name,
  p.last_name,
  p.nationality,
  p.country_code,
  p.handedness,
  p.birth_date,
  p.turned_pro,
  p.active,
  p.world_ranking,
  p.owgr_points,
  p.created_at,
  p.updated_at,
  -- current season aggregate (joined from materialized view for perf)
  ss.season                 AS current_season,
  ss.events_played,
  ss.rounds_played,
  ss.avg_sg_total,
  ss.avg_sg_off_tee,
  ss.avg_sg_approach,
  ss.avg_sg_around_green,
  ss.avg_sg_putting,
  ss.avg_score_to_par,
  ss.data_updated_at        AS stats_updated_at
FROM stats.players p
LEFT JOIN stats.mv_player_season_stats ss
  ON ss.player_id = p.id
  AND ss.season = EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER
  AND ss.tour = 'pga'
WHERE p.active = TRUE;
