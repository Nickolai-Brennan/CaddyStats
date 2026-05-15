"""Service — stats domain (thin orchestration over repositories)."""

from __future__ import annotations

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.stats import PlayerRepository, ProjectionRepository, TournamentRepository
from app.schemas.stats import (
    PaginatedOut,
    PlayerListOut,
    PlayerOut,
    ProjectionOut,
    TournamentFieldEntryOut,
    TournamentListOut,
    TournamentOut,
)


class StatsService:
    def __init__(self, db: AsyncSession) -> None:
        self._players = PlayerRepository(db)
        self._tournaments = TournamentRepository(db)
        self._projections = ProjectionRepository(db)

    # ------------------------------------------------------------------
    # Players
    # ------------------------------------------------------------------

    async def list_players(
        self, q: str | None, active: bool, page: int, page_size: int
    ) -> PaginatedOut[PlayerListOut]:
        items, total = await self._players.list(q=q, active=active, page=page, page_size=page_size)
        return PaginatedOut(
            items=[PlayerListOut.model_validate(p) for p in items],
            total=total,
            page=page,
            page_size=page_size,
        )

    async def get_player(self, slug: str) -> PlayerOut:
        player = await self._players.get_by_slug(slug)
        if player is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Player not found")
        return PlayerOut.model_validate(player)

    # ------------------------------------------------------------------
    # Tournaments
    # ------------------------------------------------------------------

    async def list_tournaments(
        self, season: int | None, tour: str, status: str | None, page: int, page_size: int
    ) -> PaginatedOut[TournamentListOut]:
        items, total = await self._tournaments.list(
            season=season, tour=tour, status=status, page=page, page_size=page_size
        )
        return PaginatedOut(
            items=[TournamentListOut.model_validate(t) for t in items],
            total=total,
            page=page,
            page_size=page_size,
        )

    async def get_tournament(self, slug: str) -> TournamentOut:
        tournament = await self._tournaments.get_by_slug(slug)
        if tournament is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tournament not found")
        return TournamentOut.model_validate(tournament)

    async def get_field(self, slug: str) -> list[TournamentFieldEntryOut]:
        tournament = await self._tournaments.get_by_slug(slug)
        if tournament is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tournament not found")
        entries = await self._tournaments.get_field(str(tournament.id))
        return [TournamentFieldEntryOut.model_validate(e) for e in entries]

    async def get_projections(self, slug: str) -> list[ProjectionOut]:
        tournament = await self._tournaments.get_by_slug(slug)
        if tournament is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tournament not found")
        projections = await self._projections.list_for_tournament(str(tournament.id))
        return [ProjectionOut.model_validate(p) for p in projections]
