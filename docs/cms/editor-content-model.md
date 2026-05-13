# CMS and Editor Content Model

## Purpose
Define the initial content model and editorial workflow contract for CaddyStats so article creation, revision, publishing, and AI-assisted authoring remain structured, auditable, and scalable.

## Goals
- Support structured sports/editorial content, not just freeform rich text
- Preserve revision history and publishing accountability
- Support reusable templates and stat-backed content blocks
- Enable AI assistance without bypassing editorial review
- Keep SEO and programmatic publishing requirements explicit

## Core Concepts

### Article
An article is the canonical editorial resource presented to users via a stable slug and one current published version.

Examples:
- player profile
- tournament preview
- betting card
- DFS/value plays article
- course breakdown
- recap/results article

### Article Version
A version is an immutable editorial snapshot associated with an article at a point in time.

Used for:
- drafts
- reviews
- scheduled publish candidates
- published history
- rollback comparison

### Block
A block is a structured content unit inside an article version.

Examples:
- heading block
- rich text block
- stat table block
- player card block
- projection summary block
- market odds block
- quote block
- CTA block
- affiliate disclosure block

### Template
A template defines allowed block structure, required metadata, optional data bindings, and rendering expectations for a content type.

### Editorial Review Event
A review event captures approval, rejection, escalation, or compliance decisions on an article or article version.

## Content Entity Model

### 1. Article
The article owns durable identity and discoverability.

Suggested fields:
- `id`
- `slug`
- `title`
- `subtitle`
- `summary`
- `article_type`
- `template_id`
- `status`
- `current_version_id`
- `author_id`
- `primary_tournament_id`
- `primary_player_id`
- `primary_course_id`
- `seo_title`
- `seo_description`
- `canonical_url`
- `featured_image_ref`
- `published_at`
- `scheduled_for`
- `created_at`
- `updated_at`

### 2. Article Version
The version owns the actual body composition.

Suggested fields:
- `id`
- `article_id`
- `version_number`
- `editor_id`
- `status`
- `change_summary`
- `body_json`
- `rendered_snapshot`
- `validation_report_json`
- `created_at`

Possible statuses:
- `draft`
- `in_review`
- `needs_changes`
- `approved`
- `scheduled`
- `published`
- `archived`

### 3. Block
Suggested block fields:
- `id`
- `article_version_id`
- `block_type`
- `sort_order`
- `data_json`
- `binding_json`
- `source_requirements_json`
- `validation_status`
- `created_at`
- `updated_at`

## Block Taxonomy

### Narrative Blocks
- `rich_text`
- `heading`
- `subheading`
- `quote`
- `callout`
- `divider`

### Data/Analysis Blocks
- `stat_table`
- `leaderboard_snapshot`
- `player_stat_summary`
- `projection_card`
- `model_summary`
- `course_fit_panel`
- `market_odds_table`
- `trend_chart`

### Structural/Utility Blocks
- `hero`
- `toc`
- `author_bio`
- `related_articles`
- `cta`
- `disclosure`
- `affiliate_module`

## Template Model

### Initial Template Types
- `player-profile`
- `tournament-preview`
- `betting-card`
- `dfs-value-plays`
- `course-breakdown`
- `recap-results`
- `news-analysis`
- `evergreen-guide`

### Template Contract
A template should define:
- required metadata
- allowed block types
- required block sequence rules
- optional/required data bindings
- validation rules
- SEO defaults
- disclosure requirements if applicable

Example expectations:
- `betting-card` requires disclosure + market data source references
- `player-profile` requires player binding
- `tournament-preview` requires tournament binding
- `dfs-value-plays` may require projection and pricing source context

## Workflow States

### Editorial Workflow
1. `draft`
2. `in_review`
3. `needs_changes`
4. `approved`
5. `scheduled`
6. `published`
7. `archived`

### Workflow Rules
- Only approved versions may be scheduled
- Only scheduled or approved versions may be published
- Publishing must record actor and timestamp
- Published versions remain immutable
- New edits after publish create a new version
- AI-assisted content cannot auto-publish

## Source and Validation Model

### Source Attachment Requirements
Any block making factual, statistical, betting, or model-derived claims should support source references.

Source classes:
- official stats source
- trusted provider feed
- internal model run
- editorial citation/reference
- manually entered verified fact

### Validation Expectations
The editor should validate:
- required metadata present
- required template blocks present
- slug/title/SEO fields present where needed
- stat blocks include source references
- market blocks include provider and capture time
- AI-assisted blocks include generation trace
- disclosure blocks present when affiliate or betting content exists

## AI-Assisted Content Rules
AI may assist with:
- summarization drafts
- outline generation
- stat-backed narrative suggestions
- rewrite suggestions
- headline/meta description suggestions

AI may not:
- publish directly
- create unsupported statistical claims
- produce betting recommendations without sourced context and review
- remove required disclosures or source attribution

## Editorial Roles
Suggested roles:
- writer
- editor
- managing editor
- analyst
- admin

Expected permission examples:
- writers create/edit drafts
- editors review and request changes
- managing editors approve and publish
- analysts contribute stat/model-backed content
- admins manage templates, roles, and system controls

## Rendering Contract
The frontend renderer should treat blocks as typed content units.
Each block type should have:
- schema validation
- rendering component
- fallback behavior for invalid data
- analytics/telemetry hooks where relevant

## Audit Requirements
The CMS must preserve:
- who created a version
- who changed workflow state
- whether AI was used
- what sources were attached
- what template was used
- what content was published and when

## Open Questions
- Whether media assets belong in the initial CMS scope
- Whether collaborative editing is needed in MVP or later
- Whether block schemas are fully JSON-driven or partially strongly typed in code contracts
