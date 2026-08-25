import { Hero } from "@/components/sections/hero";
import { FeaturedWithTrending } from "@/components/sections/featured-with-trending";
import { CategoriesSection } from "@/components/sections/categories-section";
import { EditorsPickBanner } from "@/components/sections/editors-pick";
import {
  AboutTeaser,
  NewsletterSection,
  PrinciplesSection,
} from "@/components/sections/editorial-blocks";
import { AdInArticle } from "@/components/ads/ad-slot";
import {
  getCategoriesWithCounts,
  getEditorsPick,
  getFeaturedArticles,
  getTrendingArticles,
} from "@/lib/articles";

export default function HomePage() {
  const featured = getFeaturedArticles(5);
  const trending = getTrendingArticles(5);
  const categories = getCategoriesWithCounts();
  const editorsPick = getEditorsPick();

  return (
    <>
      <Hero featuredArticle={featured[0] ?? null} />
      <FeaturedWithTrending featured={featured} trending={trending} />
      <CategoriesSection categories={categories} />
      <EditorsPickBanner article={editorsPick} />
      <PrinciplesSection />
      <NewsletterSection />
      <AboutTeaser />
      <AdInArticle slotId="home-footer-banner" label="Advertisement" className="mb-10" />
    </>
  );
}
