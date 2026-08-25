"use client";

import { useSyncExternalStore } from "react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "thinkmode-bookmarks";

/* ------------------------------------------------------------------ */
/* Tiny external store shared by every BookmarkButton instance         */
/* ------------------------------------------------------------------ */

let bookmarks: string[] | null = null;
const listeners = new Set<() => void>();

function readBookmarks(): string[] {
  if (bookmarks !== null) return bookmarks;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    bookmarks = raw ? (JSON.parse(raw) as string[]) : [];
    if (!Array.isArray(bookmarks)) bookmarks = [];
  } catch {
    bookmarks = [];
  }
  return bookmarks;
}

function writeBookmarks(next: string[]) {
  bookmarks = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Storage unavailable (private mode etc.) — keep in-memory only.
  }
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): string[] {
  return readBookmarks();
}

function getServerSnapshot(): string[] {
  return [];
}

export function isBookmarked(slug: string): boolean {
  return readBookmarks().includes(slug);
}

/* ------------------------------------------------------------------ */
/* Button                                                              */
/* ------------------------------------------------------------------ */

interface BookmarkButtonProps {
  slug: string;
  title: string;
  /** Visual style variant. */
  variant?: "icon" | "card";
  className?: string;
}

export function BookmarkButton({
  slug,
  title,
  variant = "icon",
  className = "",
}: BookmarkButtonProps) {
  const saved = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const isSaved = saved.includes(slug);

  function toggle() {
    const current = readBookmarks();
    writeBookmarks(
      current.includes(slug)
        ? current.filter((s) => s !== slug)
        : [...current, slug],
    );
  }

  const label = isSaved ? `Remove “${title}” from saved` : `Save “${title}” for later`;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={isSaved}
      aria-label={label}
      title={label}
      className={
        variant === "card"
        ? cn(
          "grid h-9 w-9 place-items-center rounded-full border border-border bg-background/70 backdrop-blur transition hover:border-border-strong hover:text-text",
          isSaved ? "text-primary-light" : "text-text-secondary",
          className,
        )
        : cn(
          "inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-text-secondary transition hover:border-border-strong hover:text-text",
          isSaved ? "text-primary-light" : "",
          className,
        )
      }
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill={isSaved ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16Z" />
      </svg>
      {variant === "card" ? null : <span>{isSaved ? "Saved" : "Save"}</span>}
    </button>
  );
}

/** Optional saved-count badge for the header (kept minimal by default). */
export function SavedIndicator(): ReactNode {
  const saved = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  if (saved.length === 0) return null;
  return (
    <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-semibold text-white">
      {saved.length}
    </span>
  );
}
