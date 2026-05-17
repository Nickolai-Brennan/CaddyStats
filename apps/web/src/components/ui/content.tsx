/**
 * DS-14 Content Components
 *
 * ArticleHero     — full-width article banner with title, meta, and image
 * AuthorCard      — author bio card with avatar and links
 * StatCallout     — highlighted inline stat block
 * QuoteBlock      — editorial pull quote
 * AIInsightsPanel — AI-generated summary panel with grounding indicator
 * RelatedContent  — horizontal card strip for related articles/pages
 */

import type { ReactNode } from "react";
import { cx } from "./utils";

// ---------------------------------------------------------------------------
// ArticleHero (DS-14)
// ---------------------------------------------------------------------------
interface ArticleHeroProps {
  title: string;
  subtitle?: string;
  category?: string;
  publishedAt?: string;
  authorName?: string;
  authorAvatar?: string;
  imageUrl?: string;
  readTime?: string;
  className?: string;
}

export function ArticleHero({
  title,
  subtitle,
  category,
  publishedAt,
  authorName,
  authorAvatar,
  imageUrl,
  readTime,
  className,
}: ArticleHeroProps) {
  return (
    <header className={cx("overflow-hidden rounded-2xl border border-slate-800 bg-slate-900", className)}>
      {imageUrl && (
        <div className="relative h-64 overflow-hidden sm:h-80">
          <img
            src={imageUrl}
            alt=""
            className="h-full w-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
        </div>
      )}
      <div className="px-6 py-8">
        {category && (
          <span className="mb-3 inline-block rounded-full bg-amber-500/15 px-3 py-0.5 text-xs font-semibold uppercase tracking-wide text-amber-400">
            {category}
          </span>
        )}
        <h1 className="text-3xl font-bold tracking-tight text-slate-50 sm:text-4xl">{title}</h1>
        {subtitle && <p className="mt-3 text-lg leading-relaxed text-slate-300">{subtitle}</p>}
        <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-slate-400">
          {(authorName || authorAvatar) && (
            <div className="flex items-center gap-2">
              {authorAvatar && (
                <img src={authorAvatar} alt={authorName ?? ""} className="h-7 w-7 rounded-full object-cover" loading="lazy" />
              )}
              {authorName && <span className="font-medium text-slate-200">{authorName}</span>}
            </div>
          )}
          {publishedAt && <time dateTime={publishedAt}>{publishedAt}</time>}
          {readTime && <span>{readTime} read</span>}
        </div>
      </div>
    </header>
  );
}

// ---------------------------------------------------------------------------
// AuthorCard (DS-14)
// ---------------------------------------------------------------------------
interface AuthorCardProps {
  name: string;
  role?: string;
  bio?: string;
  avatarUrl?: string;
  twitterHandle?: string;
  className?: string;
}

export function AuthorCard({ name, role, bio, avatarUrl, twitterHandle, className }: AuthorCardProps) {
  return (
    <div className={cx("flex gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-5", className)}>
      {avatarUrl ? (
        <img src={avatarUrl} alt={name} className="h-16 w-16 shrink-0 rounded-full object-cover" loading="lazy" />
      ) : (
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-xl font-bold text-amber-400">
          {name.charAt(0).toUpperCase()}
        </div>
      )}
      <div>
        <p className="font-semibold text-slate-100">{name}</p>
        {role && <p className="text-sm text-slate-400">{role}</p>}
        {bio && <p className="mt-2 text-sm leading-relaxed text-slate-400">{bio}</p>}
        {twitterHandle && (
          <a
            href={`https://twitter.com/${twitterHandle}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block text-sm text-amber-400 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
          >
            @{twitterHandle}
          </a>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// StatCallout (DS-14)
// ---------------------------------------------------------------------------
interface StatCalloutProps {
  stats: Array<{ label: string; value: string | number; detail?: string }>;
  className?: string;
}

export function StatCallout({ stats, className }: StatCalloutProps) {
  return (
    <div
      className={cx(
        "flex flex-wrap gap-6 rounded-xl border border-amber-500/20 bg-amber-500/5 px-6 py-5",
        className
      )}
    >
      {stats.map((s) => (
        <div key={s.label}>
          <p className="text-xs font-medium uppercase tracking-wide text-amber-400/70">{s.label}</p>
          <p className="mt-0.5 text-2xl font-bold tabular-nums text-amber-300">
            {typeof s.value === "number" ? s.value.toLocaleString() : s.value}
          </p>
          {s.detail && <p className="text-xs text-slate-500">{s.detail}</p>}
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// QuoteBlock (DS-14)
// ---------------------------------------------------------------------------
interface QuoteBlockProps {
  quote: string;
  attribution?: string;
  attributionRole?: string;
  className?: string;
}

export function QuoteBlock({ quote, attribution, attributionRole, className }: QuoteBlockProps) {
  return (
    <blockquote
      className={cx(
        "relative rounded-xl border-l-4 border-amber-500 bg-slate-900 py-4 pl-6 pr-5",
        className
      )}
    >
      <svg
        className="absolute left-4 top-3 h-5 w-5 text-amber-500/30"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden
      >
        <path d="M9.983 3v7.391c0 5.704-3.731 9.57-8.983 10.609l-.995-2.151c2.432-.917 3.995-3.638 3.995-5.849h-4v-10h9.983zm14.017 0v7.391c0 5.704-3.748 9.571-9 10.609l-.996-2.151c2.433-.917 3.996-3.638 3.996-5.849h-3.983v-10h9.983z" />
      </svg>
      <p className="text-base italic leading-relaxed text-slate-200">{quote}</p>
      {attribution && (
        <footer className="mt-3 text-sm text-slate-400">
          <cite className="not-italic font-medium text-slate-300">{attribution}</cite>
          {attributionRole && <span className="ml-1 text-slate-500">— {attributionRole}</span>}
        </footer>
      )}
    </blockquote>
  );
}

// ---------------------------------------------------------------------------
// AIInsightsPanel (DS-14)
// ---------------------------------------------------------------------------
interface AIInsightsPanelProps {
  summary: string;
  groundingNote?: string;
  confidence?: number;
  generatedAt?: string;
  isReviewed?: boolean;
  children?: ReactNode;
  className?: string;
}

export function AIInsightsPanel({
  summary,
  groundingNote,
  confidence,
  generatedAt,
  isReviewed,
  children,
  className,
}: AIInsightsPanelProps) {
  return (
    <aside
      className={cx(
        "rounded-xl border border-violet-500/25 bg-violet-500/5 p-5",
        className
      )}
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-base" aria-hidden>🤖</span>
          <span className="text-sm font-semibold text-violet-300">AI Insights</span>
          {isReviewed && (
            <span className="rounded-full bg-green-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-green-400">
              Reviewed
            </span>
          )}
        </div>
        {confidence !== undefined && (
          <span className="text-xs text-slate-500">
            Confidence: <span className="text-sky-400">{confidence}%</span>
          </span>
        )}
      </div>
      <p className="text-sm leading-relaxed text-slate-300">{summary}</p>
      {children && <div className="mt-3 space-y-2 text-sm text-slate-400">{children}</div>}
      {groundingNote && (
        <p className="mt-3 rounded-lg bg-slate-800 px-3 py-2 text-xs text-slate-500">
          📊 {groundingNote}
        </p>
      )}
      {generatedAt && (
        <p className="mt-2 text-[10px] text-slate-600">Generated {generatedAt}</p>
      )}
    </aside>
  );
}

// ---------------------------------------------------------------------------
// RelatedContent (DS-14)
// ---------------------------------------------------------------------------
interface RelatedItem {
  id: string;
  title: string;
  category?: string;
  href: string;
  imageUrl?: string;
  publishedAt?: string;
}

interface RelatedContentProps {
  title?: string;
  items: RelatedItem[];
  className?: string;
}

export function RelatedContent({ title = "Related", items, className }: RelatedContentProps) {
  if (items.length === 0) return null;
  return (
    <section aria-label={title} className={className}>
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">{title}</h3>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <a
            key={item.id}
            href={item.href}
            className="group flex flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-900 transition-colors hover:border-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
          >
            {item.imageUrl && (
              <div className="h-36 overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt=""
                  className="h-full w-full object-cover transition-transform duration-slow group-hover:scale-105"
                  loading="lazy"
                />
              </div>
            )}
            <div className="flex flex-1 flex-col p-4">
              {item.category && (
                <span className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-amber-400">
                  {item.category}
                </span>
              )}
              <p className="flex-1 text-sm font-medium leading-snug text-slate-200 group-hover:text-slate-100">
                {item.title}
              </p>
              {item.publishedAt && (
                <time className="mt-2 text-[10px] text-slate-500">{item.publishedAt}</time>
              )}
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
