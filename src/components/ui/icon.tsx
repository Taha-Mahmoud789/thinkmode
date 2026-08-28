import type { IconName } from "@/types";

/**
 * Single-source inline icon system (stroke-based, currentColor, 24px grid).
 * Server-component friendly — no client JS.
 */

const PATHS: Record<IconName, string> = {
  sparkles:
    "M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3Zm7 11l.95 2.55L22.5 18.5l-2.55.95L19 22l-.95-2.55L15.5 18.5l2.55-.95L19 14ZM5 14l.95 2.55L8.5 17.5l-2.55.95L5 21l-.95-2.55L1.5 17.5l2.55-.95L5 14Z",
  globe:
    "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm-9-9h18M12 3c2.5 2.6 3.9 5.6 3.9 9s-1.4 6.4-3.9 9c-2.5-2.6-3.9-5.6-3.9-9S9.5 5.6 12 3Z",
  code: "M16 18l6-6-6-6M8 6l-6 6 6 6",
  cloud:
    "M17.5 19a4.5 4.5 0 0 0 .42-8.98 7 7 0 0 0-13.63 1.74A4 4 0 0 0 6 19h11.5Z",
  shield:
    "M12 22s8-3.5 8-10V5.5L12 2 4 5.5V12c0 6.5 8 10 8 10Zm-2.5-10.5L11.5 13.5l4-4.5",
  tool:
    "M14.7 6.3a4.5 4.5 0 0 0-6.03 5.87L3 17.83V21h3.17l5.66-5.67a4.5 4.5 0 0 0 5.87-6.03L14.5 12.5l-3-3 3.2-3.2Z",
  search: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm10 2-4.35-4.35",
  sun: "M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0-15v2m0 16v2M4.2 4.2l1.4 1.4m12.8 12.8 1.4 1.4M2 12h2m16 0h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4",
  moon: "M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z",
  menu: "M4 6h16M4 12h16M4 18h16",
  close: "M6 6l12 12M18 6L6 18",
  bookmark: "M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16Z",
  "arrow-right": "M5 12h14m-6-6 6 6-6 6",
  "arrow-up-right": "M7 17 17 7M9 7h8v8",
  calendar:
    "M8 2v4m8-4v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z",
  clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-14v5l3.5 2",
  share:
    "M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7m-4-6-4-4-4 4m4-4v13",
  copy: "M9 9h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V11a2 2 0 0 1 2-2Zm-4 8H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v1",
  check: "M20 6 9 17l-5-5",
  "chevron-down": "m6 9 6 6 6-6",
  "chevron-right": "m9 6 6 6-6 6",
  "chevron-left": "m15 6-6 6 6 6",
  mail: "M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm0 2 8 6 8-6",
  rss: "M4 11a9 9 0 0 1 9 9M4 4a16 16 0 0 1 16 16M6 19a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z",
  github:
    "M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21",
  linkedin:
    "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4V8h4v1.5A5.4 5.4 0 0 1 16 8ZM6 9H2v12h4V9ZM4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z",
  "x-social":
    "M4 4l7.1 9.3L4.4 20h2.5l5.3-5.4L16.4 20H20l-7.4-9.7L18.9 4h-2.5l-4.7 4.9L8 4H4Z",
  "trending-up": "M22 7 13.5 15.5 8.5 10.5 2 17l2 2 4.5-4.5 5 5L22 9V7Z",
  zap: "M13 2 3 14h7l-1 8 10-12h-7l1-8Z",
  "book-open": "M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2V3Zm20 0h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7V3Z",
  users:
    "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm14 10v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
  info: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-13v.01M12 11v6",
  "alert-triangle":
    "M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z",
  lightbulb:
    "M9 18h6m-5 3h4m-2-21a7 7 0 0 0-4 12.7c.6.5 1 1.4 1 2.3h6c0-.9.4-1.8 1-2.3A7 7 0 0 0 12 0Z",
  layers: "M12 2 2 7l10 5 10-5-10-5ZM2 17l10 5 10-5M2 12l10 5 10-5",
  list: "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01",
  external: "M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6",
  play: "M6 4.5v15a1 1 0 0 0 1.54.84l12-7.5a1 1 0 0 0 0-1.68l-12-7.5A1 1 0 0 0 6 4.5Z",
  message:
    "M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z",
  cpu: "M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3M5 5h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Zm2 4h10v6H7V9Z",
  chip: "M7 7h10v10H7V7Zm0-4h2v4H7V3Zm8 0h2v4h-2V3ZM7 17h2v4H7v-4Zm8 0h2v4h-2v-4ZM3 9h4v2H3V9Zm0 4h4v2H3v-2Zm14-4h4v2h-4V9Zm0 4h4v2h-4v-2Z",
  app: "M4 4h7v7H4V4Zm9 0h7v7h-7V4ZM4 13h7v7H4v-7Zm9 0h7v7h-7v-7Z",
  phone: "M5 2h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 11l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 4a2 2 0 0 1 2-2Z",
  lock: "M6 10V7a6 6 0 0 1 12 0v3M5 10h14a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1Zm6 4v3m2-3v3",
  database: "M12 3c4.4 0 8 1.3 8 3s-3.6 3-8 3-8-1.3-8-3 3.6-3 8-3Zm8 5.5c0 1.7-3.6 3-8 3s-8-1.3-8-3M4 17c0 1.7 3.6 3 8 3s8-1.3 8-3",
  car: "M5 16a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm14 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM3 11l2-5h14l2 5v5H3v-5Zm3 0h12",
  watch: "M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0 3v2l1.5 1.5M9 4h6l-1 3M9 20h6l1-3",
  user: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z",
  "log-in": "M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3",
  "log-out": "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9",
};

export interface IconProps {
  name: IconName;
  /** Pixel size (square). Defaults to 20. */
  size?: number;
  className?: string;
  strokeWidth?: number;
}

export function Icon({ name, size = 20, className = "", strokeWidth = 1.8 }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
