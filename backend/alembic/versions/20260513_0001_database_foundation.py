"""database foundation"""
# ruff: noqa: E501

from __future__ import annotations

from alembic import op

revision = "20260513_0001"
down_revision = None
branch_labels = None
depends_on = None


def _execute_statements(*statements: str) -> None:
    """Execute individual SQL statements sequentially."""
    for statement in statements:
        op.execute(statement)


def upgrade() -> None:
    _execute_statements(
        'CREATE EXTENSION IF NOT EXISTS "pgcrypto"',
        "CREATE SCHEMA IF NOT EXISTS auth",
        "CREATE SCHEMA IF NOT EXISTS content",
        "CREATE SCHEMA IF NOT EXISTS stats",
        "CREATE SCHEMA IF NOT EXISTS analytics",
        "CREATE SCHEMA IF NOT EXISTS ai",
        "CREATE SCHEMA IF NOT EXISTS system",
        "CREATE SCHEMA IF NOT EXISTS ingestion",
        "CREATE SCHEMA IF NOT EXISTS billing",
        """
        CREATE OR REPLACE FUNCTION system.set_updated_at()
        RETURNS TRIGGER
        LANGUAGE plpgsql
        AS $$
        BEGIN
            NEW.updated_at = NOW();
            RETURN NEW;
        END;
        $$;
        """,
        """
        CREATE OR REPLACE FUNCTION system.current_app_user_id()
        RETURNS uuid
        LANGUAGE sql
        STABLE
        AS $$
            SELECT NULLIF(current_setting('app.current_user_id', true), '')::uuid;
        $$;
        """,
        """
        CREATE OR REPLACE FUNCTION system.current_app_role()
        RETURNS text
        LANGUAGE sql
        STABLE
        AS $$
            SELECT COALESCE(NULLIF(current_setting('app.current_role', true), ''), 'anonymous');
        $$;
        """,
        """
        CREATE TABLE auth.users (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            email text NOT NULL,
            password_hash text NOT NULL,
            display_name text,
            status text NOT NULL DEFAULT 'active',
            is_superuser boolean NOT NULL DEFAULT false,
            last_login_at timestamptz,
            created_at timestamptz NOT NULL DEFAULT NOW(),
            updated_at timestamptz NOT NULL DEFAULT NOW(),
            CONSTRAINT uq_users_email UNIQUE (email),
            CONSTRAINT ck_users_status CHECK (
                status IN ('active', 'invited', 'suspended', 'disabled')
            )
        )
        """,
        """
        CREATE TABLE auth.roles (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            key text NOT NULL,
            name text NOT NULL,
            description text,
            created_at timestamptz NOT NULL DEFAULT NOW(),
            updated_at timestamptz NOT NULL DEFAULT NOW(),
            CONSTRAINT uq_roles_key UNIQUE (key)
        )
        """,
        """
        CREATE TABLE auth.permissions (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            key text NOT NULL,
            name text NOT NULL,
            description text,
            created_at timestamptz NOT NULL DEFAULT NOW(),
            updated_at timestamptz NOT NULL DEFAULT NOW(),
            CONSTRAINT uq_permissions_key UNIQUE (key)
        )
        """,
        """
        CREATE TABLE auth.user_roles (
            user_id uuid NOT NULL,
            role_id uuid NOT NULL,
            created_at timestamptz NOT NULL DEFAULT NOW(),
            CONSTRAINT pk_user_roles PRIMARY KEY (user_id, role_id),
            CONSTRAINT fk_user_roles_user_id_users
                FOREIGN KEY (user_id)
                REFERENCES auth.users(id)
                ON DELETE CASCADE,
            CONSTRAINT fk_user_roles_role_id_roles
                FOREIGN KEY (role_id)
                REFERENCES auth.roles(id)
                ON DELETE CASCADE
        )
        """,
        """
        CREATE TABLE auth.role_permissions (
            role_id uuid NOT NULL,
            permission_id uuid NOT NULL,
            created_at timestamptz NOT NULL DEFAULT NOW(),
            CONSTRAINT pk_role_permissions PRIMARY KEY (role_id, permission_id),
            CONSTRAINT fk_role_permissions_role_id_roles
                FOREIGN KEY (role_id)
                REFERENCES auth.roles(id)
                ON DELETE CASCADE,
            CONSTRAINT fk_role_permissions_permission_id_permissions
                FOREIGN KEY (permission_id)
                REFERENCES auth.permissions(id)
                ON DELETE CASCADE
        )
        """,
        """
        CREATE TABLE content.articles (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            author_id uuid NOT NULL,
            slug text NOT NULL,
            title text NOT NULL,
            excerpt text,
            status text NOT NULL DEFAULT 'draft',
            published_at timestamptz,
            metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
            created_at timestamptz NOT NULL DEFAULT NOW(),
            updated_at timestamptz NOT NULL DEFAULT NOW(),
            CONSTRAINT uq_articles_slug UNIQUE (slug),
            CONSTRAINT ck_articles_status CHECK (
                status IN ('draft', 'review', 'published', 'archived')
            ),
            CONSTRAINT fk_articles_author_id_users
                FOREIGN KEY (author_id)
                REFERENCES auth.users(id)
        )
        """,
        """
        CREATE TABLE content.article_blocks (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            article_id uuid NOT NULL,
            block_type text NOT NULL,
            position integer NOT NULL,
            content jsonb NOT NULL DEFAULT '{}'::jsonb,
            created_at timestamptz NOT NULL DEFAULT NOW(),
            updated_at timestamptz NOT NULL DEFAULT NOW(),
            CONSTRAINT uq_article_blocks_article_id_position UNIQUE (article_id, position),
            CONSTRAINT ck_article_blocks_position_non_negative CHECK (position >= 0),
            CONSTRAINT fk_article_blocks_article_id_articles
                FOREIGN KEY (article_id)
                REFERENCES content.articles(id)
                ON DELETE CASCADE
        )
        """,
        """
        CREATE TABLE stats.players (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            external_id text,
            first_name text NOT NULL,
            last_name text NOT NULL,
            country_code varchar(3),
            birth_date date,
            handedness text,
            active boolean NOT NULL DEFAULT true,
            created_at timestamptz NOT NULL DEFAULT NOW(),
            updated_at timestamptz NOT NULL DEFAULT NOW(),
            CONSTRAINT uq_players_external_id UNIQUE (external_id),
            CONSTRAINT ck_players_handedness CHECK (
                handedness IS NULL OR handedness IN ('left', 'right')
            )
        )
        """,
        """
        CREATE TABLE stats.tournaments (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            name text NOT NULL,
            slug text NOT NULL,
            season integer NOT NULL,
            course_name text,
            location text,
            start_date date NOT NULL,
            end_date date NOT NULL,
            purse numeric(12, 2),
            created_at timestamptz NOT NULL DEFAULT NOW(),
            updated_at timestamptz NOT NULL DEFAULT NOW(),
            CONSTRAINT uq_tournaments_slug UNIQUE (slug),
            CONSTRAINT ck_tournaments_date_order CHECK (end_date >= start_date)
        )
        """,
        """
        CREATE TABLE stats.rounds (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            player_id uuid NOT NULL,
            tournament_id uuid NOT NULL,
            round_number smallint NOT NULL,
            played_at timestamptz,
            score integer,
            strokes_gained_total numeric(6, 2),
            position integer,
            created_at timestamptz NOT NULL DEFAULT NOW(),
            updated_at timestamptz NOT NULL DEFAULT NOW(),
            CONSTRAINT uq_rounds_player_id_tournament_id_round_number
                UNIQUE (player_id, tournament_id, round_number),
            CONSTRAINT ck_rounds_round_number CHECK (round_number BETWEEN 1 AND 8),
            CONSTRAINT fk_rounds_player_id_players
                FOREIGN KEY (player_id)
                REFERENCES stats.players(id)
                ON DELETE CASCADE,
            CONSTRAINT fk_rounds_tournament_id_tournaments
                FOREIGN KEY (tournament_id)
                REFERENCES stats.tournaments(id)
                ON DELETE CASCADE
        )
        """,
        """
        CREATE TABLE analytics.projections (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            player_id uuid NOT NULL,
            tournament_id uuid NOT NULL,
            model_name text NOT NULL,
            model_version text NOT NULL,
            projection_date date NOT NULL DEFAULT CURRENT_DATE,
            win_probability numeric(7, 4),
            top_10_probability numeric(7, 4),
            expected_score numeric(6, 2),
            ranking integer,
            confidence numeric(7, 4),
            inputs jsonb NOT NULL DEFAULT '{}'::jsonb,
            created_at timestamptz NOT NULL DEFAULT NOW(),
            updated_at timestamptz NOT NULL DEFAULT NOW(),
            CONSTRAINT uq_projections_tournament_id_player_id_model_name_model_version_projection_date
                UNIQUE (tournament_id, player_id, model_name, model_version, projection_date),
            CONSTRAINT fk_projections_player_id_players
                FOREIGN KEY (player_id)
                REFERENCES stats.players(id)
                ON DELETE CASCADE,
            CONSTRAINT fk_projections_tournament_id_tournaments
                FOREIGN KEY (tournament_id)
                REFERENCES stats.tournaments(id)
                ON DELETE CASCADE
        )
        """,
        """
        CREATE TABLE stats.betting_lines (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            player_id uuid NOT NULL,
            tournament_id uuid NOT NULL,
            market_type text NOT NULL,
            sportsbook text NOT NULL,
            line_value numeric(8, 2),
            american_odds integer,
            implied_probability numeric(7, 4),
            captured_at timestamptz NOT NULL DEFAULT NOW(),
            metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
            created_at timestamptz NOT NULL DEFAULT NOW(),
            updated_at timestamptz NOT NULL DEFAULT NOW(),
            CONSTRAINT uq_betting_lines_tournament_id_player_id_market_type_sportsbook_captured_at
                UNIQUE (tournament_id, player_id, market_type, sportsbook, captured_at),
            CONSTRAINT fk_betting_lines_player_id_players
                FOREIGN KEY (player_id)
                REFERENCES stats.players(id)
                ON DELETE CASCADE,
            CONSTRAINT fk_betting_lines_tournament_id_tournaments
                FOREIGN KEY (tournament_id)
                REFERENCES stats.tournaments(id)
                ON DELETE CASCADE
        )
        """,
        "CREATE INDEX idx_user_roles_role_id ON auth.user_roles (role_id)",
        "CREATE INDEX idx_role_permissions_permission_id ON auth.role_permissions (permission_id)",
        "CREATE INDEX idx_articles_author_id ON content.articles (author_id)",
        "CREATE INDEX idx_articles_status_published_at ON content.articles (status, published_at DESC)",
        """
        CREATE INDEX idx_articles_search
        ON content.articles
        USING GIN (to_tsvector('english', coalesce(title, '') || ' ' || coalesce(excerpt, '')))
        """,
        "CREATE INDEX idx_article_blocks_article_id ON content.article_blocks (article_id)",
        "CREATE INDEX idx_article_blocks_content ON content.article_blocks USING GIN (content jsonb_path_ops)",
        "CREATE INDEX idx_players_last_name_first_name ON stats.players (last_name, first_name)",
        "CREATE INDEX idx_tournaments_season_start_date ON stats.tournaments (season, start_date DESC)",
        "CREATE INDEX idx_rounds_tournament_id ON stats.rounds (tournament_id)",
        "CREATE INDEX idx_rounds_player_id_tournament_id ON stats.rounds (player_id, tournament_id)",
        "CREATE INDEX idx_rounds_played_at ON stats.rounds (played_at DESC)",
        "CREATE INDEX idx_projections_tournament_id_ranking ON analytics.projections (tournament_id, ranking)",
        "CREATE INDEX idx_projections_inputs ON analytics.projections USING GIN (inputs jsonb_path_ops)",
        "CREATE INDEX idx_betting_lines_tournament_id_market_type ON stats.betting_lines (tournament_id, market_type)",
        "CREATE INDEX idx_betting_lines_captured_at ON stats.betting_lines (captured_at DESC)",
        """
        CREATE TRIGGER set_users_updated_at
        BEFORE UPDATE ON auth.users
        FOR EACH ROW
        EXECUTE FUNCTION system.set_updated_at()
        """,
        """
        CREATE TRIGGER set_roles_updated_at
        BEFORE UPDATE ON auth.roles
        FOR EACH ROW
        EXECUTE FUNCTION system.set_updated_at()
        """,
        """
        CREATE TRIGGER set_permissions_updated_at
        BEFORE UPDATE ON auth.permissions
        FOR EACH ROW
        EXECUTE FUNCTION system.set_updated_at()
        """,
        """
        CREATE TRIGGER set_articles_updated_at
        BEFORE UPDATE ON content.articles
        FOR EACH ROW
        EXECUTE FUNCTION system.set_updated_at()
        """,
        """
        CREATE TRIGGER set_article_blocks_updated_at
        BEFORE UPDATE ON content.article_blocks
        FOR EACH ROW
        EXECUTE FUNCTION system.set_updated_at()
        """,
        """
        CREATE TRIGGER set_players_updated_at
        BEFORE UPDATE ON stats.players
        FOR EACH ROW
        EXECUTE FUNCTION system.set_updated_at()
        """,
        """
        CREATE TRIGGER set_tournaments_updated_at
        BEFORE UPDATE ON stats.tournaments
        FOR EACH ROW
        EXECUTE FUNCTION system.set_updated_at()
        """,
        """
        CREATE TRIGGER set_rounds_updated_at
        BEFORE UPDATE ON stats.rounds
        FOR EACH ROW
        EXECUTE FUNCTION system.set_updated_at()
        """,
        """
        CREATE TRIGGER set_projections_updated_at
        BEFORE UPDATE ON analytics.projections
        FOR EACH ROW
        EXECUTE FUNCTION system.set_updated_at()
        """,
        """
        CREATE TRIGGER set_betting_lines_updated_at
        BEFORE UPDATE ON stats.betting_lines
        FOR EACH ROW
        EXECUTE FUNCTION system.set_updated_at()
        """,
        "ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY",
        """
        CREATE POLICY users_select_self_or_admin
        ON auth.users
        FOR SELECT
        USING (
            id = system.current_app_user_id()
            OR system.current_app_role() IN ('admin', 'owner')
        )
        """,
        """
        CREATE POLICY users_admin_write
        ON auth.users
        FOR ALL
        USING (system.current_app_role() IN ('admin', 'owner'))
        WITH CHECK (system.current_app_role() IN ('admin', 'owner'))
        """,
        "ALTER TABLE content.articles ENABLE ROW LEVEL SECURITY",
        """
        CREATE POLICY articles_public_read
        ON content.articles
        FOR SELECT
        USING (
            status = 'published'
            OR system.current_app_role() IN ('editor', 'admin', 'owner')
        )
        """,
        """
        CREATE POLICY articles_editor_write
        ON content.articles
        FOR ALL
        USING (system.current_app_role() IN ('editor', 'admin', 'owner'))
        WITH CHECK (system.current_app_role() IN ('editor', 'admin', 'owner'))
        """,
        "ALTER TABLE content.article_blocks ENABLE ROW LEVEL SECURITY",
        """
        CREATE POLICY article_blocks_read
        ON content.article_blocks
        FOR SELECT
        USING (
            system.current_app_role() IN ('editor', 'admin', 'owner')
            OR EXISTS (
                SELECT 1
                FROM content.articles article
                WHERE article.id = article_blocks.article_id
                AND article.status = 'published'
            )
        )
        """,
        """
        CREATE POLICY article_blocks_editor_write
        ON content.article_blocks
        FOR ALL
        USING (system.current_app_role() IN ('editor', 'admin', 'owner'))
        WITH CHECK (system.current_app_role() IN ('editor', 'admin', 'owner'))
        """,
        "ALTER TABLE analytics.projections ENABLE ROW LEVEL SECURITY",
        """
        CREATE POLICY projections_read
        ON analytics.projections
        FOR SELECT
        USING (true)
        """,
        """
        CREATE POLICY projections_admin_write
        ON analytics.projections
        FOR ALL
        USING (system.current_app_role() IN ('admin', 'owner'))
        WITH CHECK (system.current_app_role() IN ('admin', 'owner'))
        """,
        "ALTER TABLE stats.betting_lines ENABLE ROW LEVEL SECURITY",
        """
        CREATE POLICY betting_lines_subscriber_read
        ON stats.betting_lines
        FOR SELECT
        USING (system.current_app_role() IN ('subscriber', 'editor', 'admin', 'owner'))
        """,
        """
        CREATE POLICY betting_lines_admin_write
        ON stats.betting_lines
        FOR ALL
        USING (system.current_app_role() IN ('admin', 'owner'))
        WITH CHECK (system.current_app_role() IN ('admin', 'owner'))
        """,
        """
        CREATE MATERIALIZED VIEW analytics.player_recent_form AS
        WITH ranked_rounds AS (
            SELECT
                rounds.player_id,
                COALESCE(rounds.played_at, rounds.created_at) AS played_at,
                rounds.score,
                rounds.strokes_gained_total,
                ROW_NUMBER() OVER (
                    PARTITION BY rounds.player_id
                    ORDER BY COALESCE(rounds.played_at, rounds.created_at) DESC, rounds.round_number DESC
                ) AS recent_rank
            FROM stats.rounds AS rounds
        )
        SELECT
            ranked_rounds.player_id,
            players.first_name,
            players.last_name,
            COUNT(*) AS rounds_sampled,
            AVG(ranked_rounds.score)::numeric(6, 2) AS average_score,
            AVG(ranked_rounds.strokes_gained_total)::numeric(6, 2) AS average_strokes_gained,
            MAX(ranked_rounds.played_at) AS last_round_at
        FROM ranked_rounds
        JOIN stats.players AS players ON players.id = ranked_rounds.player_id
        WHERE ranked_rounds.recent_rank <= 8
        GROUP BY ranked_rounds.player_id, players.first_name, players.last_name
        """,
        """
        CREATE MATERIALIZED VIEW analytics.leaderboard_summary AS
        SELECT
            rounds.tournament_id,
            tournaments.name AS tournament_name,
            rounds.player_id,
            players.first_name,
            players.last_name,
            COUNT(*) AS rounds_completed,
            SUM(rounds.score) AS total_score,
            AVG(rounds.score)::numeric(6, 2) AS average_round_score,
            SUM(COALESCE(rounds.strokes_gained_total, 0))::numeric(8, 2) AS total_strokes_gained,
            MIN(rounds.position) AS best_position,
            MAX(COALESCE(rounds.played_at, rounds.created_at)) AS last_round_at
        FROM stats.rounds AS rounds
        JOIN stats.players AS players ON players.id = rounds.player_id
        JOIN stats.tournaments AS tournaments ON tournaments.id = rounds.tournament_id
        GROUP BY
            rounds.tournament_id,
            tournaments.name,
            rounds.player_id,
            players.first_name,
            players.last_name
        """,
        """
        CREATE MATERIALIZED VIEW analytics.projection_overview AS
        SELECT
            projections.id AS projection_id,
            projections.tournament_id,
            tournaments.name AS tournament_name,
            projections.player_id,
            players.first_name,
            players.last_name,
            projections.model_name,
            projections.model_version,
            projections.projection_date,
            projections.ranking,
            projections.expected_score,
            projections.win_probability,
            projections.top_10_probability,
            projections.confidence
        FROM analytics.projections AS projections
        JOIN stats.players AS players ON players.id = projections.player_id
        JOIN stats.tournaments AS tournaments ON tournaments.id = projections.tournament_id
        """,
        "CREATE UNIQUE INDEX idx_player_recent_form_player_id ON analytics.player_recent_form (player_id)",
        "CREATE UNIQUE INDEX idx_leaderboard_summary_tournament_id_player_id ON analytics.leaderboard_summary (tournament_id, player_id)",
        "CREATE UNIQUE INDEX idx_projection_overview_projection_id ON analytics.projection_overview (projection_id)",
    )


def downgrade() -> None:
    _execute_statements(
        "DROP MATERIALIZED VIEW IF EXISTS analytics.projection_overview",
        "DROP MATERIALIZED VIEW IF EXISTS analytics.leaderboard_summary",
        "DROP MATERIALIZED VIEW IF EXISTS analytics.player_recent_form",
        "DROP TABLE IF EXISTS stats.betting_lines",
        "DROP TABLE IF EXISTS analytics.projections",
        "DROP TABLE IF EXISTS stats.rounds",
        "DROP TABLE IF EXISTS stats.tournaments",
        "DROP TABLE IF EXISTS stats.players",
        "DROP TABLE IF EXISTS content.article_blocks",
        "DROP TABLE IF EXISTS content.articles",
        "DROP TABLE IF EXISTS auth.role_permissions",
        "DROP TABLE IF EXISTS auth.user_roles",
        "DROP TABLE IF EXISTS auth.permissions",
        "DROP TABLE IF EXISTS auth.roles",
        "DROP TABLE IF EXISTS auth.users",
        "DROP FUNCTION IF EXISTS system.current_app_role()",
        "DROP FUNCTION IF EXISTS system.current_app_user_id()",
        "DROP FUNCTION IF EXISTS system.set_updated_at()",
        "DROP SCHEMA IF EXISTS billing",
        "DROP SCHEMA IF EXISTS ingestion",
        "DROP SCHEMA IF EXISTS ai",
        "DROP SCHEMA IF EXISTS analytics",
        "DROP SCHEMA IF EXISTS stats",
        "DROP SCHEMA IF EXISTS content",
        "DROP SCHEMA IF EXISTS auth",
        "DROP SCHEMA IF EXISTS system",
    )
