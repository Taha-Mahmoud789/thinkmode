import { NextRequest, NextResponse } from "next/server";
import { getSession, toObjectId } from "@/lib/db/auth";
import { listReports, updateReportStatus, hideComment } from "@/lib/db/repositories";
import { isMongoConfigured } from "@/lib/mongo";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

/** GET /api/admin/reports?status=pending — list reports (admin only). */
export async function GET(req: NextRequest) {
  const rl = await checkRateLimit(getClientIp(req), false);
  if (!rl.success) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }

  if (!isMongoConfigured()) {
    return NextResponse.json({ reports: [] });
  }

  const { user } = await getSession();
  if (!user || !user.isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const status = req.nextUrl.searchParams.get("status") ?? undefined;
  const reports = await listReports(status);
  return NextResponse.json({ reports });
}

/** PUT /api/admin/reports — dismiss or hide (admin only). */
export async function PUT(req: NextRequest) {
  const rl = await checkRateLimit(getClientIp(req), true);
  if (!rl.success) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }

  if (!isMongoConfigured()) {
    return NextResponse.json({ error: "Not enabled." }, { status: 503 });
  }

  const { user } = await getSession();
  if (!user || !user.isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const { reportId, action } = body as { reportId?: unknown; action?: unknown };
  const id = toObjectId(typeof reportId === "string" ? reportId : "");
  if (!id) {
    return NextResponse.json({ error: "Invalid report id." }, { status: 400 });
  }

  if (action === "dismiss") {
    await updateReportStatus(id, "dismissed");
    return NextResponse.json({ ok: true });
  }

  if (action === "hide") {
    // Find report to get commentId
    const { getDb } = await import("@/lib/mongo");
    const report = await getDb()
      .collection("comment_reports")
      .findOne({ _id: id });
    if (!report) {
      return NextResponse.json({ error: "Report not found." }, { status: 404 });
    }
    await hideComment(report.commentId);
    await updateReportStatus(id, "reviewed");
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Invalid action. Use 'dismiss' or 'hide'." }, { status: 400 });
}