# Layout System (DS-3)

## Purpose

Define the structural layout standard for Caddy Stats app and dashboard surfaces so navigation, analytics regions, and responsive behavior are consistent across public and authenticated experiences.

## 1) Shell Structure

Required shell areas:

- **Sidebar**: persistent navigation and workspace switching
- **Header/Toolbar**: page-level context, filters, and quick actions
- **Main Content**: decision-first analytics and supporting detail
- **Context Panel**: secondary insights, notes, or status blocks
- **Footer**: low-priority links, legal, and utility actions

Implementation rules:

- Sidebar appears as primary left rail on desktop and stacks on smaller breakpoints.
- Context panel appears as a right rail on large screens and stacks below content on smaller breakpoints.
- Main content always gets highest visual priority and largest available width.

## 2) Dashboard Regions

Every analytics page should use consistent regions, ordered by decision value:

1. **Toolbar Region** — filters, date windows, segment controls
2. **Hero Metrics Region** — top-line KPIs and key status signals
3. **Chart Region** — primary trend/comparison visualizations
4. **Data Region** — tabular or detailed supporting analytics
5. **Action Region** — recommendations, exports, workflow actions

Implementation rules:

- Toolbar and Hero regions should span full dashboard width.
- Chart and Data regions should favor wider spans on desktop.
- Action region should remain visible without displacing primary evidence regions.

## 3) Responsive Grid Standards

Canonical responsive columns:

- **Desktop**: 12-column grid
- **Tablet**: 8-column grid
- **Mobile**: 4-column grid

Implementation rules:

- Mobile defaults to full-width sections unless explicitly split.
- Tablet should preserve scan order with minimal reflow.
- Desktop should place evidence-heavy regions (charts/tables) before action-side regions.

## 4) Accessibility + UX Requirements

- Use semantic landmarks (`<main>`, `<aside>`, `<section>`, `<header>`, `<footer>`).
- Ensure region headings are descriptive and unique per page.
- Preserve keyboard accessibility for all controls inside toolbar/action regions.
- Avoid horizontal scrolling for critical decisions at core breakpoints.

## 5) Frontend Mapping

DS-3 is implemented with reusable React components in:

- `/apps/web/src/components/layout/system.tsx`
- `/apps/web/src/components/layout/index.ts`

These components provide:

- `AppShell` for sidebar/main/context/footer orchestration
- `DashboardGrid` for 12/8/4 responsive grid layouts
- `DashboardRegion` and named region wrappers for dashboard composition

## Validation

- Responsive audit required for mobile/tablet/desktop breakpoints before release.
- Layout components are reusable and typed for analytics pages.
- Lab page demonstrates live DS-3 composition patterns.
