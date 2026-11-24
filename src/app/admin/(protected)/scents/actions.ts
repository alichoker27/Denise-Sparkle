"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdminAction } from "@/lib/auth/require-admin";

export async function createScentAction(formData: FormData) {
  await requireAdminAction();
  const name = formData.get("name") as string;

  if (!name || name.trim().length === 0) {
    return { error: "Scent name is required." };
  }

  const existing = await db.scent.findUnique({ where: { name: name.trim() } });
  if (existing) {
    return { error: "This scent already exists." };
  }

  await db.scent.create({
    data: { name: name.trim() },
  });

  revalidatePath("/admin/scents");
  revalidatePath("/admin/products/new");
  revalidatePath("/admin/products");
  return { success: true };
}

export async function deleteScentAction(id: number) {
  await requireAdminAction();

  try {
    await db.scent.delete({
      where: { id },
    });

    revalidatePath("/admin/scents");
    revalidatePath("/admin/products");
    revalidatePath("/shop");
    return { success: true };
  } catch {
    return { error: "Failed to delete scent. It might be in use." };
  }
}