import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { ArticleCard } from "@/components/articles/article-card";
import { NewsletterForm } from "@/components/blocks/newsletter-form";
import type { AdjacentArticles, ArticleMeta } from "@/types";

interface RelatedArticlesProps {
  articles: ArticleMeta[];
}

export function RelatedArticles({ articles }: RelatedArticlesProps) {
  if (articles.length === 0) return null;

  return (
    <section className="tm-section border-t border-border" aria-labelledby="related-heading">
      <div className="tm-container">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="kicker">Keep reading</p>
            <h2
              id="related-heading"
              className="mt-4 font-display text-2xl font-bold tracking-tight text-text md:text-3xl"
            >
              Related articles
            </h2>
          </div>
          <Link
            href="/articles"
            className="group inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary transition hover:text-text"
          >
            All articles
            <Icon name="arrow-right" size={15} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      </div>
    </section>
  );
}

/** Chronological prev/next navigation between articles. */
export function PrevNextNavigation({ adjacent }: { adjacent: AdjacentArticles }) {
  if (!adjacent.newer && !adjacent.older) return null;

  return (
    <nav
      aria-label="Article navigation"
      className="border-t border-border"
    >
      <div className="tm-container grid gap-4 py-10 sm:grid-cols-2">
        {/* older */}
        <div>
          {adjacent.older ? (
            <Link
              href={adjacent.older.url}
              className="group flex h-full flex-col rounded-2xl border border-border bg-surface p-6 transition hover:-translate-y-0.5 hover:border-border-strong"
            >
              <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-text-tertiary">
                <Icon name="chevron-left" size={14} />
                Older
              </p>
              <p className="mt-3 line-clamp-2 font-display text-base font-semibold leading-snug text-text transition-colors group-hover:text-primary-light">
                {adjacent.older.title}
              </p>
            </Link>
          ) : null}
        </div>
        {/* newer */}
        <div>
          {adjacent.newer ? (
            <Link
              href={adjacent.newer.url}
              className="group flex h-full flex-col items-end rounded-2xl border border-border bg-surface p-6 text-right transition hover:-translate-y-0.5 hover:border-border-strong"
            >
              <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-text-tertiary">
                Newer
                <Icon name="chevron-right" size={14} />
              </p>
              <p className="mt-3 line-clamp-2 font-display text-base font-semibold leading-snug text-text transition-colors group-hover:text-primary-light">
                {adjacent.newer.title}
              </p>
            </Link>
          ) : null}
        </div>
      </div>
    </nav>
  );
}

/** Compact end-of-article newsletter CTA. */
export function ArticleNewsletterCta() {
  return (
    <aside className="tm-container pb-16">
      <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-surface to-surface-2 px-7 py-10 md:px-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-20 h-[240px] w-[240px] rounded-full bg-primary/15 blur-[80px]"
        />
        <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_360px]">
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight text-text">
              Enjoyed this? Stay ahead.
            </h2>
            <p className="mt-2 max-w-lg leading-relaxed text-text-secondary">
              Get articles like this — deep, practical, hype-free — in your
              inbox every week.
            </p>
          </div>
          <NewsletterForm source="article-footer" compact />
        </div>
      </div>
    </aside>
  );
}
