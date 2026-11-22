import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/format";
import { ProductWithRelations } from "@/types";

export function ProductCard({ product }: { product: ProductWithRelations }) {
  const primaryImage = product.images.find((img) => img.isPrimary) || product.images[0];

  // Format scents (e.g., "Oud, Rose")
  const scentSummary =
    product.scents.length > 0
      ? product.scents.map((s) => s.scent.name).slice(0, 2).join(", ") +
        (product.scents.length > 2 ? "..." : "")
      : null;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-4 focus-visible:ring-offset-surface-soft"
    >
      {/* Image */}
      <div className="relative mb-4 aspect-[4/5] w-full overflow-hidden rounded-2xl border border-border/50 bg-blush-50 shadow-sm transition-shadow duration-500 group-hover:shadow-card">
        {primaryImage ? (
          <Image
            src={primaryImage.url}
            alt={primaryImage.altText || product.name}
            fill
            sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, 50vw"
            className={
              "object-cover transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100" +
              (!product.isAvailable ? " saturate-50" : "")
            }
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-ink-muted">
            No image
          </div>
        )}

        {!product.isAvailable && (
          <div className="absolute inset-0 flex items-end justify-start bg-white/40 p-3">
            <span className="rounded-pill bg-ink px-3 py-1 text-xs font-medium tracking-wide text-white">
              Sold out
            </span>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col px-1">
        <span className="mb-1 text-xs text-ink-muted">{product.category.name}</span>
        <h3 className="font-display text-lg leading-snug text-ink transition-colors duration-300 group-hover:text-rose-500">
          {product.name}
        </h3>

        {scentSummary && <p className="mt-1 text-xs text-ink-muted">{scentSummary}</p>}

        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="text-sm font-medium text-ink">{formatPrice(product.priceCents)}</span>
          <span
            className="h-px w-6 bg-border-strong transition-all duration-300 group-hover:w-10 group-hover:bg-rose-500 motion-reduce:transition-none"
            aria-hidden="true"
          />
        </div>
      </div>
    </Link>
  );
}