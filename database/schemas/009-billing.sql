-- =============================================================================
-- 009-billing.sql
-- Schema: billing
-- Domain: Subscription and Monetization
-- Owns: plans, subscriptions, entitlements, billing_events, invoice_records,
--       affiliate_links, affiliate_conversions
-- Depends on: 001-bootstrap.sql, 002-auth.sql
-- =============================================================================

-- ---------------------------------------------------------------------------
-- billing.plans
-- Purchasable subscription tiers. features is a JSONB array of capability
-- keys included in the plan for UI display (entitlements are authoritative).
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS billing.plans (
  id                UUID        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name              TEXT        NOT NULL UNIQUE,
  slug              TEXT        NOT NULL UNIQUE,
  description       TEXT,
  price_monthly_cents INTEGER   NOT NULL DEFAULT 0,
  price_annual_cents  INTEGER   NOT NULL DEFAULT 0,
  currency          CHAR(3)     NOT NULL DEFAULT 'USD',
  features          JSONB       NOT NULL DEFAULT '[]',
  trial_days        INTEGER     NOT NULL DEFAULT 0,
  is_active         BOOLEAN     NOT NULL DEFAULT TRUE,
  is_public         BOOLEAN     NOT NULL DEFAULT TRUE,
  sort_order        INTEGER     NOT NULL DEFAULT 0,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- billing.subscriptions
-- Billing agreements linking a user to a plan. provider_subscription_id
-- is the external billing provider reference (Stripe, etc.).
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS billing.subscriptions (
  id                        UUID        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id                   UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id                   UUID        NOT NULL REFERENCES billing.plans(id) ON DELETE RESTRICT,
  status                    TEXT        NOT NULL DEFAULT 'trialing'
                              CHECK (status IN ('trialing','active','past_due','paused',
                                                'cancelled','expired','incomplete')),
  provider                  TEXT        NOT NULL DEFAULT 'stripe'
                              CHECK (provider IN ('stripe','manual','internal')),
  provider_subscription_id  TEXT        UNIQUE,
  provider_customer_id      TEXT,
  billing_interval          TEXT        NOT NULL DEFAULT 'monthly'
                              CHECK (billing_interval IN ('monthly','annual','lifetime')),
  current_period_start      TIMESTAMPTZ,
  current_period_end        TIMESTAMPTZ,
  trial_start               TIMESTAMPTZ,
  trial_end                 TIMESTAMPTZ,
  cancel_at_period_end      BOOLEAN     NOT NULL DEFAULT FALSE,
  canceled_at               TIMESTAMPTZ,
  created_at                TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- billing.entitlements
-- Individual feature access grants. Source indicates whether the grant
-- derives from a subscription plan, a manual override, or a promotion.
-- Revoked grants are soft-deleted via revoked_at.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS billing.entitlements (
  id               UUID        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id          UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_id  UUID        REFERENCES billing.subscriptions(id) ON DELETE CASCADE,
  capability_key   TEXT        NOT NULL,
  scope            TEXT,
  source           TEXT        NOT NULL DEFAULT 'subscription'
                     CHECK (source IN ('subscription','manual','promotion','trial')),
  granted_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at       TIMESTAMPTZ,
  revoked_at       TIMESTAMPTZ,
  granted_by       UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  notes            TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- billing.billing_events
-- External payment-system events captured for reconciliation. payload stores
-- the raw provider webhook body for replay and debugging.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS billing.billing_events (
  id                  UUID        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  subscription_id     UUID        REFERENCES billing.subscriptions(id) ON DELETE SET NULL,
  user_id             UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  event_type          TEXT        NOT NULL,  -- 'payment_succeeded','payment_failed','subscription_cancelled', etc.
  provider            TEXT        NOT NULL DEFAULT 'stripe',
  provider_event_id   TEXT        UNIQUE,
  payload             JSONB       NOT NULL DEFAULT '{}',
  processed_at        TIMESTAMPTZ,
  processing_error    TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- billing.invoice_records
-- Summary records for issued invoices. Mirrors provider invoice data for
-- support and reporting without requiring a live provider API call.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS billing.invoice_records (
  id                  UUID        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  subscription_id     UUID        REFERENCES billing.subscriptions(id) ON DELETE SET NULL,
  user_id             UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider_invoice_id TEXT        UNIQUE,
  amount_cents        INTEGER     NOT NULL,
  currency            CHAR(3)     NOT NULL DEFAULT 'USD',
  status              TEXT        NOT NULL DEFAULT 'open'
                        CHECK (status IN ('draft','open','paid','void','uncollectible')),
  period_start        TIMESTAMPTZ,
  period_end          TIMESTAMPTZ,
  invoice_url         TEXT,
  invoice_pdf_url     TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- billing.affiliate_programs
-- Registered affiliate or referral program definitions.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS billing.affiliate_programs (
  id                UUID        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name              TEXT        NOT NULL UNIQUE,
  slug              TEXT        NOT NULL UNIQUE,
  commission_type   TEXT        NOT NULL DEFAULT 'percentage'
                      CHECK (commission_type IN ('percentage','flat_cpm','flat_per_action')),
  commission_rate   NUMERIC(8,4) NOT NULL DEFAULT 0,
  cookie_days       INTEGER     NOT NULL DEFAULT 30,
  disclosure_text   TEXT,
  is_active         BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- billing.affiliate_links
-- Tracking links for affiliate programs on content or outbound pages.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS billing.affiliate_links (
  id            UUID        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  program_id    UUID        NOT NULL REFERENCES billing.affiliate_programs(id) ON DELETE CASCADE,
  label         TEXT        NOT NULL,
  destination   TEXT        NOT NULL,
  tracking_code TEXT        NOT NULL UNIQUE,
  placement     TEXT,       -- 'article_inline','sidebar','picks_table', etc.
  is_active     BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- billing.affiliate_conversions
-- Attribution events when a tracked affiliate link produces a qualifying action.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS billing.affiliate_conversions (
  id              UUID        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  link_id         UUID        NOT NULL REFERENCES billing.affiliate_links(id) ON DELETE CASCADE,
  session_id      TEXT,
  user_id         UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  conversion_type TEXT        NOT NULL,
  amount_cents    INTEGER,
  commission_cents INTEGER,
  properties      JSONB       NOT NULL DEFAULT '{}',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
