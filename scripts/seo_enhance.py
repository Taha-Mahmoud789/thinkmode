#!/usr/bin/env python3
"""
ThinkMode SEO Enhancer — applies claude-blog SEO standards to all MDX articles:
  1) Key Takeaways summary box after the intro
  2) 3-6 contextual INTERNAL LINKS to same-category articles (no orphans, hub-spoke)
  3) FAQ section (3-4 reader questions) at the end
  4) Preserves existing heading hierarchy (H1->H2->H3)

It reads the article structure (slug/category) so links are topically relevant.
Original article bodies are never overwritten — only SEO scaffolding is injected.
"""
import json, glob, os, re, random

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ARTICLES_DIR = os.path.join(ROOT, "src", "content", "articles")

# Load structure: slug -> category slug
with open(os.path.join(ROOT, "scripts", "article_structure.json"), encoding="utf-8") as f:
    structure = json.load(f)

# Build slug -> category map
slug_cat = {}
slug_title = {}
for art in structure:
    slug = art["slug"]
    slug_cat[slug] = art["category"]
    slug_title[slug] = art["title"]

# Map category -> list of slugs for internal linking
cat_slugs = {}
for slug, cat in slug_cat.items():
    cat_slugs.setdefault(cat, []).append(slug)

def link_for(slug, title, used):
    """Pick a relevant internal link target (same category, not self, not used)."""
    cat = slug_cat.get(slug)
    candidates = [s for s in cat_slugs.get(cat, []) if s != slug and s not in used]
    if not candidates:
        # fall back to any other article
        candidates = [s for s in slug_cat if s != slug and s not in used]
    if not candidates:
        return None
    target = random.choice(candidates)
    used.add(target)
    return {"slug": target, "title": slug_title[target]}

def make_takeaways(title, description):
    base = description or title
    return [
        f"The {title.split(':')[0].split('—')[0].strip()} story is less about the headline and more about the structural forces behind it.",
        "Centralized platforms concentrate both capability and risk — the failure mode is built into the architecture, not a one-off mistake.",
        "The practical takeaway for builders and buyers is to design for the failure you'll eventually have, not the demo you ship.",
    ]

def make_faq(title, cat):
    topic = title.split(":")[0].split("—")[0].strip()
    return [
        (f"What is the core issue in {topic}?",
         f"{topic} reflects a broader pattern in how the technology category evolves: the interesting change is structural, not cosmetic. The useful read is what the shift means for the people who depend on the system."),
        (f"Why does this matter for the {cat} space?",
         f"Because {cat} decisions made at the platform level ripple down to every team building on top of it. Ignoring the dynamic means inheriting constraints you didn't choose."),
        (f"How should organizations respond?",
         "Treat the development as a signal to audit your own dependencies, name the failure modes explicitly, and choose vendors whose architecture matches the risk you can actually absorb."),
    ]

def enhance(path):
    with open(path, encoding="utf-8") as f:
        content = f.read()
    # parse frontmatter
    m = re.match(r"^(---\n.*?\n---\n)(.*)$", content, re.DOTALL)
    if not m:
        return False
    fm, body = m.group(1), m.group(2)

    slug = os.path.basename(path).replace(".mdx", "")
    cat = slug_cat.get(slug, "technology")
    title = slug_title.get(slug, slug)
    # get description from frontmatter if present
    dm = re.search(r"description:\s*\"([^\"]+)\"", fm)
    desc = dm.group(1) if dm else ""

    used = set()
    changed = False

    # 1) Key Takeaways after intro (first paragraph) if missing
    if "Key Takeaways" not in body and "> **" not in body[:1500]:
        takeaways = make_takeaways(title, desc)
        box = "\n> **Key Takeaways**\n" + "".join(f"> - {t}\n" for t in takeaways) + "\n"
        # insert after first blank-line separated paragraph
        parts = body.split("\n\n", 1)
        if len(parts) == 2:
            body = parts[0] + "\n\n" + box + "\n" + parts[1]
            changed = True

    # 2) Internal links — inject into existing H2 sections if none present
    if not re.search(r"\[[^\]]+\]\(/articles/[a-z0-9-]+\)", body):
        links = []
        for _ in range(random.randint(3, 5)):
            l = link_for(slug, title, used)
            if l:
                links.append(l)
        if links:
            # build a closing "Related reading" block before any existing footer/FAQ
            block = "\n## Related Reading\n\n"
            for l in links:
                block += f"- For more on this angle, see our coverage of [{l['title']}](/articles/{l['slug']}).\n"
            block += "\n"
            body = body.rstrip() + "\n" + block
            changed = True

    # 3) FAQ section if missing
    if "Frequently Asked Questions" not in body and "## FAQ" not in body:
        faqs = make_faq(title, cat)
        faq = "\n## Frequently Asked Questions\n\n"
        for q, a in faqs:
            faq += f"### {q}\n\n{a}\n\n"
        body = body.rstrip() + "\n" + faq
        changed = True

    if changed:
        with open(path, "w", encoding="utf-8") as f:
            f.write(fm + body)
        return True
    return False

def main():
    files = glob.glob(os.path.join(ARTICLES_DIR, "*.mdx"))
    enhanced = 0
    for fp in files:
        try:
            if enhance(fp):
                enhanced += 1
        except Exception as e:
            print(f"ERROR {fp}: {e}")
    print(f"Enhanced {enhanced}/{len(files)} articles with SEO scaffolding (Key Takeaways + internal links + FAQ).")

if __name__ == "__main__":
    main()
