import { Suspense } from "react";
import Link from "next/link";
import { PiGiftLight } from "react-icons/pi";
import { listPublishedBundles } from "@/lib/queries";
import { Container } from "@/components/layout/Container";
import { BundleCard } from "@/components/bundle/BundleCard";

export const metadata = {
  title: "Collections & Bundles",
  description: "Discover our curated sets of natural beauty essentials.",
};

// ─── Async data-fetching component ────────────────────────────────────────────

async function CollectionsContent() {
  const bundles = await listPublishedBundles();

  return (
    <Container>
      <header className="mx-auto mb-12 max-w-2xl text-center md:mb-20">
        <h1 className="mb-5 text-4xl font-display leading-tight text-ink md:text-6xl">
          Our Collections
        </h1>
        <div className="mx-auto mb-5 h-px w-12 bg-border-strong" aria-hidden="true" />
        <p className="leading-relaxed text-ink-soft">
          Save more when you bundle. Curated sets of our most-loved products, designed to work
          perfectly together.
        </p>
      </header>

      {bundles.length > 0 ? (
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:gap-12">
          {bundles.map((bundle, i) => (
            <BundleCard key={bundle.id} bundle={bundle} reverse={i % 2 === 1} />
          ))}
        </div>
      ) : (
        <div className="mx-auto max-w-2xl rounded-3xl border border-border bg-white px-6 py-20 text-center md:py-24">
          <span
            className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-blush-100 text-ink"
            aria-hidden="true"
          >
            <PiGiftLight className="h-7 w-7" />
          </span>
          <h2 className="mb-2 text-2xl font-display text-ink">No bundles available yet</h2>
          <p className="mb-8 text-sm leading-relaxed text-ink-muted">
            Check back soon for our curated collections. In the meantime, you can browse every
            product on its own.
          </p>
          <Link
            href="/shop"
            className="inline-block rounded-pill border border-border-strong px-6 py-2.5 text-sm font-medium text-ink transition-colors hover:border-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
          >
            Browse the shop
          </Link>
        </div>
      )}
    </Container>
  );
}

// ─── Loading skeleton ─────────────────────────────────────────────────────────

function CollectionsSkeleton() {
  return (
    <Container>
      <div className="mx-auto mb-12 max-w-2xl text-center md:mb-20">
        <div className="mx-auto h-12 w-64 animate-pulse rounded-lg bg-blush-50" />
        <div className="mx-auto mt-6 h-4 w-3/4 animate-pulse rounded bg-blush-50" />
        <div className="mx-auto mt-3 h-4 w-1/2 animate-pulse rounded bg-blush-50" />
      </div>
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:gap-12">
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col overflow-hidden rounded-3xl border border-border/30 bg-white md:flex-row"
          >
            <div className="aspect-[4/3] w-full animate-pulse bg-blush-50 sm:aspect-[16/10] md:aspect-auto md:min-h-[24rem] md:w-1/2" />
            <div className="space-y-4 p-6 sm:p-8 md:w-1/2 lg:p-12">
              <div className="h-4 w-24 animate-pulse rounded bg-blush-50" />
              <div className="h-8 w-3/4 animate-pulse rounded bg-blush-50" />
              <div className="h-4 w-full animate-pulse rounded bg-blush-50" />
              <div className="h-4 w-2/3 animate-pulse rounded bg-blush-50" />
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
}

// ─── Page (sync) ──────────────────────────────────────────────────────────────

export default function CollectionsPage() {
  return (
    <main className="min-h-screen bg-surface-soft py-12 md:py-20">
      <Suspense fallback={<CollectionsSkeleton />}>
        <CollectionsContent />
      </Suspense>
    </main>
  );
}