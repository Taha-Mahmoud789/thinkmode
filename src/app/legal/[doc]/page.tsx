import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/site";

interface LegalPageProps {
  params?: Promise<{ doc?: string }>;
}

const DOCS: Record<string, { title: string; updated: string; sections: { heading: string; body: string[] }[] }> = {
  privacy: {
    title: "Privacy Policy",
    updated: "August 1, 2026",
    sections: [
      {
        heading: "What we collect",
        body: [
          `ThinkMode collects the minimum data needed to operate: your email address if you subscribe to the newsletter, and privacy-respecting analytics about page views (aggregated, no cross-site tracking).`,
          "If you contact us through the contact form, we keep your message and email so we can reply.",
        ],
      },
      {
        heading: "What we never do",
        body: [
          "We do not sell personal data. We do not run third-party ad trackers before ads are configured, and when advertising is enabled it will be disclosed here with its own controls. We do not build behavioral profiles of readers.",
        ],
      },
      {
        heading: "Cookies",
        body: [
          "Essential cookies store only your theme preference (dark/light) and saved-bookmarks list in your own browser's local storage — never on our servers.",
        ],
      },
      {
        heading: "Your rights",
        body: [
          `You can unsubscribe from the newsletter at any time via the link in every issue, and request deletion of any personal data by writing to ${siteConfig.contactEmail}. We respond within 30 days.`,
        ],
      },
    ],
  },
  terms: {
    title: "Terms of Service",
    updated: "August 1, 2026",
    sections: [
      {
        heading: "Using ThinkMode",
        body: [
          "ThinkMode provides editorial content free of charge for personal, non-commercial reading. You may share links freely; you may not republish full articles without written permission.",
        ],
      },
      {
        heading: "Content accuracy",
        body: [
          "Technical content is provided in good faith and reviewed by practicing engineers, but software changes fast: verify critical steps against current documentation before applying them in production systems.",
          "Code samples are licensed under CC0 — use them anywhere, no attribution required.",
        ],
      },
      {
        heading: "Liability",
        body: [
          "Content is provided 'as is' without warranties. To the maximum extent permitted by law, ThinkMode is not liable for damages arising from use of published information or code.",
        ],
      },
    ],
  },
  cookies: {
    title: "Cookie Policy",
    updated: "August 1, 2026",
    sections: [
      {
        heading: "What we set",
        body: [
          "ThinkMode itself sets no tracking cookies. Your theme choice and saved articles are stored locally in your browser (localStorage), never transmitted to us.",
        ],
      },
      {
        heading: "Third parties",
        body: [
          "Embedded YouTube videos load from youtube-nocookie.com only after you interact with them. When advertising is later enabled, its providers may set their own cookies under their policies — this page will be updated with opt-out details before that happens.",
        ],
      },
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(DOCS).map((doc) => ({ doc }));
}

export async function generateMetadata({ params }: LegalPageProps): Promise<Metadata> {
  const resolved = await params;
  const key = resolved?.doc ?? "";
  const doc = DOCS[key];
  if (!doc) return { title: "Not found" };
  return {
    title: doc.title,
    description: `${doc.title} for ${siteConfig.name}.`,
    alternates: { canonical: `/${key}` },
  };
}

export default async function LegalPage({ params }: LegalPageProps) {
  const resolved = await params;
  const doc = DOCS[resolved?.doc ?? ""];
  if (!doc) {
    return (
      <div className="tm-container pt-[72px] pb-24 text-center">
        <p className="text-text-secondary">This document does not exist.</p>
        <Link href="/" className="btn btn-primary mt-6">Back home</Link>
      </div>
    );
  }

  return (
    <div className="pt-[72px]">
      <div className="tm-container max-w-3xl py-16 md:py-24">
        <p className="kicker">Legal</p>
        <h1 className="mt-5 font-display text-4xl font-extrabold tracking-tight text-text">
          {doc.title}
        </h1>
        <p className="mt-3 text-sm text-text-tertiary">Last updated: {doc.updated}</p>

        <div className="mt-12 space-y-10">
          {doc.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="font-display text-xl font-semibold tracking-tight text-text">
                {section.heading}
              </h2>
              <div className="mt-3 space-y-3">
                {section.body.map((paragraph) => (
                  <p key={paragraph.slice(0, 40)} className="leading-relaxed text-text-secondary">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
