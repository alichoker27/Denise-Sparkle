"use client";

import { useState } from "react";
import { PiCheckLight, PiGiftLight } from "react-icons/pi";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/lib/cart";

export function AddBundleToCartButton({ bundle }: { bundle: any }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addToCart({
      productId: bundle.id, // We use the bundle ID here
      name: bundle.name,
      priceCents: bundle.priceCents,
      quantity: 1,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div>
      <Button onClick={handleAdd} size="lg" className="w-full">
        <span className="inline-flex items-center justify-center gap-2.5">
          {added ? (
            <PiCheckLight className="h-5 w-5" aria-hidden="true" />
          ) : (
            <PiGiftLight className="h-5 w-5" aria-hidden="true" />
          )}
          {added ? "Bundle added to cart" : "Add bundle to cart"}
        </span>
      </Button>
      {/* Announces the confirmation to screen readers */}
      <span role="status" aria-live="polite" className="sr-only">
        {added ? `${bundle.name} added to cart` : ""}
      </span>
    </div>
  );
}