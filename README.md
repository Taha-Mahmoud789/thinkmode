# ThinkMode

**Think. Code. Build the Future.**

A premium technology publication built with Next.js 16 (App Router), TypeScript strict, Tailwind CSS v4, and MDX. Dark-first design, fully static output, SEO-ready and ad-ready from day one.

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (111 static pages)
npm run lint       # eslint — currently 0 errors / 0 warnings
npm start          # serve the production build
```

## Adding an article

Drop an `.mdx` file into `src/content/articles/` — the slug is the filename:

```mdx
---
title: "Your Compelling Title"
description: "One or two sentences shown in cards, search, and meta tags."
date: "2026-09-01"          # ISO date
updatedAt: "2026-09-05"     # optional
author: "omar-hassan"       # slug from src/data/authors.ts
category: "programming"     # slug from src/data/categories.ts
tags: ["TypeScript", "Testing"]
featured: true              # optional → homepage featured grid
trending: 3                 # optional rank → Trending Now rail
editorsPick: false          # optional → full-width banner
---

## It just works

Headings auto-generate anchor ids and feed the table of contents.
Code blocks get Shiki highlighting with `// [!code highlight]` notation support.

<Callout variant="tip" title="Pro tip">Rich content components are available.</Callout>
<Caption>…under images</Caption>
<YouTubeEmbed id="dQw4w9WgXcQ" title="Privacy-friendly embeds" />
```

Cover art is **generated automatically** per article (`/covers/<slug>`) — deterministic branded SVG. To use your own image instead, set `image:` in frontmatter.

Reading time is computed automatically. Routes, sitemap, RSS, OG images, and JSON-LD all regenerate on build.

## Configuration

| What | Where |
| --- | --- |
| Site name/URL/nav/social | `src/config/site.ts` |
| Categories & accents | `src/data/categories.ts` |
| Authors | `src/data/authors.ts` |
| Design tokens (colors/fonts) | `src/app/globals.css` |

### Environment variables

```bash
NEXT_PUBLIC_SITE_URL=https://thinkmode.dev      # canonical URLs + sitemap/OG (required in prod)
NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-xxxxxxxx   # optional — activates ad slots when set
NEWSLETTER_PROVIDER=resend                       # optional — see src/lib/newsletter.ts
```

### Connecting the newsletter

The UI talks only to `subscribeToNewsletter()` in `src/lib/newsletter.ts`.
Implement the provider switch there (a Resend skeleton is included) — no component changes needed.

### AdSense

Ad slots (`AdBanner`, `AdRectangle`, `AdInArticle`) render **nothing** until
`NEXT_PUBLIC_ADSENSE_CLIENT_ID` is set. Place `<AdInArticle slotId="..." />`
anywhere; keep editorial content visually separated.

## Deploying to Vercel

1. Push this folder to a GitHub repo.
2. Import into Vercel — zero config needed (Next.js auto-detected).
3. Set `NEXT_PUBLIC_SITE_URL` to your domain in Project → Settings → Environment Variables.
4. Add your custom domain under Project → Domains.

## Architecture

```
src/
  app/            # App Router pages, API-ish routes (rss/sitemap/covers), actions/
  components/     # ui/ · layout/ · sections/ · articles/ · blocks/ · content/ · ads/
  content/        # MDX articles (the only place content lives)
  config/         # site + fonts
  data/           # categories, authors (referenced by frontmatter slugs)
  lib/            # articles pipeline, mdx renderer, search, covers, seo, toc, utils
  types/          # shared domain types (strict)
```

Principles: Server Components by default (client JS only where interaction demands),
no hard-coded article data in UI, tokens over raw colors, WCAG-friendly semantics,
`prefers-reduced-motion` respected everywhere.
