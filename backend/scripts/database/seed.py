"""Seed foundational database records for local development."""
# ruff: noqa: E501

from __future__ import annotations

import asyncio
from typing import Final

from passlib.context import CryptContext
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncEngine, create_async_engine

from app.core.config import settings

ADMIN_USER_ID: Final[str] = "11111111-1111-1111-1111-111111111111"
EDITOR_USER_ID: Final[str] = "11111111-1111-1111-1111-111111111112"
SUBSCRIBER_USER_ID: Final[str] = "11111111-1111-1111-1111-111111111113"

ROLE_OWNER_ID: Final[str] = "22222222-2222-2222-2222-222222222221"
ROLE_ADMIN_ID: Final[str] = "22222222-2222-2222-2222-222222222222"
ROLE_EDITOR_ID: Final[str] = "22222222-2222-2222-2222-222222222223"
ROLE_SUBSCRIBER_ID: Final[str] = "22222222-2222-2222-2222-222222222224"

PERMISSION_USERS_ID: Final[str] = "33333333-3333-3333-3333-333333333331"
PERMISSION_CONTENT_ID: Final[str] = "33333333-3333-3333-3333-333333333332"
PERMISSION_PROJECTIONS_ID: Final[str] = "33333333-3333-3333-3333-333333333333"
PERMISSION_BETTING_ID: Final[str] = "33333333-3333-3333-3333-333333333334"

ARTICLE_ID: Final[str] = "44444444-4444-4444-4444-444444444441"
ARTICLE_BLOCK_INTRO_ID: Final[str] = "44444444-4444-4444-4444-444444444442"
ARTICLE_BLOCK_TABLE_ID: Final[str] = "44444444-4444-4444-4444-444444444443"

TOURNAMENT_ID: Final[str] = "55555555-5555-5555-5555-555555555551"
PLAYER_SCOTTIE_ID: Final[str] = "66666666-6666-6666-6666-666666666661"
PLAYER_RORY_ID: Final[str] = "66666666-6666-6666-6666-666666666662"
PLAYER_COLLIN_ID: Final[str] = "66666666-6666-6666-6666-666666666663"

PROJECTION_SCOTTIE_ID: Final[str] = "77777777-7777-7777-7777-777777777771"
PROJECTION_RORY_ID: Final[str] = "77777777-7777-7777-7777-777777777772"
PROJECTION_COLLIN_ID: Final[str] = "77777777-7777-7777-7777-777777777773"

BETTING_LINE_SCOTTIE_ID: Final[str] = "88888888-8888-8888-8888-888888888881"
BETTING_LINE_RORY_ID: Final[str] = "88888888-8888-8888-8888-888888888882"
BETTING_LINE_COLLIN_ID: Final[str] = "88888888-8888-8888-8888-888888888883"

PASSWORD_CONTEXT = CryptContext(schemes=["bcrypt"], deprecated="auto")
SEEDED_PASSWORD_HASH: Final[str] = PASSWORD_CONTEXT.hash("caddystats-local-dev-password")


def create_seed_engine(database_url: str | None = None) -> AsyncEngine:
    """Build an async engine for seed execution."""
    return create_async_engine(database_url or settings.DATABASE_URL, pool_pre_ping=True)


async def seed_database(engine: AsyncEngine) -> None:
    """Insert foundational sample data and refresh materialized views."""
    async with engine.begin() as connection:
        await connection.execute(
            text(
                """
                INSERT INTO auth.roles (id, key, name, description)
                VALUES
                    (:owner_role_id, 'owner', 'Owner', 'Platform owner role'),
                    (:admin_role_id, 'admin', 'Admin', 'Administrative platform role'),
                    (:editor_role_id, 'editor', 'Editor', 'Editorial publishing role'),
                    (:subscriber_role_id, 'subscriber', 'Subscriber', 'Paid subscriber role')
                ON CONFLICT (id) DO NOTHING;
                """
            ),
            {
                "owner_role_id": ROLE_OWNER_ID,
                "admin_role_id": ROLE_ADMIN_ID,
                "editor_role_id": ROLE_EDITOR_ID,
                "subscriber_role_id": ROLE_SUBSCRIBER_ID,
            },
        )
        await connection.execute(
            text(
                """
                INSERT INTO auth.permissions (id, key, name, description)
                VALUES
                    (:users_permission_id, 'manage_users', 'Manage Users', 'Manage auth users and roles'),
                    (:content_permission_id, 'manage_content', 'Manage Content', 'Manage editorial content'),
                    (:projections_permission_id, 'manage_projections', 'Manage Projections', 'Manage analytics projections'),
                    (:betting_permission_id, 'view_betting_lines', 'View Betting Lines', 'Access betting intelligence')
                ON CONFLICT (id) DO NOTHING;
                """
            ),
            {
                "users_permission_id": PERMISSION_USERS_ID,
                "content_permission_id": PERMISSION_CONTENT_ID,
                "projections_permission_id": PERMISSION_PROJECTIONS_ID,
                "betting_permission_id": PERMISSION_BETTING_ID,
            },
        )
        await connection.execute(
            text(
                """
                INSERT INTO auth.role_permissions (role_id, permission_id)
                VALUES
                    (:owner_role_id, :users_permission_id),
                    (:owner_role_id, :content_permission_id),
                    (:owner_role_id, :projections_permission_id),
                    (:owner_role_id, :betting_permission_id),
                    (:admin_role_id, :users_permission_id),
                    (:admin_role_id, :content_permission_id),
                    (:admin_role_id, :projections_permission_id),
                    (:editor_role_id, :content_permission_id),
                    (:subscriber_role_id, :betting_permission_id)
                ON CONFLICT (role_id, permission_id) DO NOTHING;
                """
            ),
            {
                "owner_role_id": ROLE_OWNER_ID,
                "admin_role_id": ROLE_ADMIN_ID,
                "editor_role_id": ROLE_EDITOR_ID,
                "subscriber_role_id": ROLE_SUBSCRIBER_ID,
                "users_permission_id": PERMISSION_USERS_ID,
                "content_permission_id": PERMISSION_CONTENT_ID,
                "projections_permission_id": PERMISSION_PROJECTIONS_ID,
                "betting_permission_id": PERMISSION_BETTING_ID,
            },
        )
        await connection.execute(
            text(
                """
                INSERT INTO auth.users (id, email, password_hash, display_name, status, is_superuser)
                VALUES
                    (:admin_user_id, 'admin@caddystats.local', :seeded_password_hash, 'Platform Admin', 'active', true),
                    (:editor_user_id, 'editor@caddystats.local', :seeded_password_hash, 'Feature Editor', 'active', false),
                    (:subscriber_user_id, 'subscriber@caddystats.local', :seeded_password_hash, 'Research Subscriber', 'active', false)
                ON CONFLICT (id) DO NOTHING;
                """
            ),
            {
                "admin_user_id": ADMIN_USER_ID,
                "editor_user_id": EDITOR_USER_ID,
                "subscriber_user_id": SUBSCRIBER_USER_ID,
                "seeded_password_hash": SEEDED_PASSWORD_HASH,
            },
        )
        await connection.execute(
            text(
                """
                INSERT INTO auth.user_roles (user_id, role_id)
                VALUES
                    (:admin_user_id, :admin_role_id),
                    (:editor_user_id, :editor_role_id),
                    (:subscriber_user_id, :subscriber_role_id)
                ON CONFLICT (user_id, role_id) DO NOTHING;
                """
            ),
            {
                "admin_user_id": ADMIN_USER_ID,
                "editor_user_id": EDITOR_USER_ID,
                "subscriber_user_id": SUBSCRIBER_USER_ID,
                "admin_role_id": ROLE_ADMIN_ID,
                "editor_role_id": ROLE_EDITOR_ID,
                "subscriber_role_id": ROLE_SUBSCRIBER_ID,
            },
        )
        await connection.execute(
            text(
                """
                INSERT INTO stats.players (id, external_id, first_name, last_name, country_code, handedness, active)
                VALUES
                    (:scottie_id, 'pga-scheffler', 'Scottie', 'Scheffler', 'USA', 'right', true),
                    (:rory_id, 'pga-mcilroy', 'Rory', 'McIlroy', 'NIR', 'right', true),
                    (:collin_id, 'pga-morikawa', 'Collin', 'Morikawa', 'USA', 'right', true)
                ON CONFLICT (id) DO NOTHING;
                """
            ),
            {
                "scottie_id": PLAYER_SCOTTIE_ID,
                "rory_id": PLAYER_RORY_ID,
                "collin_id": PLAYER_COLLIN_ID,
            },
        )
        await connection.execute(
            text(
                """
                INSERT INTO stats.tournaments (
                    id,
                    name,
                    slug,
                    season,
                    course_name,
                    location,
                    start_date,
                    end_date,
                    purse
                )
                VALUES (
                    :tournament_id,
                    'Sample Championship',
                    'sample-championship',
                    2026,
                    'Augusta National Golf Club',
                    'Augusta, GA',
                    DATE '2026-04-09',
                    DATE '2026-04-12',
                    20000000.00
                )
                ON CONFLICT (id) DO NOTHING;
                """
            ),
            {"tournament_id": TOURNAMENT_ID},
        )
        await connection.execute(
            text(
                """
                INSERT INTO stats.rounds (
                    id,
                    player_id,
                    tournament_id,
                    round_number,
                    played_at,
                    score,
                    strokes_gained_total,
                    position
                )
                VALUES
                    ('99999999-9999-9999-9999-999999999911', :scottie_id, :tournament_id, 1, '2026-04-09T14:00:00Z', 67, 2.45, 1),
                    ('99999999-9999-9999-9999-999999999912', :scottie_id, :tournament_id, 2, '2026-04-10T14:00:00Z', 68, 1.80, 1),
                    ('99999999-9999-9999-9999-999999999913', :scottie_id, :tournament_id, 3, '2026-04-11T14:00:00Z', 70, 0.55, 1),
                    ('99999999-9999-9999-9999-999999999914', :rory_id, :tournament_id, 1, '2026-04-09T14:20:00Z', 69, 1.25, 2),
                    ('99999999-9999-9999-9999-999999999915', :rory_id, :tournament_id, 2, '2026-04-10T14:20:00Z', 70, 0.60, 3),
                    ('99999999-9999-9999-9999-999999999916', :rory_id, :tournament_id, 3, '2026-04-11T14:20:00Z', 68, 1.95, 2),
                    ('99999999-9999-9999-9999-999999999917', :collin_id, :tournament_id, 1, '2026-04-09T14:40:00Z', 70, 0.50, 5),
                    ('99999999-9999-9999-9999-999999999918', :collin_id, :tournament_id, 2, '2026-04-10T14:40:00Z', 69, 1.10, 4),
                    ('99999999-9999-9999-9999-999999999919', :collin_id, :tournament_id, 3, '2026-04-11T14:40:00Z', 67, 2.15, 2)
                ON CONFLICT (id) DO NOTHING;
                """
            ),
            {
                "scottie_id": PLAYER_SCOTTIE_ID,
                "rory_id": PLAYER_RORY_ID,
                "collin_id": PLAYER_COLLIN_ID,
                "tournament_id": TOURNAMENT_ID,
            },
        )
        await connection.execute(
            text(
                """
                INSERT INTO analytics.projections (
                    id,
                    player_id,
                    tournament_id,
                    model_name,
                    model_version,
                    projection_date,
                    win_probability,
                    top_10_probability,
                    expected_score,
                    ranking,
                    confidence,
                    inputs
                )
                VALUES
                    (:projection_scottie_id, :scottie_id, :tournament_id, 'baseline', 'v1', DATE '2026-04-08', 0.1650, 0.5400, 271.40, 1, 0.9100, '{"sample": true, "recent_rounds": 3}'::jsonb),
                    (:projection_rory_id, :rory_id, :tournament_id, 'baseline', 'v1', DATE '2026-04-08', 0.1240, 0.4700, 273.10, 2, 0.8600, '{"sample": true, "recent_rounds": 3}'::jsonb),
                    (:projection_collin_id, :collin_id, :tournament_id, 'baseline', 'v1', DATE '2026-04-08', 0.0980, 0.4300, 273.80, 3, 0.8300, '{"sample": true, "recent_rounds": 3}'::jsonb)
                ON CONFLICT (id) DO NOTHING;
                """
            ),
            {
                "projection_scottie_id": PROJECTION_SCOTTIE_ID,
                "projection_rory_id": PROJECTION_RORY_ID,
                "projection_collin_id": PROJECTION_COLLIN_ID,
                "scottie_id": PLAYER_SCOTTIE_ID,
                "rory_id": PLAYER_RORY_ID,
                "collin_id": PLAYER_COLLIN_ID,
                "tournament_id": TOURNAMENT_ID,
            },
        )
        await connection.execute(
            text(
                """
                INSERT INTO stats.betting_lines (
                    id,
                    player_id,
                    tournament_id,
                    market_type,
                    sportsbook,
                    line_value,
                    american_odds,
                    implied_probability,
                    captured_at,
                    metadata
                )
                VALUES
                    (:line_scottie_id, :scottie_id, :tournament_id, 'outright_win', 'SampleBook', 0.00, 650, 0.1333, '2026-04-08T12:00:00Z', '{"source": "seed"}'::jsonb),
                    (:line_rory_id, :rory_id, :tournament_id, 'outright_win', 'SampleBook', 0.00, 900, 0.1000, '2026-04-08T12:00:00Z', '{"source": "seed"}'::jsonb),
                    (:line_collin_id, :collin_id, :tournament_id, 'outright_win', 'SampleBook', 0.00, 1400, 0.0667, '2026-04-08T12:00:00Z', '{"source": "seed"}'::jsonb)
                ON CONFLICT (id) DO NOTHING;
                """
            ),
            {
                "line_scottie_id": BETTING_LINE_SCOTTIE_ID,
                "line_rory_id": BETTING_LINE_RORY_ID,
                "line_collin_id": BETTING_LINE_COLLIN_ID,
                "scottie_id": PLAYER_SCOTTIE_ID,
                "rory_id": PLAYER_RORY_ID,
                "collin_id": PLAYER_COLLIN_ID,
                "tournament_id": TOURNAMENT_ID,
            },
        )
        await connection.execute(
            text(
                """
                INSERT INTO content.articles (
                    id,
                    author_id,
                    slug,
                    title,
                    excerpt,
                    status,
                    published_at,
                    metadata
                )
                VALUES (
                    :article_id,
                    :editor_user_id,
                    'sample-championship-preview',
                    'Sample Championship Preview',
                    'Foundational editorial record seeded for local development.',
                    'published',
                    '2026-04-08T10:00:00Z',
                    '{"seeded": true, "channel": "seo"}'::jsonb
                )
                ON CONFLICT (id) DO NOTHING;
                """
            ),
            {"article_id": ARTICLE_ID, "editor_user_id": EDITOR_USER_ID},
        )
        await connection.execute(
            text(
                """
                INSERT INTO content.article_blocks (id, article_id, block_type, position, content)
                VALUES
                    (:intro_block_id, :article_id, 'paragraph', 0, '{"text": "Scottie Scheffler leads the seeded projection set."}'::jsonb),
                    (:table_block_id, :article_id, 'table', 1, '{"columns": ["player", "win_probability"], "rows": [["Scottie Scheffler", 0.165], ["Rory McIlroy", 0.124], ["Collin Morikawa", 0.098]]}'::jsonb)
                ON CONFLICT (id) DO NOTHING;
                """
            ),
            {
                "intro_block_id": ARTICLE_BLOCK_INTRO_ID,
                "table_block_id": ARTICLE_BLOCK_TABLE_ID,
                "article_id": ARTICLE_ID,
            },
        )
        await connection.execute(text("REFRESH MATERIALIZED VIEW analytics.player_recent_form;"))
        await connection.execute(text("REFRESH MATERIALIZED VIEW analytics.leaderboard_summary;"))
        await connection.execute(text("REFRESH MATERIALIZED VIEW analytics.projection_overview;"))


async def run_seed(database_url: str | None = None) -> None:
    """Run the full seed routine against the target database."""
    engine = create_seed_engine(database_url)
    try:
        await seed_database(engine)
    finally:
        await engine.dispose()


def main() -> None:
    """CLI entrypoint for `python -m scripts.database.seed`."""
    asyncio.run(run_seed())


if __name__ == "__main__":
    main()
