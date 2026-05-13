---
name: design-token-exporter
description: |
  Exports design system tokens (colors, spacing, typography, shadows, radii) to
  CSS custom properties, JavaScript/TypeScript constants, Figma tokens (W3C format),
  or Tailwind config extensions. Use this skill whenever a user says "export my
  design tokens", "convert these tokens to CSS variables", "generate a Tailwind
  config from my tokens", "create a JS tokens file", "write design tokens for my
  design system", "export tokens from Figma format", or "sync my design and code
  tokens". Also activate when someone wants to centralize colors, spacing, or
  typography across design and code. Do NOT use for generating the colors or
  spacing values themselves (use color-palette-generator first).
---

# Design Token Exporter

Convert design system tokens to any target format: CSS custom properties,
TypeScript constants, Tailwind config, or W3C/Figma Design Tokens JSON.

## When to Use

- Centralizing design decisions (colors, spacing, type) across design and code
- Generating multiple output formats from a single source of truth
- Syncing Figma token changes to your CSS/JS codebase
- Onboarding a new design system with a clean token foundation

## When NOT to Use

- Generating the actual color palette (use `color-palette-generator`)
- Component-level styling (tokens power the system, not individual components)
- Animation tokens (timing functions, durations — see `animation-snippet-writer`)

---

## Workflow

### Step 1 — Receive the Token Set

Accept tokens in any format:

- A table of names and values
- A Figma export (JSON)
- A description ("I have 4 grays, a blue primary, 8-step spacing scale")
- An existing CSS variables file to reformat

Ask: "Which output formats do you need? (CSS vars / TypeScript / Tailwind / W3C JSON / all)"

### Step 2 — Organize Into Token Categories

Structure tokens into these groups:

```
tokens/
├── color.tokens.json     — color primitives + semantic roles
├── spacing.tokens.json   — space scale (4px base)
├── typography.tokens.json — font sizes, weights, line heights
├── radius.tokens.json    — border radius values
├── shadow.tokens.json    — box shadow values
└── index.tokens.json     — re-exports all
```

### Step 3 — Generate CSS Custom Properties

```css
/* Generated: tokens.css — DO NOT EDIT MANUALLY */

:root {
  /* ── Colors ── */
  /* Primitives */
  --color-blue-50: #eff6ff;
  --color-blue-500: #3b82f6;
  --color-blue-600: #2563eb;
  --color-gray-50: #f9fafb;
  --color-gray-900: #111827;

  /* Semantic */
  --color-brand: var(--color-blue-600);
  --color-brand-hover: var(--color-blue-700);
  --color-text-primary: var(--color-gray-900);
  --color-surface: var(--color-gray-50);

  /* ── Spacing ── */
  --space-1: 0.25rem; /* 4px */
  --space-2: 0.5rem; /* 8px */
  --space-3: 0.75rem; /* 12px */
  --space-4: 1rem; /* 16px */
  --space-5: 1.25rem; /* 20px */
  --space-6: 1.5rem; /* 24px */
  --space-8: 2rem; /* 32px */
  --space-10: 2.5rem; /* 40px */
  --space-12: 3rem; /* 48px */
  --space-16: 4rem; /* 64px */
  --space-20: 5rem; /* 80px */
  --space-24: 6rem; /* 96px */

  /* ── Typography ── */
  --font-sans: "Inter", system-ui, -apple-system, sans-serif;
  --font-mono: "Fira Code", "Cascadia Code", monospace;

  --text-xs: 0.75rem; /* 12px */
  --text-sm: 0.875rem; /* 14px */
  --text-base: 1rem; /* 16px */
  --text-lg: 1.125rem; /* 18px */
  --text-xl: 1.25rem; /* 20px */
  --text-2xl: 1.5rem; /* 24px */
  --text-3xl: 1.875rem; /* 30px */
  --text-4xl: 2.25rem; /* 36px */

  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;

  --leading-tight: 1.25;
  --leading-normal: 1.5;
  --leading-relaxed: 1.625;

  /* ── Border Radius ── */
  --radius-sm: 0.125rem; /* 2px */
  --radius-md: 0.375rem; /* 6px */
  --radius-lg: 0.5rem; /* 8px */
  --radius-xl: 0.75rem; /* 12px */
  --radius-2xl: 1rem; /* 16px */
  --radius-full: 9999px;

  /* ── Shadows ── */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg:
    0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --shadow-xl:
    0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
}
```

### Step 4 — Generate TypeScript Constants

```typescript
// generated/tokens.ts — DO NOT EDIT MANUALLY

export const colors = {
  blue: {
    50: "#EFF6FF",
    500: "#3B82F6",
    600: "#2563EB",
  },
  gray: {
    50: "#F9FAFB",
    900: "#111827",
  },
} as const;

export const semantic = {
  brand: colors.blue[600],
  brandHover: colors.blue[700],
  textPrimary: colors.gray[900],
  surface: colors.gray[50],
} as const;

export const spacing = {
  1: "0.25rem",
  2: "0.5rem",
  4: "1rem",
  8: "2rem",
  16: "4rem",
} as const;

export const radius = {
  sm: "0.125rem",
  md: "0.375rem",
  lg: "0.5rem",
  full: "9999px",
} as const;
```

### Step 5 — Generate Tailwind Config Extension

```javascript
// tailwind.config.js extension — generated from tokens
const tokens = require("./generated/tokens");

module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: tokens.semantic.brand,
          hover: tokens.semantic.brandHover,
        },
        blue: tokens.colors.blue,
      },
      spacing: tokens.spacing,
      borderRadius: tokens.radius,
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["Fira Code", "monospace"],
      },
    },
  },
};
```

### Step 6 — Generate W3C Design Tokens (Figma/Tokens Studio)

```json
{
  "$metadata": { "tokenSetOrder": ["global", "semantic", "component"] },
  "global": {
    "color": {
      "blue": {
        "500": { "$value": "#3B82F6", "$type": "color" },
        "600": { "$value": "#2563EB", "$type": "color" }
      }
    },
    "spacing": {
      "4": { "$value": "1rem", "$type": "dimension" },
      "8": { "$value": "2rem", "$type": "dimension" }
    }
  },
  "semantic": {
    "color": {
      "brand": { "$value": "{global.color.blue.600}", "$type": "color" }
    }
  }
}
```

---

## Output Format

1. **CSS custom properties** — complete `:root` block
2. **TypeScript constants** — `as const` objects for type safety
3. **Tailwind config extension** — if applicable
4. **W3C Design Tokens JSON** — if Figma/Tokens Studio sync is needed

---

## Safety & Confirmation

- Mark all generated files with a "DO NOT EDIT MANUALLY" comment and a note about the source of truth.
- If tokens are referenced across CSS, JS, and Tailwind, establish one source of truth (recommend a JSON file + build step to generate others).
- Never duplicate semantic tokens — always reference primitives through semantic aliases.
- Confirm token naming convention with the team before generating (kebab-case vs. camelCase matters for search/replace).
