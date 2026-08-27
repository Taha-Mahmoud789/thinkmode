#!/usr/bin/env python3
"""Convert scraped TechNewsWorld articles (real markdown + local images) to ThinkMode MDX.

- Takes `markdown` from scrap/articles/<slug>.json (real content)
- Strips site boilerplate (nav, newsletter, footer, logo)
- Uses local cover image from scrap/dataset/images/<slug>.jpg
- Writes MDX to src/content/articles/<slug>.mdx
- Copies image to public/articles/<slug>.jpg
"""
import json
import glob
import re
import shutil
from pathlib import Path
from datetime import datetime

ROOT = Path(r"C:/Users/tabdo/Desktop/TM/thinkmode")
SCRAP_ART = ROOT / "scrap" / "articles"
SCRAP_IMG = ROOT / "scrap" / "dataset" / "images"
OUT_MDX = ROOT / "src" / "content" / "articles"
OUT_IMG = ROOT / "public" / "articles"

AUTHORS = {
    "ai": "omar-hassan",
    "security": "youssef-adel",
    "programming": "layla-fahmy",
    "devops": "thinkmode-editorial",
    "tools": "thinkmode-editorial",
    "general": "thinkmode-editorial",
}
CAT_MAP = {
    "ai": "ai-machine-learning",
    "security": "cybersecurity",
    "programming": "programming",
    "devops": "devops-cloud",
    "tools": "tools-resources",
    "general": "general",
}

def classify(title, desc):
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

def clean_markdown(md: str) -> str:
    # TechNewsWorld markdown: nav tree (bullets of section links) comes first,
    # then the real article body. Find the first paragraph that is real prose
    # (not a link list, not nav) and cut there.
    lines = md.split("\n")
    out = []
    started = False
    for line in lines:
        # Skip nav/boilerplate lines entirely
        if re.search(r"Get the .* Newsletter|Welcome Guest|Sign In|E-COMMERCE TIMES|CRM BUYER|LINUXINSIDER|ECTNEWS|ADVERTISING|TechNewsWorld Logo|section/|Section/|sharing button|sharethis|platform-cdn", line):
            continue
        # Detect start: first substantial prose paragraph (not a bullet, not a link-only line)
        if not started:
            stripped = line.strip()
            is_prose = (len(stripped) > 60 and not stripped.startswith("- ")
                        and not stripped.startswith("[") and not stripped.startswith("#")
                        and "." in stripped)
            if is_prose:
                started = True
        if started:
            out.append(line)
    text = "\n".join(out).strip()
    # Cut at first horizontal rule (footer boundary)
    text = re.split(r"\n-{3,}\n", text)[0]
    # Remove image markdown lines pointing to technewsworld CDN
    text = re.sub(r"!\[[^\]]*\]\(https?://[^)]*technewsworld[^)]*\)", "", text)
    # Remove "Related Stories" / footer boilerplate
    text = re.sub(r"\nRelated\s+Stories?\n.*", "", text, flags=re.DOTALL | re.IGNORECASE)
    # Remove trailing copyright / newsletter lines
    text = re.sub(r"\.?\s*©.*TechNewsWorld.*", "", text, flags=re.DOTALL)
    return text.strip()

def main():
    OUT_MDX.mkdir(parents=True, exist_ok=True)
    OUT_IMG.mkdir(parents=True, exist_ok=True)
    files = sorted(SCRAP_ART.glob("*.json"))
    print(f"Converting {len(files)} articles...")
    for f in files:
        d = json.load(open(f))
        m = d.get("metadata", {})
        md = d.get("markdown", "")
        if not md:
            continue
        title = (m.get("title") or m.get("og:title") or "").strip()
        if not title:
            # try first H1 in markdown
            h1 = re.search(r"^#\s+(.+)$", md, re.MULTILINE)
            title = h1.group(1).strip() if h1 else f.stem
        desc = (m.get("description") or m.get("og:description") or "").strip()
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

        body = clean_markdown(md)
        if len(body) < 200:
            continue  # skip junk

        # tags
        words = re.findall(r"[A-Za-z]+", title)
        tags = [w.capitalize().replace('"', "'") for w in words if len(w) > 3][:3] or ["Technology"]

        # Copy local image if exists
        src_img = SCRAP_IMG / f"{slug}.jpg"
        img_ref = ""
        if src_img.exists():
            dst = OUT_IMG / f"{slug}.jpg"
            shutil.copy2(src_img, dst)
            img_ref = f"/articles/{slug}.jpg"

        title_clean = title[:200].replace('"', "'").replace("\n", " ")
        desc_clean = (desc[:155] if desc else title[:155]).replace('"', "'").replace("\n", " ")
        fm = f"""---
title: "{title_clean}"
description: "{desc_clean}"
date: "{date}"
author: "{author}"
category: "{category}"
tags: {tags}
featured: false
trending: 0
---

"""
        # Prepend cover image if available
        cover = f"![{title}]({img_ref})\n\n" if img_ref else ""
        out = fm + cover + body
        (OUT_MDX / f"{slug}.mdx").write_text(out, encoding="utf-8")
    print(f"Done. MDX in {OUT_MDX}, images in {OUT_IMG}")

if __name__ == "__main__":
    main()
