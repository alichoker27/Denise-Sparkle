import "server-only";
import { redirect } from "next/navigation";
import { getAdminSession } from "./session";

/**
 * Protects pages. If no valid session exists, redirects to login.
 */
export async function requireAdmin() {
  const auth = await getAdminSession();
  
  if (!auth || auth.user.role !== "admin") {
    redirect("/admin/login");
  }

  return auth.user;
}

/**
 * Protects Server Actions and Route Handlers.
 * Throws an error if no valid session exists (instead of redirecting).
 */
export async function requireAdminAction() {
  const auth = await getAdminSession();
  
  if (!auth || auth.user.role !== "admin") {
    throw new Error("Unauthorized: Admin access required.");
  }

  return auth.user;
}