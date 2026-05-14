# Phase 4 — Frontend Implementation

## Phase Objective

Build the React + Vite + TypeScript frontend for Caddy Stats, including public site architecture, analytics dashboards, premium views, editorial rendering, routing, SEO readiness, and performance standards.

---

## 4.1 Frontend Stack

Core Stack

React

Vite

TypeScript

TanStack Query

TanStack Table

React Router

CSS modules or Tailwind

Recharts

Zod

### App Location

apps/web/

---

## 4.2 Frontend Folder Structure

```text
apps/web/
│
├── public/
├── src/
│   ├── api/
│   ├── app/
│   ├── assets/
│   ├── components/
│   ├── features/
│   ├── hooks/
│   ├── layouts/
│   ├── pages/
│   ├── routes/
│   ├── services/
│   ├── state/
│   ├── styles/
│   ├── types/
│   └── utils/
│
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## 4.3 Application Domains

Public Site

Home

Articles

Player pages

Tournament pages

Rankings

Betting intelligence

Projections

Course history

Premium Dashboards

Player comparison

Projection explorer

Betting edge dashboard

Ownership projections

Model trend analysis

Simulation results

Admin/Editor Access

Handled later in Phase 5 and Phase 10.

---

## 4.4 Routing Structure

```text
src/routes/
├── router.tsx
├── publicRoutes.tsx
├── premiumRoutes.tsx
└── errorRoutes.tsx
```

Required Public Routes

/
/articles
/articles/:slug
/players
/players/:playerSlug
/tournaments
/tournaments/:tournamentSlug
/rankings
/projections
/betting

Required Premium Routes

/premium/dashboard
/premium/projections
/premium/player-comparison
/premium/betting-edges
/premium/simulations

---

## 4.5 API Client Layer

```text
src/api/
├── client.ts
├── endpoints.ts
├── graphql.ts
├── queries/
├── mutations/
└── schemas/
```

### Rules

- REST for stats/projections/rankings

- GraphQL for content/editorial reads

- Zod validation for API responses

- Typed hooks wrapping TanStack Query

---

## 4.6 TanStack Query Standards

```text
src/api/queries/
├── usePlayers.ts
├── usePlayerDetail.ts
├── useTournaments.ts
├── useRankings.ts
├── useProjections.ts
├── useBettingEdges.ts
└── useArticles.ts
```

Query Rules

stable query keys

staleTime defined per domain

cache invalidation documented

loading/error states standardized

---

## 4.7 Component Architecture

```text
src/components/
├── common/
├── layout/
├── charts/
├── tables/
├── cards/
├── forms/
├── seo/
├── navigation/
└── premium/
```

Component Rules

presentational components stay stateless

feature components own domain behavior

shared components move to packages/ui

no direct API calls inside display components

---

## 4.8 Feature Module Structure

```text
src/features/
├── articles/
├── players/
├── tournaments/
├── rankings/
├── projections/
├── betting/
├── premium/
└── seo/
```

Example Feature

```text
src/features/players/
├── components/
├── hooks/
├── pages/
├── services/
├── types.ts
└── utils.ts
```

---

## 4.9 Table Architecture

TanStack Table Use Cases

player rankings

projections

betting edges

tournament stats

course history

ownership projections

Required Table Features

sorting

filtering

pagination

column visibility

mobile handling

export-ready structure

---

## 4.10 Chart Architecture

Chart Domains

recent form

strokes gained trends

projection distributions

betting edge movement

ownership trends

course fit profile

Chart Requirements

responsive containers

accessible labels

no misleading axes

premium chart gates where required

---

## 4.11 SEO Component System

```text
src/components/seo/
├── MetaTags.tsx
├── JsonLd.tsx
├── BreadcrumbSchema.tsx
├── ArticleSchema.tsx
└── PlayerSchema.tsx
```

SEO Requirements

route-level titles

meta descriptions

canonical URLs

Open Graph tags

structured data injection

sitemap compatibility

---

## 4.12 Editorial Rendering

Article Block Components

```text
src/features/articles/blocks/
├── TextBlock.tsx
├── HeadingBlock.tsx
├── StatTableBlock.tsx
├── PlayerCardBlock.tsx
├── ChartBlock.tsx
├── ProjectionBlock.tsx
├── BettingEdgeBlock.tsx
└── DisclaimerBlock.tsx
```

### Rules

- sanitize HTML

- validate block schema

- never render untrusted markup directly

- distinguish computed data from editorial text

---

## 4.13 Premium Gating

```text
src/features/premium/
├── PremiumGate.tsx
├── SubscriptionBadge.tsx
├── UpgradePrompt.tsx
├── useAccess.ts
└── accessRules.ts
```

Gate Types

full-page gate

partial content gate

table-row gate

chart overlay gate

export gate

---

## 4.14 State Management

### Rules

- TanStack Query for server state

- React local state for UI state

- URL params for filters where shareable

- avoid global state unless required

- Possible Global State

- auth session

- user preferences

- subscription access

- feature flags

---

## 4.15 Authentication Frontend

```text
src/features/auth/
├── LoginPage.tsx
├── AuthProvider.tsx
├── ProtectedRoute.tsx
├── useAuth.ts
└── sessionStorage.ts
```

### Requirements

- token refresh handling

- secure logout

- protected premium routes

- role-based route access

---

## 4.16 Performance Standards

Targets

Lighthouse >90

initial JS minimized

route-level code splitting

lazy-loaded charts

table virtualization for large data

cached API queries

Required Techniques

dynamic imports

memoized heavy tables

query prefetching

image optimization

bundle analysis

---

## 4.17 Accessibility Standards

### Required

- semantic HTML

- keyboard navigation

- focus management

- accessible tables

- chart text alternatives

- color contrast compliance

- ARIA only where needed

---

## 4.18 Error & Loading States

```text
src/components/common/
├── LoadingState.tsx
├── ErrorState.tsx
├── EmptyState.tsx
└── Skeleton.tsx
```

### Rules

- no blank loading pages

- user-safe error messages

- retry actions where useful

- premium-gated errors distinguished from failures

---

## 4.19 Testing Strategy

```text
apps/web/src/tests/
├── unit/
├── integration/
├── accessibility/
├── e2e/
└── fixtures/
```

Required Testing

route rendering

API hook behavior

table sorting/filtering

premium gates

article block rendering

accessibility checks

---

## 4.20 Frontend Environment Variables

VITE_API_URL=
VITE_GRAPHQL_URL=
VITE_CDN_URL=
VITE_APP_ENV=
VITE_SENTRY_DSN=

### Rule

Only expose public-safe values through VITE\_.

---

## 4.21 Build Configuration

Required Config Files

vite.config.ts
tsconfig.json
tsconfig.node.json
.eslintrc
.prettierrc

---

## 4.22 Frontend Validation Checklist

### Architecture

[ ] React app scaffolded

[ ] Feature modules created

[ ] API client implemented

[ ] Routing configured

Data

[ ] TanStack Query hooks created

[ ] Zod schemas added

[ ] API errors normalized

UI

[ ] Shared component structure ready

[ ] Tables implemented

[ ] Charts structured

[ ] Premium gates created

SEO

[ ] Meta components implemented

[ ] JSON-LD components created

[ ] Canonical support added

Security

[ ] Auth provider implemented

[ ] Protected routes added

[ ] Untrusted content sanitized

Performance

[ ] Lazy loading enabled

[ ] Bundle analysis configured

[ ] Lighthouse target documented

---

## 4.17 Additional Required Tasks Identified

### Tasks

- Add accessibility acceptance criteria for public, premium, and data-heavy page experiences.
- Add entitlement-aware UI states and loading or error patterns tied to backend gating APIs.
- Add page-level schema and SEO integration hooks for player, tournament, course, and editorial views.
- Add frontend performance budgets and bundle-monitoring tasks for high-traffic routes.

## Phase 4 Exit Condition

Phase 4 is complete only when:

Public frontend routes are implemented

API query layer is typed and validated

Premium dashboard structure exists

SEO component system is active

Editorial block rendering is secure

Auth-aware routing exists

Performance standards are measurable

Core frontend tests pass

## Only after completion may Phase 5 Editor Implementation begin.
