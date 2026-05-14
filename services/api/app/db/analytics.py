"""Database connection helpers for analytics and graph-ready pandas DataFrames."""

from __future__ import annotations

from collections.abc import Mapping
from functools import lru_cache
from pathlib import Path
from typing import Any

import duckdb
import pandas as pd
from sqlalchemy import Engine, create_engine, text

from app.core.config import settings


def to_sync_postgres_url(database_url: str | None = None) -> str:
    """Convert async SQLAlchemy Postgres URLs to sync psycopg URLs."""
    url = database_url or settings.DATABASE_URL
    return url.replace("postgresql+asyncpg://", "postgresql+psycopg://", 1)


@lru_cache(maxsize=1)
def get_postgres_engine() -> Engine:
    """Build and cache a sync PostgreSQL engine for pandas workloads."""
    return create_engine(to_sync_postgres_url(), pool_pre_ping=True)


@lru_cache(maxsize=8)
def get_postgres_engine_for_url(database_url: str) -> Engine:
    """Build and cache a sync PostgreSQL engine for a provided URL."""
    return create_engine(to_sync_postgres_url(database_url), pool_pre_ping=True)


def build_motherduck_url(
    base_url: str | None = None,
    database: str | None = None,
) -> str:
    """Build a MotherDuck connection URL and append token when provided."""
    resolved_database = database or settings.MOTHERDUCK_DATABASE
    resolved_base_url = base_url or settings.MOTHERDUCK_URL or f"md:{resolved_database}"
    resolved_token = settings.MOTHERDUCK_TOKEN

    if not resolved_token or "motherduck_token=" in resolved_base_url:
        return resolved_base_url

    separator = "&" if "?" in resolved_base_url else "?"
    return f"{resolved_base_url}{separator}motherduck_token={resolved_token}"


def get_duckdb_connection(
    path: str | None = None,
    *,
    read_only: bool = False,
) -> duckdb.DuckDBPyConnection:
    """Return a local DuckDB connection."""
    resolved_path = path or settings.DUCKDB_PATH
    if resolved_path != ":memory:":
        path_object = Path(resolved_path)
        if not path_object.is_absolute():
            path_object = Path.cwd() / path_object
        if not read_only and path_object.parent:
            path_object.parent.mkdir(parents=True, exist_ok=True)
        resolved_path = str(path_object)
    return duckdb.connect(resolved_path, read_only=read_only)


def get_motherduck_connection(
    base_url: str | None = None,
    database: str | None = None,
    *,
    read_only: bool = True,
) -> duckdb.DuckDBPyConnection:
    """Return a MotherDuck-backed DuckDB connection."""
    connection_url = build_motherduck_url(
        base_url=base_url,
        database=database,
    )
    return duckdb.connect(connection_url, read_only=read_only)


def dataframe_from_postgres(
    query: str,
    params: Mapping[str, Any] | None = None,
    database_url: str | None = None,
) -> pd.DataFrame:
    """Run a trusted PostgreSQL query and return a pandas DataFrame for graphing.

    Callers should pass static SQL or parameterized SQL with bound params.
    """
    engine = (
        get_postgres_engine_for_url(database_url)
        if database_url
        else get_postgres_engine()
    )
    with engine.connect() as connection:
        chunks = pd.read_sql_query(
            text(query),
            connection,
            params=params or {},
            chunksize=settings.PANDAS_QUERY_ROW_LIMIT,
        )
        for chunk in chunks:
            return chunk
    return pd.DataFrame()


def dataframe_from_duckdb(
    query: str,
    params: Mapping[str, Any] | None = None,
    connection: duckdb.DuckDBPyConnection | None = None,
) -> pd.DataFrame:
    """Run a trusted DuckDB/MotherDuck query and return a pandas DataFrame for graphing.

    Callers should pass static SQL or parameterized SQL with bound params.
    """
    owns_connection = connection is None
    active_connection = connection or get_duckdb_connection()
    try:
        cursor = active_connection.execute(query, params or {})
        rows = cursor.fetchmany(settings.PANDAS_QUERY_ROW_LIMIT)
        columns = [column[0] for column in (cursor.description or [])]
        return pd.DataFrame(rows, columns=columns)
    finally:
        if owns_connection:
            active_connection.close()
