import type { Author } from "@/types";

/**
 * Demo authors. Replace or extend freely — articles reference authors by slug.
 */
export const authors: Author[] = [
  {
    slug: "omar-hassan",
    name: "Omar Hassan",
    role: "Founder & Editor-in-Chief",
    bio: "Staff engineer turned writer. Fifteen years building distributed systems and ML platforms, now translating what actually works into words.",
    links: [
      { label: "Omar Hassan on X", href: "https://x.com/thinkmode", icon: "x-social" },
      { label: "Omar Hassan on GitHub", href: "https://github.com/thinkmode", icon: "github" },
      { label: "Omar Hassan on LinkedIn", href: "https://www.linkedin.com/company/thinkmode", icon: "linkedin" },
    ],
  },
  {
    slug: "layla-fahmy",
    name: "Layla Fahmy",
    role: "Senior Editor, AI",
    bio: "Machine learning engineer who has shipped LLM systems to millions of users. Writes the AI Lab column — research, minus the hype.",
    links: [
      { label: "Layla Fahmy on X", href: "https://x.com/thinkmode", icon: "x-social" },
      { label: "Layla Fahmy on LinkedIn", href: "https://www.linkedin.com/company/thinkmode", icon: "linkedin" },
    ],
  },
  {
    slug: "youssef-adel",
    name: "Youssef Adel",
    role: "Contributing Engineer",
    bio: "Full-stack developer and infrastructure tinkerer. Obsessed with developer experience, edge runtimes, and tools that respect your time.",
    links: [
      { label: "Youssef Adel on GitHub", href: "https://github.com/thinkmode", icon: "github" },
    ],
  },
];

export const authorMap = new Map(authors.map((a) => [a.slug, a]));

const FALLBACK_AUTHOR: Author = {
  slug: "thinkmode-editorial",
  name: "ThinkMode Editorial",
  role: "Editorial Team",
  bio: "The ThinkMode editorial team — engineers and writers covering programming, AI, and the future of software.",
  links: [],
};

export function getAuthor(slug: string): Author {
  return authorMap.get(slug) ?? FALLBACK_AUTHOR;
}

export function getAuthorBySlugOrNull(slug: string): Author | null {
  return authorMap.get(slug) ?? null;
}
