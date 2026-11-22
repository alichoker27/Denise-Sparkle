import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PiCaretRightLight, PiGiftLight } from "react-icons/pi";
import { getBundleBySlug } from "@/lib/queries";
import { formatPrice } from "@/lib/format";
import { Container } from "@/components/layout/Container";
import { AddBundleToCartButton } from "@/components/cart/AddBundleToCartButton";

// 1. This is the main page component. It renders the static shell instantly.
export default function BundleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <main className="min-h-screen bg-surface-soft py-12 md:py-20">
      <Container>
        {/* Breadcrumbs (static, loads instantly) */}
        <nav aria-label="Breadcrumb" className="mb-8 md:mb-12">
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-ink-muted">
            <li>
              <Link href="/" className="transition-colors hover:text-ink">
                Home
              </Link>
            </li>
            <li aria-hidden="true">
              <PiCaretRightLight className="h-3.5 w-3.5" />
            </li>
            <li>
              <Link href="/collections" className="transition-colors hover:text-ink">
                Collections
              </Link>
            </li>
            <li aria-hidden="true">
              <PiCaretRightLight className="h-3.5 w-3.5" />
            </li>
            <li aria-current="page" className="font-medium text-ink">
              Bundle details
            </li>
          </ol>
        </nav>

        {/* 2. The Suspense boundary catches the dynamic data access */}
        <Suspense fallback={<BundleSkeleton />}>
          <BundleContent params={params} />
        </Suspense>
      </Container>
    </main>
  );
}

// 3. The actual data-fetching component
async function BundleContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const bundle = await getBundleBySlug(slug);

  if (!bundle) {
    notFound();
  }

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-20">
      {/* Left Column: Image */}
      <div className="lg:sticky lg:top-28 lg:self-start">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-border bg-blush-100 shadow-soft sm:aspect-[16/10] lg:aspect-square">
          {bundle.imageUrl ? (
            <Image
              src={bundle.imageUrl}
              alt={bundle.name}
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          ) : (
            <div
              className="flex h-full w-full items-center justify-center text-ink-muted"
              aria-hidden="true"
            >
              <PiGiftLight className="h-16 w-16 opacity-50" />
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Details */}
      <div className="flex flex-col">
        <p className="mb-3 text-sm text-ink-muted">Exclusive bundle</p>
        <h1 className="mb-4 text-4xl font-display leading-tight text-ink md:text-5xl">
          {bundle.name}
        </h1>
        <p className="mb-8 text-2xl font-medium text-ink">{formatPrice(bundle.priceCents)}</p>

        {bundle.description && (
          <p className="mb-10 max-w-prose leading-[1.8] text-ink-soft">{bundle.description}</p>
        )}

        {/* What's Inside */}
        <section
          aria-labelledby="bundle-contents"
          className="mb-10 rounded-2xl border border-border bg-white shadow-sm"
        >
          <h2
            id="bundle-contents"
            className="border-b border-border px-5 py-4 text-sm font-medium text-ink sm:px-6"
          >
            What&apos;s inside
          </h2>
          <ul className="divide-y divide-border/60">
            {bundle.items.map((item) => (
              <li key={item.id} className="flex items-center gap-4 px-5 py-4 sm:px-6">
                <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border border-border/50 bg-blush-50">
                  {item.product.images[0] ? (
                    <Image
                      src={item.product.images[0].url}
                      alt={item.product.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  ) : null}
                </div>
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/products/${item.product.slug}`}
                    className="font-medium text-ink transition-colors hover:text-rose-500 focus:outline-none focus-visible:text-rose-500 focus-visible:underline"
                  >
                    {item.product.name}
                  </Link>
                  <p className="mt-0.5 text-sm text-ink-muted">Qty: {item.quantity}</p>
                </div>
                <div className="text-sm font-medium text-ink">
                  {formatPrice(item.product.priceCents)}
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Add to cart */}
        <div className="border-t border-border pt-8">
          <AddBundleToCartButton bundle={bundle} />
        </div>
      </div>
    </div>
  );
}

// 4. A simple loading skeleton
function BundleSkeleton() {
  return (
    <div className="grid animate-pulse grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-20">
      <div className="aspect-[4/3] w-full rounded-3xl bg-blush-100 sm:aspect-[16/10] lg:aspect-square" />
      <div className="space-y-4 pt-4">
        <div className="h-4 w-1/4 rounded bg-blush-100" />
        <div className="h-10 w-3/4 rounded bg-blush-100" />
        <div className="h-6 w-1/4 rounded bg-blush-100" />
        <div className="mt-6 h-20 w-full rounded bg-blush-100" />
        <div className="h-48 w-full rounded-2xl bg-blush-100" />
        <div className="h-14 w-full rounded-pill bg-blush-100" />
      </div>
    </div>
  );
}