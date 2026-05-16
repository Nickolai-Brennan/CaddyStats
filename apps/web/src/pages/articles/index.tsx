/**
 * Articles Page — magazine-style multi-article listing
 *
 * Displays a featured hero article followed by a responsive grid of article cards.
 * Data comes from the backend content/articles API via the useArticles hook.
 */

import { Link } from "@tanstack/react-router";
import { useArticles } from "@/lib/hooks";
import { ArticleCard } from "@/components/article-card";
import { SectionHeader } from "@/components/section-header";
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";
import { EmptyState } from "@/components/empty-state";

export function ArticlesPage() {
  const { data, isLoading, isError, refetch } = useArticles({ page: 1, page_size: 13 });

  const articles = data?.articles ?? [];
  const [featured, ...rest] = articles;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Page header */}
      <header className="mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-50 sm:text-5xl">
          Analysis &amp; Insights
        </h1>
        <p className="mt-3 text-lg text-slate-400">
          Data-driven golf analysis, tournament previews, and model breakdowns.
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Link
            to="/articles/archive"
            search={{
              q: undefined,
              author: undefined,
              tag: undefined,
              page: 1,
              page_size: 12,
              sort: "newest",
            }}
            className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-700 transition-colors"
          >
            Browse Archive →
          </Link>
        </div>
      </header>

      {/* Loading state */}
      {isLoading && <LoadingState count={7} />}

      {/* Error state */}
      {isError && (
        <ErrorState
          message="Unable to load articles. Please try again."
          onRetry={() => refetch()}
        />
      )}

      {/* Empty state */}
      {!isLoading && !isError && articles.length === 0 && (
        <EmptyState
          title="No articles published yet"
          message="Check back soon for golf analysis, tournament previews, and model breakdowns."
          icon="📰"
        />
      )}

      {/* Content */}
      {!isLoading && !isError && articles.length > 0 && (
        <div className="space-y-12">
          {/* Featured article */}
          {featured && (
            <section aria-label="Featured article">
              <ArticleCard article={featured} variant="featured" />
            </section>
          )}

          {/* Article grid */}
          {rest.length > 0 && (
            <section aria-label="Latest articles">
              <SectionHeader
                title="Latest"
                className="mb-6"
                action={
                  <Link
                    to="/articles/archive"
                    search={{
                      q: undefined,
                      author: undefined,
                      tag: undefined,
                      page: 1,
                      page_size: 12,
                      sort: "newest",
                    }}
                    className="text-sm text-amber-400 hover:text-amber-300 transition-colors"
                  >
                    View all →
                  </Link>
                }
              />
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            </section>
          )}

          {/* Pagination hint */}
          {(data?.has_more ?? false) && (
            <div className="text-center pt-4">
              <Link
                to="/articles/archive"
                search={{
                  q: undefined,
                  author: undefined,
                  tag: undefined,
                  page: 1,
                  page_size: 12,
                  sort: "newest",
                }}
                className="inline-block rounded-lg border border-slate-700 px-6 py-2.5 text-sm font-medium text-slate-200 hover:bg-slate-800 transition-colors"
              >
                See all articles
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
