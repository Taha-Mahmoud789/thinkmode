import type { Metadata } from "next";
import { HorizontalArticleCard } from "@/components/articles/article-card";
import { getArticlesByCategory } from "@/lib/articles";
import { Icon } from "@/components/ui/icon";
import { Reveal } from "@/components/ui/reveal";

export const metadata: Metadata = {
  title: "AI Lab",
  description:
    "ThinkMode's dedicated track for artificial intelligence — model breakdowns, agent systems, applied LLM engineering, and honest research analysis.",
  alternates: { canonical: "/ai-lab" },
};

const FOCUS_AREAS = [
  {
    icon: "sparkles",
    title: "Applied LLM engineering",
    body: "Retrieval, evals, cost control — building with models in production.",
  },
  {
    icon: "layers",
    title: "Agent systems",
    body: "Tools, memory, planning: architectures that survive real workloads.",
  },
  {
    icon: "book-open",
    title: "Research, translated",
    body: "Papers that matter, explained without the hype or the hand-waving.",
  },
] as const;

export default function AiLabPage() {
  const articles = [
    ...getArticlesByCategory("ai-machine-learning"),
    ...getArticlesByCategory("tools-resources"),
  ].filter(
    (article, index, all) => all.findIndex((a) => a.slug === article.slug) === index,
  );

  return (
    <div className="pt-[72px]">
      <header className="relative overflow-hidden border-b border-border">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 left-1/3 h-[360px] w-[680px] rounded-full bg-primary/14 blur-[130px]" />
          <div className="absolute right-[10%] top-[20%] h-[240px] w-[240px] rounded-full bg-cyan/8 blur-[100px]" />
        </div>
        <div className="tm-container relative pb-16 pt-16 md:pt-24">
          <p
            className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.18em]"
            style={{
              backgroundColor: "rgba(124,60,255,0.12)",
              color: "#9d6cff",
              border: "1px solid rgba(124,60,255,0.35)",
            }}
          >
            <span aria-hidden="true" className="animate-pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-current" />
            ThinkMode AI Lab
          </p>
          <h1 className="mt-6 max-w-3xl font-display text-4xl font-extrabold leading-tight tracking-[-0.025em] text-text md:text-5xl">
            Where artificial intelligence meets{" "}
            <span className="text-gradient">engineering reality</span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-text-secondary">
            Our dedicated AI track: what actually works when models meet
            production constraints — documented honestly, updated as the field
            moves.
          </p>
        </div>
      </header>

      <section className="tm-section" aria-label="AI Lab focus areas">
        <div className="tm-container grid gap-4 md:grid-cols-3">
          {FOCUS_AREAS.map((area, index) => (
            <Reveal key={area.title} delay={index * 80}>
              <div className="h-full rounded-2xl border border-border bg-surface p-7">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/12 text-primary-light">
                  <Icon name={area.icon} size={20} />
                </span>
                <h2 className="mt-5 font-display text-lg font-semibold tracking-tight text-text">
                  {area.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">{area.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="tm-section border-t border-border pt-14" aria-label="AI Lab articles">
        <div className="tm-container">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="kicker">From the lab</p>
              <h2 className="mt-4 font-display text-2xl font-bold tracking-tight text-text md:text-3xl">
                Latest research &amp; engineering notes
              </h2>
            </div>
          </div>
          <div className="space-y-6">
            {articles.map((article, index) => (
              <HorizontalArticleCard key={article.slug} article={article} priority={index < 2} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
