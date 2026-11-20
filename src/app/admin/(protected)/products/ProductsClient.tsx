"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { deleteProductAction } from "./actions";
import { Product, Category } from "@/generated/prisma/client";

interface ProductWithCategory extends Product {
  category: Category;
}

export default function ProductsClient({ products }: { products: ProductWithCategory[] }) {
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleDelete(id: number) {
    // THE CONFIRMATION BANNER YOU REQUESTED
    if (!confirm("Are you sure you want to delete this product? This cannot be undone.")) return;
    
    setDeletingId(id);
    setError(null);
    const result = await deleteProductAction(id);
    
    if (result?.error) {
      setError(result.error);
      setDeletingId(null);
    } else {
      router.refresh();
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display text-ink">Products</h1>
          <p className="text-sm text-ink-muted mt-1">Manage your catalog ({products.length} total)</p>
        </div>
        <Button href="/admin/products/new">Add New</Button>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm border border-red-200">{error}</div>}

      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-blush-50 border-b border-border text-ink font-medium">
            <tr>
              <th className="px-6 py-4">Product</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-surface-soft/50 transition-colors">
                <td className="px-6 py-4 font-medium text-ink">{p.name}</td>
                <td className="px-6 py-4 text-ink-soft">{p.category.name}</td>
                <td className="px-6 py-4 text-ink-soft">{formatPrice(p.priceCents)}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-pill text-xs font-semibold ${p.status === "PUBLISHED" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>
                    {p.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right flex items-center justify-end gap-4">
                  <Link href={`/admin/products/${p.id}/edit`} className="text-rose-500 hover:text-rose-600 font-medium">Edit</Link>
                  <button 
                    onClick={() => handleDelete(p.id)}
                    disabled={deletingId === p.id}
                    className="text-red-500 hover:text-red-700 font-medium disabled:opacity-50"
                  >
                    {deletingId === p.id ? "Deleting..." : "Delete"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}