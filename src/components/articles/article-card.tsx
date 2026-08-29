/*
 * Covers are deterministic generated SVGs (vector, tiny, crisp at any DPI).
 * Raster optimization via next/image does not apply, so raw <img> is correct here.
 */
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { BookmarkButton } from "@/components/ui/bookmark-button";
import { Icon } from "@/components/ui/icon";
import { AuthorAvatar } from "@/components/ui/author-avatar";
import type { ArticleMeta } from "@/types";
import { cn, formatDate, formatReadingMinutes } from "@/lib/utils";

interface ArticleCardProps {
  article: ArticleMeta;
  className?: string;
  /** Eager-load image (above-the-fold usage). */
  priority?: boolean;
}

/** Standard premium article card: cover, category chip, title, excerpt, meta. */
export function ArticleCard({ article, className = "", priority = false }: ArticleCardProps) {
  const href = `/articles/${article.slug}`;
  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface transition duration-300 hover:-translate-y-1 hover:border-border-strong hover:shadow-card",
        className,
      )}
    >
      <Link
        href={href}
        className="absolute inset-0 z-10"
        aria-label={article.title}
      />
      <div className="relative aspect-[16/9] overflow-hidden bg-surface-2">
        <img
          src={article.cover}
          alt=""
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          width={1200}
          height={675}
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
        />
        <span
          className="absolute left-3.5 top-3.5 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider backdrop-blur"
          style={{
            backgroundColor: "var(--chip-bg)",
            color: article.category.accent,
            border: `1px solid ${article.category.accent}55`,
          }}
        >
          <span
            aria-hidden="true"
            className="h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: article.category.accent }}
          />
          {article.category.shortName}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="font-display text-lg font-semibold leading-snug tracking-tight text-text">
          <Link
            href={href}
            className="rounded-sm after:absolute after:inset-0 after:content-[''] transition-colors group-hover:text-primary-light"
          >
            {article.title}
          </Link>
        </h3>
        <p className="line-clamp-2 text-sm leading-relaxed text-text-secondary">
          {article.description}
        </p>
        <div className="mt-auto flex items-center gap-4 pt-2 text-xs text-text-tertiary">
          <time dateTime={article.date}>{formatDate(article.date)}</time>
          <span aria-hidden="true" className="h-0.5 w-0.5 rounded-full bg-text-tertiary" />
          <span>{formatReadingMinutes(article.readingMinutes)}</span>
          <span className="ml-auto" />
        </div>
      </div>

      <BookmarkButton slug={article.slug} inline className="absolute bottom-4 right-4 z-20" />
    </article>
  );
}

interface CompactArticleRowProps {
  index: number;
  article: ArticleMeta;
  showThumbnail?: boolean;
}

/** Trending-list row: rank number + thumbnail + title + reading time. */
export function TrendingRow({ index, article, showThumbnail = true }: CompactArticleRowProps) {
  return (
    <li className="relative">
      <Link
        href={`/articles/${article.slug}`}
        className="group flex items-center gap-4 rounded-xl p-2 -m-2 transition-colors hover:bg-surface-2"
      >
        <span
          aria-hidden="true"
          className="w-7 shrink-0 font-display text-xl font-bold tabular-nums text-text-tertiary/60 transition-colors group-hover:text-primary-light"
        >
          {String(index).padStart(2, "0")}
        </span>
        {showThumbnail ? (
          <img
            src={article.cover}
            alt=""
            loading="lazy"
            decoding="async"
            width={112}
            height={112}
            className="h-14 w-14 shrink-0 rounded-xl border border-border object-cover"
          />
        ) : null}
        <div className="min-w-0">
          <h4 className="line-clamp-2 font-display text-sm font-semibold leading-snug text-text transition-colors group-hover:text-primary-light">
            {article.title}
          </h4>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-text-tertiary">
            <Icon name="clock" size={12} />
            {formatReadingMinutes(article.readingMinutes)}
          </p>
        </div>
      </Link>
    </li>
  );
}

interface HorizontalArticleCardProps {
  article: ArticleMeta;
  priority?: boolean;
}

/** Wide horizontal layout for /articles listing. */
export function HorizontalArticleCard({
  article,
  priority = false,
}: HorizontalArticleCardProps) {
  return (
    <article className="group relative grid overflow-hidden rounded-2xl border border-border bg-surface transition duration-300 hover:-translate-y-0.5 hover:border-border-strong hover:shadow-card sm:grid-cols-[260px_1fr] lg:grid-cols-[300px_1fr]">
      <div className="relative aspect-[16/9] overflow-hidden bg-surface-2 sm:aspect-auto sm:min-h-full">
        <img
          src={article.cover}
          alt=""
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          width={600}
          height={338}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex flex-col gap-3 p-6">
        <div className="flex items-center gap-3 text-xs">
          <Link
            href={`/categories/${article.category.slug}`}
            className="relative z-10 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-semibold uppercase tracking-wider"
            style={{
              backgroundColor: `${article.category.accent}14`,
              color: article.category.accent,
              border: `1px solid ${article.category.accent}44`,
            }}
          >
            {article.category.shortName}
          </Link>
          <time dateTime={article.date} className="text-text-tertiary">
            {formatDate(article.date)}
          </time>
        </div>
        <h2 className="font-display text-xl font-semibold leading-snug tracking-tight text-text lg:text-2xl">
          <Link
            href={`/articles/${article.slug}`}
            className="rounded-sm transition-colors group-hover:text-primary-light"
          >
            {article.title}
          </Link>
        </h2>
        <p className="line-clamp-2 text-sm leading-relaxed text-text-secondary">
          {article.description}
        </p>
        <div className="mt-auto flex items-center gap-4 pt-3 text-xs text-text-tertiary">
          <span className="inline-flex items-center gap-1.5">
            <AuthorAvatar name={article.author.name} size="sm" />
            {article.author.name}
          </span>
          <span aria-hidden="true">·</span>
          <span>{formatReadingMinutes(article.readingMinutes)}</span>
        </div>
      </div>
    </article>
  );
}
