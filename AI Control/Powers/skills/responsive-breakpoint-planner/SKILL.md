---
name: responsive-breakpoint-planner
description: |
  Plans and writes responsive CSS breakpoint strategies for layouts and components:
  defines breakpoint scales, writes media queries, and adapts components across
  screen sizes. Use this skill whenever a user says "make this responsive",
  "add breakpoints to this layout", "how should I handle mobile vs desktop?",
  "write responsive media queries", "what breakpoints should I use?", "my layout
  breaks on mobile", "adapt this for tablet", or "plan a mobile-first responsive
  strategy". Also activate when someone has a desktop layout and wants to adapt it
  for smaller screens. Covers plain CSS, Tailwind, and CSS-in-JS media queries.
  Do NOT use for full-page layout generation (use css-layout-helper) or viewport
  meta tags configuration.
---

# Responsive Breakpoint Planner

Design a coherent breakpoint strategy and write responsive media queries that
make layouts adapt gracefully from mobile to ultra-wide screens.

## When to Use

- Starting a new layout and deciding on a breakpoint scale
- Adding mobile support to an existing desktop-first layout
- Converting a desktop layout to mobile-first CSS
- Writing component-level responsive adaptations

## When NOT to Use

- Full layout scaffolding from scratch (use `css-layout-helper`)
- Container queries (component-level responsiveness — note these exist and recommend when appropriate)
- Print media queries (separate concern)

---

## Workflow

### Step 1 — Understand the Responsive Needs

Ask:

1. **Current state:** Desktop-first or mobile-first? Any existing breakpoints?
2. **What changes:** Layout structure? Typography? Spacing? Component visibility?
3. **Target breakpoints:** Custom or a standard system (Tailwind, Bootstrap, Material)?
4. **Approach:** CSS custom properties / Tailwind utility classes / CSS-in-JS?

### Step 2 — Recommend a Breakpoint Scale

#### Standard Breakpoint Systems

**Tailwind CSS defaults (recommended for most projects):**

```css
/* sm  */ @media (min-width: 640px)  { ... }
/* md  */ @media (min-width: 768px)  { ... }
/* lg  */ @media (min-width: 1024px) { ... }
/* xl  */ @media (min-width: 1280px) { ... }
/* 2xl */ @media (min-width: 1536px) { ... }
```

**Minimal 3-breakpoint system (cleaner for custom projects):**

```css
/* Mobile default: 320px–599px */
/* Tablet  */ @media (min-width: 600px)  { ... }
/* Desktop */ @media (min-width: 1024px) { ... }
/* Wide    */ @media (min-width: 1400px) { ... }
```

**Define as CSS custom properties for reuse:**

```css
:root {
  --bp-sm: 640px;
  --bp-md: 768px;
  --bp-lg: 1024px;
  --bp-xl: 1280px;
}
/* Note: custom properties can't be used inside @media — use a preprocessor or tokens */
```

**Define in JavaScript for use in CSS-in-JS:**

```typescript
export const breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const;

// Usage in styled-components / Emotion:
const mq = Object.fromEntries(
  Object.entries(breakpoints).map(([key, val]) => [key, `@media (min-width: ${val})`])
);
// mq.md = '@media (min-width: 768px)'
```

### Step 3 — Apply Mobile-First Strategy

Always write mobile styles first (default), then progressively enhance:

```css
/* ✅ Mobile-first (progressive enhancement) */
.nav-links {
  display: none; /* hidden on mobile */
}
@media (min-width: 768px) {
  .nav-links {
    display: flex; /* visible on tablet+ */
    gap: 1rem;
  }
}

/* ❌ Desktop-first (regressive, harder to maintain) */
.nav-links {
  display: flex;
  gap: 1rem;
}
@media (max-width: 767px) {
  .nav-links {
    display: none;
  }
}
```

### Step 4 — Handle Common Responsive Patterns

#### Typography scaling

```css
/* Fluid typography — no breakpoints needed */
h1 {
  font-size: clamp(1.75rem, 4vw + 1rem, 3rem);
}
body {
  font-size: clamp(1rem, 0.9rem + 0.25vw, 1.125rem);
}
```

#### Spacing scaling

```css
.section {
  padding-block: clamp(2rem, 5vw, 5rem);
}
```

#### Grid column changes

```css
.grid {
  display: grid;
  grid-template-columns: 1fr; /* 1 col mobile */
  gap: 1rem;
}
@media (min-width: 640px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  } /* 2 col tablet */
}
@media (min-width: 1024px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
  } /* 3 col desktop */
}
```

#### Show/hide elements

```css
.mobile-menu-btn {
  display: block;
}
.desktop-nav {
  display: none;
}

@media (min-width: 768px) {
  .mobile-menu-btn {
    display: none;
  }
  .desktop-nav {
    display: flex;
  }
}
```

### Step 5 — Tailwind Responsive Classes

For Tailwind projects, show the utility-class approach:

```html
<!-- Stack on mobile, side-by-side on desktop -->
<div class="flex flex-col md:flex-row gap-4">
  <aside class="w-full md:w-64 shrink-0">Sidebar</aside>
  <main class="flex-1 min-w-0">Main content</main>
</div>

<!-- 1 col → 2 col → 3 col card grid -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  <!-- cards -->
</div>

<!-- Hide on mobile, show on desktop -->
<nav class="hidden lg:flex items-center gap-4">...</nav>
```

### Step 6 — Recommend Container Queries (When Appropriate)

For components that should respond to their container size (not viewport):

```css
.card-container {
  container-type: inline-size;
}

@container (min-width: 400px) {
  .card {
    flex-direction: row;
  }
}
```

---

## Output Format

1. **Breakpoint scale recommendation** — custom properties or token table
2. **Responsive CSS** — mobile-first media queries for the described layout
3. **Tailwind equivalents** — if the project uses Tailwind
4. **Fluid typography/spacing snippets** — `clamp()` values where applicable

---

## Safety & Confirmation

- Default to mobile-first unless the project is explicitly desktop-first and changing strategy.
- Flag if using `max-width` queries in a new project — this is desktop-first and harder to maintain.
- Recommend `clamp()` for font sizes and spacing before adding breakpoints — fewer media queries = less maintenance.
- Test all layouts at 320px (smallest common mobile), 375px, 768px, 1024px, and 1440px.
