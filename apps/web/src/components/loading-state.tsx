/**
 * LoadingState — skeleton placeholders while data is fetching
 */

interface LoadingStateProps {
  message?: string;
  count?: number;
  variant?: "card" | "article" | "inline";
}

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-xl border border-slate-800 bg-slate-900 overflow-hidden">
      <div className="aspect-[16/9] bg-slate-800" />
      <div className="p-5 space-y-3">
        <div className="h-4 w-1/4 rounded bg-slate-800" />
        <div className="h-5 w-3/4 rounded bg-slate-800" />
        <div className="h-4 w-full rounded bg-slate-800" />
        <div className="h-4 w-2/3 rounded bg-slate-800" />
        <div className="mt-4 h-3 w-1/3 rounded bg-slate-800" />
      </div>
    </div>
  );
}

function SkeletonInline() {
  return (
    <div className="animate-pulse flex items-center gap-3">
      <div className="h-4 w-4 rounded-full bg-slate-800" />
      <div className="h-4 flex-1 rounded bg-slate-800" />
    </div>
  );
}

export function LoadingState({ message, count = 6, variant = "card" }: LoadingStateProps) {
  if (variant === "inline") {
    return (
      <div className="space-y-3 py-4">
        {Array.from({ length: count }).map((_, i) => (
          <SkeletonInline key={i} />
        ))}
        {message && <p className="text-center text-sm text-slate-500 pt-2">{message}</p>}
      </div>
    );
  }

  if (variant === "article") {
    return (
      <div className="animate-pulse space-y-6 max-w-3xl mx-auto py-8">
        <div className="h-8 w-3/4 rounded bg-slate-800" />
        <div className="h-4 w-1/2 rounded bg-slate-800" />
        <div className="aspect-[16/7] rounded-xl bg-slate-800" />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 w-full rounded bg-slate-800" />
            <div className="h-4 w-5/6 rounded bg-slate-800" />
            <div className="h-4 w-4/6 rounded bg-slate-800" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: count }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
      {message && <p className="mt-6 text-center text-sm text-slate-500">{message}</p>}
    </div>
  );
}
