import { jsx as _jsx } from "react/jsx-runtime";
/**
 * TanStack Router Configuration
 *
 * Type-safe route definitions with nested layouts, loaders, and authentication guards.
 */
import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router';
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
    component: () => _jsx("div", { children: "Home Page - Coming Soon" }), // Placeholder
    meta: {
        title: 'CaddyStats - Golf Analytics & Betting Intelligence',
        description: 'Professional golf analytics, player statistics, tournament projections, and betting intelligence platform.',
    },
});
// Player search/list page
const playersRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/players',
    component: () => _jsx("div", { children: "Players Page - Coming Soon" }), // Placeholder
    meta: {
        title: 'PGA Players - Rankings & Statistics',
        description: 'Browse PGA Tour players with detailed statistics, rankings, and performance analytics.',
    },
});
// Player detail page
const playerDetailRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/players/$playerId',
    component: () => _jsx("div", { children: "Player Detail - Coming Soon" }), // Placeholder
    meta: {
        title: 'Player Profile',
        description: 'Detailed player statistics, history, and projections.',
    },
});
// Tournaments page
const tournamentsRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/tournaments',
    component: () => _jsx("div", { children: "Tournaments Page - Coming Soon" }), // Placeholder
    meta: {
        title: 'PGA Tournaments - Schedule & Results',
        description: 'Browse PGA Tour tournaments with detailed information and leaderboards.',
    },
});
// Tournament detail page
const tournamentDetailRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/tournaments/$tournamentId',
    component: () => _jsx("div", { children: "Tournament Detail - Coming Soon" }), // Placeholder
    meta: {
        title: 'Tournament Details',
        description: 'Tournament leaderboard, field, and detailed results.',
    },
});
// Rankings page
const rankingsRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/rankings',
    component: () => _jsx("div", { children: "Rankings Page - Coming Soon" }), // Placeholder
    meta: {
        title: 'World Rankings - PGA Tour & FedEx Cup',
        description: 'Current world golf rankings and FedEx Cup standings.',
    },
});
// Articles/content page
const articlesRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/articles',
    component: () => _jsx("div", { children: "Articles Page - Coming Soon" }), // Placeholder
    meta: {
        title: 'Golf Articles & Analysis',
        description: 'Expert golf analysis, player insights, and tournament previews.',
    },
});
// Article detail page
const articleDetailRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/articles/$slug',
    component: () => _jsx("div", { children: "Article Detail - Coming Soon" }), // Placeholder
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
    component: () => _jsx("div", { children: "Login Page - Coming Soon" }), // Placeholder
    meta: {
        title: 'Sign In',
        description: 'Log in to your CaddyStats account.',
    },
});
// Registration page
const registerRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/register',
    component: () => _jsx("div", { children: "Register Page - Coming Soon" }), // Placeholder
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
    component: () => _jsx("div", { children: "Projections Page - Coming Soon" }), // Placeholder
    meta: {
        title: 'AI Projections & Research',
        description: 'AI-powered golf projections and betting research.',
    },
});
// Betting research page
const bettingRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/betting',
    component: () => _jsx("div", { children: "Betting Page - Coming Soon" }), // Placeholder
    meta: {
        title: 'Betting Intelligence & Odds',
        description: 'Betting edges, odds tracking, and market analysis.',
    },
});
// Dashboard page (premium/subscriber only)
const dashboardRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/dashboard',
    component: () => _jsx("div", { children: "Dashboard Page - Coming Soon" }), // Placeholder
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
    component: () => _jsx("div", { children: "Admin Page - Coming Soon" }), // Placeholder
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
