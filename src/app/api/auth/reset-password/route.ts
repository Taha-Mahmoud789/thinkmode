import { NextRequest, NextResponse } from "next/server";
import { passwordSchema } from "@/lib/db/schemas";
import { findValidPasswordResetToken, markPasswordResetTokenUsed, setUserEmailVerified } from "@/lib/db/repositories";
import { hashPassword, hashToken } from "@/lib/db/crypto";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { enforceCsrf } from "@/lib/csrf";
import { isMongoConfigured } from "@/lib/mongo";
import { ObjectId } from "mongodb";

export const dynamic = "force-dynamic";

/** PUT /api/auth/reset-password — verify token and set new password. */
export async function PUT(req: NextRequest) {
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

  const raw = body as { token?: unknown; password?: unknown };
  const token = passwordSchema.safeParse(raw.token ?? "");
  const password = passwordSchema.safeParse(raw.password ?? "");
  if (!token.success || !password.success) {
    return NextResponse.json(
      { error: "Invalid token or password." },
      { status: 400 },
    );
  }

  const tokenHash = hashToken(token.data);
  const resetDoc = await findValidPasswordResetToken(tokenHash);
  if (!resetDoc) {
    return NextResponse.json(
      { error: "Invalid or expired reset token." },
      { status: 400 },
    );
  }

  // Hash new password and update user
  const newPasswordHash = await hashPassword(password.data);
  const { getDb } = await import("@/lib/mongo");

  await getDb().collection("users").updateOne(
    { _id: resetDoc.userId },
    { $set: { passwordHash: newPasswordHash, updatedAt: new Date() } },
  );

  // Mark token as used
  await markPasswordResetTokenUsed(tokenHash);

  // Revoke all existing sessions for security
  await getDb().collection("sessions").deleteMany({ userId: resetDoc.userId });

  return NextResponse.json({ ok: true });
}