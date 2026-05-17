import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { cx } from "./utils";

interface NavItem {
  label: string;
  href: string;
}

interface TopNavProps {
  brand: string;
  items: NavItem[];
  action?: ReactNode;
}

export function TopNav({ brand, items, action }: TopNavProps) {
  return (
    <nav className="flex items-center justify-between gap-6 rounded-xl border border-slate-800 bg-slate-900 px-4 py-3">
      <span className="font-semibold tracking-tight text-slate-50">{brand}</span>
      <ul className="hidden items-center gap-4 md:flex">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              to={item.href}
              className="text-sm text-slate-300 transition-colors hover:text-amber-400"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
      {action && <div>{action}</div>}
    </nav>
  );
}

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-slate-400">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-2">
              {item.href && !isLast ? (
                <Link to={item.href} className="hover:text-slate-200">
                  {item.label}
                </Link>
              ) : (
                <span className={cx(isLast && "text-slate-200")}>{item.label}</span>
              )}
              {!isLast && <span aria-hidden>/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  return (
    <nav aria-label="Pagination" className="mt-6 flex items-center justify-center gap-2">
      <button
        type="button"
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page <= 1}
        className="rounded-lg border border-slate-700 px-3 py-1.5 text-sm text-slate-300 hover:bg-slate-800 disabled:pointer-events-none disabled:opacity-40"
      >
        Previous
      </button>
      <span className="text-xs text-slate-400">
        Page {page} of {totalPages}
      </span>
      <button
        type="button"
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page >= totalPages}
        className="rounded-lg border border-slate-700 px-3 py-1.5 text-sm text-slate-300 hover:bg-slate-800 disabled:pointer-events-none disabled:opacity-40"
      >
        Next
      </button>
    </nav>
  );
}
