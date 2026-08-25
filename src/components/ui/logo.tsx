import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: number;
  showWordmark?: boolean;
  className?: string;
}

/** ThinkMode wordmark + geometric mark. Pure SVG/CSS — no image request. */
export function Logo({ size = 34, showWordmark = true, className = "" }: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 44 44"
        fill="none"
        aria-hidden="true"
        className="shrink-0"
      >
        <defs>
          <linearGradient id="tm-logo-g" x1="0" y1="0" x2="44" y2="44">
            <stop offset="0" stopColor="#9d6cff" />
            <stop offset="1" stopColor="#22d3ee" />
          </linearGradient>
        </defs>
        <rect
          x="1.25"
          y="1.25"
          width="41.5"
          height="41.5"
          rx="12"
          stroke="url(#tm-logo-g)"
          strokeWidth="2"
          fill="rgba(124,60,255,0.08)"
        />
        <circle cx="33" cy="33" r="3" fill="#22d3ee" />
        <path d="M13.5 15.5h17" stroke="url(#tm-logo-g)" strokeWidth="3.6" strokeLinecap="round" />
        <path d="M22 15.5V30" stroke="url(#tm-logo-g)" strokeWidth="3.6" strokeLinecap="round" />
      </svg>
      {showWordmark ? (
        <span className="font-display text-lg font-bold tracking-tight text-text">
          Think<span className="text-gradient">Mode</span>
        </span>
      ) : null}
    </span>
  );
}

export function LogoLink({ size, showWordmark, className }: LogoProps) {
  return (
    <Link
      href="/"
      aria-label="ThinkMode — home"
      className="rounded-md transition-opacity hover:opacity-85"
    >
      <Logo size={size} showWordmark={showWordmark} className={className} />
    </Link>
  );
}
