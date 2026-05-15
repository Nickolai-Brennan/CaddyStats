"""Pydantic schemas — stats domain."""

from __future__ import annotations

from datetime import date, datetime
from decimal import Decimal

from pydantic import BaseModel, Field


# ---------------------------------------------------------------------------
# Shared pagination
# ---------------------------------------------------------------------------

class PaginatedOut[T](BaseModel):
    items: list[T]
    total: int
    page: int
    page_size: int
    has_next: bool


# ---------------------------------------------------------------------------
# Player
# ---------------------------------------------------------------------------

class PlayerOut(BaseModel):
    id: str
    slug: str
    display_name: str
    first_name: str | None = None
    last_name: str | None = None
    nationality: str | None = None
    country_code: str | None = None
    handedness: str | None = None
    birth_date: date | None = None
    turned_pro: int | None = None
    active: bool
    world_ranking: int | None = None
    owgr_points: Decimal | None = None
    headshot_url: str | None = None
    updated_at: datetime

    model_config = {"from_attributes": True}


class PlayerListOut(BaseModel):
    id: str
    slug: str
    display_name: str
    world_ranking: int | None = None
    country_code: str | None = None
    active: bool

    model_config = {"from_attributes": True}


# ---------------------------------------------------------------------------
# Course
# ---------------------------------------------------------------------------

class CourseOut(BaseModel):
    id: str
    slug: str
    name: str
    location_city: str | None = None
    location_state: str | None = None
    location_country: str | None = None
    par: int | None = None
    yardage: int | None = None

    model_config = {"from_attributes": True}


# ---------------------------------------------------------------------------
# Tournament
# ---------------------------------------------------------------------------

class TournamentOut(BaseModel):
    id: str
    slug: str
    name: str
    tour: str
    season: int
    start_date: date | None = None
    end_date: date | None = None
    status: str
    purse_usd: int | None = None
    course: CourseOut | None = None
    updated_at: datetime

    model_config = {"from_attributes": True}


class TournamentListOut(BaseModel):
    id: str
    slug: str
    name: str
    tour: str
    season: int
    start_date: date | None = None
    status: str

    model_config = {"from_attributes": True}


# ---------------------------------------------------------------------------
# Projection
# ---------------------------------------------------------------------------

class ProjectionOut(BaseModel):
    id: str
    tournament_id: str
    player_id: str
    projection_type: str
    projected_value: Decimal | None = None
    percentile_outcomes: dict | None = None
    is_publishable: bool
    confidence_notes: str | None = None
    created_at: datetime

    player: PlayerListOut | None = None

    model_config = {"from_attributes": True}


class TournamentFieldEntryOut(BaseModel):
    player_id: str
    player_name: str
    player_slug: str
    world_ranking: int | None = None
    field_status: str
    win_probability: Decimal | None = None
    outright_odds_american: int | None = None

    model_config = {"from_attributes": True}


# ---------------------------------------------------------------------------
# Market
# ---------------------------------------------------------------------------

class MarketSelectionOut(BaseModel):
    id: str
    player_id: str | None = None
    selection_label: str | None = None
    odds_american: int | None = None
    odds_decimal: Decimal | None = None
    implied_probability: Decimal | None = None
    last_updated: datetime | None = None

    model_config = {"from_attributes": True}


class MarketOut(BaseModel):
    id: str
    tournament_id: str
    market_type: str
    provider: str
    status: str
    selections: list[MarketSelectionOut] = []
    updated_at: datetime

    model_config = {"from_attributes": True}


# ---------------------------------------------------------------------------
# Query params
# ---------------------------------------------------------------------------

class PlayerQueryParams(BaseModel):
    q: str | None = Field(default=None, description="Name search query")
    tour: str | None = None
    active: bool = True
    page: int = Field(default=1, ge=1)
    page_size: int = Field(default=50, ge=1, le=200)


class TournamentQueryParams(BaseModel):
    season: int | None = None
    tour: str = "pga"
    status: str | None = None
    page: int = Field(default=1, ge=1)
    page_size: int = Field(default=25, ge=1, le=100)
