"""Database scaffolding for SQLAlchemy and Alembic."""

from app.db.analytics import (
    build_motherduck_url,
    dataframe_from_duckdb,
    dataframe_from_postgres,
    get_duckdb_connection,
    get_motherduck_connection,
    to_sync_postgres_url,
)
from app.db.base import Base, metadata

__all__ = [
    "Base",
    "metadata",
    "build_motherduck_url",
    "dataframe_from_duckdb",
    "dataframe_from_postgres",
    "get_duckdb_connection",
    "get_motherduck_connection",
    "to_sync_postgres_url",
]
