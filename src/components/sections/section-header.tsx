import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import type { ReactNode } from "react";
import type { IconName } from "@/types";

interface SectionHeaderProps {
  kicker: string;
  title: ReactNode;
  description?: string;
  linkHref?: string;
  linkLabel?: string;
  align?: "left" | "center";
}

/** Consistent section heading: kicker line + display title + optional link. */
export function SectionHeader({
  kicker,
  title,
  description,
  linkHref,
  linkLabel = "View all",
  align = "left",
}: SectionHeaderProps) {
  const centered = align === "center";
  return (
    <div
      className={
        centered
          ? "mx-auto mb-12 max-w-2xl text-center"
          : "mb-10 flex flex-wrap items-end justify-between gap-4"
      }
    >
      <div className={centered ? "" : "max-w-2xl"}>
        <p className={`kicker ${centered ? "justify-center" : ""}`}>{kicker}</p>
        <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-text md:text-4xl">
          {title}
        </h2>
        {description ? (
          <p className="mt-3 leading-relaxed text-text-secondary">{description}</p>
        ) : null}
      </div>
      {linkHref && !centered ? (
        <Link
          href={linkHref}
          className="group inline-flex items-center gap-1.5 rounded-full text-sm font-medium text-text-secondary transition hover:text-text"
        >
          {linkLabel}
          <Icon
            name="arrow-right"
            size={15}
            className="transition-transform group-hover:translate-x-0.5"
          />
        </Link>
      ) : null}
    </div>
  );
}

interface CategoryCardProps {
  slug: string;
  name: string;
  description?: string;
  icon: IconName;
  accent: string;
  count: number;
}

/** Premium category tile with icon, name, count and hover interaction. */
export function CategoryCard({
  slug,
  name,
  description,
  icon,
  accent,
  count,
}: CategoryCardProps) {
  return (
    <Link
      href={`/categories/${slug}`}
      className="group relative flex items-center gap-4 overflow-hidden rounded-2xl border border-border bg-surface p-5 transition-all duration-300 hover:-translate-y-1 hover:border-border-strong"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(420px 160px at 12% 0%, ${accent}18, transparent 70%)`,
        }}
      />
      <span
        className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border transition-transform duration-300 group-hover:scale-105"
        style={{
          backgroundColor: `${accent}14`,
          borderColor: `${accent}40`,
          color: accent,
        }}
      >
        <Icon name={icon} size={22} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate font-display text-base font-semibold tracking-tight text-text transition-colors group-hover:text-text">
          {name}
        </span>
        {description ? (
          <span className="mt-0.5 block truncate text-sm text-text-tertiary">
            {description}
          </span>
        ) : null}
      </span>
      <span className="shrink-0 text-right">
        <span className="block font-display text-sm font-semibold tabular-nums text-text-secondary">
          {count} {count === 1 ? "article" : "articles"}
        </span>
      </span>
      <Icon
        name="chevron-right"
        size={16}
        className="shrink-0 text-text-tertiary transition-all duration-300 group-hover:translate-x-1 group-hover:text-text"
      />
    </Link>
  );
}
