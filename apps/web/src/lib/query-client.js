/**
 * TanStack Query Client Configuration
 *
 * Centralized configuration for server state management with caching,
 * refetching, and error handling based on performance budgets.
 */
import { QueryClient } from '@tanstack/react-query';
/**
 * Default query options optimized for performance
 */
const defaultQueryOptions = {
    queries: {
        // Cache data for longer periods - only refetch when explicitly needed
        staleTime: 5 * 60 * 1000, // 5 minutes default
        gcTime: 15 * 60 * 1000, // 15 minutes garbage collection
        // Retry failed requests with exponential backoff
        retry: 2,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        // Refetch on these events
        refetchOnWindowFocus: 'stale',
        refetchOnReconnect: 'stale',
        refetchOnMount: 'stale',
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
        all: ['auth'],
        me: () => [...queryKeys.auth.all, 'me'],
    },
    // Players
    players: {
        all: ['players'],
        lists: () => [...queryKeys.players.all, 'list'],
        list: (filters) => [...queryKeys.players.lists(), filters],
        details: () => [...queryKeys.players.all, 'detail'],
        detail: (id) => [...queryKeys.players.details(), id],
        stats: (id) => [...queryKeys.players.detail(id), 'stats'],
    },
    // Tournaments
    tournaments: {
        all: ['tournaments'],
        lists: () => [...queryKeys.tournaments.all, 'list'],
        list: (filters) => [...queryKeys.tournaments.lists(), filters],
        details: () => [...queryKeys.tournaments.all, 'detail'],
        detail: (id) => [...queryKeys.tournaments.details(), id],
        leaderboard: (id) => [...queryKeys.tournaments.detail(id), 'leaderboard'],
    },
    // Rankings
    rankings: {
        all: ['rankings'],
        world: (filters) => [...queryKeys.rankings.all, 'world', filters],
        fedexCup: (filters) => [...queryKeys.rankings.all, 'fedex_cup', filters],
        tournament: (id, filters) => [...queryKeys.rankings.all, 'tournament', id, filters],
    },
    // Projections
    projections: {
        all: ['projections'],
        lists: () => [...queryKeys.projections.all, 'list'],
        list: (tournamentId, filters) => [...queryKeys.projections.lists(), tournamentId, filters],
        player: (playerId, tournamentId) => [...queryKeys.projections.all, 'player', playerId, tournamentId],
        field: (tournamentId) => [...queryKeys.projections.all, 'field', tournamentId],
    },
    // Betting
    betting: {
        all: ['betting'],
        edges: (tournamentId, filters) => [...queryKeys.betting.all, 'edges', tournamentId, filters],
        odds: (tournamentId, filters) => [...queryKeys.betting.all, 'odds', tournamentId, filters],
    },
    // Articles
    articles: {
        all: ['articles'],
        lists: () => [...queryKeys.articles.all, 'list'],
        list: (filters) => [...queryKeys.articles.lists(), filters],
        details: () => [...queryKeys.articles.all, 'detail'],
        detail: (slug) => [...queryKeys.articles.details(), slug],
    },
    // Stats
    stats: {
        all: ['stats'],
        overview: () => [...queryKeys.stats.all, 'overview'],
    },
};
