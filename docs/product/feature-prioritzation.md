# Feature Prioritization

Last updated: 2026-05-12
Owner: Product + Engineering
Status: Working draft

## Objective

Prioritize product delivery for Caddy Stats to maximize subscription conversion, retention, and defensible data advantage while respecting build order dependencies.

## Prioritization Method

This document uses a weighted score based on:

- Revenue impact (30%)
- Retention impact (25%)
- Differentiation impact (20%)
- Build dependency criticality (15%)
- Delivery effort inverse (10%)

Scoring scale: 1 (low) to 5 (high).

## Prioritized Backlog (MVP to Post-MVP)

| Priority | Feature                                      | Revenue | Retention | Differentiation | Dependency | Effort Inverse | Weighted Score | Phase            |
| -------- | -------------------------------------------- | ------- | --------- | --------------- | ---------- | -------------- | -------------- | ---------------- |
| P0       | Core stats schema + projection tables        | 4       | 4         | 5               | 5          | 3              | 4.30           | Database         |
| P0       | Tournament + player REST endpoints           | 4       | 4         | 4               | 5          | 3              | 4.10           | Backend/API      |
| P0       | Public tournament and player pages           | 4       | 3         | 4               | 4          | 3              | 3.75           | Frontend         |
| P0       | Auth + role gating (free/subscriber/admin)   | 5       | 4         | 3               | 5          | 3              | 4.20           | Backend/Frontend |
| P0       | Subscription checkout and entitlement checks | 5       | 4         | 3               | 5          | 2              | 4.10           | Business/Admin   |
| P1       | Projection explainability module             | 5       | 5         | 5               | 4          | 2              | 4.65           | Frontend/Backend |
| P1       | Premium filters and comparison workflows     | 5       | 5         | 4               | 4          | 2              | 4.45           | Frontend         |
| P1       | SEO template system for tournament content   | 4       | 3         | 3               | 4          | 4              | 3.75           | SEO/Editor       |
| P1       | Editorial CMS blocks with stat grounding     | 4       | 4         | 4               | 4          | 3              | 3.95           | Editor           |
| P1       | Analytics instrumentation foundation         | 4       | 5         | 3               | 4          | 3              | 3.95           | Analytics        |
| P2       | Personalized alerts/watchlists               | 4       | 5         | 4               | 3          | 2              | 4.05           | Retention        |
| P2       | Model performance and calibration dashboard  | 3       | 4         | 5               | 3          | 2              | 3.75           | Analytics/Admin  |
| P2       | DFS mode overlays and ownership context      | 3       | 4         | 4               | 3          | 2              | 3.45           | Frontend         |
| P3       | Automated content assistant quality scoring  | 3       | 3         | 4               | 2          | 2              | 3.00           | AI               |
| P3       | Referral and loyalty mechanics               | 3       | 4         | 2               | 2          | 2              | 2.95           | Growth           |

## Build Order Alignment

This priority list follows the required sequence:

1. Documentation: PRD and this prioritization set
2. Folder setup: already established
3. Database: stats/content schemas and projection tables
4. Backend/API: data contracts and auth
5. Frontend: public and premium UX surfaces
6. Editor/Templates/SEO: scalable content operations
7. AI: grounded assist and quality controls
8. Hosting/Admin/Integrations/Scale: operational hardening
9. Business: pricing optimization and growth loops

## Dependency Notes

- Projection explainability should not launch before projection data contracts are stable.
- Premium UI gates must rely on server-side entitlements, not client-only toggles.
- Personalized retention features depend on event instrumentation and user identity reliability.
- SEO templates must consume verified data entities (players, tournaments, courses).

## Release Batches

### Batch A (Foundation)

- Stats schema and ingestion pipelines
- Core tournament/player endpoints
- Public pages for discovery

### Batch B (Monetization Core)

- Auth and subscription entitlements
- Premium projections and filters
- Checkout and account management

### Batch C (Differentiation)

- Explainability views
- Cross-market comparison workflow
- Content templates grounded to projections

### Batch D (Retention and Scale)

- Personalization and watchlists
- Lifecycle messaging triggers
- Model quality dashboard and admin tooling

## De-Prioritized for Now

- Native mobile apps
- Real-time live odds execution systems
- Social/community feed features
- Multi-sport expansion

Reason: lower short-term ROI versus completing the core golf analytics subscription loop.

## Decision Cadence

- Weekly: sprint-level re-ranking within current batch
- Monthly: score recalibration using conversion and retention data
- Quarterly: major priority reshuffle based on market conditions and subscription targets

## Success Criteria by Priority Tier

- P0 complete: first paid subscriber can discover, evaluate, and subscribe from core experience.
- P1 complete: premium users can explain and compare recommendations with confidence.
- P2 complete: retention loops produce measurable WAU/MAU and churn improvements.
- P3 complete: operational leverage and growth multipliers improve margin.
