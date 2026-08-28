"use client";

import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  /** Render as a specific element. Defaults to div. */
  as?: "div" | "span" | "li";
}

/**
 * Animated skeleton placeholder with a shimmer effect.
 * Usage: <Skeleton className="h-4 w-full rounded" />
 */
export function Skeleton({ className, as: Tag = "div" }: SkeletonProps) {
  return (
    <Tag
      className={cn(
        "relative overflow-hidden rounded-md bg-surface-2",
        "after:absolute after:inset-0 after:-translate-x-full",
        "after:animate-shimmer after:bg-gradient-to-r",
        "after:from-transparent after:via-white/5 after:to-transparent",
        className,
      )}
      aria-hidden="true"
    />
  );
}

/* ---- Pre-built skeleton patterns ---- */

export function SkeletonText({
  lines = 3,
  className,
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2.5", className)} aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            "h-3.5 rounded",
            i === lines - 1 ? "w-3/4" : "w-full",
          )}
        />
      ))}
    </div>
  );
}

export function SkeletonAvatar({ size = "md", className }: { size?: "sm" | "md" | "lg"; className?: string }) {
  const sizes = { sm: "h-6 w-6", md: "h-11 w-11", lg: "h-16 w-16" };
  return <Skeleton className={cn("rounded-full", sizes[size], className)} />;
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex gap-4 p-4 rounded-xl border border-border",
        className,
      )}
      aria-hidden="true"
    >
      <Skeleton className="h-24 w-24 shrink-0 rounded-lg" />
      <div className="flex-1 space-y-3">
        <Skeleton className="h-4 w-1/4 rounded" />
        <Skeleton className="h-5 w-3/4 rounded" />
        <Skeleton className="h-4 w-1/2 rounded" />
        <Skeleton className="h-3 w-1/3 rounded" />
      </div>
    </div>
  );
}

export function SkeletonArticleRow({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border p-6 space-y-3",
        className,
      )}
      aria-hidden="true"
    >
      <div className="flex items-center gap-2">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-3 w-20 rounded" />
      </div>
      <Skeleton className="h-5 w-2/3 rounded" />
      <Skeleton className="h-4 w-full rounded" />
      <Skeleton className="h-4 w-1/2 rounded" />
    </div>
  );
}

export function SkeletonPage({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center py-20", className)}>
      <div className="flex flex-col items-center gap-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-4 w-32 rounded" />
      </div>
    </div>
  );
}
