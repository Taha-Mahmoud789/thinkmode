import Link from "next/link";
import { Reveal } from "@/components/ui/reveal";
import { Icon } from "@/components/ui/icon";
import { NewsletterForm } from "@/components/blocks/newsletter-form";

/** Editorial newsletter — MAGZIN-style subscription prompt. */
export function NewsletterSection() {
  return (
    <section className="tm-section" aria-labelledby="newsletter-heading">
      <div className="tm-container">
        <Reveal>
          <div className="overflow-hidden rounded-2xl border border-border bg-surface">
            <div className="grid gap-8 md:grid-cols-2 md:items-start">
              {/* Left — form */}
              <div className="p-8 md:p-10">
                <p className="kicker">
                  <Icon name="mail" size={14} className="text-primary" />
                  Newsletter
                </p>
                <h2
                  id="newsletter-heading"
                  className="mt-4 font-display text-2xl font-bold tracking-tight text-text md:text-3xl"
                >
                  Subscribe to our newsletter and Stay updated each week
                </h2>
                <NewsletterForm source="homepage" compact className="mt-6" />
              </div>
              {/* Right — decorative */}
              <div className="hidden bg-surface-2 md:block" />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/** Editorial about — magazine masthead style with key facts. */
export function AboutTeaser() {
  return (
    <section className="tm-section" aria-labelledby="about-teaser-heading">
      <div className="tm-container">
        <Reveal>
          <div className="grid gap-10 md:grid-cols-[1fr_auto] md:items-center md:gap-16">
            <div>
              <p className="kicker">
                <Icon name="book-open" size={14} className="text-primary" />
                About
              </p>
              <h2
                id="about-teaser-heading"
                className="mt-4 font-display text-2xl font-bold tracking-tight text-text md:text-3xl"
              >
                ThinkMode
              </h2>
              <p className="mt-4 max-w-lg text-base leading-relaxed text-text-secondary">
                A digital publication for developers, builders, and curious minds
                exploring technology, artificial intelligence, programming, and the
                future of software.
              </p>
              <Link href="/about" className="btn btn-secondary mt-6">
                Our story
                <Icon name="arrow-right" size={15} />
              </Link>
            </div>

            <div className="flex flex-col gap-4 text-center sm:flex-row sm:gap-8 md:flex-col md:gap-4">
              {[
                { label: "Articles", value: "190+" },
                { label: "Topics", value: "19" },
                { label: "Readers", value: "10K+" },
              ].map((stat) => (
                <div key={stat.label} className="min-w-[100px]">
                  <p className="font-display text-2xl font-bold tabular-nums text-primary-light">
                    {stat.value}
                  </p>
                  <p className="mt-0.5 text-xs uppercase tracking-[0.14em] text-text-tertiary">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
