"""API routes — projections domain."""

from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db_session
from app.schemas.stats import ProjectionOut
from app.services.stats import StatsService

router = APIRouter(prefix="/projections", tags=["projections"])


@router.get("/tournaments/{tournament_slug}", response_model=list[ProjectionOut])
async def get_tournament_projections(
    tournament_slug: str,
    db: Annotated[AsyncSession, Depends(get_db_session)],
) -> list[ProjectionOut]:
    return await StatsService(db).get_projections(tournament_slug)


@router.get("/players/{player_slug}", response_model=list[ProjectionOut])
async def get_player_projections(
    player_slug: str,
    db: Annotated[AsyncSession, Depends(get_db_session)],
    projection_type: str | None = Query(default=None),
    limit: int = Query(default=50, ge=1, le=200),
) -> list[ProjectionOut]:
    return await StatsService(db).get_player_projections(
        player_slug=player_slug,
        projection_type=projection_type,
        limit=limit,
    )
