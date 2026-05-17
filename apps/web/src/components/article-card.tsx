/**
 * ArticleCard — reusable article preview card for lists and grids
 */

import { Link } from "@tanstack/react-router";
import type { Article } from "@/types";

interface ArticleCardProps {
  article: Article;
  variant?: "default" | "featured" | "compact";
}

function formatDate(dateStr?: string | null): string {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function truncate(text: string, len: number): string {
  return text.length > len ? text.slice(0, len).trimEnd() + "…" : text;
}

export function ArticleCard({ article, variant = "default" }: ArticleCardProps) {
  const dateLabel = formatDate(article.published_at ?? article.created_at);

  if (variant === "featured") {
    return (
      <article className="group relative overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 transition-colors">
        {article.seo_metadata?.og_image_url && (
          <div className="aspect-[16/7] overflow-hidden">
            <img
              src={article.seo_metadata.og_image_url}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        )}
        <div className="p-6 sm:p-8">
          {article.is_premium && (
            <span className="mb-3 inline-block rounded-full bg-amber-500/20 px-3 py-0.5 text-xs font-semibold text-amber-400 uppercase tracking-wide">
              Premium
            </span>
          )}
          <h2 className="mb-3 text-2xl font-bold leading-snug text-slate-50 sm:text-3xl">
            <Link
              to="/articles/$slug"
              params={{ slug: article.slug }}
              className="hover:text-amber-400 transition-colors"
            >
              {article.title}
            </Link>
          </h2>
          <p className="mb-5 text-base text-slate-400 leading-relaxed">
            {truncate(article.description, 240)}
          </p>
          <div className="flex items-center gap-3 text-sm text-slate-500">
            <span className="font-medium text-slate-300">{article.author_name}</span>
            {dateLabel && (
              <>
                <span aria-hidden>·</span>
                <time dateTime={article.published_at ?? article.created_at}>{dateLabel}</time>
              </>
            )}
          </div>
        </div>
      </article>
    );
  }

  if (variant === "compact") {
    return (
      <article className="flex gap-4 rounded-xl bg-slate-900/60 p-4 border border-slate-800 hover:border-slate-700 transition-colors">
        <div className="flex-1 min-w-0">
          <h3 className="mb-1 text-sm font-semibold text-slate-200 leading-snug">
            <Link
              to="/articles/$slug"
              params={{ slug: article.slug }}
              className="hover:text-amber-400 transition-colors"
            >
              {article.title}
            </Link>
          </h3>
          <p className="text-xs text-slate-500">
            <span>{article.author_name}</span>
            {dateLabel && (
              <>
                {" "}
                · <time dateTime={article.published_at ?? article.created_at}>{dateLabel}</time>
              </>
            )}
          </p>
        </div>
      </article>
    );
  }

  // default card
  return (
    <article className="group flex flex-col rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors overflow-hidden">
      {article.seo_metadata?.og_image_url && (
        <div className="aspect-[16/9] overflow-hidden">
          <img
            src={article.seo_metadata.og_image_url}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-5">
        {article.is_premium && (
          <span className="mb-2 inline-block self-start rounded-full bg-amber-500/20 px-2.5 py-0.5 text-xs font-semibold text-amber-400 uppercase tracking-wide">
            Premium
          </span>
        )}
        <h3 className="mb-2 text-lg font-bold leading-snug text-slate-100">
          <Link
            to="/articles/$slug"
            params={{ slug: article.slug }}
            className="hover:text-amber-400 transition-colors"
          >
            {article.title}
          </Link>
        </h3>
        <p className="mb-4 flex-1 text-sm text-slate-400 leading-relaxed">
          {truncate(article.description, 160)}
        </p>
        <div className="flex items-center gap-2 text-xs text-slate-500 mt-auto">
          <span className="font-medium text-slate-400">{article.author_name}</span>
          {dateLabel && (
            <>
              <span aria-hidden>·</span>
              <time dateTime={article.published_at ?? article.created_at}>{dateLabel}</time>
            </>
          )}
        </div>
      </div>
    </article>
  );
}
