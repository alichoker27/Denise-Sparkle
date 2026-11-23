import Link from "next/link";
import { connection } from "next/server";
import { PiArrowLeftLight } from "react-icons/pi";
import { db } from "@/lib/db";
import { BundleForm } from "@/components/admin/BundleForm";
import { createBundleAction } from "../actions";

export const instant = false;

export default async function NewBundlePage() {
  await connection();

  const products = await db.product.findMany({ where: { status: "PUBLISHED" }, orderBy: { name: "asc" } });
  return (
    <div className="space-y-8">
      <header className="flex max-w-7xl flex-col gap-6 border-b border-border pb-8 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link
            href="/admin/bundles"
            className="focus-ring inline-flex items-center gap-2 rounded text-sm font-medium text-rose-500 transition-colors hover:text-rose-600"
          >
            <PiArrowLeftLight className="h-4 w-4" aria-hidden="true" />
            Back to bundles
          </Link>
          <h1 className="mt-4 text-3xl font-display leading-tight text-ink md:text-4xl">
            Add new bundle
          </h1>
          <p className="mt-2 text-sm text-ink-muted">
            Group published products and choose when this bundle becomes available.
          </p>
        </div>
      </header>

      <BundleForm products={products} action={createBundleAction} />
    </div>
  );
}