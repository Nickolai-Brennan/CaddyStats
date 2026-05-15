-- =============================================================================
-- 002-auth.sql
-- Schema: auth
-- Domain: Identity and Access
-- Owns: users, roles, permissions, role_assignments, sessions
-- Depends on: 001-bootstrap.sql
-- =============================================================================

-- ---------------------------------------------------------------------------
-- auth.roles
-- Named permission bundles: anonymous, user, subscriber, analyst, editor,
-- admin, owner. System roles are protected from deletion.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS auth.roles (
  id            UUID        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name          TEXT        NOT NULL UNIQUE,
  description   TEXT,
  is_system     BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- auth.permissions
-- Atomic capability keys such as content.publish, projection.view_premium,
-- user.manage, billing.read.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS auth.permissions (
  id          UUID        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key         TEXT        NOT NULL UNIQUE,
  description TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- auth.role_permissions
-- Many-to-many join between roles and permissions.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS auth.role_permissions (
  role_id       UUID NOT NULL REFERENCES auth.roles(id) ON DELETE CASCADE,
  permission_id UUID NOT NULL REFERENCES auth.permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);

-- ---------------------------------------------------------------------------
-- auth.users
-- Authenticated accounts for members, subscribers, analysts, editors, admins.
-- Passwords are stored as bcrypt hashes via pgcrypto. OAuth provider
-- references are stored alongside the hash field for SSO flows.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS auth.users (
  id                   UUID        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email                TEXT        NOT NULL UNIQUE,
  password_hash        TEXT,
  display_name         TEXT,
  avatar_url           TEXT,
  account_status       TEXT        NOT NULL DEFAULT 'active'
                         CHECK (account_status IN ('active','suspended','pending_verification','deactivated')),
  auth_provider        TEXT        NOT NULL DEFAULT 'local'
                         CHECK (auth_provider IN ('local','google','github','apple')),
  auth_provider_id     TEXT,
  email_verified       BOOLEAN     NOT NULL DEFAULT FALSE,
  email_verified_at    TIMESTAMPTZ,
  last_login_at        TIMESTAMPTZ,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_users_provider UNIQUE (auth_provider, auth_provider_id)
);

-- ---------------------------------------------------------------------------
-- auth.role_assignments
-- Effective role bindings for a user. A user may hold multiple roles.
-- Scoped assignments allow roles with limited context (e.g. a single team).
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS auth.role_assignments (
  id          UUID        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role_id     UUID        NOT NULL REFERENCES auth.roles(id) ON DELETE CASCADE,
  scope       TEXT,
  granted_by  UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  granted_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at  TIMESTAMPTZ,
  revoked_at  TIMESTAMPTZ,
  reason      TEXT,
  CONSTRAINT uq_role_assignment UNIQUE (user_id, role_id, scope)
);

-- ---------------------------------------------------------------------------
-- auth.sessions
-- Server-side session records. Tokens are stored as bcrypt hashes so
-- raw bearer tokens are never persisted in plaintext.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS auth.sessions (
  id           UUID        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  token_hash   TEXT        NOT NULL UNIQUE,
  ip_address   INET,
  user_agent   TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at   TIMESTAMPTZ NOT NULL,
  revoked_at   TIMESTAMPTZ
);

-- ---------------------------------------------------------------------------
-- auth.password_reset_tokens
-- Short-lived single-use tokens for password recovery.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS auth.password_reset_tokens (
  id          UUID        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  token_hash  TEXT        NOT NULL UNIQUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at  TIMESTAMPTZ NOT NULL,
  used_at     TIMESTAMPTZ
);
