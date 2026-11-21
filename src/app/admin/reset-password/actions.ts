"use server";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/auth/password";
import { hashToken } from "@/lib/auth/tokens";

export async function resetPasswordAction(formData: FormData) {
  const token = formData.get("token") as string;
  const password = formData.get("password") as string;

  if (!token || password.length < 15) return { error: "Password must be at least 15 characters." };

  const resetToken = await db.passwordResetToken.findUnique({ where: { tokenHash: hashToken(token) } });
  if (!resetToken || resetToken.usedAt || resetToken.expiresAt < new Date()) {
    return { error: "Invalid or expired link." };
  }

  const newHash = await hashPassword(password);

  await db.$transaction([
    db.adminUser.update({ where: { id: resetToken.userId }, data: { passwordHash: newHash } }),
    db.passwordResetToken.update({ where: { id: resetToken.id }, data: { usedAt: new Date() } }),
    db.adminSession.deleteMany({ where: { userId: resetToken.userId } }),
  ]);

  return { success: true };
}