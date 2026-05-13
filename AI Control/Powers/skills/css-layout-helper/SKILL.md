---
name: css-layout-helper
description: |
  Creates CSS and Tailwind layout solutions for described UI patterns: grids, flex
  containers, sidebar layouts, card grids, sticky headers, centered content, and
  full-bleed sections. Use this skill whenever a user says "create a CSS layout for",
  "help me center this", "write CSS for a sidebar layout", "make a responsive grid",
  "how do I do a sticky header with scrollable content", "layout this page with CSS",
  "write Tailwind classes for this layout", or "fix my flexbox/grid layout".
  Also activate when someone shares a layout description or rough wireframe sketch.
  Supports plain CSS, CSS Grid, Flexbox, and Tailwind CSS v3/v4. Do NOT use for
  component-level styling (use react-component-generator) or animation (use
  animation-snippet-writer).
---

# CSS Layout Helper

Build robust, responsive CSS layouts from descriptions — grids, flex containers,
sticky elements, and full-page structures with clean, commented code.

## When to Use

- Implementing a page layout from a design or description
- Fixing a broken flexbox or grid that isn't behaving as expected
- Building a responsive layout that adapts across screen sizes
- Creating reusable layout primitives (container, stack, sidebar)

## When NOT to Use

- Component-level styling (colors, typography, spacing inside a component)
- Animation and transitions (use `animation-snippet-writer`)
- CSS-in-JS or Styled Components patterns (different approach)

---

## Workflow

### Step 1 — Understand the Layout

Ask the user to describe:

1. **Layout type:** Page layout / section / component layout
2. **Structure:** What elements are present? (header, sidebar, main, footer, etc.)
3. **Responsive behavior:** How does it change at mobile / tablet / desktop?
4. **Sticky/fixed elements:** Anything that stays on screen while scrolling?
5. **CSS approach:** Plain CSS / Tailwind / CSS Modules

### Step 2 — Match to a Layout Pattern

Identify the appropriate CSS strategy:

| Layout need                      | Best approach                                   |
| -------------------------------- | ----------------------------------------------- |
| Side-by-side two columns         | Flexbox or Grid                                 |
| Complex multi-area page          | CSS Grid with named areas                       |
| Sticky sidebar + scrollable main | Grid with `position: sticky`                    |
| Centered content with max-width  | Container utility                               |
| Card grid (auto-fill)            | `grid-template-columns: repeat(auto-fill, ...)` |
| Equal-height columns             | Flexbox `align-items: stretch`                  |
| Stack (vertical spacing)         | Flexbox column with `gap`                       |
| Holy grail layout                | CSS Grid 3-column + header/footer               |

### Step 3 — Generate the Layout Code

#### Plain CSS Examples

**Sidebar + Main (sticky sidebar):**

```css
.page-layout {
  display: grid;
  grid-template-columns: 260px 1fr;
  grid-template-rows: auto 1fr;
  grid-template-areas:
    "header header"
    "sidebar main";
  min-height: 100vh;
  gap: 0;
}

.header {
  grid-area: header;
}
.sidebar {
  grid-area: sidebar;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
}
.main {
  grid-area: main;
  padding: 1.5rem;
}

@media (max-width: 768px) {
  .page-layout {
    grid-template-columns: 1fr;
    grid-template-areas:
      "header"
      "main";
  }
  .sidebar {
    display: none;
  } /* or slide-over — see below */
}
```

**Responsive Card Grid:**

```css
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  padding: 1.5rem;
}
```

**Centered Content Container:**

```css
.container {
  width: 100%;
  max-width: 1200px;
  margin-inline: auto;
  padding-inline: clamp(1rem, 4vw, 2rem);
}
```

**Sticky Header + Scrollable Content:**

```css
.app-shell {
  display: grid;
  grid-template-rows: auto 1fr;
  height: 100vh;
  overflow: hidden;
}

.header {
  position: sticky;
  top: 0;
  z-index: 100;
}

.content {
  overflow-y: auto;
  padding: 1rem;
}
```

#### Tailwind CSS Examples

**Sidebar + Main:**

```html
<div class="flex h-screen overflow-hidden">
  <!-- Sidebar -->
  <aside
    class="w-64 shrink-0 overflow-y-auto border-r bg-white lg:block hidden"
  >
    <!-- nav items -->
  </aside>
  <!-- Main -->
  <main class="flex-1 overflow-y-auto p-6">
    <!-- content -->
  </main>
</div>
```

**Responsive Card Grid:**

```html
<div
  class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6"
>
  <!-- cards -->
</div>
```

**Centered container with padding:**

```html
<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
  <!-- content -->
</div>
```

**Holy Grail Layout:**

```html
<div
  class="grid min-h-screen grid-rows-[auto_1fr_auto] grid-cols-[auto_1fr_auto]"
>
  <header class="col-span-3 ...">Header</header>
  <nav class="row-start-2 w-48 ...">Left Nav</nav>
  <main class="row-start-2 min-w-0 p-6">Main Content</main>
  <aside class="row-start-2 w-64 ...">Right Sidebar</aside>
  <footer class="col-span-3 ...">Footer</footer>
</div>
```

### Step 4 — Explain the Key Decisions

For each layout, explain:

- Why Grid vs. Flexbox was chosen
- How the responsive behavior is handled
- What `min-width: 0` or `min-height: 0` fixes (overflow in grid items)

### Step 5 — Call Out Common Pitfalls

- **Grid/Flex items overflowing?** Add `min-width: 0` to the child
- **Sticky not working?** Parent must not have `overflow: hidden`
- **100vh too tall on mobile?** Use `100dvh` (dynamic viewport height)
- **Cards not equal height?** Parent needs `align-items: stretch` (default in grid)

---

## Output Format

1. **Layout HTML structure** — semantic markup with classes
2. **CSS / Tailwind** — complete styles with comments
3. **Responsive variants** — mobile adjustments
4. **Key decision notes** — brief explanation of approach choices

---

## Safety & Confirmation

- Test layouts across at least 3 breakpoints (320px mobile, 768px tablet, 1280px desktop).
- Flag if `height: 100vh` is used on mobile (recommend `100dvh` or JS fallback).
- Always check that content can overflow gracefully without breaking the layout structure.
