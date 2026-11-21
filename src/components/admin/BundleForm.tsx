"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Product } from "@/generated/prisma/client";

interface BundleFormProps {
  products: Product[];
  action: (formData: FormData) => Promise<{ error?: string } | void>;
}

export function BundleForm({ products, action }: BundleFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [items, setItems] = useState<{ productSlug: string; quantity: number }[]>([]);
  const router = useRouter();

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setImageUrl(data.url);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }

  function addItem() {
    setItems([...items, { productSlug: "", quantity: 1 }]);
  }

  function updateItem(index: number, field: string, value: string | number) {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  }

  function removeItem(index: number) {
    setItems(items.filter((_, i) => i !== index));
  }

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    if (imageUrl) formData.append("imageUrl", imageUrl);
    formData.append("items", JSON.stringify(items));
    
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
        <label className="block text-sm font-medium mb-2">Bundle Image</label>
        <div className="flex items-center gap-4">
          {imageUrl && (
            <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-border">
              <Image src={imageUrl} alt="Preview" fill className="object-cover" />
            </div>
          )}
          <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageUpload} disabled={uploading} className="block w-full text-sm text-ink-soft file:mr-4 file:py-2 file:px-4 file:rounded-pill file:border-0 file:text-sm file:font-semibold file:bg-blush-100 file:text-rose-600" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Bundle Name</label>
        <input name="name" required className="w-full px-4 py-2 rounded-xl border border-border" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Bundle Price (USD)</label>
          <input name="price" type="number" step="0.01" min="0" required className="w-full px-4 py-2 rounded-xl border border-border" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select name="status" className="w-full px-4 py-2 rounded-xl border border-border">
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea name="description" rows={3} className="w-full px-4 py-2 rounded-xl border border-border" />
      </div>

      <div className="border-t border-border pt-4">
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium">Products in Bundle</label>
          <Button type="button" variant="outline" size="sm" onClick={addItem}>Add Product</Button>
        </div>
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2 mb-2">
            <select 
              value={item.productSlug} 
              onChange={(e) => updateItem(index, "productSlug", e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl border border-border text-sm"
            >
              <option value="">Select a product...</option>
              {products.map(p => <option key={p.id} value={p.slug}>{p.name}</option>)}
            </select>
            <input 
              type="number" 
              min="1" 
              value={item.quantity} 
              onChange={(e) => updateItem(index, "quantity", parseInt(e.target.value))}
              className="w-20 px-3 py-2 rounded-xl border border-border text-sm" 
            />
            <button type="button" onClick={() => removeItem(index)} className="text-red-500 text-sm font-medium px-2">Remove</button>
          </div>
        ))}
      </div>

      <div className="flex gap-4 pt-4 border-t border-border">
        <Button type="submit" disabled={loading || uploading}>{loading ? "Saving..." : "Save Bundle"}</Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin/bundles")}>Cancel</Button>
      </div>
    </form>
  );
}