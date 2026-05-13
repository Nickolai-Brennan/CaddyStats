# PostgreSQL Schema Plan

## Purpose
Define the initial PostgreSQL schema strategy for CaddyStats as the source of truth for stats, editorial content, auth/access, and auditability.

## Goals
- Model golf analytics data with clear provenance
- Support editorial publishing and revision control
- Support AI grounding and audit requirements
- Separate operational concerns by schema
- Prepare for high-read analytical workloads

## Schema Strategy
Use multiple PostgreSQL schemas to separate concerns:

- `stats` — sports/statistical domain data
- `content` — articles, blocks, templates, metadata
- `auth` — users, roles, permissions, subscriptions
- `audit` — AI output logs, editorial review events, model execution logs
- `ops` — optional operational tables for jobs, sync runs, ingestion state

## Core Design Principles
- PostgreSQL is the canonical source of truth for persisted business entities
- Every important derived artifact should be traceable to source data or a model run
- Provenance fields are required for imported stats and generated content
- Publishing state and audit state must be explicit, not inferred
- Soft delete should be rare and intentional
- Use UUID primary keys unless a domain-specific natural key is clearly superior
- Store timestamps in UTC

## 1. `stats` Schema

### Key Tables

#### `stats.players`
Represents golfers and player identities.

Suggested fields:
- `id`
- `external_player_id`
- `first_name`
- `last_name`
- `full_name`
- `country_code`
- `handedness`
- `status`
- `is_active`
- `created_at`
- `updated_at`

Indexes:
- unique `external_player_id`
- index on `last_name`
- index on `is_active`

#### `stats.tournaments`
Represents tournament events.

Suggested fields:
- `id`
- `external_tournament_id`
- `name`
- `tour`
- `season`
- `start_date`
- `end_date`
- `course_id`
- `location_name`
- `status`
- `created_at`
- `updated_at`

Indexes:
- unique `external_tournament_id`
- index on `season`
- index on `start_date`

#### `stats.courses`
Represents golf courses and venue metadata.

Suggested fields:
- `id`
- `external_course_id`
- `name`
- `location_city`
- `location_region`
- `location_country`
- `par`
- `yardage`
- `surface_profile`
- `altitude`
- `created_at`
- `updated_at`

Indexes:
- unique `external_course_id`
- index on `name`

#### `stats.rounds`
Represents tournament rounds.

Suggested fields:
- `id`
- `tournament_id`
- `round_number`
- `date_played`
- `course_id`
- `conditions_json`
- `created_at`
- `updated_at`

Constraints:
- unique `(tournament_id, round_number)`

#### `stats.field_entries`
Represents player participation in an event.

Suggested fields:
- `id`
- `tournament_id`
- `player_id`
- `status`
- `tee_time`
- `withdrawn_at`
- `created_at`
- `updated_at`

Constraints:
- unique `(tournament_id, player_id)`

#### `stats.scorecards`
Represents round-level player outcomes.

Suggested fields:
- `id`
- `round_id`
- `player_id`
- `strokes`
- `score_to_par`
- `position`
- `made_cut`
- `raw_scorecard_json`
- `source_id`
- `ingested_at`

Constraints:
- unique `(round_id, player_id)`

#### `stats.strokes_gained_metrics`
Represents normalized SG metrics by player, tournament, round, or rolling window.

Suggested fields:
- `id`
- `player_id`
- `tournament_id`
- `round_id`
- `sample_type`
- `window_label`
- `sg_off_tee`
- `sg_approach`
- `sg_around_green`
- `sg_putting`
- `sg_total`
- `source_id`
- `computed_at`

Indexes:
- composite on `(player_id, computed_at desc)`
- composite on `(tournament_id, round_id)`

#### `stats.betting_markets`
Represents sportsbook or market snapshots.

Suggested fields:
- `id`
- `tournament_id`
- `provider`
- `market_type`
- `player_id`
- `line_value`
- `odds_american`
- `odds_decimal`
- `captured_at`
- `source_id`

Indexes:
- composite on `(tournament_id, market_type, captured_at desc)`
- composite on `(provider, captured_at desc)`

#### `stats.projections`
Represents player projections for a tournament or slate.

Suggested fields:
- `id`
- `model_run_id`
- `tournament_id`
- `player_id`
- `projection_type`
- `projected_score`
- `projected_finish`
- `win_probability`
- `top_5_probability`
- `top_10_probability`
- `cut_probability`
- `confidence_score`
- `created_at`

Indexes:
- composite on `(tournament_id, projection_type)`
- composite on `(player_id, created_at desc)`

#### `stats.model_runs`
Represents execution metadata for projection or analysis models.

Suggested fields:
- `id`
- `model_name`
- `model_version`
- `run_type`
- `input_snapshot_ref`
- `feature_set_version`
- `started_at`
- `completed_at`
- `status`
- `initiated_by`
- `notes`

#### `stats.model_performance`
Represents evaluation results for models.

Suggested fields:
- `id`
- `model_run_id`
- `evaluation_window`
- `metric_name`
- `metric_value`
- `baseline_value`
- `comparison_notes`
- `created_at`

### Supporting Source/Provenance Tables
Add provenance support tables early:

#### `stats.data_sources`
- `id`
- `source_name`
- `source_type`
- `provider`
- `trust_level`
- `is_primary`
- `created_at`

#### `stats.ingestion_runs`
- `id`
- `source_id`
- `started_at`
- `completed_at`
- `status`
- `records_seen`
- `records_inserted`
- `records_updated`
- `error_summary`

## 2. `content` Schema

### `content.articles`
Canonical article entity.

Suggested fields:
- `id`
- `slug_id`
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
- `seo_title`
- `seo_description`
- `canonical_url`
- `published_at`
- `scheduled_for`
- `created_at`
- `updated_at`

### `content.article_versions`
Versioned article content snapshots.

Suggested fields:
- `id`
- `article_id`
- `version_number`
- `editor_id`
- `status`
- `change_summary`
- `body_json`
- `rendered_snapshot`
- `created_at`

### `content.blocks`
Structured reusable content blocks.

Suggested fields:
- `id`
- `article_version_id`
- `block_type`
- `sort_order`
- `data_json`
- `source_requirements_json`
- `validation_status`
- `created_at`

### `content.templates`
Template definitions for repeatable article/page types.

Suggested fields:
- `id`
- `name`
- `template_type`
- `schema_json`
- `render_contract_json`
- `is_active`
- `created_at`
- `updated_at`

### `content.slugs`
Slug registry for unique URL handling.

Suggested fields:
- `id`
- `slug`
- `resource_type`
- `resource_id`
- `is_primary`
- `redirect_target_slug_id`
- `created_at`

Constraint:
- unique `slug`

### `content.tags`
- `id`
- `name`
- `slug`
- `description`

### `content.article_tags`
- `article_id`
- `tag_id`

### `content.authors`
- `id`
- `display_name`
- `bio`
- `avatar_url`
- `status`
- `created_at`
- `updated_at`

### `content.publishing_events`
Captures publishing workflow transitions.

Suggested fields:
- `id`
- `article_id`
- `version_id`
- `actor_id`
- `event_type`
- `from_status`
- `to_status`
- `notes`
- `created_at`

### `content.affiliate_placements`
Suggested fields:
- `id`
- `article_id`
- `placement_type`
- `provider`
- `tracking_code`
- `display_rules_json`
- `created_at`

## 3. `auth` Schema

### `auth.users`
- `id`
- `email`
- `password_hash` or external auth reference
- `display_name`
- `status`
- `last_login_at`
- `created_at`
- `updated_at`

### `auth.roles`
- `id`
- `name`
- `description`

### `auth.permissions`
- `id`
- `key`
- `description`

### `auth.user_roles`
- `user_id`
- `role_id`

### `auth.role_permissions`
- `role_id`
- `permission_id`

### `auth.subscriptions`
- `id`
- `user_id`
- `tier`
- `status`
- `started_at`
- `expires_at`
- `provider_customer_ref`

### `auth.entitlements`
- `id`
- `subscription_id`
- `entitlement_key`
- `is_enabled`
- `effective_at`
- `expires_at`

## 4. `audit` Schema

### `audit.ai_output_logs`
Records every material AI generation event.

Suggested fields:
- `id`
- `request_id`
- `article_id`
- `article_version_id`
- `model_name`
- `model_version`
- `prompt_ref`
- `instruction_ref`
- `input_context_ref`
- `output_text`
- `output_json`
- `grounding_status`
- `review_status`
- `created_by`
- `created_at`

### `audit.ai_source_attachments`
Maps AI outputs to cited/source records.

Suggested fields:
- `id`
- `ai_output_log_id`
- `source_type`
- `source_ref`
- `citation_label`
- `attached_at`

### `audit.editorial_review_logs`
Tracks human review of generated or sourced content.

Suggested fields:
- `id`
- `article_id`
- `article_version_id`
- `reviewer_id`
- `review_type`
- `decision`
- `notes`
- `created_at`

### `audit.model_execution_logs`
Captures model execution lifecycle details.

Suggested fields:
- `id`
- `model_run_id`
- `event_type`
- `payload_json`
- `created_at`

## Materialized Views
Initial candidates:
- `stats.mv_leaderboard_summaries`
- `stats.mv_player_form_trends`
- `stats.mv_projection_rankings`
- `stats.mv_model_performance_snapshots`

## Migration Strategy
- Use migration tooling from day one
- Create baseline schema migrations by logical schema group
- Avoid giant all-in-one migrations after the initial bootstrap
- Every schema change should include rollback planning where possible
- Seed scripts should create minimal local-dev reference data only

## Data Governance Requirements
- Every imported stat should identify source and ingestion run where practical
- Every generated analytical artifact should identify model run
- Editorial content that includes computed or AI-assisted claims must be traceable
- Deletions of audit records should be heavily restricted or forbidden

## Open Questions
- Final external provider identifiers and source mapping strategy
- Whether projections should be partitioned by season or tournament date
- Whether article block payloads remain JSONB-only or partially normalized
- Whether subscriptions live in internal auth or external billing sync tables first
