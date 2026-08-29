/*
 * Covers are deterministic generated SVG routes; raster next/image
 * optimization does not apply, so raw <img> is correct here.
 */
/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { Reveal } from "@/components/ui/reveal";
import { Icon } from "@/components/ui/icon";
import type { ArticleMeta } from "@/types";
import { formatReadingMinutes } from "@/lib/utils";

interface TrendingRailProps {
  articles: ArticleMeta[];
}

/**
 * Horizontal scrollable rail of trending articles with large thumbnails
 * and bold rank numbers. Magazine "Most Read" style.
 */
export function TrendingRail({ articles }: TrendingRailProps) {
  if (articles.length === 0) return null;

  return (
    <section className="tm-section" aria-labelledby="trending-heading">
      <div className="tm-container">
        <div className="mb-8 flex items-baseline justify-between">
          <div>
            <p className="kicker">Most Read</p>
            <h2
              id="trending-heading"
              className="mt-3 font-display text-3xl font-bold tracking-tight text-text md:text-4xl"
            >
              Trending Now
            </h2>
          </div>
        </div>

        <div className="-mx-5 flex gap-5 overflow-x-auto px-5 pb-4 snap-x snap-mandatory scrollbar-none md:-mx-3 md:gap-6 md:px-3">
          {articles.map((article, index) => (
            <Reveal
              key={article.slug}
              delay={index * 60}
              className="snap-start"
            >
              <Link
                href={`/articles/${article.slug}`}
                className="group flex w-[260px] flex-col sm:w-[300px]"
              >
                <div className="relative overflow-hidden rounded-2xl border border-border">
                  <img
                    src={article.cover}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    width={600}
                    height={338}
                    className="aspect-[16/9] w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                  />
                  {/* Rank badge */}
                  <span className="absolute left-3 top-3 grid h-9 w-9 place-items-center rounded-xl bg-background/80 font-display text-lg font-bold tabular-nums text-text backdrop-blur-sm">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {/* Category chip */}
                  <span
                    className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider backdrop-blur"
                    style={{
                      backgroundColor: "rgba(5,5,8,0.55)",
                      color: article.category.accent,
                      border: `1px solid ${article.category.accent}55`,
                    }}
                  >
                    {article.category.shortName}
                  </span>
                </div>
                <div className="mt-4 flex flex-col gap-1.5">
                  <h3 className="line-clamp-2 font-display text-base font-semibold leading-snug tracking-tight text-text transition-colors group-hover:text-primary-light">
                    {article.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-text-tertiary">
                    <Icon name="clock" size={12} />
                    <span>{formatReadingMinutes(article.readingMinutes)}</span>
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
