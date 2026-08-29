import { siteConfig } from "@/config/site";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";

/**
 * Hero Banner — MAGZIN-style editorial hero with visual depth
 */
export function HeroBanner() {
  return (
    <section className="relative overflow-hidden py-16 md:py-28">
      {/* Decorative background elements */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -top-32 right-0 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute -bottom-20 left-0 h-[400px] w-[400px] rounded-full bg-accent/5 blur-[100px]" />
      </div>

      <div className="tm-container relative">
        <div className="mx-auto max-w-4xl text-center">
          {/* Kicker */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-text-secondary">
            <Icon name="zap" size={12} className="text-primary" />
            {siteConfig.name}
          </div>

          {/* Main headline */}
          <h1 className="font-display text-[clamp(2.5rem,6vw,4.5rem)] font-extrabold leading-[1.05] tracking-[-0.03em] text-text">
            Your Gateway to{" "}
            <span className="relative">
              <span className="relative z-10 text-primary">{siteConfig.name}</span>
              <span
                className="absolute bottom-1 left-0 right-0 -z-0 h-3 bg-primary/10 md:h-4"
                aria-hidden="true"
              />
            </span>{" "}
            News
          </h1>

          {/* Tagline */}
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-text-secondary md:text-xl">
            {siteConfig.tagline}
          </p>

          {/* CTA buttons */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/articles"
              className="btn btn-primary px-6 py-2.5 text-sm font-semibold"
            >
              Browse Articles
              <Icon name="arrow-right" size={15} />
            </Link>
            <Link
              href="/categories"
              className="btn btn-secondary px-6 py-2.5 text-sm font-semibold"
            >
              Explore Topics
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
