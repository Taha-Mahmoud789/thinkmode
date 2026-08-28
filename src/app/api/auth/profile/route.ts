import { NextRequest, NextResponse } from "next/server";
import { getSession, requireUser } from "@/lib/db/auth";
import { findUserByEmail, findUserById } from "@/lib/db/repositories";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { enforceCsrf } from "@/lib/csrf";
import { emailSchema, usernameSchema } from "@/lib/db/schemas";
import { isMongoConfigured } from "@/lib/mongo";

export const dynamic = "force-dynamic";

/** PUT /api/auth/profile — update username/email. */
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

  const raw = body as { username?: unknown; email?: unknown };
  const username = usernameSchema.safeParse(raw.username ?? "");
  const email = emailSchema.safeParse(raw.email ?? "");
  if (!username.success || !email.success) {
    return NextResponse.json(
      {
        error:
          username.error?.issues[0]?.message ??
          email.error?.issues[0]?.message ??
          "Invalid input.",
      },
      { status: 400 },
    );
  }

  // Check if email is taken by another user
  if (email.data !== user.email) {
    const existing = await findUserByEmail(email.data);
    if (existing) {
      return NextResponse.json(
        { error: "An account with that email already exists." },
        { status: 409 },
      );
    }
  }

  // Check if username is taken (would need a findUserByUsername function)
  // For now, we'll update directly in the DB
  const { getDb } = await import("@/lib/mongo");
  const { ObjectId } = await import("mongodb");

  await getDb().collection("users").updateOne(
    { _id: user._id },
    { $set: { username: username.data, email: email.data, updatedAt: new Date() } },
  );

  return NextResponse.json({
    user: { id: user._id.toHexString(), username: username.data, email: email.data },
  });
}