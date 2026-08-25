import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { HorizontalArticleCard } from "@/components/articles/article-card";
import { AdBanner } from "@/components/ads/ad-slot";
import {
  getAllArticleMetas,
  getTagsWithCounts,
} from "@/lib/articles";

export const metadata: Metadata = {
  title: "Articles",
  description:
    "Every ThinkMode article — deep dives on programming, AI, web development, DevOps, security, and the tools of modern engineering.",
  alternates: { canonical: "/articles" },
};

export default function ArticlesIndexPage() {
  const articles = getAllArticleMetas();
  const topTags = getTagsWithCounts(10);

  return (
    <div className="pt-[72px]">
      {/* page header */}
      <header className="relative overflow-hidden border-b border-border">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -top-28 left-1/2 h-[300px] w-[640px] -translate-x-1/2 rounded-full bg-primary/10 blur-[110px]" />
        </div>
        <div className="tm-container relative pb-14 pt-16 md:pt-24">
          <p className="kicker">The archive</p>
          <h1 className="mt-5 font-display text-4xl font-extrabold tracking-[-0.025em] text-text md:text-5xl">
            All Articles
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-text-secondary">
            Deep dives, honest comparisons, and field-tested practices across
            programming, AI, and modern infrastructure.
          </p>
        </div>
      </header>

      <AdBanner slotId="articles-top" label="Advertisement" className="mt-8" />

      <div className="tm-container grid gap-12 py-12 lg:grid-cols-[minmax(0,1fr)_260px]">
        <div className="space-y-6">
          {articles.map((article, index) => (
            <HorizontalArticleCard key={article.slug} article={article} priority={index < 2} />
          ))}
        </div>

        <aside className="lg:border-l lg:border-border lg:pl-10">
          <h2 className="font-display text-xs font-semibold uppercase tracking-[0.22em] text-text-tertiary">
            Popular topics
          </h2>
          <ul className="mt-6 flex flex-wrap gap-2">
            {topTags.map((tag) => (
              <li key={tag.slug}>
                <Link
                  href={`/tags/${tag.slug}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3.5 py-1.5 text-sm text-text-secondary transition hover:border-primary/50 hover:text-text"
                >
                  #{tag.name}
                  <span className="text-xs text-text-tertiary">{tag.count}</span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-10 rounded-2xl border border-border bg-surface p-6">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/12 text-primary-light">
              <Icon name="mail" size={18} />
            </span>
            <h3 className="mt-4 font-display text-base font-semibold text-text">
              Never miss an issue
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-text-secondary">
              One email a week. The best of ThinkMode, no noise.
            </p>
            <Link href="/newsletter" className="btn btn-primary btn-sm mt-5 w-full">
              Subscribe free
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
