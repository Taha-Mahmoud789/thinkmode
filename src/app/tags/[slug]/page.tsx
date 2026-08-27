import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { HorizontalArticleCard } from "@/components/articles/article-card";
import { getAllArticleMetas, getArticlesByTag, getTagsWithCounts } from "@/lib/articles";
import { tagSlug as makeTagSlug } from "@/lib/utils";

interface TagPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = true;

export async function generateMetadata({
  params,
}: TagPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tags = getTagsWithCounts();
  const tag = tags.find((t) => t.slug === slug);
  if (!tag) return {};
  return {
    title: `#${tag.name}`,
    description: `Articles tagged #${tag.name} on ThinkMode.`,
    alternates: { canonical: `/tags/${tag.slug}` },
  };
}

export default async function TagPage({ params }: TagPageProps) {
  const { slug } = await params;
  const tags = getTagsWithCounts();
  const tag = tags.find((t) => t.slug === slug);
  if (!tag) notFound();

  const articles = getArticlesByTag(slug);
  const relatedTags = tags.filter((t) => t.slug !== slug).slice(0, 12);

  return (
    <div className="pt-[72px]">
      <header className="relative overflow-hidden border-b border-border">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -top-28 left-1/2 h-[280px] w-[560px] -translate-x-1/2 rounded-full bg-cyan/8 blur-[100px]" />
        </div>
        <div className="tm-container relative pb-12 pt-16 md:pt-20">
          <Link
            href="/articles"
            className="text-xs text-text-tertiary transition-colors hover:text-text"
          >
            ← All articles
          </Link>
          <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-text md:text-4xl">
            #{tag.name}
          </h1>
          <p className="mt-3 text-sm text-text-tertiary">
            {tag.count} {tag.count === 1 ? "article" : "articles"}
          </p>
        </div>
      </header>

      <div className="tm-container grid gap-12 py-12 lg:grid-cols-[minmax(0,1fr)_260px]">
        <div className="space-y-6">
          {articles.map((article, index) => (
            <HorizontalArticleCard key={article.slug} article={article} priority={index < 2} />
          ))}
        </div>
        <aside>
          <h2 className="font-display text-xs font-semibold uppercase tracking-[0.22em] text-text-tertiary">
            Related topics
          </h2>
          <ul className="mt-6 flex flex-wrap gap-2">
            {relatedTags.map((t) => (
              <li key={t.slug}>
                <Link
                  href={`/tags/${t.slug}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3.5 py-1.5 text-sm text-text-secondary transition hover:border-primary/50 hover:text-text"
                >
                  #{t.name}
                  <span className="text-xs text-text-tertiary">{t.count}</span>
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}
