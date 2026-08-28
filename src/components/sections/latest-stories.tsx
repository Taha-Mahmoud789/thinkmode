import Link from "next/link";
import { TrendingRow } from "@/components/articles/article-card";
import { AdRectangle } from "@/components/ads/ad-slot";
import { Icon } from "@/components/ui/icon";
import type { ArticleMeta } from "@/types";
import { formatDate, formatReadingMinutes } from "@/lib/utils";

interface LatestStoriesProps {
  articles: ArticleMeta[];
  trending: ArticleMeta[];
}

/**
 * News-feed band: a dated chronological "Latest" list beside a numbered
 * "Most Read" rail. Shared hairline section rules, no card chrome.
 */
export function LatestStories({ articles, trending }: LatestStoriesProps) {
  return (
    <section className="tm-section" aria-labelledby="latest-heading">
      <div className="tm-container">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-12">
          {/* ------------------------------- The Latest ------------------------------ */}
          <div className="lg:col-span-8">
            <div className="flex items-baseline justify-between border-b-2 border-text pb-3">
              <h2
                id="latest-heading"
                className="font-display text-2xl font-bold tracking-tight text-text"
              >
                The Latest
              </h2>
              <Link
                href="/articles"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary transition-colors hover:text-text"
              >
                All articles
                <Icon name="arrow-right" size={14} />
              </Link>
            </div>

            <ul className="divide-y divide-border">
              {articles.map((article) => (
                <li key={article.slug}>
                  <Link
                    href={`/articles/${article.slug}`}
                    className="group grid gap-x-6 gap-y-2 py-6 sm:grid-cols-[96px_1fr]"
                  >
                    <time
                      dateTime={article.date}
                      className="text-xs leading-6 tabular-nums text-text-tertiary"
                    >
                      {formatDate(article.date)}
                    </time>
                    <div className="min-w-0">
                      <p
                        className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] transition-colors group-hover:text-primary-light"
                        style={{ color: article.category.accent }}
                      >
                        <span
                          aria-hidden="true"
                          className="h-1 w-1 rounded-full"
                          style={{ backgroundColor: article.category.accent }}
                        />
                        {article.category.shortName}
                      </p>
                      <h3 className="mt-1.5 font-display text-lg font-semibold leading-snug tracking-tight text-text transition-colors group-hover:text-primary-light">
                        {article.title}
                      </h3>
                      <p className="mt-1.5 line-clamp-1 text-sm text-text-secondary">
                        {article.description}
                      </p>
                      <p className="mt-2 text-xs text-text-tertiary">
                        {formatReadingMinutes(article.readingMinutes)}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ------------------------------ Most Read rail ----------------------------- */}
          <aside className="lg:col-span-4" aria-labelledby="most-read-heading">
            <div className="border-b-2 border-text pb-3">
              <h2
                id="most-read-heading"
                className="font-display text-2xl font-bold tracking-tight text-text"
              >
                Most Read
              </h2>
            </div>

            <ol className="mt-2">
              {trending.map((article, index) => (
                <TrendingRow key={article.slug} index={index + 1} article={article} />
              ))}
            </ol>

            <AdRectangle slotId="home-most-read" label="Advertisement" className="mt-8" />
          </aside>
        </div>
      </div>
    </section>
  );
}