import type { Category } from "@/types";

/** Editorial categories. Accent hex feeds tints/gradients via --accent. */
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
];

export const categoryMap = new Map(categories.map((c) => [c.slug, c]));

export const UNCATEGORIZED: Category = {
  slug: "general",
  name: "General",
  shortName: "General",
  description: "General technology writing.",
  icon: "layers",
  accent: "#94a3b8",
};

export function getCategory(slug: string): Category {
  return categoryMap.get(slug) ?? UNCATEGORIZED;
}
