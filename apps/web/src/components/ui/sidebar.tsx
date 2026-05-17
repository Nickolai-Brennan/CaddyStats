/**
 * DS-7 Sidebar Navigation
 *
 * Collapsible sidebar with:
 * - Pinned + collapsible states
 * - Section grouping (main / tools / admin)
 * - Active-link highlighting via TanStack Router
 * - Keyboard accessible (aria-expanded, focus management)
 */

import { useState } from "react";
import { Link, useRouter } from "@tanstack/react-router";
import { cx } from "./utils";
import {
  IconDashboard,
  IconSearch,
  IconModels,
  IconTrends,
  IconField,
  IconTrophy,
  IconFlag,
  IconDollar,
  IconEdge,
  IconAI,
  IconContent,
  IconUsers,
  IconSettings,
  IconAudit,
  IconPanelLeft,
  IconChevronRight,
} from "@/components/icons";
import type { LucideIcon } from "@/components/icons";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface NavItemDef {
  label: string;
  href: string;
  Icon: LucideIcon;
  badge?: string;
  requiresAuth?: boolean;
}

interface NavSection {
  label: string;
  items: NavItemDef[];
}

// ---------------------------------------------------------------------------
// Navigation definition
// ---------------------------------------------------------------------------
const sections: NavSection[] = [
  {
    label: "Main",
    items: [
      { label: "Dashboard",   href: "/",            Icon: IconDashboard },
      { label: "Players",     href: "/players",     Icon: IconField     },
      { label: "Tournaments", href: "/tournaments", Icon: IconTrophy    },
      { label: "Rankings",    href: "/rankings",    Icon: IconTrends    },
      { label: "Courses",     href: "/courses",     Icon: IconFlag      },
    ],
  },
  {
    label: "Analytics",
    items: [
      { label: "Projections", href: "/projections", Icon: IconModels,  requiresAuth: true },
      { label: "Models",      href: "/models",      Icon: IconAI,      requiresAuth: true },
      { label: "Betting",     href: "/betting",     Icon: IconDollar,  requiresAuth: true },
      { label: "Edge Finder", href: "/edge",        Icon: IconEdge,    requiresAuth: true },
    ],
  },
  {
    label: "Content",
    items: [
      { label: "Analysis",    href: "/articles",   Icon: IconContent  },
      { label: "Search",      href: "/search",     Icon: IconSearch   },
    ],
  },
  {
    label: "Admin",
    items: [
      { label: "Users",       href: "/admin/users",    Icon: IconUsers,    requiresAuth: true },
      { label: "Settings",    href: "/admin/settings", Icon: IconSettings, requiresAuth: true },
      { label: "Audit",       href: "/admin/audit",    Icon: IconAudit,    requiresAuth: true },
    ],
  },
];

// ---------------------------------------------------------------------------
// Components
// ---------------------------------------------------------------------------

interface SidebarItemProps {
  item: NavItemDef;
  collapsed: boolean;
  isActive: boolean;
}

function SidebarItem({ item, collapsed, isActive }: SidebarItemProps) {
  return (
    <li>
      <Link
        to={item.href}
        title={collapsed ? item.label : undefined}
        className={cx(
          "group flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500",
          isActive
            ? "bg-brand-500/15 text-brand-400"
            : "text-slate-400 hover:bg-slate-800 hover:text-slate-100",
          collapsed && "justify-center px-2"
        )}
        aria-current={isActive ? "page" : undefined}
      >
        <item.Icon
          size={16}
          className={cx(
            "shrink-0",
            isActive ? "text-brand-400" : "text-slate-500 group-hover:text-slate-300"
          )}
        />
        {!collapsed && <span className="truncate">{item.label}</span>}
        {!collapsed && item.badge && (
          <span className="ml-auto rounded-full bg-brand-500/20 px-1.5 py-0.5 text-xs font-semibold text-brand-400">
            {item.badge}
          </span>
        )}
      </Link>
    </li>
  );
}

interface SidebarSectionProps {
  section: NavSection;
  collapsed: boolean;
  currentPath: string;
}

function SidebarSection({ section, collapsed, currentPath }: SidebarSectionProps) {
  return (
    <div className="space-y-0.5">
      {!collapsed && (
        <p className="mb-1 px-2.5 text-[10px] font-semibold uppercase tracking-widest text-slate-600">
          {section.label}
        </p>
      )}
      <ul className="space-y-0.5" role="list">
        {section.items.map((item) => (
          <SidebarItem
            key={item.href}
            item={item}
            collapsed={collapsed}
            isActive={
              item.href === "/"
                ? currentPath === "/"
                : currentPath.startsWith(item.href)
            }
          />
        ))}
      </ul>
    </div>
  );
}

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();
  const currentPath = router.state.location.pathname;

  return (
    <aside
      className={cx(
        "flex h-full flex-col border-r border-slate-800 bg-surface-raised transition-[width] duration-200",
        collapsed ? "w-[3.5rem]" : "w-[15rem]",
        className
      )}
      aria-label="Main navigation"
    >
      {/* Logo / brand row */}
      <div
        className={cx(
          "flex h-14 shrink-0 items-center border-b border-slate-800 px-3",
          collapsed ? "justify-center" : "justify-between gap-2"
        )}
      >
        {!collapsed && (
          <span className="text-sm font-bold tracking-tight text-slate-50">CaddyStats</span>
        )}
        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          className="rounded-md p-1.5 text-slate-500 hover:bg-slate-800 hover:text-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-expanded={!collapsed}
        >
          {collapsed ? (
            <IconChevronRight size={15} />
          ) : (
            <IconPanelLeft size={15} />
          )}
        </button>
      </div>

      {/* Scrollable nav sections */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-3">
        <div className="space-y-4">
          {sections.map((section) => (
            <SidebarSection
              key={section.label}
              section={section}
              collapsed={collapsed}
              currentPath={currentPath}
            />
          ))}
        </div>
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="shrink-0 border-t border-slate-800 px-3 py-2.5">
          <p className="text-[10px] text-slate-600">v1.0 · CaddyStats</p>
        </div>
      )}
    </aside>
  );
}
