import type { Category } from "@/types";

/**
 * Editorial categories. Accent hex feeds tints/gradients via --accent.
 * The first six are the site's original pillars; the rest map the
 * imported ThinkMode archive (190 articles) so every piece lands in place.
 */
export const categories: Category[] = [
  {
    slug: "ai-machine-learning",
    name: "AI & Machine Learning",
    shortName: "AI / ML",
    description:
      "Foundations, research breakdowns, and applied machine learning — from transformers to agents.",
    icon: "sparkles",
    accent: "#a78bfa",
  },
  {
    slug: "web-development",
    name: "Web Development",
    shortName: "Web Dev",
    description:
      "Modern frameworks, rendering strategies, and the craft of building for the web platform.",
    icon: "globe",
    accent: "#22d3ee",
  },
  {
    slug: "programming",
    name: "Programming",
    shortName: "Programming",
    description:
      "Languages, paradigms, and the engineering judgment behind writing better software.",
    icon: "code",
    accent: "#60a5fa",
  },
  {
    slug: "devops-cloud",
    name: "DevOps & Cloud",
    shortName: "DevOps",
    description:
      "Infrastructure as code, containers, CI/CD, and running reliable systems at scale.",
    icon: "cloud",
    accent: "#34d399",
  },
  {
    slug: "cybersecurity",
    name: "Cybersecurity",
    shortName: "Security",
    description:
      "Threat models, secure defaults, and the practice of defending modern software.",
    icon: "shield",
    accent: "#fb7185",
  },
  {
    slug: "tools-resources",
    name: "Tools & Resources",
    shortName: "Tools",
    description:
      "The editors, utilities, and workflows worth adopting — reviewed and compared.",
    icon: "tool",
    accent: "#fbbf24",
  },
  {
    slug: "computing",
    name: "Computing",
    shortName: "Computing",
    description:
      "Processors, platforms, and the raw machinery that runs modern software.",
    icon: "cpu",
    accent: "#60a5fa",
  },
  {
    slug: "hardware",
    name: "Hardware",
    shortName: "Hardware",
    description:
      "Devices, silicon, and the physical layer of consumer and enterprise tech.",
    icon: "chip",
    accent: "#fbbf24",
  },
  {
    slug: "technology",
    name: "Technology",
    shortName: "Tech",
    description:
      "The broader arc of technology — trends, policy, and where the industry is heading.",
    icon: "layers",
    accent: "#94a3b8",
  },
  {
    slug: "applications",
    name: "Applications",
    shortName: "Apps",
    description:
      "Software people actually use — productivity, creativity, and the apps that ship.",
    icon: "app",
    accent: "#22d3ee",
  },
  {
    slug: "artificial-intelligence",
    name: "Artificial Intelligence",
    shortName: "AI",
    description:
      "Machine intelligence, models, and the systems reshaping how software thinks.",
    icon: "sparkles",
    accent: "#a78bfa",
  },
  {
    slug: "emerging-tech",
    name: "Emerging Tech",
    shortName: "Emerging",
    description: "Early-stage technology with the potential to redefine markets.",
    icon: "zap",
    accent: "#17B890",
  },
  {
    slug: "smartphones",
    name: "Smartphones",
    shortName: "Phones",
    description:
      "Mobile platforms, flagships, and the devices in our pockets.",
    icon: "phone",
    accent: "#22d3ee",
  },
  {
    slug: "reviews",
    name: "Reviews",
    shortName: "Reviews",
    description:
      "Hands-on verdicts on hardware and software we've actually tested.",
    icon: "check",
    accent: "#fbbf24",
  },
  {
    slug: "it-leadership",
    name: "IT Leadership",
    shortName: "IT Lead",
    description:
      "Strategy, org, and the decisions that shape technology teams.",
    icon: "users",
    accent: "#60a5fa",
  },
  {
    slug: "privacy",
    name: "Privacy",
    shortName: "Privacy",
    description:
      "Data rights, surveillance, and the line between convenience and exposure.",
    icon: "lock",
    accent: "#fb7185",
  },
  {
    slug: "data-management",
    name: "Data Management",
    shortName: "Data",
    description:
      "Storage, pipelines, and the discipline of keeping data correct and available.",
    icon: "database",
    accent: "#34d399",
  },
  {
    slug: "transportation",
    name: "Transportation",
    shortName: "Transport",
    description:
      "Mobility, autonomy, and the systems moving people and goods.",
    icon: "car",
    accent: "#94a3b8",
  },
  {
    slug: "wearable-tech",
    name: "Wearable Tech",
    shortName: "Wearables",
    description:
      "Devices on the body — health, fitness, and ambient computing.",
    icon: "watch",
    accent: "#a78bfa",
  },
];

export const categoryMap = new Map(categories.map((c) => [c.slug, c]));

// Legacy slugs consolidated into cybersecurity — kept for backward compatibility (old URLs, bookmarks)
const LEGACY_CATEGORY_ALIAS: Record<string, string> = {
  security: "cybersecurity",
  "cybersecurity-archive": "cybersecurity",
};

export const UNCATEGORIZED: Category = {
  slug: "general",
  name: "General",
  shortName: "General",
  description: "General technology writing.",
  icon: "layers",
  accent: "#94a3b8",
};

export function getCategory(slug: string): Category {
  if (LEGACY_CATEGORY_ALIAS[slug]) {
    return categoryMap.get(LEGACY_CATEGORY_ALIAS[slug]) ?? UNCATEGORIZED;
  }
  return categoryMap.get(slug) ?? UNCATEGORIZED;
}
