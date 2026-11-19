"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { verifyPassword } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";

const loginSchema = z.object({
  email: z.string().email().toLowerCase().trim(),
  password: z.string().min(1),
});

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // 1. Validate input
  const parsed = loginSchema.safeParse({ email, password });
  if (!parsed.success) {
    return { error: "Invalid email or password." };
  }

  // 2. Find User
  const user = await db.adminUser.findUnique({
    where: { email: parsed.data.email },
  });

  if (!user || !user.isActive) {
    return { error: "Invalid email or password." };
  }

  // 3. Verify Password
  const isValid = await verifyPassword(parsed.data.password, user.passwordHash);
  if (!isValid) {
    return { error: "Invalid email or password." };
  }

  // 4. Create Session (Sets the HttpOnly cookie)
  await createSession(user.id);

  // 5. Redirect to Dashboard
  redirect("/admin");
}