import { NextRequest, NextResponse } from "next/server";
import { getDb, isMongoConfigured } from "@/lib/mongo";
import { ObjectId } from "mongodb";

const COLLECTION = "presence";
const ONLINE_THRESHOLD_MS = 60_000; // 60 seconds

/**
 * Presence heartbeat API.
 *
 *   POST /api/presence  { userId }  → upserts heartbeat, returns { online }
 *   GET  /api/presence               → returns { online } count
 *
 * Users are considered "online" if their last heartbeat was within 60 seconds.
 * The TTL index on `lastSeen` auto-cleans stale documents after 2 minutes.
 */

export async function GET() {
  if (!isMongoConfigured()) {
    return NextResponse.json({ online: 0 });
  }

  try {
    const db = getDb();
    const since = new Date(Date.now() - ONLINE_THRESHOLD_MS);
    const online = await db
      .collection(COLLECTION)
      .countDocuments({ lastSeen: { $gte: since } });
    return NextResponse.json({ online });
  } catch {
    return NextResponse.json({ online: 0 });
  }
}

export async function POST(req: NextRequest) {
  if (!isMongoConfigured()) {
    return NextResponse.json({ online: 0 });
  }

  try {
    const { userId } = (await req.json()) as { userId?: string };
    if (!userId || typeof userId !== "string") {
      return NextResponse.json({ online: 0 }, { status: 400 });
    }

    const db = getDb();
    const now = new Date();

    await db.collection(COLLECTION).updateOne(
      { userId },
      {
        $set: { lastSeen: now, userId },
        $setOnInsert: { createdAt: now },
      },
      { upsert: true },
    );

    // Ensure TTL index exists (idempotent)
    await db
      .collection(COLLECTION)
      .createIndex({ lastSeen: 1 }, { expireAfterSeconds: 120 });

    const since = new Date(Date.now() - ONLINE_THRESHOLD_MS);
    const online = await db
      .collection(COLLECTION)
      .countDocuments({ lastSeen: { $gte: since } });

    return NextResponse.json({ online });
  } catch {
    return NextResponse.json({ online: 0 });
  }
}
