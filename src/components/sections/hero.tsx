import Link from "next/link";
import fs from "node:fs";
import path from "node:path";
import { Icon } from "@/components/ui/icon";
import type { ArticleMeta } from "@/types";
import { formatDate } from "@/lib/utils";

/** Real ChatGPT-generated full-bleed hero backdrop. */
function hasWideHero(): boolean {
  try {
    return fs.existsSync(path.join(process.cwd(), "public", "images", "hero-wide.jpg"));
  } catch {
    return false;
  }
}

interface HeroProps {
  featuredArticle: ArticleMeta | null;
}

/**
 * Cinematic full-bleed hero (Linear/Apple-style):
 * generated artwork spans the whole band, subject sits on the right,
 * typography floats on the artwork's clean left negative space.
 * No boxed image, no overlay card collision.
 */
export function Hero({ featuredArticle }: HeroProps) {
  const wideHero = hasWideHero();

  return (
    <section
      className="relative overflow-hidden pt-[72px]"
      aria-labelledby="hero-title"
    >
      {/* ------------------------- cinematic backdrop ------------------------- */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {wideHero ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/hero-wide.jpg"
              alt=""
              fetchPriority="high"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover object-[70%_center] md:object-center"
            />
            {/* readability veil over the text zone + edge blending */}
            <div className="absolute inset-0 bg-[linear-gradient(90deg,var(--background)_0%,color-mix(in_srgb,var(--background)_82%,transparent)_38%,transparent_72%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,color-mix(in_srgb,var(--background)_55%,transparent)_0%,transparent_22%,transparent_78%,var(--background)_100%)]" />
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-grid mask-fade-y opacity-60" />
            <div className="absolute -top-40 left-1/2 h-[560px] w-[900px] -translate-x-1/2 rounded-full bg-primary/12 blur-[140px]" />
          </>
        )}
      </div>

      {/* -------------------------------- content -------------------------------- */}
      <div className="tm-container relative">
        <div className="grid min-h-[calc(100svh-180px)] items-center gap-10 py-20 md:py-28 lg:min-h-[640px]">
          <div className="max-w-xl">
            <p className="kicker">Technology · AI · Engineering</p>
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
        </div>
      </div>

      {/* --------------------- featured article strip --------------------- */}
      {featuredArticle ? (
        <div className="relative border-t border-border bg-background/60 backdrop-blur-md">
          <div className="tm-container">
            <Link
              href={`/articles/${featuredArticle.slug}`}
              className="group flex items-center gap-4 py-4 sm:gap-6"
            >
              <span className="flex shrink-0 items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan">
                <span
                  aria-hidden="true"
                  className="animate-pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-cyan"
                />
                Latest insight
              </span>
              <span className="hidden h-4 w-px shrink-0 bg-border sm:block" aria-hidden="true" />
              <span className="min-w-0 flex-1 truncate font-display text-sm font-semibold text-text transition-colors group-hover:text-primary-light sm:text-base">
                {featuredArticle.title}
              </span>
              <span className="hidden shrink-0 items-center gap-3 text-xs text-text-tertiary md:flex">
                <time dateTime={featuredArticle.date}>
                  {formatDate(featuredArticle.date, "medium")}
                </time>
                <span aria-hidden="true">·</span>
                <span>{featuredArticle.readingMinutes} min</span>
              </span>
              <span
                aria-hidden="true"
                className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary text-white transition-transform duration-300 group-hover:translate-x-1"
              >
                <Icon name="arrow-right" size={14} />
              </span>
            </Link>
          </div>
        </div>
      ) : null}
    </section>
  );
}
