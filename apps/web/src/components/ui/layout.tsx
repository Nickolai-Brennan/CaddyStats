import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "./utils";

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  size?: "narrow" | "default" | "wide";
}

export function Container({ children, className, size = "default", ...props }: ContainerProps) {
  const sizes = {
    narrow: "max-w-3xl",
    default: "max-w-6xl",
    wide: "max-w-7xl",
  } as const;

  return (
    <div className={cx("mx-auto w-full px-4 sm:px-6 lg:px-8", sizes[size], className)} {...props}>
      {children}
    </div>
  );
}

interface SectionProps extends HTMLAttributes<HTMLElement> {
  title?: string;
  subtitle?: string;
  action?: ReactNode;
}

export function Section({ title, subtitle, action, className, children, ...props }: SectionProps) {
  return (
    <section className={cx("space-y-6", className)} {...props}>
      {(title || subtitle || action) && (
        <header className="flex items-end justify-between gap-4">
          <div>
            {title && <h2 className="text-2xl font-bold tracking-tight text-slate-50">{title}</h2>}
            {subtitle && <p className="mt-1 text-sm text-slate-400">{subtitle}</p>}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </header>
      )}
      {children}
    </section>
  );
}

interface StackProps extends HTMLAttributes<HTMLDivElement> {
  gap?: "sm" | "md" | "lg";
}

export function Stack({ className, gap = "md", ...props }: StackProps) {
  const gaps = {
    sm: "space-y-2",
    md: "space-y-4",
    lg: "space-y-8",
  } as const;

  return <div className={cx(gaps[gap], className)} {...props} />;
}
