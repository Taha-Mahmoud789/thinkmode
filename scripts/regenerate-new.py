#!/usr/bin/env python3
"""Generate covers for the 13 new scraped articles with distinct accent colors."""
import json, subprocess, os
from pathlib import Path
from PIL import Image

ROOT = Path(r"C:/Users/tabdo/Desktop/TM/thinkmode")
ART_DIR = ROOT / "cover-art"
OUT_DIR = ROOT / "public" / "articles"

COVERS = [
    {"slug": "ai-trust-gap-with-young-adults-could-carry-a-high-cost-180511", "accent": "#F43F5E", "accent2": "#EAB308",
     "subject": "a fractured trust gauge between a human silhouette and a corporate AI emblem, cracked connection lines, wary distance"},
    {"slug": "billions-of-stolen-browser-cookies-expose-users-to-account-hijacking-180479", "accent": "#0EA5E9", "accent2": "#EC4899",
     "subject": "glowing browser cookies as golden tokens being siphoned through a dark network tunnel, theft in motion"},
    {"slug": "can-multiple-ai-models-improve-enterprise-trust-180481", "accent": "#A855F7", "accent2": "#3B82F6",
     "subject": "several distinct AI model orbs orbiting a central trust core, cross-verifying each other with light bridges"},
    {"slug": "elon-musk-says-money-wont-matter-by-2036-is-he-right-180484", "accent": "#F97316", "accent2": "#8B5CF6",
     "subject": "a futuristic economy where robots and AI produce abundance, floating currency dissolving into light"},
    {"slug": "hp-needs-more-than-a-new-ceo-180475", "accent": "#14B8A6", "accent2": "#22C55E",
     "subject": "a corporate tower undergoing restructuring, modular building blocks rearranging into a new growth shape"},
    {"slug": "invisible-ai-agents-creating-new-enterprise-security-risks-180514", "accent": "#EAB308", "accent2": "#06B6D4",
     "subject": "ghostly AI agents slipping through a corporate firewall unseen, red alarm threads tracing their path"},
    {"slug": "is-smartphone-preference-a-left-or-right-brain-thing-180506", "accent": "#EC4899", "accent2": "#EF4444",
     "subject": "a smartphone split into left and right brain hemispheres, glowing neural preference paths"},
    {"slug": "mark-zuckerberg-makes-the-case-for-superintelligence-for-everyone-180491", "accent": "#3B82F6", "accent2": "#6366F1",
     "subject": "a personal superintelligence orb in a user hands, radiating individual empowerment light"},
    {"slug": "quntis-light-bar-glow-is-an-upgrade-i-never-expected-180487", "accent": "#8B5CF6", "accent2": "#F43F5E",
     "subject": "a sleek monitor light bar casting a warm glow across a desk setup, ambient backlight halo"},
    {"slug": "rules-to-protect-kids-from-ai-risk-repeating-social-media-mistakes-180493", "accent": "#22C55E", "accent2": "#0EA5E9",
     "subject": "protective guardrails around a child using an AI chatbot, policy shields forming a safe bubble"},
    {"slug": "super-cool-ibm-links-cryogenic-modules-to-scale-quantum-computing-180508", "accent": "#06B6D4", "accent2": "#A855F7",
     "subject": "cryogenic quantum modules linked in a cooling lattice, superconducting qubits glowing in extreme cold"},
    {"slug": "the-problem-with-zuckerbergs-vision-of-personal-superintelligence-180500", "accent": "#EF4444", "accent2": "#F97316",
     "subject": "a superintelligence gateway held by a single corporation, tension between empowerment and control"},
    {"slug": "will-microsoft-miss-the-ai-wearables-opportunity-180496", "accent": "#6366F1", "accent2": "#14B8A6",
     "subject": "AI wearable devices as floating glasses and rings, a missed-opportunity gap with a Microsoft emblem"},
]

PROMPT_TMPL = (
    "ThinkMode technology blog cover. Dark graphite near-black background (#07110F with #0D1916 surfaces), "
    "premium editorial photography style, cinematic lighting. "
    "Subject on the RIGHT side: {subject}. "
    "Accent lighting in {accent} with {accent2} highlights. "
    "LEFT 55% kept as clean dark negative space (no elements, no text) for white headline overlay. "
    "No text, no letters, no logos, no watermarks. 16:9, sharp 8K, magazine-quality, restrained and elegant."
)

def main():
    ART_DIR.mkdir(parents=True, exist_ok=True)
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    for c in COVERS:
        out_jpg = OUT_DIR / f"{c['slug']}.jpg"
        if out_jpg.exists():
            print(f"[skip] {c['slug']}")
            continue
        prompt = PROMPT_TMPL.format(subject=c["subject"], accent=c["accent"], accent2=c["accent2"])
        cmd = ["node", "bin/chatgpt-web-image.js", "generate", "--prompt", prompt]
        env = {"CHATGPT_CDP_URL": "http://127.0.0.1:9224", "CHATGPT_ALLOW_REMOTE_CDP": "true",
               "CHATGPT_IMAGE_OUTPUT_DIR": str(ART_DIR)}
        print(f"[gen] {c['slug']} ...", flush=True)
        proc = subprocess.run(cmd, cwd=r"C:/Users/tabdo/chatgpt-web-image-mcp",
                              env={**os.environ, **env}, capture_output=True, text=True, timeout=300)
        try:
            payload = json.loads(proc.stdout[proc.stdout.index("{"):])
        except Exception:
            print(f"  [FAIL] {c['slug']}: {proc.stdout[-300:]}"); continue
        if not payload.get("ok"):
            print(f"  [FAIL] {c['slug']}: {payload}"); continue
        img = payload["images"][0]["filePath"]
        im = Image.open(img).convert("RGB")
        w, h = im.size
        if w > 1600:
            im = im.resize((1600, int(h * 1600 / w)), Image.LANCZOS)
        im.save(out_jpg, "JPEG", quality=82, optimize=True, progressive=True)
        print(f"  [ok] {out_jpg.name} ({out_jpg.stat().st_size//1024}KB)")

if __name__ == "__main__":
    main()
