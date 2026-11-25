"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdminAction } from "@/lib/auth/require-admin";
import { slugify } from "@/lib/format";

export async function createCategoryAction(formData: FormData) {
  await requireAdminAction();
  const name = formData.get("name") as string;

  if (!name || name.trim().length === 0) {
    return { error: "Category name is required." };
  }

  const slug = slugify(name);
  const existing = await db.category.findUnique({ where: { slug } });
  if (existing) {
    return { error: "A category with this name already exists." };
  }

  // Find the highest sort order to put the new one at the end
  const highest = await db.category.findFirst({
    orderBy: { sortOrder: "desc" },
    select: { sortOrder: true },
  });
  const newSortOrder = (highest?.sortOrder || 0) + 1;

  await db.category.create({
    data: {
      name: name.trim(),
      slug,
      sortOrder: newSortOrder,
      isActive: true,
    },
  });

  revalidatePath("/admin/categories");
  revalidatePath("/shop");
  revalidatePath("/admin/products");
  return { success: true };
}

export async function deleteCategoryAction(id: number) {
  await requireAdminAction();

  // SECURITY: Check if any products are using this category
  const productsCount = await db.product.count({ where: { categoryId: id } });
  if (productsCount > 0) {
    return { error: "Cannot delete this category because it has products assigned to it. Move the products first." };
  }

  await db.category.delete({ where: { id } });

  revalidatePath("/admin/categories");
  revalidatePath("/shop");
  return { success: true };
}