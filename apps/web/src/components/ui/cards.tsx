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
