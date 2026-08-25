import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getAdjacentArticles,
  getArticleBySlug,
  getArticleSlugs,
  getRelatedArticles,
  metaOf,
} from "@/lib/articles";
import { ArticleView } from "@/components/articles/article-view";
import {
  ArticleNewsletterCta,
  PrevNextNavigation,
  RelatedArticles,
} from "@/components/articles/article-extras";
import { JsonLd, articleSchema, breadcrumbSchema, websiteSchema } from "@/lib/seo";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getArticleSlugs().map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};

  return {
    title: article.title,
    description: article.description,
    alternates: { canonical: `/articles/${article.slug}` },
    openGraph: {
      type: "article",
      url: `/articles/${article.slug}`,
      title: article.title,
      description: article.description,
      publishedTime: article.date,
      modifiedTime: article.updatedAt ?? article.date,
      authors: [article.author.name],
      tags: article.tags.map((tag) => tag.name),
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description,
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
      <PrevNextNavigation adjacent={adjacent} />
      <RelatedArticles articles={related} />
      <ArticleNewsletterCta />
    </>
  );
}
