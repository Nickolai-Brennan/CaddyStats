/**
 * TanStack Router Configuration
 *
 * Type-safe route definitions with nested layouts, loaders, and authentication guards.
 */

import { createRootRoute, createRoute, createRouter } from "@tanstack/react-router";
import { RootLayout } from "@/layouts/root";
import { NotFound } from "@/pages/not-found";

// Public pages
import { ArticlesPage } from "@/pages/articles/index";
import { ArticleDetailPage } from "@/pages/articles/article-detail";
import { ArchivePage, type ArchiveSearch } from "@/pages/articles/archive";
import { AboutPage } from "@/pages/about";
import { ContactPage } from "@/pages/contact";
import { LabPage } from "@/pages/lab";
import { HomePage } from "@/pages/home";

/**
 * Root route with global layout
 */
export const rootRoute = createRootRoute({
  component: RootLayout,
  notFoundComponent: NotFound,
});

/**
 * Public routes - no authentication required
 */

// Home page
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

// Player search/list page
const playersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/players",
  component: () => (
    <div className="flex min-h-[60vh] items-center justify-center text-slate-400 text-xl">
      Players Page — Coming Soon
    </div>
  ),
});

// Player detail page
const playerDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/players/$playerId",
  component: () => (
    <div className="flex min-h-[60vh] items-center justify-center text-slate-400 text-xl">
      Player Detail — Coming Soon
    </div>
  ),
});

// Tournaments page
const tournamentsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/tournaments",
  component: () => (
    <div className="flex min-h-[60vh] items-center justify-center text-slate-400 text-xl">
      Tournaments Page — Coming Soon
    </div>
  ),
});

// Tournament detail page
const tournamentDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/tournaments/$tournamentId",
  component: () => (
    <div className="flex min-h-[60vh] items-center justify-center text-slate-400 text-xl">
      Tournament Detail — Coming Soon
    </div>
  ),
});

// Rankings page
const rankingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/rankings",
  component: () => (
    <div className="flex min-h-[60vh] items-center justify-center text-slate-400 text-xl">
      Rankings Page — Coming Soon
    </div>
  ),
});

// Articles/news magazine page
const articlesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/articles",
  component: ArticlesPage,
});

// Article archive page (must be before /$slug so static segment wins)
const articleArchiveRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/articles/archive",
  validateSearch: (search: Record<string, unknown>): ArchiveSearch => ({
    q: typeof search.q === "string" ? search.q : undefined,
    author: typeof search.author === "string" ? search.author : undefined,
    tag: typeof search.tag === "string" ? search.tag : undefined,
    page: typeof search.page === "number" ? search.page : 1,
    page_size: typeof search.page_size === "number" ? search.page_size : 12,
    sort: search.sort === "oldest" ? "oldest" : "newest",
  }),
  component: ArchivePage,
});

// Article detail page by slug
const articleDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/articles/$slug",
  component: ArticleDetailPage,
});

// About page
const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/about",
  component: AboutPage,
});

// Contact page
const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/contact",
  component: ContactPage,
});

// Lab — stats and models
const labRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/lab",
  component: LabPage,
});

/**
 * Auth routes
 */

// Login page
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: () => (
    <div className="flex min-h-[60vh] items-center justify-center text-slate-400 text-xl">
      Login Page — Coming Soon
    </div>
  ),
});

// Registration page
const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/register",
  component: () => (
    <div className="flex min-h-[60vh] items-center justify-center text-slate-400 text-xl">
      Register Page — Coming Soon
    </div>
  ),
});

/**
 * Protected routes - require authentication (defined later in development)
 */

// Projections/research page
const projectionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/projections",
  component: () => (
    <div className="flex min-h-[60vh] items-center justify-center text-slate-400 text-xl">
      Projections Page — Coming Soon
    </div>
  ),
});

// Betting research page
const bettingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/betting",
  component: () => (
    <div className="flex min-h-[60vh] items-center justify-center text-slate-400 text-xl">
      Betting Page — Coming Soon
    </div>
  ),
});

// Dashboard page (premium/subscriber only)
const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: () => (
    <div className="flex min-h-[60vh] items-center justify-center text-slate-400 text-xl">
      Dashboard Page — Coming Soon
    </div>
  ),
});

/**
 * Admin routes (admin-only, defined in admin app)
 */

// Admin panel
const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: () => (
    <div className="flex min-h-[60vh] items-center justify-center text-slate-400 text-xl">
      Admin Page — Coming Soon
    </div>
  ),
});

/**
 * Create route tree
 */
const routeTree = rootRoute.addChildren([
  // Public routes
  indexRoute,
  playersRoute,
  playerDetailRoute,
  tournamentsRoute,
  tournamentDetailRoute,
  rankingsRoute,
  articlesRoute,
  articleArchiveRoute,
  articleDetailRoute,
  aboutRoute,
  contactRoute,
  labRoute,

  // Auth routes
  loginRoute,
  registerRoute,

  // Protected routes
  projectionsRoute,
  bettingRoute,
  dashboardRoute,

  // Admin routes
  adminRoute,
]);

/**
 * Create and configure router
 */
export const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  defaultErrorComponent: NotFound,
});

/**
 * Register router for type-safe navigation
 */
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
