import { NextResponse } from "next/server";
import { getSession } from "@/lib/db/auth";
import { isMongoConfigured } from "@/lib/mongo";

export const dynamic = "force-dynamic";

/** GET /api/auth/me — current signed-in user (or null). */
export async function GET() {
  if (!isMongoConfigured()) {
    return NextResponse.json({ user: null });
  }
  const { user } = await getSession();
  if (!user) {
    return NextResponse.json({ user: null });
  }
  return NextResponse.json({
    user: { id: user._id.toHexString(), username: user.username, email: user.email, isAdmin: user.isAdmin },
  });
}