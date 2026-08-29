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

interface LatestNewsProps {
  articles: ArticleMeta[];
}

/**
 * Latest News — Asymmetric layout matching MAGZIN editorial design
 */
export function LatestNews({ articles }: LatestNewsProps) {
  if (articles.length < 3) return null;

  const [hero, ...rest] = articles;
  const sideCards = rest.slice(0, 2);

  return (
    <section className="tm-section" aria-labelledby="latest-heading">
      <div className="tm-container">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="kicker">
              <Icon name="zap" size={14} className="text-primary" />
              Latest News
            </p>
            <h2
              id="latest-heading"
              className="mt-2 font-display text-2xl font-bold tracking-tight text-text md:text-3xl"
            >
              Real-Time Updates That Matter
            </h2>
          </div>
          <Link
            href="/articles"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-text-inverse transition duration-200 hover:bg-primary-light"
            aria-label="View more articles"
          >
            <Icon name="arrow-right" size={18} />
          </Link>
        </div>

        <div className="grid gap-5 lg:grid-cols-5 lg:items-start">
          {/* Large card — left */}
          <Reveal className="lg:col-span-3">
            <Link
              href={`/articles/${hero.slug}`}
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface transition duration-300 hover:-translate-y-1 hover:border-border-strong hover:shadow-card"
            >
              <div className="relative aspect-[16/9] overflow-hidden bg-surface-2">
                <img
                  src={hero.cover}
                  alt=""
                  loading="eager"
                  decoding="async"
                  width={1200}
                  height={675}
                  className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider backdrop-blur"
                    style={{
                      backgroundColor: "var(--chip-bg)",
                      color: hero.category.accent,
                      border: `1px solid ${hero.category.accent}55`,
                    }}
                  >
                    {hero.category.shortName}
                  </span>
                  <h3 className="mt-2 max-w-xl font-display text-xl font-bold leading-tight tracking-tight text-text md:text-2xl">
                    {hero.title}
                  </h3>
                  <div className="mt-2 flex items-center gap-2">
                    <AuthorAvatar name={hero.author.name} size="sm" />
                    <span className="text-xs font-medium text-text">{hero.author.name}</span>
                    <span className="text-xs text-text-tertiary">·</span>
                    <span className="text-xs text-text-tertiary">{formatDate(hero.date)}</span>
                    <span className="text-xs text-text-tertiary">·</span>
                    <span className="text-xs text-text-tertiary">{formatReadingMinutes(hero.readingMinutes)}</span>
                  </div>
                </div>
              </div>
            </Link>
          </Reveal>

          {/* Small cards — right */}
          <div className="flex flex-col gap-5 lg:col-span-2">
            {sideCards.map((article, i) => (
              <Reveal key={article.slug} delay={(i + 1) * 100}>
                <Link
                  href={`/articles/${article.slug}`}
                  className="group flex overflow-hidden rounded-2xl border border-border bg-surface transition duration-300 hover:-translate-y-1 hover:border-border-strong hover:shadow-card"
                >
                  <div className="relative w-[45%] shrink-0 overflow-hidden bg-surface-2">
                    <img
                      src={article.cover}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      width={400}
                      height={300}
                      className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-center gap-1.5 p-4">
                    <div className="flex items-center gap-1.5 text-[10px] text-text-tertiary">
                      <span
                        className="font-semibold uppercase tracking-wider"
                        style={{ color: article.category.accent }}
                      >
                        {article.category.shortName}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{formatReadingMinutes(article.readingMinutes)}</span>
                    </div>
                    <h3 className="line-clamp-2 font-display text-sm font-semibold leading-snug tracking-tight text-text transition-colors group-hover:text-primary-light">
                      {article.title}
                    </h3>
                    <div className="mt-auto flex items-center justify-end pt-1">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full border border-border bg-surface transition-colors group-hover:border-primary group-hover:bg-primary group-hover:text-text-inverse">
                        <Icon name="arrow-right" size={12} />
                      </span>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
