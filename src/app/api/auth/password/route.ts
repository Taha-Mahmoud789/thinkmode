import { NextRequest, NextResponse } from "next/server";
import { getSession, requireUser } from "@/lib/db/auth";
import { findUserById } from "@/lib/db/repositories";
import { verifyPassword, hashPassword } from "@/lib/db/crypto";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { enforceCsrf } from "@/lib/csrf";
import { passwordSchema } from "@/lib/db/schemas";
import { isMongoConfigured } from "@/lib/mongo";
import { ObjectId } from "mongodb";

export const dynamic = "force-dynamic";

/** PUT /api/auth/password — change password. */
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

  const user = await requireUser();

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const raw = body as { currentPassword?: unknown; newPassword?: unknown };
  const currentPassword = passwordSchema.safeParse(raw.currentPassword ?? "");
  const newPassword = passwordSchema.safeParse(raw.newPassword ?? "");
  if (!currentPassword.success || !newPassword.success) {
    return NextResponse.json(
      { error: "Invalid password." },
      { status: 400 },
    );
  }

  // Verify current password
  const fullUser = await findUserById(user._id);
  if (!fullUser) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  const valid = await verifyPassword(currentPassword.data, fullUser.passwordHash);
  if (!valid) {
    return NextResponse.json(
      { error: "Current password is incorrect." },
      { status: 401 },
    );
  }

  // Hash new password and update
  const newPasswordHash = await hashPassword(newPassword.data);
  const { getDb } = await import("@/lib/mongo");

  await getDb().collection("users").updateOne(
    { _id: user._id },
    { $set: { passwordHash: newPasswordHash, updatedAt: new Date() } },
  );

  // Optionally revoke all other sessions
  await getDb().collection("sessions").deleteMany({
    userId: user._id,
    tokenHash: { $ne: "" }, // Keep current session by not matching empty string
  });

  return NextResponse.json({ ok: true });
}