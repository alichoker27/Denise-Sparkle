import "server-only";
import crypto from "crypto";
import { Resend } from "resend";
import { db } from "@/lib/db";

const resend = new Resend(process.env.RESEND_API_KEY);

export function generateToken() {
  return crypto.randomBytes(32).toString("hex");
}

export function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function sendPasswordResetEmail(email: string) {
  const user = await db.adminUser.findUnique({ where: { email } });
  if (!user || !user.isActive) return;

  const rawToken = generateToken();
  const tokenHash = hashToken(rawToken);

  await db.passwordResetToken.create({
    data: {
      userId: user.id,
      tokenHash,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
    },
  });

  const resetUrl = `${process.env.APP_URL}/admin/reset-password?token=${rawToken}`;

  if (!process.env.RESEND_API_KEY) {
    console.log("\n--- 🚨 RESET LINK (Local Dev) ---\n", resetUrl, "\n--------------------------------\n");
    return;
  }

  await resend.emails.send({
    from: `Denise Sparkle <${process.env.RESEND_FROM_EMAIL}>`,
    to: email,
    subject: "Reset your Admin Password",
    html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. Expires in 15 mins.</p>`,
  });
}