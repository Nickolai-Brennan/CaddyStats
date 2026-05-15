"""Repository — stats domain (players, tournaments, projections)."""

from __future__ import annotations

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload, selectinload

from app.models.stats import (
    Market,
    MarketSelection,
    Player,
    Projection,
    Round,
    Tournament,
    TournamentEntry,
)


class PlayerRepository:
    def __init__(self, db: AsyncSession) -> None:
        self._db = db

    async def get_by_id(self, player_id: str) -> Player | None:
        result = await self._db.execute(select(Player).where(Player.id == player_id))
        return result.scalar_one_or_none()

    async def get_by_slug(self, slug: str) -> Player | None:
        result = await self._db.execute(select(Player).where(Player.slug == slug))
        return result.scalar_one_or_none()

    async def list(
        self,
        q: str | None = None,
        active: bool = True,
        page: int = 1,
        page_size: int = 50,
    ) -> tuple[list[Player], int]:
        stmt = select(Player).where(Player.active == active)
        if q:
            stmt = stmt.where(Player.display_name.ilike(f"%{q}%"))
        count_result = await self._db.execute(select(func.count()).select_from(stmt.subquery()))
        total = count_result.scalar_one()
        stmt = stmt.order_by(Player.world_ranking.asc().nulls_last(), Player.display_name.asc())
        stmt = stmt.offset((page - 1) * page_size).limit(page_size)
        result = await self._db.execute(stmt)
        return list(result.scalars().all()), total

    async def list_rankings(
        self,
        limit: int = 100,
        country_code: str | None = None,
    ) -> list[Player]:
        stmt = select(Player).where(Player.active.is_(True))
        if country_code:
            stmt = stmt.where(Player.country_code == country_code.upper())
        stmt = stmt.order_by(Player.world_ranking.asc().nulls_last(), Player.display_name.asc())
        stmt = stmt.limit(limit)
        result = await self._db.execute(stmt)
        return list(result.scalars().all())

    async def recent_rounds(self, player_id: str, limit: int = 20) -> list[Round]:
        stmt = (
            select(Round)
            .where(Round.player_id == player_id)
            .order_by(Round.updated_at.desc())
            .limit(limit)
        )
        result = await self._db.execute(stmt)
        return list(result.scalars().all())


class TournamentRepository:
    def __init__(self, db: AsyncSession) -> None:
        self._db = db

    async def get_by_id(self, tournament_id: str) -> Tournament | None:
        result = await self._db.execute(
            select(Tournament)
            .where(Tournament.id == tournament_id)
            .options(joinedload(Tournament.course))
        )
        return result.scalar_one_or_none()

    async def get_by_slug(self, slug: str) -> Tournament | None:
        result = await self._db.execute(
            select(Tournament)
            .where(Tournament.slug == slug)
            .options(joinedload(Tournament.course))
        )
        return result.scalar_one_or_none()

    async def list(
        self,
        season: int | None = None,
        tour: str = "pga",
        status: str | None = None,
        page: int = 1,
        page_size: int = 25,
    ) -> tuple[list[Tournament], int]:
        stmt = select(Tournament).where(Tournament.tour == tour)
        if season:
            stmt = stmt.where(Tournament.season == season)
        if status:
            stmt = stmt.where(Tournament.status == status)
        count_result = await self._db.execute(select(func.count()).select_from(stmt.subquery()))
        total = count_result.scalar_one()
        stmt = stmt.order_by(Tournament.start_date.asc().nulls_last())
        stmt = stmt.offset((page - 1) * page_size).limit(page_size)
        result = await self._db.execute(stmt.options(joinedload(Tournament.course)))
        return list(result.scalars().unique().all()), total

    async def get_field(self, tournament_id: str) -> list[TournamentEntry]:
        result = await self._db.execute(
            select(TournamentEntry)
            .where(
                TournamentEntry.tournament_id == tournament_id,
                TournamentEntry.field_status == "in_field",
            )
            .options(joinedload(TournamentEntry.player))
        )
        return list(result.scalars().all())

    async def get_leaderboard(self, tournament_id: str, limit: int = 50) -> list[TournamentEntry]:
        stmt = (
            select(TournamentEntry)
            .where(TournamentEntry.tournament_id == tournament_id)
            .options(joinedload(TournamentEntry.player))
            .order_by(TournamentEntry.total_score.asc().nulls_last(), TournamentEntry.player_id.asc())
            .limit(limit)
        )
        result = await self._db.execute(stmt)
        return list(result.scalars().all())


class ProjectionRepository:
    def __init__(self, db: AsyncSession) -> None:
        self._db = db

    async def list_for_tournament(
        self,
        tournament_id: str,
        projection_type: str = "win_probability",
        publishable_only: bool = True,
    ) -> list[Projection]:
        stmt = select(Projection).where(
            Projection.tournament_id == tournament_id,
            Projection.projection_type == projection_type,
        )
        if publishable_only:
            stmt = stmt.where(Projection.is_publishable.is_(True))
        stmt = stmt.order_by(Projection.projected_value.desc().nulls_last())
        stmt = stmt.options(joinedload(Projection.player))
        result = await self._db.execute(stmt)
        return list(result.scalars().all())

    async def list_for_player(
        self,
        player_id: str,
        projection_type: str | None = None,
        limit: int = 50,
    ) -> list[Projection]:
        stmt = select(Projection).where(Projection.player_id == player_id)
        if projection_type:
            stmt = stmt.where(Projection.projection_type == projection_type)
        stmt = (
            stmt.order_by(Projection.created_at.desc())
            .options(joinedload(Projection.player))
            .limit(limit)
        )
        result = await self._db.execute(stmt)
        return list(result.scalars().all())


class MarketRepository:
    def __init__(self, db: AsyncSession) -> None:
        self._db = db

    async def list_for_tournament(
        self,
        tournament_id: str,
        market_type: str | None = None,
        provider: str | None = None,
    ) -> list[Market]:
        stmt = select(Market).where(Market.tournament_id == tournament_id)
        if market_type:
            stmt = stmt.where(Market.market_type == market_type)
        if provider:
            stmt = stmt.where(Market.provider == provider)
        stmt = stmt.order_by(Market.updated_at.desc())
        stmt = stmt.options(selectinload(Market.selections))
        result = await self._db.execute(stmt)
        return list(result.scalars().unique().all())

    async def list_selections(self, market_id: str) -> list[MarketSelection]:
        result = await self._db.execute(
            select(MarketSelection)
            .where(MarketSelection.market_id == market_id)
            .order_by(MarketSelection.implied_probability.desc().nulls_last())
        )
        return list(result.scalars().all())
