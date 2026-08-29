/*
 * Covers are deterministic generated SVG routes; raster next/image
 * optimization does not apply, so raw <img> is correct here.
 */
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { Reveal } from "@/components/ui/reveal";
import { Icon } from "@/components/ui/icon";
import { AuthorAvatar } from "@/components/ui/author-avatar";
import type { ArticleMeta } from "@/types";
import { formatDate, formatReadingMinutes } from "@/lib/utils";

/**
 * Full-width cinematic banner for the editor's pick — uses the article's
 * actual cover as background with gradient overlays for text readability.
 */
export function EditorsPickBanner({ article }: { article: ArticleMeta | null }) {
  if (!article) return null;

  return (
    <section
      className="relative w-full overflow-hidden"
      aria-labelledby="editors-pick-heading"
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={article.cover}
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          width={1920}
          height={800}
          className="h-full w-full object-cover"
        />
        {/* Gradient veils */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/30" />
      </div>

      <div className="relative tm-container px-7 py-16 sm:px-12 md:px-16 md:py-24 lg:py-28">
        <Reveal>
          <Link
            href={`/articles/${article.slug}`}
            className="group block max-w-2xl"
          >
            <p className="kicker text-cyan">Editor&apos;s Pick</p>
            <h2
              id="editors-pick-heading"
              className="mt-5 font-display text-3xl font-bold leading-tight tracking-tight text-text md:text-4xl lg:text-5xl"
            >
              {article.title}
            </h2>
            <p className="mt-5 max-w-xl leading-relaxed text-text-secondary md:text-lg">
              {article.description}
            </p>

            <div className="mt-8 flex items-center gap-3">
              <AuthorAvatar name={article.author.name} size="sm" />
              <div className="text-sm">
                <span className="font-medium text-text">{article.author.name}</span>
                <span className="text-text-tertiary"> · {article.author.role}</span>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-text-tertiary">
              <time dateTime={article.date}>{formatDate(article.date)}</time>
              <span aria-hidden="true">·</span>
              <span>{formatReadingMinutes(article.readingMinutes)}</span>
            </div>

            <span className="btn btn-primary btn-lg pointer-events-none mt-9 group-hover:shadow-glow-md inline-flex items-center gap-2">
              Read Full Story
              <Icon
                name="arrow-right"
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
