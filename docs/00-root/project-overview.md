# Caddy Stats — Project Overview

Version: 1.0
Status: Active
Parent Brand: Strik3Zone
Last Updated: 2026-05-12

---

## 1. What Caddy Stats Is

Caddy Stats is a full-stack golf analytics and betting intelligence platform focused on PGA data, projections, editorial publishing, and premium research experiences.

It is built as a data-first system where product claims, projections, and editorial outputs are grounded in structured data and auditable logic.

---

## 2. Core Product Pillars

1. **Stats Infrastructure**
   Structured golf data ingestion, storage, and query layers.
2. **Projection Intelligence**
   Transparent model outputs with performance tracking.
3. **Editorial + SEO System**
   Scalable content workflows tied to real data and search strategy.
4. **Research Tools**
   Tournament, course, player, and market analysis experiences.
5. **Monetization Layer**
   Subscription value tiers, affiliate surfaces, and retention mechanics.

---

## 3. Platform Scope

### Included

- Golf player/tournament/course analytics
- Betting and fantasy support tooling
- Public content and premium subscriber dashboards
- Admin/editor workflows for publishing and review
- API services (REST + selective GraphQL)
- AI-assisted content and analysis with grounding controls

### Excluded (Current Scope)

- Generic multi-sport expansion
- Unverified betting recommendation automation
- Narrative-only content not supported by data

---

## 4. Architecture Snapshot

- **Frontend:** React + Vite + TypeScript + Tailwind
- **Backend:** FastAPI + Strawberry GraphQL + Pydantic
- **Database:** PostgreSQL with `content` and `stats` schema boundaries
- **Infra:** Docker + GitHub Actions + managed hosting
- **AI Layer:** Prompting, grounding, review, and logging controls

See:

- `docs/planning/build-system.md`
- `docs/architecture/decisions/`
- `docs/caddy-stats-building-plan.md`

---

## 5. Delivery Principle

Work proceeds in strict build-order sequence:

Documentation → Folder Setup → Database → Backend → Frontend → Editor → Templates → SEO → AI → Hosting → Admin → Integrations → Scale → Business

No phase should skip required dependencies from earlier phases unless a documented exception is approved.

---

## 6. Success Conditions

Caddy Stats succeeds when it consistently delivers:

- trustworthy data-backed golf intelligence
- repeatable subscriber value
- scalable SEO growth
- explainable model outputs
- secure and maintainable production operations
