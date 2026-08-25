import { siteConfig } from "@/config/site";
import type { ArticleMeta } from "@/types";
import { absoluteUrl } from "@/lib/utils";

/** JSON-LD script component — renders a raw-ld+json script tag. */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    publisher: { "@type": "Organization", name: siteConfig.name },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.url}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.shortDescription,
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl("/logo.svg"),
    },
    sameAs: siteConfig.social
      .filter((s) => s.href.startsWith("http"))
      .map((s) => s.href),
  };
}

export function articleSchema(article: ArticleMeta) {
  const url = absoluteUrl(article.url);
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}#article`,
    headline: article.title,
    description: article.description,
    image: absoluteUrl(article.cover),
    datePublished: article.date,
    dateModified: article.updatedAt ?? article.date,
    inLanguage: "en",
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    author: {
      "@type": "Person",
      name: article.author.name,
      jobTitle: article.author.role,
      description: article.author.bio,
    },
    publisher: organizationSchema(),
    articleSection: article.category.name,
    keywords: article.tags.map((t) => t.name).join(", "),
    wordCount: undefined,
    timeRequired: `PT${article.readingMinutes}M`,
    isAccessibleForFree: true,
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
