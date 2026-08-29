import { HeroBanner } from "@/components/sections/hero-banner";
import { FeaturedCards } from "@/components/sections/featured-cards";
import { CategoryPills } from "@/components/sections/category-pills";
import { LatestNews } from "@/components/sections/latest-news";
import { ArticleGrid } from "@/components/sections/article-grid";
import { NewsletterSection } from "@/components/sections/editorial-blocks";
import {
  getCategoriesWithCounts,
  getAllArticleMetas,
  getFeaturedArticles,
} from "@/lib/articles";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { absoluteUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: ["technology news", "AI", "cybersecurity", "computing", "ThinkMode"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: absoluteUrl("/"),
    siteName: siteConfig.name,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: [{ url: absoluteUrl("/article-hero-ai.jpg"), width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: [absoluteUrl("/article-hero-ai.jpg")],
  },
  robots: { index: true, follow: true },
};

export default function HomePage() {
  const featured = getFeaturedArticles(3);
  const allArticles = getAllArticleMetas();
  const categories = getCategoriesWithCounts();

  // Latest = articles that are NOT featured (avoid duplicates)
  const featuredSlugs = new Set(featured.map((a) => a.slug));
  const latest = allArticles.filter((a) => !featuredSlugs.has(a.slug));

  return (
    <>
      {/* 1. Hero Banner — centered headline */}
      <HeroBanner />

      {/* 2. Featured Cards — 3 large cards with floating category chips */}
      <FeaturedCards articles={featured} />

      {/* 3. Category Pills — horizontal scrollable filter */}
      <CategoryPills categories={categories} />

      {/* 4. Latest News — asymmetric layout (large left, 2 small right) */}
      <LatestNews articles={latest.slice(0, 3)} />

      {/* 5. Article Grid — 2-column article cards */}
      <ArticleGrid articles={latest.slice(3, 7)} />

      {/* 6. Newsletter */}
      <NewsletterSection />
    </>
  );
}
