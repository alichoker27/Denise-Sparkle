"use client";
import Link from "next/link";
import { CartIcon } from "@/components/icons/Icons";
import { useCart } from "@/lib/cart";

export function CartIconClient() {
  const { cart } = useCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Link href="/cart" aria-label="Cart" className="p-2 text-ink hover:text-rose-500 transition-colors focus-ring rounded-full relative">
      <CartIcon className="w-5 h-5" />
      {totalItems > 0 && (
        <span className="absolute top-1 right-0 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
          {totalItems}
        </span>
      )}
    </Link>
  );
}