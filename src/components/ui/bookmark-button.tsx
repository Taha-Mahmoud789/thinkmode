"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import { useBookmarks } from "./bookmark-store";

interface BookmarkButtonProps {
  slug: string;
  /** Inline variant (smaller, for cards) */
  inline?: boolean;
  className?: string;
  /** Called after toggle with the new bookmarked state. */
  onToggle?: (bookmarked: boolean) => void;
}

export function BookmarkButton({ slug, inline = false, className = "", onToggle }: BookmarkButtonProps) {
  const { bookmarks, toggle, isBookmarked } = useBookmarks();
  const [mounted, setMounted] = useState(false);
  const saved = isBookmarked(slug);

  // Prevent hydration mismatch — only read from store after mount
  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
  }, []);

  function handleClick() {
    toggle(slug);
    onToggle?.(!saved);
  }

  if (!mounted) {
    return (
      <button
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
          inline
            ? "border-transparent text-text-tertiary hover:bg-surface-2"
            : "border-border text-text-secondary hover:border-border-strong hover:bg-surface-2 hover:text-text",
          className,
        )}
        disabled
        aria-label={saved ? "Saved" : "Save for later"}
      >
        <Icon name="bookmark" size={inline ? 13 : 15} />
        {!inline && "Save"}
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
        inline
          ? saved
            ? "bg-primary/15 text-primary border-primary/30"
            : "border-transparent text-text-tertiary hover:bg-surface-2"
          : saved
            ? "border-primary/40 bg-primary/10 text-primary hover:bg-primary/15"
            : "border-border text-text-secondary hover:border-border-strong hover:bg-surface-2 hover:text-text",
        className,
      )}
      aria-label={saved ? "Remove bookmark" : "Save for later"}
      aria-pressed={saved}
    >
      <Icon name="bookmark" size={inline ? 13 : 15} />
      {!inline && (saved ? "Saved" : "Save")}
    </button>
  );
}