"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-provider";
import { Icon } from "@/components/ui/icon";
import { Skeleton, SkeletonArticleRow } from "@/components/ui/skeleton";

export const dynamic = "force-dynamic";

interface Report {
  id: string;
  commentId: string;
  commentBody: string;
  commentAuthor: string;
  articleSlug: string;
  reporterUsername: string;
  reason: string;
  status: string;
  createdAt: string;
}

export default function ModerationPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"pending" | "all">("pending");

  useEffect(() => {
    if (!authLoading && (!user || !user.isAdmin)) {
      router.push("/");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!user?.isAdmin) return;
    async function load() {
      try {
        const url = filter === "all" ? "/api/admin/reports" : "/api/admin/reports?status=pending";
        const res = await fetch(url, { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          setReports(data.reports ?? []);
        }
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, [user, filter]);

  async function handleAction(reportId: string, action: "dismiss" | "hide") {
    try {
      const res = await fetch("/api/admin/reports", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportId, action }),
      });
      if (res.ok) {
        setReports((prev) => prev.filter((r) => r.id !== reportId));
      }
    } catch {
      // silent
    }
  }

  if (authLoading || !user?.isAdmin) {
    return (
      <div className="tm-container py-20 text-center">
        <Skeleton className="h-8 w-32 mx-auto" />
      </div>
    );
  }

  const reasonLabels: Record<string, string> = {
    spam: "Spam",
    harassment: "Harassment",
    hate: "Hate speech",
    offtopic: "Off-topic",
    other: "Other",
  };

  return (
    <div className="tm-container py-14">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10">
          <h1 className="font-display text-3xl font-bold tracking-tight text-text">
            Comment Moderation
          </h1>
          <p className="mt-2 text-text-secondary">
            Review reported comments and take action.
          </p>
        </header>

        {/* Filter */}
        <div className="flex gap-2 mb-6">
          {(["pending", "all"] as const).map((f) => (
            <button
              key={f}
              onClick={() => { setFilter(f); setLoading(true); }}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                filter === f
                  ? "bg-primary text-text-inverse"
                  : "border border-border text-text-secondary hover:bg-surface-2"
              }`}
            >
              {f === "pending" ? "Pending" : "All"}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-4" aria-busy="true">
            {[1, 2, 3].map((i) => (
              <SkeletonArticleRow key={i} />
            ))}
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center py-16 rounded-xl border border-border bg-surface/50">
            <Icon name="check" size={48} className="mx-auto mb-4 text-success" />
            <h2 className="font-display text-lg font-medium text-text mb-2">
              All clear
            </h2>
            <p className="text-text-secondary">
              {filter === "pending" ? "No pending reports to review." : "No reports found."}
            </p>
          </div>
        ) : (
          <ul className="space-y-4" role="list">
            {reports.map((report) => (
              <li
                key={report.id}
                className="rounded-xl border border-border bg-surface/50 p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="rounded-full bg-danger/15 px-2.5 py-0.5 text-xs font-medium text-danger">
                        {reasonLabels[report.reason] ?? report.reason}
                      </span>
                      <span className="text-xs text-text-tertiary">
                        by {report.reporterUsername}
                      </span>
                      <time className="text-xs text-text-tertiary" dateTime={report.createdAt}>
                        {new Date(report.createdAt).toLocaleDateString()}
                      </time>
                    </div>

                    <div className="rounded-lg border border-border bg-surface p-4 mb-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-text">
                          {report.commentAuthor}
                        </span>
                        <span className="text-xs text-text-tertiary">on</span>
                        <a
                          href={`/articles/${report.articleSlug}`}
                          className="text-xs font-medium text-primary hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {report.articleSlug}
                        </a>
                      </div>
                      <p className="text-sm text-text-secondary whitespace-pre-wrap">
                        {report.commentBody}
                      </p>
                    </div>
                  </div>

                  {report.status === "pending" && (
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => handleAction(report.id, "dismiss")}
                        className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-text-secondary hover:bg-surface-2 transition-colors"
                      >
                        Dismiss
                      </button>
                      <button
                        onClick={() => {
                          if (confirm("Hide this comment?")) {
                            handleAction(report.id, "hide");
                          }
                        }}
                        className="rounded-lg bg-danger/10 border border-danger/30 px-3 py-1.5 text-xs font-medium text-danger hover:bg-danger/20 transition-colors"
                      >
                        Hide Comment
                      </button>
                    </div>
                  )}
                  {report.status !== "pending" && (
                    <span className="text-xs text-text-tertiary capitalize shrink-0">
                      {report.status}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}