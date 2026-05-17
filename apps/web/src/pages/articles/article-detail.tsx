/**
 * Article Detail Page — renders a single article by slug
 *
 * Resolves slug from route params, fetches the article, and renders
 * the title, metadata, and content_blocks sequentially.
 */

import { Link, useParams } from "@tanstack/react-router";
import { useArticle } from "@/lib/hooks";
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";
import type { ContentBlock } from "@/types";

function formatDate(dateStr?: string | null): string {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function renderBlock(block: ContentBlock) {
  const c = block.content as Record<string, unknown>;

  switch (block.type) {
    case "text":
      return (
        <div
          key={block.id}
          className="prose prose-invert prose-slate max-w-none"
          dangerouslySetInnerHTML={{ __html: (c.html as string) ?? (c.body as string) ?? "" }}
        />
      );

    case "image":
      return (
        <figure key={block.id} className="my-6">
          {typeof c.url === "string" && (
            <img
              src={c.url}
              alt={typeof c.alt === "string" ? c.alt : ""}
              className="w-full rounded-xl object-cover"
              loading="lazy"
            />
          )}
          {typeof c.caption === "string" && (
            <figcaption className="mt-2 text-center text-sm text-slate-500">{c.caption}</figcaption>
          )}
        </figure>
      );

    case "quote":
      return (
        <blockquote
          key={block.id}
          className="my-6 border-l-4 border-amber-500 pl-5 italic text-slate-300"
        >
          <p>{typeof c.text === "string" ? c.text : ""}</p>
          {typeof c.attribution === "string" && (
            <footer className="mt-2 text-sm not-italic text-slate-500">— {c.attribution}</footer>
          )}
        </blockquote>
      );

    case "stat": {
      const label = (c.label as string) ?? "Stat";
      const value = c.value !== undefined ? String(c.value) : "—";
      return (
        <div
          key={block.id}
          className="my-4 inline-flex flex-col rounded-xl border border-amber-500/30 bg-amber-500/5 px-6 py-4"
        >
          <span className="text-3xl font-bold text-amber-400">{value}</span>
          <span className="mt-1 text-sm text-slate-400">{label}</span>
        </div>
      );
    }

    default:
      return null;
  }
}

export function ArticleDetailPage() {
  const { slug } = useParams({ from: "/articles/$slug" });
  const { data: article, isLoading, isError, refetch } = useArticle(slug);

  const dateLabel = formatDate(article?.published_at ?? article?.created_at);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Back nav */}
      <nav className="mb-8">
        <Link
          to="/articles"
          className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-amber-400 transition-colors"
        >
          ← Back to Analysis
        </Link>
      </nav>

      {isLoading && <LoadingState variant="article" count={1} />}

      {isError && (
        <ErrorState
          title="Article not found"
          message="This article may have been removed or the link is incorrect."
          onRetry={() => refetch()}
        />
      )}

      {!isLoading && !isError && article && (
        <article>
          {/* Header */}
          <header className="mb-8">
            {article.is_premium && (
              <span className="mb-3 inline-block rounded-full bg-amber-500/20 px-3 py-0.5 text-xs font-semibold text-amber-400 uppercase tracking-wide">
                Premium
              </span>
            )}
            <h1 className="text-3xl font-extrabold leading-tight text-slate-50 sm:text-4xl">
              {article.title}
            </h1>
            {article.description && (
              <p className="mt-3 text-lg text-slate-400 leading-relaxed">{article.description}</p>
            )}
            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-500">
              <span className="font-medium text-slate-300">{article.author_name}</span>
              {dateLabel && (
                <>
                  <span aria-hidden>·</span>
                  <time dateTime={article.published_at ?? article.created_at}>{dateLabel}</time>
                </>
              )}
            </div>
          </header>

          {/* Hero image */}
          {article.seo_metadata?.og_image_url && (
            <div className="mb-8 overflow-hidden rounded-2xl">
              <img
                src={article.seo_metadata.og_image_url}
                alt=""
                className="w-full object-cover"
                loading="eager"
              />
            </div>
          )}

          {/* Content blocks */}
          <div className="space-y-5">
            {(article.content_blocks ?? [])
              .slice()
              .sort((a, b) => a.position - b.position)
              .map(renderBlock)}
          </div>

          {/* Footer */}
          <footer className="mt-12 border-t border-slate-800 pt-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm text-slate-500">Written by</p>
                <p className="text-base font-semibold text-slate-200">{article.author_name}</p>
              </div>
              <Link
                to="/articles"
                className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-700 transition-colors"
              >
                ← More articles
              </Link>
            </div>
          </footer>
        </article>
      )}
    </div>
  );
}
