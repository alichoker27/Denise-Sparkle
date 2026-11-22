"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdminAction } from "@/lib/auth/require-admin";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { hashSessionToken, SESSION_COOKIE_NAME } from "@/lib/auth/session";
import { cookies } from "next/headers";
import { firstPurchaseOfferInputSchema } from "@/lib/validation";
import { DEFAULT_FIRST_PURCHASE_OFFER } from "@/lib/offer-defaults";

export async function updateNameAction(formData: FormData) {
  const admin = await requireAdminAction();
  const name = formData.get("name") as string;

  if (!name || name.trim().length < 2) {
    return { error: "Name must be at least 2 characters." };
  }

  await db.adminUser.update({
    where: { id: admin.id },
    data: { name: name.trim() },
  });

  revalidatePath("/admin/settings");
  revalidatePath("/admin");
  return { success: "Name updated successfully." };
}

export async function updatePasswordAction(formData: FormData) {
  const admin = await requireAdminAction();
  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;

  if (!currentPassword || !newPassword) {
    return { error: "All fields are required." };
  }

  if (newPassword.length < 15) {
    return { error: "New password must be at least 15 characters long." };
  }

  const isValid = await verifyPassword(currentPassword, admin.passwordHash);
  if (!isValid) {
    return { error: "Current password is incorrect." };
  }

  const newHash = await hashPassword(newPassword);
  const cookieStore = await cookies();
  const currentSessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!currentSessionToken) {
    return { error: "Your session has expired. Please sign in again." };
  }

  await db.$transaction(async (tx) => {
    await tx.adminUser.update({
      where: { id: admin.id },
      data: { passwordHash: newHash },
    });
    await tx.adminSession.deleteMany({
      where: {
        userId: admin.id,
        tokenHash: { not: hashSessionToken(currentSessionToken) },
      },
    });
  });
  return { success: "Password updated. Other active sessions have been signed out." };
}

export async function updateOfferAction(formData: FormData) {
  await requireAdminAction();
  const isEnabled = formData.get("isEnabled") === "on";
  const rawMessage = formData.get("message");
  const parsedOffer = firstPurchaseOfferInputSchema.safeParse({
    percentage: DEFAULT_FIRST_PURCHASE_OFFER.percentage,
    message: typeof rawMessage === "string" ? rawMessage.trim() : "",
    isEnabled,
  });

  if (!parsedOffer.success) {
    return {
      error: parsedOffer.error.issues[0]?.message ?? "Invalid offer settings.",
    };
  }

  const { message } = parsedOffer.data;

  const existing = await db.firstPurchaseOffer.findFirst();

  if (existing) {
    await db.firstPurchaseOffer.update({
      where: { id: existing.id },
      data: { isEnabled, message },
    });
  } else {
    await db.firstPurchaseOffer.create({
      data: { percentage: 10, message, isEnabled },
    });
  }

  revalidatePath("/");
  revalidatePath("/admin/settings");
  return { success: "Offer settings updated." };
}