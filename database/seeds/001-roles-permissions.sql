-- =============================================================================
-- 001-roles-permissions.sql
-- Seed: system roles, permissions, and role-permission bindings.
-- Idempotent: uses INSERT ... ON CONFLICT DO NOTHING.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Roles
-- ---------------------------------------------------------------------------
INSERT INTO auth.roles (name, description, is_system) VALUES
  ('anonymous',   'Unauthenticated public visitor',                       TRUE),
  ('user',        'Registered account with free-tier access',             TRUE),
  ('subscriber',  'Paying subscriber with premium feature access',        TRUE),
  ('analyst',     'Internal data analyst with read access to all stats',  TRUE),
  ('editor',      'Editorial staff with content publish rights',          TRUE),
  ('admin',       'Platform administrator with broad management access',  TRUE),
  ('owner',       'Owner/founder with unrestricted platform access',      TRUE)
ON CONFLICT (name) DO NOTHING;

-- ---------------------------------------------------------------------------
-- Permissions
-- ---------------------------------------------------------------------------
INSERT INTO auth.permissions (key, description) VALUES
  -- content
  ('content.read',            'Read published articles'),
  ('content.read_drafts',     'Read draft and unpublished articles'),
  ('content.write',           'Create and edit articles'),
  ('content.publish',         'Publish and unpublish articles'),
  ('content.delete',          'Delete articles permanently'),
  -- stats
  ('stats.read',              'Read public stats and player data'),
  ('stats.read_premium',      'Read premium projection and model data'),
  ('stats.write',             'Write or update stats records'),
  -- projections
  ('projection.view',         'View published projections'),
  ('projection.view_premium', 'View all projections including unpublished'),
  ('projection.manage',       'Trigger model runs and manage projections'),
  -- betting / markets
  ('market.read',             'Read current market odds'),
  ('market.read_history',     'Read historical market odds'),
  -- users
  ('user.read_own',           'Read own account data'),
  ('user.update_own',         'Update own profile and preferences'),
  ('user.manage',             'Read and manage any user account'),
  -- billing
  ('billing.read_own',        'Read own subscription and invoices'),
  ('billing.manage',          'Manage any subscription or billing record'),
  -- analytics
  ('analytics.read_own',      'Read own usage analytics'),
  ('analytics.read_all',      'Read platform-wide analytics'),
  -- admin
  ('admin.config',            'Read and update system configuration'),
  ('admin.audit',             'Read audit event logs'),
  ('admin.ingestion',         'Trigger and monitor ingestion jobs'),
  ('admin.flags',             'Manage feature flags')
ON CONFLICT (key) DO NOTHING;

-- ---------------------------------------------------------------------------
-- Role-permission bindings
-- ---------------------------------------------------------------------------
-- anonymous
INSERT INTO auth.role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM auth.roles r, auth.permissions p
WHERE r.name = 'anonymous'
  AND p.key IN ('content.read', 'stats.read', 'market.read', 'projection.view')
ON CONFLICT DO NOTHING;

-- user (inherits anonymous + own account)
INSERT INTO auth.role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM auth.roles r, auth.permissions p
WHERE r.name = 'user'
  AND p.key IN (
    'content.read', 'stats.read', 'market.read', 'projection.view',
    'user.read_own', 'user.update_own', 'billing.read_own', 'analytics.read_own'
  )
ON CONFLICT DO NOTHING;

-- subscriber (inherits user + premium access)
INSERT INTO auth.role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM auth.roles r, auth.permissions p
WHERE r.name = 'subscriber'
  AND p.key IN (
    'content.read', 'stats.read', 'stats.read_premium',
    'market.read', 'market.read_history',
    'projection.view', 'projection.view_premium',
    'user.read_own', 'user.update_own', 'billing.read_own', 'analytics.read_own'
  )
ON CONFLICT DO NOTHING;

-- analyst (premium stats + projection management)
INSERT INTO auth.role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM auth.roles r, auth.permissions p
WHERE r.name = 'analyst'
  AND p.key IN (
    'content.read', 'stats.read', 'stats.read_premium',
    'market.read', 'market.read_history',
    'projection.view', 'projection.view_premium', 'projection.manage',
    'user.read_own', 'user.update_own', 'billing.read_own', 'analytics.read_own'
  )
ON CONFLICT DO NOTHING;

-- editor (content management + premium reads)
INSERT INTO auth.role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM auth.roles r, auth.permissions p
WHERE r.name = 'editor'
  AND p.key IN (
    'content.read', 'content.read_drafts', 'content.write', 'content.publish',
    'stats.read', 'stats.read_premium',
    'market.read', 'market.read_history',
    'projection.view', 'projection.view_premium',
    'user.read_own', 'user.update_own', 'billing.read_own', 'analytics.read_own'
  )
ON CONFLICT DO NOTHING;

-- admin (all except owner-only capabilities)
INSERT INTO auth.role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM auth.roles r, auth.permissions p
WHERE r.name = 'admin'
  AND p.key NOT IN ('admin.config')  -- owner-only config writes
ON CONFLICT DO NOTHING;

-- owner (all permissions)
INSERT INTO auth.role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM auth.roles r, auth.permissions p
WHERE r.name = 'owner'
ON CONFLICT DO NOTHING;
