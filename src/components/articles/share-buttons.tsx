"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/icon";
import { siteConfig } from "@/config/site";

interface ShareButtonsProps {
  title: string;
  /** Article slug — the canonical path is derived from it. */
  slug: string;
}

/**
 * Privacy-respecting share row: native share sheet where supported,
 * copy-link fallback everywhere else. No third-party tracking scripts.
 */
export function ShareButtons({ title, slug }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  async function shareOrCopy() {
    const url = `${window.location.origin}/articles/${slug}`;
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // User dismissed the sheet — fall through to copy.
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable; nothing else to try safely.
    }
  }

  const encodedUrl = encodeURIComponent(
    `${siteConfig.url}/articles/${slug}`,
  );
  const encodedTitle = encodeURIComponent(title);

  return (
    <span className="flex items-center gap-2">
      <a
        href={`https://x.com/intent/post?text=${encodedTitle}&url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Share “${title}” on X`}
        title="Share on X"
        className="grid h-9 w-9 place-items-center rounded-full border border-border text-text-secondary transition hover:border-border-strong hover:text-text"
      >
        <Icon name="x-social" size={14} />
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Share “${title}” on LinkedIn`}
        title="Share on LinkedIn"
        className="grid h-9 w-9 place-items-center rounded-full border border-border text-text-secondary transition hover:border-border-strong hover:text-text"
      >
        <Icon name="linkedin" size={14} />
      </a>
      <button
        type="button"
        onClick={shareOrCopy}
        aria-label={copied ? "Link copied" : `Copy link to “${title}”`}
        title={copied ? "Copied!" : "Copy link"}
        data-testid="copy-link"
        className={
          copied
            ? "grid h-9 w-9 place-items-center rounded-full border border-success/50 bg-success/10 text-success transition"
            : "grid h-9 w-9 place-items-center rounded-full border border-border text-text-secondary transition hover:border-border-strong hover:text-text"
        }
      >
        <Icon name={copied ? "check" : "share"} size={14} />
      </button>
    </span>
  );
}
