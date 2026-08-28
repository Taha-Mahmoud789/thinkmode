import { NextResponse } from "next/server";
import { generateCsrfToken } from "@/lib/csrf";

export const dynamic = "force-dynamic";

/** GET /api/csrf — returns a fresh CSRF token for client-side forms. */
export async function GET() {
  const token = await generateCsrfToken();
  return NextResponse.json({ token });
}