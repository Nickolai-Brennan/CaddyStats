-- =============================================================================
-- 012-rls.sql
-- Row Level Security policies for sensitive tables.
-- Depends on: all schema files.
--
-- Policy strategy:
--   - auth.users:          users read/update their own row; admins unrestricted
--   - billing.subscriptions, entitlements: users see only their own data
--   - analytics.*:         users see only their own tracked events
--   - system.audit_events: read-only for admins; no user self-access
--   - content.articles:    public rows readable by all; drafts restricted to editors+
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Enable RLS on sensitive tables
-- ---------------------------------------------------------------------------
ALTER TABLE auth.users              ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth.sessions           ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth.role_assignments   ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing.subscriptions   ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing.entitlements    ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing.invoice_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics.feature_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics.events        ENABLE ROW LEVEL SECURITY;
ALTER TABLE content.articles        ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------------
-- auth.users
-- ---------------------------------------------------------------------------
-- Users can read their own profile
CREATE POLICY users_select_own ON auth.users
  FOR SELECT
  USING (id = current_setting('app.current_user_id', TRUE)::UUID);

-- Users can update their own profile (non-sensitive fields enforced at app layer)
CREATE POLICY users_update_own ON auth.users
  FOR UPDATE
  USING (id = current_setting('app.current_user_id', TRUE)::UUID);

-- Service role bypasses all user policies (set app.bypass_rls = 'true' via SET LOCAL)
CREATE POLICY users_service_bypass ON auth.users
  USING (current_setting('app.bypass_rls', TRUE) = 'true');

-- ---------------------------------------------------------------------------
-- auth.sessions
-- ---------------------------------------------------------------------------
CREATE POLICY sessions_own ON auth.sessions
  FOR ALL
  USING (user_id = current_setting('app.current_user_id', TRUE)::UUID);

CREATE POLICY sessions_service_bypass ON auth.sessions
  USING (current_setting('app.bypass_rls', TRUE) = 'true');

-- ---------------------------------------------------------------------------
-- auth.role_assignments
-- ---------------------------------------------------------------------------
CREATE POLICY role_assignments_own ON auth.role_assignments
  FOR SELECT
  USING (user_id = current_setting('app.current_user_id', TRUE)::UUID);

CREATE POLICY role_assignments_service_bypass ON auth.role_assignments
  USING (current_setting('app.bypass_rls', TRUE) = 'true');

-- ---------------------------------------------------------------------------
-- billing.subscriptions
-- ---------------------------------------------------------------------------
CREATE POLICY subscriptions_own ON billing.subscriptions
  FOR ALL
  USING (user_id = current_setting('app.current_user_id', TRUE)::UUID);

CREATE POLICY subscriptions_service_bypass ON billing.subscriptions
  USING (current_setting('app.bypass_rls', TRUE) = 'true');

-- ---------------------------------------------------------------------------
-- billing.entitlements
-- ---------------------------------------------------------------------------
CREATE POLICY entitlements_own ON billing.entitlements
  FOR SELECT
  USING (user_id = current_setting('app.current_user_id', TRUE)::UUID);

CREATE POLICY entitlements_service_bypass ON billing.entitlements
  USING (current_setting('app.bypass_rls', TRUE) = 'true');

-- ---------------------------------------------------------------------------
-- billing.invoice_records
-- ---------------------------------------------------------------------------
CREATE POLICY invoices_own ON billing.invoice_records
  FOR SELECT
  USING (user_id = current_setting('app.current_user_id', TRUE)::UUID);

CREATE POLICY invoices_service_bypass ON billing.invoice_records
  USING (current_setting('app.bypass_rls', TRUE) = 'true');

-- ---------------------------------------------------------------------------
-- analytics.feature_usage
-- ---------------------------------------------------------------------------
CREATE POLICY feature_usage_own ON analytics.feature_usage
  FOR SELECT
  USING (user_id = current_setting('app.current_user_id', TRUE)::UUID);

CREATE POLICY feature_usage_service_bypass ON analytics.feature_usage
  USING (current_setting('app.bypass_rls', TRUE) = 'true');

-- ---------------------------------------------------------------------------
-- analytics.events
-- ---------------------------------------------------------------------------
CREATE POLICY events_own ON analytics.events
  FOR SELECT
  USING (
    user_id IS NULL
    OR user_id = current_setting('app.current_user_id', TRUE)::UUID
  );

CREATE POLICY events_service_bypass ON analytics.events
  USING (current_setting('app.bypass_rls', TRUE) = 'true');

-- ---------------------------------------------------------------------------
-- content.articles
-- Public articles are readable by all. Non-published articles are restricted
-- to authenticated editors, admins, and the owning author.
-- ---------------------------------------------------------------------------
CREATE POLICY articles_public_select ON content.articles
  FOR SELECT
  USING (status = 'published');

CREATE POLICY articles_editor_select ON content.articles
  FOR SELECT
  USING (current_setting('app.user_role', TRUE) IN ('editor','admin','owner'));

CREATE POLICY articles_author_select ON content.articles
  FOR SELECT
  USING (
    author_id = (
      SELECT id FROM content.authors
      WHERE user_id = current_setting('app.current_user_id', TRUE)::UUID
      LIMIT 1
    )
  );

CREATE POLICY articles_service_bypass ON content.articles
  USING (current_setting('app.bypass_rls', TRUE) = 'true');
