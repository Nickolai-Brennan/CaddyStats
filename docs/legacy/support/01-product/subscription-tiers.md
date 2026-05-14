# Subscription Tiers

Last updated: 2026-05-12
Owner: Product + Revenue
Status: Working draft

## Objective

Define a clear, scalable subscription structure that balances acquisition, conversion, and long-term retention.

## Plan Architecture

### Tier 0: Anonymous

Purpose:
SEO discovery and trust-building entry point.

Access:

- Public pages
- Limited previews of rankings and projections

### Tier 1: Free User (Registered)

Purpose:
Activation and onboarding into recurring behavior.

Access:

- Full basic public content
- Limited projection depth
- Limited comparison/filter interactions
- Newsletter and account-level personalization basics

### Tier 2: Premium Subscriber

Purpose:
Full decision workflow access for serious weekly users.

Access:

- Full projections and probabilities
- Explainability modules
- Advanced filters and comparison workflows
- Watchlists and alerting
- Premium analysis content
- Model performance views

## Billing Models

Primary billing options:

- Monthly plan
- Annual plan with discount equivalent to 1-2 months free

Optional growth offers:

- Intro trial period
- Major-week promotional bundles
- Seasonal renewal incentives

## Indicative Packaging (Non-Final)

Use these as placeholders until pricing experiments finalize:

- Free: $0
- Premium Monthly: target range $19-$39
- Premium Annual: target range $199-$349

Final pricing must be validated through conversion and churn testing.

## Entitlement Summary

| Capability Area             | Free User | Premium Subscriber |
| --------------------------- | --------- | ------------------ |
| Core public analytics       | Yes       | Yes                |
| Full projection depth       | Limited   | Yes                |
| Explainability              | Preview   | Yes                |
| Advanced research workflows | Limited   | Yes                |
| Watchlists and alerts       | Limited   | Yes                |
| Premium editorial           | Metered   | Yes                |
| Model performance dashboard | No        | Yes                |

Detailed mapping is maintained in premium-feature-matrix.md.

## Upgrade Triggers

High-intent upgrade moments:

- User opens full projection table
- User attempts advanced multi-filter workflow
- User attempts to save multiple watchlist conditions
- User opens premium explainability details repeatedly

## Downgrade and Churn Handling

When cancellation is initiated:

- Capture reason taxonomy
- Offer annual/monthly switch and potential pause option
- Surface underused premium value before completion
- Preserve account and free-tier history for reactivation

## Revenue Guardrails

- Avoid over-discounting that weakens perceived value
- Keep premium promise tied to measurable utility
- Prevent feature fragmentation that confuses plan selection

## Metrics by Tier

### Free Tier Metrics

- Visitor-to-signup rate
- Activation completion rate
- Free-to-premium conversion rate

### Premium Metrics

- Trial-to-paid conversion
- Month-1 and month-3 retention
- ARPU and LTV trend
- Churn by acquisition source and engagement cohort

## Operational Requirements

- Entitlements enforced server-side via JWT and role checks
- Subscription state synced reliably with billing provider
- Grace period and failed payment handling logic defined
- Audit log for subscription state changes

## Experiment Roadmap

1. Monthly vs annual default selection test
2. Trial length and qualification test
3. Paywall copy emphasizing explainability vs speed-to-decision value
4. Premium feature preview depth test

## Decision Log Policy

Any tier or entitlement change must update:

- subscription-tiers.md
- premium-feature-matrix.md
- analytics event definitions for gates/conversions
