/**
 * Archive Page — searchable, filterable article listing with URL-synced state
 *
 * Search params are synchronised with the URL so pages are shareable/bookmarkable.
 * Filter controls: keyword search, author slug, tag slug, sort order, page size, pagination.
 */

import { useNavigate, useSearch } from "@tanstack/react-router";
import { useRef, useCallback } from "react";
import { useArticles } from "@/lib/hooks";
import { ArticleCard } from "@/components/article-card";
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";
import { EmptyState } from "@/components/empty-state";

export interface ArchiveSearch {
  q?: string;
  author?: string;
  tag?: string;
  page?: number;
  page_size?: number;
  sort?: "newest" | "oldest";
}

const PAGE_SIZE_OPTIONS = [12, 24, 48];

export function ArchivePage() {
  const search = useSearch({ from: "/articles/archive" }) as ArchiveSearch;
  const navigate = useNavigate({ from: "/articles/archive" });

  const q = search.q ?? "";
  const author = search.author ?? "";
  const tag = search.tag ?? "";
  const page = search.page ?? 1;
  const page_size = search.page_size ?? 12;
  const sort = search.sort ?? "newest";

  const { data, isLoading, isError, refetch } = useArticles({
    q: q || undefined,
    author: author || undefined,
    tag: tag || undefined,
    page,
    page_size,
    sort,
  });

  const articles = data?.articles ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / page_size) || 1;

  // Debounce keyword input so we don't spam the API on every keystroke
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const pushSearch = useCallback(
    (patch: Partial<ArchiveSearch>) => {
      navigate({
        search: (prev) => ({
          q: prev.q,
          author: prev.author,
          tag: prev.tag,
          page: 1,
          page_size: prev.page_size ?? 12,
          sort: prev.sort ?? "newest",
          ...patch,
        }),
      });
    },
    [navigate]
  );

  const handleKeyword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      pushSearch({ q: value || undefined, page: 1 });
    }, 400);
  };

  const hasFilters = Boolean(q || author || tag);

  const clearFilters = () => {
    pushSearch({ q: undefined, author: undefined, tag: undefined, page: 1 });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Page header */}
      <header className="mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-50 sm:text-5xl">
          Article Archive
        </h1>
        <p className="mt-3 text-lg text-slate-400">
          Search and filter all published analysis and insights.
        </p>
      </header>

      {/* Filter bar */}
      <section
        aria-label="Search and filter"
        className="mb-8 rounded-xl border border-slate-800 bg-slate-900 p-5"
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Keyword search */}
          <div className="lg:col-span-2">
            <label htmlFor="archive-q" className="mb-1.5 block text-xs font-medium text-slate-400">
              Search
            </label>
            <input
              id="archive-q"
              type="search"
              defaultValue={q}
              placeholder="Keywords, player names, tournaments…"
              onChange={handleKeyword}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-amber-500 focus:outline-none focus-visible:ring-1 focus-visible:ring-amber-500 transition-colors"
            />
          </div>

          {/* Author filter */}
          <div>
            <label
              htmlFor="archive-author"
              className="mb-1.5 block text-xs font-medium text-slate-400"
            >
              Author
            </label>
            <input
              id="archive-author"
              type="text"
              value={author}
              placeholder="Author slug"
              onChange={(e) => pushSearch({ author: e.target.value || undefined })}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-amber-500 focus:outline-none focus-visible:ring-1 focus-visible:ring-amber-500 transition-colors"
            />
          </div>

          {/* Tag filter */}
          <div>
            <label
              htmlFor="archive-tag"
              className="mb-1.5 block text-xs font-medium text-slate-400"
            >
              Tag
            </label>
            <input
              id="archive-tag"
              type="text"
              value={tag}
              placeholder="Tag slug"
              onChange={(e) => pushSearch({ tag: e.target.value || undefined })}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-amber-500 focus:outline-none focus-visible:ring-1 focus-visible:ring-amber-500 transition-colors"
            />
          </div>
        </div>

        {/* Second row: sort + page size + clear */}
        <div className="mt-4 flex flex-wrap items-center gap-4">
          {/* Sort */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-400">Sort:</span>
            <div
              role="group"
              aria-label="Sort order"
              className="flex overflow-hidden rounded-lg border border-slate-700"
            >
              {(["newest", "oldest"] as const).map((opt) => (
                <button
                  key={opt}
                  onClick={() => pushSearch({ sort: opt })}
                  aria-pressed={sort === opt}
                  className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                    sort === opt
                      ? "bg-amber-500 text-slate-950"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  {opt.charAt(0).toUpperCase() + opt.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Page size */}
          <div className="flex items-center gap-2">
            <label htmlFor="archive-page-size" className="text-xs font-medium text-slate-400">
              Per page:
            </label>
            <select
              id="archive-page-size"
              value={page_size}
              onChange={(e) => pushSearch({ page_size: Number(e.target.value), page: 1 })}
              className="rounded-lg border border-slate-700 bg-slate-800 px-2 py-1.5 text-xs text-slate-200 focus:border-amber-500 focus:outline-none"
            >
              {PAGE_SIZE_OPTIONS.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          {/* Clear filters */}
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="ml-auto text-xs text-amber-400 hover:text-amber-300 transition-colors underline underline-offset-2"
            >
              Clear filters
            </button>
          )}
        </div>
      </section>

      {/* Results summary */}
      {!isLoading && !isError && (
        <p className="mb-5 text-sm text-slate-500">
          {total > 0
            ? `Showing ${(page - 1) * page_size + 1}–${Math.min(page * page_size, total)} of ${total} article${total !== 1 ? "s" : ""}`
            : "No articles found"}
          {hasFilters && " matching your filters"}
        </p>
      )}

      {/* Loading */}
      {isLoading && <LoadingState count={page_size} />}

      {/* Error */}
      {isError && (
        <ErrorState
          message="Unable to load articles. Please check your connection and try again."
          onRetry={() => refetch()}
        />
      )}

      {/* Empty */}
      {!isLoading && !isError && articles.length === 0 && (
        <EmptyState
          title="No articles found"
          message={
            hasFilters
              ? "No articles match your current filters. Try adjusting your search terms."
              : "No articles have been published yet."
          }
          action={
            hasFilters ? (
              <button
                onClick={clearFilters}
                className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-700 transition-colors"
              >
                Clear filters
              </button>
            ) : undefined
          }
        />
      )}

      {/* Results grid */}
      {!isLoading && !isError && articles.length > 0 && (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <nav aria-label="Pagination" className="mt-10 flex items-center justify-center gap-2">
              <button
                onClick={() => pushSearch({ page: Math.max(1, page - 1) })}
                disabled={page <= 1}
                className="rounded-lg border border-slate-700 px-3 py-1.5 text-sm text-slate-300 hover:bg-slate-800 disabled:pointer-events-none disabled:opacity-40 transition-colors"
              >
                ← Prev
              </button>

              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                // Show pages near current
                const mid = Math.min(Math.max(page, 4), totalPages - 3);
                const pageNum = totalPages <= 7 ? i + 1 : i + mid - 3;
                if (pageNum < 1 || pageNum > totalPages) return null;
                return (
                  <button
                    key={pageNum}
                    onClick={() => pushSearch({ page: pageNum })}
                    aria-current={pageNum === page ? "page" : undefined}
                    className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                      pageNum === page
                        ? "border-amber-500 bg-amber-500 text-slate-950 font-semibold"
                        : "border-slate-700 text-slate-300 hover:bg-slate-800"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => pushSearch({ page: Math.min(totalPages, page + 1) })}
                disabled={page >= totalPages}
                className="rounded-lg border border-slate-700 px-3 py-1.5 text-sm text-slate-300 hover:bg-slate-800 disabled:pointer-events-none disabled:opacity-40 transition-colors"
              >
                Next →
              </button>
            </nav>
          )}
        </>
      )}
    </div>
  );
}
