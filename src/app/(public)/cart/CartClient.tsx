"use client";

import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/Button";

export default function CartClient({
  whatsappNumber,
}: {
  whatsappNumber: string;
}) {
  const { cart, updateQuantity, removeFromCart, subtotalCents, isMounted } = useCart();

  if (!isMounted) return <div className="p-20 text-center">Loading cart...</div>;

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <h1 className="text-3xl font-display mb-4">Your Cart is Empty</h1>
        <Button href="/shop">Continue Shopping</Button>
      </div>
    );
  }

  const handleCheckout = () => {
    let message = "Hi Denise, I would like to order:\n";
    cart.forEach((item) => {
      message += `- ${item.name} ${item.scent ? `(${item.scent})` : ""} x${item.quantity}\n`;
    });
    message += `\nSubtotal: ${formatPrice(subtotalCents)}\n`;
    message += "Please confirm my first-purchase eligibility if applicable.";
    window.open(
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <div className="container-site py-12 max-w-4xl">
      <h1 className="text-3xl font-display mb-8">Your Cart</h1>
      <div className="bg-white rounded-3xl border border-border p-6 shadow-sm">
        {cart.map((item) => (
          <div key={item.id} className="flex items-center justify-between border-b border-border py-4 last:border-0">
            <div>
              <p className="font-medium text-ink">{item.name}</p>
              {item.scent && <p className="text-sm text-ink-muted">Scent: {item.scent}</p>}
              <p className="text-sm font-semibold text-rose-500">{formatPrice(item.priceCents)}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-border rounded-lg">
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-3 py-1">-</button>
                <span className="px-3 py-1">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-3 py-1">+</button>
              </div>
              <button onClick={() => removeFromCart(item.id)} className="text-sm text-red-500">Remove</button>
            </div>
          </div>
        ))}
        <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
          <p className="text-xl font-semibold">Total: {formatPrice(subtotalCents)}</p>
          <Button onClick={handleCheckout} size="lg">Checkout via WhatsApp</Button>
        </div>
      </div>
    </div>
  );
}
