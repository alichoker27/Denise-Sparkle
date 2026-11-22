import Image from "next/image";
import Link from "next/link";
import { PiArrowRightLight, PiGiftLight } from "react-icons/pi";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";
import { BundleWithItems } from "@/types";

interface BundleCardProps {
  bundle: BundleWithItems;
  /** Mirrors the layout (image on the right) on md+ screens. Presentation only. */
  reverse?: boolean;
}

export function BundleCard({ bundle, reverse = false }: BundleCardProps) {
  return (
    <Link
      href={`/bundles/${bundle.slug}`}
      className={cn(
        "group flex flex-col overflow-hidden rounded-3xl border border-border/50 bg-white shadow-sm transition-shadow duration-500 hover:shadow-card focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-4 focus-visible:ring-offset-surface-soft md:flex-row",
        reverse && "md:flex-row-reverse"
      )}
    >
      {/* Image side */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-blush-50 sm:aspect-[16/10] md:aspect-auto md:min-h-[24rem] md:w-1/2">
        {bundle.imageUrl ? (
          <Image
            src={bundle.imageUrl}
            alt={bundle.name}
            fill
            sizes="(min-width: 1024px) 40vw, (min-width: 768px) 45vw, 100vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center bg-blush-100 text-ink-muted"
            aria-hidden="true"
          >
            <PiGiftLight className="h-14 w-14 opacity-50" />
          </div>
        )}
      </div>

      {/* Details side */}
      <div className="flex flex-col justify-center p-6 sm:p-8 md:w-1/2 lg:p-12">
        <p className="mb-3 text-sm text-ink-muted">Exclusive bundle</p>
        <h3 className="mb-4 text-2xl font-display leading-tight text-ink transition-colors duration-300 group-hover:text-rose-500 md:text-3xl">
          {bundle.name}
        </h3>

        {bundle.description && (
          <p className="mb-8 line-clamp-3 text-sm leading-relaxed text-ink-soft md:text-base">
            {bundle.description}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between gap-4 border-t border-border/60 pt-5">
          <span className="text-xl font-medium text-ink md:text-2xl">
            {formatPrice(bundle.priceCents)}
          </span>
          <span className="inline-flex items-center gap-2 text-sm font-medium text-rose-500">
            View bundle
            <PiArrowRightLight
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
              aria-hidden="true"
            />
          </span>
        </div>
      </div>
    </Link>
  );
}