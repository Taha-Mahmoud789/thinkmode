import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { HorizontalArticleCard } from "@/components/articles/article-card";
import {
  getArticlesByCategory,
  getCategoriesWithCounts,
} from "@/lib/articles";
import { categories } from "@/data/categories";
import { JsonLd, breadcrumbSchema, websiteSchema } from "@/lib/seo";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return categories.map((category) => ({ slug: category.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = categories.find((c) => c.slug === slug);
  if (!category) return {};
  return {
    title: category.name,
    description: category.description,
    alternates: { canonical: `/categories/${category.slug}` },
    openGraph: {
      title: `${category.name} — ThinkMode`,
      description: category.description,
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = categories.find((c) => c.slug === slug);
  if (!category) notFound();

  const articles = getArticlesByCategory(slug);
  const allCategories = getCategoriesWithCounts();

  return (
    <div className="pt-[72px]">
      <JsonLd data={websiteSchema()} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Categories", path: "/categories" },
          { name: category.name, path: `/categories/${category.slug}` },
        ])}
      />

      <header
        className="relative overflow-hidden border-b border-border"
        style={{
          background: `radial-gradient(600px 240px at 20% 0%, ${category.accent}14, transparent 70%)`,
        }}
      >
        <div className="tm-container pb-14 pt-16 md:pt-20">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-2 text-xs text-text-tertiary">
              <li><Link href="/" className="transition-colors hover:text-text">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link href="/categories" className="transition-colors hover:text-text">Categories</Link></li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-text-secondary">{category.name}</li>
            </ol>
          </nav>
          <p
            className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider"
            style={{
              backgroundColor: `${category.accent}16`,
              color: category.accent,
              border: `1px solid ${category.accent}44`,
            }}
          >
            Category
          </p>
          <h1 className="mt-5 font-display text-4xl font-extrabold tracking-[-0.025em] text-text md:text-5xl">
            {category.name}
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-text-secondary">
            {category.description}
          </p>
          <p className="mt-6 text-sm text-text-tertiary">
            {articles.length} {articles.length === 1 ? "article" : "articles"} · updated regularly
          </p>
        </div>
      </header>

      <div className="tm-container grid gap-12 py-12 lg:grid-cols-[minmax(0,1fr)_260px]">
        <div className="space-y-6">
          {articles.length > 0 ? (
            articles.map((article, index) => (
              <HorizontalArticleCard key={article.slug} article={article} priority={index < 2} />
            ))
          ) : (
            <p className="rounded-2xl border border-border bg-surface p-10 text-center text-text-secondary">
              New articles in this category are on the way.
            </p>
          )}
        </div>

        <aside>
          <h2 className="font-display text-xs font-semibold uppercase tracking-[0.22em] text-text-tertiary">
            Other categories
          </h2>
          <ul className="mt-6 space-y-2">
            {allCategories
              .filter((c) => c.slug !== category.slug)
              .map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/categories/${c.slug}`}
                    className="group flex items-center justify-between rounded-xl border border-transparent px-3 py-2.5 transition hover:border-border hover:bg-surface"
                  >
                    <span className="text-sm text-text-secondary group-hover:text-text">{c.name}</span>
                    <span className="text-xs tabular-nums text-text-tertiary">{c.count}</span>
                  </Link>
                </li>
              ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}
