import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { NewsletterForm } from "@/components/blocks/newsletter-form";

export const metadata: Metadata = {
  title: "About",
  description:
    "ThinkMode is a digital publication for developers, builders, and curious minds exploring technology, AI, programming, and the future of software.",
  alternates: { canonical: "/about" },
};

const STATS = [
  { value: "120+", label: "Deep-dive articles" },
  { value: "10", label: "Core topic tracks" },
  { value: "25k", label: "Monthly readers" },
] as const;

const TEAM = [
  {
    name: "Omar Hassan",
    role: "Founder & Editor-in-Chief",
    bio: "Staff engineer turned writer. Fifteen years across distributed systems and ML platforms.",
  },
  {
    name: "Layla Fahmy",
    role: "Senior Editor, AI",
    bio: "ML engineer who has shipped LLM systems to millions of users. Writes the AI Lab column.",
  },
  {
    name: "Youssef Adel",
    role: "Contributing Engineer",
    bio: "Full-stack developer and infrastructure tinkerer focused on developer experience.",
  },
] as const;

export default function AboutPage() {
  return (
    <div className="pt-[72px]">
      {/* hero */}
      <header className="relative overflow-hidden border-b border-border">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 left-1/2 h-[380px] w-[720px] -translate-x-1/2 rounded-full bg-primary/12 blur-[130px]" />
        </div>
        <div className="tm-container relative pb-16 pt-16 text-center md:pt-24">
          <p className="kicker justify-center">About ThinkMode</p>
          <h1 className="mx-auto mt-6 max-w-3xl font-display text-4xl font-extrabold leading-tight tracking-[-0.025em] text-text md:text-5xl">
            A publication for people who{" "}
            <span className="text-gradient">build the future</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-text-secondary">
            ThinkMode is a digital publication for developers, builders, and
            curious minds exploring technology, artificial intelligence,
            programming, and the future of software.
          </p>
          <dl className="mx-auto mt-10 flex max-w-lg items-center justify-center gap-12">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <dd className="font-display text-3xl font-bold tracking-tight text-text">{stat.value}</dd>
                <dt className="mt-1 text-xs uppercase tracking-wider text-text-tertiary">{stat.label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </header>

      {/* mission */}
      <section className="tm-section" aria-labelledby="mission-heading">
        <div className="tm-container grid items-start gap-12 lg:grid-cols-[1fr_360px]">
          <div className="max-w-2xl space-y-6 text-lg leading-relaxed text-text-secondary">
            <h2 id="mission-heading" className="font-display text-2xl font-bold tracking-tight text-text md:text-3xl">
              Why ThinkMode exists
            </h2>
            <p>
              Most technology content optimizes for clicks. Tutorials that
              demo well and collapse in production, hot takes dressed as
              analysis, listicles written by people who have never run the
              thing at 3am. The gap between what gets published and what
              actually works keeps widening.
            </p>
            <p>
              ThinkMode exists inside that gap. Every article is written or
              reviewed by practicing engineers. Every claim is tested against
              real systems. When something is uncertain, we say so — because
              you make decisions on what you read here, and honest uncertainty
              beats confident nonsense.
            </p>
            <p>
              We cover programming languages, artificial intelligence, web
              development, infrastructure, security, and the tools between
              them — with depth over volume, always.
            </p>
          </div>

          {/* principles card */}
          <aside className="rounded-2xl border border-border bg-surface p-7 lg:sticky lg:top-28">
            <h2 className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-text-tertiary">
              What we optimize for
            </h2>
            <ul className="mt-5 space-y-4">
              {[
                ["Depth", "Well-researched technical content"],
                ["Practice", "Real-world implementation guidance"],
                ["Currency", "Content that evolves as tech does"],
                ["Community", "Built for builders and thinkers"],
              ].map(([title, body]) => (
                <li key={title} className="flex gap-3">
                  <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary/15 text-primary-light">
                    <Icon name="check" size={11} strokeWidth={2.5} />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-text">{title}</span>
                    <span className="block text-sm text-text-secondary">{body}</span>
                  </span>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      {/* team */}
      <section className="tm-section border-t border-border" aria-labelledby="team-heading">
        <div className="tm-container">
          <p className="kicker">The people</p>
          <h2 id="team-heading" className="mt-4 font-display text-2xl font-bold tracking-tight text-text md:text-3xl">
            Written by engineers
          </h2>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {TEAM.map((member) => (
              <article key={member.name} className="rounded-2xl border border-border bg-surface p-7">
                <span
                  aria-hidden="true"
                  className="grid h-14 w-14 place-items-center rounded-full border border-primary/30 bg-primary/10 font-display text-base font-bold text-primary-light"
                >
                  {member.name.split(" ").map((part) => part[0]).join("")}
                </span>
                <h3 className="mt-5 font-display text-lg font-semibold tracking-tight text-text">
                  {member.name}
                </h3>
                <p className="text-xs uppercase tracking-wider text-text-tertiary">{member.role}</p>
                <p className="mt-3 text-sm leading-relaxed text-text-secondary">{member.bio}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* cta */}
      <section className="tm-section border-t border-border">
        <div className="tm-container">
          <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-surface to-surface-2 px-7 py-12 text-center md:px-12">
            <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-20 h-[260px] w-[260px] rounded-full bg-primary/15 blur-[90px]" />
            <h2 className="relative font-display text-2xl font-bold tracking-tight text-text md:text-3xl">
              Come build with us
            </h2>
            <p className="relative mx-auto mt-3 max-w-xl leading-relaxed text-text-secondary">
              Get every new deep dive in your inbox, or start with the
              articles readers keep coming back to.
            </p>
            <div className="relative mx-auto mt-8 max-w-md">
              <NewsletterForm source="about-page" compact />
            </div>
            <Link href="/articles" className="btn btn-secondary relative mt-4">
              Browse articles
              <Icon name="arrow-right" size={15} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
