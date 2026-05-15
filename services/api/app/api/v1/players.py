"""API routes — players."""

from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db_session
from app.schemas.stats import PaginatedOut, PlayerListOut, PlayerOut
from app.services.stats import StatsService

router = APIRouter(prefix="/players", tags=["players"])


@router.get("", response_model=PaginatedOut[PlayerListOut])
async def list_players(
    db: Annotated[AsyncSession, Depends(get_db_session)],
    q: str | None = Query(default=None, description="Name search"),
    active: bool = Query(default=True),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=50, ge=1, le=200),
) -> PaginatedOut[PlayerListOut]:
    return await StatsService(db).list_players(q=q, active=active, page=page, page_size=page_size)


@router.get("/{slug}", response_model=PlayerOut)
async def get_player(
    slug: str,
    db: Annotated[AsyncSession, Depends(get_db_session)],
) -> PlayerOut:
    return await StatsService(db).get_player(slug)
