/**
 * Root Layout Component
 *
 * Global app layout with navigation, header, and footer.
 * Implements premium UI patterns: hero sections, scroll animations, accessibility.
 */

import { Outlet } from '@tanstack/react-router';
import { useAuth } from '@/contexts/auth';
import { useEffect, useState } from 'react';

export function RootLayout() {
  const { isAuthenticated, user } = useAuth();
  const [isHeaderSticky, setIsHeaderSticky] = useState(false);

  /**
   * Handle scroll events for sticky header animation
   */
  useEffect(() => {
    const handleScroll = () => {
      setIsHeaderSticky(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-50">
      {/* Header / Navigation Bar */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isHeaderSticky
            ? 'border-b border-slate-800 bg-slate-950/95 backdrop-blur-md shadow-lg'
            : 'bg-transparent'
        }`}
      >
        <nav className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-600" />
              <span className="text-lg font-bold tracking-tight">CaddyStats</span>
            </div>

            {/* Main Navigation */}
            <div className="hidden gap-8 md:flex">
              <a href="/" className="text-sm font-medium hover:text-amber-400 transition-colors">
                Home
              </a>
              <a href="/players" className="text-sm font-medium hover:text-amber-400 transition-colors">
                Players
              </a>
              <a href="/tournaments" className="text-sm font-medium hover:text-amber-400 transition-colors">
                Tournaments
              </a>
              <a href="/rankings" className="text-sm font-medium hover:text-amber-400 transition-colors">
                Rankings
              </a>
              <a href="/articles" className="text-sm font-medium hover:text-amber-400 transition-colors">
                Analysis
              </a>

              {isAuthenticated && (
                <>
                  <a href="/projections" className="text-sm font-medium hover:text-amber-400 transition-colors">
                    Projections
                  </a>
                  <a href="/betting" className="text-sm font-medium hover:text-amber-400 transition-colors">
                    Betting
                  </a>
                </>
              )}
            </div>

            {/* Auth Section */}
            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-400">{user?.name}</span>
                  <button className="rounded-lg bg-slate-800 px-3 py-2 text-sm font-medium hover:bg-slate-700 transition-colors">
                    Account
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <a href="/login" className="rounded-lg px-3 py-2 text-sm font-medium hover:text-amber-400 transition-colors">
                    Sign In
                  </a>
                  <a href="/register" className="rounded-lg bg-amber-500 px-3 py-2 text-sm font-medium text-slate-950 hover:bg-amber-400 transition-colors">
                    Sign Up
                  </a>
                </div>
              )}
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 text-slate-400">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            {/* About */}
            <div>
              <h3 className="text-sm font-semibold text-slate-200">About</h3>
              <ul className="mt-4 space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-slate-200 transition-colors">
                    About CaddyStats
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-slate-200 transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-slate-200 transition-colors">
                    Careers
                  </a>
                </li>
              </ul>
            </div>

            {/* Product */}
            <div>
              <h3 className="text-sm font-semibold text-slate-200">Product</h3>
              <ul className="mt-4 space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-slate-200 transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-slate-200 transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-slate-200 transition-colors">
                    Docs
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-sm font-semibold text-slate-200">Legal</h3>
              <ul className="mt-4 space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-slate-200 transition-colors">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-slate-200 transition-colors">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-slate-200 transition-colors">
                    Cookies
                  </a>
                </li>
              </ul>
            </div>

            {/* Social */}
            <div>
              <h3 className="text-sm font-semibold text-slate-200">Connect</h3>
              <ul className="mt-4 space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-slate-200 transition-colors">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-slate-200 transition-colors">
                    Discord
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-slate-200 transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom section */}
          <div className="mt-8 border-t border-slate-800 pt-8 flex items-center justify-between">
            <p className="text-sm">&copy; 2024 CaddyStats. All rights reserved.</p>
            <p className="text-xs text-slate-500">
              Golf data &bull; Built for professionals &bull; Powered by AI
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
