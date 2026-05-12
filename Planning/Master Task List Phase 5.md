# Phase 5 — Editor Implementation

## Phase Objective

Build the editorial management system for Caddy Stats, including article creation, structured content blocks, AI-assisted writing, SEO controls, revision history, publishing workflow, and role-based editorial permissions.

---

## 5.1 Editor Architecture

### App Location

apps/editor/

### Purpose

The editor is a dedicated internal application for:

article creation

structured content editing

SEO optimization

AI-assisted content generation

article versioning

publishing workflow

stats-grounded editorial blocks

---

## 5.2 Editor Folder Structure

```text
apps/editor/
│
├── public/
├── src/
│   ├── api/
│   ├── app/
│   ├── components/
│   ├── features/
│   ├── hooks/
│   ├── layouts/
│   ├── pages/
│   ├── routes/
│   ├── state/
│   ├── styles/
│   ├── types/
│   └── utils/
│
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## 5.3 Editor Feature Modules

```text
src/features/
├── articles/
├── blocks/
├── seo/
├── media/
├── ai-assist/
├── workflow/
├── revisions/
├── authors/
└── permissions/
```

---

## 5.4 Editorial Data Model

Primary Entities

Article

ArticleBlock

ArticleVersion

Author

Category

Tag

SEO metadata

Editorial workflow state

AI generation log

---

## 5.5 Article Workflow States

draft
in_review
needs_revision
approved
scheduled
published
archived

### Rules

- only editors and admins can publish

- AI-generated sections require validation

- published articles must have SEO metadata

- scheduled posts require publish_at

- archived posts remain queryable by admin

---

## 5.6 Editor Routing

/
/articles
/articles/new
/articles/:articleId/edit
/articles/:articleId/preview
/articles/:articleId/revisions
/seo
/media
/workflow
/settings

---

## 5.7 Structured Block Editor

Block Types

text
heading
stat_table
player_card
projection
betting_edge
chart
quote
callout
disclaimer
image
embed

Block Requirements

each block has a typed schema

each block validates before save

blocks support ordering

blocks support duplication

stats blocks must reference verified data

unsafe HTML is sanitized

---

## 5.8 Block Folder Structure

```text
src/features/blocks/
├── components/
│   ├── BlockEditor.tsx
│   ├── BlockRenderer.tsx
│   ├── BlockToolbar.tsx
│   └── BlockPicker.tsx
├── types/
├── schemas/
├── validators/
└── registry.ts
```

---

## 5.9 Block Registry Pattern

### Purpose

Centralize block rendering, editing, validation, and serialization.

Required Registry Shape

```ts
export type BlockDefinition = {
  type: string;
  label: string;
  editor: React.ComponentType<any>;
  renderer: React.ComponentType<any>;
  schema: unknown;
  requiresStatsGrounding: boolean;
};
```

---

## 5.10 SEO Editor

```text
src/features/seo/
├── SeoPanel.tsx
├── MetaTitleInput.tsx
├── MetaDescriptionInput.tsx
├── CanonicalInput.tsx
├── SlugEditor.tsx
├── SchemaPreview.tsx
└── SeoScore.tsx
```

### Required Fields

- meta title

- meta description

- slug

- canonical URL

- Open Graph title

- Open Graph description

- structured data type

- noindex flag

---

## 5.11 AI Editorial Assist

```text
src/features/ai-assist/
├── AiAssistPanel.tsx
├── PromptSelector.tsx
├── GroundingSourcePicker.tsx
├── GenerationPreview.tsx
├── ValidationResult.tsx
└── AiAuditTrail.tsx
```

Required Controls

prompt template selection

grounding source selection

stat validation

hallucination warning display

insert as draft block only

audit log display

---

## 5.12 AI Integrity Rules

Hard Requirements

AI cannot publish directly

AI output must be inserted as draft

AI-generated stats require source validation

generation metadata must be saved

prompt, source IDs, model, and validation result must be logged

editor must see grounding status

---

## 5.13 Stats-Grounded Blocks

Supported Blocks

StatTableBlock

PlayerCardBlock

ProjectionBlock

BettingEdgeBlock

ChartBlock

### Rule

Every stat block must store:

data source ID

query reference

last refreshed timestamp

computed value metadata

display formatting config

---

## 5.14 Revision System

```text
src/features/revisions/
├── RevisionList.tsx
├── RevisionDiff.tsx
├── RestoreRevisionButton.tsx
└── VersionTimeline.tsx
```

Revision Requirements

autosave revisions

manual save points

before/after diff

restore support

publish snapshot

audit trail integration

---

## 5.15 Publishing Workflow

```text
src/features/workflow/
├── WorkflowStatusBadge.tsx
├── SubmitForReviewButton.tsx
├── ApprovalPanel.tsx
├── SchedulePublishPanel.tsx
└── PublishChecklist.tsx
```

Publish Checklist

title exists

slug exists

SEO metadata complete

category assigned

at least one content block exists

stats blocks validated

AI blocks reviewed

author assigned

---

## 5.16 Permissions

Roles

admin
editor
writer
analyst
seo_manager

### Permission Examples

- article:create
- article:update
- article:submit_review
- article:approve
- article:publish
- article:schedule
- seo:update
- ai:generate
- stats_block:create

---

## 5.17 Preview System

### Requirements

- preview unpublished articles

- preview premium blocks

- preview SEO metadata

- preview mobile layout

- preview structured data output

- noindex preview URLs

---

## 5.18 Autosave

### Requirements

- debounce saves

- save block order

- preserve invalid draft blocks

- show save status

- avoid overwriting newer revisions

- conflict detection required

---

## 5.19 Media Management

```text
src/features/media/
├── MediaLibrary.tsx
├── MediaUploader.tsx
├── ImageMetadataPanel.tsx
├── AltTextInput.tsx
└── ImagePicker.tsx
```

### Requirements

- alt text required

- image compression

- CDN URL storage

- role-based upload permission

- metadata validation

---

## 5.20 Editor API Usage

GraphQL

Use GraphQL for:

article CRUD

block updates

revisions

SEO metadata

workflow transitions

AI generation logs

REST

Use REST for:

media upload

stat block data lookup

projection lookup

betting edge lookup

---

## 5.21 Editor Validation Checklist

### Architecture

[ ] Editor app scaffolded

[ ] Feature modules created

[ ] Block registry implemented

[ ] Editor routes configured

Editorial

[ ] Article CRUD available

[ ] Workflow states enforced

[ ] Revision system implemented

[ ] Preview system implemented

SEO

[ ] SEO panel created

[ ] Slug editor implemented

[ ] Schema preview added

[ ] SEO publish gate enforced

### AI

[ ] AI assist panel created

[ ] Grounding source selection required

[ ] AI outputs logged

[ ] AI blocks inserted as drafts only

Security

[ ] Role permissions enforced

[ ] HTML sanitized

[ ] Preview URLs protected

[ ] Publish action restricted

---

## 5.17 Additional Required Tasks Identified

### Tasks

- Add editorial review states, approval workflows, and publish audit trails.
- Add sanitized preview rendering, internal-link validation, and metadata completeness checks inside the editor.
- Add AI draft provenance, citation visibility, and human-review checkpoints for generated content.
- Add rollback, diff, and recovery tooling for article and block revisions.

## Phase 5 Exit Condition

Phase 5 is complete only when:

Editor app is operational

Structured block editing works

Article workflow is enforced

SEO metadata controls exist

AI assist is grounded and auditable

Revision history is active

Publishing checklist blocks invalid content

Role-based permissions are enforced

Only after completion may Phase 6 Templates Implementation begin.
---
