import { connection } from "next/server";
import { db } from "@/lib/db";
import BundlesClient from "./BundlesClient";

export const instant = false;

export default async function AdminBundlesPage() {
  await connection();

  const bundles = await db.bundle.findMany({
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });
  return <BundlesClient bundles={bundles} />;
}