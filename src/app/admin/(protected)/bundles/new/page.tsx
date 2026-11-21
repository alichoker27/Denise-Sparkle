import { connection } from "next/server";
import { db } from "@/lib/db";
import { BundleForm } from "@/components/admin/BundleForm";
import { createBundleAction } from "../actions";

export const instant = false;

export default async function NewBundlePage() {
  await connection();

  const products = await db.product.findMany({ where: { status: "PUBLISHED" }, orderBy: { name: "asc" } });
  return (
    <div>
      <h1 className="text-2xl font-display text-ink mb-6">Create New Bundle</h1>
      <BundleForm products={products} action={createBundleAction} />
    </div>
  );
}