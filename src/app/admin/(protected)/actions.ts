"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { SESSION_COOKIE_NAME, hashSessionToken } from "@/lib/auth/session";

export async function logoutAction() {
  const cookieStore = await cookies();
  const rawToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (rawToken) {
    const tokenHash = hashSessionToken(rawToken);
    // Delete the session from the database
    await db.adminSession.deleteMany({
      where: { tokenHash },
    });
  }

  // Clear the cookie
  cookieStore.delete(SESSION_COOKIE_NAME);

  // Redirect to login
  redirect("/admin/login");
}