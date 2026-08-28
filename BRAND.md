# ThinkMode — BRAND.md

> Auto-generated 2026-08-28 for cross-skill consumption (blog-brand). Loaded by blog-write / rewrite / brief / outline / calendar / strategy / analyze / audit / geo / cluster / multilingual.

## Positioning
**ThinkMode** — *Think. Code. Build the Future.* A digital publication for developers, builders, and curious minds exploring programming, AI, technology, and the future of software. Not a news aggregator — a practitioner-written, engineer-reviewed publication that optimizes for depth over volume.

## Audience
- **Primary:** Practicing engineers (full-stack, ML, infra) and technical builders who make buy/build decisions on what they read.
- **Secondary:** Tech-curious managers, CTOs, and product leaders who need honest uncertainty, not confident nonsense.
- **Not for:** Click-driven listicles, hype-chasers, or readers who want hot takes without mechanisms.

## Topics — Do
Programming, AI & ML, Web Development, DevOps & Cloud, Cybersecurity, Tools & Resources, Hardware/Computing context, Emerging Tech (quantum, wearables), Reviews (hands-on, 30-day daily-driver).

## Topics — Don't
Crypto speculation, celebrity gossip, unverified rumors, political commentary, tier 4-5 content-mill aggregation, affiliate-driven buying guides.

## Voice Constraints (Hard)
- **Do:** Evidence-led, mechanism-first, answer-first, sourced Tier 1-3 only (no content mills), self-contained sections, tables where they help, Callouts for audit templates.
- **Don't:** Fabricate statistics (zero tolerance), keyword-stuff headings, use generic `Centralized platforms concentrate both capability and risk` takeaways, change `dateModified` without material update, use em dashes U+2014 excessively.

## Taboo Phrases (Project Style List)
Avoid unless quoting: "It's important to note", "In today's digital landscape", "Delve into", "Navigating the complexities", "Let's explore", "Furthermore" (use sparingly), "In conclusion", "It is worth mentioning", "Embark on", "Cutting-edge" (prove it), "Leverage" (use "use"), "Game-changer", "Revolutionize", "Streamline" (show how), "Harness the power", "Dive deep", "Unlock the potential".

## Competitor Differentiation
- **vs. news wires:** We add the mechanism and the constraint, not just the headline. Every claim traceable to source with publisher, date, method.
- **vs. vendor blogs:** No single-vendor lock. We route, cross-check, and audit per NIST RMF and HELM — vendor-agnostic.
- **vs. listicles:** No scaled interchangeable pages. Each pillar is canonical hub-and-spoke (e.g., Worms 2003, SCO vs IBM) with bidirectional links.

## E-E-A-T Signals
- Authors are named with bio/role per `src/data/authors.ts` + Person schema `src/lib/seo.tsx:64`
- Contact: `hello@thinkmode.dev` + About `/about` + Editorial policy (this file) + Legal `/legal/[doc]`
- Trust pages: Privacy, Terms, Cookie — `src/app/legal/[doc]/page.tsx`

## Monetization
Ads render nothing until `NEXT_PUBLIC_ADSENSE_CLIENT_ID` set — `src/config/site.ts:73` + `src/components/ads/ad-slot.tsx`. No behavioral profiling per `BRAND.md` trust.

## Canonical References
- Site URL: `https://thinkmode.dev` (`NEXT_PUBLIC_SITE_URL`)
- Sitemap: `/sitemap.xml` (`src/app/sitemap.ts`) — 196 articles + 19 categories + 40 tags (pruned 2026-08-28)
- llms.txt: `/llms.txt` (`public/llms.txt`) for GPTBot/ClaudeBot/PerplexityBot
- RSS: `/rss.xml` (`src/app/rss.xml/route.ts`)

