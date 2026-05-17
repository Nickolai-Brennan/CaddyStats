import type { FormHTMLAttributes, ReactNode } from "react";
import { cx } from "./utils";

interface FormFieldProps {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
}

export function FormField({ label, htmlFor, hint, error, required, children }: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="block text-xs font-medium text-slate-300">
        {label}
        {required ? <span className="ml-1 text-amber-400">*</span> : null}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-slate-500">{hint}</p>}
      {error && <p className="text-xs text-rose-400">{error}</p>}
    </div>
  );
}

interface FormShellProps extends FormHTMLAttributes<HTMLFormElement> {
  title?: string;
  description?: string;
}

export function FormShell({ title, description, className, children, ...props }: FormShellProps) {
  return (
    <form
      className={cx("space-y-4 rounded-2xl border border-slate-800 bg-slate-900 p-6", className)}
      {...props}
    >
      {(title || description) && (
        <header>
          {title && <h2 className="text-lg font-semibold text-slate-100">{title}</h2>}
          {description && <p className="mt-1 text-sm text-slate-400">{description}</p>}
        </header>
      )}
      {children}
    </form>
  );
}

export function FormActions({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap items-center justify-end gap-2 pt-2">{children}</div>;
}
