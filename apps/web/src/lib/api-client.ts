/**
 * CaddyStats API Client
 *
 * Typed HTTP client for backend REST API integration.
 * Handles authentication, error handling, and request/response serialization.
 * Mirrors backend OpenAPI contracts for type safety.
 */

import type {
  User,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  RefreshTokenRequest,
  Player,
  PlayerDetail,
  PlayerStats,
  Tournament,
  TournamentDetail,
  Ranking,
  RankingCategory,
  Projection,
  FieldProjection,
  BettingEdge,
  BettingOdds,
  Article,
  ArticleList,
  PaginatedResponse,
  PaginationParams,
  FilterParams,
  APIError,
} from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

/**
 * Request configuration with auth token support
 */
interface RequestConfig extends RequestInit {
  params?: Record<string, string | number | boolean>;
}

/**
 * API Client class with typed methods for all endpoints
 */
class APIClient {
  private baseURL: string;
  private authToken: string | null = null;
  private refreshToken: string | null = null;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
    this.loadTokensFromStorage();
  }

  /**
   * Load tokens from localStorage
   */
  private loadTokensFromStorage(): void {
    try {
      const stored = localStorage.getItem('auth_tokens');
      if (stored) {
        const tokens = JSON.parse(stored);
        this.authToken = tokens.access_token;
        this.refreshToken = tokens.refresh_token;
      }
    } catch (error) {
      console.error('Failed to load tokens from storage:', error);
    }
  }

  /**
   * Save tokens to localStorage
   */
  private saveTokensToStorage(access: string, refresh: string): void {
    localStorage.setItem(
      'auth_tokens',
      JSON.stringify({
        access_token: access,
        refresh_token: refresh,
      })
    );
    this.authToken = access;
    this.refreshToken = refresh;
  }

  /**
   * Clear auth tokens
   */
  private clearTokens(): void {
    localStorage.removeItem('auth_tokens');
    this.authToken = null;
    this.refreshToken = null;
  }

  /**
   * Set auth token
   */
  setAuthToken(token: string, refresh?: string): void {
    this.authToken = token;
    if (refresh) {
      this.refreshToken = refresh;
      this.saveTokensToStorage(token, refresh);
    }
  }

  /**
   * Get auth token
   */
  getAuthToken(): string | null {
    return this.authToken;
  }

  /**
   * Build URL with query parameters
   */
  private buildURL(path: string, params?: Record<string, string | number | boolean>): string {
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
  private async request<T>(
    path: string,
    config: RequestConfig = {}
  ): Promise<{ data: T; status: number }> {
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
          return this.request<T>(path, config);
        }
      }

      // Parse response
      let data: T | APIError;
      const contentType = response.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        data = await response.json();
      } else {
        data = (await response.text()) as T;
      }

      if (!response.ok) {
        throw {
          detail: (data as APIError)?.detail || `HTTP ${response.status}`,
          status_code: response.status,
          timestamp: new Date().toISOString(),
        } as APIError;
      }

      return { data: data as T, status: response.status };
    } catch (error) {
      if (error instanceof APIError || (error && typeof error === 'object' && 'detail' in error)) {
        throw error;
      }
      throw {
        detail: error instanceof Error ? error.message : 'Unknown error',
        status_code: 0,
        timestamp: new Date().toISOString(),
      } as APIError;
    }
  }

  /**
   * Refresh authentication token
   */
  private async refreshAuthToken(): Promise<boolean> {
    if (!this.refreshToken) return false;

    try {
      const { data } = await this.request<AuthResponse>('/auth/refresh', {
        method: 'POST',
        body: JSON.stringify({ refresh_token: this.refreshToken } as RefreshTokenRequest),
      });

      this.saveTokensToStorage(data.access_token, data.refresh_token);
      return true;
    } catch (error) {
      this.clearTokens();
      return false;
    }
  }

  // ========================================================================
  // Auth Endpoints
  // ========================================================================

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const { data } = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    this.saveTokensToStorage(data.access_token, data.refresh_token);
    return data;
  }

  async register(credentials: RegisterRequest): Promise<AuthResponse> {
    const { data } = await this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    this.saveTokensToStorage(data.access_token, data.refresh_token);
    return data;
  }

  async logout(): Promise<void> {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } finally {
      this.clearTokens();
    }
  }

  async getCurrentUser(): Promise<User> {
    const { data } = await this.request<User>('/auth/me', { method: 'GET' });
    return data;
  }

  async refreshToken(request: RefreshTokenRequest): Promise<AuthResponse> {
    const { data } = await this.request<AuthResponse>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify(request),
    });
    this.saveTokensToStorage(data.access_token, data.refresh_token);
    return data;
  }

  // ========================================================================
  // Player Endpoints
  // ========================================================================

  async getPlayers(
    params?: PaginationParams & FilterParams
  ): Promise<PaginatedResponse<Player>> {
    const { data } = await this.request<PaginatedResponse<Player>>('/players', {
      method: 'GET',
      params: params as Record<string, string | number | boolean>,
    });
    return data;
  }

  async getPlayer(playerId: string): Promise<PlayerDetail> {
    const { data } = await this.request<PlayerDetail>(`/players/${playerId}`, {
      method: 'GET',
    });
    return data;
  }

  async searchPlayers(query: string, limit: number = 20): Promise<Player[]> {
    const { data } = await this.request<Player[]>('/players', {
      method: 'GET',
      params: { q: query, page_size: limit },
    });
    return Array.isArray(data) ? data : [];
  }

  async getPlayerStats(playerId: string, season?: number): Promise<PlayerStats> {
    const { data } = await this.request<PlayerStats>(`/players/${playerId}/stats`, {
      method: 'GET',
      params: season ? { season } : undefined,
    });
    return data;
  }

  // ========================================================================
  // Tournament Endpoints
  // ========================================================================

  async getTournaments(
    params?: PaginationParams & FilterParams
  ): Promise<PaginatedResponse<Tournament>> {
    const { data } = await this.request<PaginatedResponse<Tournament>>('/tournaments', {
      method: 'GET',
      params: params as Record<string, string | number | boolean>,
    });
    return data;
  }

  async getTournament(tournamentId: string): Promise<TournamentDetail> {
    const { data } = await this.request<TournamentDetail>(`/tournaments/${tournamentId}`, {
      method: 'GET',
    });
    return data;
  }

  async getTournamentLeaderboard(
    tournamentId: string
  ): Promise<PaginatedResponse<{ position: number; player: Player; score: number }>> {
    const { data } = await this.request<
      PaginatedResponse<{ position: number; player: Player; score: number }>
    >(`/tournaments/${tournamentId}/leaderboard`, {
      method: 'GET',
    });
    return data;
  }

  // ========================================================================
  // Rankings Endpoints
  // ========================================================================

  async getWorldRankings(params?: PaginationParams): Promise<RankingCategory> {
    const { data } = await this.request<RankingCategory>('/rankings/world', {
      method: 'GET',
      params: params as Record<string, string | number | boolean>,
    });
    return data;
  }

  async getFedexCupRankings(params?: PaginationParams): Promise<RankingCategory> {
    const { data } = await this.request<RankingCategory>('/rankings/fedex-cup', {
      method: 'GET',
      params: params as Record<string, string | number | boolean>,
    });
    return data;
  }

  async getTournamentRankings(
    tournamentId: string,
    params?: PaginationParams
  ): Promise<RankingCategory> {
    const { data } = await this.request<RankingCategory>(`/rankings/tournament/${tournamentId}`, {
      method: 'GET',
      params: params as Record<string, string | number | boolean>,
    });
    return data;
  }

  // ========================================================================
  // Projection Endpoints
  // ========================================================================

  async getProjections(
    tournamentId: string,
    params?: PaginationParams
  ): Promise<PaginatedResponse<Projection>> {
    const { data } = await this.request<PaginatedResponse<Projection>>('/projections', {
      method: 'GET',
      params: { tournament_id: tournamentId, ...params } as Record<
        string,
        string | number | boolean
      >,
    });
    return data;
  }

  async getPlayerProjections(
    playerId: string,
    tournamentId: string
  ): Promise<Projection[]> {
    const { data } = await this.request<Projection[]>('/projections', {
      method: 'GET',
      params: { player_id: playerId, tournament_id: tournamentId },
    });
    return Array.isArray(data) ? data : [];
  }

  async getFieldProjections(tournamentId: string): Promise<FieldProjection> {
    const { data } = await this.request<FieldProjection>(`/projections/field/${tournamentId}`, {
      method: 'GET',
    });
    return data;
  }

  // ========================================================================
  // Betting Endpoints
  // ========================================================================

  async getBettingEdges(
    tournamentId: string,
    params?: PaginationParams
  ): Promise<PaginatedResponse<BettingEdge>> {
    const { data } = await this.request<PaginatedResponse<BettingEdge>>('/betting/edges', {
      method: 'GET',
      params: { tournament_id: tournamentId, ...params } as Record<
        string,
        string | number | boolean
      >,
    });
    return data;
  }

  async getBettingOdds(
    tournamentId: string,
    params?: PaginationParams
  ): Promise<PaginatedResponse<BettingOdds>> {
    const { data } = await this.request<PaginatedResponse<BettingOdds>>('/betting/odds', {
      method: 'GET',
      params: { tournament_id: tournamentId, ...params } as Record<
        string,
        string | number | boolean
      >,
    });
    return data;
  }

  // ========================================================================
  // Content Endpoints
  // ========================================================================

  async getArticles(params?: PaginationParams & FilterParams): Promise<ArticleList> {
    const { data } = await this.request<ArticleList>('/content/articles', {
      method: 'GET',
      params: params as Record<string, string | number | boolean>,
    });
    return data;
  }

  async getArticle(slug: string): Promise<Article> {
    const { data } = await this.request<Article>(`/content/articles/${slug}`, {
      method: 'GET',
    });
    return data;
  }

  // ========================================================================
  // Stats Overview
  // ========================================================================

  async getStatsOverview() {
    const { data } = await this.request<{
      total_players: number;
      tournaments_this_season: number;
      active_players: number;
    }>('/stats/overview', {
      method: 'GET',
    });
    return data;
  }
}

export const apiClient = new APIClient();
