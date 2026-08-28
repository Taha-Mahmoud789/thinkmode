import { EditorialLead } from "@/components/sections/editorial-lead";
import { LatestStories } from "@/components/sections/latest-stories";
import { CategoryIndex } from "@/components/sections/category-index";
import { EditorsPickBanner } from "@/components/sections/editors-pick";
import {
  AboutTeaser,
  NewsletterSection,
  PrinciplesSection,
} from "@/components/sections/editorial-blocks";
import { AdInArticle } from "@/components/ads/ad-slot";
import {
  getCategoriesWithCounts,
  getAllArticleMetas,
  getEditorsPick,
  getFeaturedArticles,
  getTrendingArticles,
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
  const featured = getFeaturedArticles(6);
  const trending = getTrendingArticles(5);
  const latest = getAllArticleMetas();
  const categories = getCategoriesWithCounts();
  const editorsPick = getEditorsPick();

  return (
    <>
      <EditorialLead
        lead={featured[0] ?? null}
        briefs={[featured[1], featured[2]].filter(
          (article): article is NonNullable<typeof article> => Boolean(article),
        )}
      />
      <LatestStories articles={latest.slice(0, 8)} trending={trending} />
      <CategoryIndex categories={categories} />
      <EditorsPickBanner article={editorsPick} />
      <PrinciplesSection />
      <NewsletterSection />
      <AboutTeaser />
      <AdInArticle slotId="home-footer-banner" label="Advertisement" className="mb-10" />
    </>
  );
}