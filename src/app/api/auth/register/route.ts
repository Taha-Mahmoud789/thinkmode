import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  emailSchema,
  passwordSchema,
  usernameSchema,
} from "@/lib/db/schemas";
import {
  findUserByEmail,
  createUser,
  createSession,
} from "@/lib/db/repositories";
import {
  hashPassword,
  generateSessionToken,
  hashToken,
} from "@/lib/db/crypto";
import { isMongoConfigured } from "@/lib/mongo";
import { SESSION_COOKIE, SESSION_TTL_MS } from "@/lib/db/auth";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { enforceCsrf } from "@/lib/csrf";

export const dynamic = "force-dynamic";

/** POST /api/auth/register — create account, start a session. */
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
      { error: "Registration is not enabled yet." },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const raw = body as { username?: unknown; email?: unknown; password?: unknown };
  const username = usernameSchema.safeParse(raw.username ?? "");
  const email = emailSchema.safeParse(raw.email ?? "");
  const password = passwordSchema.safeParse(raw.password ?? "");
  if (!username.success || !email.success || !password.success) {
    return NextResponse.json(
      {
        error:
          username.error?.issues[0]?.message ??
          email.error?.issues[0]?.message ??
          password.error?.issues[0]?.message ??
          "Invalid input.",
      },
      { status: 400 },
    );
  }

  const existing = await findUserByEmail(email.data);
  if (existing) {
    return NextResponse.json(
      { error: "An account with that email already exists." },
      { status: 409 },
    );
  }

  const passwordHash = await hashPassword(password.data);
  const user = await createUser({
    username: username.data,
    email: email.data,
    passwordHash,
  });

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

  return NextResponse.json(
    { user: { id: user._id.toHexString(), username: user.username, email: user.email } },
    { status: 201 },
  );
}