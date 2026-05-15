"""API routes — tournaments, field, projections."""

from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db_session
from app.schemas.stats import (
    PaginatedOut,
    ProjectionOut,
    TournamentFieldEntryOut,
    TournamentListOut,
    TournamentOut,
)
from app.services.stats import StatsService

router = APIRouter(prefix="/tournaments", tags=["tournaments"])


@router.get("", response_model=PaginatedOut[TournamentListOut])
async def list_tournaments(
    db: Annotated[AsyncSession, Depends(get_db_session)],
    season: int | None = Query(default=None),
    tour: str = Query(default="pga"),
    status: str | None = Query(default=None),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=25, ge=1, le=100),
) -> PaginatedOut[TournamentListOut]:
    return await StatsService(db).list_tournaments(
        season=season, tour=tour, status=status, page=page, page_size=page_size
    )


@router.get("/{slug}", response_model=TournamentOut)
async def get_tournament(
    slug: str,
    db: Annotated[AsyncSession, Depends(get_db_session)],
) -> TournamentOut:
    return await StatsService(db).get_tournament(slug)


@router.get("/{slug}/field", response_model=list[TournamentFieldEntryOut])
async def get_field(
    slug: str,
    db: Annotated[AsyncSession, Depends(get_db_session)],
) -> list[TournamentFieldEntryOut]:
    return await StatsService(db).get_field(slug)


@router.get("/{slug}/projections", response_model=list[ProjectionOut])
async def get_projections(
    slug: str,
    db: Annotated[AsyncSession, Depends(get_db_session)],
) -> list[ProjectionOut]:
    return await StatsService(db).get_projections(slug)
