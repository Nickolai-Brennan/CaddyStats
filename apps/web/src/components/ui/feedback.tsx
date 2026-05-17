/**
 * DS-15 Feedback Components
 *
 * Toast / ToastProvider  — stacked slide-in notifications with auto-dismiss
 * Banner                 — full-width site/page-level alert bar
 * useToast               — hook to trigger toasts from anywhere
 */

import {
  useState,
  useCallback,
  useEffect,
  createContext,
  useContext,
  type ReactNode,
} from "react";
import { cx } from "./utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export type ToastTone = "info" | "success" | "warning" | "error";

export interface ToastItem {
  id: string;
  title: string;
  message?: string;
  tone?: ToastTone;
  duration?: number;
  action?: { label: string; onClick: () => void };
}

interface ToastContextValue {
  toast: (item: Omit<ToastItem, "id">) => void;
  dismiss: (id: string) => void;
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------
const ToastContext = createContext<ToastContextValue | null>(null);

// ---------------------------------------------------------------------------
// ToastProvider (DS-15)
// ---------------------------------------------------------------------------
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((item: Omit<ToastItem, "id">) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const duration = item.duration ?? 5000;
    setToasts((prev) => [...prev.slice(-4), { ...item, id, duration }]);
    if (duration > 0) {
      setTimeout(() => dismiss(id), duration);
    }
  }, [dismiss]);

  return (
    <ToastContext value={{ toast, dismiss }}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </ToastContext>
  );
}

// ---------------------------------------------------------------------------
// useToast (DS-15)
// ---------------------------------------------------------------------------
export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}

// ---------------------------------------------------------------------------
// ToastViewport — renders the toast stack
// ---------------------------------------------------------------------------
const toastTones: Record<ToastTone, { border: string; icon: string; title: string }> = {
  info:    { border: "border-sky-500/30",   icon: "ℹ️",  title: "text-sky-200"   },
  success: { border: "border-green-500/30", icon: "✅",  title: "text-green-200" },
  warning: { border: "border-amber-500/30", icon: "⚠️",  title: "text-amber-200" },
  error:   { border: "border-rose-500/30",  icon: "🚨",  title: "text-rose-200"  },
};

interface ToastViewportProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}

function ToastViewport({ toasts, onDismiss }: ToastViewportProps) {
  return (
    <div
      aria-live="polite"
      aria-label="Notifications"
      className="pointer-events-none fixed bottom-4 right-4 z-[80] flex flex-col-reverse gap-2"
      style={{ maxWidth: "min(calc(100vw - 2rem), 24rem)" }}
    >
      {toasts.map((t) => (
        <ToastCard key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function ToastCard({ toast: t, onDismiss }: { toast: ToastItem; onDismiss: (id: string) => void }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const tone = toastTones[t.tone ?? "info"];

  return (
    <div
      role="status"
      className={cx(
        "pointer-events-auto flex w-full items-start gap-3 rounded-xl border bg-slate-900 px-4 py-3 shadow-xl transition-all duration-default",
        tone.border,
        visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
      )}
    >
      <span className="shrink-0 text-base leading-tight" aria-hidden>{tone.icon}</span>
      <div className="flex-1 min-w-0">
        <p className={cx("text-sm font-semibold", tone.title)}>{t.title}</p>
        {t.message && <p className="mt-0.5 text-xs text-slate-400">{t.message}</p>}
        {t.action && (
          <button
            type="button"
            onClick={() => { t.action!.onClick(); onDismiss(t.id); }}
            className="mt-2 text-xs font-medium text-amber-400 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
          >
            {t.action.label}
          </button>
        )}
      </div>
      <button
        type="button"
        onClick={() => onDismiss(t.id)}
        className="shrink-0 rounded p-0.5 text-slate-500 hover:text-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
        aria-label="Dismiss notification"
      >
        <svg viewBox="0 0 12 12" fill="none" className="h-3 w-3" aria-hidden>
          <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Banner (DS-15)
// ---------------------------------------------------------------------------
interface BannerProps {
  title?: string;
  message: string;
  tone?: ToastTone;
  action?: { label: string; onClick: () => void; href?: string };
  onDismiss?: () => void;
  className?: string;
  sticky?: boolean;
}

export function Banner({
  title,
  message,
  tone = "info",
  action,
  onDismiss,
  className,
  sticky,
}: BannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const tones: Record<ToastTone, { bg: string; text: string; icon: string; dismiss: string }> = {
    info:    { bg: "bg-sky-500",   text: "text-sky-950",   icon: "ℹ️",  dismiss: "hover:bg-sky-600"   },
    success: { bg: "bg-green-500", text: "text-green-950", icon: "✅",  dismiss: "hover:bg-green-600" },
    warning: { bg: "bg-amber-500", text: "text-amber-950", icon: "⚠️",  dismiss: "hover:bg-amber-600" },
    error:   { bg: "bg-rose-500",  text: "text-white",     icon: "🚨",  dismiss: "hover:bg-rose-600"  },
  };
  const t = tones[tone];

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss?.();
  };

  return (
    <div
      role="banner"
      className={cx(
        "flex items-center gap-3 px-4 py-2.5 text-sm font-medium",
        t.bg,
        t.text,
        sticky && "sticky top-0 z-30",
        className
      )}
    >
      <span aria-hidden>{t.icon}</span>
      <div className="flex flex-1 flex-wrap items-center gap-x-3 gap-y-0.5">
        {title && <span className="font-semibold">{title}</span>}
        <span>{message}</span>
        {action && (
          action.href ? (
            <a
              href={action.href}
              className="underline underline-offset-2 hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30"
            >
              {action.label}
            </a>
          ) : (
            <button
              type="button"
              onClick={action.onClick}
              className="underline underline-offset-2 hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30"
            >
              {action.label}
            </button>
          )
        )}
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss banner"
          className={cx("shrink-0 rounded p-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30", t.dismiss)}
        >
          <svg viewBox="0 0 12 12" fill="none" className="h-3.5 w-3.5" aria-hidden>
            <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </div>
  );
}
