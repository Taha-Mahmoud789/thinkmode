import { NextRequest, NextResponse } from "next/server";
import { reportComment } from "@/lib/db/repositories";
import { getSession, toObjectId } from "@/lib/db/auth";
import { isMongoConfigured } from "@/lib/mongo";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { enforceCsrf } from "@/lib/csrf";

export const dynamic = "force-dynamic";

const REASONS = ["spam", "harassment", "hate", "offtopic", "other"] as const;

/** POST /api/comments/report — report a comment. */
export async function POST(req: NextRequest) {
  const rl = await checkRateLimit(getClientIp(req), true);
  if (!rl.success) {
    return NextResponse.json(
      { error: "Too many requests." },
      { status: 429, headers: { "Retry-After": "60" } },
    );
  }

  const csrfError = await enforceCsrf(req);
  if (csrfError) return csrfError;

  if (!isMongoConfigured()) {
    return NextResponse.json({ error: "Not enabled." }, { status: 503 });
  }

  const { user } = await getSession();
  if (!user) {
    return NextResponse.json({ error: "You must be signed in." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const { commentId, reason } = body as { commentId?: unknown; reason?: unknown };
  const id = toObjectId(typeof commentId === "string" ? commentId : "");
  if (!id) {
    return NextResponse.json({ error: "Invalid comment id." }, { status: 400 });
  }
  if (typeof reason !== "string" || !REASONS.includes(reason as typeof REASONS[number])) {
    return NextResponse.json({ error: "Invalid report reason." }, { status: 400 });
  }

  const created = await reportComment({
    commentId: id,
    reporterId: user._id,
    reason,
  });
  if (!created) {
    return NextResponse.json({ error: "You already reported this comment." }, { status: 409 });
  }

  return NextResponse.json({ ok: true });
}