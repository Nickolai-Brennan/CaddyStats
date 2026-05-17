import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "./utils";

interface CardProps extends HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  action?: ReactNode;
}

export function Card({ title, description, action, className, children, ...props }: CardProps) {
  return (
    <article
      className={cx("rounded-2xl border border-slate-800 bg-slate-900 p-6", className)}
      {...props}
    >
      {(title || description || action) && (
        <header className="mb-4 flex items-start justify-between gap-4">
          <div>
            {title && <h3 className="text-lg font-semibold text-slate-100">{title}</h3>}
            {description && <p className="mt-1 text-sm text-slate-400">{description}</p>}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </header>
      )}
      {children}
    </article>
  );
}

interface MetricCardProps {
  label: string;
  value: string | number | null | undefined;
  detail?: string;
  highlighted?: boolean;
}

export function MetricCard({ label, value, detail, highlighted = false }: MetricCardProps) {
  const isEmpty = value === null || value === undefined;

  return (
    <Card className={highlighted ? "border-amber-500/30 bg-amber-500/5" : undefined}>
      <p className="text-sm text-slate-400">{label}</p>
      <p
        className={cx(
          "mt-2 text-3xl font-bold text-slate-50",
          highlighted && "text-amber-400",
          isEmpty && "text-slate-600"
        )}
      >
        {isEmpty ? "—" : value.toLocaleString()}
      </p>
      {detail && <p className="mt-1 text-xs text-slate-500">{detail}</p>}
    </Card>
  );
}

// ---------------------------------------------------------------------------
// TrendCard (DS-9)
// ---------------------------------------------------------------------------
interface TrendCardProps {
  label: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  detail?: string;
  className?: string;
}

export function TrendCard({ label, value, change, changeLabel, detail, className }: TrendCardProps) {
  const isPositive = (change ?? 0) >= 0;
  return (
    <Card className={className}>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-bold tabular-nums text-slate-50">
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>
      {change !== undefined && (
        <div className={cx("mt-1 flex items-center gap-1 text-xs font-medium", isPositive ? "text-green-400" : "text-rose-400")}>
          <svg viewBox="0 0 12 12" className={cx("h-3 w-3", !isPositive && "rotate-180")} aria-hidden fill="none">
            <path d="M6 2.5v7M2.5 6l3.5-3.5L9.5 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {Math.abs(change).toFixed(1)}{changeLabel ?? ""}
        </div>
      )}
      {detail && <p className="mt-1 text-xs text-slate-500">{detail}</p>}
    </Card>
  );
}

// ---------------------------------------------------------------------------
// ProjectionCard (DS-9)
// ---------------------------------------------------------------------------
interface ProjectionCardProps {
  playerName: string;
  projection: number;
  confidence?: number;
  position?: string | number;
  detail?: string;
  className?: string;
}

export function ProjectionCard({ playerName, projection, confidence, position, detail, className }: ProjectionCardProps) {
  return (
    <Card className={cx("border-analytics-projection/20", className)}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Projection</p>
          <p className="mt-1 font-semibold text-slate-100">{playerName}</p>
        </div>
        {position !== undefined && (
          <span className="rounded-lg bg-slate-800 px-2 py-1 text-sm font-bold tabular-nums text-amber-400">
            #{position}
          </span>
        )}
      </div>
      <p className="mt-3 text-3xl font-bold tabular-nums text-analytics-projection">{projection.toFixed(1)}</p>
      {confidence !== undefined && (
        <div className="mt-2">
          <div className="mb-1 flex justify-between text-xs text-slate-500">
            <span>Confidence</span>
            <span className="text-analytics-confidence">{confidence}%</span>
          </div>
          <div className="h-1 overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-analytics-confidence"
              style={{ width: `${confidence}%` }}
            />
          </div>
        </div>
      )}
      {detail && <p className="mt-2 text-xs text-slate-500">{detail}</p>}
    </Card>
  );
}

// ---------------------------------------------------------------------------
// InsightCard (DS-9)
// ---------------------------------------------------------------------------
interface InsightCardProps {
  title: string;
  insight: string;
  source?: string;
  tone?: "default" | "success" | "warning" | "error" | "ai";
  className?: string;
}

export function InsightCard({ title, insight, source, tone = "default", className }: InsightCardProps) {
  const tones: Record<string, string> = {
    default: "border-slate-700 bg-slate-900",
    success: "border-green-500/20 bg-green-500/5",
    warning: "border-amber-500/20 bg-amber-500/5",
    error:   "border-rose-500/20 bg-rose-500/5",
    ai:      "border-violet-500/20 bg-violet-500/5",
  };
  const icons: Record<string, string> = {
    default: "💡", success: "✅", warning: "⚠️", error: "🚨", ai: "🤖",
  };
  return (
    <article className={cx("rounded-xl border p-4", tones[tone], className)}>
      <div className="flex items-start gap-3">
        <span className="text-lg leading-none" aria-hidden>{icons[tone]}</span>
        <div>
          <p className="text-sm font-semibold text-slate-100">{title}</p>
          <p className="mt-1 text-sm leading-relaxed text-slate-400">{insight}</p>
          {source && <p className="mt-2 text-xs text-slate-600">{source}</p>}
        </div>
      </div>
    </article>
  );
}

// ---------------------------------------------------------------------------
// ConfidenceCard (DS-9)
// ---------------------------------------------------------------------------
interface ConfidenceCardProps {
  label: string;
  score: number;
  detail?: string;
  className?: string;
}

export function ConfidenceCard({ label, score, detail, className }: ConfidenceCardProps) {
  const clampedScore = Math.max(0, Math.min(100, score));
  const color = clampedScore >= 70 ? "text-green-400" : clampedScore >= 40 ? "text-amber-400" : "text-rose-400";
  const trackColor = clampedScore >= 70 ? "bg-green-400" : clampedScore >= 40 ? "bg-amber-400" : "bg-rose-400";
  return (
    <Card className={className}>
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-400">{label}</p>
        <p className={cx("text-xl font-bold tabular-nums", color)}>{clampedScore}%</p>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">
        <div className={cx("h-full rounded-full transition-all duration-slow", trackColor)} style={{ width: `${clampedScore}%` }} />
      </div>
      {detail && <p className="mt-2 text-xs text-slate-500">{detail}</p>}
    </Card>
  );
}

// ---------------------------------------------------------------------------
// AlertCard (DS-9)
// ---------------------------------------------------------------------------
interface AlertCardProps {
  title: string;
  message: string;
  tone?: "info" | "success" | "warning" | "error";
  action?: ReactNode;
  onDismiss?: () => void;
  className?: string;
}

export function AlertCard({ title, message, tone = "info", action, onDismiss, className }: AlertCardProps) {
  const tones: Record<string, { border: string; bg: string; icon: string; text: string }> = {
    info:    { border: "border-sky-500/30",   bg: "bg-sky-500/5",   icon: "ℹ️",  text: "text-sky-300"   },
    success: { border: "border-green-500/30", bg: "bg-green-500/5", icon: "✅",  text: "text-green-300" },
    warning: { border: "border-amber-500/30", bg: "bg-amber-500/5", icon: "⚠️",  text: "text-amber-300" },
    error:   { border: "border-rose-500/30",  bg: "bg-rose-500/5",  icon: "🚨",  text: "text-rose-300"  },
  };
  const t = tones[tone];
  return (
    <div role="alert" className={cx("rounded-xl border p-4", t.border, t.bg, className)}>
      <div className="flex items-start gap-3">
        <span className="text-base leading-none" aria-hidden>{t.icon}</span>
        <div className="flex-1">
          <p className={cx("text-sm font-semibold", t.text)}>{title}</p>
          <p className="mt-0.5 text-sm text-slate-400">{message}</p>
          {action && <div className="mt-3">{action}</div>}
        </div>
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="rounded p-0.5 text-slate-500 hover:text-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
            aria-label="Dismiss"
          >
            <svg viewBox="0 0 12 12" fill="none" className="h-3.5 w-3.5" aria-hidden>
              <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// ComparisonCard (DS-9)
// ---------------------------------------------------------------------------
interface ComparisonCardProps {
  label: string;
  items: Array<{ name: string; value: number; detail?: string }>;
  max?: number;
  className?: string;
}

export function ComparisonCard({ label, items, max, className }: ComparisonCardProps) {
  const maxVal = max ?? Math.max(...items.map((i) => i.value), 1);
  const chartColors = ["text-amber-400", "text-sky-400", "text-violet-400", "text-emerald-400", "text-rose-400"];
  return (
    <Card title={label} className={className}>
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={item.name}>
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="text-slate-400">{item.name}</span>
              <span className={cx("font-semibold tabular-nums", chartColors[i % chartColors.length])}>
                {item.value.toLocaleString()}
                {item.detail && <span className="ml-1 font-normal text-slate-500">{item.detail}</span>}
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
              <div
                className={cx("h-full rounded-full", chartColors[i % chartColors.length].replace("text-", "bg-"))}
                style={{ width: `${(item.value / maxVal) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// WidgetContainer (DS-9)
// ---------------------------------------------------------------------------
interface WidgetContainerProps {
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  loading?: boolean;
  empty?: boolean;
  emptyMessage?: string;
  className?: string;
}

export function WidgetContainer({
  title,
  subtitle,
  action,
  children,
  loading,
  empty,
  emptyMessage = "No data available",
  className,
}: WidgetContainerProps) {
  return (
    <div className={cx("rounded-2xl border border-slate-800 bg-slate-900", className)}>
      {(title || subtitle || action) && (
        <header className="flex items-center justify-between gap-4 border-b border-slate-800 px-5 py-4">
          <div>
            {title && <p className="text-sm font-semibold text-slate-100">{title}</p>}
            {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </header>
      )}
      <div className="p-5">
        {loading ? (
          <div className="flex items-center justify-center py-8" aria-live="polite" aria-busy>
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-700 border-t-amber-500" />
          </div>
        ) : empty ? (
          <p className="py-8 text-center text-sm text-slate-500">{emptyMessage}</p>
        ) : (
          children
        )}
      </div>
    </div>
  );
}
