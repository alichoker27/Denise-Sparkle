"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/cn";

type GalleryImage = {
  id: string | number;
  url: string;
  altText?: string | null;
  isPrimary?: boolean;
};

export function ProductGallery({
  images,
  productName,
}: {
  images: GalleryImage[];
  productName: string;
}) {
  const primaryIndex = Math.max(
    0,
    images.findIndex((img) => img.isPrimary)
  );
  const [active, setActive] = useState(primaryIndex);

  if (images.length === 0) {
    return (
      <div className="flex aspect-square w-full items-center justify-center rounded-3xl border border-border bg-white text-sm text-ink-muted shadow-soft">
        No image available
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main image: all images are stacked and cross-faded so switching is instant */}
      <div className="relative aspect-square w-full overflow-hidden rounded-3xl border border-border bg-white shadow-soft">
        {images.map((img, i) => (
          <Image
            key={img.id}
            src={img.url}
            alt={img.altText || `${productName} – image ${i + 1}`}
            fill
            priority={i === primaryIndex}
            sizes="(min-width: 768px) 50vw, 100vw"
            aria-hidden={i !== active}
            className={cn(
              "object-cover transition-opacity duration-500 ease-out motion-reduce:transition-none",
              i === active ? "opacity-100" : "opacity-0"
            )}
          />
        ))}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <ul className="grid grid-cols-4 gap-3" aria-label="Product images">
          {images.map((img, i) => (
            <li key={img.id}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Show image ${i + 1} of ${images.length}`}
                aria-current={i === active}
                className={cn(
                  "relative block aspect-square w-full overflow-hidden rounded-xl border bg-white transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-soft",
                  i === active
                    ? "border-ink"
                    : "border-border opacity-70 hover:opacity-100 hover:border-border-strong"
                )}
              >
                <Image
                  src={img.url}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 12vw, 25vw"
                  className="object-cover"
                />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}