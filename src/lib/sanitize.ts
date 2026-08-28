import DOMPurify from "isomorphic-dompurify";

/**
 * Sanitize HTML input to prevent XSS.
 * Allows only safe inline formatting tags.
 */
export function sanitizeHtml(input: string): string {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: ["b", "i", "em", "strong", "code", "a", "p", "br"],
    ALLOWED_ATTR: ["href", "target", "rel"],
    ALLOW_DATA_ATTR: false,
  });
}

/** Strip all HTML tags, return plain text. */
export function stripHtml(input: string): string {
  return DOMPurify.sanitize(input, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
}