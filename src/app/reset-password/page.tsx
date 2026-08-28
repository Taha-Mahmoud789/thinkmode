"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/auth/auth-provider";
import { Logo } from "@/components/ui/logo";
import { Skeleton } from "@/components/ui/skeleton";

export const dynamic = "force-dynamic";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refresh } = useAuth();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const token = searchParams?.get("token") ?? "";

  if (!token) {
    return (
      <div className="tm-container flex min-h-[calc(100vh-72px)] items-center justify-center py-20 px-4">
        <div className="w-full max-w-md text-center">
          <Logo className="mx-auto mb-4" />
          <h1 className="font-display text-3xl font-bold tracking-tight text-text">
            Invalid reset link
          </h1>
          <p className="mt-2 text-text-secondary">
            This password reset link is missing a token.
          </p>
          <Link
            href="/forgot-password"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-text-inverse hover:bg-primary-light transition-colors"
          >
            Request a new link
          </Link>
        </div>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to reset password");
        return;
      }
      setSuccess("Password has been reset. Redirecting to sign in...");
      setTimeout(() => {
        router.push("/login?reset=1");
        router.refresh();
      }, 2000);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="tm-container flex min-h-[calc(100vh-72px)] items-center justify-center py-20 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Logo className="mx-auto mb-4" />
          <h1 className="font-display text-3xl font-bold tracking-tight text-text">
            Set new password
          </h1>
          <p className="mt-2 text-text-secondary">
            Your new password must be different from previous ones
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {error && (
            <div
              className="rounded-lg border border-danger/40 bg-danger/10 p-3 text-sm text-danger"
              role="alert"
            >
              {error}
            </div>
          )}
          {success && (
            <div
              className="rounded-lg border border-success/40 bg-success/10 p-3 text-sm text-success"
              role="alert"
            >
              {success}
            </div>
          )}

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-text-secondary mb-1.5"
            >
              New password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-text placeholder-text-tertiary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
              disabled={loading}
              minLength={8}
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-text-secondary mb-1.5"
            >
              Confirm new password
            </label>
            <input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-text placeholder-text-tertiary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-text-inverse transition-colors hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Resetting…" : "Reset password"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-text-secondary">
          <Link href="/login" className="font-medium text-primary hover:underline">
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="tm-container flex min-h-[calc(100vh-72px)] items-center justify-center py-20 px-4"><Skeleton className="h-8 w-32" /></div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}