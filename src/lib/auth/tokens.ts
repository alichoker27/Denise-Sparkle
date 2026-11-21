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
  // Security: Do not reveal if the email exists or not
  if (!user || !user.isActive) return;

  const rawToken = generateToken();
  const tokenHash = hashToken(rawToken);

  await db.passwordResetToken.create({
    data: {
      userId: user.id,
      tokenHash,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 mins
    },
  });

  const resetUrl = `${process.env.APP_URL}/admin/reset-password?token=${rawToken}`;

  // For local testing if no API key
  if (!process.env.RESEND_API_KEY) {
    console.log("\n--- 🚨 PASSWORD RESET LINK (Local Dev) 🚨 ---");
    console.log(resetUrl);
    console.log("-------------------------------------------\n");
    return;
  }

  await resend.emails.send({
    from: `Denise Sparkle Security <${process.env.RESEND_FROM_EMAIL}>`,
    to: email,
    subject: "Reset your Admin Password",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Reset your Password</h2>
        <p>Click the button below to set a new password. This link expires in 15 minutes.</p>
        <a href="${resetUrl}" style="display: inline-block; background-color: #d95f86; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 16px;">Reset Password</a>
      </div>
    `,
  });
}