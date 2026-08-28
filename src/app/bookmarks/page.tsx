"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/auth/auth-provider";
import { Icon } from "@/components/ui/icon";
import { BookmarkButton } from "@/components/ui/bookmark-button";
import { Skeleton, SkeletonCard } from "@/components/ui/skeleton";
import type { ArticleMeta } from "@/types";

export const dynamic = "force-dynamic";

export default function BookmarksPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [bookmarks, setBookmarks] = useState<ArticleMeta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push(`/login?redirect=${encodeURIComponent("/bookmarks")}`);
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!user) return;
    async function load() {
      try {
        const res = await fetch("/api/bookmarks?full=true", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          setBookmarks(data.bookmarks ?? []);
        }
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, [user]);

  function handleRemove(slug: string) {
    setBookmarks((prev) => prev.filter((b) => b.slug !== slug));
  }

  if (authLoading || !user) {
    return (
      <div className="tm-container py-20 text-center">
        <Skeleton className="h-8 w-32 mx-auto" />
      </div>
    );
  }

  return (
    <div className="tm-container py-14">
      <div className="max-w-3xl mx-auto">
        <header className="mb-10">
          <h1 className="font-display text-3xl font-bold tracking-tight text-text">
            Your Bookmarks
          </h1>
          <p className="mt-2 text-text-secondary">
            Articles you&apos;ve saved for later.
          </p>
        </header>

        {loading ? (
          <div className="space-y-4" aria-busy="true">
            {[1, 2, 3].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : bookmarks.length === 0 ? (
          <div className="text-center py-16 rounded-xl border border-border bg-surface/50">
            <Icon name="bookmark" size={48} className="mx-auto mb-4 text-text-tertiary" />
            <h2 className="font-display text-lg font-medium text-text mb-2">
              No bookmarks yet
            </h2>
            <p className="text-text-secondary mb-6">
              Save articles to read later by clicking the bookmark icon.
            </p>
            <Link
              href="/articles"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-text-inverse hover:bg-primary-light transition-colors"
            >
              <Icon name="arrow-right" size={16} />
              Browse Articles
            </Link>
          </div>
        ) : (
          <>
            <p className="text-sm text-text-tertiary mb-6">
              {bookmarks.length} article{bookmarks.length !== 1 ? "s" : ""} saved
            </p>
            <ul className="space-y-4" role="list">
              {bookmarks.map((article) => (
                <li
                  key={article.slug}
                  className="relative flex gap-4 p-4 rounded-xl border border-border hover:bg-surface/50 transition-colors group"
                >
                  <Link
                    href={`/articles/${article.slug}`}
                    className="relative z-10 block h-24 w-24 shrink-0 rounded-lg overflow-hidden"
                    aria-label={`Read "${article.title}"`}
                  >
                    <img
                      src={article.cover}
                      alt=""
                      loading="lazy"
                      width={192}
                      height={192}
                      className="h-full w-full object-cover"
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/categories/${article.category.slug}`}
                        className="text-xs font-medium text-primary hover:underline"
                      >
                        {article.category.name}
                      </Link>
                      <time className="text-xs text-text-tertiary" dateTime={article.date}>
                        {new Date(article.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </time>
                    </div>
                    <Link href={`/articles/${article.slug}`} className="mt-1 block">
                      <h3 className="font-display text-base font-semibold leading-snug text-text line-clamp-2 group-hover:text-primary transition-colors">
                        {article.title}
                      </h3>
                    </Link>
                    <p className="mt-1 text-sm text-text-secondary line-clamp-2">
                      {article.description}
                    </p>
                    <div className="mt-2 flex items-center gap-3 text-xs text-text-tertiary">
                      <span className="flex items-center gap-1">
                        <Icon name="clock" size={12} />
                        {article.readingMinutes} min read
                      </span>
                      <BookmarkButton
                        slug={article.slug}
                        inline
                        className="ml-auto"
                        onToggle={(bookmarked) => {
                          if (!bookmarked) handleRemove(article.slug);
                        }}
                      />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}