import { MongoClient, type Db } from "mongodb";

/**
 * Serverless-safe MongoDB connection.
 *
 * The driver maintains an internal pool, but because serverless functions
 * (Vercel/Next route handlers) can be spawned on many isolates, we cache the
 * client on globalThis across hot reloads in dev and across cold starts in
 * production. Caching a single client prevents a fresh handshake per request.
 */

const MONGODB_URI = process.env.MONGODB_URI ?? "";
const MONGODB_DB = process.env.MONGODB_DB ?? "thinkmode";

/** Check if URI looks like a real connection string (not placeholder). */
function isValidUri(uri: string): boolean {
  return (uri.startsWith("mongodb+srv://") || uri.startsWith("mongodb://")) && !uri.includes("<") && uri.length > 20;
}

declare global {
  // eslint-disable-next-line no-var
  var __mongo: { client: MongoClient; db: Db } | undefined;
}

function getClient(): { client: MongoClient; db: Db } {
  if (!isValidUri(MONGODB_URI)) {
    throw new Error(
      "MONGODB_URI is not set or is a placeholder. Configure it in .env.local / Vercel env vars.",
    );
  }

  if (globalThis.__mongo) return globalThis.__mongo;

  const client = new MongoClient(MONGODB_URI, {
    appName: "thinkmode",
  });

  const conn = { client, db: client.db(MONGODB_DB) };
  globalThis.__mongo = conn;
  return conn;
}

/** Access the default database. Throws if MONGODB_URI is missing/invalid. */
export function getDb(): Db {
  return getClient().db;
}

/** Whether Mongo is configured with a real URI (not placeholder). */
export function isMongoConfigured(): boolean {
  return isValidUri(process.env.MONGODB_URI ?? "");
}

/** Force-close for tests / graceful shutdown. */
export async function closeMongo(): Promise<void> {
  if (globalThis.__mongo) {
    await globalThis.__mongo.client.close();
    globalThis.__mongo = undefined;
  }
}