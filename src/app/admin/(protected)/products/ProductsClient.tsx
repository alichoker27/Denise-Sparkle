"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Trash2 } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { deleteProductAction } from "./actions";
import { Product, Category } from "@/generated/prisma/client";

interface ProductWithCategory extends Product {
  category: Category;
}

export default function ProductsClient({ products }: { products: ProductWithCategory[] }) {
  const [productToDelete, setProductToDelete] = useState<Pick<Product, "id" | "name"> | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);
  const deleteTriggerRef = useRef<HTMLButtonElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!productToDelete) return;

    cancelButtonRef.current?.focus();
    return () => {
      deleteTriggerRef.current?.focus();
    };
  }, [productToDelete]);

  useEffect(() => {
    if (!productToDelete) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && deletingId === null) {
        setProductToDelete(null);
        setError(null);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [productToDelete, deletingId]);

  function keepFocusInsideDialog(event: React.KeyboardEvent<HTMLElement>) {
    if (event.key !== "Tab") return;
    if (deletingId !== null) {
      event.preventDefault();
      return;
    }

    if (event.shiftKey && document.activeElement === cancelButtonRef.current) {
      event.preventDefault();
      confirmButtonRef.current?.focus();
    } else if (
      !event.shiftKey &&
      document.activeElement === confirmButtonRef.current
    ) {
      event.preventDefault();
      cancelButtonRef.current?.focus();
    }
  }

  async function handleDelete() {
    if (!productToDelete) return;

    const productId = productToDelete.id;
    setDeletingId(productId);
    setError(null);

    try {
      const result = await deleteProductAction(productId);
      if (result?.error) {
        setError(result.error);
        return;
      }

      setProductToDelete(null);
      router.refresh();
    } catch (deleteError) {
      console.error("Failed to delete product:", deleteError);
      setError("We couldn't delete this product. Please try again.");
    } finally {
      setDeletingId(null);
    }
  }

  function closeDeleteDialog() {
    if (deletingId !== null) return;
    setProductToDelete(null);
    setError(null);
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
                    type="button"
                    onClick={(event) => {
                      deleteTriggerRef.current = event.currentTarget;
                      setError(null);
                      setProductToDelete({ id: p.id, name: p.name });
                    }}
                    className="text-red-500 hover:text-red-700 font-medium disabled:opacity-50"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {productToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/45 p-4 backdrop-blur-sm"
          onClick={(event) => {
            if (event.target === event.currentTarget) closeDeleteDialog();
          }}
        >
          <section
            role="alertdialog"
            aria-modal="true"
            aria-busy={deletingId !== null}
            aria-labelledby="delete-product-title"
            aria-describedby="delete-product-description"
            className="w-full max-w-md overflow-hidden rounded-3xl border border-blush-100 bg-white shadow-2xl"
            onKeyDown={keepFocusInsideDialog}
          >
            <div className="flex items-start gap-4 p-6 sm:p-8">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
                <AlertTriangle aria-hidden="true" size={24} />
              </div>
              <div className="pt-1">
                <h2 id="delete-product-title" className="text-xl font-display text-ink">
                  Remove this product?
                </h2>
                <p id="delete-product-description" className="mt-2 text-sm leading-6 text-ink-soft">
                  You’re about to delete <span className="font-semibold text-ink">{productToDelete.name}</span>.
                  This action can’t be undone.
                </p>
              </div>
            </div>

            {error && (
              <p role="alert" className="mx-6 mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 sm:mx-8">
                {error}
              </p>
            )}

            <div className="flex flex-col-reverse gap-3 border-t border-border bg-surface-soft/70 p-6 sm:flex-row sm:justify-end sm:p-8">
              <button
                ref={cancelButtonRef}
                type="button"
                onClick={closeDeleteDialog}
                aria-disabled={deletingId !== null}
                className="rounded-pill border border-border-strong bg-white px-5 py-3 text-sm font-medium text-ink-soft transition-colors hover:bg-blush-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500 aria-disabled:cursor-not-allowed aria-disabled:opacity-60"
              >
                Keep product
              </button>
              <button
                ref={confirmButtonRef}
                type="button"
                onClick={() => {
                  if (deletingId === null) void handleDelete();
                }}
                aria-disabled={deletingId !== null}
                className="inline-flex items-center justify-center gap-2 rounded-pill bg-rose-600 px-5 py-3 text-sm font-semibold text-white shadow-soft transition-colors hover:bg-rose-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 aria-disabled:cursor-not-allowed aria-disabled:opacity-60"
              >
                <Trash2 aria-hidden="true" size={16} />
                {deletingId === productToDelete.id ? "Removing..." : "Delete product"}
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}