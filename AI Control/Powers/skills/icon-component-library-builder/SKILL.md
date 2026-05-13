---
name: icon-component-library-builder
description: |
  Scaffolds an SVG icon component system: a reusable Icon wrapper component,
  a typed icon name union, an icon sprite approach or inline SVG approach, and
  a usage guide. Use this skill whenever a user says "build an icon component",
  "create an icon system", "make my SVGs reusable as components", "scaffold an
  icon library in React", "convert these SVGs to components", "how do I manage
  icons in my design system?", or "create a typed icon set". Also activate when
  someone wants to standardize how icons are used across their app. Works with
  React + TypeScript, Vue 3, or plain Web Components. Do NOT use for creating
  or sourcing the actual SVG icon artwork (use an icon library like Lucide,
  Phosphor, or Heroicons as the source).
---

# Icon Component Library Builder

Scaffold a type-safe, accessible icon component system that scales from a handful
of icons to hundreds — with a single reusable wrapper component.

## When to Use

- Standardizing icon usage across a design system or app
- Migrating from ad-hoc `<img>` or raw `<svg>` icons to a typed component
- Building a custom icon set on top of Lucide, Heroicons, or custom SVGs
- Creating a self-contained icon package in a monorepo

## When NOT to Use

- Sourcing or designing the actual SVG artwork
- Animated icons (see `animation-snippet-writer` for animated SVG patterns)
- Image/raster icons (use `<img>` — not SVG components)

---

## Workflow

### Step 1 — Understand the Requirements

Ask for:

1. **Icon source:** Lucide / Heroicons / Phosphor / Custom SVG files
2. **Framework:** React + TS / Vue 3 / Web Component
3. **Approach:** Inline SVG component per icon, or single sprite sheet
4. **Scale:** How many icons? (< 50: per-file; > 50: sprite or icon font)
5. **Use case:** UI only, or also email/PDF (inline SVG is required for email)

### Step 2 — Choose the Architecture

| Approach                 | When to use                      | Pros                                                | Cons                                       |
| ------------------------ | -------------------------------- | --------------------------------------------------- | ------------------------------------------ |
| **Inline SVG per file**  | < 100 icons, React/Vue           | Tree-shakeable, colorable via CSS, no extra request | Bundle size grows with count               |
| **SVG Sprite**           | 100+ icons, performance critical | Single HTTP request, cached                         | Not tree-shakeable, needs sprite generator |
| **Icon font (Iconfont)** | Legacy or cross-platform         | Works everywhere                                    | Blurry at small sizes, one color only      |

**Recommendation for most apps:** Inline SVG per file with lazy loading.

### Step 3 — Generate the Icon Component

**React + TypeScript (Inline SVG approach):**

```typescript
// icons/types.ts
export interface IconProps {
  /** Size in pixels — also accepts CSS value like "1em" */
  size?: number | string;
  /** Stroke/fill color — defaults to "currentColor" */
  color?: string;
  /** Accessible label (use for standalone icons, omit if decorative) */
  "aria-label"?: string;
  /** Additional CSS class */
  className?: string;
  /** Stroke width for stroke-based icons */
  strokeWidth?: number;
}
```

```tsx
// icons/Icon.tsx — generic wrapper
import { forwardRef } from "react";
import type { IconProps } from "./types";

interface IconWrapperProps extends IconProps {
  children: React.ReactNode;
  viewBox?: string;
}

export const Icon = forwardRef<SVGSVGElement, IconWrapperProps>(
  (
    {
      size = 24,
      color = "currentColor",
      "aria-label": ariaLabel,
      className,
      children,
      viewBox = "0 0 24 24",
      strokeWidth = 2,
      ...props
    },
    ref,
  ) => {
    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox={viewBox}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        role={ariaLabel ? "img" : "presentation"}
        aria-label={ariaLabel}
        aria-hidden={!ariaLabel}
        className={className}
        {...props}
      >
        {children}
      </svg>
    );
  },
);
Icon.displayName = "Icon";
```

```tsx
// icons/ChevronDown.tsx — individual icon
import { Icon } from "./Icon";
import type { IconProps } from "./types";

export function ChevronDownIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M6 9l6 6 6-6" />
    </Icon>
  );
}
```

```typescript
// icons/index.ts — barrel export
export { ChevronDownIcon } from "./ChevronDown";
export { CheckIcon } from "./Check";
export { XIcon } from "./X";
export { MenuIcon } from "./Menu";
// ... all icons

// Union of all icon names for typed icon maps
export type IconName = "chevron-down" | "check" | "x" | "menu";
```

**Dynamic icon lookup by name:**

```tsx
// icons/DynamicIcon.tsx
import { lazy, Suspense } from "react";
import type { IconProps } from "./types";
import type { IconName } from "./index";

const iconMap: Record<
  IconName,
  React.LazyExoticComponent<React.FC<IconProps>>
> = {
  "chevron-down": lazy(() =>
    import("./ChevronDown").then((m) => ({ default: m.ChevronDownIcon })),
  ),
  check: lazy(() => import("./Check").then((m) => ({ default: m.CheckIcon }))),
  // ...
};

interface DynamicIconProps extends IconProps {
  name: IconName;
}

export function DynamicIcon({ name, ...props }: DynamicIconProps) {
  const IconComponent = iconMap[name];
  return (
    <Suspense
      fallback={
        <span
          style={{
            width: props.size,
            height: props.size,
            display: "inline-block",
          }}
        />
      }
    >
      <IconComponent {...props} />
    </Suspense>
  );
}
```

### Step 4 — Generate a Build Script (for Custom SVG folders)

```typescript
// scripts/generate-icons.ts
import fs from "fs";
import path from "path";

const SVG_DIR = "assets/icons";
const OUT_DIR = "src/icons";

const files = fs.readdirSync(SVG_DIR).filter((f) => f.endsWith(".svg"));

files.forEach((file) => {
  const name = path.basename(file, ".svg");
  const componentName =
    name
      .split("-")
      .map((p) => p[0].toUpperCase() + p.slice(1))
      .join("") + "Icon";
  const svgContent = fs.readFileSync(path.join(SVG_DIR, file), "utf-8");

  // Extract path data from SVG
  const pathMatch = svgContent.match(/<path[^>]+>/g) ?? [];
  const paths = pathMatch.join("\n      ");

  const component = `// GENERATED — DO NOT EDIT
import { Icon } from './Icon';
import type { IconProps } from './types';

export function ${componentName}(props: IconProps) {
  return (
    <Icon {...props}>
      ${paths}
    </Icon>
  );
}
`;

  fs.writeFileSync(path.join(OUT_DIR, `${componentName}.tsx`), component);
});

console.log(`Generated ${files.length} icon components`);
```

### Step 5 — Usage Guide

```tsx
// Usage examples
import { ChevronDownIcon, CheckIcon } from '@/icons';
import { DynamicIcon } from '@/icons/DynamicIcon';

// Decorative (aria-hidden automatically)
<ChevronDownIcon size={16} />

// With accessible label (standalone icon button)
<button aria-label="Close">
  <XIcon size={20} aria-label="Close" />
</button>

// Colored
<CheckIcon size={24} color="#16A34A" />

// Dynamic by name
<DynamicIcon name="menu" size={24} />
```

---

## Output Format

1. **`Icon.tsx`** — base wrapper component
2. **`types.ts`** — shared props interface
3. **Individual icon files** — 3–5 example icons
4. **`index.ts`** — barrel export with `IconName` type
5. **`DynamicIcon.tsx`** — lazy-loaded dynamic icon (optional)
6. **Build script** — if generating from SVG folder

---

## Safety & Confirmation

- Always set `aria-hidden` on decorative icons and provide `aria-label` on standalone icon buttons.
- Don't inline SVG `fill` colors hardcoded — use `currentColor` so icons inherit text color.
- For performance: don't import the full icon library — import individual icons only.
- Warn if using an SVG with an embedded `<style>` block — it may conflict with global CSS.
