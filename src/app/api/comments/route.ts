import { NextRequest, NextResponse } from "next/server";
import { commentBodySchema } from "@/lib/db/schemas";
import { listComments, addComment, deleteComment } from "@/lib/db/repositories";
import { getSession, toObjectId } from "@/lib/db/auth";
import { isMongoConfigured } from "@/lib/mongo";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { enforceCsrf } from "@/lib/csrf";
import { sanitizeHtml } from "@/lib/sanitize";

export const dynamic = "force-dynamic";

/** GET /api/comments?slug=... — public list. */
export async function GET(req: NextRequest) {
  // Rate limit: general (60/min)
  const rl = await checkRateLimit(getClientIp(req), false);
  if (!rl.success) {
    return NextResponse.json(
      { error: "Too many requests." },
      { status: 429, headers: { "Retry-After": "60" } },
    );
  }

  if (!isMongoConfigured()) {
    return NextResponse.json({ comments: [], nextCursor: null, enabled: false });
  }
  const slug = req.nextUrl.searchParams.get("slug") ?? "";
  const cursor = req.nextUrl.searchParams.get("cursor") ?? undefined;
  const page = await listComments(slug, 20, cursor);
  return NextResponse.json({ ...page, enabled: true });
}

/** POST /api/comments — authenticated. */
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
    return NextResponse.json({ error: "Comments are not enabled yet." }, { status: 503 });
  }

  const { user } = await getSession();
  if (!user) {
    return NextResponse.json({ error: "You must be signed in to comment." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const parsed = commentBodySchema.safeParse((body as { body?: unknown }).body ?? "");
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid comment." },
      { status: 400 },
    );
  }
  const slugRaw = (body as { slug?: unknown }).slug;
  if (typeof slugRaw !== "string" || !/^[a-z0-9-]{1,200}$/.test(slugRaw)) {
    return NextResponse.json({ error: "Invalid article slug." }, { status: 400 });
  }

  // Sanitize comment body
  const cleanBody = sanitizeHtml(parsed.data);

  const comment = await addComment({
    articleSlug: slugRaw,
    userId: user._id,
    username: user.username,
    body: parsed.data,
  });
  return NextResponse.json({ comment }, { status: 201 });
}

/** DELETE /api/comments?id=... — author or (future) mod only. */
export async function DELETE(req: NextRequest) {
  if (!isMongoConfigured()) {
    return NextResponse.json({ error: "Comments are not enabled yet." }, { status: 503 });
  }
  const { user } = await getSession();
  if (!user) {
    return NextResponse.json({ error: "You must be signed in." }, { status: 401 });
  }

  const idRaw = req.nextUrl.searchParams.get("id") ?? "";
  const id = toObjectId(idRaw);
  if (!id) {
    return NextResponse.json({ error: "Invalid comment id." }, { status: 400 });
  }

  const ok = await deleteComment(id, user._id);
  if (!ok) {
    return NextResponse.json({ error: "Comment not found or not yours." }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}