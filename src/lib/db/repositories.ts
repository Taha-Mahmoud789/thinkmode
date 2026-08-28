import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongo";
import type { UserDoc, SessionDoc, BookmarkDoc, CommentDoc, PasswordResetDoc, EmailVerificationDoc, CommentReportDoc } from "./schemas";

/**
 * Thin data-access layer over the MongoDB collections. Kept as plain
 * functions so route handlers stay small and the schema lives in one place.
 */

/* --------------------------------- Users --------------------------------- */

export async function findUserByEmail(email: string): Promise<UserDoc | null> {
  return getDb().collection<UserDoc>("users").findOne({ email });
}

export async function findUserById(id: ObjectId): Promise<UserDoc | null> {
  return getDb().collection<UserDoc>("users").findOne({ _id: id });
}

export async function createUser(input: {
  username: string;
  email: string;
  passwordHash: string;
}): Promise<UserDoc> {
  const now = new Date();
  const doc: UserDoc = {
    _id: new ObjectId(),
    username: input.username,
    email: input.email,
    passwordHash: input.passwordHash,
    emailVerified: false,
    isAdmin: false,
    createdAt: now,
    updatedAt: now,
  };
  await getDb().collection<UserDoc>("users").insertOne(doc);
  return doc;
}

/* -------------------------------- Sessions -------------------------------- */

export async function createSession(input: {
  userId: ObjectId;
  tokenHash: string;
  ttlMs: number;
}): Promise<SessionDoc> {
  const now = new Date();
  const doc: SessionDoc = {
    _id: new ObjectId(),
    userId: input.userId,
    tokenHash: input.tokenHash,
    expiresAt: new Date(now.getTime() + input.ttlMs),
    createdAt: now,
  };
  await getDb().collection<SessionDoc>("sessions").insertOne(doc);
  return doc;
}

export async function findSessionByTokenHash(
  tokenHash: string,
): Promise<SessionDoc | null> {
  return getDb()
    .collection<SessionDoc>("sessions")
    .findOne({ tokenHash, expiresAt: { $gt: new Date() } });
}

export async function deleteSession(tokenHash: string): Promise<void> {
  await getDb().collection<SessionDoc>("sessions").deleteOne({ tokenHash });
}

export async function deleteSessionsForUser(userId: ObjectId): Promise<void> {
  await getDb().collection<SessionDoc>("sessions").deleteMany({ userId });
}

/* -------------------------------- Bookmarks ------------------------------- */

export async function isBookmarked(
  userId: ObjectId,
  articleSlug: string,
): Promise<boolean> {
  const found = await getDb().collection<BookmarkDoc>("bookmarks").findOne({
    userId,
    articleSlug,
  });
  return Boolean(found);
}

export async function addBookmark(
  userId: ObjectId,
  articleSlug: string,
): Promise<void> {
  await getDb()
    .collection<BookmarkDoc>("bookmarks")
    .updateOne(
      { userId, articleSlug },
      { $setOnInsert: { _id: new ObjectId(), userId, articleSlug, createdAt: new Date() } },
      { upsert: true },
    );
}

export async function removeBookmark(
  userId: ObjectId,
  articleSlug: string,
): Promise<void> {
  await getDb().collection<BookmarkDoc>("bookmarks").deleteOne({
    userId,
    articleSlug,
  });
}

export async function listBookmarks(
  userId: ObjectId,
  limit = 50,
): Promise<BookmarkDoc[]> {
  return getDb()
    .collection<BookmarkDoc>("bookmarks")
    .find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray();
}

/* -------------------------------- Comments -------------------------------- */

export interface CommentView {
  id: string;
  userId: string;
  username: string;
  body: string;
  createdAt: string;
  updatedAt?: string;
}

const stripObjectId = (doc: CommentDoc): CommentView => ({
  id: doc._id.toHexString(),
  userId: doc.author.userId.toHexString(),
  username: doc.author.username,
  body: doc.body,
  createdAt: doc.createdAt.toISOString(),
  updatedAt: doc.updatedAt?.toISOString(),
});

export interface CommentPage {
  comments: CommentView[];
  nextCursor: string | null;
}

export async function listComments(
  articleSlug: string,
  limit = 20,
  cursor?: string,
): Promise<CommentPage> {
  const filter: Record<string, unknown> = { articleSlug, hidden: { $ne: true } };
  if (cursor) {
    const cursorDoc = await getDb()
      .collection<CommentDoc>("comments")
      .findOne({ _id: new ObjectId(cursor) });
    if (cursorDoc) {
      filter.createdAt = { $gt: cursorDoc.createdAt };
    }
  }

  const docs = await getDb()
    .collection<CommentDoc>("comments")
    .find(filter)
    .sort({ createdAt: 1 })
    .limit(limit + 1)
    .toArray();

  const hasMore = docs.length > limit;
  const sliced = hasMore ? docs.slice(0, limit) : docs;
  const nextCursor = hasMore
    ? sliced[sliced.length - 1]._id.toHexString()
    : null;

  return { comments: sliced.map(stripObjectId), nextCursor };
}

export async function addComment(input: {
  articleSlug: string;
  userId: ObjectId;
  username: string;
  body: string;
}): Promise<CommentView> {
  const doc: CommentDoc = {
    _id: new ObjectId(),
    articleSlug: input.articleSlug,
    author: { userId: input.userId, username: input.username },
    body: input.body,
    hidden: false,
    createdAt: new Date(),
  };
  await getDb().collection<CommentDoc>("comments").insertOne(doc);
  return stripObjectId(doc);
}

export async function deleteComment(
  commentId: ObjectId,
  userId: ObjectId,
): Promise<boolean> {
  const res = await getDb().collection<CommentDoc>("comments").deleteOne({
    _id: commentId,
    "author.userId": userId,
  });
  return res.deletedCount === 1;
}

/* ----------------------------- Password Resets ---------------------------- */

const RESET_TTL_MS = 60 * 60 * 1000; // 1 hour

export async function createPasswordResetToken(
  userId: ObjectId,
  tokenHash: string,
): Promise<PasswordResetDoc> {
  const now = new Date();
  const doc: PasswordResetDoc = {
    _id: new ObjectId(),
    userId,
    tokenHash,
    expiresAt: new Date(now.getTime() + RESET_TTL_MS),
    createdAt: now,
    used: false,
  };
  await getDb().collection<PasswordResetDoc>("password_resets").insertOne(doc);
  return doc;
}

export async function findValidPasswordResetToken(
  tokenHash: string,
): Promise<PasswordResetDoc | null> {
  return getDb().collection<PasswordResetDoc>("password_resets").findOne({
    tokenHash,
    expiresAt: { $gt: new Date() },
    used: false,
  });
}

export async function markPasswordResetTokenUsed(tokenHash: string): Promise<void> {
  await getDb().collection<PasswordResetDoc>("password_resets").updateOne(
    { tokenHash },
    { $set: { used: true } },
  );
}

/* ---------------------------- Email Verification -------------------------- */

const VERIFY_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

export async function createEmailVerificationToken(
  userId: ObjectId,
  tokenHash: string,
): Promise<EmailVerificationDoc> {
  const now = new Date();
  const doc: EmailVerificationDoc = {
    _id: new ObjectId(),
    userId,
    tokenHash,
    expiresAt: new Date(now.getTime() + VERIFY_TTL_MS),
    createdAt: now,
    used: false,
  };
  await getDb().collection<EmailVerificationDoc>("email_verifications").insertOne(doc);
  return doc;
}

export async function findValidEmailVerificationToken(
  tokenHash: string,
): Promise<EmailVerificationDoc | null> {
  return getDb().collection<EmailVerificationDoc>("email_verifications").findOne({
    tokenHash,
    expiresAt: { $gt: new Date() },
    used: false,
  });
}

export async function markEmailVerificationTokenUsed(tokenHash: string): Promise<void> {
  await getDb().collection<EmailVerificationDoc>("email_verifications").updateOne(
    { tokenHash },
    { $set: { used: true } },
  );
}

export async function setUserEmailVerified(userId: ObjectId): Promise<void> {
  await getDb().collection<UserDoc>("users").updateOne(
    { _id: userId },
    { $set: { emailVerified: true, updatedAt: new Date() } },
  );
}

/* ---------------------------- Comment Reports ----------------------------- */

export async function reportComment(input: {
  commentId: ObjectId;
  reporterId: ObjectId;
  reason: string;
}): Promise<boolean> {
  // Prevent duplicate reports from same user on same comment
  const existing = await getDb()
    .collection<CommentReportDoc>("comment_reports")
    .findOne({ commentId: input.commentId, reporterId: input.reporterId });
  if (existing) return false;

  const doc: CommentReportDoc = {
    _id: new ObjectId(),
    commentId: input.commentId,
    reporterId: input.reporterId,
    reason: input.reason,
    status: "pending",
    createdAt: new Date(),
  };
  await getDb().collection<CommentReportDoc>("comment_reports").insertOne(doc);
  return true;
}

export async function hideComment(commentId: ObjectId): Promise<void> {
  await getDb().collection<CommentDoc>("comments").updateOne(
    { _id: commentId },
    { $set: { hidden: true } },
  );
}

export interface ReportView {
  id: string;
  commentId: string;
  commentBody: string;
  commentAuthor: string;
  articleSlug: string;
  reporterUsername: string;
  reason: string;
  status: string;
  createdAt: string;
}

export async function listReports(status?: string): Promise<ReportView[]> {
  const filter: Record<string, unknown> = {};
  if (status) filter.status = status;

  const reports = await getDb()
    .collection<CommentReportDoc>("comment_reports")
    .find(filter)
    .sort({ createdAt: -1 })
    .limit(100)
    .toArray();

  const results: ReportView[] = [];
  for (const report of reports) {
    const comment = await getDb()
      .collection<CommentDoc>("comments")
      .findOne({ _id: report.commentId });
    const reporter = await getDb()
      .collection<UserDoc>("users")
      .findOne({ _id: report.reporterId });

    results.push({
      id: report._id.toHexString(),
      commentId: report.commentId.toHexString(),
      commentBody: comment?.body ?? "[deleted]",
      commentAuthor: comment?.author.username ?? "[unknown]",
      articleSlug: comment?.articleSlug ?? "[unknown]",
      reporterUsername: reporter?.username ?? "[unknown]",
      reason: report.reason,
      status: report.status,
      createdAt: report.createdAt.toISOString(),
    });
  }
  return results;
}

export async function updateReportStatus(
  reportId: ObjectId,
  status: "reviewed" | "dismissed",
): Promise<void> {
  await getDb().collection<CommentReportDoc>("comment_reports").updateOne(
    { _id: reportId },
    { $set: { status } },
  );
}