import { NextRequest, NextResponse } from "next/server";
import { getSession, toObjectId } from "@/lib/db/auth";
import { getDb } from "@/lib/mongo";
import { isMongoConfigured } from "@/lib/mongo";
import type { SessionDoc } from "@/lib/db/schemas";

export const dynamic = "force-dynamic";

export interface SessionView {
  id: string;
  createdAt: string;
  expiresAt: string;
  isCurrent: boolean;
}

/** GET /api/auth/sessions — list all active sessions for current user. */
export async function GET() {
  if (!isMongoConfigured()) {
    return NextResponse.json({ sessions: [] });
  }

  const { session, user } = await getSession();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sessions = await getDb()
    .collection<SessionDoc>("sessions")
    .find({ userId: user._id, expiresAt: { $gt: new Date() } })
    .sort({ createdAt: -1 })
    .toArray();

  const views: SessionView[] = sessions.map((s) => ({
    id: s._id.toHexString(),
    createdAt: s.createdAt.toISOString(),
    expiresAt: s.expiresAt.toISOString(),
    isCurrent: session ? s._id.equals(session._id) : false,
  }));

  return NextResponse.json({ sessions: views });
}

/** DELETE /api/auth/sessions?id=... — revoke a specific session. */
export async function DELETE(req: NextRequest) {
  if (!isMongoConfigured()) {
    return NextResponse.json({ error: "Not enabled." }, { status: 503 });
  }

  const { user } = await getSession();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const idRaw = req.nextUrl.searchParams.get("id") ?? "";
  const id = toObjectId(idRaw);
  if (!id) {
    return NextResponse.json({ error: "Invalid session id." }, { status: 400 });
  }

  // Only delete sessions belonging to the current user
  const result = await getDb()
    .collection<SessionDoc>("sessions")
    .deleteOne({ _id: id, userId: user._id });

  if (result.deletedCount === 0) {
    return NextResponse.json({ error: "Session not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
