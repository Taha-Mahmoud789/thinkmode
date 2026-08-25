"use client";

import { useEffect, useState } from "react";
import type { TocItem } from "@/types";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/icon";

interface TableOfContentsProps {
  items: TocItem[];
  className?: string;
}

/** Sticky article TOC with IntersectionObserver scroll-spy. */
export function TableOfContents({ items, className = "" }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (items.length === 0) return;
    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);

    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-80px 0px -65% 0px", threshold: 0 },
    );

    headings.forEach((heading) => observer.observe(heading));
    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav aria-label="Table of contents" className={className}>
      <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-text-tertiary">
        <Icon name="list" size={13} />
        On this page
      </p>
      <ul className="mt-4 space-y-1 border-l border-border">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              aria-current={activeId === item.id ? "location" : undefined}
              className={cn(
                "block border-l-2 py-1.5 pr-2 text-[13px] leading-snug transition-colors",
                item.level === 3 ? "pl-7" : "pl-4",
                activeId === item.id
                  ? "-ml-px border-primary text-text"
                  : "border-transparent text-text-tertiary hover:text-text-secondary",
              )}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
