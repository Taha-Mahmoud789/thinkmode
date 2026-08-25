import type { MetadataRoute } from "next";
import { getAllArticleMetas, getArticleSlugs } from "@/lib/articles";
import { categories } from "@/data/categories";
import { getTagsWithCounts } from "@/lib/articles";
import { siteConfig } from "@/config/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getAllArticleMetas();
  const tags = getTagsWithCounts();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteConfig.url, changeFrequency: "daily", priority: 1 },
    { url: `${siteConfig.url}/articles`, changeFrequency: "daily", priority: 0.9 },
    { url: `${siteConfig.url}/categories`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${siteConfig.url}/ai-lab`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${siteConfig.url}/tutorials`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${siteConfig.url}/newsletter`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteConfig.url}/about`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteConfig.url}/contact`, changeFrequency: "monthly", priority: 0.4 },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${siteConfig.url}/categories/${category.slug}`,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const tagRoutes: MetadataRoute.Sitemap = tags.map((tag) => ({
    url: `${siteConfig.url}/tags/${tag.slug}`,
    changeFrequency: "weekly",
    priority: 0.4,
  }));

  const articleRoutes: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${siteConfig.url}${article.url}`,
    lastModified: new Date(article.updatedAt ?? article.date),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  // Touch getArticleSlugs so the build fails loudly if content is unreadable.
  void getArticleSlugs().length;

  return [...staticRoutes, ...articleRoutes, ...categoryRoutes, ...tagRoutes];
}
