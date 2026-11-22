"use client";

import { useState } from "react";
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
    <Button onClick={handleAdd} size="lg" className="w-full text-lg shadow-hover">
      {added ? "Bundle Added to Cart!" : "Add Bundle to Cart"}
    </Button>
  );
}