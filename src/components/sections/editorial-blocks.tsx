import Link from "next/link";
import { Reveal } from "@/components/ui/reveal";
import { Icon } from "@/components/ui/icon";
import { NewsletterForm } from "@/components/blocks/newsletter-form";

/** Clean newsletter section with subtle gradient background. */
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
      </div>
    </section>
  );
}

/** Minimal about teaser — short description + CTA. */
export function AboutTeaser() {
  return (
    <section className="tm-section" aria-labelledby="about-teaser-heading">
      <div className="tm-container">
        <Reveal>
          <div className="rounded-3xl border border-border bg-surface/50 p-8 md:p-12">
            <div className="mx-auto max-w-2xl text-center">
              <p className="kicker justify-center">About ThinkMode</p>
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
              <Link href="/about" className="btn btn-secondary mt-8">
                Read our story
                <Icon name="arrow-right" size={15} />
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
