#!/usr/bin/env python3
"""Generate ThinkMode article covers via the local chatgpt-web-image CLI.

Serial generation (one shared ChatGPT composer). Progress is tracked in
cover-art/state.json so re-runs skip finished covers.
"""

import json
import shutil
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(r"C:/Users/tabdo/Desktop/TM/thinkmode")
MCP = Path(r"C:/Users/tabdo/chatgpt-web-image-mcp")
OUT_ARTICLES = ROOT / "public" / "articles"
STATE_FILE = ROOT / "cover-art" / "state.json"

ENV = {
    "CHATGPT_CDP_URL": "http://127.0.0.1:9224",
    "CHATGPT_ALLOW_REMOTE_CDP": "true",
    "CHATGPT_IMAGE_OUTPUT_DIR": str(ROOT / "cover-art"),
}

STYLE = (
    "Deep near-black navy background, violet (#7c3cff) and cyan (#22d3ee) light accents, "
    "faint perspective grid lines, soft bloom lighting. Premium minimal tech-magazine "
    "aesthetic inspired by Linear and Stripe artwork: dark, restrained, elegant, cinematic "
    "depth of field. Wide 16:9 composition with clean negative space on the left side. "
    "No text, no letters, no numbers, no logos, no watermark."
)

COVERS = {
    "the-rise-of-ai-agents-and-what-it-means-for-developers": None,  # already generated
    "a-complete-guide-to-building-llm-applications": (
        "Editorial technology cover art about building LLM applications: a luminous AI core "
        "orb suspended above layered translucent glass architecture planes, with streams of "
        "document pages turning into glowing embeddings flowing into the core, thin light "
        "pipelines connecting the layers like a blueprint brought to life."
    ),
    "nextjs-for-modern-developers": (
        "Editorial technology cover art about modern web rendering: a translucent webpage "
        "wireframe being assembled mid-air by converging streams of violet and cyan light, "
        "some sections already solid glass panels while others materialize as glowing "
        "particles, motion blur suggesting streaming speed."
    ),
    "rust-vs-go-which-language-should-you-choose": (
        "Editorial technology cover art about two competing programming languages: two "
        "abstract mechanical constructs facing each other across a split arena — one built "
        "from interlocking orange-amber precision gears and armor plates, the other from "
        "smooth flowing cyan light forms — balanced on a reflective dark floor, tension but "
        "mutual respect in the composition."
    ),
    "understanding-transformers-without-the-math": (
        "Editorial technology cover art explaining neural attention: floating luminous orbs "
        "arranged like words in a sentence, connected by glowing threads of varying "
        "brightness and thickness showing which orbs attend to which, one orb highlighted "
        "bright violet receiving many threads, dreamy shallow depth."
    ),
    "how-ai-agents-actually-work": (
        "Editorial technology cover art about autonomous AI agents: a sleek translucent "
        "robotic arm selecting glowing tools from a floating holographic toolbox, a loop of "
        "light connecting arm to toolbox to a small task window and back, conveying plan-act-"
        "observe cycles."
    ),
    "building-production-ready-ai-applications": (
        "Editorial technology cover art about production AI systems: a cathedral-like dark "
        "server hall receding into depth, rows of racks with violet status lights, in the "
        "foreground a glowing protective shield lattice around a bright AI core, gauges and "
        "circuit conduits along the walls."
    ),
    "docker-for-developers-who-just-want-things-to-work": (
        "Editorial technology cover art about software containers: standardized glowing "
        "cargo container modules stacking neatly into a grid on a dark harbor platform, one "
        "container open emitting warm cyan light showing miniature machinery inside, crane "
        "silhouettes of light in background haze."
    ),
    "zero-trust-security-for-web-developers": (
        "Editorial technology cover art about zero-trust security: a series of concentric "
        "translucent gate rings of light that a single glowing credential key passes "
        "through, each gate scanning with a thin cyan beam, deep perspective tunnel toward "
        "a protected violet core."
    ),
    "developer-toolchain-2026": (
        "Editorial technology cover art about the developer toolchain: a dark artisan "
        "workbench where holographic tools hover in organized rows — wrenches, scopes, "
        "calipers rendered as glowing violet-blue wireframes — above a real wooden desk "
        "with a softly lit keyboard."
    ),
    "kubernetes-without-the-tears": (
        "Editorial technology cover art about container orchestration: a vast dark hangar "
        "where dozens of small glowing pod-craft hover in precise hexagonal fleet "
        "formation, orchestrated by luminous control beams descending from a central "
        "command spire."
    ),
    "typescript-patterns-that-scale": (
        "Editorial technology cover art about type-safe architecture: translucent sapphire "
        "geometric blocks with interlocking joints snapping together into a load-bearing "
        "bridge structure, one misplaced red-glowing block hovering rejected outside the "
        "pattern, blueprint lines beneath."
    ),
    "ci-cd-pipelines-that-developers-love": (
        "Editorial technology cover art about CI/CD pipelines: an elegant elevated light-"
        "rail carrying glowing code crates through checkpoint arch gates over a dark city "
        "of circuits, ending at a launch pad where one crate lifts off in a beam of "
        "violet thrust."
    ),
    "edge-rendering-explained": (
        "Editorial technology cover art about edge computing: a stylized dark globe made "
        "of latitude longitude light lines, bright nodes at city points across "
        "continents, beams of content streaming from the nearest node to a user silhouette "
        "device, low latency visualized as short arcs."
    ),
    "workflow-automation-beyond-cron-jobs": (
        "Editorial technology cover art about event-driven automation: a luminous river of "
        "packets flowing through a sequence of smart gates and valves that route "
        "themselves, one branch splitting to a dead-letter vault with a soft amber warning "
        "glow, clockwork gears merged with circuitry."
    ),
}

HERO_PROMPT = (
    "Cinematic editorial hero artwork for a premium technology publication: a human head "
    "in profile view formed from translucent dark glass wired with glowing violet and cyan "
    "circuit traces, synapse sparks traveling along the circuits, surrounded by two thin "
    "concentric orbit rings and small floating holographic interface panels showing charts, "
    "ambient atmospheric glow. " + STYLE
)


def load_state() -> dict:
    if STATE_FILE.exists():
        return json.loads(STATE_FILE.read_text(encoding="utf-8"))
    return {}


def save_state(state: dict) -> None:
    STATE_FILE.parent.mkdir(parents=True, exist_ok=True)
    STATE_FILE.write_text(json.dumps(state, indent=2), encoding="utf-8")


def generate(prompt: str, out_name: str, state: dict) -> bool:
    if state.get(out_name) == "done":
        print(f"[skip] {out_name} already done", flush=True)
        return True

    cmd = [
        "node",
        str(MCP / "bin" / "chatgpt-web-image.js"),
        "generate",
        "--prompt",
        f"{prompt} {STYLE}",
    ]
    print(f"[gen ] {out_name} ...", flush=True)
    started = time.time()
    try:
        proc = subprocess.run(
            cmd,
            cwd=str(MCP),
            env={**__import__("os").environ, **ENV},
            capture_output=True,
            text=True,
            timeout=420,
        )
        payload = json.loads(proc.stdout[proc.stdout.index("{"):])
        images = payload.get("images") or []
        if not payload.get("ok") or not images:
            print(f"[FAIL] {out_name}: {proc.stdout[-300:]} {proc.stderr[-300:]}", flush=True)
            return False
        src = Path(images[0]["filePath"])
        dest = OUT_ARTICLES / out_name
        dest.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(src, dest)
        state[out_name] = "done"
        save_state(state)
        print(f"[ok  ] {out_name} <- {src.name} ({time.time()-started:.0f}s)", flush=True)
        return True
    except Exception as exc:  # noqa: BLE001 - log and continue with remaining covers
        print(f"[ERR ] {out_name}: {type(exc).__name__}: {exc}", flush=True)
        return False


def main() -> int:
    state = load_state()

    # Seed the already-generated test cover so it is not regenerated.
    seed = OUT_ARTICLES / "the-rise-of-ai-agents-and-what-it-means-for-developers.png"
    seed.parent.mkdir(parents=True, exist_ok=True)
    if not seed.exists():
        first = next((ROOT / "cover-art").glob("*/image-01.png"), None)
        if first:
            shutil.copyfile(first, seed)
    state["the-rise-of-ai-agents-and-what-it-means-for-developers.png"] = "done"
    save_state(state)

    failures: list[str] = []

    hero_done = generate(HERO_PROMPT, "hero-ai.png", state)
    if not hero_done:
        failures.append("hero")

    for slug, prompt in COVERS.items():
        if prompt is None:
            continue
        if not generate(prompt, f"{slug}.png", state):
            failures.append(slug)

    print("\n=== SUMMARY ===", flush=True)
    print(f"failures: {failures if failures else 'none'}", flush=True)
    return 0


if __name__ == "__main__":
    sys.exit(main())
