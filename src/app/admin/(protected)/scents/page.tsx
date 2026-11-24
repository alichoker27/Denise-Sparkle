import { connection } from "next/server";
import Link from "next/link";
import { PiArrowLeftLight } from "react-icons/pi";
import { db } from "@/lib/db";
import { ScentManagerClient } from "./ScentManagerClient";

export const instant = false;

export default async function ScentsPage() {
  await connection();
  const scents = await db.scent.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="space-y-8 max-w-3xl">
      <header className="flex flex-col gap-6 border-b border-border pb-8">
        <Link
          href="/admin/products"
          className="focus-ring inline-flex items-center gap-2 rounded text-sm font-medium text-rose-500 transition-colors hover:text-rose-600"
        >
          <PiArrowLeftLight className="h-4 w-4" aria-hidden="true" />
          Back to products
        </Link>
        <div>
          <h1 className="mt-4 text-3xl font-display leading-tight text-ink md:text-4xl">
            Manage Scents
          </h1>
          <p className="mt-2 text-sm text-ink-muted">
            Add new scents to the library. They will appear as options when you create or edit a product.
          </p>
        </div>
      </header>
      <ScentManagerClient scents={scents} />
    </div>
  );
}