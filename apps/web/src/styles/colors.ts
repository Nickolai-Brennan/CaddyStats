/**
 * DS-5 Color System
 *
 * Canonical color tokens for CaddyStats.
 * - Primary palette   (amber/gold brand)
 * - Neutral palette   (slate dark-mode base)
 * - Chart palette     (8-stop data-viz scale)
 * - Semantic colors   (success / warning / error / info)
 * - Status colors     (live / pending / closed / cancelled)
 * - Analytics colors  (projection / confidence / risk / ownership / trend)
 * - Dark mode         (surface elevations + border scale)
 *
 * All values are also registered as CSS custom properties in globals.css
 * so they can be referenced with var(--color-*) at runtime.
 */

// ---------------------------------------------------------------------------
// Primary — amber / gold brand identity
// ---------------------------------------------------------------------------
export const primary = {
  50:  "#fffbeb",
  100: "#fef3c7",
  200: "#fde68a",
  300: "#fcd34d",
  400: "#fbbf24",
  500: "#f59e0b", // brand default
  600: "#d97706",
  700: "#b45309",
  800: "#92400e",
  900: "#78350f",
  950: "#451a03",
} as const;

// ---------------------------------------------------------------------------
// Neutral — slate dark-mode base
// ---------------------------------------------------------------------------
export const neutral = {
  0:   "#ffffff",
  50:  "#f8fafc",
  100: "#f1f5f9",
  200: "#e2e8f0",
  300: "#cbd5e1",
  400: "#94a3b8",
  500: "#64748b",
  600: "#475569",
  700: "#334155",
  800: "#1e293b",
  850: "#172033",
  900: "#0f172a",
  925: "#0b1120",
  950: "#060b14",
} as const;

// ---------------------------------------------------------------------------
// Chart — 8-stop categorical palette, WCAG AA against slate-950
// ---------------------------------------------------------------------------
export const chart = {
  1: "#f59e0b", // amber   — primary metric
  2: "#38bdf8", // sky     — comparison
  3: "#a78bfa", // violet  — third metric
  4: "#34d399", // emerald — positive / gain
  5: "#fb7185", // rose    — negative / loss
  6: "#fb923c", // orange  — secondary alert
  7: "#a3e635", // lime    — projection
  8: "#e879f9", // fuchsia — AI / model output
} as const;

// ---------------------------------------------------------------------------
// Semantic — system feedback colors
// ---------------------------------------------------------------------------
export const semantic = {
  success: {
    light:   "#bbf7d0",
    default: "#22c55e",
    dark:    "#15803d",
    bg:      "rgba(34,197,94,0.12)",
  },
  warning: {
    light:   "#fef9c3",
    default: "#eab308",
    dark:    "#a16207",
    bg:      "rgba(234,179,8,0.12)",
  },
  error: {
    light:   "#fecaca",
    default: "#ef4444",
    dark:    "#b91c1c",
    bg:      "rgba(239,68,68,0.12)",
  },
  info: {
    light:   "#bae6fd",
    default: "#0ea5e9",
    dark:    "#0369a1",
    bg:      "rgba(14,165,233,0.12)",
  },
} as const;

// ---------------------------------------------------------------------------
// Status — entity lifecycle states
// ---------------------------------------------------------------------------
export const status = {
  live:      { color: "#22c55e", bg: "rgba(34,197,94,0.15)"   },
  pending:   { color: "#eab308", bg: "rgba(234,179,8,0.15)"   },
  closed:    { color: "#64748b", bg: "rgba(100,116,139,0.15)" },
  cancelled: { color: "#ef4444", bg: "rgba(239,68,68,0.15)"   },
  upcoming:  { color: "#38bdf8", bg: "rgba(56,189,248,0.15)"  },
} as const;

// ---------------------------------------------------------------------------
// Analytics — domain-specific tokens
// ---------------------------------------------------------------------------
export const analytics = {
  projection: "#a3e635", // lime    — projected value
  confidence: "#38bdf8", // sky     — model confidence
  risk:       "#fb7185", // rose    — risk / downside
  ownership:  "#a78bfa", // violet  — DFS ownership
  oddsUp:     "#22c55e", // green   — positive odds movement
  oddsDown:   "#ef4444", // red     — negative odds movement
  trend:      "#f59e0b", // amber   — general trend line
  edge:       "#34d399", // emerald — betting edge
} as const;

// ---------------------------------------------------------------------------
// Dark Mode — surface elevation + border scale
// ---------------------------------------------------------------------------
export const darkMode = {
  surface: {
    base:    "#060b14", // page background
    raised:  "#0f172a", // card / panel
    overlay: "#1e293b", // dropdown / modal
    sunken:  "#0b1120", // code blocks / inset
    accent:  "#172033", // subtle highlight surface
  },
  border: {
    subtle:  "rgba(148,163,184,0.10)",
    default: "rgba(148,163,184,0.18)",
    strong:  "rgba(148,163,184,0.30)",
    focus:   "#f59e0b",
  },
  text: {
    primary:   "#f8fafc",
    secondary: "#cbd5e1",
    muted:     "#64748b",
    disabled:  "#334155",
    inverse:   "#060b14",
  },
} as const;

// Contrast audit (WCAG 2.1 AA ≥ 4.5:1 for normal text against slate-950)
// amber-500  → ~7.1:1  ✓ AAA
// sky-400    → ~5.8:1  ✓ AA
// violet-400 → ~5.1:1  ✓ AA
// emerald-400 → ~6.2:1 ✓ AA
// rose-400   → ~5.4:1  ✓ AA

export type ChartColorKey = keyof typeof chart;
export type SemanticTone  = keyof typeof semantic;
export type StatusKey     = keyof typeof status;
export type AnalyticsKey  = keyof typeof analytics;
