---
name: dark-mode-implementer
description: |
  Adds dark mode and theme switching to existing UI codebases: defines dark-mode
  color tokens, writes CSS custom property overrides, implements a theme toggle
  component, and respects system preference. Use this skill whenever a user says
  "add dark mode to my app", "implement theme switching", "add a light/dark toggle",
  "make my app respect prefers-color-scheme", "write dark mode CSS", "implement
  a dark theme for this component", or "how do I add dark mode to my React app".
  Also activate when someone asks how to persist a user's theme preference. Works
  with plain CSS, Tailwind CSS, and React. Do NOT use for generating the color
  palette itself (use color-palette-generator first) or for generating full design
  system tokens.
---

# Dark Mode Implementer

Add dark mode and a theme toggle to any web app with CSS custom properties,
system-preference detection, user-preference persistence, and zero flash.

## When to Use

- Adding dark mode support to an existing app
- Implementing a theme switcher with localStorage persistence
- Making a UI respect the OS `prefers-color-scheme` setting
- Converting hard-coded color values to theming tokens

## When NOT to Use

- Generating the color palette from scratch (use `color-palette-generator` first)
- Designing full design system token architecture (separate scope)
- Adding dark mode to a native mobile app (iOS/Android)

---

## Workflow

### Step 1 — Audit Existing Colors

Before implementing dark mode, map all hard-coded colors in the codebase:

```bash
# Find hard-coded colors in CSS/SCSS
grep -r '#[0-9a-fA-F]\{3,8\}\|rgb\|rgba' src/ --include="*.css" --include="*.scss"

# Find colors in Tailwind classes
grep -r 'bg-\|text-\|border-' src/ --include="*.tsx" --include="*.html"
```

Group them into:

- **Surface colors** (backgrounds, cards)
- **Text colors** (primary, secondary, muted)
- **Border colors**
- **Brand/accent colors**
- **Status colors** (success, warning, error)

### Step 2 — Define Color Tokens

Replace hard-coded values with CSS custom properties:

```css
/* colors.css */

/* ── Light Mode (default) ── */
:root {
  --color-bg-page: #ffffff;
  --color-bg-surface: #f9fafb;
  --color-bg-elevated: #ffffff;

  --color-text-primary: #111827;
  --color-text-secondary: #4b5563;
  --color-text-muted: #9ca3af;
  --color-text-disabled: #d1d5db;

  --color-border: #e5e7eb;
  --color-border-strong: #d1d5db;

  --color-brand: #2563eb;
  --color-brand-hover: #1d4ed8;
  --color-brand-subtle: #eff6ff;

  --color-success: #16a34a;
  --color-warning: #d97706;
  --color-error: #dc2626;
}

/* ── Dark Mode ── */
[data-theme="dark"],
.dark {
  --color-bg-page: #0f172a;
  --color-bg-surface: #1e293b;
  --color-bg-elevated: #334155;

  --color-text-primary: #f1f5f9;
  --color-text-secondary: #cbd5e1;
  --color-text-muted: #94a3b8;
  --color-text-disabled: #475569;

  --color-border: #334155;
  --color-border-strong: #475569;

  --color-brand: #60a5fa;
  --color-brand-hover: #93c5fd;
  --color-brand-subtle: #1e3a8a;

  --color-success: #4ade80;
  --color-warning: #fbbf24;
  --color-error: #f87171;
}
```

### Step 3 — Detect and Respect System Preference

```css
/* Automatically respond to OS preference (no JS needed) */
@media (prefers-color-scheme: dark) {
  :root {
    /* same values as [data-theme="dark"] above */
    --color-bg-page: #0f172a;
    /* ... etc */
  }
}
```

### Step 4 — Implement the Theme Toggle (React)

```tsx
// hooks/useTheme.ts
import { useState, useEffect } from "react";

type Theme = "light" | "dark" | "system";

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === "undefined") return "system";
    return (localStorage.getItem("theme") as Theme) ?? "system";
  });

  useEffect(() => {
    const root = document.documentElement;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (theme === "dark" || (theme === "system" && prefersDark)) {
      root.setAttribute("data-theme", "dark");
      root.classList.add("dark");
    } else {
      root.removeAttribute("data-theme");
      root.classList.remove("dark");
    }
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    localStorage.setItem("theme", newTheme);
    setThemeState(newTheme);
  };

  return { theme, setTheme };
}
```

```tsx
// components/ThemeToggle.tsx
import { useTheme } from "../hooks/useTheme";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className="rounded-md p-2 hover:bg-[var(--color-bg-surface)]"
    >
      {theme === "dark" ? "☀️" : "🌙"}
    </button>
  );
}
```

### Step 5 — Prevent Flash of Unstyled Content (FOUC)

Add an inline script to `<head>` to apply the theme before paint:

```html
<!-- In <head>, before any CSS loads -->
<script>
  (function () {
    var theme = localStorage.getItem("theme") || "system";
    var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (theme === "dark" || (theme === "system" && prefersDark)) {
      document.documentElement.setAttribute("data-theme", "dark");
      document.documentElement.classList.add("dark");
    }
  })();
</script>
```

**Next.js:** Add this to `_document.tsx` or `app/layout.tsx`.

### Step 6 — Tailwind Dark Mode Configuration

```javascript
// tailwind.config.js
module.exports = {
  darkMode: "class", // Use .dark class strategy
  // OR: darkMode: ['class', '[data-theme="dark"]']
};
```

```html
<!-- Tailwind dark mode classes -->
<div class="bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100">
  <p class="text-gray-500 dark:text-gray-400">Secondary text</p>
</div>
```

---

## Output Format

1. **CSS token file** — light + dark mode custom properties
2. **`useTheme` hook** — with localStorage persistence
3. **ThemeToggle component** — accessible button
4. **FOUC prevention script** — for SSR/Next.js
5. **Tailwind config update** — if applicable

---

## Safety & Confirmation

- Always include a FOUC prevention script for SSR apps — a flash to the wrong theme is jarring.
- Don't store theme preference as a cookie (SSR needs it) unless you've handled server-side rendering of the attribute.
- Always check that dark mode colors still pass WCAG contrast — darkening backgrounds without adjusting text can break contrast.
- Respect `prefers-color-scheme` as the default before any user preference is set.
