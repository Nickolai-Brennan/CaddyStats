# Frontend Route Map

## Purpose
Define the initial route map for the CaddyStats frontend so public pages, analytics pages, editorial workflows, and admin surfaces are organized before implementation.

## Goals
- Establish a stable information architecture
- Separate public, authenticated, editorial, and admin experiences
- Support SEO-friendly public pages
- Support data-heavy research and projection workflows
- Keep route naming predictable and scalable

## Frontend Application Context
Primary frontend app:
- `apps/web/`

Expected stack:
- React
- Vite
- TypeScript
- Tailwind
- TanStack Query
- TanStack Table
- Router library appropriate for nested layouts and data-aware page boundaries

## Route Groups

### 1. Public Marketing and Discovery
These routes are public, indexable where appropriate, and SEO-sensitive.

| Route | Purpose |
|---|---|
| `/` | Homepage and primary entry point |
| `/about` | Platform overview and positioning |
| `/roadmap` | Public roadmap or product evolution summary if exposed |
| `/pricing` | Subscription and product tier overview |
| `/contact` | Contact/support pathway |
| `/search` | Search across players, tournaments, courses, and content |

### 2. Public Golf Data and Research Pages
These routes are the core content and analytics discovery surface.

| Route | Purpose |
|---|---|
| `/players` | Player index/search |
| `/players/:playerSlug` | Player profile overview |
| `/players/:playerSlug/stats` | Detailed player stats |
| `/players/:playerSlug/results` | Historical results |
| `/players/:playerSlug/trends` | Form and trend analysis |
| `/players/:playerSlug/news` | Related articles/content if supported |
| `/tournaments` | Tournament index |
| `/tournaments/:tournamentSlug` | Tournament hub |
| `/tournaments/:tournamentSlug/field` | Tournament field page |
| `/tournaments/:tournamentSlug/leaderboard` | Live or latest leaderboard view |
| `/tournaments/:tournamentSlug/projections` | Tournament projections |
| `/tournaments/:tournamentSlug/markets` | Betting/market intelligence |
| `/tournaments/:tournamentSlug/articles` | Tournament-related editorial content |
| `/courses` | Course index |
| `/courses/:courseSlug` | Course overview |
| `/courses/:courseSlug/history` | Event/course history |
| `/courses/:courseSlug/fit` | Course fit analytics |

### 3. Rankings, Projections, and Research
These pages are analytics-first and may be partially premium-gated.

| Route | Purpose |
|---|---|
| `/rankings` | Rankings hub |
| `/rankings/players` | Player ranking models |
| `/projections` | Projection hub |
| `/projections/:eventSlug` | Event-specific projections |
| `/research` | Research landing page |
| `/research/betting` | Betting intelligence hub |
| `/research/dfs` | DFS/value plays hub |
| `/research/models` | Model insights/performance views |
| `/compare` | Compare players/courses/metrics |

### 4. Editorial Content
SEO-focused article and landing page routes.

| Route | Purpose |
|---|---|
| `/articles` | Article index |
| `/articles/:slug` | Canonical article detail route |
| `/guides/:slug` | Evergreen guide pages |
| `/insights/:slug` | Analysis/editorial series pages |
| `/tags/:tagSlug` | Tag archive pages |

### 5. Authentication and Account
Authenticated user flows.

| Route | Purpose |
|---|---|
| `/login` | Sign in |
| `/register` | Account creation if enabled |
| `/forgot-password` | Password reset request |
| `/reset-password/:token` | Reset form |
| `/account` | Account overview |
| `/account/profile` | Profile management |
| `/account/subscription` | Subscription and billing summary |
| `/account/preferences` | User preferences |
| `/account/saved` | Saved players/articles/research views |

### 6. Editorial CMS
Authenticated, permission-gated routes for content operations.

| Route | Purpose |
|---|---|
| `/editor` | Editorial dashboard |
| `/editor/articles` | Article list and filters |
| `/editor/articles/new` | Create article |
| `/editor/articles/:articleId` | Article editor |
| `/editor/articles/:articleId/history` | Revision history |
| `/editor/articles/:articleId/review` | Review and approval workflow |
| `/editor/templates` | Template management |
| `/editor/media` | Media/reference assets if added |
| `/editor/calendar` | Publishing calendar |

### 7. Admin and Operations
Restricted routes for internal operations.

| Route | Purpose |
|---|---|
| `/admin` | Admin dashboard |
| `/admin/users` | User and role management |
| `/admin/roles` | RBAC configuration |
| `/admin/ai/reviews` | AI output review queue |
| `/admin/models` | Model run monitoring |
| `/admin/ingestion` | Data ingestion monitoring |
| `/admin/audit` | Audit event viewer |
| `/admin/integrations` | Integration/provider status |

## Layout Strategy

### Public Layout
Applies to:
- marketing
- public stats
- public articles

Features:
- site navigation
- SEO metadata
- footer
- responsive content shell

### Account Layout
Applies to:
- authenticated user account pages

Features:
- account nav
- entitlement-aware page access
- saved content and personalization

### Editor Layout
Applies to:
- editorial workflows

Features:
- dense productivity-oriented UI
- autosave indicators
- workflow status
- validation panels
- source attachment review surfaces

### Admin Layout
Applies to:
- restricted admin tools

Features:
- permission guards
- operational metrics
- audit and system status surfaces

## Route Rules
- Public canonical content should use slugs, not raw IDs
- Internal/editor/admin routes may use IDs where stability is required
- Protected routes must be permission-aware in both UI and API access
- Premium-gated pages should degrade gracefully with teaser/upgrade patterns where applicable
- SEO pages must define metadata ownership at the route level

## Data Loading Patterns
- Route-level prefetch for page-critical queries
- Shared query keys for players, tournaments, courses, articles, and projections
- Cache invalidation tied to editorial publish events and projection refresh events
- Optimistic updates only where workflow risk is low

## MVP Priority Routes

### MVP Phase 1
- `/`
- `/players`
- `/players/:playerSlug`
- `/tournaments`
- `/tournaments/:tournamentSlug`
- `/courses`
- `/courses/:courseSlug`
- `/projections/:eventSlug`
- `/articles/:slug`
- `/login`

### MVP Phase 2
- `/editor/articles`
- `/editor/articles/:articleId`
- `/editor/articles/:articleId/history`
- `/research/betting`
- `/research/dfs`
- `/rankings/players`

### MVP Phase 3
- `/admin`
- `/admin/ai/reviews`
- `/admin/models`
- `/account/subscription`

## Open Questions
- Whether editorial and admin experiences remain in the same frontend app or split later
- Whether public live leaderboard pages need separate edge-rendering strategy
- Which premium routes require hard gating versus teaser rendering
