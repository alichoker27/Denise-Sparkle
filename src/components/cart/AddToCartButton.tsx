"use client";

import { useState } from "react";
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
    <div className="space-y-6">
      {scents.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold tracking-wider text-ink uppercase mb-3">Choose a Scent</h3>
          <div className="flex flex-wrap gap-2">
            {scents.map((scent) => (
              <button
                key={scent}
                type="button"
                onClick={() => setSelectedScent(scent)}
                className={cn(
                  "px-4 py-2 rounded-pill text-sm transition-all border focus-ring",
                  selectedScent === scent ? "bg-ink text-white border-ink" : "bg-white text-ink-soft border-border-strong hover:border-ink"
                )}
              >
                {scent}
              </button>
            ))}
          </div>
        </div>
      )}
      
      <Button onClick={handleAdd} disabled={!isMounted} size="lg" className="w-full text-lg shadow-hover">
        {added ? "Added to Cart!" : "Add to Cart"}
      </Button>
    </div>
  );
}