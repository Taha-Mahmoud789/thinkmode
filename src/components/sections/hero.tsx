import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { HeroVisual } from "@/components/sections/hero-visual";
import type { ArticleMeta } from "@/types";
import { formatDate } from "@/lib/utils";

interface HeroProps {
  featuredArticle: ArticleMeta | null;
}

export function Hero({ featuredArticle }: HeroProps) {
  return (
    <section className="relative overflow-hidden pt-[72px]" aria-labelledby="hero-title">
      {/* ambient background */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-grid mask-fade-y opacity-60" />
        <div className="absolute -top-40 left-1/2 h-[560px] w-[900px] -translate-x-1/2 rounded-full bg-primary/12 blur-[140px]" />
        <div className="absolute right-[8%] top-[30%] h-[300px] w-[300px] rounded-full bg-cyan/8 blur-[100px]" />
      </div>

      <div className="tm-container relative">
        <div className="grid items-center gap-14 py-16 md:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
          {/* ---------------------------------- copy ---------------------------------- */}
          <div className="max-w-xl">
            <p className="kicker">
              Technology · AI · Engineering
            </p>
            <h1
              id="hero-title"
              className="mt-6 font-display text-[clamp(2.9rem,7vw,4.75rem)] font-extrabold leading-[1.02] tracking-[-0.03em] text-text"
            >
              Think.
              <br />
              Code.
              <br />
              Build the <span className="text-gradient">Future.</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-text-secondary">
              High-quality articles on Programming, AI, and Technology. Deep
              tutorials, insights, and tools to help you level up and stay
              ahead of the future.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link href="/articles" className="btn btn-primary btn-lg group">
                Explore Articles
                <Icon
                  name="arrow-right"
                  size={17}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </Link>
              <Link href="/categories" className="btn btn-secondary btn-lg">
                Browse Topics
              </Link>
            </div>

            <dl className="mt-12 flex items-center gap-10 border-t border-border pt-8">
              <div>
                <dt className="sr-only">Published articles</dt>
                <dd className="font-display text-2xl font-bold tracking-tight text-text">120+</dd>
                <dd className="mt-0.5 text-xs uppercase tracking-wider text-text-tertiary">
                  In-depth articles
                </dd>
              </div>
              <div>
                <dt className="sr-only">Topics covered</dt>
                <dd className="font-display text-2xl font-bold tracking-tight text-text">10</dd>
                <dd className="mt-0.5 text-xs uppercase tracking-wider text-text-tertiary">
                  Core topics
                </dd>
              </div>
              <div>
                <dt className="sr-only">Reading community</dt>
                <dd className="font-display text-2xl font-bold tracking-tight text-text">25k</dd>
                <dd className="mt-0.5 text-xs uppercase tracking-wider text-text-tertiary">
                  Monthly readers
                </dd>
              </div>
            </dl>
          </div>

          {/* --------------------------------- visual --------------------------------- */}
          <div className="relative mx-auto w-full max-w-[560px] lg:max-w-none">
            <HeroVisual />

            {featuredArticle ? (
              <Link
                href={`/articles/${featuredArticle.slug}`}
                className="group absolute inset-x-4 bottom-4 block rounded-2xl border border-border bg-background/80 p-5 shadow-glow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-border-strong sm:inset-x-6 sm:bottom-6 sm:p-6 lg:right-auto lg:left-6 lg:w-[380px]"
              >
                <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan">
                  <span aria-hidden="true" className="animate-pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-cyan" />
                  Latest insight
                </p>
                <h2 className="mt-3 font-display text-base font-semibold leading-snug tracking-tight text-text transition-colors group-hover:text-primary-light sm:text-lg">
                  {featuredArticle.title}
                </h2>
                <p className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-text-tertiary">
                  <span>{featuredArticle.category.shortName}</span>
                  <span aria-hidden="true">·</span>
                  <time dateTime={featuredArticle.date}>
                    {formatDate(featuredArticle.date, "medium")}
                  </time>
                  <span aria-hidden="true">·</span>
                  <span>{featuredArticle.readingMinutes} min read</span>
                  <span
                    aria-hidden="true"
                    className="ml-auto grid h-8 w-8 place-items-center rounded-full bg-primary text-white transition-transform duration-300 group-hover:translate-x-1"
                  >
                    <Icon name="arrow-right" size={14} />
                  </span>
                </p>
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
