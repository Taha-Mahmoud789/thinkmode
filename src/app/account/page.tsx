"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-provider";
import { Icon } from "@/components/ui/icon";
import { BookmarkButton } from "@/components/ui/bookmark-button";
import { Skeleton, SkeletonCard } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { IconName } from "@/types";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface BookmarkItem {
  slug: string;
  title: string;
  cover: string;
  description: string;
  date: string;
  category: { name: string; slug: string };
  readingMinutes: number;
}

export default function AccountPage() {
  const { user, loading: authLoading, refresh } = useAuth();
  const router = useRouter();
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [loadingBookmarks, setLoadingBookmarks] = useState(true);
  const [activeTab, setActiveTab] = useState<"profile" | "bookmarks" | "security">("profile");
  const [profileError, setProfileError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [securityError, setSecurityError] = useState("");
  const [securitySuccess, setSecuritySuccess] = useState("");
  const [securityLoading, setSecurityLoading] = useState(false);
  const [sessions, setSessions] = useState<{ id: string; createdAt: string; expiresAt: string; isCurrent: boolean }[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push(`/login?redirect=${encodeURIComponent("/account")}`);
    }
  }, [authLoading, user, router]);

  // Load bookmarks
  useEffect(() => {
    if (!user) return;
    async function load() {
      try {
        const res = await fetch("/api/bookmarks", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          // We only have slugs from API, need to fetch article metadata
          // For now, we'll use a separate endpoint or embed metadata
        }
      } catch {
        // silent
      } finally {
        setLoadingBookmarks(false);
      }
    }
    void load();
  }, [user]);

  // For now, use the localStorage bookmarks to get full article data
  // In production, you'd have a /api/bookmarks/articles endpoint
  useEffect(() => {
    if (!user) return;
    async function loadFullBookmarks() {
      try {
        const res = await fetch("/api/bookmarks?full=true", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          setBookmarks(data.bookmarks ?? []);
        }
      } catch {
        // silent
      } finally {
        setLoadingBookmarks(false);
      }
    }
    void loadFullBookmarks();
  }, [user]);

  // Load active sessions when on security tab
  useEffect(() => {
    if (!user || activeTab !== "security") return;
    async function loadSessions() {
      try {
        const res = await fetch("/api/auth/sessions", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          setSessions(data.sessions ?? []);
        }
      } catch {
        // silent
      } finally {
        setSessionsLoading(false);
      }
    }
    void loadSessions();
  }, [user, activeTab]);

  async function handleProfileUpdate(e: React.FormEvent) {
    e.preventDefault();
    setProfileError("");
    setProfileSuccess("");
    try {
      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), email: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setProfileError(data.error ?? "Failed to update profile");
        return;
      }
      setProfileSuccess("Profile updated");
      await refresh();
    } catch {
      setProfileError("Network error. Please try again.");
    }
  }

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    setSecurityError("");
    setSecuritySuccess("");
    if (newPassword !== confirmPassword) {
      setSecurityError("Passwords do not match");
      return;
    }
    if (newPassword.length < 8) {
      setSecurityError("Password must be at least 8 characters");
      return;
    }
    setSecurityLoading(true);
    try {
      const res = await fetch("/api/auth/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSecurityError(data.error ?? "Failed to change password");
        return;
      }
      setSecuritySuccess("Password changed");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      setSecurityError("Network error. Please try again.");
    } finally {
      setSecurityLoading(false);
    }
  }

  async function handleRemoveBookmark(slug: string) {
    try {
      await fetch("/api/bookmarks", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });
      setBookmarks((prev) => prev.filter((b) => b.slug !== slug));
    } catch {
      // silent
    }
  }

  async function revokeSession(sessionId: string) {
    try {
      const res = await fetch(`/api/auth/sessions?id=${encodeURIComponent(sessionId)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setSessions((prev) => prev.filter((s) => s.id !== sessionId));
      }
    } catch {
      // silent
    }
  }

  // Initialize form values
  useEffect(() => {
    if (!user) return;
    requestAnimationFrame(() => {
      setUsername(user.username);
      setEmail(user.email);
    });
  }, [user]);

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
            Account Settings
          </h1>
          <p className="mt-2 text-text-secondary">
            Manage your profile, bookmarks, and security settings.
          </p>
        </header>

        {/* Tabs */}
        <nav className="flex gap-1 mb-8 border-b border-border" aria-label="Account sections">
          {[
            { id: "profile", label: "Profile", icon: "user" as IconName },
            { id: "bookmarks", label: "Bookmarks", icon: "bookmark" as IconName },
            { id: "security", label: "Security", icon: "lock" as IconName },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={cn(
                "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors",
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-text-tertiary hover:text-text hover:border-border",
              )}
              role="tab"
              aria-selected={activeTab === tab.id}
            >
              <Icon name={tab.icon} size={16} />
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <section className="space-y-6" aria-labelledby="profile-heading">
            <h2 id="profile-heading" className="font-display text-xl font-semibold text-text">
              Profile
            </h2>
            <form onSubmit={handleProfileUpdate} className="space-y-5" noValidate>
              {profileError && (
                <div className="rounded-lg border border-danger/40 bg-danger/10 p-3 text-sm text-danger" role="alert">
                  {profileError}
                </div>
              )}
              {profileSuccess && (
                <div className="rounded-lg border border-success/40 bg-success/10 p-3 text-sm text-success" role="alert">
                  {profileSuccess}
                </div>
              )}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-text-secondary mb-1.5">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-text placeholder-text-tertiary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
                  minLength={2}
                  maxLength={50}
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-1.5">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-text placeholder-text-tertiary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
                  required
                />
              </div>
              <button
                type="submit"
                className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-text-inverse transition-colors hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 focus:ring-offset-background"
              >
                Save Changes
              </button>
            </form>
          </section>
        )}

        {/* Bookmarks Tab */}
        {activeTab === "bookmarks" && (
          <section aria-labelledby="bookmarks-heading">
            <h2 id="bookmarks-heading" className="font-display text-xl font-semibold text-text mb-6">
              Your Bookmarks ({bookmarks.length})
            </h2>
            {loadingBookmarks ? (
              <div className="space-y-4" aria-busy="true">
                {[1, 2, 3].map((i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : bookmarks.length === 0 ? (
              <div className="text-center py-12 rounded-xl border border-border bg-surface/50">
                <Icon name="bookmark" size={48} className="mx-auto mb-4 text-text-tertiary" />
                <h3 className="font-display text-lg font-medium text-text mb-2">No bookmarks yet</h3>
                <p className="text-text-secondary mb-6">Save articles to read later.</p>
                <Link href="/articles" className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-text-inverse hover:bg-primary-light transition-colors">
                  <Icon name="arrow-right" size={16} />
                  Browse Articles
                </Link>
              </div>
            ) : (
              <ul className="space-y-4" role="list">
                {bookmarks.map((article) => (
                  <li key={article.slug} className="relative flex gap-4 p-4 rounded-xl border border-border hover:bg-surface/50 transition-colors group">
                    <Link href={`/articles/${article.slug}`} className="relative z-10 block h-24 w-24 shrink-0 rounded-lg overflow-hidden" aria-label={`Read "${article.title}"`}>
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
                      <div className="flex items-start gap-2">
                        <Link href={`/categories/${article.category.slug}`} className="text-xs font-medium text-primary hover:underline">
                          {article.category.name}
                        </Link>
                        <time className="text-xs text-text-tertiary" dateTime={article.date}>
                          {new Date(article.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </time>
                      </div>
                      <Link href={`/articles/${article.slug}`} className="mt-1 block">
                        <h3 className="font-display text-base font-semibold leading-snug text-text line-clamp-2 group-hover:text-primary transition-colors">
                          {article.title}
                        </h3>
                      </Link>
                      <p className="mt-1 text-sm text-text-secondary line-clamp-2">{article.description}</p>
                      <div className="mt-2 flex items-center gap-3 text-xs text-text-tertiary">
                        <span className="flex items-center gap-1">
                          <Icon name="clock" size={12} />
                          {article.readingMinutes} min read
                        </span>
                        <BookmarkButton slug={article.slug} inline className="ml-auto" />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {/* Security Tab */}
        {activeTab === "security" && (
          <section className="space-y-6" aria-labelledby="security-heading">
            <h2 id="security-heading" className="font-display text-xl font-semibold text-text">
              Security
            </h2>
            <div className="rounded-xl border border-border bg-surface/50 p-6">
              <h3 className="font-medium text-text mb-2">Change Password</h3>
              <p className="text-sm text-text-secondary mb-4">Your current password is required to set a new one.</p>
              <form onSubmit={handlePasswordChange} className="space-y-4" noValidate>
                {securityError && (
                  <div className="rounded-lg border border-danger/40 bg-danger/10 p-3 text-sm text-danger" role="alert">
                    {securityError}
                  </div>
                )}
                {securitySuccess && (
                  <div className="rounded-lg border border-success/40 bg-success/10 p-3 text-sm text-success" role="alert">
                    {securitySuccess}
                  </div>
                )}
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-text-secondary mb-1.5">
                    Current Password
                  </label>
                  <input
                    id="currentPassword"
                    type="password"
                    autoComplete="current-password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-text placeholder-text-tertiary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
                    required
                    disabled={securityLoading}
                  />
                </div>
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-text-secondary mb-1.5">
                    New Password
                  </label>
                  <input
                    id="newPassword"
                    type="password"
                    autoComplete="new-password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-text placeholder-text-tertiary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
                    minLength={8}
                    required
                    disabled={securityLoading}
                  />
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-secondary mb-1.5">
                    Confirm New Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-text placeholder-text-tertiary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
                    required
                    disabled={securityLoading}
                  />
                </div>
                <button
                  type="submit"
                  disabled={securityLoading}
                  className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-text-inverse transition-colors hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {securityLoading ? "Saving…" : "Change Password"}
                </button>
              </form>
            </div>

            <div className="rounded-xl border border-border bg-surface/50 p-6">
              <h3 className="font-medium text-text mb-2">Active Sessions</h3>
              <p className="text-sm text-text-secondary mb-4">Manage your active login sessions across devices.</p>
              {sessionsLoading ? (
                <div className="space-y-3" aria-busy="true">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-16 rounded-lg" />
                  ))}
                </div>
              ) : sessions.length === 0 ? (
                <p className="text-sm text-text-tertiary">No active sessions found.</p>
              ) : (
                <ul className="space-y-3" role="list">
                  {sessions.map((s) => (
                    <li key={s.id} className="flex items-center justify-between rounded-lg border border-border p-4">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <Icon name="cpu" size={16} className="text-text-tertiary shrink-0" />
                          <span className="text-sm font-medium text-text truncate">
                            {s.isCurrent ? "This session" : "Other session"}
                          </span>
                          {s.isCurrent && (
                            <span className="rounded-full bg-primary/20 px-2 py-0.5 text-xs font-medium text-primary">
                              Current
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-xs text-text-tertiary">
                          Created {new Date(s.createdAt).toLocaleDateString()} · Expires {new Date(s.expiresAt).toLocaleDateString()}
                        </p>
                      </div>
                      {!s.isCurrent && (
                        <button
                          onClick={() => revokeSession(s.id)}
                          className="ml-4 shrink-0 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-text-secondary hover:border-danger hover:text-danger transition-colors"
                        >
                          Revoke
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}