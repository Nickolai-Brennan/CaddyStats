---
name: animation-snippet-writer
description: |
  Writes CSS keyframe animations, transitions, and JavaScript-driven motion effects
  from natural language descriptions. Use this skill whenever a user says "animate
  this element", "write a CSS animation for...", "make this fade in", "add a slide
  transition", "create a loading spinner animation", "animate on scroll", "write
  a Framer Motion animation", or "how do I make this bounce/pulse/spin?". Also
  activate when someone describes a UI interaction that should feel smooth or
  delightful. Supports CSS animations, CSS transitions, Web Animations API, and
  Framer Motion. Do NOT use for complex 3D animations (Three.js/WebGL), game
  animations, or SVG path morphing.
---

# Animation Snippet Writer

Write smooth, accessible CSS and JavaScript animations from plain-language
descriptions — from simple fades to scroll-triggered entrance effects.

## When to Use

- Adding micro-interactions to a UI (hover, focus, click feedback)
- Building loading states and skeletons
- Creating page transitions or modal enter/exit animations
- Implementing scroll-triggered entrance effects
- Adding delight animations (success confetti, pulse, bounce)

## When NOT to Use

- 3D animations (Three.js, WebGL — different toolset)
- Game physics animations
- SVG path morphing or GSAP complex timelines
- Video or GIF replacement

---

## Workflow

### Step 1 — Understand the Animation

Collect:

1. **What to animate:** Element type (button, card, modal, icon, text, etc.)
2. **Trigger:** On load, on hover, on click, on scroll enter, on state change
3. **Effect type:** Fade, slide, scale, rotate, shake, pulse, bounce, draw
4. **Duration and feel:** Snappy (150ms), normal (300ms), slow (600ms); ease vs. spring
5. **Library:** Plain CSS, Framer Motion, Web Animations API, or CSS + JS class toggle

### Step 2 — Select the Right Approach

| Use case              | Recommended approach                         |
| --------------------- | -------------------------------------------- |
| Simple hover effects  | CSS `:hover` transition                      |
| Enter/exit animations | CSS keyframes + class toggle                 |
| Spring-feel motion    | Framer Motion `motion` + `spring`            |
| Scroll entrance       | IntersectionObserver + CSS class             |
| Coordinated sequences | Framer Motion `variants` + `staggerChildren` |
| Loading spinner       | CSS `@keyframes` rotate                      |

### Step 3 — Write the Animation

#### CSS Transitions (hover / state change)

```css
/* Smooth button press */
.btn {
  transform: scale(1);
  transition:
    transform 150ms ease,
    box-shadow 150ms ease;
}
.btn:hover {
  transform: scale(1.03);
}
.btn:active {
  transform: scale(0.97);
}

/* Fade-in opacity */
.fade-in {
  opacity: 0;
  transition: opacity 300ms ease-in-out;
}
.fade-in.visible {
  opacity: 1;
}
```

#### CSS Keyframe Animations

```css
/* Slide in from bottom */
@keyframes slideUp {
  from {
    transform: translateY(24px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.card-enter {
  animation: slideUp 350ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

/* Pulse ring */
@keyframes ping {
  75%,
  100% {
    transform: scale(2);
    opacity: 0;
  }
}
.pulse-ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: currentColor;
  animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
}

/* Loading spinner */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
.spinner {
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.65s linear infinite;
}
```

#### Scroll-Triggered Entrance (IntersectionObserver)

```typescript
// hooks/useScrollReveal.ts
import { useEffect, useRef } from "react";

export function useScrollReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-visible");
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
}
```

```css
.reveal {
  opacity: 0;
  transform: translateY(20px);
  transition:
    opacity 500ms ease,
    transform 500ms ease;
}
.reveal.is-visible {
  opacity: 1;
  transform: translateY(0);
}
```

#### Framer Motion Examples

```tsx
import { motion, AnimatePresence } from "framer-motion";

// Fade + slide in
const fadeSlideUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
};

export function Modal({ isOpen, children }) {
  return (
    <AnimatePresence>
      {isOpen && <motion.div {...fadeSlideUp}>{children}</motion.div>}
    </AnimatePresence>
  );
}

// Stagger list items
const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const itemVariants = {
  hidden: { opacity: 0, x: -12 },
  show: { opacity: 1, x: 0 },
};

export function AnimatedList({ items }) {
  return (
    <motion.ul variants={listVariants} initial="hidden" animate="show">
      {items.map((item) => (
        <motion.li key={item.id} variants={itemVariants}>
          {item.label}
        </motion.li>
      ))}
    </motion.ul>
  );
}
```

### Step 4 — Apply Accessibility Defaults

Every animation snippet should respect `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

In Framer Motion, use `useReducedMotion`:

```typescript
const shouldReduceMotion = useReducedMotion();
const animationProps = shouldReduceMotion ? {} : fadeSlideUp;
```

---

## Output Format

1. **CSS / JS code block** — complete, ready to paste
2. **HTML markup** — if structural changes are needed
3. **Usage note** — how to trigger the animation
4. **`prefers-reduced-motion` override** — always included

---

## Safety & Confirmation

- Always include `prefers-reduced-motion` support — vestibular disorders can make motion harmful.
- Don't use `animation: all` or `transition: all` in production — it causes paint thrashing.
- Warn if an animation uses properties that trigger layout (width, height, top, left) vs. transform/opacity only.
- Avoid infinite animations on critical UI elements — they drain battery on mobile.
