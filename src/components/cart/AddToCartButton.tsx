"use client";

import { useState } from "react";
import { PiCheckLight, PiShoppingBagLight } from "react-icons/pi";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/lib/cart";
import { cn } from "@/lib/cn";
import type { Product } from "@/generated/prisma/client";

export function AddToCartButton({
  product,
  scents,
}: {
  product: Pick<Product, "id" | "name" | "priceCents">;
  scents: string[];
}) {
  const { addToCart, isMounted } = useCart();
  const [added, setAdded] = useState(false);
  const [selectedScent, setSelectedScent] = useState<string | null>(null);

  function handleAdd() {
    addToCart({
      productId: product.id,
      name: product.name,
      priceCents: product.priceCents,
      quantity: 1,
      scent: selectedScent || undefined,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="space-y-8">
      {scents.length > 0 && (
        <div role="group" aria-labelledby="scent-label">
          <div className="mb-3 flex items-baseline justify-between gap-4">
            <h3 id="scent-label" className="text-sm font-medium text-ink">
              Choose a scent
            </h3>
            {selectedScent && <span className="text-sm text-ink-muted">{selectedScent}</span>}
          </div>
          <div className="flex flex-wrap gap-2">
            {scents.map((scent) => {
              const selected = selectedScent === scent;
              return (
                <button
                  key={scent}
                  type="button"
                  onClick={() => setSelectedScent(scent)}
                  aria-pressed={selected}
                  className={cn(
                    "focus-ring rounded-pill border px-5 py-2 text-sm transition-colors duration-200",
                    selected
                      ? "border-ink bg-ink text-white"
                      : "border-border-strong bg-white text-ink-soft hover:border-ink hover:text-ink"
                  )}
                >
                  {scent}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div>
        <Button onClick={handleAdd} disabled={!isMounted} size="lg" className="w-full">
          <span className="inline-flex items-center justify-center gap-2.5">
            {added ? (
              <PiCheckLight className="h-5 w-5" aria-hidden="true" />
            ) : (
              <PiShoppingBagLight className="h-5 w-5" aria-hidden="true" />
            )}
            {added ? "Added to cart" : "Add to cart"}
          </span>
        </Button>
        {/* Announces the confirmation to screen readers */}
        <span role="status" aria-live="polite" className="sr-only">
          {added ? `${product.name} added to cart` : ""}
        </span>
      </div>
    </div>
  );
}