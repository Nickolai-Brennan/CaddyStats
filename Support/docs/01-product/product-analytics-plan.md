# Product Analytics Plan

Last updated: 2026-05-12
Owner: Product Analytics
Status: Working draft

## Objective

Establish a measurement system for acquisition, conversion, retention, and product quality across Caddy Stats.

## Measurement Principles

1. Instrument decisions, not just pageviews.
2. Separate free discovery behavior from premium utility behavior.
3. Tie every key event to a product question.
4. Keep event taxonomy stable and versioned.
5. Avoid collecting unnecessary personal data.

## North Star and Core KPIs

### North Star Metric

Weekly Active Premium Decision Sessions (WAPDS)

Definition:
Number of weekly subscriber sessions where a user completes at least one high-value decision action (for example shortlist creation, advanced comparison, or explainability interaction).

### Supporting KPIs

- SEO landing-to-signup rate
- Signup-to-trial/start rate
- Trial-to-paid conversion rate
- Premium week-4 retention
- Monthly subscriber churn
- Feature-level upgrade conversion from gate views
- Session time-to-shortlist

## Funnel Measurement Model

### Stage 1: Acquisition

Questions:
- Which page templates attract qualified traffic?
- Which channels produce users who later subscribe?

Events:
- page_view
- landing_template_view
- source_attribution_captured

### Stage 2: Activation

Questions:
- What first actions predict premium conversion?

Events:
- account_created
- onboarding_completed
- first_projection_view
- first_comparison_started

### Stage 3: Conversion

Questions:
- Which gates and value messages convert best?

Events:
- paywall_viewed
- paywall_cta_clicked
- checkout_started
- subscription_completed
- checkout_abandoned

### Stage 4: Retention

Questions:
- Which recurring behaviors reduce churn?

Events:
- watchlist_saved
- alert_created
- explainability_opened
- premium_session_completed
- cancellation_requested

## Event Taxonomy

Event naming:

- snake_case
- verb_object convention where possible
- include explicit context fields

Required common properties:

- event_id
- event_timestamp
- user_id (nullable for anonymous)
- session_id
- page_type
- tournament_id (nullable)
- player_id (nullable)
- plan_tier
- feature_flag_context

## Key Product Events (Initial Set)

| Event Name | Trigger | Core Properties | Owner |
| --- | --- | --- | --- |
| page_view | Any page rendered | page_type, referrer, source_channel | Frontend |
| projection_table_viewed | Projection table becomes visible | tournament_id, column_set, plan_tier | Frontend |
| projection_filter_applied | User applies filter | filter_name, filter_value_group, plan_tier | Frontend |
| explainability_opened | User opens "why" module | model_version, projection_context, plan_tier | Frontend |
| player_comparison_started | Comparison workflow initiated | player_count, context_market | Frontend |
| paywall_viewed | Any premium gate shown | gate_type, feature_name, source_surface | Frontend |
| checkout_started | Checkout flow begins | offer_id, billing_cycle | Backend |
| subscription_completed | Payment success | plan_id, billing_cycle, promo_code_used | Backend |
| watchlist_saved | User saves tracking set | watchlist_size, watchlist_type | Backend |
| cancellation_requested | User initiates cancellation | tenure_days, stated_reason | Backend |

## Data Model Notes

- Use immutable event records.
- Add schema version column for event evolution.
- Partition or cluster event storage by date for query efficiency.
- Join events to subscription state snapshots for cohort analysis.

## Dashboard Suite

### Executive Dashboard

- Revenue trend
- Active subscribers
- Conversion rate by acquisition channel
- Churn trend

### Product Dashboard

- High-value action frequency
- Feature adoption by tier
- Time-to-shortlist trend
- Explainability engagement trend

### Growth Dashboard

- SEO template performance
- Landing-to-signup by content type
- Gate-to-upgrade funnel by feature

### Retention Dashboard

- Cohort retention (week 1, week 4, month 3)
- Cancellation reasons
- Re-engagement campaign impact

## Experimentation Framework

Test types:

- Paywall copy and placement
- Trial length and offer structures
- Premium feature previews
- Onboarding flow variants

Experiment guardrails:

- No tests that compromise data trust
- No deceptive urgency tactics
- Maintain stable event contracts during experiments

## Governance and QA

- Maintain analytics tracking spec as versioned doc
- Validate events in staging before production release
- Add anomaly detection for sudden event drops/spikes
- Review broken/unused events monthly

## Privacy and Compliance

- Minimize personal data in event payloads
- Avoid sensitive free-text capture unless necessary
- Respect consent preferences and applicable legal requirements

## 90-Day Analytics Delivery Plan

1. Implement foundational event taxonomy and storage.
2. Ship conversion and retention dashboard MVP.
3. Add feature-level gate conversion instrumentation.
4. Define churn prediction signals from behavior patterns.
