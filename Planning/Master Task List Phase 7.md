Phase 7 — SEO Implementation

Phase Objective

Implement the technical SEO system for Caddy Stats, including metadata generation, structured data, canonical URLs, sitemap automation, robots configuration, internal linking, content discoverability, and Core Web Vitals readiness.


---

7.1 SEO Architecture

Core SEO Domains

apps/web/src/features/seo/
packages/seo/
packages/templates/src/seo/
docs/seo/

SEO Objectives

indexable public pages

scalable programmatic metadata

structured data coverage

fast page performance

clean canonical strategy

strong internal linking

article and stats page discoverability

premium content crawl-safe gating



---

7.2 SEO Folder Structure

packages/seo/
├── src/
│   ├── metadata/
│   ├── schema/
│   ├── canonical/
│   ├── breadcrumbs/
│   ├── sitemap/
│   ├── robots/
│   ├── internal-linking/
│   ├── validation/
│   └── index.ts
├── tests/
├── package.json
└── tsconfig.json


---

7.3 Frontend SEO Components

apps/web/src/components/seo/
├── MetaTags.tsx
├── JsonLd.tsx
├── CanonicalLink.tsx
├── BreadcrumbSchema.tsx
├── ArticleSchema.tsx
├── PlayerSchema.tsx
├── TournamentSchema.tsx
└── DatasetSchema.tsx


---

7.4 Metadata Standards

Required Metadata Fields

export type SeoMetadata = {
  title: string;
  description: string;
  canonicalUrl: string;
  robots: "index,follow" | "noindex,nofollow" | "noindex,follow";
  ogTitle: string;
  ogDescription: string;
  ogImage?: string;
  twitterCard: "summary" | "summary_large_image";
};

Rules

every indexable route must have metadata

titles must be unique

descriptions must be human-readable

canonical URL must be absolute

no duplicate canonical paths

noindex all previews and internal editor routes



---

7.5 Canonical URL Strategy

Canonical Rules

/articles/:slug
/players/:playerSlug
/tournaments/:tournamentSlug
/rankings
/projections
/betting

Exclusions

/editor/*
/admin/*
/preview/*
/premium/internal/*

Required Utility

packages/seo/src/canonical/buildCanonicalUrl.ts


---

7.6 Structured Data Strategy

Required JSON-LD Types

Article

NewsArticle

BreadcrumbList

Person

SportsEvent

Dataset

Organization

FAQPage


Folder

packages/seo/src/schema/

Rule

JSON-LD must be generated from validated typed entities.


---

7.7 Article Schema

Required Fields

headline

description

datePublished

dateModified

author

publisher

image

mainEntityOfPage


Component

apps/web/src/components/seo/ArticleSchema.tsx


---

7.8 Player Page SEO

Route

/players/:playerSlug

Metadata Pattern

{Player Name} Stats, Rankings, Projections & Course History | Caddy Stats

Structured Data

Person

Dataset

BreadcrumbList



---

7.9 Tournament Page SEO

Route

/tournaments/:tournamentSlug

Metadata Pattern

{Tournament Name} Odds, Projections, Field & Course Preview | Caddy Stats

Structured Data

SportsEvent

Dataset

BreadcrumbList



---

7.10 Rankings SEO

Route

/rankings

Metadata Pattern

Golf Player Rankings, Form Ratings & Projection Models | Caddy Stats

Structured Data

Dataset

BreadcrumbList



---

7.11 Betting SEO

Route

/betting

Metadata Pattern

Golf Betting Edges, Odds Movement & Model Projections | Caddy Stats

Required Disclaimer

Betting content must include responsible gambling language where legally required.


---

7.12 Sitemap Architecture

Sitemap Types

sitemap-index.xml
sitemap-static.xml
sitemap-articles.xml
sitemap-players.xml
sitemap-tournaments.xml
sitemap-rankings.xml

Required Generator

services/api/app/services/sitemap_service.py

Required Route

GET /sitemap.xml
GET /sitemap-index.xml


---

7.13 Robots.txt

Required File

apps/web/public/robots.txt

Rules

allow public pages

disallow admin/editor/preview routes

include sitemap index URL


User-agent: *
Disallow: /admin/
Disallow: /editor/
Disallow: /preview/
Disallow: /premium/internal/
Allow: /

Sitemap: https://caddystats.com/sitemap-index.xml


---

7.14 Internal Linking System

Package Folder

packages/seo/src/internal-linking/

Link Graph Targets

player pages

tournament pages

rankings

betting pages

related articles

premium upgrade paths


Required Utility

suggestInternalLinks.ts


---

7.15 Breadcrumbs

Required Breadcrumb Routes

Home → Articles → Article

Home → Players → Player

Home → Tournaments → Tournament

Home → Rankings

Home → Betting


Component

apps/web/src/components/seo/BreadcrumbSchema.tsx


---

7.16 Slug Strategy

Rules

lowercase

hyphen-separated

no dates unless needed

no duplicate slugs

preserve historical slug redirects

article slug changes create redirects


Required Table

content.redirects


---

7.17 Redirect System

Backend Route

GET /r/{slug}

Redirect Types

article slug changes

retired player pages

moved tournament pages

campaign landing pages


Required Status Codes

301 for permanent

302 for temporary



---

7.18 Indexability Rules

Indexable

published articles

public player pages

public tournament pages

rankings pages

public betting pages

static marketing pages


Noindex

drafts

previews

editor routes

admin routes

internal premium dashboards

duplicate filtered table URLs



---

7.19 Pagination SEO

Rules

canonical base listing route

avoid indexing infinite filter combinations

server-readable pagination metadata

clean URL params only



---

7.20 Premium Content SEO

Rules

public teaser content indexable

premium tables partially rendered

no cloaking

upgrade CTAs visible

structured data must not expose gated values

premium-only dashboards noindex



---

7.21 Core Web Vitals

Targets

LCP <2.5s

INP <200ms

CLS <0.1

Lighthouse SEO >95

Lighthouse Performance >90


Required Techniques

image optimization

route-level code splitting

lazy-loaded charts

preloaded critical assets

minimized JavaScript

cached API responses



---

7.22 Open Graph & Social Cards

Required Defaults

site name

default OG image

article-specific OG images

player page OG images

tournament page OG images


Folder

packages/seo/src/metadata/openGraph.ts


---

7.23 SEO Validation

Required Validator

packages/seo/src/validation/validateSeoMetadata.ts

Checks

title length

description length

canonical validity

robots value

structured data validity

missing OG fields

duplicate slugs



---

7.24 SEO Testing

packages/seo/tests/
├── metadata.test.ts
├── canonical.test.ts
├── schema.test.ts
├── sitemap.test.ts
├── robots.test.ts
├── breadcrumbs.test.ts
└── redirects.test.ts


---

7.25 SEO Documentation

docs/seo/
├── technical-seo.md
├── schema-strategy.md
├── sitemap-strategy.md
├── canonical-policy.md
├── internal-linking.md
├── premium-content-seo.md
└── redirect-policy.md


---

Phase 7 Validation Checklist

Metadata

[ ] Metadata types created

[ ] Route metadata implemented

[ ] Canonicals enforced

[ ] Preview routes noindexed


Structured Data

[ ] Article schema implemented

[ ] Breadcrumb schema implemented

[ ] Player schema implemented

[ ] Tournament schema implemented

[ ] Dataset schema implemented


Sitemap

[ ] Sitemap index created

[ ] Article sitemap created

[ ] Player sitemap created

[ ] Tournament sitemap created

[ ] Sitemap routes exposed


Robots

[ ] robots.txt created

[ ] Admin/editor routes disallowed

[ ] Sitemap index referenced


Internal Linking

[ ] Internal linking utility added

[ ] Related article links supported

[ ] Player/tournament link graph supported


Performance

[ ] Core Web Vitals targets documented

[ ] Lazy loading enabled

[ ] API caching aligned



---

Phase 7 Exit Condition

Phase 7 is complete only when:

Metadata generation is route-safe

Canonical rules are enforced

JSON-LD templates are implemented

Sitemap generation is automated

robots.txt is configured

Redirect handling exists

Premium SEO rules are enforced

Core Web Vitals targets are measurable

SEO tests pass


Only after completion may Phase 8 AI Implementation begin.
