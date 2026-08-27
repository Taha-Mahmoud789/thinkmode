import { ImageResponse } from "next/og";
import { getArticleBySlug, getArticleSlugs } from "@/lib/articles";
import { initials } from "@/lib/utils";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Per-article Open Graph card, rendered on-demand. */
export default async function ArticleOgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  const title = article?.title ?? "ThinkMode";
  const categoryObj = article?.category;
  const category = categoryObj?.shortName ?? "";
  const accent = categoryObj?.accent ?? "#17B890";
  const authorName = article?.author.name ?? "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "linear-gradient(135deg, #0b0b12 0%, #141426 55%, #050508 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 54,
              height: 54,
              borderRadius: 14,
              border: "3px solid #17B890",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 30,
              fontWeight: 700,
              color: "#23C8A8",
            }}
          >
            T
          </div>
          <div style={{ fontSize: 34, fontWeight: 700, color: "#f4f4f5", letterSpacing: -1 }}>
            ThinkMode
          </div>
          <div style={{ display: "flex", flexGrow: 1 }} />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "8px 22px",
              borderRadius: 999,
              border: `2px solid ${accent}`,
              color: accent,
              fontSize: 22,
              fontWeight: 600,
              letterSpacing: 2,
            }}
          >
            {category.toUpperCase()}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 58,
            fontWeight: 800,
            lineHeight: 1.12,
            letterSpacing: -2,
            color: "#f4f4f5",
            maxWidth: 1020,
          }}
        >
          {title}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: "rgba(23,184,144,0.18)",
              border: "2px solid rgba(23,184,144,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              fontWeight: 700,
              color: "#23C8A8",
            }}
          >
            {authorName ? initials(authorName) : ""}
          </div>
          <div style={{ fontSize: 24, color: "#a1a1aa" }}>{authorName}</div>
        </div>
      </div>
    ),
    size,
  );
}
