#!/usr/bin/env python3
"""Optimize generated covers: resize to max 1600w, convert to quality-82 JPEG."""

from pathlib import Path

from PIL import Image

ROOT = Path(r"C:/Users/tabdo/Desktop/TM/thinkmode")
TARGETS = [
    *sorted((ROOT / "public" / "articles").glob("*.png")),
    ROOT / "public" / "images" / "hero-ai.png",
]

for src in TARGETS:
    dest = src.with_suffix(".jpg")
    with Image.open(src) as im:
        im = im.convert("RGB")
        if im.width > 1600:
            ratio = 1600 / im.width
            im = im.resize((1600, round(im.height * ratio)), Image.LANCZOS)
        im.save(dest, "JPEG", quality=82, optimize=True, progressive=True)
    old_kb = src.stat().st_size // 1024
    new_kb = dest.stat().st_size // 1024
    print(f"{dest.name}: {old_kb}KB -> {new_kb}KB")

# Remove the heavy PNG originals now that JPEGs exist.
for src in TARGETS:
    src.unlink()
print("\nPNG originals removed.")
