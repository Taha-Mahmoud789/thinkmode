import { renderCoverSvg } from "@/lib/covers";
import { getArticleBySlug } from "@/lib/articles";

interface CoverRouteContext {
  params: Promise<{ slug: string }>;
}

/**
 * Generative cover art per article: /covers/<slug>
 * Deterministic SVG — cached aggressively at the CDN edge.
 * Rendered on-demand (no static params) to avoid build-time failures.
 */
export async function GET(
  _request: Request,
  ctx: CoverRouteContext,
): Promise<Response> {
  const { slug } = await ctx.params;
  const article = getArticleBySlug(slug);
  if (!article) return new Response("Not found", { status: 404 });

  const svg = renderCoverSvg({
    title: article.title,
    categorySlug: article.category?.slug ?? "general",
    seed: slug,
  });

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      ETag: `"cover-${slug}"`,
    },
  });
}
