"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { Icon } from "@/components/ui/icon";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { CommentView } from "@/lib/db/repositories";

interface CommentsSectionProps {
  articleSlug: string;
}

export function CommentsSection({ articleSlug }: CommentsSectionProps) {
  const { user, loading: authLoading, refresh } = useAuth();
  const [comments, setComments] = useState<CommentView[]>([]);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [body, setBody] = useState("");
  const [error, setError] = useState("");
  const [csrfToken, setCsrfToken] = useState("");
  const [cursor, setCursor] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [enabled, setEnabled] = useState(true);

  // Fetch CSRF token on mount
  useEffect(() => {
    async function fetchCsrf() {
      try {
        const res = await fetch("/api/csrf", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          setCsrfToken(data.token ?? "");
        }
      } catch {
        // silent
      }
    }
    void fetchCsrf();
  }, []);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/comments?slug=${encodeURIComponent(articleSlug)}`, {
          cache: "no-store",
        });
        if (res.ok) {
          const data = await res.json();
          setComments(data.comments ?? []);
          setCursor(data.nextCursor ?? null);
          setEnabled(data.enabled !== false);
        }
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, [articleSlug]);

  async function loadMore() {
    if (!cursor) return;
    setLoadingMore(true);
    try {
      const res = await fetch(
        `/api/comments?slug=${encodeURIComponent(articleSlug)}&cursor=${cursor}`,
        { cache: "no-store" },
      );
      if (res.ok) {
        const data = await res.json();
        setComments((prev) => [...prev, ...(data.comments ?? [])]);
        setCursor(data.nextCursor ?? null);
      }
    } catch {
      // silent
    } finally {
      setLoadingMore(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;
    if (!user) {
      setError("You must be signed in to comment");
      return;
    }
    if (!csrfToken) {
      setError("Security token missing. Please refresh the page.");
      return;
    }
    setError("");
    setPosting(true);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken,
        },
        body: JSON.stringify({ slug: articleSlug, body: body.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to post comment");
        return;
      }
      setComments((prev) => [...prev, data.comment]);
      setBody("");
      // Refresh CSRF token after successful mutation
      const csrfRes = await fetch("/api/csrf", { cache: "no-store" });
      if (csrfRes.ok) {
        const csrfData = await csrfRes.json();
        setCsrfToken(csrfData.token ?? "");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setPosting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this comment?")) return;
    if (!csrfToken) {
      setError("Security token missing. Please refresh the page.");
      return;
    }
    try {
      const res = await fetch(`/api/comments?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: { "x-csrf-token": csrfToken },
      });
      if (res.ok) {
        setComments((prev) => prev.filter((c) => c.id !== id));
      }
    } catch {
      // silent
    }
  }

  async function handleReport(id: string) {
    const reason = prompt("Reason for report (spam/harassment/hate/offtopic/other):");
    if (!reason) return;
    const normalized = reason.trim().toLowerCase();
    if (!["spam", "harassment", "hate", "offtopic", "other"].includes(normalized)) {
      setError("Invalid reason. Use: spam, harassment, hate, offtopic, or other.");
      return;
    }
    if (!csrfToken) {
      setError("Security token missing. Please refresh the page.");
      return;
    }
    try {
      const res = await fetch("/api/comments/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken,
        },
        body: JSON.stringify({ commentId: id, reason: normalized }),
      });
      if (res.ok) {
        alert("Report submitted. Thank you.");
      } else {
        const data = await res.json();
        setError(data.error ?? "Failed to report");
      }
    } catch {
      setError("Network error.");
    }
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  if (loading) {
    return (
      <div className="border-t border-border pt-12" aria-live="polite">
        <div className="space-y-6" aria-busy="true">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <section className="border-t border-border pt-12" aria-labelledby="comments-heading">
      <h2 id="comments-heading" className="font-display text-xl font-semibold text-text">
        Comments ({enabled ? comments.length : 0})
      </h2>

      {/* Composer — only show when comments are enabled */}
      {enabled && (
      <form onSubmit={handleSubmit} className="mt-8 space-y-4" noValidate>
        {user ? (
          <>
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-semibold text-primary">
                  {user.username.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1">
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Join the discussion…"
                  rows={3}
                  className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-text placeholder-text-tertiary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors resize-none"
                  disabled={posting}
                  maxLength={2000}
                />
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-text-tertiary">
                    {body.length}/2000
                  </span>
                  <button
                    type="submit"
                    disabled={posting || !body.trim()}
                    className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-text-inverse transition-colors hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {posting ? "Posting…" : "Post comment"}
                  </button>
                </div>
              </div>
            </div>
            {error && (
              <p className="text-sm text-danger" role="alert">{error}</p>
            )}
          </>
        ) : (
          <div className="rounded-lg border border-border bg-surface/50 p-4 text-center">
            <p className="text-text-secondary">
              <Icon name="log-in" size={16} className="inline-block align-middle mr-1" />
              <a
                href={`/login?redirect=${encodeURIComponent(window.location.pathname)}`}
                className="font-medium text-primary hover:underline"
              >
                Sign in
              </a>{" "}
              to join the discussion.
            </p>
          </div>
        )}
      </form>
      )}

      {/* List */}
      <ul className="mt-10 space-y-6" role="list" aria-label="Comments">
        {!enabled ? (
          <li className="text-center py-8 rounded-xl border border-border bg-surface/50">
            <Icon name="message" size={32} className="mx-auto mb-3 text-text-tertiary" />
            <p className="text-text-secondary">
              Comments are not available yet.
            </p>
            <p className="text-sm text-text-tertiary mt-1">
              Check back soon — we&apos;re setting things up.
            </p>
          </li>
        ) : comments.length === 0 ? (
          <li className="text-center py-8 text-text-tertiary">
            No comments yet. Be the first to share your thoughts.
          </li>
        ) : (
          comments.map((comment) => (
            <li
              key={comment.id}
              className="flex gap-3"
              style={{ animation: "fadeIn 0.3s ease-out" }}
            >
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-semibold text-primary">
                  {comment.username.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-text">{comment.username}</span>
                  <time className="text-xs text-text-tertiary" dateTime={comment.createdAt}>
                    {formatDate(comment.createdAt)}
                  </time>
                  {comment.updatedAt && (
                    <span className="text-xs text-text-tertiary">(edited)</span>
                  )}
                  {user && user.id === comment.userId && (
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="ml-auto text-xs text-text-tertiary hover:text-danger transition-colors"
                    >
                      Delete
                    </button>
                  )}
                  {user && user.id !== comment.userId && (
                    <button
                      onClick={() => handleReport(comment.id)}
                      className="ml-auto text-xs text-text-tertiary hover:text-amber-500 transition-colors"
                      title="Report comment"
                    >
                      Report
                    </button>
                  )}
                </div>
                <p className="mt-1 text-text-secondary whitespace-pre-wrap">{comment.body}</p>
              </div>
            </li>
          ))
        )}
      </ul>

      {cursor && (
        <div className="mt-6 text-center">
          <button
            onClick={loadMore}
            disabled={loadingMore}
            className="rounded-lg border border-border bg-surface px-6 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-2 hover:text-text disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loadingMore ? "Loading…" : "Load more comments"}
          </button>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}