/**
 * Root Layout
 *
 * DS-7 shell: sticky top bar + collapsible sidebar + main content area.
 * CommandPalette and MobileNav wired in here so they are available globally.
 */

import { useState, useEffect } from "react";
import { Outlet, useRouter } from "@tanstack/react-router";
import { useAuth } from "@/contexts/auth";
import { Sidebar } from "@/components/ui/sidebar";
import { CommandPalette, MobileNav } from "@/components/ui/navigation";
import { IconBell, IconSearch } from "@/components/icons";

export function RootLayout() {
  const { isAuthenticated, user } = useAuth();
  const [commandOpen, setCommandOpen] = useState(false);
  const [isHeaderSticky, setIsHeaderSticky] = useState(false);
  const router = useRouter();
  const currentPath = router.state.location.pathname;

  // Sticky header shadow on scroll
  useEffect(() => {
    const handleScroll = () => setIsHeaderSticky(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Global Cmd+K / Ctrl+K
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandOpen((o) => !o);
      }
    }
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-surface-base text-slate-50">
      {/* ── Sidebar ── */}
      <Sidebar className="hidden md:flex" />

      {/* ── Main column ── */}
      <div className="flex flex-1 flex-col overflow-hidden">

        {/* Top bar */}
        <header
          className={`z-40 shrink-0 transition-shadow duration-200 ${
            isHeaderSticky ? "shadow-lg shadow-black/30" : ""
          } border-b border-slate-800 bg-surface-raised`}
        >
          <div className="flex h-14 items-center justify-between gap-4 px-4">
            {/* Mobile brand */}
            <div className="flex items-center gap-2 md:hidden">
              <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600" />
              <span className="text-sm font-bold tracking-tight">CaddyStats</span>
            </div>

            {/* Search trigger (desktop) */}
            <button
              type="button"
              onClick={() => setCommandOpen(true)}
              className="hidden items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-sm text-slate-400 transition-colors hover:border-slate-600 hover:text-slate-200 md:flex"
              aria-label="Open command palette (⌘K)"
            >
              <IconSearch size={13} />
              <span>Search…</span>
              <kbd className="ml-2 rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-mono text-slate-500">
                ⌘K
              </kbd>
            </button>

            {/* Right-side actions */}
            <div className="ml-auto flex items-center gap-3">
              <button
                type="button"
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                aria-label="Notifications"
              >
                <IconBell size={16} />
              </button>

              {isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <span className="hidden text-xs text-slate-400 md:block">{user?.name}</span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-500/20 text-xs font-semibold text-brand-400">
                    {user?.name?.charAt(0).toUpperCase() ?? "U"}
                  </div>
                </div>
              ) : (
                <a
                  href="/login"
                  className="rounded-lg bg-brand-500 px-3 py-1.5 text-sm font-medium text-slate-950 transition-colors hover:bg-brand-400"
                >
                  Sign In
                </a>
              )}
            </div>
          </div>
        </header>

        {/* Page content — scrollable */}
        <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
          <Outlet />
        </main>
      </div>

      {/* ── Command Palette (global, all viewports) ── */}
      <CommandPalette open={commandOpen} onClose={() => setCommandOpen(false)} />

      {/* ── Mobile bottom nav ── */}
      <MobileNav
        currentPath={currentPath}
        onCommandOpen={() => setCommandOpen(true)}
      />
    </div>
  );
}
