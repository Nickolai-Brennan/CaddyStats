"""Caching integration examples — How to use caching in services and endpoints."""

from __future__ import annotations

from app.caching.client import CacheOps
from app.caching.config import CachePolicy
from app.caching.decorators import cache_aside, cache_through, invalidate_cache
from app.caching.invalidation import CacheInvalidationFlow
from app.caching.keys import CacheKeyBuilder

# -----------------------------------------------------------------------
# Service Integration Examples
# -----------------------------------------------------------------------


class ProjectionServiceCachingExample:
    """Example: Caching tournament leaderboards in StatsService."""

    @cache_aside(
        key_func=lambda tournament_slug: CacheKeyBuilder.leaderboard_tournament(tournament_slug),
        policy_name="LEADERBOARD_TOURNAMENT",
    )
    async def get_tournament_leaderboard(self, tournament_slug: str) -> dict:
        """Get tournament leaderboard with automatic caching."""
        # This will:
        # 1. Check cache for leaderboard:tournament:{tournament_slug}
        # 2. If miss, call expensive database query
        # 3. Cache result for 1 hour (per LEADERBOARD_TOURNAMENT policy)
        return await self._db.query_leaderboard(tournament_slug)

    @cache_aside(
        key_func=lambda tournament_slug: CacheKeyBuilder.ranking_tournament(tournament_slug),
        policy_name="RANKING_TOURNAMENT",
    )
    async def get_tournament_rankings(self, tournament_slug: str) -> list[dict]:
        """Get tournament rankings with automatic caching."""
        return await self._db.query_rankings(tournament_slug)


class ProjectionServiceExample:
    """Example: Caching projections with invalidation."""

    @cache_aside(
        key_func=lambda player_id, tournament_id: (
            CacheKeyBuilder.projection_player_tournament(player_id, tournament_id)
        ),
        policy_name="PROJECTION_PLAYER_TOURNAMENT",
    )
    async def get_player_projection(self, player_id: str, tournament_id: str) -> dict:
        """Get player projection with automatic caching (30 min TTL)."""
        return await self._db.get_projection(player_id, tournament_id)

    @cache_through(
        key_func=lambda projection_id: f"projection:detail:{projection_id}",
        policy_name="PROJECTION_PLAYER_TOURNAMENT",
    )
    @invalidate_cache(
        CacheKeyBuilder.pattern_projection_all(),
        CacheKeyBuilder.betting_field_projections("*"),
    )
    async def publish_projection(self, projection_id: str) -> dict:
        """Publish projection with write-through caching and invalidation."""
        # This will:
        # 1. Update database
        # 2. Cache the result
        # 3. Invalidate all projection and betting cache keys
        return await self._db.publish_projection(projection_id)


class BettingServiceExample:
    """Example: Caching betting markets with volatile TTL."""

    @cache_aside(
        key_func=lambda market_id: CacheKeyBuilder.betting_market_detail(market_id),
        policy_name="BETTING_MARKET_DETAIL",  # 1 minute TTL due to volatility
    )
    async def get_market_odds(self, market_id: str) -> dict:
        """Get betting market odds (highly volatile, short TTL)."""
        return await self._odds_provider.fetch_odds(market_id)

    @cache_aside(
        key_func=lambda player_id, market_id: (
            CacheKeyBuilder.betting_edge(player_id, market_id)
        ),
        policy_name="BETTING_EDGE",  # 5 minutes TTL
    )
    async def calculate_betting_edge(self, player_id: str, market_id: str) -> dict:
        """Calculate betting edge (model predictions vs market)."""
        return await self._edge_calculator.compute(player_id, market_id)


class ContentServiceExample:
    """Example: Caching articles with content-driven invalidation."""

    @cache_aside(
        key_func=lambda slug: CacheKeyBuilder.page_article(slug),
        policy_name="PAGE_ARTICLE",  # 2 hour TTL
    )
    async def get_article(self, slug: str) -> dict:
        """Get article detail page with automatic caching."""
        return await self._db.get_article_by_slug(slug)

    @cache_through(
        key_func=lambda article_id: CacheKeyBuilder.page_article(article_id),
        policy_name="PAGE_ARTICLE",
    )
    @invalidate_cache(CacheKeyBuilder.page_articles_list("*"))
    async def update_article(self, article_id: str, data: dict) -> dict:
        """Update article with cache refresh and list invalidation."""
        return await self._db.update_article(article_id, data)


# -----------------------------------------------------------------------
# Event-Driven Invalidation Examples
# -----------------------------------------------------------------------


class EventHandlerExample:
    """Example: Handling cache invalidation events in services."""

    async def handle_tournament_started_event(self, tournament_id: str, tournament_slug: str) -> None:
        """Handle tournament start event."""
        # Update database
        await self._db.set_tournament_status(tournament_id, "in_progress")

        # Trigger cache invalidation flow
        await CacheInvalidationFlow.on_tournament_started(tournament_id, tournament_slug)

    async def handle_round_completed_event(self, tournament_id: str, tournament_slug: str) -> None:
        """Handle round completion event."""
        # Update scores in database
        await self._db.sync_scores(tournament_id)

        # Invalidate affected caches
        await CacheInvalidationFlow.on_round_completed(tournament_id, tournament_slug)

    async def handle_projection_published_event(self, projection_id: str, tournament_id: str) -> None:
        """Handle projection published event."""
        # Mark as published in database
        await self._db.publish_projection(projection_id)

        # Trigger cache invalidation
        await CacheInvalidationFlow.on_projection_published(projection_id, tournament_id)

    async def handle_market_odds_updated_event(self, market_id: str) -> None:
        """Handle market odds update (frequent event)."""
        # These updates happen very frequently — use dedicated handler
        await CacheInvalidationFlow.on_market_odds_updated(market_id)


# -----------------------------------------------------------------------
# Manual Cache Management Examples
# -----------------------------------------------------------------------


class ManualCacheExample:
    """Example: Explicit cache operations for advanced scenarios."""

    async def populate_leaderboard_cache(self, tournament_slug: str) -> None:
        """Proactively populate leaderboard cache (batch job)."""
        leaderboard = await self._db.query_leaderboard(tournament_slug)

        cache_key = CacheKeyBuilder.leaderboard_tournament(tournament_slug)
        policy = CachePolicy.LEADERBOARD_TOURNAMENT

        await CacheOps.set(cache_key, leaderboard, ttl_seconds=policy.ttl_seconds)

    async def get_or_refresh_player_summary(self, player_id: str) -> dict:
        """Get player summary or refresh if stale."""
        cache_key = CacheKeyBuilder.summary_player(player_id)

        # Check if in cache
        cached = await CacheOps.get(cache_key)
        if cached is not None:
            return cached

        # Compute summary
        summary = await self._db.compute_player_summary(player_id)

        # Cache with policy TTL
        policy = CachePolicy.SUMMARY_PLAYER
        await CacheOps.set(cache_key, summary, ttl_seconds=policy.ttl_seconds)

        return summary

    async def prefetch_tournament_data(self, tournament_slug: str) -> None:
        """Prefetch multiple tournament-related caches (batch operation)."""
        # This is useful for popular tournaments to warm cache
        tournament_id = await self._db.get_tournament_id(tournament_slug)

        # Prefetch multiple caches in parallel
        import asyncio

        leaderboard, rankings, projections, summary = await asyncio.gather(
            self._populate_leaderboard(tournament_slug),
            self._populate_rankings(tournament_slug),
            self._populate_projections(tournament_id),
            self._populate_summary(tournament_id),
        )

    async def cache_statistics(self) -> dict:
        """Get cache statistics (TTL, hit/miss tracking)."""
        # Count cached keys by pattern
        stats = {}

        patterns = [
            ("leaderboards", CacheKeyBuilder.pattern_leaderboard_all()),
            ("rankings", CacheKeyBuilder.pattern_ranking_all()),
            ("projections", CacheKeyBuilder.pattern_projection_all()),
            ("betting", CacheKeyBuilder.pattern_betting_all()),
            ("articles", "page:article:*"),
        ]

        for name, pattern in patterns:
            count = 0
            async for _ in CacheOps.get_client().scan_iter(match=pattern):
                count += 1
            stats[name] = count

        return stats


# -----------------------------------------------------------------------
# Conditional Caching Example
# -----------------------------------------------------------------------


from app.caching.decorators import conditional_cache


class SearchServiceExample:
    """Example: Conditional caching for search results."""

    @conditional_cache(
        key_func=lambda q, page: CacheKeyBuilder.search_players(q, page),
        should_cache=lambda result: result is not None and len(result) > 0,
        ttl_seconds=1800,  # Only cache non-empty results
    )
    async def search_players(self, q: str, page: int = 1) -> list[dict] | None:
        """Search players with conditional caching (cache only if results found)."""
        results = await self._search_engine.search(q, page)

        # Empty results not cached (avoid caching "no results" state)
        return results if results else None
