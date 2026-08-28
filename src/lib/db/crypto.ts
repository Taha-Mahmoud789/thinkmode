import { randomBytes, scrypt as nodeScrypt, timingSafeEqual, createHash } from "node:crypto";

/**
 * Password hashing + session tokens using only Node core crypto.
 *
 * - Passwords: scrypt (memory-hard, timing-safe) — no native deps, which keeps
 *   the build portable for Vercel/Windows and avoids serverless native-gyp pain.
 *   Format: scrypt$N$r$p$salt$hash
 * - Session tokens: 32 random bytes, stored as an SHA-256 hash so a DB leak
 *   never exposes live tokens.
 */

const SCRYPT_N = 16384;
const SCRYPT_R = 8;
const SCRYPT_P = 1;
const KEYLEN = 64;

/** Promise wrapper for node:crypto's scrypt (callback + options variant). */
function deriveKey(
  password: string,
  salt: Buffer,
  keylen: number,
  N: number,
  r: number,
  p: number,
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    nodeScrypt(
      password,
      salt,
      keylen,
      { N, r, p },
      (err, derivedKey) => (err ? reject(err) : resolve(derivedKey as Buffer)),
    );
  });
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const derived = await deriveKey(password, salt, KEYLEN, SCRYPT_N, SCRYPT_R, SCRYPT_P);
  return [
    "scrypt",
    SCRYPT_N,
    SCRYPT_R,
    SCRYPT_P,
    salt.toString("base64"),
    derived.toString("base64"),
  ].join("$");
}

export async function verifyPassword(
  password: string,
  stored: string,
): Promise<boolean> {
  const parts = stored.split("$");
  if (parts.length !== 6 || parts[0] !== "scrypt") return false;
  const [, nStr, rStr, pStr, saltB64, hashB64] = parts;
  const N = Number(nStr);
  const r = Number(rStr);
  const p = Number(pStr);
  const salt = Buffer.from(saltB64, "base64");
  const expected = Buffer.from(hashB64, "base64");
  const derived = await deriveKey(password, salt, expected.length, N, r, p);
  return timingSafeEqual(derived, expected);
}

export function generateSessionToken(): string {
  return randomBytes(32).toString("base64url");
}

/** SHA-256 of a session token — this is what gets stored in the DB. */
export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}