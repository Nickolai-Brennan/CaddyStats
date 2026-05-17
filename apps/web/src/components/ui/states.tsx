import type { ReactNode } from "react";
import { Button, Skeleton } from "./primitives";

interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: string;
  action?: ReactNode;
}

export function EmptyState({
  title = "Nothing to show",
  message = "No results match your current filters.",
  icon = "🏌️",
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 text-4xl" aria-hidden>
        {icon}
      </div>
      <h3 className="mb-2 text-lg font-semibold text-slate-200">{title}</h3>
      <p className="mb-6 max-w-md text-sm text-slate-400">{message}</p>
      {action}
    </div>
  );
}

interface LoadingStateProps {
  rows?: number;
  columns?: number;
  message?: string;
}

export function LoadingState({ rows = 3, columns = 3, message }: LoadingStateProps) {
  return (
    <div className="space-y-4" aria-live="polite" aria-busy="true">
      <div
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: rows * columns }).map((_, index) => (
          <div key={index} className="rounded-xl border border-slate-800 bg-slate-900 p-4">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="mt-3 h-8 w-2/3" />
            <Skeleton className="mt-2 h-3 w-full" />
          </div>
        ))}
      </div>
      {message && <p className="text-center text-sm text-slate-500">{message}</p>}
    </div>
  );
}

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Something went wrong",
  message = "We couldn't load this content. Please try again.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 text-4xl" aria-hidden>
        ⚠️
      </div>
      <h3 className="mb-2 text-lg font-semibold text-slate-200">{title}</h3>
      <p className="mb-6 max-w-md text-sm text-slate-400">{message}</p>
      {onRetry && <Button onClick={onRetry}>Try again</Button>}
    </div>
  );
}
