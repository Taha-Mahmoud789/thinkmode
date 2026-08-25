interface CalloutProps {
  /** Visual intent of the callout. */
  variant?: "info" | "warning" | "tip";
  title?: string;
  children: React.ReactNode;
}

export type { CalloutProps };

const VARIANTS = {
  info: {
    icon: "M12 8v.01M12 11v5m9-4a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
    label: "Note",
    color: "#22d3ee",
  },
  warning: {
    icon: "M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z",
    label: "Warning",
    color: "#fbbf24",
  },
  tip: {
    icon: "M9 18h6m-5 3h4m-2-21a7 7 0 0 0-4 12.7c.6.5 1 1.4 1 2.3h6c0-.9.4-1.8 1-2.3A7 7 0 0 0 12 0Z",
    label: "Tip",
    color: "#34d399",
  },
} as const;

/** Editorial callout: <Callout variant="tip" title="…">…</Callout> */
export function Callout({ variant = "info", title, children }: CalloutProps) {
  const config = VARIANTS[variant];
  return (
    <aside
      className="my-8 flex gap-4 rounded-xl border border-border bg-surface-2/60 p-5"
      style={{ borderLeft: `3px solid ${config.color}` }}
      role={variant === "warning" ? "alert" : undefined}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke={config.color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="mt-0.5 h-5 w-5 shrink-0"
      >
        <path d={config.icon} />
      </svg>
      <div>
        <p className="mb-1 font-display text-sm font-semibold tracking-tight text-text">
          {title ?? config.label}
        </p>
        <div className="text-[0.95rem] leading-relaxed text-text-secondary [&>p]:m-0">
          {children}
        </div>
      </div>
    </aside>
  );
}
