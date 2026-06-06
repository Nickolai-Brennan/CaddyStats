# DS-22 QA + Release Checklist

## Purpose

Define the quality gates, audit steps, and release approval process for design system and frontend releases.

---

## Release Types

| Type  | Scope                                            | Approval required             |
| ----- | ------------------------------------------------ | ----------------------------- |
| Patch | Bug fix, copy change, style tweak                | Frontend Owner                |
| Minor | New component, feature addition, behavior change | Frontend Owner + Design Owner |
| Major | Breaking API change, architecture shift          | All owners + Product Owner    |

---

## Pre-Release Gate Checklist

### 1. Responsive Audit

- [ ] Mobile viewport (320px, 375px, 390px) — no overflow, truncation, or layout breaks
- [ ] Tablet viewport (768px, 1024px) — grid and card layout correct
- [ ] Desktop viewport (1280px, 1440px, 1920px) — max-width containers respected
- [ ] Charts and tables: horizontal scroll on small viewports where expected
- [ ] Navigation and sidebar: collapse/drawer behavior works correctly

### 2. Component Audit

- [ ] All new/changed components have stories in Storybook
- [ ] Storybook `autodocs` tag present on changed component stories
- [ ] No `console.error` / PropTypes warnings in Storybook
- [ ] Visual regression: no unexpected appearance changes on existing stories
- [ ] A11y addon: zero critical or serious violations across all stories

### 3. Browser Testing

- [ ] Chrome (latest)
- [ ] Safari (latest macOS + iOS)
- [ ] Firefox (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS 16+)
- [ ] Chrome Android (latest)

### 4. Performance Audit

- [ ] Lighthouse score ≥ 90 on public pages (Performance, Accessibility, Best Practices, SEO)
- [ ] Core Web Vitals: LCP < 2.5s, CLS < 0.1, INP < 200ms
- [ ] Bundle size: no regressions > 5KB gzipped without justification
- [ ] No N+1 query patterns introduced by new components
- [ ] Chart rendering performance: 50k row tables render within 200ms (virtual rows enabled)

### 5. Accessibility Testing

- [ ] Automated: `@storybook/addon-a11y` passes all stories (zero critical/serious)
- [ ] Keyboard-only navigation through new interactive components
- [ ] Screen reader spot-check (VoiceOver or NVDA) on any new interactive flows
- [ ] WCAG 2.1 AA contrast ratios verified for new color combinations
- [ ] Focus indicators visible on all new interactive elements

### 6. Typecheck + Lint

- [ ] `pnpm --filter web typecheck` passes with zero errors
- [ ] `pnpm --filter web lint` passes with zero warnings
- [ ] No `any` types introduced without documented justification

### 7. Test Suite

- [ ] `pnpm --filter web test` passes
- [ ] All new component behavior covered by relevant tests where infrastructure exists
- [ ] No existing tests removed or disabled

### 8. Documentation

- [ ] New components documented in `docs/design/` or inline JSDoc
- [ ] `docs/changelog.md` updated with changes
- [ ] Component lifecycle status updated if component transitions state

### 9. Analytics Event Audit (where applicable)

- [ ] New interactive components with tracking: events fire correctly
- [ ] No PII in event payloads
- [ ] Event naming follows established conventions

### 10. Export Validation (charts / tables)

- [ ] CSV export for data tables works correctly
- [ ] Chart export (PNG/SVG) produces readable output
- [ ] Exported data matches displayed data

---

## Final Release Gate

All of the following must be verified before a production release:

| Gate                                                            | Status |
| --------------------------------------------------------------- | ------ |
| Responsive verified (320px–1920px)                              | ☐      |
| WCAG 2.1 AA verified                                            | ☐      |
| Dark mode verified                                              | ☐      |
| Storybook coverage ≥ 95% (all exported components have stories) | ☐      |
| Lighthouse Performance ≥ 90                                     | ☐      |
| Zero lint / typecheck errors                                    | ☐      |
| All tests pass                                                  | ☐      |
| Changelog updated                                               | ☐      |
| Production approved by Frontend Owner                           | ☐      |

---

## Rollback Plan

For each release:

1. Tag the release commit in git
2. Document the rollback command in the release notes
3. Verify previous build artifact is retained in deployment platform

---

## Post-Release Monitoring

- [ ] Error rate in production monitoring (< 0.1% increase)
- [ ] Core Web Vitals in RUM data — no regression vs baseline
- [ ] Sentry / error tracker: no new error types introduced

---

## Visualization Performance Testing

For any release touching chart or table components:

- [ ] Benchmark: `BarChart` with 200 data points renders < 16ms
- [ ] Benchmark: `DataTable` with 10k rows (virtual) scrolls at 60fps
- [ ] Benchmark: `NetworkGraph` with 50 nodes renders < 32ms
- [ ] No layout thrashing from chart resize observers
