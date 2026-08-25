import { slugify } from "@/lib/utils";
import type { TocItem } from "@/types";

/**
 * Extract a table of contents from raw MDX by scanning ATX headings,
 * skipping fenced code blocks and matching the slugify() ids used at render.
 */
export function extractTocFromMdx(mdxSource: string, maxDepth: 2 | 3 = 3): TocItem[] {
  const items: TocItem[] = [];
  const lines = mdxSource.split("\n");
  let inFence = false;

  for (const line of lines) {
    if (line.trimStart().startsWith("```")) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const match = /^(#{2,3})\s+(.+)$/.exec(line);
    if (!match) continue;

    const level = match[1].length as 2 | 3;
    if (level > maxDepth) continue;

    // Strip inline markdown (links, emphasis, code) for display text.
    const text = match[2]
      .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
      .replace(/[*_`]/g, "")
      .trim();

    items.push({ id: slugify(text), text, level });
  }

  return items;
}
