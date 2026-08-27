#!/usr/bin/env python3
"""Regenerate all ThinkMode covers with diverse accent colors matching each article's topic.

Graphite+Emerald base: dark graphite/near-black background (#07110F/#0D1916),
each cover gets a distinct accent color from a wide palette.
Each prompt: subject-appropriate + left-negative-space so headline text is readable.
"""

import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(r"C:/Users/tabdo/Desktop/TM/thinkmode")
ART_DIR = ROOT / "cover-art"
OUT_DIR = ROOT / "public" / "articles"
STATE_FILE = ART_DIR / "state-regen.json"

# Wide accent palette — distinct per article, all on graphite background
COVERS = [
    {
        "slug": "the-rise-of-ai-agents-and-what-it-means-for-developers",
        "accent": "#17B890", "accent2": "#B7E4C7",
        "subject": "a swarm of glowing AI agent nodes connected by luminous task-flow threads forming a network, digital autonomous helpers orbiting a central brain-core",
    },
    {
        "slug": "how-ai-agents-actually-work",
        "accent": "#3B82F6", "accent2": "#93C5FD",
        "subject": "an exploded diagram of an AI agent: a glowing planner module, a memory vault, and tool connectors, rendered as floating holographic blocks wired by light",
    },
    {
        "slug": "a-complete-guide-to-building-llm-applications",
        "accent": "#8B5CF6", "accent2": "#C4B5FD",
        "subject": "a large language model pipeline: glowing tokens streaming through layered transformer rings, prompt-to-response flow as luminous particles",
    },
    {
        "slug": "building-production-ready-ai-applications",
        "accent": "#F59E0B", "accent2": "#FCD34D",
        "subject": "a production AI system in motion: monitoring dashboards, inference servers and data streams as a living mechanical organism, warm industrial glow",
    },
    {
        "slug": "understanding-transformers-without-the-math",
        "accent": "#EC4899", "accent2": "#F9A8D4",
        "subject": "attention visualized: soft glowing vectors pointing between words in a sentence, abstract flowing lines of meaning connecting floating text fragments",
    },
    {
        "slug": "nextjs-for-modern-developers",
        "accent": "#06B6D4", "accent2": "#67E8F9",
        "subject": "a modern web app architecture: nested route layers, server components and edge functions as interlocking translucent glass panels glowing cyan",
    },
    {
        "slug": "rust-vs-go-which-language-should-you-choose",
        "accent": "#F97316", "accent2": "#FDBA74",
        "subject": "two contrasting language spirits side by side: a rugged rust-colored gear-machine of safety on one side, a swift teal concurrency stream on the other",
    },
    {
        "slug": "typescript-patterns-that-scale",
        "accent": "#6366F1", "accent2": "#A5B4FC",
        "subject": "type-safe architecture: interlocking geometric type lattices and constraint meshes forming a crystalline blueprint, indigo glow",
    },
    {
        "slug": "kubernetes-without-the-tears",
        "accent": "#14B8A6", "accent2": "#5EEAD4",
        "subject": "calm container orchestration: neat pods floating in balanced clusters on gentle waves, a serene control plane with soft teal light, no chaos",
    },
    {
        "slug": "docker-for-developers-who-just-want-things-to-work",
        "accent": "#0EA5E9", "accent2": "#7DD3FC",
        "subject": "containers as stacked shipping boxes sealing apps perfectly, a whale of lightweight isolation carrying glowing packages, sky-blue calm",
    },
    {
        "slug": "ci-cd-pipelines-that-developers-love",
        "accent": "#22C55E", "accent2": "#86EFAC",
        "subject": "a smooth automated pipeline: code flowing through test, build and deploy gates as a green luminous river of progress, satisfying automation",
    },
    {
        "slug": "edge-rendering-explained",
        "accent": "#A855F7", "accent2": "#D8B4FE",
        "subject": "edge nodes spread across a glowing world map, content rendered at the rim closest to users, light jumping from globe edge to user, violet",
    },
    {
        "slug": "zero-trust-security-for-web-developers",
        "accent": "#EF4444", "accent2": "#FCA5A5",
        "subject": "a zero-trust shield: every request verified by glowing identity keys, no implicit trust, layered verification gates as red protective light",
    },
    {
        "slug": "developer-toolchain-2026",
        "accent": "#10B981", "accent2": "#6EE7B7",
        "subject": "a curator's workbench of developer tools: terminals, editors, AI copilots and CLIs as floating precision instruments glowing emerald",
    },
    {
        "slug": "workflow-automation-beyond-cron-jobs",
        "accent": "#EAB308", "accent2": "#FDE047",
        "subject": "intelligent automation: event-driven flows branching like living roots, triggers sparking actions across a luminous golden web",
    },
]

# Hero + Banner use emerald (brand) but distinct compositions
EXTRAS = [
    {
        "slug": "hero-ai",
        "accent": "#17B890", "accent2": "#B7E4C7",
        "subject": "an abstract human profile head rendered as translucent glass, wired with glowing emerald circuitry and neural pathways, facing left",
        "wide": True,
    },
    {
        "slug": "editors-pick-banner",
        "accent": "#17B890", "accent2": "#B7E4C7",
        "subject": "ultra-wide cinematic AI/tech visualization with glowing neural pathways, holographic code structures and data flowing through crystalline circuits",
        "wide": True,
    },
]

PROMPT_TMPL = (
    "ThinkMode technology blog cover. Dark graphite near-black background (#07110F with #0D1916 surfaces), "
    "premium editorial photography style, cinematic lighting. "
    "Subject on the RIGHT side: {subject}. "
    "Accent lighting in {accent} with {accent2} highlights. "
    "LEFT {left_pct}% kept as clean dark negative space (no elements, no text) for white headline overlay. "
    "No text, no letters, no logos, no watermarks. "
    "16:9, sharp 8K, magazine-quality, restrained and elegant."
)

WIDE_TMPL = (
    "ThinkMode technology blog banner, ultra-wide 21:9 cinematic landscape. "
    "Dark graphite near-black background (#07110F), premium editorial style. "
    "Subject on the RIGHT {pct}%: {subject}. "
    "Accent lighting in {accent} with {accent2} highlights. "
    "LEFT kept as clean dark negative space for white headline overlay. "
    "No text, no letters, no logos, no watermarks. Sharp 8K, magazine-quality."
)


def main():
    ART_DIR.mkdir(parents=True, exist_ok=True)
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    items = []
    for c in COVERS:
        items.append((c["slug"], c, False))
    for c in EXTRAS:
        items.append((c["slug"], c, True))

    for slug, c, is_wide in items:
        out_jpg = OUT_DIR / f"{slug}.jpg"
        if out_jpg.exists():
            print(f"[skip] {slug} (exists)")
            continue
        if is_wide:
            prompt = WIDE_TMPL.format(pct="60%", subject=c["subject"], accent=c["accent"], accent2=c["accent2"])
        else:
            prompt = PROMPT_TMPL.format(subject=c["subject"], accent=c["accent"], accent2=c["accent2"], left_pct="55%")

        cmd = [
            "node", "bin/chatgpt-web-image.js", "generate",
            "--prompt", prompt,
        ]
        env = {
            "CHATGPT_CDP_URL": "http://127.0.0.1:9224",
            "CHATGPT_ALLOW_REMOTE_CDP": "true",
            "CHATGPT_IMAGE_OUTPUT_DIR": str(ART_DIR),
        }
        print(f"[gen] {slug} ...", flush=True)
        proc = subprocess.run(cmd, cwd=r"C:/Users/tabdo/chatgpt-web-image-mcp",
                              env={**__import__("os").environ, **env},
                              capture_output=True, text=True, timeout=300)
        try:
            payload = json.loads(proc.stdout[proc.stdout.index("{"):])
        except Exception:
            print(f"  [FAIL] {slug}: {proc.stdout[-300:]}")
            continue
        if not payload.get("ok"):
            print(f"  [FAIL] {slug}: {payload}")
            continue
        img = payload["images"][0]["filePath"]
        # optimize + move
        from PIL import Image
        im = Image.open(img).convert("RGB")
        w, h = im.size
        maxw = 1600 if not is_wide else 2200
        if w > maxw:
            ratio = maxw / w
            im = im.resize((maxw, int(h * ratio)), Image.LANCZOS)
        im.save(out_jpg, "JPEG", quality=82, optimize=True, progressive=True)
        print(f"  [ok] {slug} -> {out_jpg.name} ({out_jpg.stat().st_size//1024}KB)")


if __name__ == "__main__":
    main()
