/* Generated SVG cover thumbnails — <img> intentional (vector assets). */
/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useDeferredValue, useMemo, useState } from "react";
import { Icon } from "@/components/ui/icon";
import type { ArticleMeta } from "@/types";
import { formatDate, formatReadingMinutes } from "@/lib/utils";

interface SearchInterfaceProps {
  /** Full article metadata — filtering happens locally, zero network calls. */
  articles: ArticleMeta[];
  initialQuery?: string;
}

function score(article: ArticleMeta, tokens: string[]): number {
  let total = 0;
  for (const token of tokens) {
    let tokenScore = 0;
    if (article.title.toLowerCase().includes(token)) tokenScore += 10;
    if (article.description.toLowerCase().includes(token)) tokenScore += 3;
    if (article.category.name.toLowerCase().includes(token)) tokenScore += 4;
    if (
      article.tags.some(
        (tag) =>
          tag.name.toLowerCase().includes(token) || tag.slug.includes(token),
      )
    )
      tokenScore += 4;
    if (tokenScore === 0) return 0; // AND semantics
    total += tokenScore;
  }
  return total;
}

/**
 * Instant client-side search. The full metadata set ships once with the page
 * (~a few KB per article); every keystroke filters in-memory with no latency.
 */
export function SearchInterface({ articles, initialQuery = "" }: SearchInterfaceProps) {
  const [query, setQuery] = useState(initialQuery);
  const deferredQuery = useDeferredValue(query);
  const [submittedQuery, setSubmittedQuery] = useState(initialQuery);

  const results = useMemo(() => {
    const tokens = deferredQuery
      .toLowerCase()
      .split(/[^\p{L}\p{N}+#.]+/u)
      .filter((t) => t.length > 0);
    if (tokens.length === 0) return [];
    return articles
      .map((article) => ({ article, score: score(article, tokens) }))
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((entry) => entry.article);
  }, [articles, deferredQuery]);

  const trimmed = query.trim();

  return (
    <div>
      {/* input */}
      <form
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
          setSubmittedQuery(trimmed);
          window.history.replaceState(null, "", trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : "/search");
        }}
        className="relative"
      >
        <label htmlFor="search-input" className="sr-only">
          Search articles
        </label>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-text-tertiary"
        >
          <Icon name="search" size={18} />
        </span>
        <input
          id="search-input"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Try “AI agents”, “Next.js”, “Docker”…"
          autoComplete="off"
          autoFocus
          className="h-14 w-full rounded-full border border-border bg-surface pl-13 pr-14 text-base text-text placeholder:text-text-tertiary outline-none transition focus:border-primary/60"
          style={{ paddingLeft: "3.25rem" }}
        />
        {query ? (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setSubmittedQuery("");
              window.history.replaceState(null, "", "/search");
            }}
            aria-label="Clear search"
            className="absolute right-4 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-text-tertiary transition hover:bg-surface-2 hover:text-text"
          >
            <Icon name="close" size={15} />
          </button>
        ) : null}
      </form>

      {/* status line */}
      <div aria-live="polite" className="mt-6">
        {trimmed === "" ? (
          <p className="text-sm text-text-tertiary">
            Type to search — results appear instantly.
          </p>
        ) : (
          <p className="text-sm text-text-secondary">
            <span className="font-semibold text-text">{results.length}</span>{" "}
            {results.length === 1 ? "result" : "results"} for{" "}
            <span className="font-semibold text-text">“{submittedQuery.trim() || trimmed}”</span>
          </p>
        )}
      </div>

      {/* results / empty states */}
      {trimmed === "" ? (
        <div className="mt-10 rounded-2xl border border-dashed border-border p-10 text-center">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-surface-2 text-text-tertiary">
            <Icon name="search" size={22} />
          </span>
          <h2 className="mt-5 font-display text-lg font-semibold text-text">
            Search everything we have published
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-text-secondary">
            Titles, summaries, categories, and topics are all searched. Try a
            technology, a concept, or a tag.
          </p>
        </div>
      ) : results.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-border p-10 text-center">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-surface-2 text-text-tertiary">
            <Icon name="info" size={22} />
          </span>
          <h2 className="mt-5 font-display text-lg font-semibold text-text">
            No results for “{trimmed}”
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-text-secondary">
            Check the spelling, try broader terms, or browse everything by
            topic instead.
          </p>
          <Link href="/categories" className="btn btn-secondary btn-sm mt-6">
            Browse categories
          </Link>
        </div>
      ) : (
        <ul className="mt-8 divide-y divide-border border-y border-border">
          {results.map((article) => (
            <li key={article.slug}>
              <Link
                href={`/articles/${article.slug}`}
                className="group flex items-center gap-4 py-5 transition-colors"
              >
                <img
                  src={article.cover}
                  alt=""
                  loading="lazy"
                  width={96}
                  height={96}
                  className="hidden h-16 w-16 shrink-0 rounded-xl border border-border object-cover sm:block"
                />
                <div className="min-w-0 flex-1">
                  <p
                    className="text-[11px] font-semibold uppercase tracking-wider"
                    style={{ color: article.category.accent }}
                  >
                    {article.category.shortName}
                  </p>
                  <h3 className="mt-1 line-clamp-1 font-display text-base font-semibold text-text transition-colors group-hover:text-primary-light sm:line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-text-secondary">
                    {article.description}
                  </p>
                </div>
                <div className="hidden shrink-0 flex-col items-end gap-1 text-xs text-text-tertiary md:flex">
                  <time dateTime={article.date}>{formatDate(article.date, "medium")}</time>
                  <span>{formatReadingMinutes(article.readingMinutes)}</span>
                </div>
                <Icon
                  name="chevron-right"
                  size={16}
                  className="shrink-0 text-text-tertiary transition-transform group-hover:translate-x-0.5 group-hover:text-text"
                />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
