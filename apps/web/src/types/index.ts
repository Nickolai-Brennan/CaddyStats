/**
 * CaddyStats Frontend Type Definitions
 *
 * Centralized type definitions for API contracts, domain models, and UI state.
 * Mirrors backend Pydantic schemas for type safety across client-server boundary.
 */

// ============================================================================
// Authentication & Users
// ============================================================================

export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  role: UserRole;
  permissions: string[];
  created_at: string;
  updated_at: string;
}

export type UserRole = 'anonymous' | 'user' | 'subscriber' | 'editor' | 'admin' | 'owner';

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface Session {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// ============================================================================
// Golf Domain: Players
// ============================================================================

export interface Player {
  id: string;
  name: string;
  world_rank: number;
  fed_ex_rank?: number;
  dg_rank?: number;
  country: string;
  photo_url?: string;
  bio?: string;
  created_at: string;
  updated_at: string;
}

export interface PlayerDetail extends Player {
  season_stats: SeasonStats;
  recent_rounds: Round[];
  course_history: CourseHistory[];
  projected_scores?: ProjectedScore[];
}

export interface PlayerStats {
  player_id: string;
  season: number;
  scoring_average: number;
  rounds_played: number;
  cuts_made: number;
  top_10_finishes: number;
  wins: number;
  strokes_gained_tee_to_green: number;
  strokes_gained_putting: number;
  par_3_scoring: number;
  par_4_scoring: number;
  par_5_scoring: number;
  updated_at: string;
}

export interface SeasonStats {
  year: number;
  rounds_played: number;
  average_score: number;
  best_score: number;
  worst_score: number;
  scoring_avg_vs_par: number;
}

// ============================================================================
// Golf Domain: Tournaments
// ============================================================================

export interface Tournament {
  id: string;
  name: string;
  course_id: string;
  course_name: string;
  start_date: string;
  end_date: string;
  par: number;
  yardage: number;
  season: number;
  status: TournamentStatus;
  field_size?: number;
  created_at: string;
}

export type TournamentStatus = 'upcoming' | 'in_progress' | 'completed' | 'cancelled';

export interface TournamentDetail extends Tournament {
  leaderboard: LeaderboardEntry[];
  field: FieldEntry[];
  rounds: Round[];
}

export interface LeaderboardEntry {
  player_id: string;
  player_name: string;
  position: number;
  score: number;
  rounds: number[];
  status: 'active' | 'cut' | 'withdrew';
}

export interface FieldEntry {
  player_id: string;
  player_name: string;
  world_rank: number;
  status: 'entered' | 'withdrew' | 'injured';
}

export interface Round {
  id: string;
  tournament_id: string;
  round_number: number;
  date: string;
  course_par: number;
  scores: {
    player_id: string;
    score: number;
    holes: HoleScore[];
  }[];
  status: 'scheduled' | 'in_progress' | 'completed';
}

export interface HoleScore {
  hole_number: number;
  par: number;
  score: number;
  strokes_gained?: number;
}

export interface Course {
  id: string;
  name: string;
  location: string;
  country: string;
  par: number;
  yardage: number;
  rating?: number;
  slope?: number;
  holes: CourseHole[];
}

export interface CourseHole {
  hole_number: number;
  par: number;
  yardage: number;
  handicap: number;
}

export interface CourseHistory {
  course_id: string;
  course_name: string;
  rounds_played: number;
  best_score: number;
  average_score: number;
  best_round_date: string;
}

// ============================================================================
// Analytics & Rankings
// ============================================================================

export interface Ranking {
  player_id: string;
  player_name: string;
  rank: number;
  previous_rank: number;
  points?: number;
  trend: 'up' | 'down' | 'stable';
}

export interface RankingCategory {
  name: string;
  type: 'world' | 'fedex_cup' | 'tournament';
  rankings: Ranking[];
  last_updated: string;
}

export interface PlayerStatsOverview {
  total_players: number;
  tournaments_this_season: number;
  active_players: number;
  avg_field_size: number;
}

// ============================================================================
// Projections & Betting
// ============================================================================

export interface Projection {
  id: string;
  tournament_id: string;
  player_id: string;
  player_name: string;
  projection_type: 'score' | 'finish' | 'ownership';
  value: number;
  confidence: number;
  model_version: string;
  explanation?: string;
  generated_at: string;
}

export interface ProjectedScore extends Projection {
  projection_type: 'score';
  value: number; // projected score
  range: {
    low: number;
    high: number;
  };
}

export interface FieldProjection {
  tournament_id: string;
  tournament_name: string;
  projections: Projection[];
  generated_at: string;
}

export interface BettingOdds {
  player_id: string;
  player_name: string;
  market_type: 'to_win' | 'top_10' | 'top_20' | 'make_cut';
  odds: number;
  implied_probability: number;
  sportsbook: string;
  updated_at: string;
}

export interface BettingEdge {
  id: string;
  player_id: string;
  player_name: string;
  market_type: string;
  predicted_probability: number;
  implied_probability: number;
  edge: number; // edge_percentage (positive = favorable)
  recommendation: 'back' | 'lay' | 'neutral';
  confidence: number;
  model_version: string;
  generated_at: string;
}

// ============================================================================
// Content & Editorial
// ============================================================================

export interface Article {
  id: string;
  slug: string;
  title: string;
  description: string;
  content_blocks: ContentBlock[];
  author_id: string;
  author_name: string;
  published_at?: string;
  created_at: string;
  updated_at: string;
  status: 'draft' | 'published' | 'archived';
  seo_metadata: SEOMetadata;
  is_premium: boolean;
}

export interface ArticleList {
  articles: Article[];
  total: number;
  page: number;
  page_size: number;
  has_more: boolean;
}

export interface ContentBlock {
  id: string;
  type: 'text' | 'image' | 'stat' | 'table' | 'embed' | 'quote';
  position: number;
  content: Record<string, unknown>;
}

export interface SEOMetadata {
  title: string;
  description: string;
  canonical_url: string;
  og_image_url?: string;
  schema_data?: Record<string, unknown>;
}

// ============================================================================
// Pagination & Filtering
// ============================================================================

export interface PaginatedResponse<T> {
  results: T[];
  total: number;
  page: number;
  page_size: number;
  has_more: boolean;
}

export interface PaginationParams {
  page?: number;
  page_size?: number;
}

export interface FilterParams {
  [key: string]: string | number | boolean | undefined;
}

// ============================================================================
// API Error Handling
// ============================================================================

export interface APIError {
  detail: string;
  status_code: number;
  error_code?: string;
  timestamp: string;
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

// ============================================================================
// UI State & Common Patterns
// ============================================================================

export interface LoadingState {
  isLoading: boolean;
  error: APIError | null;
}

export interface QueryState<T> {
  data: T | null;
  isLoading: boolean;
  isError: boolean;
  error: APIError | null;
}
