/**
 * DS-8 Overlay Components
 *
 * Modal  — centered dialog with backdrop
 * Drawer — side-sheet panel (right or left)
 *
 * Both use native dialog for accessibility (focus trap, Esc close).
 */

import { useEffect, useRef, type ReactNode } from "react";
import { cx } from "./utils";

// ---------------------------------------------------------------------------
// Modal (DS-8)
// ---------------------------------------------------------------------------
interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  size?: "sm" | "md" | "lg" | "xl";
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export function Modal({
  open,
  onClose,
  title,
  description,
  size = "md",
  children,
  footer,
  className,
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open) {
      if (!dialog.open) dialog.showModal();
    } else {
      if (dialog.open) dialog.close();
    }
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleClose = () => onClose();
    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, [onClose]);

  const sizes: Record<string, string> = {
    sm: "max-w-sm",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  return (
    <dialog
      ref={dialogRef}
      className={cx(
        "m-auto w-full rounded-2xl border border-slate-700 bg-slate-900 p-0 shadow-2xl backdrop:bg-black/60 backdrop:backdrop-blur-sm open:animate-scale-in",
        sizes[size],
        className
      )}
      onCancel={(e) => { e.preventDefault(); onClose(); }}
      onClick={(e) => { if (e.target === dialogRef.current) onClose(); }}
    >
      {(title || description) && (
        <header className="flex items-start justify-between gap-4 border-b border-slate-800 px-6 py-4">
          <div>
            {title && <h2 className="text-lg font-semibold text-slate-100">{title}</h2>}
            {description && <p className="mt-0.5 text-sm text-slate-400">{description}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
            aria-label="Close modal"
          >
            <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4" aria-hidden>
              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </header>
      )}
      <div className="px-6 py-5">{children}</div>
      {footer && (
        <footer className="flex justify-end gap-2 border-t border-slate-800 px-6 py-4">
          {footer}
        </footer>
      )}
    </dialog>
  );
}

// ---------------------------------------------------------------------------
// Drawer (DS-8)
// ---------------------------------------------------------------------------
interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  side?: "left" | "right";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export function Drawer({
  open,
  onClose,
  title,
  side = "right",
  size = "md",
  children,
  footer,
  className,
}: DrawerProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open) {
      if (!dialog.open) dialog.showModal();
    } else {
      if (dialog.open) dialog.close();
    }
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleClose = () => onClose();
    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, [onClose]);

  const widths: Record<string, string> = {
    sm: "max-w-xs",
    md: "max-w-sm",
    lg: "max-w-md",
  };

  const placement = side === "left"
    ? "ml-0 mr-auto inset-y-0 left-0 rounded-r-2xl animate-slide-right"
    : "mr-0 ml-auto inset-y-0 right-0 rounded-l-2xl animate-slide-left";

  return (
    <dialog
      ref={dialogRef}
      className={cx(
        "m-0 h-full w-full border border-slate-700 bg-slate-900 p-0 shadow-2xl backdrop:bg-black/60 backdrop:backdrop-blur-sm",
        widths[size],
        placement,
        className
      )}
      onCancel={(e) => { e.preventDefault(); onClose(); }}
      onClick={(e) => { if (e.target === dialogRef.current) onClose(); }}
    >
      <div className="flex h-full flex-col overflow-hidden">
        {title && (
          <header className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
            <h2 className="text-base font-semibold text-slate-100">{title}</h2>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
              aria-label="Close drawer"
            >
              <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4" aria-hidden>
                <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </header>
        )}
        <div className="flex-1 overflow-y-auto px-5 py-5">{children}</div>
        {footer && (
          <footer className="border-t border-slate-800 px-5 py-4">{footer}</footer>
        )}
      </div>
    </dialog>
  );
}
