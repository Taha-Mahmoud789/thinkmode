import Link from "next/link";
import { Reveal } from "@/components/ui/reveal";
import { Icon } from "@/components/ui/icon";
import type { ArticleMeta } from "@/types";

/** Full-width cinematic banner for the editor's featured story — edge-to-edge like hero. */
export function EditorsPickBanner({ article }: { article: ArticleMeta | null }) {
  if (!article) return null;

  return (
    <section
      className="relative w-full overflow-hidden"
      aria-labelledby="editors-pick-heading"
      style={{
        backgroundImage: 'url("/articles/editors-pick-banner.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Gradient veils to blend image into page background */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent"
      />

      <div className="relative tm-container px-7 py-14 sm:px-12 md:px-16 md:py-20 lg:py-24">
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
            <span className="btn btn-light btn-lg pointer-events-none mt-9 group-hover:shadow-glow-md inline-flex items-center gap-2">
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