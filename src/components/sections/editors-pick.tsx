/* Generated SVG cover backdrop — <img> intentional (vector asset). */
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { Reveal } from "@/components/ui/reveal";
import { Icon } from "@/components/ui/icon";
import type { ArticleMeta } from "@/types";

/** Full-width cinematic banner for the editor's featured story. */
export function EditorsPickBanner({ article }: { article: ArticleMeta | null }) {
  if (!article) return null;

  return (
    <section className="tm-section" aria-labelledby="editors-pick-heading">
      <div className="tm-container">
        <Reveal>
          <Link
            href={`/articles/${article.slug}`}
            className="group relative block overflow-hidden rounded-3xl border border-border"
          >
            {/* generative cover as the cinematic backdrop */}
            <img
              src={article.cover}
              alt=""
              loading="lazy"
              decoding="async"
              width={1200}
              height={675}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            />
            {/* readability + brand gradient overlays */}
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-transparent"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent"
            />

            <div className="relative px-7 py-14 sm:px-12 md:px-16 md:py-20 lg:py-24">
              <p className="kicker text-cyan">Editor&apos;s Pick</p>
              <h2
                id="editors-pick-heading"
                className="mt-5 max-w-2xl font-display text-3xl font-bold leading-tight tracking-tight text-text md:text-4xl lg:text-5xl"
              >
                {article.title}
              </h2>
              <p className="mt-5 max-w-xl leading-relaxed text-text-secondary">
                {article.description}
              </p>
              <p className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-text-tertiary">
                <span>{article.author.name}</span>
                <span aria-hidden="true">·</span>
                <time dateTime={article.date}>
                  {new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(article.date))}
                </time>
                <span aria-hidden="true">·</span>
                <span>{article.readingMinutes} min read</span>
              </p>
              <span className="btn btn-light btn-lg pointer-events-none mt-9 group-hover:shadow-glow-md">
                Read Full Story
                <Icon
                  name="arrow-right"
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </span>
            </div>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
