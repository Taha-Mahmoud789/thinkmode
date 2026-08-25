#!/usr/bin/env python3
"""Harvest generated cover-art job dirs into public/articles + public/images."""

import shutil
from pathlib import Path

ROOT = Path(r"C:/Users/tabdo/Desktop/TM/thinkmode")
ART = ROOT / "cover-art"
OUT_ARTICLES = ROOT / "public" / "articles"
OUT_IMAGES = ROOT / "public" / "images"

# Chronological mapping of completed job dirs -> destination files.
MAPPING = {
    "2026-08-25T21-27-43-682Z-55bb59a1-2282-4f81-93ad-1c22a3a9136a": (
        OUT_ARTICLES / "the-rise-of-ai-agents-and-what-it-means-for-developers.png",
        "(manual test — ai agents)",
    ),
    "2026-08-25T21-30-43-500Z-06efad0a-fa7f-4102-b756-504508a0ddf0": (OUT_IMAGES / "hero-ai.png", "HERO"),
    "2026-08-25T21-31-27-787Z-ace88220-07a1-4a35-9838-971429a7db1c": (OUT_ARTICLES / "a-complete-guide-to-building-llm-applications.png", "llm-guide"),
    "2026-08-25T21-32-10-261Z-47ed30c3-6bf1-415f-a27b-a0cb7ca44ce1": (OUT_ARTICLES / "nextjs-for-modern-developers.png", "nextjs"),
    "2026-08-25T21-32-52-856Z-aed799b4-2ab4-43eb-a762-45d80add2342": (OUT_ARTICLES / "rust-vs-go-which-language-should-you-choose.png", "rust-go"),
    "2026-08-25T21-33-33-414Z-e6589fda-26dc-44d6-b34c-1511034f0b4d": (OUT_ARTICLES / "understanding-transformers-without-the-math.png", "transformers"),
    "2026-08-25T21-34-18-425Z-f7bbce20-6ba1-4f46-832a-20c566d0e980": (OUT_ARTICLES / "how-ai-agents-actually-work.png", "agents-how"),
    "2026-08-25T21-34-59-334Z-1b9ccb56-315e-4b16-a6d9-c16205265589": (OUT_ARTICLES / "building-production-ready-ai-applications.png", "production-ai"),
    "2026-08-25T21-36-11-222Z-d9819d26-44f2-4ede-824a-2a59ff68a982": (OUT_ARTICLES / "docker-for-developers-who-just-want-things-to-work.png", "docker"),
    "2026-08-25T21-37-06-483Z-4e647a5d-97b4-479c-9c3a-c58a6b6c67f3": (OUT_ARTICLES / "zero-trust-security-for-web-developers.png", "zero-trust"),
}

for job_dir, (dest, label) in MAPPING.items():
    src = ART / job_dir / "image-01.png"
    if not src.exists():
        print(f"[miss] {label}: no image in {job_dir}")
        continue
    dest.parent.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(src, dest)
    print(f"[ok  ] {label} -> {dest.name}")

print("\nDone.")
