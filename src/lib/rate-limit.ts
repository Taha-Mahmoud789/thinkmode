import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/**
 * Rate limiter using Upstash Redis (works on Vercel Edge/Serverless).
 * Falls back to no-op if Redis env vars are missing — safe for dev.
 */

const redisUrl = process.env.UPSTASH_REDIS_REST_URL ?? "";
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN ?? "";

/** Check if URL looks like a real Upstash REST URL (not placeholder). */
function isValidRedisUrl(url: string): boolean {
  return url.startsWith("https://") && !url.includes("<");
}

let ratelimit: Ratelimit | null = null;
let ratelimitStrict: Ratelimit | null = null;

if (isValidRedisUrl(redisUrl) && redisToken && !redisToken.includes("<")) {
  const redis = new Redis({ url: redisUrl, token: redisToken });

  // General API: 60 requests/minute per IP
  ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(60, "1 m"),
    analytics: true,
    prefix: "rl:api",
  });

  // Strict endpoints (auth, comments write): 10 requests/minute per IP
  ratelimitStrict = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "1 m"),
    analytics: true,
    prefix: "rl:strict",
  });
}

/**
 * Check rate limit. Returns { success: boolean, limit, remaining, reset }.
 * If rate limiter not configured, always returns success.
 */
export async function checkRateLimit(
  identifier: string,
  strict = false,
): Promise<{
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}> {
  const limiter = strict ? ratelimitStrict : ratelimit;
  if (!limiter) {
    return { success: true, limit: 999, remaining: 999, reset: Date.now() + 60_000 };
  }
  return limiter.limit(identifier);
}

/** Extract client IP from request headers (Vercel/Next.js). */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp;
  return "unknown";
}