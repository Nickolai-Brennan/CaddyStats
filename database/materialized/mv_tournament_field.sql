-- =============================================================================
-- mv_tournament_field.sql
-- Materialized view: stats.mv_tournament_field
-- Full tournament field with latest projections and latest odds.
-- Refresh: after each ingestion run for a given tournament.
-- =============================================================================

CREATE MATERIALIZED VIEW IF NOT EXISTS stats.mv_tournament_field AS
SELECT
  e.tournament_id,
  e.player_id,
  t.name                                    AS tournament_name,
  t.slug                                    AS tournament_slug,
  t.start_date,
  t.end_date,
  t.status                                  AS tournament_status,
  c.name                                    AS course_name,
  p.display_name                            AS player_name,
  p.slug                                    AS player_slug,
  p.world_ranking,
  e.field_status,
  e.tee_time,
  -- latest win probability projection
  proj.projected_value                      AS win_probability,
  proj.percentile_outcomes,
  -- latest outright winner odds (american)
  ms.odds_american                          AS outright_odds_american,
  ms.odds_decimal                           AS outright_odds_decimal,
  ms.implied_probability                    AS outright_implied_prob,
  ms.last_updated                           AS odds_updated_at
FROM stats.tournament_entries e
JOIN stats.tournaments   t  ON e.tournament_id = t.id
JOIN stats.players       p  ON e.player_id = p.id
LEFT JOIN stats.courses  c  ON t.course_id = c.id
-- latest win_probability projection per player/tournament
LEFT JOIN LATERAL (
  SELECT projected_value, percentile_outcomes
  FROM stats.projections pr
  WHERE pr.player_id = e.player_id
    AND pr.tournament_id = e.tournament_id
    AND pr.projection_type = 'win_probability'
    AND pr.is_publishable = TRUE
  ORDER BY pr.created_at DESC
  LIMIT 1
) proj ON TRUE
-- latest outright odds per player/tournament
LEFT JOIN LATERAL (
  SELECT ms2.odds_american, ms2.odds_decimal, ms2.implied_probability, ms2.last_updated
  FROM stats.market_selections ms2
  JOIN stats.markets m ON ms2.market_id = m.id
  WHERE ms2.player_id = e.player_id
    AND m.tournament_id = e.tournament_id
    AND m.market_type = 'outright_winner'
    AND m.status = 'open'
  ORDER BY ms2.last_updated DESC
  LIMIT 1
) ms ON TRUE
WHERE e.field_status = 'in_field'
WITH DATA;

CREATE UNIQUE INDEX IF NOT EXISTS uq_mv_tournament_field
  ON stats.mv_tournament_field (tournament_id, player_id);

CREATE INDEX IF NOT EXISTS idx_mv_field_tournament
  ON stats.mv_tournament_field (tournament_id);

CREATE INDEX IF NOT EXISTS idx_mv_field_player
  ON stats.mv_tournament_field (player_id);

CREATE INDEX IF NOT EXISTS idx_mv_field_win_prob
  ON stats.mv_tournament_field (tournament_id, win_probability DESC NULLS LAST);
