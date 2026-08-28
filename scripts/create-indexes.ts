import { MongoClient } from "mongodb";

/**
 * One-time migration to create required indexes.
 * Run with: npx tsx scripts/create-indexes.ts
 * (or compile + node)
 */

const MONGODB_URI = process.env.MONGODB_URI ?? "";
const MONGODB_DB = process.env.MONGODB_DB ?? "thinkmode";

if (!MONGODB_URI) {
  console.error("MONGODB_URI not set");
  process.exit(1);
}

async function main() {
  const client = new MongoClient(MONGODB_URI, { appName: "thinkmode-migration" });
  await client.connect();
  const db = client.db(MONGODB_DB);

  console.log("Creating indexes...");

  // Users: unique email
  await db.collection("users").createIndex({ email: 1 }, { unique: true, name: "uq_email" });
  console.log("✓ users.email (unique)");

  // Sessions: TTL auto-expiry + userId lookup
  await db.collection("sessions").createIndex(
    { expiresAt: 1 },
    { expireAfterSeconds: 0, name: "ttl_expiresAt" },
  );
  await db.collection("sessions").createIndex({ userId: 1 }, { name: "idx_userId" });
  console.log("✓ sessions.ttl + sessions.userId");

  // Bookmarks: unique composite (one bookmark per user per article) + user list
  await db.collection("bookmarks").createIndex(
    { userId: 1, articleSlug: 1 },
    { unique: true, name: "uq_user_article" },
  );
  await db.collection("bookmarks").createIndex({ userId: 1, createdAt: -1 }, { name: "idx_user_created" });
  console.log("✓ bookmarks.uq_user_article + bookmarks.user_created");

  // Comments: by article (paginated) + by user (moderation)
  await db.collection("comments").createIndex({ articleSlug: 1, createdAt: 1 }, { name: "idx_article_created" });
  await db.collection("comments").createIndex({ "author.userId": 1, createdAt: -1 }, { name: "idx_author_created" });
  console.log("✓ comments.article_created + comments.author_created");

  // Password resets: TTL auto-expiry + userId lookup
  await db.collection("password_resets").createIndex(
    { expiresAt: 1 },
    { expireAfterSeconds: 0, name: "ttl_expiresAt" },
  );
  await db.collection("password_resets").createIndex({ userId: 1 }, { name: "idx_userId" });
  console.log("✓ password_resets.ttl + password_resets.userId");

  // Email verifications: TTL auto-expiry + userId lookup
  await db.collection("email_verifications").createIndex(
    { expiresAt: 1 },
    { expireAfterSeconds: 0, name: "ttl_expiresAt" },
  );
  await db.collection("email_verifications").createIndex({ userId: 1 }, { name: "idx_userId" });
  console.log("✓ email_verifications.ttl + email_verifications.userId");

  // Comment reports: unique per user+comment, pending lookup
  await db.collection("comment_reports").createIndex(
    { commentId: 1, reporterId: 1 },
    { unique: true, name: "uq_comment_reporter" },
  );
  await db.collection("comment_reports").createIndex({ status: 1, createdAt: 1 }, { name: "idx_status_created" });
  console.log("✓ comment_reports.uq_comment_reporter + comment_reports.status_created");

  console.log("\nAll indexes created successfully.");
  await client.close();
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});