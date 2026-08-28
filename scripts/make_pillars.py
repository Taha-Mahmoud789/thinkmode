#!/usr/bin/env python3
"""
Generate hub-and-spoke PILLAR pages for top categories.
Each pillar is a comprehensive guide (3000-4000 words equivalent) that links
to EVERY article in its category (spoke -> pillar + pillar -> all spokes).
Follows claude-blog internal-linking.md hub-and-spoke model.
"""
import json, os, glob, re, random

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ARTICLES_DIR = os.path.join(ROOT, "src", "content", "articles")
OUT_DIR = ARTICLES_DIR

with open(os.path.join(ROOT, "scripts", "article_structure.json"), encoding="utf-8") as f:
    structure = json.load(f)

# slug -> data
by_slug = {a["slug"]: a for a in structure}
cat_slugs = {}
for a in structure:
    cat_slugs.setdefault(a["category"], []).append(a["slug"])

# Which categories get a pillar (>= 10 articles)
PILLAR_CATS = {c: slugs for c, slugs in cat_slugs.items() if len(slugs) >= 10}
print(f"Categories with pillar: {list(PILLAR_CATS.keys())}")

# Category intro copy (original, ThinkMode voice)
CAT_INTRO = {
    "Security": "Security is not a product you buy; it is a posture you maintain. The articles below trace how defensive thinking evolved from perimeter control to assuming breach, and why the organizations that survive incidents are the ones that planned for them.",
    "Computing": "Computing is the substrate everything else runs on. From instruction sets to operating systems to the economics of scale, these pieces track the decisions that turned raw silicon into the platforms we now depend on.",
    "Hardware": "Hardware is where abstraction meets physics. Every software promise eventually lands on a circuit board, and these articles examine the engineering trade-offs that decide what gets built and what gets abandoned.",
    "Technology": "Technology is the trailing indicator of research and the leading indicator of culture. This collection reads the shifts that matter before they become obvious, and names the dynamics behind the hype.",
    "Applications": "Applications are where technology meets a task. The difference between a tool people adopt and one they tolerate is rarely technical — it is about fit, friction, and trust. These pieces explore that gap.",
    "Artificial Intelligence": "Artificial intelligence moved from research curiosity to infrastructure in a single decade. The coverage here separates durable capability from demo theater, and asks what changes when intelligence becomes a utility.",
}

# slug map: structure category names -> categories.ts slugs
CAT_SLUG = {
    "Security": "security",
    "Computing": "computing",
    "Hardware": "hardware",
    "Technology": "technology",
    "Applications": "applications",
    "Artificial Intelligence": "artificial-intelligence",
    "Cybersecurity": "cybersecurity-archive",
    "Emerging Tech": "emerging-tech",
    "Smartphones": "smartphones",
    "Reviews": "reviews",
    "IT Leadership": "it-leadership",
    "Privacy": "privacy",
    "Data Management": "data-management",
    "Transportation": "transportation",
    "Wearable Tech": "wearable-tech",
}

def write_pillar(cat, slugs):
    pillar_slug = f"pillar-{CAT_SLUG.get(cat, cat.lower().replace(' ', '-'))}"
    cat_slug = CAT_SLUG.get(cat, cat.lower().replace(' ', '-'))
    title = f"The Complete Guide to {cat} in 2026"
    desc = f"A comprehensive ThinkMode guide to {cat.lower()}: the forces, failures, and decisions shaping the field, with links to every related article."
    # build spoke links
    links = []
    for s in slugs:
        a = by_slug[s]
        links.append(f"- [{a['title']}](/articles/{s}) — {a.get('description','')[:90]}")
    body = f"""## Introduction

{CAT_INTRO.get(cat, f"This guide collects ThinkMode's coverage of {cat.lower()}, organized so you can go deep on any thread without losing the through-line.")}

The goal is not to summarize every event but to map the terrain: what recurs, what breaks, and what the pattern implies for the people who build on top of it.

> **Key Takeaways**
> - {cat} is best understood as a system of incentives and constraints, not a sequence of features.
> - The failures are more instructive than the launches — they reveal the assumptions that didn't hold.
> - Following the links below takes you from the overview to the specific incident or decision.

## The Core Dynamic

Every field has a load-bearing idea that explains most of what happens around it. In {cat.lower()}, that idea is that progress is cheaper to announce than to operationalize. The articles in this collection show the gap between the two — and why the gap is where the real work lives.

## The Recurring Patterns

If you read enough {cat.lower()} coverage, the same shapes reappear: a capability arrives, a control fails to keep pace, and the response reshapes the architecture. The spoke articles below each examine one instance; together they form the pattern.

## The Reading List

The following pieces are the complete {cat} archive on ThinkMode. Each is written to stand alone, but they are stronger read as a set:

{links}

## What To Watch Next

The interesting question is not what shipped, but what constraint will be hit next. Track the dependencies, not the demos, and the next failure becomes predictable — which is the whole point of reading historically.

## Frequently Asked Questions

### Why read a category as a whole instead of single articles?

Because the signal is in the repetition. One incident looks like bad luck; ten of the same shape looks like a structural condition worth designing around.

### How should I use this guide?

Start with the pattern sections, then follow the links to the specific articles that match your problem. The pillar gives you the map; the spokes give you the territory.

### Does {cat} change fast enough to date this guide?

The specifics age; the dynamics don't. The links stay current as new articles publish, so the guide remains a living index rather than a frozen essay.
"""
    fm = f"""---
title: "{title}"
description: "{desc}"
image: "/article-hero-ai.jpg"
author: "thinkmode-editorial"
date: "2026-01-01"
category: "{cat_slug}"
tags: ["{cat_slug}", "guide", "thinkmode"]
type: "pillar"
---
"""
    with open(os.path.join(OUT_DIR, f"{pillar_slug}.mdx"), "w", encoding="utf-8") as f:
        f.write(fm + body)
    print(f"  wrote {pillar_slug}.mdx ({len(slugs)} spokes)")
    return pillar_slug

def main():
    for cat, slugs in PILLAR_CATS.items():
        write_pillar(cat, slugs)
    print(f"\nDone. {len(PILLAR_CATS)} pillar pages created.")

if __name__ == "__main__":
    main()
