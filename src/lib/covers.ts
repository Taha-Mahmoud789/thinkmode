import { getCategory } from "@/data/categories";
import { seededIndex } from "@/lib/utils";

/**
 * Generative brand cover art.
 * Every article gets deterministic, on-brand SVG artwork served as a static
 * route (/covers/[slug]) — tiny payload, crisp at any DPI, zero CLS.
 */

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

interface CoverOptions {
  title: string;
  categorySlug: string;
  /** Deterministic variation seed — use the article slug. */
  seed: string;
}

const PALETTES = [
  ["#7c3cff", "#22d3ee"],
  ["#9d6cff", "#3b82f6"],
  ["#7c3cff", "#a78bfa"],
  ["#3b82f6", "#22d3ee"],
] as const;

export function renderCoverSvg({ title, categorySlug, seed }: CoverOptions): string {
  const category = getCategory(categorySlug);
  const accent = category.accent;
  const [g1, g2] = PALETTES[seededIndex(seed, PALETTES.length)];
  const variant = seededIndex(`${seed}:v`, 4);
  const shortLabel = escapeXml(category.shortName.toUpperCase());
  const safeTitle = escapeXml(title);

  // Deterministic decorative geometry.
  const cx1 = 560 + seededIndex(`x1${seed}`, 320);
  const cy1 = 120 + seededIndex(`y1${seed}`, 200);
  const r1 = 180 + seededIndex(`r1${seed}`, 140);
  const cx2 = 220 + seededIndex(`x2${seed}`, 260);
  const cy2 = 420 + seededIndex(`y2${seed}`, 160);
  const rot = seededIndex(`rot${seed}`, 60) - 30;

  const decorations =
    variant === 0
      ? `<circle cx="${cx1}" cy="${cy1}" r="${r1}" fill="url(#glowA)" opacity="0.55"/>
         <circle cx="${cx2}" cy="${cy2}" r="240" fill="url(#glowB)" opacity="0.35"/>`
      : variant === 1
        ? `<rect x="${cx1 - 160}" y="${cy1 - 160}" width="380" height="380" rx="48" transform="rotate(${rot} ${cx1} ${cy1})" fill="url(#glowA)" opacity="0.4"/>
           <circle cx="${cx2}" cy="${cy2}" r="230" fill="url(#glowB)" opacity="0.32"/>`
        : variant === 2
          ? `<path d="M0 ${520 + seededIndex(seed, 80)} Q 400 ${300 + seededIndex(`q${seed}`, 120)} 1200 ${480 + seededIndex(`q2${seed}`, 100)} L 1200 720 L 0 720 Z" fill="url(#glowB)" opacity="0.28"/>
             <circle cx="${cx1}" cy="${cy1}" r="${r1}" fill="url(#glowA)" opacity="0.42"/>`
          : `<circle cx="${cx1}" cy="${cy1}" r="${r1}" stroke="url(#strokeGrad)" stroke-width="1.5" fill="none" opacity="0.8"/>
             <circle cx="${cx1}" cy="${cy1}" r="${r1 - 60}" stroke="${accent}" stroke-width="1" fill="none" opacity="0.35"/>
             <circle cx="${cx2}" cy="${cy2}" r="210" fill="url(#glowA)" opacity="0.38"/>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="720" viewBox="0 0 1200 720" role="img" aria-label="${safeTitle}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0b0b12"/>
      <stop offset="0.55" stop-color="#101019"/>
      <stop offset="1" stop-color="#050508"/>
    </linearGradient>
    <linearGradient id="strokeGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${g1}"/>
      <stop offset="1" stop-color="${g2}"/>
    </linearGradient>
    <radialGradient id="glowA" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="${g1}" stop-opacity="0.85"/>
      <stop offset="1" stop-color="${g1}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glowB" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="${g2}" stop-opacity="0.7"/>
      <stop offset="1" stop-color="${g2}" stop-opacity="0"/>
    </radialGradient>
    <pattern id="grid" width="56" height="56" patternUnits="userSpaceOnUse">
      <path d="M 56 0 L 0 0 0 56" fill="none" stroke="#ffffff" stroke-opacity="0.05"/>
    </pattern>
  </defs>

  <rect width="1200" height="720" fill="url(#bg)"/>
  <rect width="1200" height="720" fill="url(#grid)"/>
  ${decorations}

  <!-- ThinkMode mark -->
  <g transform="translate(72,64)">
    <rect width="44" height="44" rx="12" fill="none" stroke="url(#strokeGrad)" stroke-width="2"/>
    <path d="M14 14h16M22 14v18" stroke="${g2}" stroke-width="3.5" stroke-linecap="round"/>
    <text x="58" y="29" font-family="Inter, system-ui, sans-serif" font-size="17" font-weight="700" letter-spacing="0.5" fill="#f4f4f5">ThinkMode</text>
  </g>

  <!-- category chip -->
  <g transform="translate(72,560)">
    <rect width="${24 + shortLabel.length * 8.4}" height="34" rx="17" fill="${accent}" fill-opacity="0.14" stroke="${accent}" stroke-opacity="0.45"/>
    <circle cx="18" cy="17" r="3.5" fill="${accent}"/>
    <text x="30" y="22" font-family="Inter, system-ui, sans-serif" font-size="13" font-weight="600" letter-spacing="1.5" fill="${accent}">${shortLabel}</text>
  </g>

  <rect x="0.5" y="0.5" width="1199" height="719" fill="none" stroke="#ffffff" stroke-opacity="0.08"/>
</svg>`;
}
