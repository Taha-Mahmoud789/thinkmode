"use client";

import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="relative flex min-h-[70vh] items-center overflow-hidden pt-[72px]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/3 h-[320px] w-[560px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />
      </div>
      <div className="tm-container relative py-20 text-center">
        <p
          aria-hidden="true"
          className="text-gradient font-display text-[clamp(5rem,18vw,9rem)] font-extrabold leading-none tracking-tighter"
        >
          !
        </p>
        <h1 className="mt-2 font-display text-2xl font-bold tracking-tight text-text md:text-3xl">
          This page hit an error
        </h1>
        <p className="mx-auto mt-4 max-w-md leading-relaxed text-text-secondary">
          Something broke while loading this page. You can try again, or head
          back to the home page.
        </p>
        {error.digest && (
          <p className="mt-3 font-mono text-xs text-text-secondary/50">
            Error: {error.digest}
          </p>
        )}
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <button onClick={() => reset()} className="btn btn-primary">
            Try again
          </button>
          <Link href="/" className="btn btn-secondary">
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
