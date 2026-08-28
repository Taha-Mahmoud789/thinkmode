import { NextRequest, NextResponse } from "next/server";
import { analytics } from "@/config/analytics";

/**
 * Footer traffic ribbon data, proxied from GoatCounter.
 *
 * The stats API is protected by a bearer token that must never reach the
 * browser, so the footer reads totals through this server-side proxy instead
 * of calling GoatCounter from the client.
 *
 *   GET /api/visits  ->  { total, today }
 *
 * Live "Reading now" is rendered by GoatCounter's own count.js widget
 * (goatcounter.visitors()) rather than a polled API — see visitor-counter.tsx.
 * If GoatCounter is unconfigured this returns zeros so the ribbon degrades.
 */
interface GoatTotal {
  total: number;
}
interface GoatHits {
  rows?: { total?: number }[];
}

const base = analytics.goatcounterEndpoint;
const headers = analytics.apiKey
  ? ({
      "Content-Type": "application/json",
      Authorization: `Bearer ${analytics.apiKey}`,
    } as const)
  : null;

export async function GET(req: NextRequest) {
  if (!base || !headers) {
    return NextResponse.json({ total: 0, today: 0 });
  }

  try {
    const [totalRes, hitsRes] = await Promise.all([
      fetch(`${base}/api/v0/stats/total`, { headers, cache: "no-store" }),
      fetch(`${base}/api/v0/stats/hits?start=-1d&end=0`, {
        headers,
        cache: "no-store",
      }),
    ]);

    const totalData = (await totalRes.json()) as GoatTotal;
    let today = 0;
    try {
      today = ((await hitsRes.json()) as GoatHits).rows?.[0]?.total ?? 0;
    } catch {
      today = 0;
    }

    return NextResponse.json({ total: totalData.total ?? 0, today });
  } catch {
    return NextResponse.json({ total: 0, today: 0 });
  }
}