import { cookies } from "next/headers";
import { randomBytes, createHash } from "node:crypto";

const CSRF_COOKIE = "csrf_token";
const CSRF_HEADER = "x-csrf-token";

/** Generate a new CSRF token and set cookie. */
export async function generateCsrfToken(): Promise<string> {
  const cookieStore = await cookies();
  const token = randomBytes(32).toString("base64url");
  const hashed = createHash("sha256").update(token).digest("hex");
  
  cookieStore.set(CSRF_COOKIE, hashed, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24, // 24 hours
  });
  
  return token;
}

/** Verify CSRF token from header against cookie. */
export async function verifyCsrfToken(request: Request): Promise<boolean> {
  const cookieStore = await cookies();
  const cookieHash = cookieStore.get(CSRF_COOKIE)?.value;
  const headerToken = request.headers.get(CSRF_HEADER);
  
  if (!cookieHash || !headerToken) return false;
  
  const headerHash = createHash("sha256").update(headerToken).digest("hex");
  return headerHash === cookieHash;
}

/** Get CSRF token for client-side forms (reads from cookie, returns raw token). */
export async function getCsrfToken(): Promise<string | null> {
  const cookieStore = await cookies();
  // We can't get raw token from hashed cookie, so this is for server components
  // Client should read from a meta tag or response header
  return null;
}

/** Middleware helper to enforce CSRF on mutating requests. */
export async function enforceCsrf(request: Request): Promise<Response | null> {
  if (["GET", "HEAD", "OPTIONS"].includes(request.method)) return null;
  
  const valid = await verifyCsrfToken(request);
  if (!valid) {
    return new Response(JSON.stringify({ error: "Invalid CSRF token" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }
  return null;
}