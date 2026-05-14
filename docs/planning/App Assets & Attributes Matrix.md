Caddy Stats — App Assets & Attributes Matrix

Source Reference: fileciteturn1file0

Overview

This document defines the primary application assets for Caddy Stats as product-facing modules. Each asset maps to a buildable system: database objects, backend services, admin workflows, frontend components, AI layers, SEO functions, or monetization hooks.

---

1. Content Blogs

Purpose

The blog system is the editorial foundation for organic traffic, golf betting analysis, fantasy golf content, tournament previews, player breakdowns, model explanations, and affiliate-driven content.

Core Attributes

SEO-first content publishing

Structured content blocks

Author and editor workflows

Player, tournament, course, and betting-market tagging

Internal linking support

AI-assisted drafting with stats grounding

Featured image and social preview support

Scheduled publishing

Draft, review, published, archived states

Revision history

Database Objects

content.posts

content.post_blocks

content.authors

content.categories

content.tags

content.post_tags

content.post_revisions

content.seo_metadata

Backend/API Assets

POST /admin/posts

PATCH /admin/posts/{id}

GET /posts/{slug}

GET /posts

POST /admin/posts/{id}/publish

GraphQL type: Post

GraphQL type: PostBlock

Frontend Components

BlogIndexPage

BlogPostPage

FeaturedPostCard

ArticleContentRenderer

RelatedArticlesRail

AuthorBioCard

Monetization Hooks

Affiliate CTA blocks

Premium content gates

Newsletter capture

Internal links to projections dashboards

Sportsbook comparison modules

---

2. Custom Data Models

Purpose

Custom data models power golf projections, betting intelligence, fantasy plays, player rankings, course-fit scores, and article-grounded analysis.

Core Attributes

Player projection models

Fantasy scoring models

Betting edge models

Course-fit modeling

Form and trend modeling

Simulation-ready metrics

Confidence scoring

Model versioning

Transparent calculation outputs

AI-readable model summaries

Database Objects

stats.model_definitions

stats.model_versions

stats.player_model_scores

stats.tournament_model_scores

stats.course_fit_scores

stats.fantasy_projection_scores

stats.betting_edge_scores

stats.model_run_logs

Backend/API Assets

POST /admin/models/run

GET /models/{model_key}/latest

GET /players/{id}/model-scores

GET /tournaments/{id}/projections

GraphQL type: ModelDefinition

GraphQL type: PlayerProjection

Frontend Components

ModelScoreCard

PlayerProjectionTable

ModelVersionBadge

ConfidenceScoreIndicator

ProjectionExplainerPanel

AI/RAG Integration

Model outputs become retrieval context

AI responses must cite model version

Calculated values separated from generated narrative

Prompt layer receives only validated model data

Monetization Hooks

Premium model access

Advanced projection filters

Fantasy optimizer upgrades

Betting edge dashboards

---

3. Data Stats Tables & Dashboards

Purpose

Stats tables and dashboards turn raw golf data into usable analytics for bettors, fantasy players, editors, and premium subscribers.

Core Attributes

Sortable stats tables

Filterable player views

Tournament dashboards

Course analytics dashboards

Betting market comparison tables

Fantasy value dashboards

Historical trend visualizations

Materialized-view-backed performance

Export-ready premium data

Mobile-first table layouts

Database Objects

stats.players

stats.tournaments

stats.courses

stats.round_stats

stats.player_event_stats

stats.odds_snapshots

stats.fantasy_salaries

stats.mv_player_recent_form

stats.mv_tournament_projections

stats.mv_betting_edges

Backend/API Assets

GET /stats/players

GET /stats/player/{id}

GET /stats/tournaments/{id}

GET /stats/dashboards/recent-form

GET /stats/dashboards/betting-edges

GET /stats/dashboards/fantasy-values

Frontend Components

StatsDashboardPage

PlayerStatsTable

TournamentDashboard

RecentFormTable

BettingEdgesTable

FantasyValueTable

CourseFitDashboard

MetricTrendChart

Performance Requirements

Cached dashboard endpoints under 100ms target

Indexed high-read stat columns

Materialized views for projection-heavy queries

TanStack Table virtualization for large datasets

Monetization Hooks

Free limited stat views

Premium advanced filters

Premium downloadable data

Subscriber-only betting/fantasy dashboards

---

4. Backend Admin

Purpose

The backend admin is the control center for content operations, data model management, SEO workflows, user management, and monetization controls.

Core Attributes

Role-based admin access

Content management

Template management

SEO controls

Model run controls

Dashboard publishing controls

AI assistance controls

User/subscription management

Audit logging

Editorial workflow states

Database Objects

content.admin_users

content.roles

content.permissions

content.audit_logs

content.editor_templates

content.content_workflows

content.seo_checks

content.metric_snapshots

Backend/API Assets

POST /admin/login

GET /admin/me

GET /admin/dashboard

GET /admin/audit-logs

POST /admin/templates

POST /admin/seo/check

POST /admin/metrics/snapshot

Frontend Components

AdminShell

AdminDashboard

AdminSidebar

ContentManager

ModelRunPanel

SEOAuditPanel

MetricsOverviewPanel

UserRoleManager

---

4A. Content Post Templates & Text Editor

Purpose

Templates and the editor system allow repeatable, structured, SEO-ready article production for golf betting, fantasy previews, player profiles, and tournament analysis.

Core Attributes

Block-based editor

Reusable post templates

Markdown/rich-text support

AI-assisted block generation

Stats injection blocks

Affiliate CTA blocks

Table/embed blocks

Social embed blocks

SEO preview panel

Revision control

Template Types

Tournament Preview

Betting Picks Article

Fantasy Golf Picks

Player Breakdown

Course Preview

Odds Movement Report

Model Results Explainer

Weekly Recap

Database Objects

content.editor_templates

content.template_blocks

content.post_blocks

content.editor_assets

Frontend Components

PostEditorPage

BlockEditor

TemplateSelector

StatsInjectionBlock

AffiliateCTABlock

SocialEmbedBlock

SEOPreviewPanel

RevisionHistoryDrawer

Monetization Hooks

Faster content production

Affiliate block standardization

Premium article templates

AI-assisted editorial scale

---

4B. SEO & Metric Tools

Purpose

SEO and metric tools help Caddy Stats grow organic traffic, measure content performance, and identify opportunities for monetizable content.

Core Attributes

SEO scoring

Metadata validation

Internal link suggestions

Keyword targeting

Schema markup generation

Performance metrics

Article traffic tracking

Conversion tracking

Affiliate click tracking

Content decay monitoring

Database Objects

content.seo_metadata

content.seo_checks

content.keyword_targets

content.internal_link_suggestions

content.content_metrics

content.affiliate_clicks

content.conversion_events

Backend/API Assets

POST /admin/seo/analyze

GET /admin/seo/posts/{id}

GET /admin/metrics/content

GET /admin/metrics/affiliate-clicks

GET /admin/metrics/conversions

Frontend Components

SEOScorePanel

MetadataEditor

KeywordTargetPanel

InternalLinkSuggestions

ContentPerformanceDashboard

AffiliateMetricsTable

Monetization Hooks

Affiliate click optimization

Higher organic traffic capture

Content refresh prioritization

Premium landing page optimization

---

5. Embedded Social Media Platforms

Purpose

Social embeds increase content richness, support real-time golf discourse, and connect Caddy Stats editorial content with external audience channels.

Core Attributes

X/Twitter embeds

YouTube embeds

Instagram embeds

TikTok embeds

Podcast embeds

Safe embed sanitization

Lazy loading

Mobile-responsive embeds

Editorial approval controls

Social proof integration

Database Objects

content.social_embeds

content.embed_providers

content.post_embeds

Backend/API Assets

POST /admin/embeds/validate

POST /admin/posts/{id}/embeds

GET /embeds/{id}

Frontend Components

SocialEmbedBlock

TwitterEmbedRenderer

YouTubeEmbedRenderer

InstagramEmbedRenderer

TikTokEmbedRenderer

EmbedFallbackCard

Security Requirements

Sanitize all embed HTML

Provider allowlist only

No arbitrary script execution

Lazy-load third-party embeds

Monetization Hooks

Increased time on page

Social distribution flywheel

Creator partnership support

Newsletter conversion support

---

6. Tag WordCloud

Purpose

The tag word cloud creates a visual discovery layer for topics, players, tournaments, metrics, and betting concepts across the platform.

Core Attributes

Dynamic tag frequency weighting

Player/topic discovery

SEO-supportive internal linking

Interactive filtering

Content cluster visibility

Editorial taxonomy insights

Mobile-friendly rendering

Admin-managed tag controls

Database Objects

content.tags

content.post_tags

content.tag_metrics

content.tag_aliases

Backend/API Assets

GET /tags/cloud

GET /tags/{slug}

GET /admin/tags/metrics

PATCH /admin/tags/{id}

Frontend Components

TagWordCloud

TagLandingPage

TagFilterBar

TrendingTagsPanel

AdminTagManager

SEO Attributes

Tag landing pages

Canonical controls

Internal link distribution

Topic cluster reinforcement

Search crawl depth improvement

Monetization Hooks

Topic-based funneling

Player-specific affiliate content

Premium dashboard deep links

Trend-based article planning

---

7. AI LLM RAG Chatbot

Purpose

The AI chatbot provides grounded golf betting and fantasy golf intelligence using Caddy Stats content, projections, player statistics, betting edges, and editorial context.

Core Use Cases

Project golf betting plays

Identify fantasy golf values

Explain player model rankings

Compare golfers by course fit

Summarize tournament outlooks

Answer content-based questions

Surface relevant posts and dashboards

Assist editors inside the admin panel

Core Attributes

Retrieval-augmented generation

Stats-grounded responses

Projection model awareness

Fantasy and betting context

Source citation support

User role-aware responses

Premium data access controls

Conversation logging

Prompt injection defense

Hallucination safeguards

Database Objects

ai.knowledge_documents

ai.embeddings

ai.chat_sessions

ai.chat_messages

ai.retrieval_logs

ai.prompt_templates

ai.guardrail_logs

stats.model_run_logs

stats.player_model_scores

stats.betting_edge_scores

Backend/API Assets

POST /ai/chat

GET /ai/chat/sessions

GET /ai/chat/sessions/{id}

POST /admin/ai/reindex

GET /admin/ai/retrieval-logs

Frontend Components

RAGChatbot

ChatMessageList

SourceCitationCard

ProjectionAnswerCard

FantasyPlayRecommendationCard

BettingEdgeAnswerCard

AdminAIPromptManager

RAG Sources

Published blog posts

Player stat tables

Tournament dashboards

Projection model outputs

Betting edge scores

Fantasy salary/value tables

Course-fit models

Internal editorial notes, admin-only

Guardrails

Never invent player statistics

Never invent odds

Never create unsupported betting claims

Always separate computed values from generated interpretation

Cite retrieved content or model source

Respect premium/free user access levels

Log retrieval context and model version

Monetization Hooks

Free limited chatbot usage

Premium projection explanations

Subscriber-only betting/fantasy recommendations

Affiliate sportsbook CTA integration

Personalized premium dashboards

---

8. Strategic App Asset Map

App Asset Primary Value Revenue Link

Content Blogs Organic acquisition Affiliate + newsletter + premium funnels
Custom Data Models Proprietary differentiation Premium subscriptions
Stats Tables & Dashboards User retention and utility Premium analytics tiers
Backend Admin Operational control Editorial and monetization scale
Templates & Text Editor Content production speed SEO + affiliate scale
SEO & Metric Tools Traffic growth Conversion optimization
Embedded Social Platforms Engagement and distribution Audience growth
Tag WordCloud Discovery and internal linking Topic-based funnels
AI RAG Chatbot Personalized intelligence Premium AI subscriptions

---

9. Build Priority Recommendation

Phase 1 — Core Publishing Foundation

1. Content Blogs

2. Backend Admin

3. Content Templates & Text Editor

4. SEO Metadata Tools

Phase 2 — Data Product Foundation

1. Data Stats Tables

2. Custom Data Models

3. Tournament Dashboards

4. Player Projection Tables

Phase 3 — Growth & Discovery

1. Tag WordCloud

2. Embedded Social Media Blocks

3. Content Metrics Dashboard

4. Internal Linking Tools

Phase 4 — AI Intelligence Layer

1. Knowledge indexing

2. RAG chatbot

3. Projection answer cards

4. Fantasy/betting recommendation flows

5. Premium AI access controls

---

10. Validation Checklist

Product

[ ] Every app asset maps to user value

[ ] Every asset has a monetization path

[ ] Free vs premium access levels are defined

Engineering

[ ] Each asset maps to database objects

[ ] Each asset maps to backend endpoints

[ ] Each asset maps to frontend components

[ ] Security requirements are documented

Data Integrity

[ ] Stats are never generated without source data

[ ] AI answers cite retrieved context

[ ] Model versions are logged

[ ] Betting and fantasy outputs are traceable

SEO

[ ] Blogs support metadata and schema

[ ] Tags generate crawlable landing pages

[ ] Internal linking is supported

[ ] Performance targets remain protected

Monetization

[ ] Premium dashboards are gated

[ ] AI chatbot has free/premium limits

[ ] Affiliate CTAs are trackable

[ ] Content metrics inform revenue decisions

---

Summary

Caddy Stats should be treated as an application composed of nine core product assets: content blogs, custom data models, stats dashboards, backend admin, editorial templates, SEO tools, social embeds, tag discovery, and a RAG-powered AI chatbot.

Together, these assets create a full-stack golf analytics platform with editorial reach, proprietary data value, premium subscription potential, affiliate monetization, and AI-powered betting/fantasy intelligence.
