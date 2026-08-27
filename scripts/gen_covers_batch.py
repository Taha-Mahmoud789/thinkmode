#!/usr/bin/env python3
"""Generate distinct cover images for all 190 scraped articles via ChatGPT CLI.

Each cover: dark graphite background, distinct accent color per article topic.
"""
import json
import subprocess
import glob
import os
from pathlib import Path
from PIL import Image

ROOT = Path(r"C:/Users/tabdo/Desktop/TM/thinkmode")
SCRAP = ROOT / "scrap" / "articles"
OUT = ROOT / "public" / "articles"
ART = ROOT / "cover-art"

# Wide accent palette (distinct per article)
PALETTE = [
    "#17B890", "#3B82F6", "#8B5CF6", "#F59E0B", "#EC4899", "#06B6D4",
    "#14B8A6", "#EF4444", "#6366F1", "#22C55E", "#F97316", "#A855F7",
    "#0EA5E9", "#EAB308", "#10B981", "#F43F5E", "#84CC16", "#D946EF",
]

PROMPT = (
    "ThinkMode technology blog cover. Dark graphite near-black background (#07110F with #0D1916 surfaces), "
    "premium editorial photography style, cinematic lighting. "
    "Subject on the RIGHT side: {subject}. "
    "Accent lighting in {accent} with subtle highlights. "
    "LEFT 55% kept as clean dark negative space (no elements, no text) for white headline overlay. "
    "No text, no letters, no logos, no watermarks. 16:9, sharp 8K, magazine-quality, restrained and elegant."
)

SUBJECTS = {
    "ai": "an abstract visualization of artificial intelligence: neural network nodes, glowing model layers, or a reasoning agent as light",
    "security": "a cybersecurity motif: a locked shield dissolving into flowing data, threat threads traced in light",
    "programming": "a code and developer motif: floating syntax, a terminal window, or an abstract IDE as light structures",
    "devops": "a cloud infrastructure motif: server racks as glowing lattices, network topology, or orchestrated containers",
    "tools": "a hardware/product motif: a device silhouette, chip die, or gadget rendered as elegant light",
    "general": "a technology horizon: abstract data streams, circuits, or innovation as ambient light",
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

def main():
    OUT.mkdir(parents=True, exist_ok=True)
    ART.mkdir(parents=True, exist_ok=True)
    files = sorted(SCRAP.glob("*.json"))
    for i, f in enumerate(files):
        slug = f.stem
        out_jpg = OUT / f"{slug}.jpg"
        if out_jpg.exists():
            continue
        d = json.load(open(f))
        m = d.get("metadata", {})
        title = str(m.get("title", "") or m.get("og:title", ""))
        desc = str(m.get("description", "") or m.get("og:description", ""))
        cat = classify(title, desc)
        accent = PALETTE[i % len(PALETTE)]
        subject = SUBJECTS[cat]
        prompt = PROMPT.format(subject=subject, accent=accent)
        cmd = ["node", "bin/chatgpt-web-image.js", "generate", "--prompt", prompt]
        env = {**os.environ, "CHATGPT_CDP_URL": "http://127.0.0.1:9224",
               "CHATGPT_ALLOW_REMOTE_CDP": "true", "CHATGPT_IMAGE_OUTPUT_DIR": str(ART)}
        print(f"[gen] {i+1}/{len(files)} {slug}", flush=True)
        try:
            proc = subprocess.run(cmd, cwd=r"C:/Users/tabdo/chatgpt-web-image-mcp",
                                   env=env, capture_output=True, text=True, timeout=300)
            payload = json.loads(proc.stdout[proc.stdout.index("{"):])
            if not payload.get("ok"):
                print(f"  [FAIL] {slug}: {payload}")
                continue
            img = payload["images"][0]["filePath"]
            im = Image.open(img).convert("RGB")
            w, h = im.size
            if w > 1600:
                im = im.resize((1600, int(h * 1600 / w)), Image.LANCZOS)
            im.save(out_jpg, "JPEG", quality=82, optimize=True, progressive=True)
            print(f"  [ok] {out_jpg.name} ({out_jpg.stat().st_size//1024}KB)")
        except Exception as e:
            print(f"  [ERR] {slug}: {e}")

if __name__ == "__main__":
    main()
