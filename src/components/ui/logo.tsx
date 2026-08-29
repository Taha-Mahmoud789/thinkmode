import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: number;
  showWordmark?: boolean;
  className?: string;
}

/** ThinkMode wordmark — clean editorial style inspired by MAGZIN */
export function Logo({ showWordmark = true, className = "" }: LogoProps) {
  return (
    <span className={cn("inline-flex items-center", className)}>
      {showWordmark ? (
        <span className="font-display text-xl font-bold tracking-tight text-text">
          Think<span className="text-primary">Mode</span>.
        </span>
      ) : null}
    </span>
  );
}

export function LogoLink({ showWordmark, className }: LogoProps) {
  return (
    <Link
      href="/"
      aria-label="ThinkMode — home"
      className="rounded-md transition-opacity hover:opacity-85"
    >
      <Logo showWordmark={showWordmark} className={className} />
    </Link>
  );
}
