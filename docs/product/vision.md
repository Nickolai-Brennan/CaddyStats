# Caddy Stats Product Vision

## Purpose

Caddy Stats exists to turn fragmented golf research into a trusted, auditable, and monetizable platform for golf analytics, betting intelligence, and editorial publishing under Strik3Zone.

This document defines the product before implementation so later work can map cleanly to documents, folders, database objects, API endpoints, UI components, and deployment steps.

## Problem Statement

Golf bettors, fantasy players, analysts, and golf media readers currently piece together decisions from disconnected sources such as sportsbook apps, stat vendors, spreadsheets, social media threads, and generic betting blogs.

The result is a poor product experience:

- research is fragmented
- projections are often opaque
- editorial content is not consistently grounded in data
- premium value is hard to differentiate
- internal publishing workflows are slow and hard to audit

Caddy Stats solves this by combining verified golf statistics, projections, explainable betting research, SEO publishing, and role-aware internal tooling in one platform.

## Target Audience and Personas

### 1. Public Golf Reader

- arrives through search, social, or referrals
- wants readable tournament, player, and course content
- values trustworthy analysis without needing a paid account first

### 2. Member

- creates a free account for saved preferences, newsletter access, and limited research features
- wants a path from public content to deeper tools without immediate payment friction

### 3. Subscriber

- pays for premium projections, betting dashboards, deeper filters, and member-only research
- expects differentiated data, explainable methodology, and consistent weekly utility

### 4. Analyst

- internal or partner user focused on model review, projection QA, trend analysis, and reporting
- needs access to source data lineage, model outputs, and performance comparisons

### 5. Editor

- produces and reviews articles, templates, metadata, and publishing workflows
- needs structured content blocks, stat inserts, AI-assisted drafting, and approval history

### 6. Admin

- manages users, permissions, subscriptions, provider health, audit trails, and operational controls
- needs secure internal tools with full accountability

## Value Proposition

Caddy Stats offers:

- **one research surface** for golf stats, betting intelligence, and content
- **verified stat grounding** so claims can be traced to sources or derived logic
- **explainable premium tools** instead of black-box rankings
- **editorial speed with controls** through structured content and AI-assisted workflows
- **SEO-scalable publishing** backed by real data, not filler pages
- **operational auditability** across content, subscriptions, AI usage, and admin actions

## Product Principles

1. **Data first** — product claims must originate from verified source data or explicit derived logic.
2. **Explainability over hype** — projections and recommendations should be understandable and reviewable.
3. **Separation of concerns** — stats, content, auth, subscriptions, and audit systems must stay logically distinct.
4. **Editorial structure over free-form chaos** — content should be reusable, reviewable, and SEO-ready.
5. **Premium value must be real** — paid features should provide differentiated decision utility, not gated basics.
6. **Security and governance are product features** — auth, RBAC, audit logs, and redaction are core requirements.
7. **Implementation must map to platform objects** — every major capability should map to a document, folder, database object, API endpoint, UI component, or deployment step.

## Scope

### In Scope

- public SEO pages for players, tournaments, courses, articles, and rankings
- member and subscriber experiences
- React/Vite frontend experiences and internal dashboards
- FastAPI APIs for stats, content, auth, admin, and operational workflows
- PostgreSQL-backed stats, content, auth, subscription, and audit data
- projections, model-performance views, and betting research tools
- editorial CMS and template workflows
- AI-assisted editorial workflows with grounding and audit controls
- provider integrations for golf/stat and odds data

### Non-Goals

- native mobile applications in the initial platform definition
- automated sportsbook bet placement
- unsupported real-time claims when source data is delayed or unavailable
- community/social-network features as a foundation requirement
- multi-sport expansion before golf workflows are stable
- using AI to invent stats, odds, injuries, field changes, or confidence claims

## Success Measures

### Product Outcomes

- users can move from public discovery to member signup to subscription in a coherent funnel
- editors can publish grounded content faster without losing review visibility
- analysts can trace model outputs to source data, model version, and review status

### Business Outcomes

- organic traffic growth on public pages
- subscriber conversion from high-intent research journeys
- recurring weekly usage from premium users
- affiliate and subscription revenue tied to differentiated product value

### Platform Outcomes

- every major feature maps to a defined system boundary
- premium and internal access is enforced server-side
- AI-assisted outputs remain reviewable and attributable
- verified data is the source of truth for public and premium claims

## Working Assumptions

- golf statistics and odds data will come from external providers and must be normalized before use
- public content can be broadly accessible, but premium projections and advanced tools require entitlement checks
- internal analyst, editor, and admin workflows will be delivered as first-class platform capabilities rather than ad hoc scripts
- the platform will prioritize PGA-focused workflows before broader expansion
