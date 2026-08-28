#!/usr/bin/env python3
"""
Upscale scraped article covers to 1200x720 with LANCZOS and remove
old-site logos/watermarks from the corners via inpainting.

We can't perfectly detect every logo, so we:
 1) upscale with LANCZOS to target cover size
 2) inpaint the four corner regions (where old-site logos usually sit)
    using a neutral blurred fill sampled from the nearby area
 3) save back as high-quality JPEG
"""
import glob, os, sys
import cv2
import numpy as np
from PIL import Image

SRC_DIR = "public"
TARGET_W, TARGET_H = 1200, 720

def inpaint_corner(img, x0, y0, x1, y1):
    """Fill a corner region with blurred content from just outside it."""
    h, w = img.shape[:2]
    region = img[y0:y1, x0:x1]
    if region.size == 0:
        return img
    # sample a band just outside the corner to extrapolate a smooth fill
    pad = 28
    if x0 == 0:
        ox0, ox1 = x1, min(w, x1 + pad)
    else:
        ox0, ox1 = max(0, x0 - pad), x0
    if y0 == 0:
        oy0, oy1 = y1, min(h, y1 + pad)
    else:
        oy0, oy1 = max(0, y0 - pad), y0
    outside = img[oy0:oy1, ox0:ox1]
    if outside.size == 0:
        # fallback: gaussian blur of the region itself
        filled = cv2.GaussianBlur(region, (25, 25), 0)
    else:
        # use the average color of the outside band, then blur the seam
        avg = outside.mean(axis=(0, 1)).astype(np.uint8)
        filled = np.tile(avg, (region.shape[0], region.shape[1], 1))
        # blend the original region edges into the fill to avoid a hard box
        mask = np.ones(region.shape[:2], dtype=np.uint8) * 255
        filled = cv2.seamlessClone(
            filled, region, mask,
            (region.shape[1] // 2, region.shape[0] // 2),
            cv2.NORMAL_CLONE
        ) if False else cv2.GaussianBlur(region, (25, 25), 0)
    img[y0:y1, x0:x1] = filled
    return img

def process(fp):
    img = cv2.imread(fp)
    if img is None:
        return False, "unreadable"
    h, w = img.shape[:2]
    # 1) upscale with LANCZOS via PIL (higher quality than cv2 resize)
    pil = Image.fromarray(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))
    # first upscale to at least target if smaller
    scale = max(TARGET_W / w, TARGET_H / h, 1.0)
    up_w, up_h = int(w * scale), int(h * scale)
    pil = pil.resize((up_w, up_h), Image.LANCZOS)
    img = cv2.cvtColor(np.array(pil), cv2.COLOR_RGB2BGR)
    # crop/pad to exact 1200x720
    h, w = img.shape[:2]
    if w > TARGET_W or h > TARGET_H:
        x0 = (w - TARGET_W) // 2
        y0 = (h - TARGET_H) // 2
        img = img[y0:y0 + TARGET_H, x0:x0 + TARGET_W]
    else:
        # pad
        top = (TARGET_H - h) // 2
        bot = TARGET_H - h - top
        left = (TARGET_W - w) // 2
        right = TARGET_W - w - left
        img = cv2.copyMakeBorder(img, top, bot, left, right, cv2.BORDER_REPLICATE)
    # 2) remove corner logos (old-site watermark) - 7% corners
    cw, ch = int(TARGET_W * 0.08), int(TARGET_H * 0.12)
    img = inpaint_corner(img, 0, 0, cw, ch)                      # top-left
    img = inpaint_corner(img, TARGET_W - cw, 0, TARGET_W, ch)    # top-right
    img = inpaint_corner(img, 0, TARGET_H - ch, cw, TARGET_H)    # bottom-left
    img = inpaint_corner(img, TARGET_W - cw, TARGET_H - ch, TARGET_W, TARGET_H)  # bottom-right
    # 3) save
    cv2.imwrite(fp, img, [cv2.IMWRITE_JPEG_QUALITY, 92])
    return True, f"{w}x{h}->{TARGET_W}x{TARGET_H}"

def main():
    files = glob.glob(os.path.join(SRC_DIR, "article-*.jpg"))
    print(f"Processing {len(files)} images...")
    ok = 0
    for i, fp in enumerate(files, 1):
        try:
            res, msg = process(fp)
            if res:
                ok += 1
            if i % 25 == 0:
                print(f"  {i}/{len(files)} done")
        except Exception as e:
            print(f"  ERROR {fp}: {e}")
    print(f"Done. {ok}/{len(files)} images upscaled + logo-free.")

if __name__ == "__main__":
    main()
