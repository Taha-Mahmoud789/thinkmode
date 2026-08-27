#!/usr/bin/env python3
"""Fetch real article content from TechNewsWorld URLs and convert to ThinkMode MDX.

Usage:
  python3 scrap_fetch.py --limit 5        # test on first 5
  python3 scrap_fetch.py --limit 190      # all (use with care)
  python3 scrap_fetch.py --slug <slug>    # single article by json filename slug
"""
import json
import re
import sys
import time
import pathlib
from urllib.request import Request, urlopen
from urllib.error import HTTPError, URLError

ROOT = pathlib.Path(r"C:/Users/tabdo/Desktop/TM/thinkmode")
SCRAP_ARTICLES = ROOT / "scrap" / "articles"
OUT = ROOT / "src" / "content" / "articles"

UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36"

def load_urls():
    data = json.load(open(ROOT / "scrap" / "all_urls.json"))
    links = data.get("data", {}).get("links", [])
    return [l["url"] for l in links if l.get("url", "").startswith("https://www.technewsworld.com/story/")]

def fetch(url: str) -> str | None:
    req = Request(url, headers={"User-Agent": UA})
    try:
        with urlopen(req, timeout=20) as r:
            return r.read().decode("utf-8", "ignore")
    except (HTTPError, URLError) as e:
        print(f"  [ERR] {url}: {e}")
        return None

def extract_meta(html: str) -> dict:
    meta = {}
    # title
    m = re.search(r'<meta\s+property="og:title"\s+content="([^"]+)"', html)
    if not m:
        m = re.search(r'<title>([^<]+)</title>', html)
    if m:
        meta["title"] = m.group(1).strip()
    # description
    m = re.search(r'<meta\s+(?:property="og:description"|name="description")\s+content="([^"]+)"', html)
    if m:
        meta["description"] = m.group(1).strip()
    # published time
    m = re.search(r'<meta\s+(?:property="article:published_time"|name="sailthru.date")\s+content="([^"]+)"', html)
    if m:
        meta["date"] = m.group(1).strip()[:10]
    # author
    m = re.search(r'<meta\s+name="sailthru.author"\s+content="([^"]+)"', html)
    if not m:
        m = re.search(r'"author":\s*\{\s*"name":\s*"([^"]+)"', html)
    if m:
        meta["author"] = m.group(1).strip()
    return meta

def extract_body(html: str) -> str:
    # TechNewsWorld article body is in <div class="article-body"> or <article>
    m = re.search(r'<div class="article-body"[^>]*>(.*?)</div>', html, re.DOTALL)
    if not m:
        m = re.search(r'<article[^>]*>(.*?)</article>', html, re.DOTALL)
    if not m:
        return ""
    body = m.group(1)
    # strip scripts/styles
    body = re.sub(r"<script.*?</script>", "", body, flags=re.DOTALL)
    body = re.sub(r"<style.*?</style>", "", body, flags=re.DOTALL)
    # convert <p> to text
    paras = re.findall(r"<p[^>]*>(.*?)</p>", body, re.DOTALL)
    out = []
    for p in paras:
        p = re.sub(r"<[^>]+>", "", p)
        p = p.strip()
        if p and len(p) > 30:
            out.append(p)
    return "\n\n".join(out)

def slug_from_url(url: str) -> str:
    return url.rstrip("/").split("/")[-1].replace(".html", "")

def main():
    args = sys.argv[1:]
    limit = 5
    single = None
    for i, a in enumerate(args):
        if a == "--limit" and i + 1 < len(args):
            limit = int(args[i + 1])
        if a == "--slug" and i + 1 < len(args):
            single = args[i + 1]

    OUT.mkdir(parents=True, exist_ok=True)

    if single:
        urls = [f"https://www.technewsworld.com/story/{single}.html"]
    else:
        urls = load_urls()[:limit]

    print(f"Fetching {len(urls)} articles...")
    for url in urls:
        slug = slug_from_url(url)
        print(f"[fetch] {slug}")
        html = fetch(url)
        if not html:
            continue
        meta = extract_meta(html)
        body = extract_body(html)
        if not body:
            print(f"  [SKIP] no body extracted")
            continue
        # Save raw for inspection
        (OUT / f"_{slug}.raw.txt").write_text(body, encoding="utf-8")
        print(f"  [ok] title={meta.get('title','?')[:60]} | body={len(body)} chars")
        time.sleep(1.5)  # be polite

if __name__ == "__main__":
    main()
