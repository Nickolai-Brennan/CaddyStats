/**
 * ErrorState — displayed when a data fetch fails
 */

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
      <p className="mb-6 max-w-sm text-sm text-slate-400">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="rounded-lg bg-slate-800 px-5 py-2 text-sm font-medium text-slate-200 hover:bg-slate-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
        >
          Try again
        </button>
      )}
    </div>
  );
}
