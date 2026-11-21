import { connection } from "next/server";
import { db } from "@/lib/db";
import ProductsClient from "./ProductsClient";

export const instant = false;

export default async function AdminProductsPage() {
  await connection();

  const products = await db.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });
  return <ProductsClient products={products} />;
}