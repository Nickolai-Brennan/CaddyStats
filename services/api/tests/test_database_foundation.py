"""Integration coverage for the foundational PostgreSQL migration."""
# ruff: noqa: E501

from __future__ import annotations

import asyncio
import os
from pathlib import Path

from alembic.config import Config
from sqlalchemy import text
from sqlalchemy.ext.asyncio import create_async_engine

from alembic import command
from scripts.database.seed import run_seed

TEST_DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+asyncpg://caddystats:caddystats_test@127.0.0.1:5433/caddystats_test",
)


async def _wait_for_database(database_url: str) -> None:
    """Wait until PostgreSQL accepts connections."""
    engine = create_async_engine(database_url, pool_pre_ping=True)
    for _ in range(30):
        try:
            async with engine.connect() as connection:
                await connection.execute(text("SELECT 1"))
            await engine.dispose()
            return
        except Exception:  # noqa: BLE001
            await asyncio.sleep(1)
    await engine.dispose()
    raise RuntimeError("PostgreSQL test database did not become ready in time.")


def _alembic_config(database_url: str) -> Config:
    """Build an Alembic config that targets the test database."""
    config = Config(str(Path(__file__).resolve().parents[1] / "alembic.ini"))
    config.set_main_option("sqlalchemy.url", database_url)
    return config


async def _collect_schema_state(
    database_url: str,
) -> tuple[set[str], set[tuple[str, str]], set[str], set[tuple[str, str]]]:
    """Collect schemas, tables, indexes, and RLS-enabled tables."""
    engine = create_async_engine(database_url, pool_pre_ping=True)
    async with engine.begin() as connection:
        schema_names = {
            row[0]
            for row in (
                await connection.execute(
                    text(
                        """
                        SELECT schema_name
                        FROM information_schema.schemata
                        WHERE schema_name IN (
                            'auth', 'content', 'stats', 'analytics', 'ai', 'system', 'ingestion', 'billing'
                        )
                        """
                    )
                )
            )
        }
        tables = {
            (row[0], row[1])
            for row in (
                await connection.execute(
                    text(
                        """
                        SELECT table_schema, table_name
                        FROM information_schema.tables
                        WHERE (table_schema, table_name) IN (
                            ('auth', 'users'),
                            ('auth', 'roles'),
                            ('auth', 'permissions'),
                            ('content', 'articles'),
                            ('content', 'article_blocks'),
                            ('stats', 'players'),
                            ('stats', 'tournaments'),
                            ('stats', 'rounds'),
                            ('analytics', 'projections'),
                            ('stats', 'betting_lines')
                        )
                        """
                    )
                )
            )
        }
        indexes = {
            row[0]
            for row in (
                await connection.execute(
                    text(
                        """
                        SELECT indexname
                        FROM pg_indexes
                        WHERE schemaname IN ('auth', 'content', 'stats', 'analytics')
                        AND indexname IN (
                            'idx_articles_search',
                            'idx_article_blocks_content',
                            'idx_rounds_player_id_tournament_id',
                            'idx_projections_tournament_id_ranking',
                            'idx_betting_lines_tournament_id_market_type',
                            'idx_player_recent_form_player_id',
                            'idx_leaderboard_summary_tournament_id_player_id',
                            'idx_projection_overview_projection_id'
                        )
                        """
                    )
                )
            )
        }
        rls_tables = {
            (row[0], row[1])
            for row in (
                await connection.execute(
                    text(
                        """
                        SELECT schemaname, tablename
                        FROM pg_tables
                        WHERE rowsecurity = true
                        AND (schemaname, tablename) IN (
                            ('auth', 'users'),
                            ('content', 'articles'),
                            ('content', 'article_blocks'),
                            ('analytics', 'projections'),
                            ('stats', 'betting_lines')
                        )
                        """
                    )
                )
            )
        }
    await engine.dispose()
    return schema_names, tables, indexes, rls_tables


async def _collect_seed_counts(database_url: str) -> tuple[dict[str, int], dict[str, int]]:
    """Collect seed counts and materialized view counts."""
    engine = create_async_engine(database_url, pool_pre_ping=True)
    async with engine.connect() as connection:
        counts = {
            "users": (await connection.execute(text("SELECT COUNT(*) FROM auth.users"))).scalar_one(),
            "articles": (
                await connection.execute(text("SELECT COUNT(*) FROM content.articles"))
            ).scalar_one(),
            "players": (await connection.execute(text("SELECT COUNT(*) FROM stats.players"))).scalar_one(),
            "rounds": (await connection.execute(text("SELECT COUNT(*) FROM stats.rounds"))).scalar_one(),
            "projections": (
                await connection.execute(text("SELECT COUNT(*) FROM analytics.projections"))
            ).scalar_one(),
            "betting_lines": (
                await connection.execute(text("SELECT COUNT(*) FROM stats.betting_lines"))
            ).scalar_one(),
        }
        view_counts = {
            "player_recent_form": (
                await connection.execute(text("SELECT COUNT(*) FROM analytics.player_recent_form"))
            ).scalar_one(),
            "leaderboard_summary": (
                await connection.execute(text("SELECT COUNT(*) FROM analytics.leaderboard_summary"))
            ).scalar_one(),
            "projection_overview": (
                await connection.execute(text("SELECT COUNT(*) FROM analytics.projection_overview"))
            ).scalar_one(),
        }
    await engine.dispose()
    return counts, view_counts


async def _collect_remaining_table_count(database_url: str) -> int:
    """Count tables that remain in the managed schemas."""
    engine = create_async_engine(database_url, pool_pre_ping=True)
    async with engine.connect() as connection:
        remaining_tables = (
            await connection.execute(
                text(
                    """
                    SELECT COUNT(*)
                    FROM information_schema.tables
                    WHERE table_schema IN ('auth', 'content', 'stats', 'analytics', 'ai', 'system', 'ingestion', 'billing')
                    """
                )
            )
        ).scalar_one()
    await engine.dispose()
    return remaining_tables


def test_database_foundation_upgrade_seed_and_downgrade() -> None:
    """Verify the migration lifecycle, indexes, materialized views, and seed data."""
    alembic_config = _alembic_config(TEST_DATABASE_URL)

    asyncio.run(_wait_for_database(TEST_DATABASE_URL))
    command.downgrade(alembic_config, "base")
    command.upgrade(alembic_config, "head")

    schema_names, tables, indexes, rls_tables = asyncio.run(_collect_schema_state(TEST_DATABASE_URL))
    assert schema_names == {
        "auth",
        "content",
        "stats",
        "analytics",
        "ai",
        "system",
        "ingestion",
        "billing",
    }
    assert len(tables) == 10
    assert indexes == {
        "idx_articles_search",
        "idx_article_blocks_content",
        "idx_rounds_player_id_tournament_id",
        "idx_projections_tournament_id_ranking",
        "idx_betting_lines_tournament_id_market_type",
        "idx_player_recent_form_player_id",
        "idx_leaderboard_summary_tournament_id_player_id",
        "idx_projection_overview_projection_id",
    }
    assert len(rls_tables) == 5

    asyncio.run(run_seed(TEST_DATABASE_URL))
    counts, view_counts = asyncio.run(_collect_seed_counts(TEST_DATABASE_URL))
    assert counts == {
        "users": 3,
        "articles": 1,
        "players": 3,
        "rounds": 9,
        "projections": 3,
        "betting_lines": 3,
    }
    assert view_counts == {
        "player_recent_form": 3,
        "leaderboard_summary": 3,
        "projection_overview": 3,
    }

    command.downgrade(alembic_config, "base")
    schema_names, tables, indexes, rls_tables = asyncio.run(_collect_schema_state(TEST_DATABASE_URL))
    assert not schema_names
    assert not tables
    assert not indexes
    assert not rls_tables
    remaining_tables = asyncio.run(_collect_remaining_table_count(TEST_DATABASE_URL))
    assert remaining_tables == 0
