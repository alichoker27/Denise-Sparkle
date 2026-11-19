import "server-only";
import crypto from "crypto";
import { cookies } from "next/headers";
import { db } from "@/lib/db";

export const SESSION_COOKIE_NAME = "admin_session";

/** Generate a random 32-byte hex token */
export function generateSessionToken() {
  return crypto.randomBytes(32).toString("hex");
}

/** Hash the token before saving to DB */
export function hashSessionToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

/** Create a database session and set the HttpOnly cookie */
export async function createSession(userId: number) {
  const rawToken = generateSessionToken();
  const tokenHash = hashSessionToken(rawToken);
  
  // 8 hours absolute expiry
  const expiresAt = new Date(Date.now() + 8 * 60 * 60 * 1000); 

  await db.adminSession.create({
    data: {
      userId,
      tokenHash,
      expiresAt,
    },
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, rawToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

/** Get the current session from the cookie and database */
export async function getAdminSession() {
  const cookieStore = await cookies();
  const rawToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!rawToken) return null;

  const tokenHash = hashSessionToken(rawToken);

  const session = await db.adminSession.findUnique({
    where: { tokenHash },
    include: { user: true },
  });

  if (!session || session.expiresAt < new Date() || !session.user.isActive) {
    return null;
  }

  return { session, user: session.user };
}