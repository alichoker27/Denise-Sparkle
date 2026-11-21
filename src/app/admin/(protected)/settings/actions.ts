"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdminAction } from "@/lib/auth/require-admin";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import {  SESSION_COOKIE_NAME } from "@/lib/auth/session";
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

  await db.$transaction(async (tx) => {
    await tx.adminUser.update({
      where: { id: admin.id },
      data: { passwordHash: newHash },
    });
    // Revoke all other sessions for security
    await tx.adminSession.deleteMany({
      where: { userId: admin.id },
    });
  });

  // Delete the current cookie so she has to log in again
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
  
  return { success: "Password updated. Please log in again." };
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