/*
 * Covers are deterministic generated SVG routes; raster next/image
 * optimization does not apply, so raw <img> is correct here.
 */
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { Reveal } from "@/components/ui/reveal";
import { AuthorAvatar } from "@/components/ui/author-avatar";
import type { ArticleMeta } from "@/types";
import { formatDate, formatReadingMinutes } from "@/lib/utils";

interface EditorialLeadProps {
  lead: ArticleMeta | null;
  briefs: ArticleMeta[];
}

/**
 * Magazine-style hero: large cover image + bold headline for the lead story,
 * with 2–3 featured stories below in a horizontal row.
 */
export function EditorialLead({ lead, briefs }: EditorialLeadProps) {
  if (!lead) return null;

  return (
    <section
      className="pt-[88px] md:pt-[104px]"
      aria-labelledby="lead-story-title"
    >
      <div className="tm-container">
        {/* ── Lead story ───────────────────────────────────────────── */}
        <Reveal>
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
            {/* Copy — left */}
            <div className="flex flex-col justify-center lg:col-span-5">
              <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-text-tertiary">
                <span
                  className="inline-flex items-center gap-1.5"
                  style={{ color: lead.category.accent }}
                >
                  <span
                    aria-hidden="true"
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: lead.category.accent }}
                  />
                  {lead.category.shortName}
                </span>
                <span aria-hidden="true" className="h-0.5 w-0.5 rounded-full bg-text-tertiary" />
                <time dateTime={lead.date}>{formatDate(lead.date)}</time>
                <span aria-hidden="true" className="h-0.5 w-0.5 rounded-full bg-text-tertiary" />
                <span>{formatReadingMinutes(lead.readingMinutes)}</span>
              </div>

              <h1
                id="lead-story-title"
                className="mt-5 font-display text-3xl font-bold leading-[1.08] tracking-tight text-text sm:text-4xl md:text-5xl lg:text-[3.2rem]"
              >
                <Link
                  href={`/articles/${lead.slug}`}
                  className="rounded-sm transition-colors hover:text-primary-light"
                >
                  {lead.title}
                </Link>
              </h1>

              <p className="mt-5 line-clamp-3 text-base leading-relaxed text-text-secondary md:text-lg">
                {lead.description}
              </p>

              <div className="mt-7 flex items-center gap-3">
                <AuthorAvatar name={lead.author.name} size="sm" />
                <div className="text-sm">
                  <span className="font-medium text-text">{lead.author.name}</span>
                  <span className="text-text-tertiary"> · {lead.author.role}</span>
                </div>
              </div>

              <Link
                href={`/articles/${lead.slug}`}
                className="btn btn-primary mt-8 w-fit"
              >
                Read story
                <Icon name="arrow-right" size={15} />
              </Link>
            </div>

            {/* Cover — right */}
            <div className="lg:col-span-7">
              <Link href={`/articles/${lead.slug}`} className="group block" aria-label={`Read: ${lead.title}`}>
                <div className="overflow-hidden rounded-2xl border border-border">
                  <img
                    src={lead.cover}
                    alt=""
                    loading="eager"
                    fetchPriority="high"
                    decoding="async"
                    width={1200}
                    height={750}
                    className="aspect-[16/10] w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                  />
                </div>
              </Link>
            </div>
          </div>
        </Reveal>

        {/* ── Featured row ─────────────────────────────────────────── */}
        {briefs.length > 0 && (
          <div className="mt-12 border-t border-border pt-10">
            <div className="flex items-baseline justify-between">
              <h2 className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-text-tertiary">
                Featured
              </h2>
              <Link
                href="/articles"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary transition-colors hover:text-text"
              >
                All articles
                <Icon name="arrow-right" size={14} />
              </Link>
            </div>

            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {briefs.map((brief, i) => (
                <Reveal key={brief.slug} delay={i * 80}>
                  <Link
                    href={`/articles/${brief.slug}`}
                    className="group flex gap-4"
                  >
                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-border">
                      <img
                        src={brief.cover}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        width={160}
                        height={160}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p
                        className="text-[11px] font-semibold uppercase tracking-[0.14em]"
                        style={{ color: brief.category.accent }}
                      >
                        {brief.category.shortName}
                      </p>
                      <h3 className="mt-1 line-clamp-2 font-display text-sm font-semibold leading-snug text-text transition-colors group-hover:text-primary-light">
                        {brief.title}
                      </h3>
                      <p className="mt-1.5 text-xs text-text-tertiary">
                        {formatReadingMinutes(brief.readingMinutes)}
                      </p>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
