"""API routes — rankings domain."""

from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db_session
from app.schemas.stats import PlayerRankingOut
from app.services.stats import StatsService

router = APIRouter(prefix="/rankings", tags=["rankings"])


@router.get("/world", response_model=list[PlayerRankingOut])
async def world_rankings(
    db: Annotated[AsyncSession, Depends(get_db_session)],
    limit: int = Query(default=100, ge=1, le=500),
    country_code: str | None = Query(default=None, min_length=2, max_length=3),
) -> list[PlayerRankingOut]:
    return await StatsService(db).get_player_rankings(limit=limit, country_code=country_code)
