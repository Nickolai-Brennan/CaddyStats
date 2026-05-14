"""Tests for analytics database connection helpers."""

from __future__ import annotations

import duckdb
import pytest

from app.core.config import settings
from app.db.analytics import build_motherduck_url, dataframe_from_duckdb, to_sync_postgres_url


def test_to_sync_postgres_url_converts_asyncpg_driver() -> None:
    async_url = "postgresql+asyncpg://user:password@localhost:5432/caddystats"
    assert (
        to_sync_postgres_url(async_url)
        == "postgresql+psycopg://user:password@localhost:5432/caddystats"
    )


def test_to_sync_postgres_url_keeps_existing_sync_driver() -> None:
    sync_url = "postgresql+psycopg://user:password@localhost:5432/caddystats"
    assert to_sync_postgres_url(sync_url) == sync_url


def test_build_motherduck_url_adds_token_when_missing(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(settings, "MOTHERDUCK_TOKEN", "sample-value")
    assert (
        build_motherduck_url(base_url="md:caddystats")
        == "md:caddystats?motherduck_token=sample-value"
    )


def test_build_motherduck_url_keeps_existing_token(monkeypatch: pytest.MonkeyPatch) -> None:
    url = "md:caddystats?motherduck_token=already-set"
    monkeypatch.setattr(settings, "MOTHERDUCK_TOKEN", "ignored-value")
    assert build_motherduck_url(base_url=url) == url


def test_dataframe_from_duckdb_returns_dataframe() -> None:
    connection = duckdb.connect(":memory:")
    try:
        dataframe = dataframe_from_duckdb("SELECT 1 AS value", connection=connection)
        assert dataframe.to_dict(orient="records") == [{"value": 1}]
    finally:
        connection.close()
