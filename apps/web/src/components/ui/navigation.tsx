/**
 * DS-7 Navigation Components
 *
 * TopNav        — sticky top bar with brand, links, auth actions
 * Breadcrumbs   — trail breadcrumb bar (aria-label="Breadcrumb")
 * Pagination    — prev / next page controls
 * CommandPalette — Cmd+K search/action overlay
 * ProfileMenu   — dropdown for authenticated users
 * MobileNav     — bottom navigation bar for small screens
 */

import { useState, useEffect, useRef, type KeyboardEvent } from "react";
import { Link } from "@tanstack/react-router";
import { cx } from "./utils";
import {
  IconSearch,
  IconHome,
  IconTrophy,
  IconTrends,
  IconContent,
  IconUser,
  IconLogOut,
  IconSettings,
  IconCommand,
  IconDashboard,
  IconModels,
  IconDollar,
  IconClose,
} from "@/components/icons";
import type { LucideIcon } from "@/components/icons";

// ---------------------------------------------------------------------------
// TopNav
// ---------------------------------------------------------------------------
interface NavItem {
  label: string;
  href: string;
}

interface TopNavProps {
  brand?: string;
  items?: NavItem[];
  onCommandOpen?: () => void;
  isAuthenticated?: boolean;
  userName?: string;
  /** @deprecated Pass isAuthenticated + userName instead. Kept for backwards compat. */
  action?: React.ReactNode;
}

export function TopNav({
  brand = "CaddyStats",
  items = [],
  onCommandOpen,
  isAuthenticated,
  userName,
  action,
}: TopNavProps) {
  return (
    <nav className="flex items-center justify-between gap-4 rounded-xl border border-slate-800 bg-surface-raised px-4 py-3">
      <span className="font-semibold tracking-tight text-slate-50">{brand}</span>

      {items.length > 0 && (
        <ul className="hidden items-center gap-4 md:flex">
          {items.map((item) => (
            <li key={item.href}>
              <Link
                to={item.href}
                className="text-sm text-slate-300 transition-colors hover:text-brand-400"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      )}

      <div className="flex items-center gap-2">
        {/* Command palette trigger */}
        {onCommandOpen && (
          <button
            type="button"
            onClick={onCommandOpen}
            className="hidden items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-1.5 text-sm text-slate-400 transition-colors hover:border-slate-600 hover:text-slate-200 md:flex"
            aria-label="Open command palette (Ctrl K)"
          >
            <IconSearch size={13} />
            <span>Search…</span>
            <kbd className="ml-2 rounded bg-slate-700 px-1.5 py-0.5 text-[10px] font-mono text-slate-500">
              ⌘K
            </kbd>
          </button>
        )}

        {/* Auth */}
        {action ? (
          <div>{action}</div>
        ) : isAuthenticated ? (
          <ProfileMenu userName={userName} />
        ) : (
          <Link
            to="/login"
            className="rounded-lg bg-brand-500 px-3 py-1.5 text-sm font-medium text-slate-950 transition-colors hover:bg-brand-400"
          >
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
}

// ---------------------------------------------------------------------------
// Breadcrumbs
// ---------------------------------------------------------------------------
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
                <Link to={item.href} className="transition-colors hover:text-slate-200">
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

// ---------------------------------------------------------------------------
// Pagination
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// ProfileMenu
// ---------------------------------------------------------------------------
interface ProfileMenuProps {
  userName?: string;
}

interface ProfileAction {
  label: string;
  href?: string;
  Icon: LucideIcon;
  danger?: boolean;
  onClick?: () => void;
}

const profileActions: ProfileAction[] = [
  { label: "Account",  href: "/account",         Icon: IconUser     },
  { label: "Settings", href: "/account/settings", Icon: IconSettings },
  { label: "Sign Out", Icon: IconLogOut, danger: true },
];

export function ProfileMenu({ userName = "User" }: ProfileMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close on Escape
  function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Escape") setOpen(false);
  }

  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div ref={menuRef} className="relative" onKeyDown={handleKeyDown}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-500/20 text-xs font-semibold text-brand-400 ring-2 ring-transparent transition-all hover:ring-brand-500/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        aria-label="Profile menu"
        aria-haspopup="true"
        aria-expanded={open}
      >
        {initials}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-10 z-50 w-48 rounded-xl border border-slate-700 bg-surface-overlay py-1 shadow-xl"
        >
          <div className="border-b border-slate-700 px-3 py-2">
            <p className="text-xs font-semibold text-slate-200">{userName}</p>
          </div>
          {profileActions.map((action) => {
            const content = (
              <>
                <action.Icon size={14} className={action.danger ? "text-red-400" : "text-slate-400"} />
                <span>{action.label}</span>
              </>
            );
            const itemClass = cx(
              "flex w-full items-center gap-2.5 px-3 py-2 text-sm transition-colors",
              "focus-visible:outline-none focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-brand-500",
              action.danger
                ? "text-red-400 hover:bg-red-500/10"
                : "text-slate-300 hover:bg-slate-800 hover:text-slate-50"
            );
            return action.href ? (
              <Link
                key={action.label}
                to={action.href}
                role="menuitem"
                className={itemClass}
                onClick={() => setOpen(false)}
              >
                {content}
              </Link>
            ) : (
              <button
                key={action.label}
                type="button"
                role="menuitem"
                className={itemClass}
                onClick={() => { action.onClick?.(); setOpen(false); }}
              >
                {content}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// CommandPalette
// ---------------------------------------------------------------------------
interface CommandResult {
  id: string;
  label: string;
  description?: string;
  href?: string;
  Icon: LucideIcon;
  onSelect?: () => void;
}

const defaultCommands: CommandResult[] = [
  { id: "home",        label: "Home",        href: "/",            Icon: IconHome       },
  { id: "dashboard",   label: "Dashboard",   href: "/",            Icon: IconDashboard  },
  { id: "tournaments", label: "Tournaments", href: "/tournaments", Icon: IconTrophy     },
  { id: "rankings",    label: "Rankings",    href: "/rankings",    Icon: IconTrends     },
  { id: "articles",    label: "Analysis",    href: "/articles",    Icon: IconContent    },
  { id: "projections", label: "Projections", href: "/projections", Icon: IconModels     },
  { id: "betting",     label: "Betting",     href: "/betting",     Icon: IconDollar     },
];

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  commands?: CommandResult[];
}

export function CommandPalette({
  open,
  onClose,
  commands = defaultCommands,
}: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const filtered = query.trim()
    ? commands.filter(
        (c) =>
          c.label.toLowerCase().includes(query.toLowerCase()) ||
          c.description?.toLowerCase().includes(query.toLowerCase())
      )
    : commands;

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Global Cmd+K / Ctrl+K
  useEffect(() => {
    function handler(e: globalThis.KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (!open) return; // parent toggles open state
        onClose();
      }
      if (e.key === "Escape" && open) onClose();
    }
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % filtered.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + filtered.length) % filtered.length);
    } else if (e.key === "Enter" && filtered[activeIndex]) {
      handleSelect(filtered[activeIndex]);
    }
  }

  function handleSelect(cmd: CommandResult) {
    cmd.onSelect?.();
    onClose();
  }

  if (!open) return null;

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]"
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-slate-700 bg-surface-overlay shadow-2xl">
        {/* Search input */}
        <div className="flex items-center gap-3 border-b border-slate-700 px-4 py-3.5">
          <IconSearch size={16} className="shrink-0 text-slate-400" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setActiveIndex(0); }}
            onKeyDown={handleKeyDown}
            placeholder="Search pages, actions…"
            className="flex-1 bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
            aria-autocomplete="list"
            aria-controls="command-list"
            aria-activedescendant={filtered[activeIndex] ? `cmd-${filtered[activeIndex].id}` : undefined}
          />
          <button
            type="button"
            onClick={onClose}
            className="rounded p-0.5 text-slate-500 hover:text-slate-200"
            aria-label="Close command palette"
          >
            <IconClose size={14} />
          </button>
        </div>

        {/* Results */}
        <ul id="command-list" role="listbox" className="max-h-72 overflow-y-auto py-1.5">
          {filtered.length === 0 ? (
            <li className="px-4 py-6 text-center text-sm text-slate-500">
              No results for "{query}"
            </li>
          ) : (
            filtered.map((cmd, i) =>
              cmd.href ? (
                <li
                  key={cmd.id}
                  id={`cmd-${cmd.id}`}
                  role="option"
                  aria-selected={i === activeIndex}
                >
                  <Link
                    to={cmd.href}
                    onClick={() => handleSelect(cmd)}
                    className={cx(
                      "flex items-center gap-3 px-4 py-2.5 text-sm transition-colors",
                      i === activeIndex
                        ? "bg-brand-500/15 text-brand-400"
                        : "text-slate-300 hover:bg-slate-800"
                    )}
                  >
                    <cmd.Icon size={15} className="shrink-0 text-slate-500" />
                    <span>{cmd.label}</span>
                    {cmd.description && (
                      <span className="ml-auto text-xs text-slate-500">{cmd.description}</span>
                    )}
                  </Link>
                </li>
              ) : (
                <li
                  key={cmd.id}
                  id={`cmd-${cmd.id}`}
                  role="option"
                  aria-selected={i === activeIndex}
                >
                  <button
                    type="button"
                    onClick={() => handleSelect(cmd)}
                    className={cx(
                      "flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-colors",
                      i === activeIndex
                        ? "bg-brand-500/15 text-brand-400"
                        : "text-slate-300 hover:bg-slate-800"
                    )}
                  >
                    <cmd.Icon size={15} className="shrink-0 text-slate-500" />
                    <span>{cmd.label}</span>
                  </button>
                </li>
              )
            )
          )}
        </ul>

        {/* Footer hint */}
        <div className="border-t border-slate-800 px-4 py-2 text-[10px] text-slate-600 flex gap-4">
          <span>↑↓ navigate</span>
          <span>↵ select</span>
          <span>Esc close</span>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// MobileNav — bottom navigation bar (≤ md breakpoint)
// ---------------------------------------------------------------------------
interface MobileNavItem {
  label: string;
  href: string;
  Icon: LucideIcon;
}

const mobileItems: MobileNavItem[] = [
  { label: "Home",       href: "/",            Icon: IconHome       },
  { label: "Rankings",   href: "/rankings",    Icon: IconTrends     },
  { label: "Analysis",   href: "/articles",    Icon: IconContent    },
  { label: "Projections",href: "/projections", Icon: IconModels     },
  { label: "Account",    href: "/account",     Icon: IconUser       },
];

interface MobileNavProps {
  currentPath: string;
  onCommandOpen?: () => void;
}

export function MobileNav({ currentPath, onCommandOpen }: MobileNavProps) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-800 bg-surface-raised md:hidden"
      aria-label="Mobile navigation"
    >
      <ul className="flex items-stretch">
        {mobileItems.map((item) => {
          const isActive =
            item.href === "/" ? currentPath === "/" : currentPath.startsWith(item.href);
          return (
            <li key={item.href} className="flex-1">
              <Link
                to={item.href}
                className={cx(
                  "flex flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-medium transition-colors",
                  isActive
                    ? "text-brand-400"
                    : "text-slate-500 hover:text-slate-200"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                <item.Icon size={18} />
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
        {onCommandOpen && (
          <li className="flex-1">
            <button
              type="button"
              onClick={onCommandOpen}
              className="flex w-full flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-medium text-slate-500 hover:text-slate-200 transition-colors"
              aria-label="Open command palette"
            >
              <IconCommand size={18} />
              <span>Search</span>
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
}
