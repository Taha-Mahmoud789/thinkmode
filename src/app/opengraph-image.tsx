import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Default Open Graph card for the site. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: "linear-gradient(135deg, #0b0b12 0%, #141426 55%, #050508 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              border: "3px solid #7c3cff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 36,
              fontWeight: 700,
              color: "#9d6cff",
            }}
          >
            T
          </div>
          <div style={{ fontSize: 40, fontWeight: 700, color: "#f4f4f5", letterSpacing: -1 }}>
            ThinkMode
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 64,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: -3,
              color: "#f4f4f5",
            }}
          >
            Think. Code.
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 64,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: -3,
              color: "#9d6cff",
            }}
          >
            Build the Future.
          </div>
        </div>

        <div style={{ display: "flex", fontSize: 28, color: "#a1a1aa" }}>
          High-quality articles on Programming, AI, and Technology
        </div>
      </div>
    ),
    size,
  );
}
