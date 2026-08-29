"use client";

import { useEffect, useState } from "react";
import { analytics } from "@/config/analytics";

interface VisitStats {
  total: number;
  today: number;
}

interface PresenceStats {
  online: number;
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
 * Footer traffic ribbon (GoatCounter-backed) + live presence count.
 *
 * Total + Today are fetched from the server-side GoatCounter proxy
 * (/api/visits). Online Now is fetched from /api/presence which tracks
 * heartbeats from active browser tabs.
 *
 * Collapses to nothing until GoatCounter is configured.
 */
export function VisitorCounter() {
  const [stats, setStats] = useState<VisitStats | null>(null);
  const [online, setOnline] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadVisits = async () => {
      try {
        const res = await fetch("/api/visits", { cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json()) as VisitStats;
        if (!cancelled) setStats(data);
      } catch {
        // Proxy unreachable — keep last values.
      }
    };

    const loadPresence = async () => {
      try {
        const res = await fetch("/api/presence", { cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json()) as PresenceStats;
        if (!cancelled) setOnline(data.online);
      } catch {
        // Ignore — next interval will retry.
      }
    };

    const loadAll = () => {
      void loadVisits();
      void loadPresence();
    };

    loadAll();
    const interval = window.setInterval(loadAll, 60_000);

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
      {online !== null && online > 0 && (
        <Stat label="Online now" value={online} />
      )}
    </dl>
  );
}
