import { NextRequest, NextResponse } from "next/server";
import { slugSchema } from "@/lib/db/schemas";
import {
  isBookmarked,
  addBookmark,
  removeBookmark,
  listBookmarks,
} from "@/lib/db/repositories";
import { getSession } from "@/lib/db/auth";
import { isMongoConfigured } from "@/lib/mongo";
import { getArticleBySlug, metaOf } from "@/lib/articles";

export const dynamic = "force-dynamic";

/** GET /api/bookmarks — signed-in list (slugs or full articles). */
export async function GET(req: NextRequest) {
  if (!isMongoConfigured()) {
    return NextResponse.json({ bookmarks: [] });
  }
  const { user } = await getSession();
  if (!user) {
    return NextResponse.json({ bookmarks: [] });
  }

  const full = req.nextUrl.searchParams.get("full") === "true";
  const docs = await listBookmarks(user._id, 200);

  if (!full) {
    return NextResponse.json({ bookmarks: docs.map((d) => d.articleSlug) });
  }

  // Fetch full article metadata for each bookmark
  const bookmarks = docs
    .map((d) => getArticleBySlug(d.articleSlug))
    .filter((a): a is NonNullable<typeof a> => a !== null)
    .map(metaOf);

  return NextResponse.json({ bookmarks });
}

/** PUT /api/bookmarks { slug } — toggle (idempotent add/remove). */
export async function PUT(req: NextRequest) {
  if (!isMongoConfigured()) {
    return NextResponse.json({ error: "Bookmarks need a database." }, { status: 503 });
  }
  const { user } = await getSession();
  if (!user) {
    return NextResponse.json({ error: "Sign in to bookmark." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const parsed = slugSchema.safeParse((body as { slug?: unknown }).slug ?? "");
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid slug." }, { status: 400 });
  }
  const slug = parsed.data;

  const already = await isBookmarked(user._id, slug);
  if (already) {
    await removeBookmark(user._id, slug);
    return NextResponse.json({ bookmarked: false, slug });
  }
  await addBookmark(user._id, slug);
  return NextResponse.json({ bookmarked: true, slug });
}