import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongo";
import { hashToken } from "./crypto";
import {
  findSessionByTokenHash,
  findUserById,
} from "./repositories";
import type { SessionDoc, UserDoc } from "./schemas";

export const SESSION_COOKIE = "tm_session";
export const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30; // 30 days

/** Read the validated session (if any) for the current request. */
export async function getSession(): Promise<{
  session: SessionDoc | null;
  user: UserDoc | null;
}> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return { session: null, user: null };

  const session = await findSessionByTokenHash(hashToken(token));
  if (!session) return { session: null, user: null };

  const user = await findUserById(session.userId);
  return { session, user };
}

/** Like getSession but throws/redirects when unauthenticated. */
export async function requireUser(): Promise<UserDoc> {
  const { user } = await getSession();
  if (!user) redirect("/login");
  return user;
}

/** Parse an ObjectId safely (returns null on bad hex). */
export function toObjectId(id: string): ObjectId | null {
  try {
    return new ObjectId(id);
  } catch {
    return null;
  }
}

export { getDb };