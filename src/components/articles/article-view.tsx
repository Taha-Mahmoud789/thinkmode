/* Generated SVG cover — see article-card.tsx note on why <img> is used. */
/* eslint-disable @next/next/no-img-element */
import { MdxContent } from "@/lib/mdx-content";
import type { Article } from "@/types";
import Link from "next/link";
import { BookmarkButton } from "@/components/ui/bookmark-button";
import { ShareButtons } from "@/components/articles/share-buttons";
import { TableOfContents } from "@/components/articles/table-of-contents";
import { AdInArticle } from "@/components/ads/ad-slot";
import { Icon } from "@/components/ui/icon";
import { extractTocFromMdx } from "@/lib/toc";
import { formatDate, formatReadingMinutes, initials } from "@/lib/utils";

interface ArticleViewProps {
  article: Article;
}

/**
 * The premium reading experience: header, hero cover, TOC rail + prose,
 * share/save actions, then footer navigation. Kept deliberately calm.
 */
export function ArticleView({ article }: ArticleViewProps) {
  const toc = extractTocFromMdx(article.content);

  return (
    <article className="relative">
      {/* ---------------------------------- header ---------------------------------- */}
      <header className="relative overflow-hidden border-b border-border">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 left-1/2 h-[380px] w-[720px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />
        </div>
        <div className="tm-container relative pb-12 pt-32 md:pt-40">
          <nav aria-label="Breadcrumb" className="mb-7">
            <ol className="flex flex-wrap items-center gap-2 text-xs text-text-tertiary">
              <li>
                <Link href="/" className="transition-colors hover:text-text">Home</Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/articles" className="transition-colors hover:text-text">Articles</Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link
                  href={`/categories/${article.category.slug}`}
                  className="transition-colors hover:text-text"
                >
                  {article.category.name}
                </Link>
              </li>
            </ol>
          </nav>

          <Link
            href={`/categories/${article.category.slug}`}
            className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider"
            style={{
              backgroundColor: `${article.category.accent}16`,
              color: article.category.accent,
              border: `1px solid ${article.category.accent}44`,
            }}
          >
            {article.category.shortName}
          </Link>

          <h1 className="mt-6 max-w-4xl font-display text-[clamp(2rem,5vw,3.4rem)] font-extrabold leading-[1.08] tracking-[-0.025em] text-text">
            {article.title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-text-secondary">
            {article.description}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-border pt-7">
            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="grid h-11 w-11 place-items-center rounded-full border border-border bg-surface-2 font-display text-sm font-bold text-primary-light"
              >
                {initials(article.author.name)}
              </span>
              <div>
                <p className="text-sm font-semibold text-text">{article.author.name}</p>
                <p className="text-xs text-text-tertiary">{article.author.role}</p>
              </div>
            </div>
            <dl className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-text-secondary">
              <div className="flex items-center gap-2">
                <Icon name="calendar" size={14} className="text-text-tertiary" />
                <dt className="sr-only">Published</dt>
                <dd>
                  <time dateTime={article.date}>{formatDate(article.date)}</time>
                </dd>
              </div>
              {article.updatedAt && article.updatedAt !== article.date ? (
                <div className="flex items-center gap-2">
                  <Icon name="layers" size={14} className="text-text-tertiary" />
                  <dt className="sr-only">Updated</dt>
                  <dd>
                    Updated{" "}
                    <time dateTime={article.updatedAt}>{formatDate(article.updatedAt)}</time>
                  </dd>
                </div>
              ) : null}
              <div className="flex items-center gap-2">
                <Icon name="clock" size={14} className="text-text-tertiary" />
                <dt className="sr-only">Reading time</dt>
                <dd>{formatReadingMinutes(article.readingMinutes)}</dd>
              </div>
            </dl>
            <div className="ml-auto flex items-center gap-2">
              <BookmarkButton slug={article.slug} title={article.title} />
              <ShareButtons title={article.title} slug={article.slug} />
            </div>
          </div>
        </div>
      </header>

      {/* ------------------------------- hero cover ------------------------------- */}
      <div className="tm-container">
        <figure className="-mt-0 pt-10">
          <div className="overflow-hidden rounded-3xl border border-border shadow-card">
            <img
              src={article.cover}
              alt={`Cover artwork for “${article.title}”`}
              width={1200}
              height={720}
              fetchPriority="high"
              decoding="async"
              className="block h-auto w-full"
            />
          </div>
        </figure>
      </div>

      {/* -------------------------------- body grid -------------------------------- */}
      <div className="tm-container grid gap-12 py-14 lg:grid-cols-[240px_minmax(0,1fr)] xl:grid-cols-[260px_minmax(0,760px)_1fr] lg:gap-14">
        <div className="hidden lg:block">
          <div className="sticky top-28">
            <TableOfContents items={toc} />
          </div>
        </div>

        <div>
          {/* mobile TOC */}
          <details className="mb-10 rounded-xl border border-border bg-surface px-5 py-4 lg:hidden">
            <summary className="cursor-pointer text-sm font-semibold text-text">
              Table of contents
            </summary>
            <TableOfContents items={toc} className="mt-4" />
          </details>

          <div className="prose-tm">
            <MdxContent source={article.content} />
          </div>

          <AdInArticle slotId="article-bottom" label="Advertisement" className="mt-16" />

          {/* tags */}
          {article.tags.length > 0 ? (
            <div className="mt-12 flex flex-wrap gap-2 border-t border-border pt-8">
              {article.tags.map((tag) => (
                <Link
                  key={tag.slug}
                  href={`/tags/${tag.slug}`}
                  className="rounded-full border border-border bg-surface px-4 py-1.5 text-sm text-text-secondary transition hover:border-primary/50 hover:text-text"
                >
                  #{tag.name}
                </Link>
              ))}
            </div>
          ) : null}

          {/* author card */}
          <aside className="mt-10 rounded-2xl border border-border bg-surface p-7">
            <div className="flex items-start gap-4">
              <span
                aria-hidden="true"
                className="grid h-14 w-14 shrink-0 place-items-center rounded-full border border-primary/30 bg-primary/10 font-display text-base font-bold text-primary-light"
              >
                {initials(article.author.name)}
              </span>
              <div>
                <p className="font-display text-lg font-semibold tracking-tight text-text">
                  {article.author.name}
                </p>
                <p className="text-xs uppercase tracking-wider text-text-tertiary">
                  {article.author.role}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                  {article.author.bio}
                </p>
                {article.author.links.length > 0 ? (
                  <ul className="mt-4 flex gap-3" aria-label={`${article.author.name}'s links`}>
                    {article.author.links.map((link) => (
                      <li key={link.href + link.label}>
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-medium text-text-secondary underline-offset-4 transition hover:text-text hover:underline"
                        >
                          {link.icon === "github" ? "GitHub" : link.icon === "linkedin" ? "LinkedIn" : "X"}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </div>
          </aside>
        </div>

        <div className="hidden xl:block" aria-hidden="true" />
      </div>
    </article>
  );
}
