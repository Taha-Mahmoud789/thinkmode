import type { NavigationItem, SocialLink } from "@/types";

export const siteConfig = {
  name: "ThinkMode",
  tagline: "Think. Code. Build the Future.",
  shortDescription:
    "High-quality articles on Programming, AI, and Technology.",
  description:
    "High-quality articles on Programming, AI, and Technology. Deep tutorials, insights, and tools to help you level up and stay ahead of the future.",
  /** Set NEXT_PUBLIC_SITE_URL in production (e.g. https://thinkmode.dev). */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://thinkmode.dev",
  locale: "en_US",
  contactEmail: "hello@thinkmode.dev",

  nav: [
    { label: "Home", href: "/", matchPrefix: "" },
    { label: "Articles", href: "/articles", matchPrefix: "/articles" },
    { label: "Categories", href: "/categories", matchPrefix: "/categories" },
    { label: "AI Lab", href: "/ai-lab", matchPrefix: "/ai-lab" },
    { label: "Tutorials", href: "/tutorials", matchPrefix: "/tutorials" },
    { label: "Newsletter", href: "/newsletter", matchPrefix: "/newsletter" },
    { label: "About", href: "/about", matchPrefix: "/about" },
  ] as NavigationItem[],

  footer: {
    quickLinks: [
      { label: "Home", href: "/" },
      { label: "Articles", href: "/articles" },
      { label: "Categories", href: "/categories" },
      { label: "Tutorials", href: "/tutorials" },
      { label: "AI Lab", href: "/ai-lab" },
      { label: "About", href: "/about" },
    ] as NavigationItem[],
    resources: [
      { label: "Guides", href: "/tutorials" },
      { label: "Tools", href: "/categories/tools-resources" },
      { label: "Newsletter", href: "/newsletter" },
      { label: "RSS", href: "/rss.xml" },
    ] as NavigationItem[],
    legal: [
      { label: "Privacy Policy", href: "/legal/privacy" },
      { label: "Terms of Service", href: "/legal/terms" },
      { label: "Cookie Policy", href: "/legal/cookies" },
    ] as NavigationItem[],
  },

  social: [
    { label: "ThinkMode on X", href: "https://x.com/thinkmode", icon: "x-social" },
    { label: "ThinkMode on GitHub", href: "https://github.com/thinkmode", icon: "github" },
    { label: "ThinkMode on LinkedIn", href: "https://www.linkedin.com/company/thinkmode", icon: "linkedin" },
    { label: "RSS Feed", href: "/rss.xml", icon: "rss" },
  ] as SocialLink[],

  topics: [
    "Programming",
    "Artificial Intelligence",
    "Machine Learning",
    "Web Development",
    "Software Engineering",
    "Developer Tools",
    "Automation",
    "DevOps & Cloud",
    "Cybersecurity",
    "Tutorials",
  ],
} as const;

/**
 * Monetization switches. Ads render NOTHING until an AdSense client id is
 * configured — see src/components/ads/ad-slot.tsx.
 */
export const monetizationConfig = {
  adsenseClientId: process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID ?? "",
} as const;

export type SiteConfig = typeof siteConfig;
