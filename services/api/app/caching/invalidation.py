"""Cache invalidation flows — Event-driven cache coherency and bulk invalidation strategies."""

from __future__ import annotations

from enum import Enum

import structlog

from app.caching.client import CacheOps
from app.caching.keys import CacheKeyBuilder

logger = structlog.get_logger(__name__)


class InvalidationEvent(str, Enum):
    """Cache invalidation event types."""

    # Entity lifecycle events
    PLAYER_CREATED = "player.created"
    PLAYER_UPDATED = "player.updated"
    PLAYER_DELETED = "player.deleted"
    PLAYER_STATS_UPDATED = "player.stats.updated"

    TOURNAMENT_CREATED = "tournament.created"
    TOURNAMENT_UPDATED = "tournament.updated"
    TOURNAMENT_DELETED = "tournament.deleted"
    TOURNAMENT_STARTED = "tournament.started"
    TOURNAMENT_ENDED = "tournament.ended"

    COURSE_CREATED = "course.created"
    COURSE_UPDATED = "course.updated"

    ROUND_COMPLETED = "round.completed"
    ROUND_UPDATED = "round.updated"

    # Market/Betting events
    MARKET_CREATED = "market.created"
    MARKET_UPDATED = "market.updated"
    MARKET_CLOSED = "market.closed"
    MARKET_ODDS_UPDATED = "market.odds.updated"

    # Projection events
    PROJECTION_CREATED = "projection.created"
    PROJECTION_UPDATED = "projection.updated"
    PROJECTION_PUBLISHED = "projection.published"

    # Content events
    ARTICLE_CREATED = "article.created"
    ARTICLE_UPDATED = "article.updated"
    ARTICLE_DELETED = "article.deleted"
    ARTICLE_PUBLISHED = "article.published"

    # Bulk operations
    BULK_CACHE_FLUSH = "bulk.cache_flush"
    BULK_RANKINGS_UPDATE = "bulk.rankings.update"
    BULK_LEADERBOARDS_UPDATE = "bulk.leaderboards.update"


class CacheInvalidationFlow:
    """Event-driven cache invalidation orchestration."""

    @staticmethod
    async def on_player_updated(player_id: str) -> None:
        """Invalidate player-related caches when player is updated."""
        patterns_to_invalidate = [
            CacheKeyBuilder.pattern_player_related(player_id),
            CacheKeyBuilder.pattern_betting_edges_for_player(player_id),
            CacheKeyBuilder.summary_player(player_id),
            CacheKeyBuilder.metadata_player(player_id),
            # Rankings may include this player
            CacheKeyBuilder.pattern_ranking_all(),
            # Leaderboards may include this player
            CacheKeyBuilder.pattern_leaderboard_all(),
            # Search results may be affected
            CacheKeyBuilder.pattern_search_players_all(),
        ]

        await CacheInvalidationFlow._invalidate_patterns(
            InvalidationEvent.PLAYER_UPDATED, patterns_to_invalidate
        )

    @staticmethod
    async def on_player_stats_updated(player_id: str) -> None:
        """Invalidate projection and ranking caches when player stats change."""
        patterns_to_invalidate = [
            CacheKeyBuilder.pattern_player_related(player_id),
            CacheKeyBuilder.pattern_betting_edges_for_player(player_id),
            # Projections depend on player stats
            CacheKeyBuilder.pattern_projection_all(),
            # Rankings depend on player stats
            CacheKeyBuilder.pattern_ranking_all(),
            # Leaderboards depend on player stats
            CacheKeyBuilder.pattern_leaderboard_all(),
        ]

        await CacheInvalidationFlow._invalidate_patterns(
            InvalidationEvent.PLAYER_STATS_UPDATED, patterns_to_invalidate
        )

    @staticmethod
    async def on_tournament_started(tournament_id: str, tournament_slug: str) -> None:
        """Invalidate tournament leaderboards/rankings when tournament starts."""
        patterns_to_invalidate = [
            CacheKeyBuilder.pattern_leaderboards_for_tournament(tournament_slug),
            CacheKeyBuilder.pattern_rankings_for_tournament(tournament_slug),
            # Betting markets for this tournament
            CacheKeyBuilder.betting_markets(),
            CacheKeyBuilder.betting_field_projections(tournament_id),
            # Summary
            CacheKeyBuilder.summary_tournament(tournament_id),
        ]

        await CacheInvalidationFlow._invalidate_patterns(
            InvalidationEvent.TOURNAMENT_STARTED, patterns_to_invalidate
        )

    @staticmethod
    async def on_tournament_ended(tournament_id: str, tournament_slug: str) -> None:
        """Invalidate leaderboards and mark rankings for refresh when tournament ends."""
        patterns_to_invalidate = [
            CacheKeyBuilder.pattern_leaderboards_for_tournament(tournament_slug),
            CacheKeyBuilder.pattern_rankings_for_tournament(tournament_slug),
            # Betting closes
            CacheKeyBuilder.betting_markets(),
            CacheKeyBuilder.betting_field_projections(tournament_id),
            # Final leaderboard/rankings should update
            CacheKeyBuilder.pattern_ranking_all(),
        ]

        await CacheInvalidationFlow._invalidate_patterns(
            InvalidationEvent.TOURNAMENT_ENDED, patterns_to_invalidate
        )

    @staticmethod
    async def on_round_completed(tournament_id: str, tournament_slug: str) -> None:
        """Invalidate leaderboards/odds when round completes (scores update)."""
        patterns_to_invalidate = [
            CacheKeyBuilder.pattern_leaderboards_for_tournament(tournament_slug),
            CacheKeyBuilder.pattern_rankings_for_tournament(tournament_slug),
            CacheKeyBuilder.betting_markets(),
            CacheKeyBuilder.betting_field_projections(tournament_id),
            # Projections may shift based on new scores
            CacheKeyBuilder.pattern_projection_all(),
        ]

        await CacheInvalidationFlow._invalidate_patterns(
            InvalidationEvent.ROUND_COMPLETED, patterns_to_invalidate
        )

    @staticmethod
    async def on_market_updated(market_id: str, tournament_id: str | None = None) -> None:
        """Invalidate betting and edge caches when market updates."""
        patterns_to_invalidate = [
            CacheKeyBuilder.betting_market_detail(market_id),
            CacheKeyBuilder.betting_markets(),
            CacheKeyBuilder.pattern_betting_all(),
        ]

        if tournament_id:
            patterns_to_invalidate.append(
                CacheKeyBuilder.betting_field_projections(tournament_id)
            )

        await CacheInvalidationFlow._invalidate_patterns(
            InvalidationEvent.MARKET_UPDATED, patterns_to_invalidate
        )

    @staticmethod
    async def on_market_odds_updated(market_id: str) -> None:
        """Invalidate betting edge caches when odds update (very volatile)."""
        patterns_to_invalidate = [
            CacheKeyBuilder.betting_market_detail(market_id),
            CacheKeyBuilder.pattern_betting_all(),
        ]

        await CacheInvalidationFlow._invalidate_patterns(
            InvalidationEvent.MARKET_ODDS_UPDATED, patterns_to_invalidate
        )

    @staticmethod
    async def on_projection_published(projection_id: str, tournament_id: str) -> None:
        """Invalidate betting/edge caches when new projection is published."""
        patterns_to_invalidate = [
            CacheKeyBuilder.pattern_projection_all(),
            CacheKeyBuilder.betting_field_projections(tournament_id),
            CacheKeyBuilder.pattern_betting_all(),
        ]

        await CacheInvalidationFlow._invalidate_patterns(
            InvalidationEvent.PROJECTION_PUBLISHED, patterns_to_invalidate
        )

    @staticmethod
    async def on_article_published(article_id: str) -> None:
        """Invalidate article page/list caches when article is published."""
        patterns_to_invalidate = [
            CacheKeyBuilder.page_article("*"),  # All article pages
            CacheKeyBuilder.pattern_article_related(article_id),
            # Article list pages
            CacheKeyBuilder.page_articles_list(),
        ]

        await CacheInvalidationFlow._invalidate_patterns(
            InvalidationEvent.ARTICLE_PUBLISHED, patterns_to_invalidate
        )

    @staticmethod
    async def on_bulk_rankings_update() -> None:
        """Bulk invalidation when all rankings are refreshed (e.g., weekly)."""
        await CacheOps.delete_pattern(CacheKeyBuilder.pattern_ranking_all())
        logger.info("bulk_invalidation", event=InvalidationEvent.BULK_RANKINGS_UPDATE)

    @staticmethod
    async def on_bulk_leaderboards_update() -> None:
        """Bulk invalidation when all leaderboards are refreshed."""
        await CacheOps.delete_pattern(CacheKeyBuilder.pattern_leaderboard_all())
        logger.info("bulk_invalidation", event=InvalidationEvent.BULK_LEADERBOARDS_UPDATE)

    @staticmethod
    async def bulk_flush_domain(domain: str) -> None:
        """Flush all caches for a domain."""
        pattern = f"{domain}:*"
        count = await CacheOps.delete_pattern(pattern)
        logger.info("bulk_flush_domain", domain=domain, count=count)

    @staticmethod
    async def bulk_flush_all() -> None:
        """Flush all caches (use with caution)."""
        await CacheOps.clear()
        logger.warning("bulk_cache_flush", event=InvalidationEvent.BULK_CACHE_FLUSH)

    # -----------------------------------------------------------------------
    # Private Helpers
    # -----------------------------------------------------------------------

    @staticmethod
    async def _invalidate_patterns(event: InvalidationEvent, patterns: list[str]) -> None:
        """Invalidate multiple cache patterns."""
        total_count = 0

        for pattern in patterns:
            try:
                count = await CacheOps.delete_pattern(pattern)
                total_count += count
            except Exception as e:
                logger.warning(
                    "cache_invalidation_error",
                    event=event,
                    pattern=pattern,
                    error=str(e),
                )

        logger.info("cache_invalidation_flow", event=event, patterns_count=len(patterns), total_count=total_count)


# -----------------------------------------------------------------------
# Pattern Builders (Convenience Methods)
# -----------------------------------------------------------------------


class CacheKeyBuilder:
    """Extended cache key builder with pattern methods."""

    @staticmethod
    def pattern_search_players_all() -> str:
        """Pattern to match all player search results."""
        return "search:players:*"

    @staticmethod
    def pattern_search_tournaments_all() -> str:
        """Pattern to match all tournament search results."""
        return "search:tournaments:*"
