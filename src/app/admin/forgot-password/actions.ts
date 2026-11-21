"use server";

import { sendPasswordResetEmail as sendEmail } from "@/lib/auth/tokens";

export async function sendPasswordResetEmail(email: string) {
  await sendEmail(email);
}