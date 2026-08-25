"use client";

import { useActionState } from "react";
import { subscribeAction, initialNewsletterState } from "@/app/actions/newsletter";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

interface NewsletterFormProps {
  /** Attribution tag stored with the subscription. */
  source?: string;
  compact?: boolean;
  className?: string;
}

/**
 * Progressive-enhancement newsletter form.
 * Works without JS via server action; useActionState adds pending/success/error
 * states when hydrated. No fake API — see src/lib/newsletter.ts.
 */
export function NewsletterForm({ source = "site", compact = false, className = "" }: NewsletterFormProps) {
  const [state, formAction, isPending] = useActionState(
    subscribeAction,
    initialNewsletterState,
  );

  const success = state.status === "success";

  if (success) {
    return (
      <div
        role="status"
        className={cn(
          "flex items-start gap-3 rounded-xl border border-success/30 bg-success/10 p-4",
          className,
        )}
      >
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-success/15 text-success">
          <Icon name="check" size={16} strokeWidth={2.2} />
        </span>
        <div>
          <p className="text-sm font-semibold text-text">Subscription confirmed</p>
          <p className="mt-0.5 text-sm leading-relaxed text-text-secondary">{state.message}</p>
        </div>
      </div>
    );
  }

  return (
    <form action={formAction} className={cn("w-full", className)} noValidate>
      <input type="hidden" name="source" value={source} />
      <div
        className={cn(
          "flex gap-2",
          compact ? "flex-row" : "flex-col sm:flex-row",
        )}
      >
        <label htmlFor={`newsletter-email-${source}`} className="sr-only">
          Email address
        </label>
        <input
          id={`newsletter-email-${source}`}
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          aria-invalid={state.status === "invalid-email"}
          aria-describedby={state.message ? `newsletter-hint-${source}` : undefined}
          className="h-12 min-w-0 flex-1 rounded-full border border-border bg-surface-2/70 px-5 text-sm text-text placeholder:text-text-tertiary outline-none transition focus:border-primary/60 focus:bg-surface-2"
        />
        <button
          type="submit"
          disabled={isPending}
          className="btn btn-primary h-12 shrink-0 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? (
            <>
              <span
                aria-hidden="true"
                className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
              />
              Subscribing…
            </>
          ) : (
            <>
              Subscribe
              <Icon name="mail" size={16} />
            </>
          )}
        </button>
      </div>
      <div aria-live="polite">
        {state.message ? (
          <p
            id={`newsletter-hint-${source}`}
            className={cn(
              "mt-3 text-sm",
              state.status === "invalid-email" || state.status === "error"
                ? "text-danger"
                : "text-text-secondary",
            )}
          >
            {state.message}
          </p>
        ) : null}
      </div>
    </form>
  );
}
