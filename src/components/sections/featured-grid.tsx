/*
 * Covers are deterministic generated SVG routes; raster next/image
 * optimization does not apply, so raw <img> is correct here.
 */
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { Reveal } from "@/components/ui/reveal";
import { Icon } from "@/components/ui/icon";
import { AuthorAvatar } from "@/components/ui/author-avatar";
import type { ArticleMeta } from "@/types";
import { formatDate, formatReadingMinutes } from "@/lib/utils";

interface FeaturedGridProps {
  articles: ArticleMeta[];
}

/**
 * Magazine-style featured grid with multiple card variants:
 * - Bundle: Large image + centered text below (Wired hero style)
 * - Side-by-side: Image left, text right (horizontal card)
 * - Compact: Small thumbnail + text (list item)
 */
export function FeaturedGrid({ articles }: FeaturedGridProps) {
  if (articles.length < 3) return null;

  const [bundle, side1, side2, ...compact] = articles;

  return (
    <section className="tm-section" aria-labelledby="featured-heading">
      <div className="tm-container">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="kicker">
              <Icon name="zap" size={14} className="text-primary" />
              Editor&apos;s Choice
            </p>
            <h2
              id="featured-heading"
              className="mt-3 font-display text-3xl font-bold tracking-tight text-text md:text-4xl"
            >
              Featured
            </h2>
          </div>
        </div>

        {/* ── Bundle card (large, centered text) ──────────────────── */}
        <Reveal>
          <Link
            href={`/articles/${bundle.slug}`}
            className="group relative block overflow-hidden rounded-2xl border border-border bg-surface transition duration-300 hover:-translate-y-1 hover:border-border-strong hover:shadow-card"
          >
            <div className="relative aspect-[21/9] overflow-hidden bg-surface-2">
              <img
                src={bundle.cover}
                alt=""
                loading="eager"
                decoding="async"
                width={1920}
                height={820}
                className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8 md:p-10">
                <h3 className="max-w-3xl font-display text-2xl font-bold leading-tight tracking-tight text-text sm:text-3xl md:text-4xl">
                  {bundle.title}
                </h3>
                <p className="mt-3 max-w-2xl line-clamp-2 text-sm leading-relaxed text-text-secondary sm:text-base">
                  {bundle.description}
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <AuthorAvatar name={bundle.author.name} size="sm" />
                  <div className="text-xs">
                    <span className="font-medium text-text">{bundle.author.name}</span>
                    <span className="text-text-tertiary"> · {formatDate(bundle.date)}</span>
                  </div>
                  <span className="text-xs text-text-tertiary">
                    {formatReadingMinutes(bundle.readingMinutes)}
                  </span>
                </div>
              </div>
            </div>
            <span
              className="absolute left-5 top-5 z-10 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider backdrop-blur sm:left-8 sm:top-8 md:left-10 md:top-10"
              style={{
                backgroundColor: "var(--chip-bg)",
                color: bundle.category.accent,
                border: `1px solid ${bundle.category.accent}55`,
              }}
            >
              {bundle.category.shortName}
            </span>
          </Link>
        </Reveal>

        {/* ── Side-by-side cards ──────────────────────────────────── */}
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {[side1, side2].map((article, i) => (
            <Reveal key={article.slug} delay={(i + 1) * 80}>
              <Link
                href={`/articles/${article.slug}`}
                className="group flex overflow-hidden rounded-2xl border border-border bg-surface transition duration-300 hover:-translate-y-1 hover:border-border-strong hover:shadow-card"
              >
                <div className="relative w-1/3 shrink-0 overflow-hidden bg-surface-2">
                  <img
                    src={article.cover}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    width={400}
                    height={400}
                    className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-2 p-5">
                  <span
                    className="text-[10px] font-semibold uppercase tracking-[0.14em]"
                    style={{ color: article.category.accent }}
                  >
                    {article.category.shortName}
                  </span>
                  <h3 className="line-clamp-2 font-display text-base font-semibold leading-snug tracking-tight text-text transition-colors group-hover:text-primary-light">
                    {article.title}
                  </h3>
                  <p className="line-clamp-2 text-sm text-text-secondary">
                    {article.description}
                  </p>
                  <div className="mt-auto flex items-center gap-2 pt-2 text-xs text-text-tertiary">
                    <time dateTime={article.date}>{formatDate(article.date)}</time>
                    <span aria-hidden="true" className="h-0.5 w-0.5 rounded-full bg-text-tertiary" />
                    <span>{formatReadingMinutes(article.readingMinutes)}</span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        {/* ── Compact list ────────────────────────────────────────── */}
        {compact.length > 0 && (
          <div className="mt-6 border-t border-border pt-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {compact.slice(0, 4).map((article, i) => (
                <Reveal key={article.slug} delay={i * 60}>
                  <Link
                    href={`/articles/${article.slug}`}
                    className="group flex gap-3"
                  >
                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-border">
                      <img
                        src={article.cover}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        width={112}
                        height={112}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p
                        className="text-[10px] font-semibold uppercase tracking-[0.14em]"
                        style={{ color: article.category.accent }}
                      >
                        {article.category.shortName}
                      </p>
                      <h4 className="mt-0.5 line-clamp-2 text-sm font-semibold leading-snug text-text transition-colors group-hover:text-primary-light">
                        {article.title}
                      </h4>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
