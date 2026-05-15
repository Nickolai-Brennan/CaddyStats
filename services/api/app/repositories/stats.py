"""Repository — stats domain (players, tournaments, projections)."""

from __future__ import annotations

from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload, selectinload

from app.models.stats import Player, Projection, Tournament, TournamentEntry


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
