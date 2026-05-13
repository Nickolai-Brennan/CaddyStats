---
name: react-component-generator
description: |
  Generates React components with TypeScript props types, hooks, accessibility
  attributes, and basic test stubs. Use this skill whenever a user says "create
  a React component for...", "write a React component that...", "build a [name]
  component in React", "generate a reusable React component", "scaffold a React
  hook for...", or "add a component to my React app". Also activate when someone
  describes UI behavior and wants it as a React component. Produces modern
  functional components with hooks; does not generate class components. Works
  with React 18+, TypeScript, and either CSS Modules, Tailwind, or styled-components.
  Do NOT use for full-page layout scaffolding (use css-layout-helper) or
  state management architecture.
---

# React Component Generator

Generate clean, typed, accessible React components with props interfaces,
hooks patterns, and test stubs ready to drop into a codebase.

## When to Use

- Building a new UI component from a description or design spec
- Creating a reusable component to standardize across a codebase
- Scaffolding a custom hook that encapsulates shared stateful logic
- Adding a compound component (e.g., Tabs with Tab, TabList, TabPanel)

## When NOT to Use

- Full-page layout or grid systems (use `css-layout-helper`)
- State management patterns (Redux, Zustand, Context architecture)
- Server Components (React Server Components have different constraints)
- Non-React UI frameworks (Vue, Svelte, Angular)

---

## Workflow

### Step 1 — Understand the Component

Ask for:

1. **Component name and purpose:** What does it do?
2. **Props:** What data does it accept? Any callbacks?
3. **State:** Does it manage its own state? What interactions does it handle?
4. **Styling approach:** Tailwind / CSS Modules / styled-components / plain CSS
5. **Tests:** Jest + React Testing Library stubs needed?

### Step 2 — Define the Props Interface

Start with a tight TypeScript interface:

```typescript
export interface ButtonProps {
  /** Button label text */
  label: string;
  /** Click handler */
  onClick: () => void;
  /** Visual variant */
  variant?: "primary" | "secondary" | "danger";
  /** Disabled state */
  disabled?: boolean;
  /** Accessible label for icon-only buttons */
  "aria-label"?: string;
  /** Additional CSS classes */
  className?: string;
}
```

### Step 3 — Generate the Component

**Standard functional component (Tailwind):**

```tsx
// components/Button/Button.tsx
import { forwardRef } from "react";
import { clsx } from "clsx";

const VARIANT_CLASSES = {
  primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
  secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-400",
  danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
} as const;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ label, onClick, variant = "primary", disabled = false, className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={clsx(
          "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium",
          "focus:outline-none focus:ring-2 focus:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          VARIANT_CLASSES[variant],
          className
        )}
        {...props}
      >
        {label}
      </button>
    );
  }
);
Button.displayName = "Button";
```

**Component with local state:**

```tsx
// components/Collapsible/Collapsible.tsx
import { useState, useId } from "react";

export interface CollapsibleProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function Collapsible({ title, children, defaultOpen = false }: CollapsibleProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const contentId = useId();

  return (
    <div>
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={contentId}
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full items-center justify-between"
      >
        <span>{title}</span>
        <span aria-hidden="true">{isOpen ? "−" : "+"}</span>
      </button>
      <div id={contentId} hidden={!isOpen} role="region">
        {children}
      </div>
    </div>
  );
}
```

**Custom hook extraction (when logic is complex):**

```typescript
// hooks/useToggle.ts
import { useState, useCallback } from "react";

export function useToggle(initialState = false) {
  const [state, setState] = useState(initialState);
  const toggle = useCallback(() => setState((s) => !s), []);
  const setOn = useCallback(() => setState(true), []);
  const setOff = useCallback(() => setState(false), []);
  return { state, toggle, setOn, setOff } as const;
}
```

### Step 4 — Add the Barrel Export

```typescript
// components/Button/index.ts
export { Button } from "./Button";
export type { ButtonProps } from "./Button";
```

### Step 5 — Generate a Test Stub

```tsx
// components/Button/Button.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "./Button";

describe("Button", () => {
  it("renders with the given label", () => {
    render(<Button label="Click me" onClick={() => {}} />);
    expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument();
  });

  it("calls onClick when clicked", async () => {
    const onClick = jest.fn();
    render(<Button label="Click me" onClick={onClick} />);
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("is disabled when disabled prop is true", () => {
    render(<Button label="Click me" onClick={() => {}} disabled />);
    expect(screen.getByRole("button")).toBeDisabled();
  });
});
```

---

## Accessibility Defaults

Every component should include by default:

- Correct semantic HTML element (`button` not `div`, etc.)
- `aria-` attributes for interactive state (`aria-expanded`, `aria-controls`, `aria-label`)
- `focus:ring` or equivalent visible focus indicator
- Keyboard interaction support matching the WAI-ARIA pattern

---

## Output Format

1. **Props interface** — TypeScript interface
2. **Component file** — complete, ready-to-use
3. **Barrel index** — `index.ts` export
4. **Test stub** — RTL test file with 3 baseline tests
5. **Usage example** — a quick code snippet showing how to use the component

---

## Safety & Confirmation

- Use `forwardRef` for components that consumers might need to access the DOM node.
- Never use `any` as a prop type — use `unknown` or a specific type.
- Always check: Does this component need `key` management if rendered in a list?
- Warn if a component does direct DOM manipulation (ref misuse) vs. declarative React.
