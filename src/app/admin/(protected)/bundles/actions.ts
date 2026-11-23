"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdminAction } from "@/lib/auth/require-admin";
import { bundleInputSchema } from "@/lib/validation";
import { slugify } from "@/lib/format";

export async function createBundleAction(formData: FormData) {
  await requireAdminAction();
  
  const imageUrl = formData.get("imageUrl") as string | null;
  const rawItemsValue = formData.get("items");
  let rawItems: unknown = [];
  if (typeof rawItemsValue === "string") {
    try {
      rawItems = JSON.parse(rawItemsValue);
    } catch {
      return { error: "Invalid product selection." };
    }
  }
  const name = formData.get("name");
  
  const parsed = bundleInputSchema.safeParse({
    name,
    slug: typeof name === "string" ? slugify(name) : "",
    description: formData.get("description") || null,
    priceCents: Math.round(Number(formData.get("price")) * 100),
    imageUrl,
    status: formData.get("status") || "DRAFT",
    items: rawItems,
  });

  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const itemSlugs = parsed.data.items.map((item) => item.productSlug);
  if (new Set(itemSlugs).size !== itemSlugs.length) {
    return { error: "Add each product only once to this bundle." };
  }

  const existingBundle = await db.bundle.findUnique({
    where: { slug: parsed.data.slug },
    select: { id: true },
  });
  if (existingBundle) {
    return { error: "A bundle with this name already exists. Choose a different name." };
  }

  const products = await db.product.findMany({
    where: { slug: { in: parsed.data.items.map(i => i.productSlug) } },
  });
  const slugToId = new Map(products.map(p => [p.slug, p.id]));

  for (const item of parsed.data.items) {
    if (!slugToId.has(item.productSlug)) return { error: `Product not found: ${item.productSlug}` };
  }

  await db.bundle.create({
    data: {
      name: parsed.data.name,
      slug: parsed.data.slug,
      description: parsed.data.description,
      priceCents: parsed.data.priceCents,
      imageUrl: parsed.data.imageUrl,
      isAvailable: parsed.data.isAvailable,
      status: parsed.data.status,
      items: {
        create: parsed.data.items.map(i => ({
          productId: slugToId.get(i.productSlug)!,
          quantity: i.quantity,
        })),
      },
    },
  });

  revalidatePath("/admin/bundles");
  revalidatePath("/collections");
  return { success: true };
}

export async function deleteBundleAction(id: number) {
  await requireAdminAction();
  await db.bundle.delete({ where: { id } });
  revalidatePath("/admin/bundles");
  revalidatePath("/collections");
  return { success: true };
}