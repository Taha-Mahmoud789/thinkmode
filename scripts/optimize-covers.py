#!/usr/bin/env python3
"""Optimize generated cover-art job dirs -> public/articles + public/images."""

import shutil
from pathlib import Path

from PIL import Image

ROOT = Path(r"C:/Users/tabdo/Desktop/TM/thinkmode")


def optimize(png_path: Path, jpg_dest: Path, max_w: int = 1600, quality: int = 82) -> None:
    with Image.open(png_path) as im:
        im = im.convert("RGB")
        if im.width > max_w:
            ratio = max_w / im.width
            im = im.resize((max_w, round(im.height * ratio)), Image.LANCZOS)
        jpg_dest.parent.mkdir(parents=True, exist_ok=True)
        im.save(jpg_dest, "JPEG", quality=quality, optimize=True, progressive=True)
    print(f"{jpg_dest.name}: {png_path.stat().st_size // 1024}KB -> {jpg_dest.stat().st_size // 1024}KB")


if __name__ == "__main__":
    import sys

    if len(sys.argv) == 3:
        # Single-file mode: optimize src.png -> dest.jpg
        optimize(Path(sys.argv[1]), Path(sys.argv[2]))
    else:
        targets = [
            *sorted((ROOT / "public" / "articles").glob("*.png")),
            ROOT / "public" / "images" / "hero-ai.png",
        ]
        for src in targets:
            optimize(src, src.with_suffix(".jpg"))
            src.unlink()
        print("\nPNG originals removed.")
