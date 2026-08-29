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

interface LatestStoriesProps {
  articles: ArticleMeta[];
  trending?: ArticleMeta[];
}

/**
 * Magazine-style grid: asymmetric layout with the first article featured large,
 * a sticky "Most Read" sidebar, and a compact bottom row.
 */
export function LatestStories({ articles, trending = [] }: LatestStoriesProps) {
  if (articles.length === 0) return null;

  const [hero, ...rest] = articles;

  return (
    <section className="tm-section" aria-labelledby="latest-heading">
      <div className="tm-container">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="kicker">
              <Icon name="sparkles" size={14} className="text-primary" />
              Latest
            </p>
            <h2
              id="latest-heading"
              className="mt-3 font-display text-3xl font-bold tracking-tight text-text md:text-4xl"
            >
              Stories
            </h2>
          </div>
          <Link
            href="/articles"
            className="group inline-flex items-center gap-1.5 rounded-full text-sm font-medium text-text-secondary transition hover:text-text"
          >
            View all
            <Icon
              name="arrow-right"
              size={15}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        </div>

        {/* ── Main content + sticky sidebar ───────────────────────── */}
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          {/* Left: hero + side cards */}
          <div className="min-w-0">
            {/* Hero card */}
            <Reveal>
              <Link
                href={`/articles/${hero.slug}`}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-surface transition duration-300 hover:-translate-y-1 hover:border-border-strong hover:shadow-card"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-surface-2">
                  <img
                    src={hero.cover}
                    alt=""
                    loading="eager"
                    decoding="async"
                    width={1200}
                    height={750}
                    className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                  />
                  <span
                    className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider backdrop-blur"
                    style={{
                      backgroundColor: "rgba(5,5,8,0.55)",
                      color: hero.category.accent,
                      border: `1px solid ${hero.category.accent}55`,
                    }}
                  >
                    <span
                      aria-hidden="true"
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: hero.category.accent }}
                    />
                    {hero.category.shortName}
                  </span>
                </div>
                <div className="flex flex-col gap-3 p-6">
                  <h3 className="font-display text-xl font-semibold leading-snug tracking-tight text-text sm:text-2xl">
                    {hero.title}
                  </h3>
                  <p className="line-clamp-2 text-sm leading-relaxed text-text-secondary">
                    {hero.description}
                  </p>
                  <div className="flex items-center gap-3 pt-3">
                    <AuthorAvatar name={hero.author.name} size="sm" />
                    <div className="text-xs">
                      <span className="font-medium text-text">{hero.author.name}</span>
                      <span className="text-text-tertiary"> · {formatDate(hero.date)}</span>
                    </div>
                    <span className="ml-auto text-xs text-text-tertiary">
                      {formatReadingMinutes(hero.readingMinutes)}
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>

            {/* Side cards */}
            {rest.length > 0 && (
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                {rest.slice(0, 2).map((article, i) => (
                  <Reveal key={article.slug} delay={(i + 1) * 80}>
                    <Link
                      href={`/articles/${article.slug}`}
                      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-surface transition duration-300 hover:-translate-y-1 hover:border-border-strong hover:shadow-card"
                    >
                      <div className="relative aspect-[16/9] overflow-hidden bg-surface-2">
                        <img
                          src={article.cover}
                          alt=""
                          loading="lazy"
                          decoding="async"
                          width={600}
                          height={338}
                          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                        />
                        <span
                          className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider backdrop-blur"
                          style={{
                            backgroundColor: "rgba(5,5,8,0.55)",
                            color: article.category.accent,
                            border: `1px solid ${article.category.accent}55`,
                          }}
                        >
                          {article.category.shortName}
                        </span>
                      </div>
                      <div className="flex flex-col gap-2 p-5">
                        <h3 className="line-clamp-2 font-display text-base font-semibold leading-snug tracking-tight text-text transition-colors group-hover:text-primary-light">
                          {article.title}
                        </h3>
                        <p className="line-clamp-2 text-sm text-text-secondary">
                          {article.description}
                        </p>
                        <div className="flex items-center gap-2 pt-2 text-xs text-text-tertiary">
                          <time dateTime={article.date}>{formatDate(article.date)}</time>
                          <span aria-hidden="true" className="h-0.5 w-0.5 rounded-full bg-text-tertiary" />
                          <span>{formatReadingMinutes(article.readingMinutes)}</span>
                        </div>
                      </div>
                    </Link>
                  </Reveal>
                ))}
              </div>
            )}
          </div>

          {/* Right: sticky sidebar */}
          {trending.length > 0 && (
            <aside className="hidden lg:block" aria-labelledby="most-read-heading">
              <div className="sticky top-24">
                <div className="mb-5 flex items-center gap-2">
                  <Icon name="trending-up" size={18} className="text-primary" />
                  <h2
                    id="most-read-heading"
                    className="font-display text-lg font-bold tracking-tight text-text"
                  >
                    Most Read
                  </h2>
                </div>

                <ol className="space-y-1">
                  {trending.slice(0, 5).map((article, index) => (
                    <li key={article.slug}>
                      <Link
                        href={`/articles/${article.slug}`}
                        className="group flex items-start gap-3 rounded-xl p-2 -m-2 transition-colors hover:bg-surface-2"
                      >
                        <span
                          aria-hidden="true"
                          className="mt-0.5 w-7 shrink-0 font-display text-xl font-bold tabular-nums text-text-tertiary/60 transition-colors group-hover:text-primary-light"
                        >
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <div className="min-w-0">
                          <h4 className="line-clamp-2 text-sm font-semibold leading-snug text-text transition-colors group-hover:text-primary-light">
                            {article.title}
                          </h4>
                          <p className="mt-1 flex items-center gap-1.5 text-xs text-text-tertiary">
                            <Icon name="clock" size={12} />
                            {formatReadingMinutes(article.readingMinutes)}
                          </p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ol>
              </div>
            </aside>
          )}
        </div>

        {/* ── Bottom row — 2x3 compact cards ───────────────────────── */}
        {rest.length > 2 && (
          <div className="mt-8 border-t border-border pt-8">
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {rest.slice(2, 8).map((article, i) => (
                <Reveal key={article.slug} delay={i * 60}>
                  <Link
                    href={`/articles/${article.slug}`}
                    className="group flex gap-3"
                  >
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-border">
                      <img
                        src={article.cover}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        width={128}
                        height={128}
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
