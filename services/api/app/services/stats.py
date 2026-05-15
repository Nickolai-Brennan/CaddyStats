"""Service — stats domain (thin orchestration over repositories)."""

from __future__ import annotations

from fastapi import HTTPException, status
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.stats import (
    MarketRepository,
    PlayerRepository,
    ProjectionRepository,
    TournamentRepository,
)
from app.schemas.operations import StatsOverviewOut
from app.schemas.stats import (
    LeaderboardEntryOut,
    MarketOut,
    PaginatedOut,
    PlayerListOut,
    PlayerOut,
    PlayerRankingOut,
    PlayerRoundOut,
    ProjectionOut,
    TournamentFieldEntryOut,
    TournamentListOut,
    TournamentOut,
)


class StatsService:
    def __init__(self, db: AsyncSession) -> None:
        self._db = db
        self._players = PlayerRepository(db)
        self._tournaments = TournamentRepository(db)
        self._projections = ProjectionRepository(db)
        self._markets = MarketRepository(db)

    async def get_overview(self) -> StatsOverviewOut:
        query = text(
            """
            SELECT
                (SELECT COUNT(*) FROM stats.players WHERE active = TRUE) AS active_players,
                (SELECT COUNT(*) FROM stats.tournaments WHERE status IN ('scheduled','in_progress')) AS active_tournaments,
                (SELECT COUNT(*) FROM stats.projections WHERE is_publishable = TRUE) AS publishable_projections,
                (SELECT COUNT(*) FROM stats.markets WHERE status = 'open') AS open_markets
            """
        )
        result = await self._db.execute(query)
        row = result.mappings().one()
        return StatsOverviewOut.model_validate(dict(row))

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
            has_next=(page * page_size) < total,
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
            has_next=(page * page_size) < total,
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

    async def get_player_projections(
        self,
        player_slug: str,
        projection_type: str | None,
        limit: int,
    ) -> list[ProjectionOut]:
        player = await self._players.get_by_slug(player_slug)
        if player is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Player not found")
        projections = await self._projections.list_for_player(
            str(player.id),
            projection_type=projection_type,
            limit=limit,
        )
        return [ProjectionOut.model_validate(item) for item in projections]

    async def get_tournament_markets(
        self,
        slug: str,
        market_type: str | None,
        provider: str | None,
    ) -> list[MarketOut]:
        tournament = await self._tournaments.get_by_slug(slug)
        if tournament is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tournament not found")
        markets = await self._markets.list_for_tournament(
            str(tournament.id),
            market_type=market_type,
            provider=provider,
        )
        return [MarketOut.model_validate(item) for item in markets]

    async def get_player_rankings(
        self,
        limit: int,
        country_code: str | None,
    ) -> list[PlayerRankingOut]:
        players = await self._players.list_rankings(limit=limit, country_code=country_code)
        return [PlayerRankingOut.model_validate(player) for player in players]

    async def get_tournament_leaderboard(self, slug: str, limit: int) -> list[LeaderboardEntryOut]:
        tournament = await self._tournaments.get_by_slug(slug)
        if tournament is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tournament not found")
        entries = await self._tournaments.get_leaderboard(str(tournament.id), limit=limit)
        return [LeaderboardEntryOut.model_validate(item) for item in entries]

    async def get_player_recent_rounds(self, slug: str, limit: int) -> list[PlayerRoundOut]:
        player = await self._players.get_by_slug(slug)
        if player is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Player not found")
        rounds = await self._players.recent_rounds(str(player.id), limit=limit)
        return [PlayerRoundOut.model_validate(item) for item in rounds]
