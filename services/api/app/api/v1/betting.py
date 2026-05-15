"""API routes — betting markets domain."""

from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db_session
from app.schemas.stats import MarketOut
from app.services.stats import StatsService

router = APIRouter(prefix="/betting", tags=["betting"])


@router.get("/markets/{tournament_slug}", response_model=list[MarketOut])
async def list_tournament_markets(
    tournament_slug: str,
    db: Annotated[AsyncSession, Depends(get_db_session)],
    market_type: str | None = Query(default=None),
    provider: str | None = Query(default=None),
) -> list[MarketOut]:
    return await StatsService(db).get_tournament_markets(
        slug=tournament_slug,
        market_type=market_type,
        provider=provider,
    )
