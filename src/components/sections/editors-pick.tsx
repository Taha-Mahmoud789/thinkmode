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
 * Editor's Pick — two-column layout with text left, cover image right.
 * Clean, editorial, no heavy gradients.
 */
export function EditorsPickBanner({ article }: { article: ArticleMeta | null }) {
  if (!article) return null;

  return (
    <section className="tm-section" aria-labelledby="editors-pick-heading">
      <div className="tm-container">
        <Reveal>
          <div className="grid gap-8 md:grid-cols-2 md:gap-12 md:items-center">
            {/* Text — left */}
            <div>
              <p className="kicker text-cyan">
                <Icon name="zap" size={14} className="text-cyan" />
                Editor&apos;s Pick
              </p>
              <h2
                id="editors-pick-heading"
                className="mt-4 font-display text-2xl font-bold leading-tight tracking-tight text-text md:text-3xl lg:text-4xl"
              >
                <Link
                  href={`/articles/${article.slug}`}
                  className="rounded-sm transition-colors hover:text-primary-light"
                >
                  {article.title}
                </Link>
              </h2>
              <p className="mt-4 max-w-lg leading-relaxed text-text-secondary">
                {article.description}
              </p>

              <div className="mt-6 flex items-center gap-3">
                <AuthorAvatar name={article.author.name} size="sm" />
                <div className="text-sm">
                  <span className="font-medium text-text">{article.author.name}</span>
                  <span className="text-text-tertiary"> · {article.author.role}</span>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-text-tertiary">
                <time dateTime={article.date}>{formatDate(article.date)}</time>
                <span aria-hidden="true">·</span>
                <span>{formatReadingMinutes(article.readingMinutes)}</span>
              </div>

              <Link
                href={`/articles/${article.slug}`}
                className="btn btn-primary mt-7"
              >
                Read Full Story
                <Icon name="arrow-right" size={15} />
              </Link>
            </div>

            {/* Cover — right */}
            <Link
              href={`/articles/${article.slug}`}
              className="group block"
              aria-label={`Read: ${article.title}`}
            >
              <div className="overflow-hidden rounded-2xl border border-border">
                <img
                  src={article.cover}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  width={1200}
                  height={750}
                  className="aspect-[16/10] w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                />
              </div>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
