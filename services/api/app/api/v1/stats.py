"""API routes — stats operations."""

from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db_session
from app.schemas.operations import StatsOverviewOut
from app.schemas.stats import LeaderboardEntryOut, PlayerRoundOut
from app.services.stats import StatsService

router = APIRouter(prefix="/stats", tags=["stats"])


@router.get("/overview", response_model=StatsOverviewOut)
async def get_stats_overview(
    db: Annotated[AsyncSession, Depends(get_db_session)],
) -> StatsOverviewOut:
    return await StatsService(db).get_overview()


@router.get("/leaderboard/{tournament_slug}", response_model=list[LeaderboardEntryOut])
async def get_leaderboard(
    tournament_slug: str,
    db: Annotated[AsyncSession, Depends(get_db_session)],
    limit: int = Query(default=50, ge=1, le=200),
) -> list[LeaderboardEntryOut]:
    return await StatsService(db).get_tournament_leaderboard(tournament_slug, limit=limit)


@router.get("/players/{player_slug}/rounds", response_model=list[PlayerRoundOut])
async def get_player_rounds(
    player_slug: str,
    db: Annotated[AsyncSession, Depends(get_db_session)],
    limit: int = Query(default=20, ge=1, le=100),
) -> list[PlayerRoundOut]:
    return await StatsService(db).get_player_recent_rounds(player_slug, limit=limit)
