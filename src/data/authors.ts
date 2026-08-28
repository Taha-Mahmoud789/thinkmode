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
  {
    slug: "jay-lyman",
    name: "Jay Lyman",
    role: "Senior Analyst",
    bio: "Covers enterprise software, open source, and the business of technology. Two decades reporting on where the industry actually spends its money.",
    links: [],
  },
  {
    slug: "john-p-mello-jr",
    name: "John P. Mello Jr.",
    role: "Contributing Writer",
    bio: "Technology journalist focused on cybersecurity, privacy, and the messy human side of computing.",
    links: [],
  },
  {
    slug: "kirk-l-kroeker",
    name: "Kirk L. Kroeker",
    role: "Contributing Writer",
    bio: "Writes on emerging technology, research, and the long arc of innovation.",
    links: [],
  },
  {
    slug: "gene-j-koprowski",
    name: "Gene J. Koprowski",
    role: "Contributing Writer",
    bio: "Reports on networking, the smart home, and the consumer edge of enterprise tech.",
    links: [],
  },
  {
    slug: "rob-enderle",
    name: "Rob Enderle",
    role: "Columnist",
    bio: "Technology analyst and columnist covering platforms, strategy, and why products succeed or fail.",
    links: [],
  },
  {
    slug: "jack-m-germain",
    name: "Jack M. Germain",
    role: "Contributing Writer",
    bio: "Covers Linux, desktop computing, and the open-source ecosystem.",
    links: [],
  },
  {
    slug: "brian-r-hook",
    name: "Brian R. Hook",
    role: "Contributing Writer",
    bio: "Writes on software, licensing, and the engineering decisions behind shipping products.",
    links: [],
  },
  {
    slug: "david-halperin",
    name: "David Halperin",
    role: "Contributing Writer",
    bio: "Technology writer covering policy, platforms, and the business of the web.",
    links: [],
  },
  {
    slug: "diane-stresing",
    name: "Diane Stresing",
    role: "Contributing Writer",
    bio: "Covers small business technology, productivity, and the practical side of IT.",
    links: [],
  },
  {
    slug: "paul-korzeniowski",
    name: "Paul Korzeniowski",
    role: "Contributing Writer",
    bio: "Business technology journalist focused on networking, security, and cloud.",
    links: [],
  },
  {
    slug: "mark-n-vena",
    name: "Mark N. Vena",
    role: "Columnist",
    bio: "Consumer tech analyst and columnist covering hardware, smart devices, and market trends.",
    links: [],
  },
  {
    slug: "staff-writer",
    name: "Staff Writer",
    role: "ThinkMode Newsroom",
    bio: "Dispatches from the ThinkMode editorial desk.",
    links: [],
  },
  {
    slug: "willy-chui",
    name: "Willy Chui",
    role: "Contributing Writer",
    bio: "Writes on cloud infrastructure and enterprise platforms.",
    links: [],
  },
  {
    slug: "andre-durand-eric-norlin",
    name: "Andre Durand & Eric Norlin",
    role: "Guest Columnists",
    bio: "Joint commentary on identity, security, and the future of authentication.",
    links: [],
  },
  {
    slug: "david-jones",
    name: "David Jones",
    role: "Contributing Writer",
    bio: "Technology writer covering industry news and analysis.",
    links: [],
  },
  {
    slug: "publisher",
    name: "ThinkMode Publisher",
    role: "Publisher",
    bio: "Editorial and publisher notes from the ThinkMode team.",
    links: [],
  },
  {
    slug: "brett-faulk",
    name: "Brett Faulk",
    role: "Contributing Writer",
    bio: "Writes on technology, culture, and the intersection of the two.",
    links: [],
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
