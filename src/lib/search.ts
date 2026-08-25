import { getAllArticles, metaOf } from "@/lib/articles";
import type { ArticleMeta, SearchResult } from "@/types";

function tokenize(query: string): string[] {
  return query
    .toLowerCase()
    .split(/[^\p{L}\p{N}+#.]+/u)
    .map((token) => token.trim())
    .filter((token) => token.length > 0);
}

/**
 * Lightweight client-safe scoring over title, description, category, tags and
 * body text. Runs against prebuilt metadata — no index service required.
 */
export function searchArticles(query: string, limit = 24): SearchResult[] {
  const tokens = tokenize(query);
  if (tokens.length === 0) return [];

  const results: SearchResult[] = [];

  for (const article of getAllArticles()) {
    const titleLower = article.title.toLowerCase();
    const descLower = article.description.toLowerCase();
    const categoryLower = article.category.name.toLowerCase();
    const tagsLower = article.tags.map((tag) => ({
      lower: tag.name.toLowerCase(),
      slug: tag.slug,
    }));
    const bodyLower = article.content.toLowerCase();

    let score = 0;
    const matchedOn = new Set<string>();
    let allTokensInTitle = true;

    for (const token of tokens) {
      let tokenScore = 0;
      if (titleLower.includes(token)) {
        tokenScore += 10;
        matchedOn.add("title");
      } else {
        allTokensInTitle = false;
      }
      if (descLower.includes(token)) {
        tokenScore += 3;
        matchedOn.add("description");
      }
      if (categoryLower.includes(token)) {
        tokenScore += 4;
        matchedOn.add("category");
      }
      for (const tag of tagsLower) {
        if (tag.lower.includes(token) || tag.slug.includes(token)) {
          tokenScore += 4;
          matchedOn.add("tag");
          break;
        }
      }
      if (bodyLower.includes(token)) {
        tokenScore += 1;
        matchedOn.add("content");
      }
      if (tokenScore === 0) {
        // Every token must hit somewhere — AND semantics.
        score = 0;
        break;
      }
      score += tokenScore;
    }

    if (score > 0) {
      if (allTokensInTitle) score += 8;
      results.push({ article: metaOf(article), score, matchedOn: [...matchedOn] });
    }
  }

  results.sort((a, b) => b.score - a.score);
  return results.slice(0, limit);
}

export function getSearchSuggestions(limit = 6): ArticleMeta[] {
  return getAllArticles()
    .slice(0, limit)
    .map(metaOf);
}
