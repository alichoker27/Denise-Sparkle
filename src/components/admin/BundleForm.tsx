"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  PiCircleNotchLight,
  PiImageLight,
  PiPlusLight,
  PiTrashLight,
  PiUploadSimpleLight,
} from "react-icons/pi";
import { Button } from "@/components/ui/Button";
import { Product } from "@/generated/prisma/client";

interface BundleFormProps {
  products: Product[];
  action: (formData: FormData) => Promise<{ error?: string; success?: boolean }>;
}

interface BundleItemForm {
  productSlug: string;
  quantity: number;
}

const labelClass = "mb-1.5 block text-sm font-medium text-ink";
const inputClass =
  "w-full rounded-xl border border-border-strong bg-white px-4 py-3 text-ink transition-colors focus:border-rose-400 focus:outline-none focus:ring-1 focus:ring-rose-400 disabled:opacity-60";
const cardClass =
  "rounded-2xl border border-border bg-white p-5 shadow-sm sm:p-6 lg:p-8";

export function BundleForm({ products, action }: BundleFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED">("DRAFT");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [items, setItems] = useState<BundleItemForm[]>([]);
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
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
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
    } catch (uploadError: unknown) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Image upload failed.",
      );
    } finally {
      setUploading(false);
    }
  }

  function addItem() {
    setFieldError(null);
    setItems((current) => [
      ...current,
      { productSlug: "", quantity: 1 },
    ]);
  }

  function updateItem(
    index: number,
    field: keyof BundleItemForm,
    value: string | number,
  ) {
    setFieldError(null);
    setItems((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item,
      ),
    );
  }

  function removeItem(index: number) {
    setFieldError(null);
    setItems((current) => current.filter((_, itemIndex) => itemIndex !== index));
  }

  async function handleSubmit(formData: FormData) {
    setError(null);
    setFieldError(null);

    if (items.length === 0) {
      setFieldError("Add at least one product to this bundle.");
      return;
    }

    const incompleteItem = items.find(
      (item) => !item.productSlug || !Number.isInteger(item.quantity) || item.quantity < 1,
    );
    if (incompleteItem) {
      setFieldError(
        "Choose a product and enter a whole quantity of at least 1 for every item.",
      );
      return;
    }

    const selectedSlugs = items.map((item) => item.productSlug);
    if (new Set(selectedSlugs).size !== selectedSlugs.length) {
      setFieldError("Add each product only once to this bundle.");
      return;
    }

    setLoading(true);
    if (imageUrl) formData.append("imageUrl", imageUrl);
    formData.append("items", JSON.stringify(items));

    try {
      const result = await action(formData);
      if (result?.error) {
        setError(result.error);
      } else if (result?.success) {
        router.push("/admin/bundles");
      }
    } catch (submitError: unknown) {
      console.error("Failed to save bundle:", submitError);
      setError("We couldn't save this bundle. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      action={handleSubmit}
      aria-busy={loading || uploading}
      className="max-w-7xl space-y-6"
    >
      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-600"
        >
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
        <section
          aria-labelledby="bundle-image-heading"
          className={`${cardClass} lg:col-span-4 lg:self-start`}
        >
          <h2
            id="bundle-image-heading"
            className="mb-4 text-lg font-display text-ink"
          >
            Bundle image
          </h2>

          <div className="relative mb-4 aspect-square w-full overflow-hidden rounded-xl border border-border bg-blush-50">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt="Bundle preview"
                fill
                sizes="(min-width: 1280px) 360px, (min-width: 1024px) 28vw, (min-width: 640px) 480px, 100vw"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-ink-muted">
                <PiImageLight
                  className="h-10 w-10 opacity-60"
                  aria-hidden="true"
                />
                <span className="text-sm">No image yet</span>
              </div>
            )}
            {uploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/70">
                <PiCircleNotchLight
                  className="h-8 w-8 animate-spin text-rose-500"
                  aria-hidden="true"
                />
              </div>
            )}
          </div>

          <input
            id="bundle-image"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleImageUpload}
            disabled={uploading}
            className="peer sr-only"
          />
          <label
            htmlFor="bundle-image"
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

        <section
          aria-labelledby="bundle-details-heading"
          className={`${cardClass} space-y-5 lg:col-span-8`}
        >
          <h2
            id="bundle-details-heading"
            className="text-lg font-display text-ink"
          >
            Bundle details
          </h2>

          <div>
            <label htmlFor="bundle-name" className={labelClass}>
              Bundle name
            </label>
            <input
              id="bundle-name"
              name="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              autoComplete="off"
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="bundle-price" className={labelClass}>
                Bundle price (USD)
              </label>
              <div className="relative">
                <span
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted"
                  aria-hidden="true"
                >
                  $
                </span>
                <input
                  id="bundle-price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  inputMode="decimal"
                  value={price}
                  onChange={(event) => setPrice(event.target.value)}
                  required
                  className={`${inputClass} pl-8`}
                />
              </div>
            </div>

            <div>
              <label htmlFor="bundle-status" className={labelClass}>
                Status
              </label>
              <select
                id="bundle-status"
                name="status"
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value as "DRAFT" | "PUBLISHED")
                }
                className={inputClass}
              >
                <option value="DRAFT">Draft (Hidden)</option>
                <option value="PUBLISHED">Published (Public)</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="bundle-description" className={labelClass}>
              Description
              <span className="font-normal text-ink-muted"> (optional)</span>
            </label>
            <textarea
              id="bundle-description"
              name="description"
              rows={4}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className={`${inputClass} resize-y`}
            />
          </div>
        </section>

        <section
          aria-labelledby="bundle-products-heading"
          className={`${cardClass} lg:col-span-12`}
        >
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2
                id="bundle-products-heading"
                className="text-lg font-display text-ink"
              >
                Products in bundle
              </h2>
              <p className="mt-1 text-sm text-ink-muted">
                Add at least one published product and its quantity.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addItem}
              disabled={loading || uploading}
              className="w-full sm:w-auto"
            >
              <PiPlusLight className="mr-2 h-4 w-4" aria-hidden="true" />
              Add product
            </Button>
          </div>

          {items.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border-strong bg-blush-50/50 px-5 py-8 text-center">
              <p className="text-sm font-medium text-ink">No products added yet</p>
              <p className="mt-1 text-xs text-ink-muted">
                Use “Add product” to build this bundle.
              </p>
              {fieldError && (
                <p role="alert" className="mt-3 text-sm font-medium text-red-600">
                  {fieldError}
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {fieldError && (
                <p
                  role="alert"
                  className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600"
                >
                  {fieldError}
                </p>
              )}
              {items.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 gap-3 rounded-xl border border-border bg-surface-soft/40 p-3 sm:grid-cols-[minmax(0,1fr)_120px_auto] sm:items-end"
                >
                  <div>
                    <label
                      htmlFor={`bundle-product-${index}`}
                      className={labelClass}
                    >
                      Product {index + 1}
                    </label>
                    <select
                      id={`bundle-product-${index}`}
                      value={item.productSlug}
                      onChange={(event) =>
                        updateItem(index, "productSlug", event.target.value)
                      }
                      className={inputClass}
                    >
                      <option value="">Select a product...</option>
                      {products.map((product) => (
                        <option key={product.id} value={product.slug}>
                          {product.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor={`bundle-quantity-${index}`}
                      className={labelClass}
                    >
                      Quantity
                    </label>
                    <input
                      id={`bundle-quantity-${index}`}
                      type="number"
                      min="1"
                      step="1"
                      value={item.quantity}
                      onChange={(event) =>
                        updateItem(
                          index,
                          "quantity",
                          Number.parseInt(event.target.value, 10) || 0,
                        )
                      }
                      className={inputClass}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    disabled={loading || uploading}
                    className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-pill px-4 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-60"
                  >
                    <PiTrashLight className="h-4 w-4" aria-hidden="true" />
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <section
          aria-labelledby="bundle-publish-heading"
          className={`${cardClass} lg:col-span-12`}
        >
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2
                id="bundle-publish-heading"
                className="text-lg font-display text-ink"
              >
                Ready to save?
              </h2>
              <p className="mt-1 text-sm text-ink-muted">
                Draft bundles stay hidden from customers.
              </p>
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
                    <PiCircleNotchLight
                      aria-hidden="true"
                      className="mr-2 h-[18px] w-[18px] animate-spin"
                    />
                    Saving bundle...
                  </span>
                ) : (
                  "Save bundle"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={loading || uploading}
                onClick={() => router.push("/admin/bundles")}
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
