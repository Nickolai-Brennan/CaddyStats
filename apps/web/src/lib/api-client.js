/**
 * CaddyStats API Client
 *
 * Typed HTTP client for backend REST API integration.
 * Handles authentication, error handling, and request/response serialization.
 * Mirrors backend OpenAPI contracts for type safety.
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
/**
 * API Client class with typed methods for all endpoints
 */
class APIClient {
    baseURL;
    authToken = null;
    refreshToken = null;
    constructor(baseURL = API_BASE_URL) {
        this.baseURL = baseURL;
        this.loadTokensFromStorage();
    }
    /**
     * Load tokens from localStorage
     */
    loadTokensFromStorage() {
        try {
            const stored = localStorage.getItem('auth_tokens');
            if (stored) {
                const tokens = JSON.parse(stored);
                this.authToken = tokens.access_token;
                this.refreshToken = tokens.refresh_token;
            }
        }
        catch (error) {
            console.error('Failed to load tokens from storage:', error);
        }
    }
    /**
     * Save tokens to localStorage
     */
    saveTokensToStorage(access, refresh) {
        localStorage.setItem('auth_tokens', JSON.stringify({
            access_token: access,
            refresh_token: refresh,
        }));
        this.authToken = access;
        this.refreshToken = refresh;
    }
    /**
     * Clear auth tokens
     */
    clearTokens() {
        localStorage.removeItem('auth_tokens');
        this.authToken = null;
        this.refreshToken = null;
    }
    /**
     * Set auth token
     */
    setAuthToken(token, refresh) {
        this.authToken = token;
        if (refresh) {
            this.refreshToken = refresh;
            this.saveTokensToStorage(token, refresh);
        }
    }
    /**
     * Get auth token
     */
    getAuthToken() {
        return this.authToken;
    }
    /**
     * Build URL with query parameters
     */
    buildURL(path, params) {
        const url = new URL(`${this.baseURL}${path}`);
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    url.searchParams.append(key, String(value));
                }
            });
        }
        return url.toString();
    }
    /**
     * Make HTTP request with auth headers
     */
    async request(path, config = {}) {
        const { params, ...fetchConfig } = config;
        const url = this.buildURL(path, params);
        const headers = new Headers(fetchConfig.headers);
        headers.set('Content-Type', 'application/json');
        if (this.authToken) {
            headers.set('Authorization', `Bearer ${this.authToken}`);
        }
        try {
            const response = await fetch(url, {
                ...fetchConfig,
                headers,
            });
            // Handle 401 Unauthorized - attempt token refresh
            if (response.status === 401 && this.refreshToken) {
                const refreshed = await this.refreshAuthToken();
                if (refreshed) {
                    // Retry original request with new token
                    return this.request(path, config);
                }
            }
            // Parse response
            let data;
            const contentType = response.headers.get('content-type');
            if (contentType?.includes('application/json')) {
                data = await response.json();
            }
            else {
                data = (await response.text());
            }
            if (!response.ok) {
                throw {
                    detail: data?.detail || `HTTP ${response.status}`,
                    status_code: response.status,
                    timestamp: new Date().toISOString(),
                };
            }
            return { data: data, status: response.status };
        }
        catch (error) {
            if (error instanceof APIError || (error && typeof error === 'object' && 'detail' in error)) {
                throw error;
            }
            throw {
                detail: error instanceof Error ? error.message : 'Unknown error',
                status_code: 0,
                timestamp: new Date().toISOString(),
            };
        }
    }
    /**
     * Refresh authentication token
     */
    async refreshAuthToken() {
        if (!this.refreshToken)
            return false;
        try {
            const { data } = await this.request('/auth/refresh', {
                method: 'POST',
                body: JSON.stringify({ refresh_token: this.refreshToken }),
            });
            this.saveTokensToStorage(data.access_token, data.refresh_token);
            return true;
        }
        catch (error) {
            this.clearTokens();
            return false;
        }
    }
    // ========================================================================
    // Auth Endpoints
    // ========================================================================
    async login(credentials) {
        const { data } = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });
        this.saveTokensToStorage(data.access_token, data.refresh_token);
        return data;
    }
    async register(credentials) {
        const { data } = await this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });
        this.saveTokensToStorage(data.access_token, data.refresh_token);
        return data;
    }
    async logout() {
        try {
            await this.request('/auth/logout', { method: 'POST' });
        }
        finally {
            this.clearTokens();
        }
    }
    async getCurrentUser() {
        const { data } = await this.request('/auth/me', { method: 'GET' });
        return data;
    }
    async refreshToken(request) {
        const { data } = await this.request('/auth/refresh', {
            method: 'POST',
            body: JSON.stringify(request),
        });
        this.saveTokensToStorage(data.access_token, data.refresh_token);
        return data;
    }
    // ========================================================================
    // Player Endpoints
    // ========================================================================
    async getPlayers(params) {
        const { data } = await this.request('/players', {
            method: 'GET',
            params: params,
        });
        return data;
    }
    async getPlayer(playerId) {
        const { data } = await this.request(`/players/${playerId}`, {
            method: 'GET',
        });
        return data;
    }
    async searchPlayers(query, limit = 20) {
        const { data } = await this.request('/players', {
            method: 'GET',
            params: { q: query, page_size: limit },
        });
        return Array.isArray(data) ? data : [];
    }
    async getPlayerStats(playerId, season) {
        const { data } = await this.request(`/players/${playerId}/stats`, {
            method: 'GET',
            params: season ? { season } : undefined,
        });
        return data;
    }
    // ========================================================================
    // Tournament Endpoints
    // ========================================================================
    async getTournaments(params) {
        const { data } = await this.request('/tournaments', {
            method: 'GET',
            params: params,
        });
        return data;
    }
    async getTournament(tournamentId) {
        const { data } = await this.request(`/tournaments/${tournamentId}`, {
            method: 'GET',
        });
        return data;
    }
    async getTournamentLeaderboard(tournamentId) {
        const { data } = await this.request(`/tournaments/${tournamentId}/leaderboard`, {
            method: 'GET',
        });
        return data;
    }
    // ========================================================================
    // Rankings Endpoints
    // ========================================================================
    async getWorldRankings(params) {
        const { data } = await this.request('/rankings/world', {
            method: 'GET',
            params: params,
        });
        return data;
    }
    async getFedexCupRankings(params) {
        const { data } = await this.request('/rankings/fedex-cup', {
            method: 'GET',
            params: params,
        });
        return data;
    }
    async getTournamentRankings(tournamentId, params) {
        const { data } = await this.request(`/rankings/tournament/${tournamentId}`, {
            method: 'GET',
            params: params,
        });
        return data;
    }
    // ========================================================================
    // Projection Endpoints
    // ========================================================================
    async getProjections(tournamentId, params) {
        const { data } = await this.request('/projections', {
            method: 'GET',
            params: { tournament_id: tournamentId, ...params },
        });
        return data;
    }
    async getPlayerProjections(playerId, tournamentId) {
        const { data } = await this.request('/projections', {
            method: 'GET',
            params: { player_id: playerId, tournament_id: tournamentId },
        });
        return Array.isArray(data) ? data : [];
    }
    async getFieldProjections(tournamentId) {
        const { data } = await this.request(`/projections/field/${tournamentId}`, {
            method: 'GET',
        });
        return data;
    }
    // ========================================================================
    // Betting Endpoints
    // ========================================================================
    async getBettingEdges(tournamentId, params) {
        const { data } = await this.request('/betting/edges', {
            method: 'GET',
            params: { tournament_id: tournamentId, ...params },
        });
        return data;
    }
    async getBettingOdds(tournamentId, params) {
        const { data } = await this.request('/betting/odds', {
            method: 'GET',
            params: { tournament_id: tournamentId, ...params },
        });
        return data;
    }
    // ========================================================================
    // Content Endpoints
    // ========================================================================
    async getArticles(params) {
        const { data } = await this.request('/content/articles', {
            method: 'GET',
            params: params,
        });
        return data;
    }
    async getArticle(slug) {
        const { data } = await this.request(`/content/articles/${slug}`, {
            method: 'GET',
        });
        return data;
    }
    // ========================================================================
    // Stats Overview
    // ========================================================================
    async getStatsOverview() {
        const { data } = await this.request('/stats/overview', {
            method: 'GET',
        });
        return data;
    }
}
export const apiClient = new APIClient();
