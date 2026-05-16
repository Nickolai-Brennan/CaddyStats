/**
 * TanStack Query Client Configuration
 *
 * Centralized configuration for server state management with caching,
 * refetching, and error handling based on performance budgets.
 */

import { QueryClient, DefaultOptions } from "@tanstack/react-query";

/**
 * Default query options optimized for performance
 */
const defaultQueryOptions: DefaultOptions = {
  queries: {
    // Cache data for longer periods - only refetch when explicitly needed
    staleTime: 5 * 60 * 1000, // 5 minutes default
    gcTime: 15 * 60 * 1000, // 15 minutes garbage collection

    // Retry failed requests with exponential backoff
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

    // Refetch on these events
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchOnMount: true,
  },
  mutations: {
    retry: 1,
    retryDelay: 1000,
  },
};

/**
 * Create and configure QueryClient
 */
export const queryClient = new QueryClient({
  defaultOptions: defaultQueryOptions,
});

/**
 * Cache time constants by data type
 * Based on update frequency and performance requirements
 */
export const CACHE_TIMES = {
  // Auth - relatively fast to stale, verify with server frequently
  AUTH: {
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  },

  // Player data - stable but updated after tournaments
  PLAYERS: {
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
  },

  // Player stats - updated after each round
  PLAYER_STATS: {
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 2 * 60 * 60 * 1000, // 2 hours
  },

  // Rankings - updated daily/weekly
  RANKINGS: {
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 3 * 60 * 60 * 1000, // 3 hours
  },

  // Tournaments - static once published
  TOURNAMENTS: {
    staleTime: 2 * 60 * 60 * 1000, // 2 hours
    gcTime: 4 * 60 * 60 * 1000, // 4 hours
  },

  // Leaderboards - updated live during tournament
  LEADERBOARD: {
    staleTime: 2 * 60 * 1000, // 2 minutes (frequent updates)
    gcTime: 10 * 60 * 1000, // 10 minutes
  },

  // Projections - model output, relatively stable
  PROJECTIONS: {
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
  },

  // Betting odds/edges - market data, changes frequently
  BETTING_DATA: {
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  },

  // Articles - editorial content, stable
  ARTICLES: {
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 2 * 60 * 60 * 1000, // 2 hours
  },

  // Stats overview - aggregated, updated periodically
  STATS_OVERVIEW: {
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
  },
};

/**
 * Create query key factory for type-safe query invalidation
 */
export const queryKeys = {
  // Auth
  auth: {
    all: ["auth"] as const,
    me: () => [...queryKeys.auth.all, "me"] as const,
  },

  // Players
  players: {
    all: ["players"] as const,
    lists: () => [...queryKeys.players.all, "list"] as const,
    list: (filters?: Record<string, unknown>) => [...queryKeys.players.lists(), filters] as const,
    details: () => [...queryKeys.players.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.players.details(), id] as const,
    stats: (id: string) => [...queryKeys.players.detail(id), "stats"] as const,
  },

  // Tournaments
  tournaments: {
    all: ["tournaments"] as const,
    lists: () => [...queryKeys.tournaments.all, "list"] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.tournaments.lists(), filters] as const,
    details: () => [...queryKeys.tournaments.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.tournaments.details(), id] as const,
    leaderboard: (id: string) => [...queryKeys.tournaments.detail(id), "leaderboard"] as const,
  },

  // Rankings
  rankings: {
    all: ["rankings"] as const,
    world: (filters?: Record<string, unknown>) =>
      [...queryKeys.rankings.all, "world", filters] as const,
    fedexCup: (filters?: Record<string, unknown>) =>
      [...queryKeys.rankings.all, "fedex_cup", filters] as const,
    tournament: (id: string, filters?: Record<string, unknown>) =>
      [...queryKeys.rankings.all, "tournament", id, filters] as const,
  },

  // Projections
  projections: {
    all: ["projections"] as const,
    lists: () => [...queryKeys.projections.all, "list"] as const,
    list: (tournamentId: string, filters?: Record<string, unknown>) =>
      [...queryKeys.projections.lists(), tournamentId, filters] as const,
    player: (playerId: string, tournamentId: string) =>
      [...queryKeys.projections.all, "player", playerId, tournamentId] as const,
    field: (tournamentId: string) => [...queryKeys.projections.all, "field", tournamentId] as const,
  },

  // Betting
  betting: {
    all: ["betting"] as const,
    edges: (tournamentId: string, filters?: Record<string, unknown>) =>
      [...queryKeys.betting.all, "edges", tournamentId, filters] as const,
    odds: (tournamentId: string, filters?: Record<string, unknown>) =>
      [...queryKeys.betting.all, "odds", tournamentId, filters] as const,
  },

  // Articles
  articles: {
    all: ["articles"] as const,
    lists: () => [...queryKeys.articles.all, "list"] as const,
    list: (filters?: Record<string, unknown>) => [...queryKeys.articles.lists(), filters] as const,
    details: () => [...queryKeys.articles.all, "detail"] as const,
    detail: (slug: string) => [...queryKeys.articles.details(), slug] as const,
  },

  // Stats
  stats: {
    all: ["stats"] as const,
    overview: () => [...queryKeys.stats.all, "overview"] as const,
  },
};
