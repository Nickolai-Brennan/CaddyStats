"""Cache key builders — Structured cache key generation with type safety."""

from __future__ import annotations

from typing import Literal


class CacheKeyBuilder:
    """Typed cache key generation for all domains."""

    # -----------------------------------------------------------------------
    # Leaderboard Keys
    # -----------------------------------------------------------------------

    @staticmethod
    def leaderboard_tournament(tournament_slug: str) -> str:
        """Tournament leaderboard by slug."""
        return f"leaderboard:tournament:{tournament_slug}"

    @staticmethod
    def leaderboard_course(course_id: str) -> str:
        """Course leaderboard by course ID."""
        return f"leaderboard:course:{course_id}"

    # -----------------------------------------------------------------------
    # Ranking Keys
    # -----------------------------------------------------------------------

    @staticmethod
    def ranking_world() -> str:
        """World golf rankings."""
        return "ranking:world"

    @staticmethod
    def ranking_fedex_cup() -> str:
        """FedEx Cup standings."""
        return "ranking:fedex_cup"

    @staticmethod
    def ranking_tournament(tournament_slug: str) -> str:
        """Tournament-specific rankings."""
        return f"ranking:tournament:{tournament_slug}"

    # -----------------------------------------------------------------------
    # Projection Keys
    # -----------------------------------------------------------------------

    @staticmethod
    def projection_player_tournament(
        player_id: str,
        tournament_id: str,
    ) -> str:
        """Player projections for specific tournament."""
        return f"projection:player_tournament:{player_id}:{tournament_id}"

    @staticmethod
    def projection_tournament_summary(tournament_id: str) -> str:
        """Tournament projection summary."""
        return f"projection:tournament_summary:{tournament_id}"

    @staticmethod
    def projection_player_history(
        player_id: str,
        lookback_days: int = 30,
    ) -> str:
        """Player projection history and trends."""
        return f"projection:player_history:{player_id}:{lookback_days}d"

    # -----------------------------------------------------------------------
    # Summary / Overview Keys
    # -----------------------------------------------------------------------

    @staticmethod
    def summary_stats_overview() -> str:
        """Stats overview with totals and aggregates."""
        return "summary:stats_overview"

    @staticmethod
    def summary_player(player_id: str) -> str:
        """Player summary with career stats."""
        return f"summary:player:{player_id}"

    @staticmethod
    def summary_tournament(tournament_id: str) -> str:
        """Tournament summary with status."""
        return f"summary:tournament:{tournament_id}"

    # -----------------------------------------------------------------------
    # Page / Article Keys
    # -----------------------------------------------------------------------

    @staticmethod
    def page_article(slug: str) -> str:
        """Article detail page by slug."""
        return f"page:article:{slug}"

    @staticmethod
    def page_articles_list(
        status: str | None = None,
        author_slug: str | None = None,
        tag_slug: str | None = None,
        search_query: str | None = None,
        page: int = 1,
        page_size: int = 20,
    ) -> str:
        """Paginated article list with filters."""
        parts = ["page:articles_list"]

        if status:
            parts.append(f"status={status}")
        if author_slug:
            parts.append(f"author={author_slug}")
        if tag_slug:
            parts.append(f"tag={tag_slug}")
        if search_query:
            # Simple hash to keep key length reasonable
            query_hash = hash(search_query) % 10000000
            parts.append(f"q={query_hash}")

        parts.append(f"p={page}:ps={page_size}")

        return ":".join(parts)

    @staticmethod
    def page_player(player_slug: str) -> str:
        """Player profile page by slug."""
        return f"page:player:{player_slug}"

    @staticmethod
    def page_tournament(tournament_slug: str) -> str:
        """Tournament detail page by slug."""
        return f"page:tournament:{tournament_slug}"

    # -----------------------------------------------------------------------
    # Betting / Market Keys
    # -----------------------------------------------------------------------

    @staticmethod
    def betting_markets(
        status: str | None = None,
        market_type: str | None = None,
    ) -> str:
        """Active betting markets."""
        parts = ["betting:markets"]

        if status:
            parts.append(f"status={status}")
        if market_type:
            parts.append(f"type={market_type}")

        return ":".join(parts)

    @staticmethod
    def betting_market_detail(market_id: str) -> str:
        """Betting market odds and details."""
        return f"betting:market_detail:{market_id}"

    @staticmethod
    def betting_edge(
        player_id: str,
        market_id: str,
        model_version: str = "default",
    ) -> str:
        """Calculated betting edge by player/market."""
        return f"betting:edge:{player_id}:{market_id}:{model_version}"

    @staticmethod
    def betting_field_projections(
        tournament_id: str,
        model_version: str = "default",
    ) -> str:
        """Tournament field projection for betting."""
        return f"betting:field_projections:{tournament_id}:{model_version}"

    # -----------------------------------------------------------------------
    # Metadata Keys
    # -----------------------------------------------------------------------

    @staticmethod
    def metadata_player(player_id: str) -> str:
        """Player metadata (name, bio, photos)."""
        return f"metadata:player:{player_id}"

    @staticmethod
    def metadata_tournament(tournament_id: str) -> str:
        """Tournament metadata (dates, location, course)."""
        return f"metadata:tournament:{tournament_id}"

    @staticmethod
    def metadata_course(course_id: str) -> str:
        """Course metadata (yardage, par, layout)."""
        return f"metadata:course:{course_id}"

    # -----------------------------------------------------------------------
    # Search / Discovery Keys
    # -----------------------------------------------------------------------

    @staticmethod
    def search_players(
        query: str,
        page: int = 1,
        page_size: int = 20,
    ) -> str:
        """Player search results."""
        # Simple hash to keep key length reasonable
        query_hash = hash(query) % 10000000
        return f"search:players:{query_hash}:p={page}:ps={page_size}"

    @staticmethod
    def search_tournaments(
        query: str,
        page: int = 1,
        page_size: int = 20,
    ) -> str:
        """Tournament search results."""
        # Simple hash to keep key length reasonable
        query_hash = hash(query) % 10000000
        return f"search:tournaments:{query_hash}:p={page}:ps={page_size}"

    # -----------------------------------------------------------------------
    # Invalidation / Tracking Keys
    # -----------------------------------------------------------------------

    @staticmethod
    def invalidation_player(player_id: str) -> str:
        """Invalidation tag for player-related caches."""
        return f"inv:player:{player_id}"

    @staticmethod
    def invalidation_tournament(tournament_id: str) -> str:
        """Invalidation tag for tournament-related caches."""
        return f"inv:tournament:{tournament_id}"

    @staticmethod
    def invalidation_market(market_id: str) -> str:
        """Invalidation tag for market-related caches."""
        return f"inv:market:{market_id}"

    @staticmethod
    def invalidation_projection(projection_id: str) -> str:
        """Invalidation tag for projection-related caches."""
        return f"inv:projection:{projection_id}"

    @staticmethod
    def invalidation_article(article_id: str) -> str:
        """Invalidation tag for article-related caches."""
        return f"inv:article:{article_id}"

    # -----------------------------------------------------------------------
    # Pattern Matchers for Bulk Operations
    # -----------------------------------------------------------------------

    @staticmethod
    def pattern_leaderboard_all() -> str:
        """Pattern to match all leaderboard caches."""
        return "leaderboard:*"

    @staticmethod
    def pattern_ranking_all() -> str:
        """Pattern to match all ranking caches."""
        return "ranking:*"

    @staticmethod
    def pattern_projection_all() -> str:
        """Pattern to match all projection caches."""
        return "projection:*"

    @staticmethod
    def pattern_betting_all() -> str:
        """Pattern to match all betting-related caches."""
        return "betting:*"

    @staticmethod
    def pattern_betting_edges_for_player(player_id: str) -> str:
        """Pattern to match all betting edges for a player."""
        return f"betting:edge:{player_id}:*"

    @staticmethod
    def pattern_projections_for_tournament(tournament_id: str) -> str:
        """Pattern to match all projections for a tournament."""
        return f"projection:*tournament:*:{tournament_id}:*"

    @staticmethod
    def pattern_leaderboards_for_tournament(tournament_slug: str) -> str:
        """Pattern to match leaderboard for tournament."""
        return f"leaderboard:tournament:{tournament_slug}"

    @staticmethod
    def pattern_rankings_for_tournament(tournament_slug: str) -> str:
        """Pattern to match rankings for tournament."""
        return f"ranking:tournament:{tournament_slug}"

    @staticmethod
    def pattern_article_related(article_id: str) -> str:
        """Pattern to match all caches related to an article."""
        return f"*article*{article_id}*"

    @staticmethod
    def pattern_player_related(player_id: str) -> str:
        """Pattern to match all caches related to a player."""
        return f"*{player_id}*"
