import Link from "next/link";
import { Suspense } from "react";
import { PiMagnifyingGlassLight } from "react-icons/pi";
import { ProductCard } from "@/components/product/ProductCard";
import { Container } from "@/components/layout/Container";
import { listPublishedProducts, listActiveCategories } from "@/lib/queries";
import { cn } from "@/lib/cn";

const pillBase =
  "whitespace-nowrap rounded-pill border px-6 py-2.5 text-sm font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-soft";
const pillActive = "border-ink bg-ink text-white";
const pillIdle = "border-border-strong bg-white text-ink-soft hover:border-ink hover:text-ink";

// ─── Async data-fetching component (streams behind Suspense) ──────────────────

async function ShopContent({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const params = await searchParams;
  const activeCategory = params.category;
  const searchQuery = params.q;

  // Fetch data in parallel
  const [categories, allProducts] = await Promise.all([
    listActiveCategories(),
    listPublishedProducts(),
  ]);

  // Filter products based on URL params (Server-Side filtering)
  let filteredProducts = allProducts;

  if (activeCategory) {
    filteredProducts = filteredProducts.filter((p) => p.category.slug === activeCategory);
  }

  if (searchQuery) {
    const lowerQuery = searchQuery.toLowerCase();
    filteredProducts = filteredProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(lowerQuery) ||
        p.description?.toLowerCase().includes(lowerQuery)
    );
  }

  const activeCategoryName = categories.find((c) => c.slug === activeCategory)?.name;
  const count = filteredProducts.length;

  return (
    <Container>
      {/* Header */}
      <header className="mb-10 flex flex-col justify-between gap-8 md:mb-14 md:flex-row md:items-end">
        <div>
          <h1 className="mb-4 text-4xl font-display leading-tight text-ink md:text-6xl">
            {activeCategoryName ?? "Shop all"}
          </h1>
          <p className="max-w-xl leading-relaxed text-ink-soft">
            Discover our full collection of natural, handcrafted beauty essentials.
          </p>
        </div>

        {/* Search */}
        <form className="relative w-full md:w-80" action="/shop" method="GET" role="search">
          {activeCategory && <input type="hidden" name="category" value={activeCategory} />}
          <label htmlFor="shop-search" className="sr-only">
            Search products
          </label>
          <input
            id="shop-search"
            type="search"
            name="q"
            defaultValue={searchQuery}
            placeholder="Search products"
            className="w-full rounded-pill border border-border-strong bg-white py-3 pl-5 pr-12 text-sm text-ink placeholder:text-ink-muted transition-colors focus:border-rose-400 focus:outline-none focus:ring-1 focus:ring-rose-400"
          />
          <button
            type="submit"
            aria-label="Search"
            className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-ink-muted transition-colors hover:text-rose-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
          >
            <PiMagnifyingGlassLight className="h-5 w-5" aria-hidden="true" />
          </button>
        </form>
      </header>

      {/* Filters + result count */}
      <div className="mb-10 border-b border-border/70 pb-6">
        <nav
          aria-label="Product categories"
          className="hide-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-2 md:mx-0 md:px-0"
        >
          <Link
            href="/shop"
            aria-current={!activeCategory ? "page" : undefined}
            className={cn(pillBase, !activeCategory ? pillActive : pillIdle)}
          >
            All Products
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.slug}${
                searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ""
              }`}
              aria-current={activeCategory === cat.slug ? "page" : undefined}
              className={cn(pillBase, activeCategory === cat.slug ? pillActive : pillIdle)}
            >
              {cat.name}
            </Link>
          ))}
        </nav>

        <p className="mt-4 text-sm text-ink-muted" aria-live="polite">
          {count} {count === 1 ? "product" : "products"}
          {searchQuery && (
            <>
              {" "}
              for &ldquo;{searchQuery}&rdquo;
              <Link
                href={activeCategory ? `/shop?category=${activeCategory}` : "/shop"}
                className="ml-3 text-rose-500 underline-offset-4 hover:underline"
              >
                Clear search
              </Link>
            </>
          )}
        </p>
      </div>

      {/* Product Grid */}
      {count > 0 ? (
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-14 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="rounded-3xl border border-border bg-white px-6 py-20 text-center md:py-24">
          <span
            className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-blush-100 text-ink"
            aria-hidden="true"
          >
            <PiMagnifyingGlassLight className="h-7 w-7" aria-hidden="true" />
          </span>
          <h2 className="mb-2 text-2xl font-display text-ink">No products found</h2>
          <p className="mx-auto mb-8 max-w-sm text-sm leading-relaxed text-ink-muted">
            We could not find any products matching your search. Try a different word or clear the
            filters.
          </p>
          <Link
            href="/shop"
            className="inline-block rounded-pill border border-border-strong px-6 py-2.5 text-sm font-medium text-ink transition-colors hover:border-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
          >
            Clear all filters
          </Link>
        </div>
      )}
    </Container>
  );
}

// ─── Loading skeleton (shown while data streams in) ───────────────────────────

function ShopSkeleton() {
  return (
    <Container>
      <div className="mb-10 flex flex-col justify-between gap-8 md:mb-14 md:flex-row md:items-end">
        <div>
          <div className="h-12 w-56 animate-pulse rounded-lg bg-blush-50" />
          <div className="mt-4 h-5 w-72 animate-pulse rounded-lg bg-blush-50" />
        </div>
        <div className="h-12 w-full animate-pulse rounded-pill bg-blush-50 md:w-80" />
      </div>
      <div className="mb-10 flex gap-2 border-b border-border/70 pb-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-10 w-28 animate-pulse rounded-pill bg-blush-50" />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-14 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i}>
            <div className="aspect-[4/5] w-full animate-pulse rounded-2xl border border-border/30 bg-blush-50" />
            <div className="mt-4 h-3 w-16 animate-pulse rounded bg-blush-50" />
            <div className="mt-2 h-5 w-3/4 animate-pulse rounded bg-blush-50" />
            <div className="mt-4 h-4 w-14 animate-pulse rounded bg-blush-50" />
          </div>
        ))}
      </div>
    </Container>
  );
}

// ─── Page (synchronous shell — Suspense defers the async work) ────────────────

export default function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  return (
    <main className="min-h-screen bg-surface-soft py-12 md:py-16">
      <Suspense fallback={<ShopSkeleton />}>
        <ShopContent searchParams={searchParams} />
      </Suspense>
    </main>
  );
}