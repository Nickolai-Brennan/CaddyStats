"""SQLAlchemy ORM models — stats schema."""

from __future__ import annotations

from datetime import date, datetime
from decimal import Decimal

from sqlalchemy import (
    Boolean,
    Date,
    DateTime,
    ForeignKey,
    Integer,
    Numeric,
    SmallInteger,
    String,
    Text,
    UniqueConstraint,
)
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base, TimestampMixin, UUIDPrimaryKeyMixin


class Player(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "players"
    __table_args__ = {"schema": "stats"}

    slug: Mapped[str] = mapped_column(String(128), nullable=False, unique=True)
    display_name: Mapped[str] = mapped_column(String(128), nullable=False)
    first_name: Mapped[str | None] = mapped_column(String(64))
    last_name: Mapped[str | None] = mapped_column(String(64))
    nationality: Mapped[str | None] = mapped_column(String(64))
    country_code: Mapped[str | None] = mapped_column(String(3))
    handedness: Mapped[str | None] = mapped_column(String(16))
    birth_date: Mapped[date | None] = mapped_column(Date)
    turned_pro: Mapped[int | None] = mapped_column(SmallInteger)
    active: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default="TRUE")
    world_ranking: Mapped[int | None] = mapped_column(Integer)
    owgr_points: Mapped[Decimal | None] = mapped_column(Numeric(10, 4))
    provider_ids: Mapped[dict | None] = mapped_column(JSONB)
    headshot_url: Mapped[str | None] = mapped_column(Text)

    entries: Mapped[list[TournamentEntry]] = relationship(
        back_populates="player", lazy="noload"
    )
    rounds: Mapped[list[Round]] = relationship(back_populates="player", lazy="noload")
    projections: Mapped[list[Projection]] = relationship(
        back_populates="player", lazy="noload"
    )


class Course(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "courses"
    __table_args__ = {"schema": "stats"}

    slug: Mapped[str] = mapped_column(String(128), nullable=False, unique=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    location_city: Mapped[str | None] = mapped_column(String(128))
    location_state: Mapped[str | None] = mapped_column(String(128))
    location_country: Mapped[str | None] = mapped_column(String(64))
    par: Mapped[int | None] = mapped_column(SmallInteger)
    yardage: Mapped[int | None] = mapped_column(Integer)
    grass_type_fairway: Mapped[str | None] = mapped_column(String(64))
    grass_type_green: Mapped[str | None] = mapped_column(String(64))

    tournaments: Mapped[list[Tournament]] = relationship(
        back_populates="course", lazy="noload"
    )


class Tournament(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "tournaments"
    __table_args__ = {"schema": "stats"}

    slug: Mapped[str] = mapped_column(String(128), nullable=False, unique=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    tour: Mapped[str] = mapped_column(String(32), nullable=False, server_default="'pga'")
    season: Mapped[int] = mapped_column(SmallInteger, nullable=False)
    start_date: Mapped[date | None] = mapped_column(Date)
    end_date: Mapped[date | None] = mapped_column(Date)
    status: Mapped[str] = mapped_column(String(32), nullable=False, server_default="'scheduled'")
    course_id: Mapped[str | None] = mapped_column(
        UUID(as_uuid=False), ForeignKey("stats.courses.id", ondelete="SET NULL")
    )
    purse_usd: Mapped[int | None] = mapped_column(Integer)
    fedex_cup_points: Mapped[int | None] = mapped_column(Integer)
    provider_ids: Mapped[dict | None] = mapped_column(JSONB)

    course: Mapped[Course | None] = relationship(back_populates="tournaments", lazy="joined")
    entries: Mapped[list[TournamentEntry]] = relationship(
        back_populates="tournament", lazy="noload"
    )
    rounds: Mapped[list[Round]] = relationship(back_populates="tournament", lazy="noload")
    model_runs: Mapped[list[ModelRun]] = relationship(
        back_populates="tournament", lazy="noload"
    )
    markets: Mapped[list[Market]] = relationship(back_populates="tournament", lazy="noload")


class TournamentEntry(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "tournament_entries"
    __table_args__ = (
        UniqueConstraint("tournament_id", "player_id"),
        {"schema": "stats"},
    )

    tournament_id: Mapped[str] = mapped_column(
        UUID(as_uuid=False), ForeignKey("stats.tournaments.id", ondelete="CASCADE"), nullable=False
    )
    player_id: Mapped[str] = mapped_column(
        UUID(as_uuid=False), ForeignKey("stats.players.id", ondelete="CASCADE"), nullable=False
    )
    field_status: Mapped[str] = mapped_column(
        String(32), nullable=False, server_default="'in_field'"
    )
    tee_time: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    position: Mapped[str | None] = mapped_column(String(16))
    total_score: Mapped[int | None] = mapped_column(Integer)
    total_strokes: Mapped[int | None] = mapped_column(Integer)
    earnings_usd: Mapped[int | None] = mapped_column(Integer)

    tournament: Mapped[Tournament] = relationship(back_populates="entries", lazy="joined")
    player: Mapped[Player] = relationship(back_populates="entries", lazy="joined")


class Round(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "rounds"
    __table_args__ = (
        UniqueConstraint("tournament_id", "player_id", "round_number"),
        {"schema": "stats"},
    )

    tournament_id: Mapped[str] = mapped_column(
        UUID(as_uuid=False), ForeignKey("stats.tournaments.id", ondelete="CASCADE"), nullable=False
    )
    player_id: Mapped[str] = mapped_column(
        UUID(as_uuid=False), ForeignKey("stats.players.id", ondelete="CASCADE"), nullable=False
    )
    round_number: Mapped[int] = mapped_column(SmallInteger, nullable=False)
    score: Mapped[int | None] = mapped_column(SmallInteger)
    score_to_par: Mapped[int | None] = mapped_column(SmallInteger)
    birdies: Mapped[int | None] = mapped_column(SmallInteger)
    eagles: Mapped[int | None] = mapped_column(SmallInteger)
    bogeys: Mapped[int | None] = mapped_column(SmallInteger)
    sg_total: Mapped[Decimal | None] = mapped_column(Numeric(6, 3))
    sg_off_tee: Mapped[Decimal | None] = mapped_column(Numeric(6, 3))
    sg_approach: Mapped[Decimal | None] = mapped_column(Numeric(6, 3))
    sg_around_green: Mapped[Decimal | None] = mapped_column(Numeric(6, 3))
    sg_putting: Mapped[Decimal | None] = mapped_column(Numeric(6, 3))
    sg_tee_to_green: Mapped[Decimal | None] = mapped_column(Numeric(6, 3))

    tournament: Mapped[Tournament] = relationship(back_populates="rounds", lazy="noload")
    player: Mapped[Player] = relationship(back_populates="rounds", lazy="noload")


class ModelRun(Base, UUIDPrimaryKeyMixin):
    __tablename__ = "model_runs"
    __table_args__ = {"schema": "stats"}

    tournament_id: Mapped[str] = mapped_column(
        UUID(as_uuid=False), ForeignKey("stats.tournaments.id", ondelete="CASCADE"), nullable=False
    )
    model_name: Mapped[str] = mapped_column(String(128), nullable=False)
    model_version: Mapped[str] = mapped_column(String(32), nullable=False)
    status: Mapped[str] = mapped_column(String(32), nullable=False, server_default="'pending'")
    run_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    notes: Mapped[str | None] = mapped_column(Text)

    tournament: Mapped[Tournament] = relationship(back_populates="model_runs", lazy="joined")
    projections: Mapped[list[Projection]] = relationship(
        back_populates="model_run", lazy="noload"
    )


class Projection(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "projections"
    __table_args__ = {"schema": "stats"}

    tournament_id: Mapped[str] = mapped_column(
        UUID(as_uuid=False), ForeignKey("stats.tournaments.id", ondelete="CASCADE"), nullable=False
    )
    player_id: Mapped[str] = mapped_column(
        UUID(as_uuid=False), ForeignKey("stats.players.id", ondelete="CASCADE"), nullable=False
    )
    model_run_id: Mapped[str | None] = mapped_column(
        UUID(as_uuid=False), ForeignKey("stats.model_runs.id", ondelete="SET NULL")
    )
    projection_type: Mapped[str] = mapped_column(String(64), nullable=False)
    projected_value: Mapped[Decimal | None] = mapped_column(Numeric(10, 6))
    percentile_outcomes: Mapped[dict | None] = mapped_column(JSONB)
    is_publishable: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default="FALSE")
    confidence_notes: Mapped[str | None] = mapped_column(Text)

    player: Mapped[Player] = relationship(back_populates="projections", lazy="joined")
    model_run: Mapped[ModelRun | None] = relationship(back_populates="projections", lazy="noload")


class Market(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "markets"
    __table_args__ = {"schema": "stats"}

    tournament_id: Mapped[str] = mapped_column(
        UUID(as_uuid=False), ForeignKey("stats.tournaments.id", ondelete="CASCADE"), nullable=False
    )
    market_type: Mapped[str] = mapped_column(String(64), nullable=False)
    provider: Mapped[str] = mapped_column(String(64), nullable=False)
    status: Mapped[str] = mapped_column(String(32), nullable=False, server_default="'open'")

    tournament: Mapped[Tournament] = relationship(back_populates="markets", lazy="joined")
    selections: Mapped[list[MarketSelection]] = relationship(
        back_populates="market", lazy="noload"
    )


class MarketSelection(Base, UUIDPrimaryKeyMixin):
    __tablename__ = "market_selections"
    __table_args__ = {"schema": "stats"}

    market_id: Mapped[str] = mapped_column(
        UUID(as_uuid=False), ForeignKey("stats.markets.id", ondelete="CASCADE"), nullable=False
    )
    player_id: Mapped[str | None] = mapped_column(
        UUID(as_uuid=False), ForeignKey("stats.players.id", ondelete="SET NULL")
    )
    selection_label: Mapped[str | None] = mapped_column(String(128))
    odds_american: Mapped[int | None] = mapped_column(Integer)
    odds_decimal: Mapped[Decimal | None] = mapped_column(Numeric(8, 4))
    implied_probability: Mapped[Decimal | None] = mapped_column(Numeric(8, 6))
    last_updated: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    market: Mapped[Market] = relationship(back_populates="selections", lazy="noload")
