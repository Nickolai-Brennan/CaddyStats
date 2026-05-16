/**
 * Public page query hooks
 *
 * TanStack Query wrappers over the typed API client for use in public pages.
 */

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { queryKeys, CACHE_TIMES } from "@/lib/query-client";
import type { PaginationParams } from "@/types";

// ============================================================================
// Article Hooks
// ============================================================================

export interface ArticlesParams extends PaginationParams {
  q?: string;
  author?: string;
  tag?: string;
  sort?: "newest" | "oldest";
}

export function useArticles(params: ArticlesParams = {}) {
  // Map frontend sort param to ordering understood by the backend
  const apiParams: Record<string, string | number | boolean | undefined> = {
    page: params.page ?? 1,
    page_size: params.page_size ?? 12,
  };
  if (params.q) apiParams.q = params.q;
  if (params.author) apiParams.author_slug = params.author;
  if (params.tag) apiParams.tag_slug = params.tag;

  return useQuery({
    queryKey: queryKeys.articles.list(params as Record<string, unknown>),
    queryFn: () => apiClient.getArticles(apiParams),
    staleTime: CACHE_TIMES.ARTICLES.staleTime,
    gcTime: CACHE_TIMES.ARTICLES.gcTime,
  });
}

export function useArticle(slug: string) {
  return useQuery({
    queryKey: queryKeys.articles.detail(slug),
    queryFn: () => apiClient.getArticle(slug),
    enabled: Boolean(slug),
    staleTime: CACHE_TIMES.ARTICLES.staleTime,
    gcTime: CACHE_TIMES.ARTICLES.gcTime,
  });
}

// ============================================================================
// Stats Hooks
// ============================================================================

export function useStatsOverview() {
  return useQuery({
    queryKey: queryKeys.stats.overview(),
    queryFn: () => apiClient.getStatsOverview(),
    staleTime: CACHE_TIMES.STATS_OVERVIEW.staleTime,
    gcTime: CACHE_TIMES.STATS_OVERVIEW.gcTime,
  });
}
