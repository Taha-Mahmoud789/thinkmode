"use client";

import { useActionState } from "react";
import {
  sendContactAction,
  type ContactFormState,
} from "@/app/actions/contact";
import { Icon } from "@/components/ui/icon";

const INITIAL_STATE: ContactFormState = { status: "idle", message: "" };

interface ContactFormProps {
  className?: string;
}

export function ContactForm({ className = "" }: ContactFormProps) {
  const [state, formAction, isPending] = useActionState(
    sendContactAction,
    INITIAL_STATE,
  );

  if (state.status === "success") {
    return (
      <div
        role="status"
        className={`flex h-fit items-start gap-3 rounded-2xl border border-success/30 bg-success/10 p-6 ${className}`}
      >
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-success/15 text-success">
          <Icon name="check" size={16} strokeWidth={2.2} />
        </span>
        <div>
          <p className="font-semibold text-text">Message sent</p>
          <p className="mt-1 text-sm leading-relaxed text-text-secondary">{state.message}</p>
        </div>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      aria-label="Contact form"
      className={`h-fit rounded-3xl border border-border bg-surface p-7 ${className}`}
      noValidate
    >
      <div className="space-y-4">
        <Field label="Name" name="name" type="text" placeholder="Ada Lovelace" autoComplete="name" required />
        <Field label="Email" name="email" type="email" placeholder="you@example.com" autoComplete="email" required />
        <div>
          <label htmlFor="topic" className="mb-1.5 block text-sm font-medium text-text">
            Topic
          </label>
          <select
            id="topic"
            name="topic"
            defaultValue="general"
            className="h-11 w-full rounded-xl border border-border bg-surface-2/70 px-4 text-sm text-text outline-none transition focus:border-primary/60"
          >
            <option value="general">General</option>
            <option value="tip">Story tip</option>
            <option value="feedback">Feedback</option>
            <option value="correction">Correction</option>
            <option value="advertising">Advertising</option>
          </select>
        </div>
        <div>
          <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-text">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            maxLength={5000}
            required
            placeholder="What's on your mind?"
            className="w-full resize-y rounded-xl border border-border bg-surface-2/70 px-4 py-3 text-sm text-text placeholder:text-text-tertiary outline-none transition focus:border-primary/60"
          />
        </div>
      </div>

      <button type="submit" disabled={isPending} className="btn btn-primary mt-6 w-full disabled:opacity-60">
        {isPending ? (
          <>
            <span aria-hidden="true" className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            Sending…
          </>
        ) : (
          <>
            Send message
            <Icon name="arrow-right" size={15} />
          </>
        )}
      </button>

      <div aria-live="polite">
        {state.message ? (
          <p className="mt-3 text-sm text-danger">{state.message}</p>
        ) : null}
      </div>

      <p className="mt-4 text-xs leading-relaxed text-text-tertiary">
        By sending a message you agree to our privacy policy. We never share
        your details.
      </p>
    </form>
  );
}

function Field({
  label,
  name,
  type,
  placeholder,
  autoComplete,
  required,
}: {
  label: string;
  name: string;
  type: string;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
}) {
  const id = `contact-${name}`;
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-text">
        {label}
        {required ? <span aria-hidden="true" className="ml-0.5 text-danger">*</span> : null}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        className="h-11 w-full rounded-xl border border-border bg-surface-2/70 px-4 text-sm text-text placeholder:text-text-tertiary outline-none transition focus:border-primary/60"
      />
    </div>
  );
}
