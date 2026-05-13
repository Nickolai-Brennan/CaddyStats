# Domain Model

## Purpose

This document defines the core domain entities for Caddy Stats and groups them into bounded contexts so later schema, API, and UI work can stay consistent.

## Modeling Principles

- PostgreSQL is the source of truth for canonical entities.
- `stats` and `content` concerns stay distinct even when surfaced together in one experience.
- derived values must point back to source records, model runs, or calculation metadata.
- auditability is a first-class domain concern, not an afterthought.

## Bounded Contexts

## 1. Stats and Competition Context

Core responsibility: represent golf competition data and the canonical entities behind research, projections, and pages.

### Player

- canonical golfer profile
- identifiers: internal ID, provider IDs, slug
- attributes: display name, handedness, nationality, active status
- relationships:
  - has many `Round`
  - has many `TournamentEntry`
  - has many `Projection`
  - appears in many `MarketSelection` records

### Tournament

- canonical tournament/event definition
- attributes: name, season, tour, start/end dates, status, slug
- relationships:
  - belongs to one `Course` for a specific event instance
  - has many `TournamentEntry`
  - has many `Round`
  - has many `Projection` and `Market`
  - may link to many `Article` records

### Course

- venue and course setup metadata
- attributes: name, location, par, yardage, surface traits, architecture notes
- relationships:
  - hosts many `Tournament` instances
  - informs course-fit calculations and editorial references

### TournamentEntry

- join entity between `Player` and `Tournament`
- attributes: field status, tee-time info, withdrawal state, provider sync status
- relationships:
  - belongs to one `Player`
  - belongs to one `Tournament`

### Round

- one player’s scoring/stat performance in one round of one tournament
- attributes: round number, score, position, strokes gained, scoring splits, source timestamps
- relationships:
  - belongs to one `Player`
  - belongs to one `Tournament`
  - may have one or many supporting scorecard/stat detail records

### Projection

- model-derived expectation for a player in a tournament or market context
- attributes: projection type, score/value, percentile outcomes, confidence notes, freshness, publishability
- relationships:
  - belongs to one `Player`
  - belongs to one `Tournament`
  - belongs to one `ModelRun`
  - may inform `ArticleBlock` embeds and premium views

### Market

- betting or fantasy market definition for a tournament or slate
- attributes: market type, provider, open/last-seen timestamps, status
- relationships:
  - belongs to one `Tournament`
  - has many `MarketSelection`

### MarketSelection

- participant-specific option within a market
- attributes: odds/price, line, implied probability, last-updated timestamp
- relationships:
  - belongs to one `Market`
  - belongs to one `Player`
  - may reference one or more `Projection` comparisons

## 2. Content and Publishing Context

Core responsibility: manage structured editorial assets and public publishing state.

### Article

- canonical content object exposed to users
- attributes: title, slug, summary, status, publish window, canonical URL, SEO metadata
- relationships:
  - has many `ArticleVersion`
  - has many `ArticleBlock`
  - has many `Tag`
  - belongs to one primary `Author`
  - may reference one `Tournament`, `Course`, `Player`, or topic entity

### ArticleVersion

- immutable or append-only revision record for an article
- attributes: version number, draft content snapshot, review state, created-at, reviewer metadata
- relationships:
  - belongs to one `Article`
  - may capture AI-assist references and editorial review outcomes

### ArticleBlock

- structured unit used to compose article pages
- attributes: block type, order, payload, render rules, visibility state
- relationships:
  - belongs to one `Article`
  - may reference stats entities, projections, markets, or templates

### Template

- reusable content composition pattern
- attributes: name, purpose, supported block schema, metadata defaults
- relationships:
  - may be applied to many `Article` records
  - may define allowed `ArticleBlock` structures

### Tag

- editorial classification or SEO topic label
- relationships:
  - belongs to many `Article` records

### Author

- editorial identity shown on public content
- attributes: display name, bio, slug, public profile metadata
- relationships:
  - has many `Article`
  - may map to one internal `User`

## 3. Identity and Access Context

Core responsibility: represent authentication, RBAC, and internal/public access state.

### User

- authenticated account for member, subscriber, or internal users
- attributes: email, password/auth provider references, account status, profile settings
- relationships:
  - has many `RoleAssignment`
  - may have one `Subscription`
  - may have many audit events, article actions, and AI review actions

### Role

- named permission bundle such as public, member, subscriber, analyst, editor, admin, owner
- relationships:
  - has many `Permission`
  - assigned to many `User` records through `RoleAssignment`

### Permission

- atomic capability such as `content.publish`, `projection.view_premium`, or `user.manage`

### RoleAssignment

- effective role mapping for a user
- attributes: scope, start/end dates, granted-by, reason
- relationships:
  - belongs to one `User`
  - belongs to one `Role`

## 4. Subscription and Entitlement Context

Core responsibility: control monetized access and paid feature gating.

### Subscription

- billing agreement for a user or account
- attributes: plan, billing status, renewal date, provider subscription ID
- relationships:
  - belongs to one `User`
  - has many `Entitlement`

### Entitlement

- feature access grant derived from plan or manual override
- attributes: capability key, scope, start/end dates, source
- relationships:
  - belongs to one `Subscription` or one administrative grant record

### InvoiceEvent / BillingEvent

- external payment-system event captured for reconciliation and support
- relationships:
  - belongs to one `Subscription`
  - may trigger audit or account-state changes

## 5. Audit, Governance, and AI Context

Core responsibility: preserve operational accountability for automated and manual actions.

### ModelRun

- execution record for a projection or evaluation pipeline
- attributes: model name, model version, run timestamp, input window, status
- relationships:
  - has many `Projection`
  - has many `ModelMetric`
  - may relate to one source ingestion batch

### ModelMetric

- performance or calibration record for a model run or model version
- attributes: metric name, value, evaluation window, benchmark comparison
- relationships:
  - belongs to one `ModelRun`

### AIOutputLog

- record of AI-assisted generation or transformation
- attributes: prompt version, model identifier, grounding status, output status, reviewer state
- relationships:
  - may belong to one `ArticleVersion`
  - may reference many source entities or provenance records
  - created by one `User`

### EditorialReviewLog

- audit trail for content review and publishing decisions
- attributes: action, actor, timestamp, notes, decision
- relationships:
  - belongs to one `Article` or `ArticleVersion`
  - created by one `User`

### AuditEvent

- generic operational event for sensitive actions
- attributes: actor, action, target type, target ID, before/after summary, request context
- relationships:
  - may reference `User`, `Subscription`, `Article`, `ModelRun`, or provider operations

## Cross-Context Relationship Notes

- `ArticleBlock` may reference `Player`, `Tournament`, `Course`, `Projection`, or `MarketSelection`, but content stores presentation structure while stats remain canonical in the stats context.
- `Author` is public-facing and should not replace internal `User` identity for permissions or audit purposes.
- `Subscription` and `Entitlement` govern premium access, but internal roles such as analyst, editor, and admin are not purchased tiers.
- `Projection` is always tied to a `ModelRun`; premium presentation can summarize it, but audit and lineage must remain queryable.
- `AIOutputLog` and `EditorialReviewLog` must be able to point back to both content objects and source data references.

## Suggested Persistence Boundaries

- `stats.*` for players, tournaments, courses, rounds, entries, markets, projections, model runs, and model metrics
- `content.*` for articles, versions, blocks, templates, tags, authors, and publishing metadata
- `auth.*` or equivalent for users, roles, permissions, and assignments
- `billing.*` or equivalent for subscriptions, entitlements, and billing events
- `audit.*` or equivalent for AI output logs, editorial review logs, and operational audit events

## Open Modeling Decisions

- whether authors should always map one-to-one to users or support external/byline-only authors
- whether internal analyst tools need separate scoped permissions beyond role bundles
- whether market history is stored as append-only snapshots or point-in-time current state plus history tables
