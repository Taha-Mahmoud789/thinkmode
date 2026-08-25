import type { Metadata } from "next";
import { HorizontalArticleCard } from "@/components/articles/article-card";
import { getAllArticles } from "@/lib/articles";

export const metadata: Metadata = {
  title: "Tutorials",
  description:
    "Step-by-step technical guides on Docker, Kubernetes, CI/CD, TypeScript, automation, and the craft of modern software engineering.",
  alternates: { canonical: "/tutorials" },
};

/** Tutorial-track listing: hands-on guides across categories, curated order. */
export default function TutorialsPage() {
  const tutorialSlugs = new Set([
    "docker-for-developers-who-just-want-things-to-work",
    "kubernetes-without-the-tears",
    "ci-cd-pipelines-that-developers-love",
    "typescript-patterns-that-scale",
    "workflow-automation-beyond-cron-jobs",
    "a-complete-guide-to-building-llm-applications",
  ]);

  const tutorials = getAllArticles().filter((article) =>
    tutorialSlugs.has(article.slug),
  );

  return (
    <div className="pt-[72px]">
      <header className="relative overflow-hidden border-b border-border">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -top-28 left-1/2 h-[280px] w-[600px] -translate-x-1/2 rounded-full bg-cyan/8 blur-[110px]" />
        </div>
        <div className="tm-container relative pb-14 pt-16 md:pt-24">
          <p className="kicker">Hands-on</p>
          <h1 className="mt-5 font-display text-4xl font-extrabold tracking-[-0.025em] text-text md:text-5xl">
            Tutorials &amp; Guides
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-text-secondary">
            Step-by-step guides written by engineers who run this tooling in
            production — copy, paste, adapt, ship.
          </p>
        </div>
      </header>

      <section className="tm-section">
        <div className="tm-container space-y-6">
          {tutorials.map((article, index) => (
            <HorizontalArticleCard key={article.slug} article={article} priority={index < 2} />
          ))}
        </div>
      </section>
    </div>
  );
}
