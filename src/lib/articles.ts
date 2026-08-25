import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { getAuthor } from "@/data/authors";
import { getCategory } from "@/data/categories";
import { absoluteUrl, tagSlug } from "@/lib/utils";
import type {
  AdjacentArticles,
  Article,
  ArticleMeta,
  CategoryWithCount,
  TagWithCount,
} from "@/types";

const CONTENT_DIR = path.join(process.cwd(), "src", "content", "articles");

interface ParsedArticle {
  slug: string;
  frontmatter: Record<string, unknown>;
  content: string;
}

function parseRaw(): ParsedArticle[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  const files = fs
    .readdirSync(CONTENT_DIR)
    .filter((file) => /\.mdx?$/i.test(file));

  return files.map((file) => {
    const raw = fs.readFileSync(path.join(CONTENT_DIR, file), "utf8");
    const slug = file.replace(/\.mdx?$/i, "");
    const { data, content } = matter(raw);
    return { slug, frontmatter: data, content };
  });
}

function requireString(value: unknown, field: string, slug: string): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(
      `[content] "${slug}.mdx": frontmatter field "${field}" must be a non-empty string.`,
    );
  }
  return value;
}

function validateDate(value: unknown, field: string, slug: string): string {
  const raw = requireString(value, field, slug);
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`[content] "${slug}.mdx": "${field}" is not a valid date ("${raw}").`);
  }
  return date.toISOString();
}

function toArticle(parsed: ParsedArticle): Article {
  const { slug, frontmatter: fm, content } = parsed;

  const title = requireString(fm.title, "title", slug);
  const description = requireString(fm.description, "description", slug);
  const date = validateDate(fm.date, "date", slug);
  const updatedAt = fm.updatedAt ? validateDate(fm.updatedAt, "updatedAt", slug) : undefined;
  const authorSlug = requireString(fm.author, "author", slug);
  const categorySlug = requireString(fm.category, "category", slug);

  const tagsInput = Array.isArray(fm.tags) ? fm.tags : [];
  const tags = tagsInput.map((tag) =>
    typeof tag === "string" && tag.trim() !== ""
      ? { name: tag.trim(), slug: tagSlug(tag) }
      : null,
  );
  if (tags.some((t) => t === null)) {
    throw new Error(`[content] "${slug}.mdx": "tags" must be an array of non-empty strings.`);
  }

  const stats = readingTime(content);
  const featured = fm.featured === true;
  const editorsPick = fm.editorsPick === true;
  const trending =
    typeof fm.trending === "number" && Number.isFinite(fm.trending)
      ? fm.trending
      : undefined;

  const image = typeof fm.image === "string" && fm.image !== "" ? fm.image : undefined;

  return {
    slug,
    title,
    description,
    date,
    updatedAt,
    author: getAuthor(authorSlug),
    category: getCategory(categorySlug),
    tags: tags as NonNullable<(typeof tags)[number]>[],
    image,
    cover: `/covers/${slug}`,
    readingMinutes: Math.max(1, Math.round(stats.minutes)),
    featured,
    editorsPick,
    trending,
    url: `/articles/${slug}`,
    content,
  };
}

/** All articles, newest first. Cached per render pass. */
export function getAllArticles(): Article[] {
  return parseRaw()
    .map(toArticle)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getArticleSlugs(): string[] {
  return parseRaw().map((p) => p.slug);
}

export function getArticleBySlug(slug: string): Article | null {
  const found = parseRaw().find((p) => p.slug === slug);
  return found ? toArticle(found) : null;
}

export function getFeaturedArticles(limit = 6): Article[] {
  const featured = getAllArticles().filter((a) => a.featured);
  return (featured.length > 0 ? featured : getAllArticles()).slice(0, limit);
}

export function getTrendingArticles(limit = 5): Article[] {
  const ranked = getAllArticles()
    .filter((a) => typeof a.trending === "number")
    .sort((a, b) => (a.trending ?? 99) - (b.trending ?? 99));
  return (ranked.length > 0 ? ranked : getAllArticles()).slice(0, limit);
}

export function getEditorsPick(): Article | null {
  const pick = getAllArticles().find((a) => a.editorsPick);
  return pick ?? null;
}

export function getArticlesByCategory(categorySlug: string): Article[] {
  return getAllArticles().filter((a) => a.category.slug === categorySlug);
}

export function getArticlesByTag(tagSlugValue: string): Article[] {
  return getAllArticles().filter((a) =>
    a.tags.some((t) => t.slug === tagSlugValue),
  );
}

export function getCategoriesWithCounts(): CategoryWithCount[] {
  const all = getAllArticles();
  const slugs = new Map<string, number>();
  for (const article of all) {
    slugs.set(article.category.slug, (slugs.get(article.category.slug) ?? 0) + 1);
  }
  const result: CategoryWithCount[] = [];
  for (const [slug, count] of slugs) {
    const category = getCategory(slug);
    result.push({ ...category, count });
  }
  result.sort((a, b) => b.count - a.count);
  return result;
}

export function getTagsWithCounts(limit?: number): TagWithCount[] {
  const counts = new Map<string, TagWithCount>();
  for (const article of getAllArticles()) {
    for (const tag of article.tags) {
      const existing = counts.get(tag.slug);
      if (existing) existing.count += 1;
      else counts.set(tag.slug, { ...tag, count: 1 });
    }
  }
  const sorted = [...counts.values()].sort((a, b) => b.count - a.count);
  return limit ? sorted.slice(0, limit) : sorted;
}

/** Related = same category scored highest, then shared-tag overlap, then recency. */
export function getRelatedArticles(article: Article, limit = 3): Article[] {
  return getAllArticles()
    .filter((a) => a.slug !== article.slug)
    .map((candidate) => {
      let score = candidate.category.slug === article.category.slug ? 10 : 0;
      for (const tag of candidate.tags) {
        if (article.tags.some((t) => t.slug === tag.slug)) score += 2;
      }
      return { candidate, score };
    })
    .sort(
      (a, b) =>
        b.score - a.score || b.candidate.date.localeCompare(a.candidate.date),
    )
    .slice(0, limit)
    .map(({ candidate }) => candidate);
}

/** Chronological neighbours for prev/next navigation. */
export function getAdjacentArticles(article: Article): AdjacentArticles {
  const all = getAllArticles(); // newest -> oldest
  const index = all.findIndex((a) => a.slug === article.slug);
  return {
    newer: index > 0 ? metaOf(all[index - 1]) : null,
    older:
      index >= 0 && index < all.length - 1 ? metaOf(all[index + 1]) : null,
  };
}

/** Strip heavy MDX body — pass lightweight metadata into client components. */
export function metaOf(article: Article): ArticleMeta {
  const copy = { ...article };
  delete (copy as Partial<Article>).content;
  return copy;
}

export function getAllArticleMetas(): ArticleMeta[] {
  return getAllArticles().map(metaOf);
}

export function getCanonicalArticleUrl(slug: string): string {
  return absoluteUrl(`/articles/${slug}`);
}
