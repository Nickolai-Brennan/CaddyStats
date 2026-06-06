# DS-16 Accessibility Standards

## Purpose

Define the WCAG 2.1 AA accessibility requirements, audit criteria, and implementation patterns for all Caddy Stats UI components and public pages.

## Conformance Target

**WCAG 2.1 Level AA** across all interactive components, public pages, and editorial content.

---

## Core Requirements by Category

### 1. Semantic HTML

- Use semantic elements: `<button>`, `<nav>`, `<main>`, `<aside>`, `<article>`, `<section>`, `<header>`, `<footer>`, `<table>`, `<form>`, `<fieldset>`, `<legend>`
- Never use `<div>` or `<span>` as interactive elements without `role` and keyboard handlers
- Headings must follow a logical hierarchy (`h1` → `h2` → `h3`) without skipping levels
- Lists must use `<ul>`, `<ol>`, or `<dl>` for genuine list content

### 2. Keyboard Navigation

Every interactive element must be:

- Reachable by `Tab` / `Shift+Tab`
- Activatable by `Enter` (links, buttons) or `Space` (buttons, checkboxes, toggle)
- Dismissable by `Escape` (modals, drawers, dropdowns)
- Navigable by arrow keys inside composite widgets (tabs, menus, listboxes)

Focus order must match visual / DOM order.

### 3. Focus Indicators

- All interactive elements must display a visible focus ring
- Minimum contrast ratio for focus indicator: **3:1** against adjacent colors
- Use `focus-visible:ring-2 focus-visible:ring-amber-500` as the canonical Tailwind focus ring
- Never suppress `outline: none` without providing an equivalent custom indicator

### 4. Color and Contrast

| Context                            | Minimum ratio  |
| ---------------------------------- | -------------- |
| Normal text (< 18pt)               | 4.5:1          |
| Large text (≥ 18pt or bold ≥ 14pt) | 3:1            |
| UI components (borders, icons)     | 3:1            |
| Non-text decorative                | no requirement |

- Never convey information by color alone (pair with icon, text, or pattern)
- Provide dark-mode compliant tokens for all semantic color roles

### 5. Text Alternatives

- All meaningful images: `alt` attribute with descriptive text
- Decorative images: `alt=""` and `aria-hidden="true"`
- SVG icons: `aria-hidden="true"` on decorative; `role="img"` + `aria-label` on informational
- Charts/graphs: `role="img"` + `aria-label` or `<title>` describing the data story

### 6. ARIA

Use ARIA only when HTML semantics are insufficient.

Required patterns:

| Widget                | Required ARIA                                                                             |
| --------------------- | ----------------------------------------------------------------------------------------- |
| Modal                 | `role="dialog"`, `aria-modal="true"`, `aria-labelledby`                                   |
| Combobox/Autocomplete | `role="combobox"`, `aria-expanded`, `aria-autocomplete`, `aria-haspopup`, `aria-controls` |
| Tabs                  | `role="tablist"`, `role="tab"`, `role="tabpanel"`, `aria-selected`, `aria-controls`       |
| Tooltip               | `role="tooltip"`, `aria-describedby` on trigger                                           |
| Alert/Banner          | `role="alert"` or `role="status"` for live regions                                        |
| Table                 | `<caption>` or `aria-label` on `<table>`                                                  |
| Accordion             | `aria-expanded`, `aria-controls`                                                          |

### 7. Forms

- All inputs must have an associated `<label>` (via `for`/`id` or `aria-label` / `aria-labelledby`)
- Required fields: `aria-required="true"` or `required`
- Validation errors: `aria-invalid="true"`, `aria-describedby` pointing to error message
- Error messages must be visible and programmatically associated

### 8. Motion and Animation

- Respect `prefers-reduced-motion` — suppress or reduce animations when set
- No content that flashes more than 3 times per second (seizure risk)
- Provide pause/stop controls for auto-playing content

### 9. Charts and Data Visualizations

- All chart `<figure>` elements must have a `<figcaption>` or `aria-label`
- SVG charts: `role="img"` + `aria-label` describing the key data insight
- Provide tabular alternative for data-critical charts where feasible
- Tooltip content must be keyboard-accessible (not pointer-only)

---

## Component Acceptance Criteria

### Button

- [ ] Has visible focus ring
- [ ] Activatable by `Enter` and `Space`
- [ ] `aria-disabled` or `disabled` attribute when inactive
- [ ] Loading state communicates via `aria-busy` or visible label

### Modal / Drawer

- [ ] Focus trapped inside while open
- [ ] `Escape` closes
- [ ] Focus returns to trigger on close
- [ ] `aria-modal="true"` and `role="dialog"`
- [ ] `aria-labelledby` references title

### SearchInput / PredictiveSearch

- [ ] Input labeled (visually or via `aria-label`)
- [ ] Clear button labeled with `aria-label="Clear search"`
- [ ] Dropdown: `role="listbox"` / `role="option"`, `aria-selected`
- [ ] Arrow key navigation within dropdown
- [ ] `Escape` collapses dropdown

### Tabs

- [ ] `role="tablist"`, `role="tab"`, `role="tabpanel"`
- [ ] Arrow key navigation between tabs
- [ ] `aria-selected` on active tab

### Table

- [ ] `<caption>` or `aria-label`
- [ ] Column headers: `<th scope="col">`
- [ ] Row headers (where applicable): `<th scope="row">`
- [ ] Sort controls: `aria-sort` attribute on header

### Charts (SVG)

- [ ] `role="img"` on `<svg>`
- [ ] `aria-label` describing the chart
- [ ] Interactive tooltips keyboard-accessible

---

## Audit Process

### Automated (run in CI / Storybook a11y addon)

Tool: `@storybook/addon-a11y` (axe-core engine)

- Run against all Storybook stories
- Zero critical/serious violations required before merge

### Manual Audit Checklist (per release cycle)

- [ ] Keyboard-only navigation through all primary flows
- [ ] Screen reader test: VoiceOver (macOS) or NVDA (Windows)
- [ ] Color contrast verified with browser DevTools or axe
- [ ] Focus order matches visual layout
- [ ] Reduced motion tested (`prefers-reduced-motion: reduce` in browser)
- [ ] Form error association verified
- [ ] Modal focus trap verified

### High-Traffic Pages Priority

1. Homepage / Tournament landing
2. Player profile pages
3. Projection dashboard
4. Betting research tools
5. Editorial articles

---

## References

- [WCAG 2.1 Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
- [axe-core Rules](https://dequeuniversity.com/rules/axe/4.7)
