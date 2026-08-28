import { initials } from "@/lib/utils";

interface AuthorAvatarProps {
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "h-8 w-8 text-xs",
  md: "h-11 w-11 text-sm",
  lg: "h-16 w-16 text-lg",
};

/**
 * Generate a deterministic gradient from a name string.
 * Uses the name's char codes to pick from a curated palette.
 */
function nameToGradient(name: string): string {
  const gradients = [
    "from-emerald-400 to-teal-600",
    "from-cyan-400 to-blue-600",
    "from-violet-400 to-purple-600",
    "from-rose-400 to-pink-600",
    "from-amber-400 to-orange-600",
    "from-lime-400 to-green-600",
    "from-sky-400 to-indigo-600",
    "from-fuchsia-400 to-rose-600",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = ((hash << 5) - hash + name.charCodeAt(i)) | 0;
  }
  return gradients[Math.abs(hash) % gradients.length];
}

export function AuthorAvatar({ name, size = "md", className = "" }: AuthorAvatarProps) {
  const gradient = nameToGradient(name);
  const abbr = initials(name);

  return (
    <span
      aria-hidden="true"
      className={`grid place-items-center rounded-full bg-gradient-to-br font-display font-bold text-white shadow-sm ${sizeClasses[size]} ${gradient} ${className}`}
    >
      {abbr}
    </span>
  );
}