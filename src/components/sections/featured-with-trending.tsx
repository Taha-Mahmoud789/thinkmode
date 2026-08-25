import Link from "next/link";
import { ArticleCard, TrendingRow } from "@/components/articles/article-card";
import { SectionHeader } from "@/components/sections/section-header";
import { Reveal } from "@/components/ui/reveal";
import { Icon } from "@/components/ui/icon";
import { AdRectangle } from "@/components/ads/ad-slot";
import type { ArticleMeta } from "@/types";

interface FeaturedWithTrendingProps {
  featured: ArticleMeta[];
  trending: ArticleMeta[];
}

/**
 * Main content band: featured grid on the left (2fr), ranked trending rail on
 * the right (1fr). Collapses to a single column with Trending Now rendered
 * after the grid on mobile.
 */
export function FeaturedWithTrending({ featured, trending }: FeaturedWithTrendingProps) {
  const [lead, ...rest] = featured;

  return (
    <section className="tm-section relative" aria-labelledby="featured-heading">
      <div className="tm-container">
        <SectionHeader
          kicker="Fresh perspectives"
          title={<span id="featured-heading">Featured Articles</span>}
          description="Hand-picked deep dives on the ideas and tools shaping modern software."
          linkHref="/articles"
          linkLabel="View all articles"
        />

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-14">
          {/* ------------------------------- featured ------------------------------- */}
          <div>
            {lead ? (
              <Reveal>
                <ArticleCard article={lead} priority className="mb-6" />
              </Reveal>
            ) : null}
            {rest.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2">
                {rest.map((article, index) => (
                  <Reveal key={article.slug} delay={index * 70}>
                    <ArticleCard article={article} />
                  </Reveal>
                ))}
              </div>
            ) : null}
          </div>

          {/* ------------------------------- trending ------------------------------- */}
          <aside aria-labelledby="trending-heading" className="lg:border-l lg:border-border lg:pl-10">
            <div className="flex items-center justify-between">
              <h2
                id="trending-heading"
                className="font-display text-xs font-semibold uppercase tracking-[0.22em] text-text-tertiary"
              >
                Trending Now
              </h2>
              <Icon name="trending-up" size={16} className="text-primary-light" />
            </div>

            <ol className="mt-7 space-y-6">
              {trending.map((article, index) => (
                <li key={article.slug}>
                  <TrendingRow index={index + 1} article={article} showThumbnail={false} />
                </li>
              ))}
            </ol>

            {/* Reserved ad space (renders nothing until configured). */}
            <AdRectangle slotId="sidebar-rectangle" label="Advertisement" className="mt-10 hidden lg:block" />

            <Link
              href="/tags"
              className="group mt-8 flex items-center justify-between rounded-xl border border-border bg-surface px-5 py-4 text-sm font-medium text-text-secondary transition hover:border-border-strong hover:text-text"
            >
              Browse all topics
              <Icon name="arrow-up-right" size={15} className="text-text-tertiary transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </aside>
        </div>
      </div>
    </section>
  );
}
