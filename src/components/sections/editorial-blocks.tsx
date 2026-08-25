import Link from "next/link";
import { Reveal } from "@/components/ui/reveal";
import { Icon } from "@/components/ui/icon";
import { NewsletterForm } from "@/components/blocks/newsletter-form";

/** Editorial principles — the content philosophy band. */
const PRINCIPLES = [
  {
    title: "High Quality",
    body: "In-depth and well-researched technical content.",
    icon: "sparkles",
  },
  {
    title: "Practical",
    body: "Real-world examples and useful implementation guidance.",
    icon: "zap",
  },
  {
    title: "Always Updated",
    body: "Technology moves fast, so content should evolve with it.",
    icon: "layers",
  },
  {
    title: "Community First",
    body: "Built for developers, builders, and technology thinkers.",
    icon: "users",
  },
] as const;

export function PrinciplesSection() {
  return (
    <section className="tm-section" aria-labelledby="principles-heading">
      <div className="tm-container">
        <div className="rounded-3xl border border-border bg-surface/50 p-8 md:p-12">
          <div className="max-w-2xl">
            <p className="kicker">How we work</p>
            <h2
              id="principles-heading"
              className="mt-4 font-display text-3xl font-bold tracking-tight text-text md:text-4xl"
            >
              Editorial principles
            </h2>
          </div>
          <div className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {PRINCIPLES.map((principle, index) => (
              <Reveal key={principle.title} delay={index * 80}>
                <div>
                  <span className="grid h-11 w-11 place-items-center rounded-xl border border-border bg-surface-2 text-primary-light">
                    <Icon name={principle.icon} size={20} />
                  </span>
                  <h3 className="mt-5 font-display text-base font-semibold tracking-tight text-text">
                    {principle.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                    {principle.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/** Premium newsletter card — functional form backed by a server action. */
export function NewsletterSection() {
  return (
    <section className="tm-section relative overflow-hidden" aria-labelledby="newsletter-heading">
      <div className="tm-container">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-surface via-surface to-surface-2 p-8 md:p-14">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
            >
              <div className="absolute -right-24 -top-24 h-[320px] w-[320px] rounded-full bg-primary/15 blur-[90px]" />
              <div className="absolute -bottom-32 left-1/4 h-[280px] w-[280px] rounded-full bg-cyan/10 blur-[90px]" />
            </div>

            <div className="relative mx-auto max-w-2xl text-center">
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl border border-primary/30 bg-primary/12 text-primary-light">
                <Icon name="mail" size={22} />
              </span>
              <h2
                id="newsletter-heading"
                className="mt-6 font-display text-3xl font-bold tracking-tight text-text md:text-4xl"
              >
                Stay Ahead in Tech
              </h2>
              <p className="mx-auto mt-4 max-w-xl leading-relaxed text-text-secondary">
                Join developers and technology enthusiasts getting the latest
                insights, tutorials, and tools directly in their inbox.
              </p>
              <NewsletterForm source="homepage" compact className="mx-auto mt-8 max-w-md" />
              <p className="mt-5 text-xs text-text-tertiary">
                No spam, ever. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </Reveal>

        {/* Ad-ready strip below newsletter — inert until configured */}
        <div className="mt-10 flex justify-center">
          <div className="w-full max-w-3xl">
            {/* @see src/components/ads/ad-slot.tsx */}
          </div>
        </div>
      </div>
    </section>
  );
}

export function AboutTeaser() {
  return (
    <section className="tm-section" aria-labelledby="about-teaser-heading">
      <div className="tm-container">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <div>
              <p className="kicker">About ThinkMode</p>
              <h2
                id="about-teaser-heading"
                className="mt-4 font-display text-3xl font-bold tracking-tight text-text md:text-4xl"
              >
                A publication for people who build
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-text-secondary">
                ThinkMode is a digital publication for developers, builders,
                and curious minds exploring technology, artificial
                intelligence, programming, and the future of software.
              </p>
              <ul className="mt-7 space-y-3">
                {[
                  "Deep tutorials written by practicing engineers",
                  "Research breakdowns without the hype",
                  "Tools and workflows worth your time",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-text-secondary">
                    <span className="mt-1 grid h-4.5 w-4.5 shrink-0 place-items-center rounded-full bg-primary/15 text-primary-light">
                      <Icon name="check" size={11} strokeWidth={2.5} />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/about" className="btn btn-secondary mt-9">
                Read our story
                <Icon name="arrow-right" size={15} />
              </Link>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="relative">
              <div className="overflow-hidden rounded-3xl border border-border">
                <svg viewBox="0 0 560 420" role="img" aria-label="Abstract composition of layered editorial panels" className="block h-auto w-full">
                  <defs>
                    <linearGradient id="at-a" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0" stopColor="#181830" />
                      <stop offset="1" stopColor="#0a0a16" />
                    </linearGradient>
                  </defs>
                  <rect width="560" height="420" fill="url(#at-a)" />
                  <circle cx="430" cy="90" r="150" fill="#7c3cff" opacity="0.18" />
                  <circle cx="110" cy="360" r="130" fill="#22d3ee" opacity="0.12" />
                  {[0, 1, 2].map((row) => (
                    <g key={row} transform={`translate(48 ${64 + row * 108})`}>
                      <rect width="464" height="84" rx="14" fill="#ffffff" fillOpacity="0.04" stroke="#ffffff" strokeOpacity="0.09" />
                      <rect x="20" y="20" width="44" height="44" rx="10" fill={row === 0 ? "#7c3cff" : row === 1 ? "#22d3ee" : "#3b82f6"} fillOpacity="0.25" />
                      <rect x="84" y="26" width={200 - row * 40} height="8" rx="4" fill="#ffffff" fillOpacity="0.35" />
                      <rect x="84" y="46" width={260 - row * 30} height="7" rx="3.5" fill="#ffffff" fillOpacity="0.15" />
                    </g>
                  ))}
                </svg>
              </div>
              <div
                aria-hidden="true"
                className="absolute -bottom-5 -left-5 rounded-2xl border border-border bg-background/85 px-6 py-4 shadow-card backdrop-blur"
              >
                <p className="font-display text-2xl font-bold text-text">Est. 2024</p>
                <p className="text-xs uppercase tracking-wider text-text-tertiary">
                  Independent & reader-first
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
