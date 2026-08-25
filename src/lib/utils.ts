import { siteConfig } from "@/config/site";

type ClassValue = string | false | null | undefined;

export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(" ");
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function tagSlug(name: string): string {
  return slugify(name);
}

export function formatDate(
  iso: string,
  style: "long" | "medium" = "long",
): string {
  const date = new Date(iso);
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    year: "numeric",
    month: style === "long" ? "long" : "short",
    day: "numeric",
  }).format(date);
}

export function formatReadingMinutes(minutes: number): string {
  return `${minutes} min read`;
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 1).trimEnd()}…`;
}

export function isValidEmail(email: string): boolean {
  // Pragmatic RFC-5322-ish validation — good enough for subscription forms.
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

export function absoluteUrl(path: string): string {
  return new URL(path, siteConfig.url).toString();
}

/** Inline-style helper so category accents flow through CSS custom props. */
export function accentStyle(accentHex: string): Record<string, string> {
  return { "--accent": accentHex };
}

export function seededIndex(seed: string, modulus: number): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return hash % modulus;
}
