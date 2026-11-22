"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { PiCircleNotchLight, PiImageLight, PiUploadSimpleLight } from "react-icons/pi";
import { Button } from "@/components/ui/Button";
import { Product, Category, ProductImage } from "@/generated/prisma/client";

interface ProductFormProps {
  categories: Category[];
  initialData?: (Product & { images?: ProductImage[] }) | null;
  action: (formData: FormData) => Promise<{ error?: string; success?: boolean }>;
}

const labelClass = "mb-1.5 block text-sm font-medium text-ink";
const inputClass =
  "w-full rounded-xl border border-border-strong bg-white px-4 py-3 text-ink transition-colors focus:border-rose-400 focus:outline-none focus:ring-1 focus:ring-rose-400 disabled:opacity-60";
const cardClass = "rounded-2xl border border-border bg-white p-5 shadow-sm sm:p-6 lg:p-8";

function Optional() {
  return <span className="font-normal text-ink-muted"> (optional)</span>;
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

    try {
      const result = await action(formData);
      if (result?.error) {
        setError(result.error);
      } else if (result?.success) {
        router.push("/admin/products");
      }
    } catch (submitError: unknown) {
      console.error("Failed to save product:", submitError);
      setError("We couldn't save this product. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form action={handleSubmit} aria-busy={loading || uploading} className="max-w-7xl space-y-6">
      {error && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Landscape on large screens: [ image | details ] over a full-width publish bar */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
        {/* Image */}
        <section aria-labelledby="image-heading" className={`${cardClass} lg:col-span-4 lg:self-start`}>
          <h2 id="image-heading" className="mb-4 text-lg font-display text-ink">
            Product image
          </h2>

          <div className="relative mb-4 aspect-square w-full overflow-hidden rounded-xl border border-border bg-blush-50">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt="Preview"
                fill
                sizes="(min-width: 1280px) 360px, (min-width: 1024px) 28vw, (min-width: 640px) 480px, 100vw"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-ink-muted">
                <PiImageLight className="h-10 w-10 opacity-60" aria-hidden="true" />
                <span className="text-sm">No image yet</span>
              </div>
            )}
            {uploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/70">
                <PiCircleNotchLight className="h-8 w-8 animate-spin text-rose-500" aria-hidden="true" />
              </div>
            )}
          </div>

          <input
            id="product-image"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleImageUpload}
            disabled={uploading}
            className="peer sr-only"
          />
          <label
            htmlFor="product-image"
            className="inline-flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-pill border border-border-strong bg-white px-5 text-sm font-medium text-ink-soft transition-colors hover:border-ink hover:text-ink peer-focus-visible:ring-2 peer-focus-visible:ring-rose-400 peer-focus-visible:ring-offset-2 peer-disabled:cursor-not-allowed peer-disabled:opacity-60"
          >
            <PiUploadSimpleLight className="h-4 w-4" aria-hidden="true" />
            {imageUrl ? "Replace image" : "Choose image"}
          </label>
          <p className="mt-2 text-xs text-ink-muted">JPEG, PNG or WebP.</p>
          {uploading && (
            <p role="status" className="mt-2 text-xs text-rose-500">
              Uploading...
            </p>
          )}
        </section>

        {/* Details */}
        <section aria-labelledby="details-heading" className={`${cardClass} space-y-5 lg:col-span-8`}>
          <h2 id="details-heading" className="text-lg font-display text-ink">
            Details
          </h2>

          <div>
            <label htmlFor="name" className={labelClass}>
              Product name
            </label>
            <input id="name" name="name" defaultValue={initialData?.name} required className={inputClass} />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="categorySlug" className={labelClass}>
                Category
              </label>
              <select
                id="categorySlug"
                name="categorySlug"
                defaultValue={categories.find((c) => c.id === initialData?.categoryId)?.slug || ""}
                required
                className={inputClass}
              >
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="price" className={labelClass}>
                Price (USD)
              </label>
              <div className="relative">
                <span
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted"
                  aria-hidden="true"
                >
                  $
                </span>
                <input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  inputMode="decimal"
                  defaultValue={initialData ? initialData.priceCents / 100 : ""}
                  required
                  className={`${inputClass} pl-8`}
                />
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="description" className={labelClass}>
              Description
              <Optional />
            </label>
            <textarea
              id="description"
              name="description"
              defaultValue={initialData?.description || ""}
              rows={4}
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="benefits" className={labelClass}>
                Benefits
                <Optional />
              </label>
              <textarea
                id="benefits"
                name="benefits"
                defaultValue={initialData?.benefits || ""}
                rows={3}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="ingredients" className={labelClass}>
                Ingredients
                <Optional />
              </label>
              <textarea
                id="ingredients"
                name="ingredients"
                defaultValue={initialData?.ingredients || ""}
                rows={3}
                className={inputClass}
              />
            </div>
          </div>
        </section>

        {/* Publish: a horizontal action bar on larger screens */}
        <section aria-labelledby="publish-heading" className={`${cardClass} lg:col-span-12`}>
          <h2 id="publish-heading" className="mb-4 text-lg font-display text-ink">
            Publish
          </h2>

          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="w-full md:max-w-xs">
              <label htmlFor="status" className={labelClass}>
                Status
              </label>
              <select
                id="status"
                name="status"
                defaultValue={initialData?.status || "DRAFT"}
                className={inputClass}
              >
                <option value="DRAFT">Draft (Hidden)</option>
                <option value="PUBLISHED">Published (Public)</option>
              </select>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row-reverse sm:justify-start">
              <Button
                type="submit"
                disabled={loading || uploading}
                aria-busy={loading}
                className="w-full sm:w-auto sm:min-w-44"
              >
                {loading ? (
                  <span className="inline-flex items-center justify-center">
                    <PiCircleNotchLight aria-hidden="true" className="mr-2 h-[18px] w-[18px] animate-spin" />
                    Saving product...
                  </span>
                ) : (
                  "Save product"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={loading || uploading}
                onClick={() => router.push("/admin/products")}
                className="w-full sm:w-auto sm:min-w-32"
              >
                Cancel
              </Button>
            </div>
          </div>
        </section>
      </div>
    </form>
  );
}