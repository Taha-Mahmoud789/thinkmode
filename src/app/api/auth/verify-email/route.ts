import { NextRequest, NextResponse } from "next/server";
import { emailSchema } from "@/lib/db/schemas";
import { findUserByEmail } from "@/lib/db/repositories";
import { createEmailVerificationToken } from "@/lib/db/repositories";
import { hashToken } from "@/lib/db/crypto";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { enforceCsrf } from "@/lib/csrf";
import { isMongoConfigured } from "@/lib/mongo";

export const dynamic = "force-dynamic";

/** POST /api/auth/verify-email — send verification email (or log token in dev). */
export async function POST(req: NextRequest) {
  // Rate limit
  const rl = await checkRateLimit(getClientIp(req), true);
  if (!rl.success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429, headers: { "Retry-After": "60" } },
    );
  }

  // CSRF
  const csrfError = await enforceCsrf(req);
  if (csrfError) return csrfError;

  if (!isMongoConfigured()) {
    return NextResponse.json({ error: "Not enabled." }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const raw = body as { email?: unknown };
  const email = emailSchema.safeParse(raw.email ?? "");
  if (!email.success) {
    return NextResponse.json({ error: "Enter a valid email." }, { status: 400 });
  }

  const user = await findUserByEmail(email.data);
  if (user && !user.emailVerified) {
    const { generateSessionToken } = await import("@/lib/db/crypto");
    const token = generateSessionToken();
    const tokenHash = hashToken(token);
    await createEmailVerificationToken(user._id, tokenHash);

    if (process.env.NODE_ENV === "development") {
      console.log(`[DEV] Email verification token for ${email.data}: ${token}`);
    }
  }

  return NextResponse.json({
    ok: true,
    message: "If an account exists and isn't verified, a verification link has been sent.",
  });
}