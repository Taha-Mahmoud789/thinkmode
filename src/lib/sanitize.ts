const ALLOWED_TAGS = new Set(["b", "i", "em", "strong", "code", "a", "p", "br"]);
const ALLOWED_ATTRS: Record<string, Set<string>> = {
  a: new Set(["href", "target", "rel"]),
};
const TAG_RE = /<\/?([a-zA-Z][a-zA-Z0-9]*)\b([^>]*)>/g;
const ATTR_RE = /([a-zA-Z\-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|(\S+)))?/g;

function sanitizeAttr(tag: string, attrs: string): string {
  const allowed = ALLOWED_ATTRS[tag];
  if (!allowed) return "";
  ATTR_RE.lastIndex = 0;
  const parts: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = ATTR_RE.exec(attrs))) {
    const name = m[1].toLowerCase();
    if (!allowed.has(name)) continue;
    const raw = m[2] ?? m[3] ?? m[4] ?? "";
    if (name === "href") {
      const lower = raw.toLowerCase();
      if (lower.startsWith("javascript:") || lower.startsWith("data:")) continue;
    }
    parts.push(`${name}="${raw.replace(/"/g, "&quot;")}"`);
  }
  return parts.length ? " " + parts.join(" ") : "";
}

export function sanitizeHtml(input: string): string {
  TAG_RE.lastIndex = 0;
  return input.replace(TAG_RE, (full, tagName: string, rawAttrs: string) => {
    const lower = tagName.toLowerCase();
    if (!ALLOWED_TAGS.has(lower)) return "";
    if (lower === "br" || lower === "img") return `<${lower}${sanitizeAttr(lower, rawAttrs)}>`;
    if (full.startsWith("</")) return `</${lower}>`;
    return `<${lower}${sanitizeAttr(lower, rawAttrs)}>`;
  });
}

export function stripHtml(input: string): string {
  return input.replace(/<[^>]+>/g, "").trim();
}
