"use client";

import { Suspense, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/auth/auth-provider";
import { Logo } from "@/components/ui/logo";
import { Skeleton } from "@/components/ui/skeleton";

export const dynamic = "force-dynamic";

function ForgotPasswordForm() {
  const router = useRouter();
  const { refresh } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email.trim()) {
      setError("Enter your email");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to send reset email");
        return;
      }
      setSuccess(data.message ?? "Check your email for reset instructions");
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
            Forgot password?
          </h1>
          <p className="mt-2 text-text-secondary">
            Enter your email and we&apos;ll send you a reset link
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
              htmlFor="email"
              className="block text-sm font-medium text-text-secondary mb-1.5"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-text placeholder-text-tertiary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-text-inverse transition-colors hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Sending…" : "Send reset link"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-text-secondary">
          Remember your password?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<div className="tm-container flex min-h-[calc(100vh-72px)] items-center justify-center py-20 px-4"><Skeleton className="h-8 w-32" /></div>}>
      <ForgotPasswordForm />
    </Suspense>
  );
}