"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireAdminAction } from "@/lib/auth/require-admin";
import { productInputSchema } from "@/lib/validation";
import { slugify } from "@/lib/format";

export async function createProductAction(formData: FormData) {
  await requireAdminAction();
  const imageUrlValue = formData.get("imageUrl");
  const imageUrl = typeof imageUrlValue === "string" ? imageUrlValue : null;
  const name = formData.get("name");
  
  const parsed = productInputSchema.safeParse({
    categorySlug: formData.get("categorySlug"),
    name,
    slug: typeof name === "string" ? slugify(name) : "",
    description: formData.get("description") || null,
    benefits: formData.get("benefits") || null,
    ingredients: formData.get("ingredients") || null,
    priceCents: Math.round(Number(formData.get("price")) * 100),
    status: formData.get("status") || "DRAFT",
  });

  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const { categorySlug, ...productData } = parsed.data;
  const existingProduct = await db.product.findUnique({
    where: { slug: productData.slug },
    select: { id: true },
  });
  if (existingProduct) {
    return { error: "A product with this name already exists. Choose a different name." };
  }

  const category = await db.category.findUnique({ where: { slug: categorySlug } });
  if (!category) return { error: "Category not found." };

  await db.$transaction(async (tx) => {
    const product = await tx.product.create({
      data: { ...productData, categoryId: category.id },
    });

    if (imageUrl) {
      await tx.productImage.create({
        data: { productId: product.id, url: imageUrl, isPrimary: true },
      });
    }
  });

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  redirect("/admin/products");
}

export async function updateProductAction(id: number, formData: FormData) {
  await requireAdminAction();
  const imageUrlValue = formData.get("imageUrl");
  const imageUrl = typeof imageUrlValue === "string" ? imageUrlValue : null;
  const existingRecord = await db.product.findUnique({
    where: { id },
    include: {
      images: {
        where: { isPrimary: true },
        select: { url: true },
        take: 1,
      },
    },
  });
  if (!existingRecord) return { error: "Product not found." };

  const name = formData.get("name");
  
  const parsed = productInputSchema.safeParse({
    categorySlug: formData.get("categorySlug"),
    name,
    slug:
      typeof name === "string"
        ? name === existingRecord.name
          ? existingRecord.slug
          : slugify(name)
        : "",
    description: formData.get("description") || null,
    benefits: formData.get("benefits") || null,
    ingredients: formData.get("ingredients") || null,
    priceCents: Math.round(Number(formData.get("price")) * 100),
    isAvailable: existingRecord.isAvailable,
    isFeatured: existingRecord.isFeatured,
    status: formData.get("status") || "DRAFT",
  });

  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const { categorySlug, ...productData } = parsed.data;
  const existingProduct = await db.product.findUnique({
    where: { slug: productData.slug },
    select: { id: true },
  });
  if (existingProduct && existingProduct.id !== id) {
    return { error: "A product with this name already exists. Choose a different name." };
  }

  const category = await db.category.findUnique({ where: { slug: categorySlug } });
  if (!category) return { error: "Category not found." };

  await db.$transaction(async (tx) => {
    await tx.product.update({
      where: { id },
      data: { ...productData, categoryId: category.id },
    });

    if (imageUrl && imageUrl !== existingRecord.images[0]?.url) {
      await tx.productImage.deleteMany({
        where: { productId: id, isPrimary: true },
      });
      await tx.productImage.create({
        data: { productId: id, url: imageUrl, isPrimary: true },
      });
    }
  });

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  revalidatePath(`/products/${existingRecord.slug}`);
  revalidatePath(`/products/${parsed.data.slug}`);
  redirect("/admin/products");
}

export async function deleteProductAction(id: number) {
  await requireAdminAction();

  const inBundle = await db.bundleItem.findFirst({ where: { productId: id } });
  if (inBundle) {
    return { error: "Cannot delete product. It is inside a bundle." };
  }

  await db.product.delete({ where: { id } });
  revalidatePath("/admin/products");
  revalidatePath("/shop");
  return { success: true };
}