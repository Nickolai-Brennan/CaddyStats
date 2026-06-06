/**
 * DS-2 Design Tokens
 *
 * Canonical token system for CaddyStats.
 * All tokens are mirrored as CSS custom properties in globals.css.
 *
 * Categories:
 *  spacing     — 4-pt grid steps 0-96
 *  radius      — border-radius scale
 *  shadow      — elevation shadows
 *  opacity     — semantic opacity stops
 *  zIndex      — layering tokens
 *  transition  — duration + easing tokens
 *  semantic    — role-named aliases backed by primitives
 */

// ---------------------------------------------------------------------------
// Spacing — 4-pt grid
// ---------------------------------------------------------------------------
export const spacing = {
  0:   "0px",
  0.5: "2px",
  1:   "4px",
  1.5: "6px",
  2:   "8px",
  2.5: "10px",
  3:   "12px",
  3.5: "14px",
  4:   "16px",
  5:   "20px",
  6:   "24px",
  7:   "28px",
  8:   "32px",
  9:   "36px",
  10:  "40px",
  12:  "48px",
  14:  "56px",
  16:  "64px",
  20:  "80px",
  24:  "96px",
  28:  "112px",
  32:  "128px",
  40:  "160px",
  48:  "192px",
  56:  "224px",
  64:  "256px",
  72:  "288px",
  80:  "320px",
  96:  "384px",
} as const;

// ---------------------------------------------------------------------------
// Radius — border radius scale
// ---------------------------------------------------------------------------
export const radius = {
  none: "0px",
  xs:   "2px",
  sm:   "4px",
  md:   "6px",
  lg:   "8px",
  xl:   "12px",
  "2xl": "16px",
  "3xl": "24px",
  full: "9999px",
} as const;

// ---------------------------------------------------------------------------
// Shadow — elevation scale (dark-mode optimised)
// ---------------------------------------------------------------------------
export const shadow = {
  none: "none",
  xs:   "0 1px 2px rgba(0,0,0,0.4)",
  sm:   "0 1px 3px rgba(0,0,0,0.5), 0 1px 2px rgba(0,0,0,0.3)",
  md:   "0 4px 6px rgba(0,0,0,0.5), 0 2px 4px rgba(0,0,0,0.3)",
  lg:   "0 10px 15px rgba(0,0,0,0.5), 0 4px 6px rgba(0,0,0,0.3)",
  xl:   "0 20px 25px rgba(0,0,0,0.5), 0 10px 10px rgba(0,0,0,0.3)",
  "2xl": "0 25px 50px rgba(0,0,0,0.6)",
  brand: "0 0 0 1px rgba(245,158,11,0.3), 0 4px 12px rgba(245,158,11,0.15)",
  inner: "inset 0 2px 4px rgba(0,0,0,0.4)",
} as const;

// ---------------------------------------------------------------------------
// Opacity
// ---------------------------------------------------------------------------
export const opacity = {
  0:    0,
  5:    0.05,
  10:   0.10,
  20:   0.20,
  30:   0.30,
  40:   0.40,
  50:   0.50,
  60:   0.60,
  70:   0.70,
  80:   0.80,
  90:   0.90,
  95:   0.95,
  100:  1,
  // semantic aliases
  disabled:   0.40,
  muted:      0.60,
  hoverOverlay: 0.08,
  pressOverlay: 0.14,
} as const;

// ---------------------------------------------------------------------------
// Z-index — layering system
// ---------------------------------------------------------------------------
export const zIndex = {
  hide:        -1,
  base:         0,
  raised:       1,
  dropdown:    10,
  sticky:      20,
  banner:      30,
  overlay:     40,
  modal:       50,
  popover:     60,
  tooltip:     70,
  toast:       80,
  skipLink:    90,
  max:        100,
} as const;

// ---------------------------------------------------------------------------
// Transition — duration + easing
// ---------------------------------------------------------------------------
export const transition = {
  duration: {
    instant: "0ms",
    fast:    "120ms",
    default: "200ms",
    slow:    "350ms",
    enter:   "250ms",
    exit:    "180ms",
  },
  easing: {
    linear:     "linear",
    standard:   "cubic-bezier(0.2,0,0,1)",
    emphasized: "cubic-bezier(0.05,0.7,0.1,1)",
    overshoot:  "cubic-bezier(0.34,1.56,0.64,1)",
    enter:      "cubic-bezier(0.0,0.0,0.2,1)",
    exit:       "cubic-bezier(0.4,0.0,1,1)",
  },
} as const;

// ---------------------------------------------------------------------------
// Semantic tokens — role aliases
// ---------------------------------------------------------------------------
export const semanticTokens = {
  interactive: {
    default:  "var(--color-brand-500)",
    hover:    "var(--color-brand-400)",
    pressed:  "var(--color-brand-600)",
    disabled: "rgba(148,163,184,0.30)",
    focus:    "var(--color-brand-500)",
  },
  text: {
    primary:   "var(--color-text-primary)",
    secondary: "var(--color-text-secondary)",
    muted:     "var(--color-text-muted)",
    disabled:  "var(--color-text-disabled)",
    onDark:    "#060b14",
    link:      "var(--color-brand-400)",
    linkHover: "var(--color-brand-300)",
  },
  background: {
    page:    "var(--color-surface-base)",
    card:    "var(--color-surface-raised)",
    overlay: "var(--color-surface-overlay)",
    input:   "var(--color-surface-overlay)",
    hover:   "rgba(148,163,184,0.06)",
    active:  "rgba(245,158,11,0.10)",
  },
  border: {
    default: "var(--color-border-default)",
    subtle:  "var(--color-border-subtle)",
    strong:  "var(--color-border-strong)",
    focus:   "var(--color-border-focus)",
    brand:   "rgba(245,158,11,0.30)",
  },
  feedback: {
    successText: "#22c55e",
    successBg:   "rgba(34,197,94,0.12)",
    warningText: "#eab308",
    warningBg:   "rgba(234,179,8,0.12)",
    errorText:   "#ef4444",
    errorBg:     "rgba(239,68,68,0.12)",
    infoText:    "#0ea5e9",
    infoBg:      "rgba(14,165,233,0.12)",
  },
} as const;

export type SpacingKey    = keyof typeof spacing;
export type RadiusKey     = keyof typeof radius;
export type ShadowKey     = keyof typeof shadow;
export type ZIndexKey     = keyof typeof zIndex;
export type TransitionDurationKey = keyof typeof transition.duration;
export type TransitionEasingKey   = keyof typeof transition.easing;
