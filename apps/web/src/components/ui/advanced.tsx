/**
 * DS-10A  Advanced Table System
 * DS-11A  Advanced Dashboard Widgets
 * DS-11B  Advanced Chart Controls
 * DS-11D  Advanced Graph System
 */

import { useState, useRef, useCallback, type ReactNode, type CSSProperties } from "react";
import { cx } from "./utils";

// ============================================================================
// DS-10A — ADVANCED TABLE SYSTEM — cell renderers
// ============================================================================

export function NumericCell({
  value,
  precision = 2,
  positiveColor = "text-emerald-400",
  negativeColor = "text-red-400",
  neutral = false,
}: {
  value: number;
  precision?: number;
  positiveColor?: string;
  negativeColor?: string;
  neutral?: boolean;
}) {
  const cls = neutral
    ? "text-slate-300"
    : value > 0
      ? positiveColor
      : value < 0
        ? negativeColor
        : "text-slate-400";
  return (
    <span className={cx("tabular-nums text-sm font-medium", cls)}>
      {value > 0 && !neutral ? "+" : ""}
      {value.toFixed(precision)}
    </span>
  );
}

export function PercentageCell({ value, max = 100 }: { value: number; max?: number }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-800">
        <div className="h-full rounded-full bg-amber-500" style={{ width: `${pct}%` }} />
      </div>
      <span className="tabular-nums text-xs text-slate-300">{value.toFixed(1)}%</span>
    </div>
  );
}

export function OddsCell({ american }: { american: number }) {
  const isPos = american > 0;
  return (
    <span
      className={cx(
        "tabular-nums text-sm font-semibold",
        isPos ? "text-emerald-400" : "text-slate-300"
      )}
    >
      {isPos ? `+${american}` : american}
    </span>
  );
}

export function ConfidenceBadgeCell({ score }: { score: number }) {
  const tier = score >= 80 ? "high" : score >= 55 ? "medium" : "low";
  const styles = {
    high: "bg-emerald-500/15 text-emerald-300 ring-emerald-500/30",
    medium: "bg-amber-500/15 text-amber-300 ring-amber-500/30",
    low: "bg-slate-700 text-slate-400 ring-slate-600",
  } as const;
  return (
    <span
      className={cx(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1",
        styles[tier]
      )}
    >
      {score}%
    </span>
  );
}

export function TrendIndicatorCell({
  direction,
  magnitude = "moderate",
}: {
  direction: "up" | "down" | "flat";
  magnitude?: "strong" | "moderate" | "weak";
}) {
  const arrows = { up: "↑", down: "↓", flat: "→" } as const;
  const colors = { up: "text-emerald-400", down: "text-red-400", flat: "text-slate-400" } as const;
  const sizes = {
    strong: "text-base font-bold",
    moderate: "text-sm font-semibold",
    weak: "text-xs",
  } as const;
  return (
    <span className={cx(colors[direction], sizes[magnitude])} aria-label={`Trend: ${direction}`}>
      {arrows[direction]}
      {magnitude === "strong" && arrows[direction]}
    </span>
  );
}

export function ExposureBadgeCell({ value, max = 100 }: { value: number; max?: number }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const tone =
    pct > 70
      ? "bg-red-500/15 text-red-300 ring-red-500/30"
      : pct > 40
        ? "bg-amber-500/15 text-amber-300 ring-amber-500/30"
        : "bg-slate-700 text-slate-400 ring-slate-600";
  return (
    <span
      className={cx(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1",
        tone
      )}
    >
      {value.toFixed(1)}%
    </span>
  );
}

// ---------------------------------------------------------------------------
// ExpandableRow
// ---------------------------------------------------------------------------
interface ExpandableRowProps {
  trigger: ReactNode;
  detail: ReactNode;
  className?: string;
}

export function ExpandableRow({ trigger, detail, className }: ExpandableRowProps) {
  const [expanded, setExpanded] = useState(false);
  return (
    <>
      <tr
        className={cx(
          "cursor-pointer transition-colors hover:bg-slate-800/50",
          expanded && "bg-slate-800/40",
          className
        )}
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
      >
        <td colSpan={999} className="p-0">
          <div className="flex items-center gap-2 px-4 py-3">
            <span
              className={cx(
                "text-slate-500 transition-transform",
                expanded ? "rotate-90" : "rotate-0"
              )}
              aria-hidden
            >
              ›
            </span>
            {trigger}
          </div>
        </td>
      </tr>
      {expanded && (
        <tr>
          <td colSpan={999} className="bg-slate-800/20 px-6 pb-4 pt-2">
            {detail}
          </td>
        </tr>
      )}
    </>
  );
}

// ---------------------------------------------------------------------------
// ContextMenu
// ---------------------------------------------------------------------------
interface ContextMenuItem {
  label: string;
  onClick: () => void;
  destructive?: boolean;
  disabled?: boolean;
}
interface ContextMenuProps {
  items: ContextMenuItem[];
  children: ReactNode;
}

export function ContextMenu({ items, children }: ContextMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);
  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLDivElement>) => {
      if (!ref.current?.contains(e.relatedTarget as Node)) close();
    },
    [close]
  );
  return (
    <div ref={ref} className="relative inline-block" onBlur={handleBlur}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="rounded p-1 text-slate-500 hover:bg-slate-800 hover:text-slate-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-500"
        aria-label="Row actions"
      >
        {children}
      </button>
      {open && (
        <ul
          role="menu"
          className="absolute right-0 top-full z-50 mt-1 min-w-[10rem] overflow-hidden rounded-xl border border-slate-700 bg-slate-900 py-1 shadow-xl"
        >
          {items.map((item, i) => (
            <li key={i} role="none">
              <button
                type="button"
                role="menuitem"
                disabled={item.disabled}
                onClick={() => {
                  item.onClick();
                  close();
                }}
                className={cx(
                  "flex w-full items-center px-3 py-2 text-sm transition-colors",
                  item.destructive
                    ? "text-red-400 hover:bg-red-500/10"
                    : "text-slate-200 hover:bg-slate-800",
                  item.disabled && "pointer-events-none opacity-40"
                )}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ============================================================================
// DS-11A — ADVANCED DASHBOARD WIDGETS
// ============================================================================

interface WidgetShellProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  loading?: boolean;
  error?: string;
  empty?: boolean;
  emptyMessage?: string;
  children?: ReactNode;
  className?: string;
  fullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

export function WidgetShell({
  title,
  subtitle,
  actions,
  loading = false,
  error,
  empty = false,
  emptyMessage = "No data available",
  children,
  className,
  fullscreen = false,
  onToggleFullscreen,
}: WidgetShellProps) {
  return (
    <section
      className={cx(
        "flex flex-col rounded-2xl border border-slate-800 bg-slate-900",
        fullscreen && "fixed inset-4 z-50 overflow-auto shadow-2xl",
        className
      )}
      aria-label={title}
    >
      <header className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-200">{title}</h3>
          {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-2">
          {actions}
          {onToggleFullscreen && (
            <button
              type="button"
              onClick={onToggleFullscreen}
              className="rounded p-1 text-slate-500 hover:text-slate-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-500"
              aria-label={fullscreen ? "Exit fullscreen" : "Fullscreen"}
            >
              <svg viewBox="0 0 14 14" fill="none" className="h-3.5 w-3.5" aria-hidden>
                <path
                  d="M1 5V1h4M9 1h4v4M1 9v4h4M13 9v4H9"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          )}
        </div>
      </header>
      <div className="flex-1 p-4">
        {loading && (
          <div className="flex h-24 items-center justify-center">
            <span
              className="h-5 w-5 animate-spin rounded-full border-2 border-amber-500/30 border-t-amber-500"
              aria-label="Loading"
            />
          </div>
        )}
        {error && !loading && (
          <div className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400" role="alert">
            {error}
          </div>
        )}
        {empty && !loading && !error && (
          <p className="text-center text-sm text-slate-500">{emptyMessage}</p>
        )}
        {!loading && !error && !empty && children}
      </div>
    </section>
  );
}

interface DeltaCardProps {
  label: string;
  value: string | number;
  delta?: number;
  deltaLabel?: string;
  icon?: ReactNode;
  className?: string;
}
export function DeltaCard({ label, value, delta, deltaLabel, icon, className }: DeltaCardProps) {
  const trendUp = delta !== undefined && delta > 0;
  const trendDown = delta !== undefined && delta < 0;
  return (
    <div className={cx("rounded-2xl border border-slate-800 bg-slate-900 p-4", className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500">{label}</p>
          <p className="mt-1 text-2xl font-bold text-slate-100">{value}</p>
        </div>
        {icon && (
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
            {icon}
          </div>
        )}
      </div>
      {delta !== undefined && (
        <div
          className={cx(
            "mt-2 flex items-center gap-1 text-xs font-medium",
            trendUp ? "text-emerald-400" : trendDown ? "text-red-400" : "text-slate-400"
          )}
        >
          <span aria-hidden>{trendUp ? "↑" : trendDown ? "↓" : "→"}</span>
          <span>
            {trendUp ? "+" : ""}
            {delta.toFixed(2)}
            {deltaLabel ? ` ${deltaLabel}` : ""}
          </span>
        </div>
      )}
    </div>
  );
}

interface ExposureMetricProps {
  label: string;
  value: number;
  capacity: number;
  unit?: string;
  className?: string;
}
export function ExposureMetric({
  label,
  value,
  capacity,
  unit = "%",
  className,
}: ExposureMetricProps) {
  const pct = Math.min(100, (value / Math.max(capacity, 0.001)) * 100);
  const toneClass = pct > 75 ? "bg-red-500" : pct > 50 ? "bg-amber-500" : "bg-emerald-500";
  return (
    <div className={cx("rounded-2xl border border-slate-800 bg-slate-900 p-4", className)}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-400">{label}</span>
        <span className="text-sm font-semibold text-slate-200">
          {value.toFixed(1)}
          {unit}{" "}
          <span className="text-slate-500">
            / {capacity}
            {unit}
          </span>
        </span>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">
        <div
          className={cx("h-full rounded-full transition-all", toneClass)}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

interface AISummaryCardProps {
  title: string;
  summary: string;
  confidence?: number;
  modelVersion?: string;
  generatedAt?: string;
  disclaimer?: string;
  className?: string;
}
export function AISummaryCard({
  title,
  summary,
  confidence,
  modelVersion,
  generatedAt,
  disclaimer,
  className,
}: AISummaryCardProps) {
  return (
    <div className={cx("rounded-2xl border border-slate-800 bg-slate-900 p-4", className)}>
      <div className="mb-3 flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/15 text-amber-400 text-[10px] font-bold">
          AI
        </span>
        <span className="text-sm font-semibold text-slate-200">{title}</span>
        {confidence !== undefined && (
          <span className="ml-auto text-xs text-slate-500">
            Confidence: <strong className="text-amber-400">{confidence}%</strong>
          </span>
        )}
      </div>
      <p className="text-sm leading-relaxed text-slate-300">{summary}</p>
      <div className="mt-3 flex flex-wrap gap-3 text-[10px] text-slate-600">
        {modelVersion && <span>Model: {modelVersion}</span>}
        {generatedAt && <span>Generated: {generatedAt}</span>}
      </div>
      {disclaimer && (
        <p className="mt-2 rounded-lg bg-slate-800/60 px-2.5 py-1.5 text-[11px] text-slate-500">
          ⚠ {disclaimer}
        </p>
      )}
    </div>
  );
}

interface Anomaly {
  player: string;
  stat: string;
  value: number;
  expected: number;
  zScore: number;
  direction: "above" | "below";
}
interface AnomalyDetectorWidgetProps {
  anomalies: Anomaly[];
  title?: string;
  className?: string;
}
export function AnomalyDetectorWidget({
  anomalies,
  title = "Stat Anomalies",
  className,
}: AnomalyDetectorWidgetProps) {
  return (
    <div className={cx("rounded-2xl border border-slate-800 bg-slate-900 p-4", className)}>
      <h3 className="mb-3 text-sm font-semibold text-slate-300">{title}</h3>
      {anomalies.length === 0 ? (
        <p className="text-xs text-slate-500">No anomalies detected in current dataset.</p>
      ) : (
        <ul className="space-y-2">
          {anomalies.map((a, i) => (
            <li
              key={i}
              className="flex items-center justify-between rounded-lg bg-slate-800/50 px-3 py-2"
            >
              <div>
                <span className="text-sm font-medium text-slate-200">{a.player}</span>
                <span className="ml-2 text-xs text-slate-500">{a.stat}</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className={a.direction === "above" ? "text-emerald-400" : "text-red-400"}>
                  {a.direction === "above" ? "↑" : "↓"} {a.value.toFixed(2)}
                </span>
                <span className="text-slate-500">exp {a.expected.toFixed(2)}</span>
                <span className="text-slate-600">z={a.zScore.toFixed(1)}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ============================================================================
// DS-11B — ADVANCED CHART CONTROLS
// ============================================================================

interface ChartWrapperProps {
  title: string;
  subtitle?: string;
  controls?: ReactNode;
  onExport?: () => void;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}
export function ChartWrapper({
  title,
  subtitle,
  controls,
  onExport,
  children,
  className,
  style,
}: ChartWrapperProps) {
  return (
    <figure
      className={cx("rounded-2xl border border-slate-800 bg-slate-900", className)}
      style={style}
    >
      <div className="flex items-start justify-between border-b border-slate-800 px-4 py-3">
        <div>
          <figcaption className="text-sm font-semibold text-slate-200">{title}</figcaption>
          {subtitle && <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-2">
          {controls}
          {onExport && (
            <button
              type="button"
              onClick={onExport}
              className="rounded px-2 py-1 text-xs text-slate-500 hover:bg-slate-800 hover:text-slate-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-500"
              aria-label="Export chart"
            >
              Export
            </button>
          )}
        </div>
      </div>
      <div className="p-4">{children}</div>
    </figure>
  );
}

type ChartTimeframe = "1W" | "1M" | "3M" | "6M" | "1Y" | "All";
const TIMEFRAMES: ChartTimeframe[] = ["1W", "1M", "3M", "6M", "1Y", "All"];

export function ChartDateSelector({
  value = "3M",
  onChange,
}: {
  value?: ChartTimeframe;
  onChange?: (tf: ChartTimeframe) => void;
}) {
  return (
    <div
      role="group"
      aria-label="Chart timeframe"
      className="flex gap-0.5 rounded-lg bg-slate-800 p-0.5"
    >
      {TIMEFRAMES.map((tf) => (
        <button
          key={tf}
          type="button"
          onClick={() => onChange?.(tf)}
          aria-pressed={tf === value}
          className={cx(
            "rounded px-2 py-0.5 text-xs font-medium transition-colors",
            tf === value ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-slate-200"
          )}
        >
          {tf}
        </button>
      ))}
    </div>
  );
}

interface CompareSelectorProps {
  options: { id: string; label: string }[];
  selected: string[];
  max?: number;
  onChange?: (ids: string[]) => void;
  className?: string;
}
export function CompareSelector({
  options,
  selected,
  max = 4,
  onChange,
  className,
}: CompareSelectorProps) {
  function toggle(id: string) {
    if (selected.includes(id)) {
      onChange?.(selected.filter((s) => s !== id));
    } else if (selected.length < max) {
      onChange?.([...selected, id]);
    }
  }
  return (
    <div
      className={cx("flex flex-wrap gap-1.5", className)}
      role="group"
      aria-label="Compare players"
    >
      {options.map((opt) => {
        const active = selected.includes(opt.id);
        const maxReached = !active && selected.length >= max;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => toggle(opt.id)}
            disabled={maxReached}
            aria-pressed={active}
            className={cx(
              "rounded-full px-3 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500",
              active
                ? "bg-amber-500/20 text-amber-300 ring-1 ring-amber-500/40"
                : maxReached
                  ? "cursor-not-allowed bg-slate-800 text-slate-600"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

// ============================================================================
// DS-11D — ADVANCED GRAPH SYSTEM
// ============================================================================

interface GraphNode {
  id: string;
  label: string;
  group?: string;
  weight?: number;
}
interface GraphEdge {
  source: string;
  target: string;
  weight?: number;
  label?: string;
}
interface NetworkGraphProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  title?: string;
  width?: number;
  height?: number;
  groupColors?: Record<string, string>;
}

export function NetworkGraph({
  nodes,
  edges,
  title,
  width = 400,
  height = 300,
  groupColors = {},
}: NetworkGraphProps) {
  const cxV = width / 2;
  const cyV = height / 2;
  const radius = Math.min(cxV, cyV) * 0.72;
  const defaultColors = ["#f59e0b", "#38bdf8", "#a78bfa", "#34d399", "#fb7185", "#f97316"];
  const groups = [...new Set(nodes.map((n) => n.group ?? "default"))];
  function getColor(group?: string): string {
    const g = group ?? "default";
    if (groupColors[g]) return groupColors[g];
    return defaultColors[groups.indexOf(g) % defaultColors.length];
  }
  const positions: Record<string, { x: number; y: number }> = {};
  nodes.forEach((n, i) => {
    const angle = (Math.PI * 2 * i) / nodes.length - Math.PI / 2;
    positions[n.id] = { x: cxV + radius * Math.cos(angle), y: cyV + radius * Math.sin(angle) };
  });
  return (
    <figure className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
      {title && (
        <figcaption className="mb-3 text-sm font-medium text-slate-300">{title}</figcaption>
      )}
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        style={{ height }}
        role="img"
        aria-label={title ?? "Network graph"}
      >
        {edges.map((e, i) => {
          const src = positions[e.source];
          const tgt = positions[e.target];
          if (!src || !tgt) return null;
          return (
            <line
              key={i}
              x1={src.x.toFixed(2)}
              y1={src.y.toFixed(2)}
              x2={tgt.x.toFixed(2)}
              y2={tgt.y.toFixed(2)}
              stroke="rgba(148,163,184,0.25)"
              strokeWidth={e.weight ? 1 + e.weight * 2 : 1}
              strokeOpacity={e.weight !== undefined ? 0.2 + e.weight * 0.6 : 0.3}
            />
          );
        })}
        {nodes.map((n) => {
          const pos = positions[n.id];
          if (!pos) return null;
          const r = 5 + (n.weight ?? 0) * 4;
          const color = getColor(n.group);
          return (
            <g key={n.id}>
              <circle
                cx={pos.x.toFixed(2)}
                cy={pos.y.toFixed(2)}
                r={r}
                fill={color}
                fillOpacity="0.85"
                stroke={color}
                strokeWidth="1"
              />
              <text
                x={pos.x.toFixed(2)}
                y={(pos.y + r + 10).toFixed(2)}
                textAnchor="middle"
                fontSize="9"
                className="fill-slate-400"
              >
                {n.label}
              </text>
            </g>
          );
        })}
      </svg>
      {groups.filter((g) => g !== "default").length > 0 && (
        <div className="mt-3 flex flex-wrap gap-3">
          {groups.map((g) => (
            <div key={g} className="flex items-center gap-1.5 text-xs text-slate-400">
              <span
                className="h-2 w-2 rounded-full"
                style={{ background: getColor(g) }}
                aria-hidden
              />
              {g}
            </div>
          ))}
        </div>
      )}
    </figure>
  );
}

interface ConfidenceNode {
  id: string;
  label: string;
  confidence: number;
}
interface ConfidenceNetworkProps {
  nodes: ConfidenceNode[];
  edges: GraphEdge[];
  title?: string;
  width?: number;
  height?: number;
}
export function ConfidenceNetwork({
  nodes,
  edges,
  title,
  width = 400,
  height = 280,
}: ConfidenceNetworkProps) {
  const graphNodes: GraphNode[] = nodes.map((n) => ({
    id: n.id,
    label: n.label,
    weight: n.confidence / 100,
    group: n.confidence >= 75 ? "high" : n.confidence >= 50 ? "medium" : "low",
  }));
  return (
    <NetworkGraph
      nodes={graphNodes}
      edges={edges}
      title={title}
      width={width}
      height={height}
      groupColors={{ high: "#34d399", medium: "#f59e0b", low: "#94a3b8" }}
    />
  );
}
