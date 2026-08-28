"use client";

import { useEffect, useState } from "react";
import { analytics } from "@/config/analytics";

interface VisitStats {
  total: number;
  today: number;
}

function Stat({ label, value }: { label: string; value?: number }) {
  return (
    <div className="flex items-baseline gap-2">
      <dt className="text-[10px] font-medium uppercase tracking-[0.18em] text-text-tertiary">
        {label}
      </dt>
      <dd className="font-mono text-sm font-semibold tabular-nums text-text">
        {value === undefined ? "—" : value.toLocaleString("en-US")}
      </dd>
    </div>
  );
}

/**
 * Footer traffic ribbon (GoatCounter-backed).
 *
 * Total + Today are fetched from the server-side GoatCounter proxy
 * (/api/visits) so the API bearer token never reaches the browser. The
 * count.js embed (see Analytics) feeds pageviews to GoatCounter, whose own
 * dashboard shows live "reading now" — the footer intentionally keeps the two
 * reliable daily numbers and stays out of live-session polling to avoid a
 * fragile live endpoint.
 *
 * Collapses to nothing until GoatCounter is configured.
 */
export function VisitorCounter() {
  const [stats, setStats] = useState<VisitStats | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch("/api/visits", { cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json()) as VisitStats;
        if (!cancelled) setStats(data);
      } catch {
        // Proxy unreachable — keep last values.
      }
    };
    void load();
    const interval = window.setInterval(load, 60_000);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, []);

  if (!analytics.enabled) return null;

  return (
    <dl
      aria-label="Site traffic"
      className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3"
    >
      <Stat label="Total visits" value={stats?.total} />
      <Stat label="Today" value={stats?.today} />
    </dl>
  );
}