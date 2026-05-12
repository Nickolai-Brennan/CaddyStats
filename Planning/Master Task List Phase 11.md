# Phase 11 — Integrations

## Phase Objective

Connect Caddy Stats to external services required for data ingestion, betting intelligence, payments, email, analytics, media, AI providers, and operational automation.

---

## 11.1 Integration Architecture

Core Integration Domains

```text
integrations/
├── data-providers/
├── sportsbooks/
├── payments/
├── email/
├── ai-providers/
├── analytics/
├── media-storage/
├── monitoring/
├── webhooks/
└── affiliates/
```

### Backend Location

services/api/app/integrations/

---

## 11.2 Integration Principles

### Rules

- every integration uses a provider abstraction

- every external request has timeout handling

- retries use exponential backoff

- webhooks are verified

- raw payloads are stored when useful

- secrets are never logged

- provider failures degrade gracefully

- integrations expose health status

---

## 11.3 Folder Structure

```text
services/api/app/integrations/
├── base/
│   ├── client.py
│   ├── errors.py
│   ├── retry.py
│   └── health.py
│
├── data_providers/
│   ├── pga_tour_client.py
│   ├── datagolf_client.py
│   ├── odds_provider_client.py
│   └── weather_client.py
│
├── sportsbooks/
│   ├── draftkings_client.py
│   ├── fanduel_client.py
│   ├── betmgm_client.py
│   └── caesars_client.py
│
├── payments/
│   ├── stripe_client.py
│   ├── webhook_handler.py
│   └── billing_sync.py
│
├── email/
│   ├── email_client.py
│   ├── templates.py
│   └── delivery_log.py
│
├── ai/
│   ├── openai_client.py
│   ├── model_router.py
│   └── usage_tracker.py
│
├── storage/
│   ├── object_storage_client.py
│   ├── signed_uploads.py
│   └── cdn_client.py
│
├── analytics/
│   ├── posthog_client.py
│   ├── ga4_client.py
│   └── event_tracker.py
│
└── webhooks/
    ├── verifier.py
    ├── dispatcher.py
    └── handlers/
```

---

## 11.4 Data Provider Integrations

Primary Data Sources

PGA Tour data

DataGolf or equivalent golf stats provider

sportsbook odds provider

weather provider

course database source

### Required Capabilities

- fetch players

- fetch tournaments

- fetch field lists

- fetch historical rounds

- fetch strokes gained

- fetch rankings

- fetch betting odds

- fetch weather conditions

---

## 11.5 Data Provider Abstraction

from typing import Protocol, Any

class GolfDataProvider(Protocol):
async def fetch_players(self) -> list[dict[str, Any]]: ...
async def fetch_tournaments(self, season: int) -> list[dict[str, Any]]: ...
async def fetch_field(self, tournament_id: str) -> list[dict[str, Any]]: ...
async def fetch_rounds(self, tournament_id: str) -> list[dict[str, Any]]: ...
async def health_check(self) -> bool: ...

---

## 11.6 Sportsbook Integration

Required Markets

outright winner

top 5

top 10

top 20

matchup

round leader

make/miss cut

### Required Fields

- sportsbook

- market type

- player

- odds

- implied probability

- timestamp

- source event ID

- source market ID

---

## 11.7 Odds Normalization

### Requirements

- normalize player names

- map sportsbook event IDs to tournaments

- convert American odds to implied probability

- deduplicate markets

- detect stale lines

- preserve raw odds payloads

- Storage Tables

- stats.betting_lines
- ingestion.source_payloads
- ingestion.source_mappings

---

## 11.8 Payment Integration

Preferred Provider

Stripe

### Required Capabilities

- checkout session creation

- customer portal

- subscription lifecycle handling

- invoice tracking

- failed payment handling

- cancellation tracking

- webhook verification

---

## 11.9 Subscription Events

Required Webhooks

checkout.session.completed
customer.subscription.created
customer.subscription.updated
customer.subscription.deleted
invoice.payment_succeeded
invoice.payment_failed

### Rules

- webhook event ID must be idempotent

- provider is source of truth

- failed webhook events are retried

- billing actions are audited

---

## 11.10 Email Integration

### Use Cases

account verification

password reset

subscription confirmation

weekly golf intel

editor review requests

publish confirmations

billing notices

### Requirements

- template registry

- delivery logs

- unsubscribe support

- bounce handling

- provider abstraction

---

## 11.11 AI Provider Integration

### Requirements

- provider abstraction

- model routing

- token usage tracking

- latency tracking

- retry logic

- validation pipeline integration

- fallback model support

- no raw secrets in logs

---

## 11.12 Object Storage Integration

### Use Cases

article images

media library

OG images

downloadable reports

exports

### Requirements

- signed uploads

- signed downloads for private files

- CDN URL generation

- metadata storage

- file size validation

- MIME type validation

- lifecycle policies

---

## 11.13 Analytics Integration

Events To Track

article view

signup started

subscription started

upgrade CTA clicked

premium dashboard viewed

betting edge viewed

projection exported

article published

AI generation accepted

### Requirements

- privacy-safe tracking

- consent-aware analytics

- server-side event support

- user ID hashing where needed

---

## 11.14 Affiliate Integration

Affiliate Domains

sportsbook referrals

golf products

fantasy tools

newsletter sponsorships

### Requirements

- outbound click tracking

- affiliate disclosure blocks

- campaign attribution

- revenue reporting

- no cloaked betting claims

---

## 11.15 Webhook Architecture

```text
services/api/app/integrations/webhooks/
├── verifier.py
├── dispatcher.py
├── handlers/
│   ├── stripe_handler.py
│   ├── email_handler.py
│   ├── data_provider_handler.py
│   └── affiliate_handler.py
└── schemas.py
```

Webhook Rules

verify signature before processing

store raw payload hash

enforce idempotency

process asynchronously where possible

log failures

retry safely

---

## 11.16 Integration Health Checks

Endpoint

GET /api/v1/admin/integrations/health

Health Categories

data providers

sportsbook odds

payments

email

AI providers

object storage

analytics

---

## 11.17 Integration Error Handling

Error Categories

provider_unavailable
rate_limited
invalid_credentials
schema_mismatch
stale_data
webhook_signature_failed
timeout
unknown_provider_error

### Requirements

- normalized error shape

- retry policy per error type

- admin visibility

- alerting for critical failures

---

## 11.18 Rate Limits & Quotas

### Required Tracking

- API provider quota usage

- sportsbook request limits

- AI token limits

- email send limits

- storage bandwidth

- webhook failure volume

---

## 11.19 Data Quality Controls

Required Validation

player identity matching

tournament mapping

duplicate odds detection

stale source detection

missing round data detection

suspicious outlier detection

---

## 11.20 Integration Tests

```text
services/api/tests/integrations/
├── test_data_provider_client.py
├── test_odds_normalization.py
├── test_stripe_webhooks.py
├── test_email_delivery.py
├── test_ai_provider_client.py
├── test_storage_client.py
├── test_analytics_events.py
└── test_webhook_verification.py
```

---

## 11.21 Integration Documentation

```text
docs/integrations/
├── data-providers.md
├── sportsbook-odds.md
├── payments.md
├── email.md
├── ai-providers.md
├── object-storage.md
├── analytics.md
├── affiliates.md
├── webhooks.md
└── provider-health.md
```

---

## 11.16 Additional Required Tasks Identified

### Tasks

- Add vendor SLA, outage fallback mode, and degraded-operation tasks for each critical integration.
- Add idempotent webhook replay, retry, and dead-letter handling requirements.
- Add credential rotation, scope minimization, and integration secret ownership controls.
- Add affiliate disclosure, attribution, and partner reporting validation tasks.

## Phase 11 Validation Checklist

Data Providers

[ ] Provider abstraction created

[ ] Player ingestion supported

[ ] Tournament ingestion supported

[ ] Round data ingestion supported

[ ] Source mappings stored

Sportsbooks

[ ] Odds provider connected

[ ] Odds normalized

[ ] Raw payloads stored

[ ] Stale lines detected

Payments

[ ] Checkout supported

[ ] Subscription webhooks verified

[ ] Billing sync implemented

[ ] Webhook idempotency enforced

Email

[ ] Email provider connected

[ ] Templates registered

[ ] Delivery logs stored

[ ] Unsubscribe handling implemented

### AI

[ ] AI provider abstraction implemented

[ ] Usage tracking enabled

[ ] Fallback routing supported

Storage

[ ] Signed uploads implemented

[ ] CDN URLs generated

[ ] MIME validation enforced

Analytics

[ ] Event tracker implemented

[ ] Subscription events tracked

[ ] Premium engagement tracked

Security

[ ] Webhooks verified

[ ] Secrets isolated

[ ] Provider errors normalized

[ ] Integration health checks exposed

---

## Phase 11 Exit Condition

Phase 11 is complete only when:

External data providers are abstracted

Sportsbook odds ingestion is normalized

Payment webhooks are verified and idempotent

Email delivery is operational

AI provider integration is tracked

Object storage supports secure uploads

Analytics events are privacy-safe

Affiliate tracking is auditable

Integration health checks are visible

Provider failures degrade safely

Only after completion may Phase 12 Scale & Optimization begin.
---
