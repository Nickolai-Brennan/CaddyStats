# Premium Feature Matrix

Last updated: 2026-05-12
Owner: Product
Status: Working draft

## Purpose

Define clear free vs premium entitlements so pricing, UX gating, and backend authorization stay consistent.

## Plan Types

- Anonymous: no account
- Free User: registered, non-paying
- Subscriber: paid premium access
- Internal Roles: editor/admin (operational access, not a customer tier)

## Entitlement Principles

1. Free must be genuinely useful for discovery and trust.
2. Premium must unlock decision speed, depth, and repeatable edge.
3. Entitlements are enforced server-side.
4. Editorial/admin privileges are role-based, not purchased features.

## Feature Matrix

| Capability | Anonymous | Free User | Subscriber | Notes |
| --- | --- | --- | --- | --- |
| Public tournament pages | Yes | Yes | Yes | SEO/discovery surface |
| Public player pages (core stats) | Limited | Yes | Yes | Anonymous may see reduced depth |
| Course overview pages | Yes | Yes | Yes | Public educational content |
| Basic rankings snapshots | Limited | Yes | Yes | Delayed/limited slices for non-paid |
| Full projection tables | No | Limited | Yes | Premium unlocks full rows/columns |
| Win/Top-N probabilities full set | No | Limited | Yes | Premium-only complete probability matrix |
| Projection explainability module | No | Limited preview | Yes | Core differentiator |
| Advanced filtering/sorting presets | No | Limited | Yes | Includes saved custom views |
| Player-to-player comparison workflow | No | Limited | Yes | Multi-entity workflows premium |
| Betting market overlays | No | Limited | Yes | Premium full market context |
| DFS overlay mode | No | Limited | Yes | Premium leverage context |
| Watchlists and alerting | No | Limited | Yes | Premium gets full rule-based alerts |
| Personal notes/workspace | No | Limited | Yes | Retention feature |
| Article access (free editorial) | Yes | Yes | Yes | Public funnel |
| Premium analysis articles | No | Limited samples | Yes | Metering allowed for free |
| Newsletter signup | Yes | Yes | Yes | Core acquisition loop |
| Model performance dashboard | No | No | Yes | Transparency feature |
| Export tools (CSV/API-like) | No | No | Planned | Add after abuse controls |

## Gating Rules

### Server-Side Required

- Projection detail endpoints
- Explainability payload endpoints
- Premium article bodies
- Watchlist/alert APIs

### Client-Side UX Patterns

- Soft gates for previews and blurred columns
- Upgrade prompts with clear value framing
- Inline unlock moments at high-intent interaction points

Client-side gating alone is insufficient for access control.

## Upgrade Trigger Moments

- User opens full projection table from tournament page
- User applies second advanced filter in same session
- User compares more than two players in one workflow
- User attempts to save watchlist criteria

## Entitlement Metadata

Recommended entitlement keys:

- tier.anonymous
- tier.free
- tier.subscriber
- feature.projections.full
- feature.projections.explainability
- feature.filters.advanced
- feature.alerts.full
- feature.content.premium
- feature.model_performance

## Abuse and Risk Controls

- Rate-limit premium endpoints
- Audit access to premium resources
- Detect suspicious scraping behavior
- Avoid exposing full premium payloads in client-rendered source

## Measurement

Track for each gated feature:

- View rate
- Gate encounter rate
- Upgrade click-through
- Post-upgrade retention impact

## Governance

- Product owns entitlement design
- Backend owns enforcement
- Frontend owns gate UX consistency
- Analytics owns conversion instrumentation

## Change Process

1. Propose entitlement changes in this document.
2. Align on product and engineering review.
3. Update backend policy checks and frontend gating UI.
4. Add analytics events for new gates.
5. Launch behind feature flag where possible.
