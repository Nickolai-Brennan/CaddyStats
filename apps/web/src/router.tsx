/**
 * TanStack Router Configuration
 *
 * Type-safe route definitions with nested layouts, loaders, and authentication guards.
 */

import { createRootRoute, createRoute, createRouter, RootRoute, Route } from '@tanstack/react-router';
import { RootLayout } from '@/layouts/root';
import { NotFound } from '@/pages/not-found';

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
  path: '/',
  component: () => <div>Home Page - Coming Soon</div>, // Placeholder
  meta: {
    title: 'CaddyStats - Golf Analytics & Betting Intelligence',
    description:
      'Professional golf analytics, player statistics, tournament projections, and betting intelligence platform.',
  },
});

// Player search/list page
const playersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/players',
  component: () => <div>Players Page - Coming Soon</div>, // Placeholder
  meta: {
    title: 'PGA Players - Rankings & Statistics',
    description: 'Browse PGA Tour players with detailed statistics, rankings, and performance analytics.',
  },
});

// Player detail page
const playerDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/players/$playerId',
  component: () => <div>Player Detail - Coming Soon</div>, // Placeholder
  meta: {
    title: 'Player Profile',
    description: 'Detailed player statistics, history, and projections.',
  },
});

// Tournaments page
const tournamentsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/tournaments',
  component: () => <div>Tournaments Page - Coming Soon</div>, // Placeholder
  meta: {
    title: 'PGA Tournaments - Schedule & Results',
    description: 'Browse PGA Tour tournaments with detailed information and leaderboards.',
  },
});

// Tournament detail page
const tournamentDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/tournaments/$tournamentId',
  component: () => <div>Tournament Detail - Coming Soon</div>, // Placeholder
  meta: {
    title: 'Tournament Details',
    description: 'Tournament leaderboard, field, and detailed results.',
  },
});

// Rankings page
const rankingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/rankings',
  component: () => <div>Rankings Page - Coming Soon</div>, // Placeholder
  meta: {
    title: 'World Rankings - PGA Tour & FedEx Cup',
    description: 'Current world golf rankings and FedEx Cup standings.',
  },
});

// Articles/content page
const articlesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/articles',
  component: () => <div>Articles Page - Coming Soon</div>, // Placeholder
  meta: {
    title: 'Golf Articles & Analysis',
    description: 'Expert golf analysis, player insights, and tournament previews.',
  },
});

// Article detail page
const articleDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/articles/$slug',
  component: () => <div>Article Detail - Coming Soon</div>, // Placeholder
  meta: {
    title: 'Article',
    description: 'Read the full article.',
  },
});

/**
 * Auth routes
 */

// Login page
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: () => <div>Login Page - Coming Soon</div>, // Placeholder
  meta: {
    title: 'Sign In',
    description: 'Log in to your CaddyStats account.',
  },
});

// Registration page
const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/register',
  component: () => <div>Register Page - Coming Soon</div>, // Placeholder
  meta: {
    title: 'Create Account',
    description: 'Create your CaddyStats account.',
  },
});

/**
 * Protected routes - require authentication (defined later in development)
 */

// Projections/research page
const projectionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/projections',
  component: () => <div>Projections Page - Coming Soon</div>, // Placeholder
  meta: {
    title: 'AI Projections & Research',
    description: 'AI-powered golf projections and betting research.',
  },
});

// Betting research page
const bettingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/betting',
  component: () => <div>Betting Page - Coming Soon</div>, // Placeholder
  meta: {
    title: 'Betting Intelligence & Odds',
    description: 'Betting edges, odds tracking, and market analysis.',
  },
});

// Dashboard page (premium/subscriber only)
const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: () => <div>Dashboard Page - Coming Soon</div>, // Placeholder
  meta: {
    title: 'Dashboard',
    description: 'Your personalized golf analytics dashboard.',
  },
});

/**
 * Admin routes (admin-only, defined in admin app)
 */

// Admin panel
const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: () => <div>Admin Page - Coming Soon</div>, // Placeholder
  meta: {
    title: 'Admin Panel',
    description: 'Administration tools.',
  },
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
  articleDetailRoute,

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
  defaultPreload: 'intent', // Preload on intent for faster navigation
  defaultErrorComponent: NotFound,
});

/**
 * Register router for type-safe navigation
 */
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
