import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { deleteSession } from "@/lib/db/repositories";
import { hashToken } from "@/lib/db/crypto";
import { isMongoConfigured } from "@/lib/mongo";
import { SESSION_COOKIE } from "@/lib/db/auth";

export const dynamic = "force-dynamic";

/** POST /api/auth/logout — revoke the current session + clear the cookie. */
export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (token && isMongoConfigured()) {
    await deleteSession(hashToken(token));
  }
  // Expire immediately even if the DB write failed.
  cookieStore.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return NextResponse.json({ ok: true });
}