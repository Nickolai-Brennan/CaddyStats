-- =============================================================================
-- vw_active_entitlements.sql
-- View: billing.vw_active_entitlements
-- Current non-revoked, non-expired entitlements per user.
-- Used by the auth middleware capability check.
-- =============================================================================

CREATE OR REPLACE VIEW billing.vw_active_entitlements AS
SELECT
  e.id,
  e.user_id,
  e.subscription_id,
  e.capability_key,
  e.scope,
  e.source,
  e.granted_at,
  e.expires_at,
  s.plan_id,
  s.status        AS subscription_status,
  pl.slug         AS plan_slug,
  pl.name         AS plan_name
FROM billing.entitlements e
LEFT JOIN billing.subscriptions s  ON e.subscription_id = s.id
LEFT JOIN billing.plans         pl ON s.plan_id = pl.id
WHERE e.revoked_at IS NULL
  AND (e.expires_at IS NULL OR e.expires_at > NOW());
