import { NextRequest, NextResponse } from "next/server";
import { findValidEmailVerificationToken, markEmailVerificationTokenUsed, setUserEmailVerified } from "@/lib/db/repositories";
import { hashToken } from "@/lib/db/crypto";
import { isMongoConfigured } from "@/lib/mongo";

export const dynamic = "force-dynamic";

/** GET /api/auth/verify-email/confirm?token=... — verify email from link. */
export async function GET(req: NextRequest) {
  if (!isMongoConfigured()) {
    return NextResponse.redirect(new URL("/login?error=not_enabled", req.url));
  }

  const token = req.nextUrl.searchParams.get("token");
  if (!token) {
    return NextResponse.redirect(new URL("/login?error=missing_token", req.url));
  }

  const tokenHash = hashToken(token);
  const verifyDoc = await findValidEmailVerificationToken(tokenHash);
  if (!verifyDoc) {
    return NextResponse.redirect(new URL("/login?error=invalid_token", req.url));
  }

  await setUserEmailVerified(verifyDoc.userId);
  await markEmailVerificationTokenUsed(tokenHash);

  return NextResponse.redirect(new URL("/login?verified=1", req.url));
}