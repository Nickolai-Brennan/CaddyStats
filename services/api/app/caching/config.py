"""Cache configuration — TTLs, priorities, and cache policies."""

from __future__ import annotations

from dataclasses import dataclass
from enum import IntEnum


class CachePriority(IntEnum):
    """Cache priority levels (lower = lower priority to evict)."""

    LOWEST = 1
    LOW = 2
    MEDIUM = 3
    HIGH = 4
    CRITICAL = 5


@dataclass
class CachePolicyEntry:
    """Single cache policy entry."""

    ttl_seconds: int
    priority: CachePriority = CachePriority.MEDIUM
    description: str = ""


class CachePolicy:
    """Centralized cache TTL and priority configuration."""

    # -----------------------------------------------------------------------
    # Leaderboard caches (high TTL, high priority)
    # -----------------------------------------------------------------------

    # Tournament leaderboards — updated post-round, rarely changes intra-round
    LEADERBOARD_TOURNAMENT: CachePolicyEntry = CachePolicyEntry(
        ttl_seconds=3600,  # 1 hour
        priority=CachePriority.HIGH,
        description="Tournament leaderboard by tournament slug",
    )

    # Course leaderboards — slower to change
    LEADERBOARD_COURSE: CachePolicyEntry = CachePolicyEntry(
        ttl_seconds=3600,  # 1 hour
        priority=CachePriority.MEDIUM,
        description="Course leaderboard by course ID",
    )

    # -----------------------------------------------------------------------
    # Ranking caches (high TTL, high priority)
    # -----------------------------------------------------------------------

    # World rankings — updated daily/weekly
    RANKING_WORLD: CachePolicyEntry = CachePolicyEntry(
        ttl_seconds=86400,  # 24 hours
        priority=CachePriority.CRITICAL,
        description="World golf rankings",
    )

    # FedEx Cup rankings — updated regularly
    RANKING_FEDEX_CUP: CachePolicyEntry = CachePolicyEntry(
        ttl_seconds=43200,  # 12 hours
        priority=CachePriority.HIGH,
        description="FedEx Cup standings",
    )

    # Tournament-specific rankings
    RANKING_TOURNAMENT: CachePolicyEntry = CachePolicyEntry(
        ttl_seconds=3600,  # 1 hour
        priority=CachePriority.HIGH,
        description="Tournament-specific rankings by tournament slug",
    )

    # -----------------------------------------------------------------------
    # Projection caches (medium TTL, medium priority)
    # -----------------------------------------------------------------------

    # Player projections for tournament
    PROJECTION_PLAYER_TOURNAMENT: CachePolicyEntry = CachePolicyEntry(
        ttl_seconds=1800,  # 30 minutes
        priority=CachePriority.MEDIUM,
        description="Player projections for tournament",
    )

    # Tournament projections summary
    PROJECTION_TOURNAMENT: CachePolicyEntry = CachePolicyEntry(
        ttl_seconds=1800,  # 30 minutes
        priority=CachePriority.MEDIUM,
        description="Tournament projection summary",
    )

    # Player projection history
    PROJECTION_PLAYER_HISTORY: CachePolicyEntry = CachePolicyEntry(
        ttl_seconds=3600,  # 1 hour
        priority=CachePriority.LOW,
        description="Player projection history and trends",
    )

    # -----------------------------------------------------------------------
    # Summary/Overview caches (medium TTL, medium priority)
    # -----------------------------------------------------------------------

    # Stats overview (total counts, aggregates)
    SUMMARY_STATS_OVERVIEW: CachePolicyEntry = CachePolicyEntry(
        ttl_seconds=900,  # 15 minutes
        priority=CachePriority.MEDIUM,
        description="Stats overview with totals and aggregates",
    )

    # Player summary (career stats, metadata)
    SUMMARY_PLAYER: CachePolicyEntry = CachePolicyEntry(
        ttl_seconds=3600,  # 1 hour
        priority=CachePriority.MEDIUM,
        description="Player summary with career stats",
    )

    # Tournament summary (field size, status, dates)
    SUMMARY_TOURNAMENT: CachePolicyEntry = CachePolicyEntry(
        ttl_seconds=1800,  # 30 minutes
        priority=CachePriority.MEDIUM,
        description="Tournament summary with current status",
    )

    # -----------------------------------------------------------------------
    # Page/Article caches (high TTL, medium priority)
    # -----------------------------------------------------------------------

    # Article detail page
    PAGE_ARTICLE: CachePolicyEntry = CachePolicyEntry(
        ttl_seconds=7200,  # 2 hours
        priority=CachePriority.MEDIUM,
        description="Article detail page by slug",
    )

    # Article list page
    PAGE_ARTICLES_LIST: CachePolicyEntry = CachePolicyEntry(
        ttl_seconds=3600,  # 1 hour
        priority=CachePriority.LOW,
        description="Paginated article list",
    )

    # Player profile page
    PAGE_PLAYER: CachePolicyEntry = CachePolicyEntry(
        ttl_seconds=3600,  # 1 hour
        priority=CachePriority.MEDIUM,
        description="Player profile page by slug",
    )

    # Tournament detail page
    PAGE_TOURNAMENT: CachePolicyEntry = CachePolicyEntry(
        ttl_seconds=1800,  # 30 minutes
        priority=CachePriority.MEDIUM,
        description="Tournament detail page by slug",
    )

    # -----------------------------------------------------------------------
    # Betting/Market caches (low TTL, high priority — volatile data)
    # -----------------------------------------------------------------------

    # Betting markets list
    BETTING_MARKETS: CachePolicyEntry = CachePolicyEntry(
        ttl_seconds=300,  # 5 minutes
        priority=CachePriority.HIGH,
        description="Active betting markets",
    )

    # Betting market detail (odds, spreads)
    BETTING_MARKET_DETAIL: CachePolicyEntry = CachePolicyEntry(
        ttl_seconds=60,  # 1 minute (very volatile)
        priority=CachePriority.CRITICAL,
        description="Betting market odds and details",
    )

    # Betting edge calculations (model predictions vs market)
    BETTING_EDGE: CachePolicyEntry = CachePolicyEntry(
        ttl_seconds=300,  # 5 minutes
        priority=CachePriority.HIGH,
        description="Calculated betting edge by player/market",
    )

    # Betting field projections
    BETTING_FIELD_PROJECTIONS: CachePolicyEntry = CachePolicyEntry(
        ttl_seconds=1800,  # 30 minutes
        priority=CachePriority.MEDIUM,
        description="Tournament field projection for betting",
    )

    # -----------------------------------------------------------------------
    # Entity metadata caches (high TTL, low priority)
    # -----------------------------------------------------------------------

    # Player metadata (name, bio, photo)
    METADATA_PLAYER: CachePolicyEntry = CachePolicyEntry(
        ttl_seconds=86400,  # 24 hours
        priority=CachePriority.LOW,
        description="Player metadata (name, bio, photos)",
    )

    # Tournament metadata
    METADATA_TOURNAMENT: CachePolicyEntry = CachePolicyEntry(
        ttl_seconds=86400,  # 24 hours
        priority=CachePriority.LOW,
        description="Tournament metadata (dates, location, course)",
    )

    # Course metadata
    METADATA_COURSE: CachePolicyEntry = CachePolicyEntry(
        ttl_seconds=604800,  # 7 days
        priority=CachePriority.LOW,
        description="Course metadata (yardage, par, layout)",
    )

    # -----------------------------------------------------------------------
    # Search/Discovery caches (medium TTL, low priority)
    # -----------------------------------------------------------------------

    # Player search results
    SEARCH_PLAYERS: CachePolicyEntry = CachePolicyEntry(
        ttl_seconds=1800,  # 30 minutes
        priority=CachePriority.LOW,
        description="Player search results by query",
    )

    # Tournament search results
    SEARCH_TOURNAMENTS: CachePolicyEntry = CachePolicyEntry(
        ttl_seconds=1800,  # 30 minutes
        priority=CachePriority.LOW,
        description="Tournament search results by query",
    )

    @classmethod
    def get_policy(cls, key: str) -> CachePolicyEntry | None:
        """Get cache policy for given key pattern."""
        # Try exact match on class attributes
        for attr_name in dir(cls):
            if attr_name.isupper():
                attr = getattr(cls, attr_name)
                if isinstance(attr, CachePolicyEntry):
                    return attr
        return None

    @classmethod
    def list_policies(cls) -> dict[str, CachePolicyEntry]:
        """List all cache policies."""
        policies = {}
        for attr_name in dir(cls):
            if attr_name.isupper():
                attr = getattr(cls, attr_name)
                if isinstance(attr, CachePolicyEntry):
                    policies[attr_name] = attr
        return policies


# Default cache policy for unknown keys
DEFAULT_CACHE_POLICY = CachePolicyEntry(
    ttl_seconds=600,  # 10 minutes
    priority=CachePriority.MEDIUM,
    description="Default cache policy",
)
