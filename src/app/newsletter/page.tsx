import type { Metadata } from "next";
import Link from "next/link";
import { NewsletterForm } from "@/components/blocks/newsletter-form";
import { Icon } from "@/components/ui/icon";

export const metadata: Metadata = {
  title: "Newsletter",
  description:
    "Join developers and technology enthusiasts getting the latest insights, tutorials, and tools from ThinkMode directly in their inbox.",
  alternates: { canonical: "/newsletter" },
};

const PERKS = [
  {
    icon: "zap",
    title: "One email, zero noise",
    body: "A single weekly issue with only the pieces worth your reading time.",
  },
  {
    icon: "users",
    title: "Read by builders",
    body: "Engineers, architects, and founders who ship — not tourists.",
  },
  {
    icon: "shield",
    title: "No spam, ever",
    body: "Your address is used for one thing. Unsubscribe is one click, instant.",
  },
] as const;

export default function NewsletterPage() {
  return (
    <div className="pt-[72px]">
      <section className="relative overflow-hidden" aria-labelledby="newsletter-page-title">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 left-1/2 h-[420px] w-[760px] -translate-x-1/2 rounded-full bg-primary/12 blur-[130px]" />
          <div className="absolute bottom-0 left-1/4 h-[260px] w-[260px] rounded-full bg-cyan/8 blur-[100px]" />
        </div>

        <div className="tm-container relative py-20 md:py-28">
          <div className="mx-auto max-w-2xl text-center">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-primary/30 bg-primary/12 text-primary-light">
              <Icon name="mail" size={26} />
            </span>
            <h1
              id="newsletter-page-title"
              className="mt-7 font-display text-4xl font-extrabold tracking-[-0.025em] text-text md:text-5xl"
            >
              Stay Ahead in Tech
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-text-secondary">
              Join developers and technology enthusiasts getting the latest
              insights, tutorials, and tools directly in their inbox.
            </p>

            <NewsletterForm source="newsletter-page" compact className="mx-auto mt-9 max-w-md" />
            <p className="mt-4 text-xs text-text-tertiary">
              Free forever · unsubscribe anytime
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-4xl gap-4 sm:grid-cols-3">
            {PERKS.map((perk) => (
              <div
                key={perk.title}
                className="rounded-2xl border border-border bg-surface/60 p-6 text-left"
              >
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/12 text-primary-light">
                  <Icon name={perk.icon} size={18} />
                </span>
                <h2 className="mt-4 font-display text-base font-semibold tracking-tight text-text">
                  {perk.title}
                </h2>
                <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">{perk.body}</p>
              </div>
            ))}
          </div>

          <p className="mx-auto mt-14 max-w-md text-sm text-text-tertiary">
            Prefer a feed?{" "}
            <Link href="/rss.xml" className="text-text underline underline-offset-4 hover:text-primary-light">
              Grab the RSS feed
            </Link>{" "}
            instead.
          </p>
        </div>
      </section>
    </div>
  );
}
