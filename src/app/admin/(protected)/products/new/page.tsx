import Link from "next/link";
import { connection } from "next/server";
import { ProductForm } from "@/components/admin/ProductForm";
import { db } from "@/lib/db";
import { createProductAction } from "../actions";

export const instant = false;

export default async function NewProductPage() {
  await connection();

  const categories = await db.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/products"
          className="text-sm font-medium text-rose-500 hover:text-rose-600"
        >
          Back to products
        </Link>
        <h1 className="mt-3 text-2xl font-display text-ink">Add New Product</h1>
      </div>
      <ProductForm categories={categories} action={createProductAction} />
    </div>
  );
}
