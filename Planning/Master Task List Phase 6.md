Phase 6 — Templates Implementation

Phase Objective

Build reusable content, page, email, SEO, and data display templates for Caddy Stats so editorial, analytics, and premium experiences can scale without rebuilding layouts for every use case.


---

6.1 Template Architecture

Template Domains

templates/
├── pages/
├── articles/
├── blocks/
├── emails/
├── seo/
├── dashboards/
├── reports/
└── exports/

Primary Goals

reusable editorial layouts

consistent SEO output

repeatable analytics pages

premium dashboard patterns

data-driven block rendering

scalable content production



---

6.2 Folder Placement

Frontend Templates

apps/web/src/templates/
├── pages/
├── articles/
├── dashboards/
├── seo/
└── exports/

Editor Templates

apps/editor/src/templates/
├── articles/
├── blocks/
├── workflows/
└── seo/

Shared Templates

packages/templates/
├── article/
├── seo/
├── email/
├── report/
└── schema/


---

6.3 Article Templates

Required Article Templates

TournamentPreviewTemplate
PlayerBreakdownTemplate
BettingPicksTemplate
CourseFitTemplate
ProjectionReportTemplate
WeeklyRankingsTemplate
DFSOwnershipTemplate
PostRoundRecapTemplate

Template Fields

title pattern

slug pattern

meta title pattern

meta description pattern

required blocks

optional blocks

stat dependencies

schema type

publish checklist



---

6.4 Article Template Schema

export type ArticleTemplate = {
  id: string;
  name: string;
  description: string;
  category: string;
  titlePattern: string;
  slugPattern: string;
  metaTitlePattern: string;
  metaDescriptionPattern: string;
  requiredBlocks: string[];
  optionalBlocks: string[];
  requiredStats: string[];
  schemaType: "Article" | "NewsArticle" | "AnalysisNewsArticle";
  premiumEligible: boolean;
};


---

6.5 Block Templates

Required Block Templates

IntroSummaryBlockTemplate
KeyStatsTableTemplate
PlayerComparisonTemplate
ProjectionSummaryTemplate
BettingEdgeTableTemplate
CourseFitChartTemplate
ModelConfidenceTemplate
PremiumCalloutTemplate
DisclaimerTemplate

Rule

Block templates define structure only. Live stats must be injected through verified data references.


---

6.6 Dashboard Templates

Public Dashboard Templates

RankingsDashboardTemplate
TournamentDashboardTemplate
PlayerProfileTemplate
CourseHistoryTemplate

Premium Dashboard Templates

ProjectionExplorerTemplate
BettingEdgeDashboardTemplate
SimulationResultsTemplate
OwnershipDashboardTemplate
PlayerComparisonDashboardTemplate
ModelTrendDashboardTemplate


---

6.7 SEO Templates

packages/templates/seo/
├── articleSeoTemplates.ts
├── playerSeoTemplates.ts
├── tournamentSeoTemplates.ts
├── rankingsSeoTemplates.ts
└── bettingSeoTemplates.ts

Required SEO Template Outputs

title

description

canonical path

Open Graph title

Open Graph description

structured data type

breadcrumb structure



---

6.8 Structured Data Templates

JSON-LD Templates

ArticleJsonLdTemplate
BreadcrumbJsonLdTemplate
PersonJsonLdTemplate
SportsEventJsonLdTemplate
FAQJsonLdTemplate
DatasetJsonLdTemplate

Rule

Structured data must be generated from typed entities, not freeform strings.


---

6.9 Email Templates

Required Email Templates

WelcomeEmail
PasswordResetEmail
SubscriptionStartedEmail
SubscriptionCanceledEmail
WeeklyGolfIntelEmail
PremiumUpgradeEmail
EditorReviewRequestEmail
PublishConfirmationEmail

Folder

packages/templates/email/


---

6.10 Report Templates

Required Report Templates

WeeklyProjectionReport
TournamentBettingReport
PlayerTrendReport
ModelPerformanceReport
PremiumSubscriberReport

Use Cases

subscriber emails

downloadable reports

admin review

internal model audits



---

6.11 Export Templates

Export Types

CSV
PDF
JSON

Export Domains

projections

rankings

betting edges

simulation results

player comparison

model performance



---

6.12 Template Registry

Registry Location

packages/templates/src/registry.ts

Registry Shape

export type TemplateRegistryItem = {
  id: string;
  type: "article" | "block" | "seo" | "email" | "dashboard" | "report" | "export";
  name: string;
  version: string;
  requiredData: string[];
  renderTarget: "web" | "editor" | "email" | "pdf" | "api";
};


---

6.13 Template Versioning

Requirements

templates have version numbers

article versions store template ID + version

updates must not mutate historical published output

breaking template changes require migration notes



---

6.14 Template Validation

packages/templates/src/validation/
├── articleTemplateSchema.ts
├── blockTemplateSchema.ts
├── seoTemplateSchema.ts
├── emailTemplateSchema.ts
└── reportTemplateSchema.ts

Requirements

Zod schemas for all template definitions

required data validation

block dependency validation

SEO field validation

publish readiness validation



---

6.15 Editor Template Integration

Required Editor Features

choose template when creating article

auto-generate article outline

prefill SEO fields

prefill required blocks

show missing required data

validate template before publish



---

6.16 Web Template Integration

Required Web Features

route-level template rendering

dynamic metadata generation

responsive layouts

premium content placeholders

consistent block rendering

schema injection



---

6.17 AI Template Integration

Required AI Controls

AI receives selected template ID

AI receives required block list

AI receives validated stat sources

AI cannot bypass template validation

AI output must map to approved block types



---

6.18 Monetization Alignment

Premium Template Uses

gated projection sections

betting edge tables

advanced simulations

ownership projections

downloadable premium reports

subscriber-only email templates



---

6.19 Template Testing

packages/templates/tests/
├── articleTemplates.test.ts
├── blockTemplates.test.ts
├── seoTemplates.test.ts
├── emailTemplates.test.ts
├── reportTemplates.test.ts
└── registry.test.ts

Required Tests

template schema validation

required block validation

SEO output validation

historical version compatibility

premium gate compatibility



---

6.20 Validation Checklist

Architecture

[ ] Template folders created

[ ] Shared template package initialized

[ ] Registry implemented

[ ] Versioning rules added


Editorial

[ ] Article templates defined

[ ] Block templates defined

[ ] Editor template selection integrated


SEO

[ ] SEO templates implemented

[ ] JSON-LD templates implemented

[ ] Breadcrumb templates implemented


Premium

[ ] Premium dashboard templates defined

[ ] Gated report templates defined

[ ] Export templates planned


AI

[ ] Template-aware AI flow designed

[ ] Block mapping enforced

[ ] Grounded data requirements enforced



---

Phase 6 Exit Condition

Phase 6 is complete only when:

Template registry exists

Article templates are typed and validated

Block templates are reusable

SEO templates generate consistent metadata

Dashboard templates are defined

Email/report templates are structured

Template versioning protects historical content

Editor and web rendering support templates

AI generation is template-aware


Only after completion may Phase 7 SEO Implementation begin.
