"use client";

import { useEffect } from "react";
import { analytics } from "@/config/analytics";

declare global {
  interface Window {
    goatcounter?: {
      count?: () => void;
      visitors?: () => void;
      no_sv?: boolean;
    };
  }
}

/**
 * Loads the GoatCounter tracking script once. Exported so GoatCounter's
 * count.js works hydrated, and it's included on the root layout so every
 * pageview is counted.
 */
export function Analytics() {
  useEffect(() => {
    if (!analytics.goatcounterEndpoint || typeof window === "undefined") return;

    const existing = document.querySelector<HTMLScriptElement>(
      `script[data-goatcounter="${analytics.goatcounterEndpoint}"]`,
    );
    if (existing) return;

    const script = document.createElement("script");
    script.async = true;
    script.dataset.goatcounter = analytics.goatcounterEndpoint;
    script.src = `${analytics.goatcounterEndpoint}/count.js`;
    script.onerror = () => {
      // Analtyics must never break the page.
    };
    document.head.appendChild(script);
  }, []);

  return null;
}