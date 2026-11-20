"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Product, Category, ProductImage } from "@/generated/prisma/client";

interface ProductFormProps {
  categories: Category[];
  initialData?: (Product & { images?: ProductImage[] }) | null;
  action: (formData: FormData) => Promise<{ error?: string } | void>;
}

export function ProductForm({ categories, initialData, action }: ProductFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(initialData?.images?.[0]?.url || null);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    e.currentTarget.value = "";
    setUploading(true);
    setError(null);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = (await res.json().catch(() => null)) as {
        error?: unknown;
        url?: unknown;
      } | null;
      if (!res.ok) {
        throw new Error(
          typeof data?.error === "string"
            ? data.error
            : `Image upload failed (${res.status}).`,
        );
      }
      if (typeof data?.url !== "string") {
        throw new Error("The image service returned an invalid response.");
      }
      setImageUrl(data.url);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Image upload failed.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    if (imageUrl) formData.append("imageUrl", imageUrl);
    
    const result = await action(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6 max-w-2xl bg-white p-6 rounded-2xl border border-border shadow-sm">
      {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm border border-red-200">{error}</div>}

      <div>
        <label className="block text-sm font-medium mb-2">Product Image</label>
        <div className="flex items-center gap-4">
          {imageUrl && (
            <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-border">
              <Image src={imageUrl} alt="Preview" fill className="object-cover" />
            </div>
          )}
          <div>
            <input 
              type="file" 
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageUpload}
              disabled={uploading}
              className="block w-full text-sm text-ink-soft file:mr-4 file:py-2 file:px-4 file:rounded-pill file:border-0 file:text-sm file:font-semibold file:bg-blush-100 file:text-rose-600 hover:file:bg-blush-200"
            />
            {uploading && <p className="text-xs text-rose-500 mt-2">Uploading...</p>}
          </div>
        </div>
      </div>

      <div>
        <div>
          <label className="block text-sm font-medium mb-1">Product Name</label>
          <input name="name" defaultValue={initialData?.name} required className="w-full px-4 py-2 rounded-xl border border-border" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select name="categorySlug" defaultValue={categories.find(c => c.id === initialData?.categoryId)?.slug || ""} required className="w-full px-4 py-2 rounded-xl border border-border">
            <option value="">Select Category</option>
            {categories.map(c => <option key={c.id} value={c.slug}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Price (USD)</label>
          <input name="price" type="number" step="0.01" min="0" defaultValue={initialData ? initialData.priceCents / 100 : ""} required className="w-full px-4 py-2 rounded-xl border border-border" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea name="description" defaultValue={initialData?.description || ""} rows={3} className="w-full px-4 py-2 rounded-xl border border-border" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Benefits</label>
        <textarea name="benefits" defaultValue={initialData?.benefits || ""} rows={2} className="w-full px-4 py-2 rounded-xl border border-border" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Ingredients</label>
        <textarea name="ingredients" defaultValue={initialData?.ingredients || ""} rows={2} className="w-full px-4 py-2 rounded-xl border border-border" />
      </div>

      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 text-sm font-medium">
          <input type="checkbox" name="isAvailable" defaultChecked={initialData?.isAvailable ?? true} className="w-4 h-4 text-rose-500 rounded" />
          Available for purchase
        </label>
        <label className="flex items-center gap-2 text-sm font-medium">
          <input type="checkbox" name="isFeatured" defaultChecked={initialData?.isFeatured ?? false} className="w-4 h-4 text-rose-500 rounded" />
          Feature on Homepage
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Status</label>
        <select name="status" defaultValue={initialData?.status || "DRAFT"} className="w-full px-4 py-2 rounded-xl border border-border">
          <option value="DRAFT">Draft (Hidden)</option>
          <option value="PUBLISHED">Published (Public)</option>
        </select>
      </div>

      <div className="flex gap-4 pt-4 border-t border-border">
        <Button type="submit" disabled={loading || uploading}>{loading ? "Saving..." : "Save Product"}</Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin/products")}>Cancel</Button>
      </div>
    </form>
  );
}