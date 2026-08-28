import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getAdjacentArticles,
  getArticleBySlug,
  getRelatedArticles,
  metaOf,
} from "@/lib/articles";
import { ArticleView } from "@/components/articles/article-view";
import { CommentsSection } from "@/components/comments/comments-section";
import {
  ArticleNewsletterCta,
  PrevNextNavigation,
  RelatedArticles,
} from "@/components/articles/article-extras";
import { JsonLd, articleSchema, breadcrumbSchema, websiteSchema } from "@/lib/seo";
import { absoluteUrl } from "@/lib/utils";
import { siteConfig } from "@/config/site";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = true;

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};

  const articleUrl = absoluteUrl(`/articles/${article.slug}`);
  const ogImage = absoluteUrl(article.cover);

  return {
    title: article.title,
    description: article.description,
    alternates: {
      canonical: `/articles/${article.slug}`,
    },
    openGraph: {
      type: "article",
      url: articleUrl,
      title: article.title,
      description: article.description,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      publishedTime: article.date,
      modifiedTime: article.updatedAt ?? article.date,
      authors: [article.author.name],
      tags: article.tags.map((tag) => tag.name),
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: article.title,
          type: "image/jpeg",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description,
      images: [ogImage],
      creator: "@thinkmode",
      site: "@thinkmode",
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const related = getRelatedArticles(article, 3).map(metaOf);
  const adjacent = getAdjacentArticles(article);

  return (
    <>
      <JsonLd data={websiteSchema()} />
      <JsonLd data={articleSchema(metaOf(article))} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Articles", path: "/articles" },
          { name: article.category.name, path: `/categories/${article.category.slug}` },
          { name: article.title, path: `/articles/${article.slug}` },
        ])}
      />

      <ArticleView article={article} />
      <CommentsSection articleSlug={slug} />
      <PrevNextNavigation adjacent={adjacent} />
      <RelatedArticles articles={related} />
      <ArticleNewsletterCta />
    </>
  );
}
