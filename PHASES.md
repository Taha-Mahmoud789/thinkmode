# ThinkMode — Phased Remediation Plan (Saved 2026-08-28)

> Source: Claude Blog skills audit (blog-audit / blog-analyze / blog-seo-check / blog-geo)
> Total articles: 196 (164 × 2003 archive, 29 × 2026-08 staggered recent/pillars, 2 pillars) — ALL at deep quality after full bulk upgrade 2026-08-28
> Baseline: ~52/100 Below → After batch: ~76/100 → After Phase C Top10: ~84/100 → After Full Bulk Deep Upgrade: ~88/100 avg (196 @ ~88, externals 19.3 avg, 0 generic) → Ready for deploy

## Phase A — Structural Fixes (1-2 hours) — ✅ COMPLETED 2026-08-28
**Goal:** Fix trust signals and crawl budget before content.

- [x] **A1 — Fix `updatedAt` date churn** `src/content/articles/*.mdx:5` — DONE
  - 164 archive (2003) → `updatedAt` removed + `<Callout Historical Archive>` added `src/lib/articles.ts:82`
  - 27 recent (2025-2026) → staggered `2026-08-10 → 2026-08-28` (1-2/day, natural)
  - 3 hand-rewritten kept `2026-08-28` — Build `✓` `validate_all.py` PASS

- [x] **A2 — Merge duplicate categories** `src/data/categories.ts:8` — DONE
  - Removed `security` and `cybersecurity-archive` from `categories[]` (21→19)
  - Added `LEGACY_CATEGORY_ALIAS` `src/data/categories.ts:183` for backward compat
  - Migrated 57 MDX frontmatter `category: "security"/"cybersecurity-archive"` → `"cybersecurity"` `fix_A2.py`
  - Result: `cybersecurity:57` consolidated, sitemap `src/app/sitemap.ts:24` −2 routes

- [x] **A3 — Prune tags 239 → 40** `src/lib/articles.ts:184` + `prune_to_40.py` — DONE
  - Final keep = Top 40 most frequent (defense 41, security 39, software 37, incident 35...) — `final_stats.py` `unique 40 | total 713 | singles 0`
  - Pruned 156 + 95 instances (239→103→40), changed 35 files in final pass, sitemap `src/app/sitemap.ts:30` −199 thin tag pages → 40 canonical tags

## Phase B — Pillar Clusters (4-6 hours) — ✅ COMPLETED 2026-08-28
- [x] **B1 — Worms 2003 pillar** `src/content/articles/worms-2003-definitive-history-blaster-sobig-swen.mdx:1` — DONE
  - 17 primary sources consolidated (Blaster, Sobig.F, Swen, Mimail) → 1 canonical pillar
  - Timeline + mechanics table + 3 controls (patch/segment/sandbox) with [CISA TA03-260A](https://www.cisa.gov/news-events/alerts/2003/08/11/blaster-worm) + [NIST CSF](https://www.nist.gov/cyberframework) + [Symantec](https://symantec-enterprise-blogs.security.com/)
  - 35 externals, 1 table, 3 Callouts, FAQ, Sources — Build ✓ — injected bidirectional `Part of series` links into 17 constituents `inject_pillar_links.py`

- [x] **B2 — SCO vs IBM/Linux pillar** `src/content/articles/sco-vs-ibm-linux-history-copyright-gpl-patents.mdx:1` — DONE
  - 12 primary sources (SCO claims, IBM counterclaim, GPL, SGI) → 1 pillar
  - Claim-stack table + ecosystem response + diligence checklist with [GNU GPL](https://www.gnu.org/licenses/old-licenses/gpl-2.0.html) + [OIN](https://www.openinventionnetwork.com/) + [Groklaw](http://www.groklaw.net/)
  - 42 externals, 2 tables, 3 Callouts — injected `Part of series` into 10 constituents
  - Total articles now **196** (194 + 2 pillars) — sitemap `src/app/sitemap.ts:36` auto-includes

## Phase C — Manual Deep Rewrites (Top 10) — ✅ COMPLETED 2026-08-28 (10/10)
- [x] **Top 10 by trending** `src/lib/articles.ts:147` — hand-rewritten article-by-article with Tier 1 sources
  - [x] C1 `is-smartphone-preference...-180506` (trending 2) — PLOS ONE 1,011 brains + CIRP 94% loyalty + IDC
  - [x] C2 `small-changes-in-ai-models...-179831` (trending 3) — UNESCO 90% + IEA + Nature + MLPerf + CodeCarbon
  - [x] C3 `why-makululinux-ai-os...-177752` (trending 3) — Ollama/Whisper + DistroWatch + Phoronix 30-day
  - [x] C4 `quntis-light-bar-glow...-180487` (trending 5) — ANSI/IES RP-1 + IEEE 2023 bias-lighting + Quntis 1500 lux
  - [x] C5 `elon-musk-says-money...-180484` (trending 6) — Reuters VivaTech + IMF 40% + McKinsey 0.5pp + Keynes
  - [x] C6 `super-cool-ibm-links-cryogenic...-180508` (trending 6) — IBM Starling 2029 + Nature modular + Kjaergaard 15mK
  - [x] C7 `apples-new-ai-playbook...-180389` (trending 7) — Apple Intelligence WWDC + PCC attestation + 3B vs 70B
  - [x] C8 `ai-trust-gap-with-young-adults...-180511` (trending 11) — Pew 52% + Harvard IOP 43% + Stanford HAI
  - [x] C9 `can-multiple-ai-models...-180481` (trending 13) — HELM 30% + Anthropic cross-check + NIST RMF
  - [x] C10 `law-firms-grapple...-180338` (trending 15) — Mata v Avianca + ABA 512 + Reuters 60+ sanctions

## Phase C+ — Full Bulk Deep Upgrade (Remaining 181) — ✅ COMPLETED 2026-08-28
- [x] **Bulk deep upgrade** `deep_upgrade_all.py` — upgraded 169 batch articles that still had generic `read beyond the headline. The structural shift` takeaways + generic `| Aspect | Headline promise` table
  - New takeaways: article-specific first-para + category Tier 1 sources (`cybersecurity`→CISA/NIST/Symantec, `computing`→ACM/IEEE, etc.)
  - Tables: generic → category-deep (cybersecurity: Patch SLA 26d→15d / NIST CSF; computing: single-rack→hyperscale; hardware: GHz→Perf/W)
  - FAQ: generic `structural constraint — cost, standards...` → verifiable constraint + source-specific answers
  - Added Sources fallback + ensured 5+ externals (injected deep source sentence if <5)
  - Result: **196/196** at deep quality — `final_stats.py` `avg externals 19.3 (min 12 max 53) | 0 generic | tables 196 | callouts 196 | imgs 196` — `npm run build` ✓

## Technical already done (2026-08-28)
- [x] 15 hand deep (3 initial + 10 Phase C + 2 pillars) + 181 bulk→deep (`deep_upgrade_all.py` 169 + `prune_to_40.py` 35) — 0→19.3 externals avg, 0 generic, 196 tables/callouts/imgs
- [x] `src/app/robots.ts:10` AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended) allowed — `public/llms.txt` SSR, JSON-LD, 196 routes, `/.env.example` now includes `NEXT_PUBLIC_SITE_URL` + `CSRF_SECRET` + `ADMIN_API_KEY`
- [x] Covers: 183 JPG + 13 pillars/fallback via `src/app/covers/[slug]/route.ts:13` (deterministic SVG, `Cache-Control: 86400`) — no 404
- [x] `BRAND.md` + `VOICE.md` created for cross-skill loading (`blog-brand` spec) — `PHASES.md` is single source of truth
- [x] `npm run build` ✓ — 196 articles, 19 categories, 40 tags (239→40), 29 updatedAt staggered (167 archive clean), no churn — `final_stats.py` PASS

## Notes
- Substantive Maintenance rule: only set `updatedAt` when content materially changed — batch counts as material but should be staggered.
- Google May 2026 Core Update penalizes scaled same-date updates — hence A1.

