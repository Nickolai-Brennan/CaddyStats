import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "@/components/ui/utils";

interface AppShellProps extends HTMLAttributes<HTMLDivElement> {
  sidebar?: ReactNode;
  contextPanel?: ReactNode;
  footer?: ReactNode;
}

export function AppShell({
  sidebar,
  contextPanel,
  footer,
  className,
  children,
  ...props
}: AppShellProps) {
  return (
    <div className={cx("min-h-full bg-slate-950 text-slate-50", className)} {...props}>
      <div className="mx-auto grid min-h-full w-full max-w-[1600px] grid-cols-1 lg:grid-cols-[280px_1fr] 2xl:grid-cols-[280px_1fr_320px]">
        {sidebar && (
          <aside className="border-b border-slate-800/80 p-4 lg:border-b-0 lg:border-r" aria-label="Sidebar">
            {sidebar}
          </aside>
        )}

        <div className="flex min-h-full flex-col">
          <div className="flex-1 p-4 sm:p-6 lg:p-8">{children}</div>
          {footer && <footer className="border-t border-slate-800/80 p-4 sm:p-6">{footer}</footer>}
        </div>

        {contextPanel && (
          <aside
            className="border-t border-slate-800/80 p-4 lg:border-t-0 2xl:border-l"
            aria-label="Context panel"
          >
            {contextPanel}
          </aside>
        )}
      </div>
    </div>
  );
}

interface DashboardGridProps extends HTMLAttributes<HTMLDivElement> {
  columns?: 12 | 8 | 4;
}

export function DashboardGrid({ columns = 12, className, ...props }: DashboardGridProps) {
  const columnMap = {
    12: "grid-cols-4 sm:grid-cols-8 xl:grid-cols-12",
    8: "grid-cols-4 md:grid-cols-8",
    4: "grid-cols-4",
  } as const;

  return <div className={cx("grid gap-4", columnMap[columns], className)} {...props} />;
}

type MobileSpan = 1 | 2 | 3 | 4;
type TabletSpan = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
type DesktopSpan = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

const MOBILE_SPAN_CLASS: Record<MobileSpan, string> = {
  1: "col-span-1",
  2: "col-span-2",
  3: "col-span-3",
  4: "col-span-4",
};

const TABLET_SPAN_CLASS: Record<TabletSpan, string> = {
  1: "md:col-span-1",
  2: "md:col-span-2",
  3: "md:col-span-3",
  4: "md:col-span-4",
  5: "md:col-span-5",
  6: "md:col-span-6",
  7: "md:col-span-7",
  8: "md:col-span-8",
};

const DESKTOP_SPAN_CLASS: Record<DesktopSpan, string> = {
  1: "xl:col-span-1",
  2: "xl:col-span-2",
  3: "xl:col-span-3",
  4: "xl:col-span-4",
  5: "xl:col-span-5",
  6: "xl:col-span-6",
  7: "xl:col-span-7",
  8: "xl:col-span-8",
  9: "xl:col-span-9",
  10: "xl:col-span-10",
  11: "xl:col-span-11",
  12: "xl:col-span-12",
};

interface DashboardRegionProps extends HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  action?: ReactNode;
  span?: {
    mobile?: MobileSpan;
    tablet?: TabletSpan;
    desktop?: DesktopSpan;
  };
}

export function DashboardRegion({
  title,
  description,
  action,
  span,
  className,
  children,
  ...props
}: DashboardRegionProps) {
  const mobileSpan = MOBILE_SPAN_CLASS[span?.mobile ?? 4];
  const tabletSpan = TABLET_SPAN_CLASS[span?.tablet ?? 8];
  const desktopSpan = DESKTOP_SPAN_CLASS[span?.desktop ?? 12];

  return (
    <section
      className={cx(
        "rounded-2xl border border-slate-800 bg-slate-900/80 p-4 sm:p-5",
        mobileSpan,
        tabletSpan,
        desktopSpan,
        className
      )}
      {...props}
    >
      {(title || description || action) && (
        <header className="mb-4 flex items-start justify-between gap-4">
          <div>
            {title && <h2 className="text-base font-semibold text-slate-100 sm:text-lg">{title}</h2>}
            {description && <p className="mt-1 text-sm text-slate-400">{description}</p>}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </header>
      )}

      {children}
    </section>
  );
}

export function DashboardToolbar(props: DashboardRegionProps) {
  return <DashboardRegion {...props} span={{ mobile: 4, tablet: 8, desktop: 12 }} />;
}

export function DashboardHeroMetrics(props: DashboardRegionProps) {
  return <DashboardRegion {...props} span={{ mobile: 4, tablet: 8, desktop: 12 }} />;
}

export function DashboardChartRegion(props: DashboardRegionProps) {
  return <DashboardRegion {...props} span={{ mobile: 4, tablet: 8, desktop: 8 }} />;
}

export function DashboardDataRegion(props: DashboardRegionProps) {
  return <DashboardRegion {...props} span={{ mobile: 4, tablet: 8, desktop: 8 }} />;
}

export function DashboardActionRegion(props: DashboardRegionProps) {
  return <DashboardRegion {...props} span={{ mobile: 4, tablet: 8, desktop: 4 }} />;
}
