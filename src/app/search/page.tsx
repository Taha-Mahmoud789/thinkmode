import type { Metadata } from "next";
import Link from "next/link";
import { TrendingRow } from "@/components/articles/article-card";
import { SearchInterface } from "@/components/blocks/search-interface";
import { getAllArticleMetas, getTrendingArticles } from "@/lib/articles";
import { Icon } from "@/components/ui/icon";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `Search: ${q}` : "Search",
    description:
      "Search ThinkMode articles by title, topic, category, or tag.",
    robots: { index: false, follow: true },
    alternates: q ? undefined : { canonical: "/search" },
  };
}

/** Server-rendered shell; the client widget filters the full meta set instantly. */
export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q = "" } = await searchParams;
  const trending = getTrendingArticles(5);

  return (
    <div className="pt-[72px]">
      <header className="relative overflow-hidden border-b border-border">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -top-28 left-1/2 h-[260px] w-[560px] -translate-x-1/2 rounded-full bg-primary/10 blur-[100px]" />
        </div>
        <div className="tm-container relative pb-12 pt-16 md:pt-20">
          <p className="kicker">Search</p>
          <h1 className="mt-5 font-display text-3xl font-extrabold tracking-tight text-text md:text-4xl">
            Find your next deep dive
          </h1>
          <p className="mt-3 max-w-xl text-text-secondary">
            Search across titles, summaries, categories, and topics.
          </p>
        </div>
      </header>

      <div className="tm-container grid gap-12 py-12 lg:grid-cols-[minmax(0,1fr)_300px]">
        <SearchInterface articles={getAllArticleMetas()} initialQuery={q} />

        <aside className="space-y-10">
          <div>
            <h2 className="font-display text-xs font-semibold uppercase tracking-[0.22em] text-text-tertiary">
              Trending now
            </h2>
            <ol className="mt-6 space-y-5">
              {trending.map((article, index) => (
                <li key={article.slug}>
                  <TrendingRow index={index + 1} article={article} showThumbnail={false} />
                </li>
              ))}
            </ol>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-6">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/12 text-primary-light">
              <Icon name="lightbulb" size={18} />
            </span>
            <h3 className="mt-4 font-display text-base font-semibold text-text">
              Try searching for
            </h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {["AI agents", "Next.js", "Rust vs Go", "Docker"].map((term) => (
                <li key={term}>
                  <Link
                    href={`/search?q=${encodeURIComponent(term)}`}
                    className="inline-block rounded-full border border-border px-3 py-1 text-xs text-text-secondary transition hover:border-primary/50 hover:text-text"
                  >
                    {term}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
