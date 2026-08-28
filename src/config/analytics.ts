/**
 * Analytics configuration (GoatCounter).
 *
 * Create a free account at https://www.goatcounter.com, then generate an API
 * key in the menu (Username → API). Set these env vars:
 *
 *   NEXT_PUBLIC_GOATCOUNTER_DOMAIN  e.g. "thinkmode"  (from https://thinkmode.goatcounter.com)
 *   GOATCOUNTER_API_KEY             the bearer token for server-side stats
 *
 * The public embed script at <domain>.goatcounter.com/count.js is shared with
 * readers (no secret). The API key stays server-only and is read in the
 * /api/visits route to power the footer ribbon.
 */
export const analytics = {
  goatcounterDomain: process.env.NEXT_PUBLIC_GOATCOUNTER_DOMAIN ?? "",
  goatcounterEndpoint: process.env.NEXT_PUBLIC_GOATCOUNTER_DOMAIN
    ? `https://${process.env.NEXT_PUBLIC_GOATCOUNTER_DOMAIN}.goatcounter.com`
    : "",
  /** Server-only. */
  apiKey: process.env.GOATCOUNTER_API_KEY ?? "",
  enabled: Boolean(process.env.NEXT_PUBLIC_GOATCOUNTER_DOMAIN),
} as const;

export type AnalyticsConfig = typeof analytics;