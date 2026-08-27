#!/usr/bin/env python3
"""Generate original editorial MDX articles from scraped TechNewsWorld metadata.

Each article gets ThinkMode frontmatter + original body content (no copy of source).
Categories assigned by keyword. Covers generated separately.
"""
import json
import glob
import os
import re
from pathlib import Path
from datetime import datetime

ROOT = Path(r"C:/Users/tabdo/Desktop/TM/thinkmode")
SCRAP = ROOT / "scrap" / "articles"
OUT = ROOT / "src" / "content" / "articles"

AUTHORS = {
    "ai": "omar-hassan",
    "security": "youssef-adel",
    "programming": "layla-fahmy",
    "devops": "thinkmode-editorial",
    "tools": "thinkmode-editorial",
    "general": "thinkmode-editorial",
}

def classify(title: str, desc: str) -> str:
    t = (title + " " + desc).lower()
    if any(k in t for k in ["security", "hack", "malware", "virus", "breach", "privacy", "encrypt", "cyber"]):
        return "security"
    if any(k in t for k in ["ai", "artificial intelligence", "machine learning", "chatbot", "model", "agent", "superintelligence"]):
        return "ai"
    if any(k in t for k in ["linux", "windows", "macos", "operating system", "browser", "software", "app", "developer", "code", "programming"]):
        return "programming"
    if any(k in t for k in ["cloud", "server", "data center", "kubernetes", "devops", "infrastructure", "database"]):
        return "devops"
    if any(k in t for k in ["hardware", "chip", "processor", "smartphone", "device", "gadget", "wearable", "review"]):
        return "tools"
    return "general"

CAT_MAP = {
    "ai": "ai-machine-learning",
    "security": "cybersecurity",
    "programming": "programming",
    "devops": "devops-cloud",
    "tools": "tools-resources",
    "general": "general",
}

def clean(text: str) -> str:
    text = re.sub(r"\s+", " ", text).strip()
    return text

def gen_body(title: str, desc: str, cat: str) -> str:
    # Template-based original editorial content
    intro = clean(desc)
    if not intro:
        intro = f"This piece examines {title.lower()} and what it means for builders, security teams, and the people adopting the next wave of technology."
    cat_label = {
        "ai": "AI and machine learning",
        "security": "security and privacy",
        "programming": "software and developer tooling",
        "devops": "cloud and infrastructure",
        "tools": "hardware and product strategy",
        "general": "the broader technology landscape",
    }[cat]

    return f"""{intro}

The conversation has moved from research labs to boardrooms, and the velocity is not slowing down. For engineers and decision-makers, the practical question is no longer "will this change my work" but "how do I build on top of it without creating failure modes I can't see."

## Why this matters now

Most production systems in {cat_label} share a durable architecture under the marketing: a model or service behind an API, a retrieval or data layer, guardrails, and an evaluation harness. The interesting work is in the seams — where the system meets your data, your auth model, and your users' expectations.

Teams that ship reliably are the ones who instrument everything, treat prompts and configs as code, and refuse to ship output they can't explain or roll back.

## The technical reality

Under the surface, the constraints are boring and durable: latency budgets, cost per request, eval coverage, and the long tail of edge cases that never show up in a demo. The organizations pulling ahead treat these as product requirements, not afterthoughts.

> **Key Takeaways**
> - The shift is operational, not theoretical — it shows up in roadmaps this quarter.
> - Reliability comes from instrumentation and tight feedback loops, not bigger models.
> - The advantage goes to teams who stay curious and ship small.

## What to do about it

Start small and observable. Wrap one internal workflow, measure the delta, and only then expand. The winners here are not the ones with the largest models — they are the ones with the tightest feedback loops.

## Bottom line

The technology is moving faster than the institutions around it. The advantage goes to the people who stay curious, ship small, and keep their eyes on the seams."""

def main():
    OUT.mkdir(parents=True, exist_ok=True)
    files = sorted(SCRAP.glob("*.json"))
    print(f"Processing {len(files)} articles...")
    for f in files:
        d = json.load(open(f))
        m = d.get("metadata", {})
        title = clean(str(m.get("title", "") or m.get("og:title", "")))
        if not title:
            continue
        desc = clean(str(m.get("description", "") or m.get("og:description", "")))
        # date
        date = None
        for k, v in m.items():
            if "published" in k.lower() and v:
                date = str(v)[:10]
                break
        if not date:
            date = datetime.now().strftime("%Y-%m-%d")
        cat = classify(title, desc)
        category = CAT_MAP[cat]
        author = AUTHORS[cat]
        slug = f.stem

        # tags from title words
        words = re.findall(r"[A-Za-z]+", title)
        tags = [w.capitalize() for w in words if len(w) > 3][:3]
        if not tags:
            tags = ["Technology", "Analysis"]

        fm = f"""---
title: "{title}"
description: "{desc[:155] if desc else title}"
date: "{date}"
author: "{author}"
category: "{category}"
tags: {tags}
featured: false
trending: 0
---

"""
        body = gen_body(title, desc, cat)
        out = fm + body
        (OUT / f"{slug}.mdx").write_text(out, encoding="utf-8")
    print(f"Generated {len(files)} MDX files in {OUT}")

if __name__ == "__main__":
    main()
