import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import {
  PiCaretDownLight,
  PiCaretRightLight,
  PiLeafLight,
  PiMapPinLight,
} from "react-icons/pi";
import { getProductBySlug, listPublishedProductsByCategory } from "@/lib/queries";
import { formatPrice } from "@/lib/format";
import { Container } from "@/components/layout/Container";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductGallery } from "@/components/product/ProductGallery";
import { AddToCartButton } from "@/components/cart/AddToCartButton";

// ─── Async data-fetching component (streams behind Suspense) ──────────────────

async function ProductDetailContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Fetch the product
  const product = await getProductBySlug(slug);

  // If no product is found (or it's a DRAFT), trigger the 404 page
  if (!product) {
    notFound();
  }

  // Fetch related products (from the same category)
  const relatedProducts = (await listPublishedProductsByCategory(product.category.slug))
    .filter((p) => p.id !== product.id)
    .slice(0, 4); // Show max 4 related products

  const scentNames = product.scents.map((s) => s.scent.name);

  const details = [
    product.benefits ? { title: "Benefits", body: product.benefits } : null,
    product.ingredients ? { title: "Ingredients", body: product.ingredients } : null,
  ].filter((d): d is { title: string; body: string } => d !== null);

  return (
    <Container>
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="mb-8 md:mb-12">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-ink-muted">
          <li>
            <Link href="/shop" className="transition-colors hover:text-ink">
              Shop
            </Link>
          </li>
          <li aria-hidden="true">
            <PiCaretRightLight className="h-3.5 w-3.5" />
          </li>
          <li>
            <Link
              href={`/shop?category=${product.category.slug}`}
              className="transition-colors hover:text-ink"
            >
              {product.category.name}
            </Link>
          </li>
          <li aria-hidden="true">
            <PiCaretRightLight className="h-3.5 w-3.5" />
          </li>
          <li aria-current="page" className="font-medium text-ink">
            {product.name}
          </li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:gap-20">
        {/* Left Column: Image Gallery */}
        <div className="md:sticky md:top-28 md:self-start">
          <ProductGallery images={product.images} productName={product.name} />
        </div>

        {/* Right Column: Product Info */}
        <div className="flex flex-col">
          <p className="mb-3 text-sm text-ink-muted">{product.category.name}</p>
          <h1 className="mb-4 text-4xl font-display leading-tight text-ink md:text-5xl">
            {product.name}
          </h1>

          <p className="mb-8 text-2xl font-medium text-ink">{formatPrice(product.priceCents)}</p>

          {product.description && (
            <p className="mb-10 max-w-prose leading-[1.8] text-ink-soft">{product.description}</p>
          )}

          {/* Scent selection + add to cart */}
          <div className="border-t border-border pt-8">
            <AddToCartButton product={product} scents={scentNames} />
            

            <ul className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-ink-soft">
              <li className="inline-flex items-center gap-2">
                <PiMapPinLight className="h-5 w-5 text-ink" aria-hidden="true" />
                Handcrafted in Lebanon
              </li>
              <li className="inline-flex items-center gap-2">
                <PiLeafLight className="h-5 w-5 text-ink" aria-hidden="true" />
                Natural ingredients
              </li>
            </ul>
          </div>

          {/* Details */}
          {details.length > 0 && (
            <div className="mt-10 divide-y divide-border border-y border-border">
              {details.map((d, i) => (
                <details key={d.title} className="group" open={i === 0}>
                  <summary className="flex cursor-pointer list-none items-center justify-between py-4 text-sm font-medium text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 [&::-webkit-details-marker]:hidden">
                    {d.title}
                    <PiCaretDownLight
                      className="h-4 w-4 text-ink-muted transition-transform duration-300 group-open:rotate-180 motion-reduce:transition-none"
                      aria-hidden="true"
                    />
                  </summary>
                  <p className="pb-5 text-sm leading-relaxed text-ink-soft">{d.body}</p>
                </details>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section aria-labelledby="related-heading" className="mt-24 border-t border-border/60 pt-14">
          <h2 id="related-heading" className="mb-10 text-3xl font-display text-ink">
            You may also like
          </h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </Container>
  );
}

// ─── Loading skeleton ─────────────────────────────────────────────────────────

function ProductDetailSkeleton() {
  return (
    <Container>
      <div className="mb-8 h-4 w-48 animate-pulse rounded bg-blush-50 md:mb-12" />
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:gap-20">
        <div>
          <div className="aspect-square animate-pulse rounded-3xl border border-border/30 bg-blush-50" />
          <div className="mt-4 grid grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-square animate-pulse rounded-xl bg-blush-50" />
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div className="h-4 w-24 animate-pulse rounded bg-blush-50" />
          <div className="h-12 w-64 animate-pulse rounded-lg bg-blush-50" />
          <div className="h-8 w-32 animate-pulse rounded bg-blush-50" />
          <div className="h-24 w-full animate-pulse rounded-lg bg-blush-50" />
          <div className="mt-8 h-14 w-full animate-pulse rounded-pill bg-blush-50" />
        </div>
      </div>
    </Container>
  );
}

// ─── Page (synchronous shell — Suspense defers the async work) ────────────────

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <main className="min-h-screen bg-surface-soft py-12 md:py-20">
      <Suspense fallback={<ProductDetailSkeleton />}>
        <ProductDetailContent params={params} />
      </Suspense>
    </main>
  );
}