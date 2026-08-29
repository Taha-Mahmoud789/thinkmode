/*
 * Covers are deterministic generated SVG routes; raster next/image
 * optimization does not apply, so raw <img> is correct here.
 */
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { Reveal } from "@/components/ui/reveal";
import { AuthorAvatar } from "@/components/ui/author-avatar";
import type { ArticleMeta } from "@/types";
import { formatDate, formatReadingMinutes } from "@/lib/utils";

interface ArticleGridProps {
  articles: ArticleMeta[];
}

/**
 * Article Grid — Two-column cards matching MAGZIN editorial design
 */
export function ArticleGrid({ articles }: ArticleGridProps) {
  if (articles.length === 0) return null;

  return (
    <section className="tm-section" aria-labelledby="articles-heading">
      <div className="tm-container">
        <div className="mb-8">
          <p className="kicker">
            <Icon name="trending-up" size={14} className="text-primary" />
            Trending
          </p>
          <h2
            id="articles-heading"
            className="mt-2 font-display text-2xl font-bold tracking-tight text-text md:text-3xl"
          >
            Editor&apos;s Choice
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {articles.map((article, i) => (
            <Reveal key={article.slug} delay={i * 80}>
              <Link
                href={`/articles/${article.slug}`}
                className="group block overflow-hidden rounded-2xl border border-border bg-surface transition duration-300 hover:-translate-y-1 hover:border-border-strong hover:shadow-card"
              >
                <div className="relative aspect-[16/9] overflow-hidden bg-surface-2">
                  <img
                    src={article.cover}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    width={800}
                    height={450}
                    className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                  />
                  <div className="absolute left-4 top-4 flex gap-2">
                    <span
                      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider backdrop-blur"
                      style={{
                        backgroundColor: "var(--chip-bg)",
                        color: article.category.accent,
                        border: `1px solid ${article.category.accent}55`,
                      }}
                    >
                      {article.category.shortName}
                    </span>
                  </div>
                  <button
                    className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/90 backdrop-blur-sm transition-colors hover:bg-white"
                    aria-label={`Bookmark ${article.title}`}
                  >
                    <Icon name="bookmark" size={14} className="text-text" />
                  </button>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 text-xs text-text-tertiary">
                    <time dateTime={article.date}>{formatDate(article.date)}</time>
                    <span aria-hidden="true">·</span>
                    <span>{formatReadingMinutes(article.readingMinutes)}</span>
                  </div>
                  <h3 className="mt-2 line-clamp-2 font-display text-lg font-semibold leading-snug tracking-tight text-text transition-colors group-hover:text-primary-light">
                    {article.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-text-secondary">
                    {article.description}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AuthorAvatar name={article.author.name} size="sm" />
                      <span className="text-xs font-medium text-text">{article.author.name}</span>
                    </div>
                    <span className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-surface transition-colors group-hover:border-primary group-hover:bg-primary group-hover:text-text-inverse">
                      <Icon name="arrow-right" size={14} />
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
