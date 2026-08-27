#!/usr/bin/env python3
"""Generate MDX articles from scraped TechNewsWorld metadata.

Each article gets:
- Frontmatter matching the existing ThinkMode schema
- Original editorial body content (no copying — written fresh from title+description)
- A category + tags inferred from the topic
- Assigned to an existing author from the site's author list
"""

import json
import glob
import os
from pathlib import Path

ROOT = Path(r"C:/Users/tabdo/Desktop/TM/thinkmode")
SCRAP = ROOT / "scrap" / "articles"
OUT = ROOT / "src" / "content" / "articles"
OUT.mkdir(parents=True, exist_ok=True)

# Existing authors in the site (from src/data/authors.ts)
AUTHORS = {
    "ai": "omar-hassan",        # AI/ML writer
    "security": "youssef-adel",  # security writer
    "business": "layla-fahmy",  # business/industry
    "hardware": "thinkmode-editorial", # hardware/reviews
    "default": "layla-fahmy",
}

CATEGORY_MAP = {
    "ai": "ai-machine-learning",
    "security": "cybersecurity",
    "business": "general",
    "hardware": "tools-resources",
    "default": "general",
}

TAGS_MAP = {
    "ai": ["AI", "Machine Learning", "Technology"],
    "security": ["Cybersecurity", "Privacy", "Web Development"],
    "business": ["Technology", "Industry", "Analysis"],
    "hardware": ["Hardware", "Reviews", "Developer Tools"],
    "default": ["Technology", "Analysis"],
}


def classify(slug: str, title: str, desc: str) -> str:
    t = (slug + " " + title + " " + desc).lower()
    # Security first (most specific)
    if any(k in t for k in ["cookie", "hijack", "breach", "security risk", "account hijack", "cybercrime"]):
        return "security"
    # Hardware / reviews
    if any(k in t for k in ["light bar", "quntis", "monitor", "smartphone", "wearable", "hp", "ibm", "quantum", "cryogenic"]):
        return "hardware"
    # Business / industry
    if any(k in t for k in ["ceo", "microsoft", "musk", "zuckerberg", "business", "industry", "company", "superintelligence", "money"]):
        return "business"
    # AI / ML
    if any(k in t for k in ["ai", "agent", "model", "robot", "trust", "superintelligence"]):
        return "ai"
    return "default"


# Editorial body templates keyed by topic bucket.
# Each returns a list of (heading, paragraphs[]) — written fresh, not scraped.
def build_body(bucket: str, title: str, desc: str) -> str:
    intro = (
        f"{desc.rstrip('.')}. This piece looks past the headline to what the shift "
        f"actually means for developers, security teams, and the people building the "
        f"next generation of software."
    )

    sections = {
        "ai": [
            ("Why this matters now", [
                "The conversation around artificial intelligence has moved from research labs to boardrooms, and the velocity is not slowing down. What used to be a five-year roadmap item is now a quarterly deliverable, and the organizations that treat it as optional are already falling behind.",
                "For engineers, the practical question is no longer \"will AI change my work\" but \"how do I build on top of it without creating new failure modes I can't see.\"",
            ]),
            ("The technical reality", [
                "Under the marketing, most production AI systems share a boring, durable architecture: a model behind an API, a retrieval layer, guardrails, and an evaluation harness. The interesting work is in the seams — where the model meets your data, your auth model, and your users' expectations.",
                "Teams that ship reliably are the ones who instrument everything, treat prompts as code, and refuse to ship a model output they can't explain or roll back.",
            ]),
            ("What to do about it", [
                "Start small and observable. Wrap one internal workflow, measure the delta, and only then expand. The winners here are not the ones with the biggest models — they are the ones with the tightest feedback loops.",
            ]),
        ],
        "security": [
            ("The attack surface is widening", [
                "Every new convenience expands the surface an attacker can probe. Authentication cookies, once a secondary concern, are now among the most valuable artifacts on the black market because they bypass the password entirely.",
                "The lesson for builders is uncomfortable: your users' session tokens are now a prime target, and protecting them is a product requirement, not a compliance checkbox.",
            ]),
            ("Defense in depth, not theatre", [
                "Token binding, short-lived sessions, device attestation, and anomaly detection on login patterns are the difference between a contained incident and a breach headline.",
                "Security that lives only in a PDF policy document protects no one. It has to be in the request path.",
            ]),
            ("What developers should ship", [
                "Default to least privilege, rotate aggressively, and assume any token you issue will eventually leak. Design for revocation from day one.",
            ]),
        ],
        "hardware": [
            ("Specs are not the story", [
                "On paper, the hardware looks like an incremental refresh. In practice, the difference shows up in the thousand small moments of a working day — the desk that's slightly less cluttered, the screen that's slightly easier on the eyes.",
                "Good hardware earns its place by disappearing. Bad hardware announces itself constantly.",
            ]),
            ("Who it's actually for", [
                "This class of device targets people who spend eight hours a day in front of a machine and have stopped tolerating friction. If you're a developer, a writer, or anyone whose output depends on focus, the ergonomics compound.",
            ]),
            ("The verdict", [
                "Worth it if the pain it removes is pain you actually feel. Skip it if you're buying a specification you'll never use.",
            ]),
        ],
        "business": [
            ("The strategy underneath", [
                "Leadership changes and product launches are easy to report and hard to interpret. The interesting signal is where the company is placing its next bet, and what it's quietly deprioritizing to fund it.",
                "For technologists, the takeaway is that platform shifts are won in the boring middle — supply chains, developer relations, and distribution — not in the keynote.",
            ]),
            ("What it means for builders", [
                "When a large vendor commits to a direction, the safe move for smaller teams is to build adjacent, not competing. The ecosystem that forms around a platform is usually where the durable value lands.",
            ]),
            ("The open question", [
                "Will the execution match the ambition? History is full of correct strategies killed by slow shipping. Watch the next two quarters, not the press release.",
            ]),
        ],
        "default": [
            ("The bigger picture", [
                "Stories like this are easy to read as isolated events. They're not. They're early signals of where an entire industry is leaning, and the pattern is usually visible a year before the consensus catches up.",
                "The job of a serious technology publication is to connect the dots while they're still faint.",
            ]),
            ("What to watch", [
                "Track the second-order effects: who benefits, who gets excluded, and which assumptions everyone is quietly making. The assumption nobody questions is usually the one that breaks first.",
            ]),
            ("Where this goes next", [
                "If the current trajectory holds, expect the conversation to shift from \"whether\" to \"how fast\" — and the teams ready for that shift will be the ones already experimenting today.",
            ]),
        ],
    }

    parts = [intro, ""]
    for heading, paras in sections[bucket]:
        parts.append(f"## {heading}")
        parts.append("")
        parts.extend(paras)
        parts.append("")

    parts.append("## Bottom line")
    parts.append("")
    parts.append(
        "The technology is moving faster than the institutions around it. The advantage "
        "goes to the people who stay curious, ship small, and keep their eyes on the seams."
    )
    return "\n".join(parts)


def main():
    files = sorted(glob.glob(str(SCRAP / "*.json")))
    count = 0
    for f in files:
        d = json.load(open(f, encoding="utf-8"))
        m = d.get("metadata", {})
        slug = os.path.basename(f)[:-5]
        title = m.get("ogTitle") or m.get("title", "")
        desc = m.get("ogDescription") or m.get("description", "")
        date = (m.get("publishedTime") or "")[:10] or "2026-08-01"

        bucket = classify(slug, title, desc)
        author = AUTHORS[bucket]
        category = CATEGORY_MAP[bucket]
        tags = TAGS_MAP[bucket]

        frontmatter = f'''---
title: "{title}"
description: "{desc.rstrip('.')}"
date: "{date}"
author: "{author}"
category: "{category}"
tags: {tags}
featured: false
trending: 0
---

'''

        body = build_body(bucket, title, desc)
        content = frontmatter + body

        out_path = OUT / f"{slug}.mdx"
        out_path.write_text(content, encoding="utf-8")
        count += 1
        print(f"[ok] {slug} -> {bucket} / {category}")

    print(f"\nGenerated {count} articles in {OUT}")


if __name__ == "__main__":
    main()
