import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { emailSchema, passwordSchema } from "@/lib/db/schemas";
import { findUserByEmail, createSession } from "@/lib/db/repositories";
import { verifyPassword, generateSessionToken, hashToken } from "@/lib/db/crypto";
import { isMongoConfigured } from "@/lib/mongo";
import { SESSION_COOKIE, SESSION_TTL_MS } from "@/lib/db/auth";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { enforceCsrf } from "@/lib/csrf";

export const dynamic = "force-dynamic";

/** POST /api/auth/login — verify credentials, set session cookie. */
export async function POST(req: NextRequest) {
  // Rate limit: strict (10/min)
  const rl = await checkRateLimit(getClientIp(req), true);
  if (!rl.success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429, headers: { "Retry-After": "60" } },
    );
  }

  // CSRF protection
  const csrfError = await enforceCsrf(req);
  if (csrfError) return csrfError;

  if (!isMongoConfigured()) {
    return NextResponse.json(
      { error: "Sign-in is not enabled yet." },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const raw = body as { email?: unknown; password?: unknown };
  const email = emailSchema.safeParse(raw.email ?? "");
  const password = passwordSchema.safeParse(raw.password ?? "");
  if (!email.success) {
    return NextResponse.json({ error: "Enter a valid email." }, { status: 400 });
  }
  if (!password.success) {
    return NextResponse.json({ error: "Enter your password." }, { status: 400 });
  }

  const user = await findUserByEmail(email.data);
  const valid = user
    ? await verifyPassword(password.data, user.passwordHash)
    : false;

  // Uniform error to avoid user enumeration.
  if (!user || !valid) {
    return NextResponse.json(
      { error: "Incorrect email or password." },
      { status: 401 },
    );
  }

  const token = generateSessionToken();
  await createSession({
    userId: user._id,
    tokenHash: hashToken(token),
    ttlMs: SESSION_TTL_MS,
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_MS / 1000,
  });

  return NextResponse.json({
    user: { id: user._id.toHexString(), username: user.username, email: user.email },
  });
}