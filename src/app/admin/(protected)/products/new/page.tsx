import Link from "next/link";
import { connection } from "next/server";
import { PiArrowLeftLight } from "react-icons/pi";
import { ProductForm } from "@/components/admin/ProductForm";
import { Logo } from "@/components/layout/Logo";
import { db } from "@/lib/db";
import { createProductAction } from "../actions";

export const instant = false;

export default async function NewProductPage() {
  await connection();

  const [categories, allScents] = await Promise.all([
    db.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    }),
    db.scent.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="space-y-8">
      <header className="flex max-w-7xl flex-col gap-6 border-b border-border pb-8 sm:flex-row sm:items-start sm:justify-between">
        <div className="sm:order-2">
          <Logo />
        </div>

        <div className="sm:order-1">
          <Link
            href="/admin/products"
            className="focus-ring inline-flex items-center gap-2 rounded text-sm font-medium text-rose-500 transition-colors hover:text-rose-600"
          >
            <PiArrowLeftLight className="h-4 w-4" aria-hidden="true" />
            Back to products
          </Link>
          <h1 className="mt-4 text-3xl font-display leading-tight text-ink md:text-4xl">
            Add new product
          </h1>
          <p className="mt-2 text-sm text-ink-muted">
            Fill in the details below. New products start as drafts until you publish them.
          </p>
        </div>
      </header>

      <ProductForm categories={categories} allScents={allScents} action={createProductAction} />
    </div>
  );
}