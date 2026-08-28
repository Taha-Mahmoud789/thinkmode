/*
 * Covers are deterministic generated SVG routes; raster next/image
 * optimization does not apply, so raw <img> is correct here.
 */
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import type { ArticleMeta } from "@/types";
import { formatDate, formatReadingMinutes } from "@/lib/utils";

interface EditorialLeadProps {
  lead: ArticleMeta | null;
  briefs: ArticleMeta[];
}

/**
 * Publication front-page: masthead rule, a single large lead story, and two
 * datelined "briefs" under the cover plate. Text-first, hairline separators.
 */
export function EditorialLead({ lead, briefs }: EditorialLeadProps) {
  if (!lead) return null;

  return (
    <section
      className="tm-container pt-[88px] md:pt-[104px]"
      aria-labelledby="lead-story-title"
    >
      {/* masthead rule */}
      <div className="flex items-center justify-between border-b-2 border-text pb-3">
        <p className="kicker m-0">Front Page</p>
        <p className="text-[11px] uppercase tracking-[0.2em] text-text-tertiary">
          Now Reading
        </p>
      </div>

      <div className="grid gap-x-12 gap-y-10 pt-10 lg:grid-cols-12 lg:pt-12">
        {/* ------------------------------ lead copy ------------------------------ */}
        <div className="lg:col-span-7">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-text-tertiary">
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
            <time dateTime={lead.date}>{formatDate(lead.date)}</time>
            <span
              aria-hidden="true"
              className="h-0.5 w-0.5 rounded-full bg-text-tertiary"
            />
            <span>{formatReadingMinutes(lead.readingMinutes)}</span>
          </div>

          <h1
            id="lead-story-title"
            className="mt-5 max-w-3xl font-display text-4xl font-bold leading-[1.05] tracking-tight text-text md:text-5xl lg:text-[3.4rem]"
          >
            <Link
              href={`/articles/${lead.slug}`}
              className="rounded-sm transition-colors hover:text-primary-light"
            >
              {lead.title}
            </Link>
          </h1>

          <p className="mt-6 line-clamp-3 max-w-2xl text-base leading-relaxed text-text-secondary md:text-lg">
            {lead.description}
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-x-3 gap-y-4 border-t border-border pt-5 text-sm text-text-tertiary">
            <span className="font-medium text-text">{lead.author.name}</span>
            <span
              aria-hidden="true"
              className="h-0.5 w-0.5 rounded-full bg-text-tertiary"
            />
            <span>{lead.author.role}</span>
            <Link
              href={`/articles/${lead.slug}`}
              className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors hover:border-primary/40 hover:text-primary-light"
            >
              Read story
              <Icon name="arrow-right" size={14} />
            </Link>
          </div>
        </div>

        {/* --------------------------- cover + briefs ---------------------------- */}
        <div className="lg:col-span-5">
          <Link href={`/articles/${lead.slug}`} className="group block">
            <div className="overflow-hidden border border-border bg-surface">
              <img
                src={lead.cover}
                alt=""
                loading="eager"
                decoding="async"
                width={1200}
                height={750}
                className="aspect-[16/10] w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
              />
            </div>
            <div className="flex items-center justify-between border border-t-0 border-border px-4 py-2.5 text-[11px] uppercase tracking-[0.16em] text-text-tertiary">
              <span style={{ color: lead.category.accent }}>
                {lead.category.name}
              </span>
              <time dateTime={lead.date}>{formatDate(lead.date)}</time>
            </div>
          </Link>

          <ul className="mt-8 divide-y divide-border">
            {briefs.map((brief) => (
              <li key={brief.slug}>
                <Link
                  href={`/articles/${brief.slug}`}
                  className="group flex items-start gap-5 py-4"
                >
                  <time
                    dateTime={brief.date}
                    className="w-20 shrink-0 pt-0.5 text-xs tabular-nums leading-6 text-text-tertiary"
                  >
                    {formatDate(brief.date)}
                  </time>
                  <div className="min-w-0">
                    <h3 className="line-clamp-2 font-display text-base font-semibold leading-snug text-text transition-colors group-hover:text-primary-light">
                      {brief.title}
                    </h3>
                    <p className="mt-1 line-clamp-1 text-sm text-text-secondary">
                      {brief.description}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}