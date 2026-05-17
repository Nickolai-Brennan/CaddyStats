/**
 * EmptyState — displayed when a query returns no results
 */

interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: string;
  action?: React.ReactNode;
}

import { ReactNode } from "react";

export function EmptyState({
  title = "Nothing here yet",
  message = "No results match your current filters.",
  icon = "🏌️",
  action,
}: EmptyStateProps & { action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 text-4xl" aria-hidden>
        {icon}
      </div>
      <h3 className="mb-2 text-lg font-semibold text-slate-200">{title}</h3>
      <p className="mb-6 max-w-sm text-sm text-slate-400">{message}</p>
      {action}
    </div>
  );
}
