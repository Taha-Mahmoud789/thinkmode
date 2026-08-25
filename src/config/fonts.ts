import type { Metadata } from "next";
import { Inter, Inter_Tight, JetBrains_Mono } from "next/font/google";

/**
 * Fonts are self-hosted by next/font (zero layout shift, no external requests).
 * --font-* variables feed the Tailwind theme in globals.css.
 */
export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
  display: "swap",
});

export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

/** Apply on <html> so the CSS variables resolve everywhere. */
export const fontVariables = `${inter.variable} ${interTight.variable} ${jetbrainsMono.variable}`;

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://thinkmode.dev"),
};
