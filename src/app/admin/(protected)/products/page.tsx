import { db } from "@/lib/db";
import ProductsClient from "./ProductsClient";

export default async function AdminProductsPage() {
  const products = await db.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });
  return <ProductsClient products={products} />;
}