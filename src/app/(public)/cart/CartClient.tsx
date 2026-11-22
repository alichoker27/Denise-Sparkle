"use client";

import Link from "next/link";
import {
  PiMinusLight,
  PiPlusLight,
  PiShoppingBagLight,
  PiTrashLight,
  PiWhatsappLogoLight,
} from "react-icons/pi";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/layout/Container";

const stepperButton =
  "focus-ring flex h-9 w-9 items-center justify-center text-ink-soft transition-colors hover:bg-blush-50 hover:text-ink";

export default function CartClient({
  whatsappNumber,
}: {
  whatsappNumber: string;
}) {
  const { cart, updateQuantity, removeFromCart, subtotalCents, isMounted } = useCart();

  if (!isMounted) {
    return (
      <main className="min-h-screen bg-surface-soft py-12 md:py-20">
        <Container className="max-w-5xl">
          <div role="status" aria-label="Loading cart" className="animate-pulse">
            <div className="mb-10 h-10 w-48 rounded-lg bg-blush-50" />
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              <div className="h-64 rounded-3xl bg-blush-50 lg:col-span-2" />
              <div className="h-56 rounded-3xl bg-blush-50" />
            </div>
          </div>
        </Container>
      </main>
    );
  }

  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-surface-soft py-12 md:py-20">
        <Container className="max-w-xl">
          <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
            <span
              className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blush-100 text-ink"
              aria-hidden="true"
            >
              <PiShoppingBagLight className="h-8 w-8" />
            </span>
            <h1 className="mb-3 text-3xl font-display text-ink md:text-4xl">Your cart is empty</h1>
            <p className="mb-8 text-sm leading-relaxed text-ink-muted">
              Browse the collection and add something you love.
            </p>
            <Button href="/shop">Continue shopping</Button>
          </div>
        </Container>
      </main>
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

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <main className="min-h-screen bg-surface-soft py-12 md:py-20">
      <Container className="max-w-5xl">
        <header className="mb-8 md:mb-12">
          <h1 className="text-4xl font-display leading-tight text-ink md:text-5xl">Your cart</h1>
          <p className="mt-2 text-sm text-ink-muted">
            {itemCount} {itemCount === 1 ? "item" : "items"}
          </p>
        </header>

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3 lg:gap-12">
          {/* Items */}
          <ul className="divide-y divide-border rounded-3xl border border-border bg-white px-5 shadow-sm sm:px-8 lg:col-span-2">
            {cart.map((item) => (
              <li
                key={item.id}
                className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
              >
                <div className="min-w-0">
                  <p className="font-display text-lg leading-snug text-ink">{item.name}</p>
                  {item.scent && <p className="mt-0.5 text-sm text-ink-muted">Scent: {item.scent}</p>}
                  <p className="mt-1 text-sm text-ink-muted">{formatPrice(item.priceCents)} each</p>
                </div>

                <div className="flex items-center justify-between gap-4 sm:justify-end sm:gap-6">
                  <div
                    role="group"
                    aria-label={`Quantity for ${item.name}`}
                    className="flex items-center overflow-hidden rounded-pill border border-border-strong"
                  >
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      aria-label={`Decrease quantity of ${item.name}`}
                      className={stepperButton}
                    >
                      <PiMinusLight className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <span className="min-w-8 text-center text-sm font-medium text-ink" aria-live="polite">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      aria-label={`Increase quantity of ${item.name}`}
                      className={stepperButton}
                    >
                      <PiPlusLight className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>

                  <p className="w-24 text-right text-sm font-medium text-ink">
                    {formatPrice(item.priceCents * item.quantity)}
                  </p>

                  <button
                    type="button"
                    onClick={() => removeFromCart(item.id)}
                    aria-label={`Remove ${item.name} from cart`}
                    className="focus-ring flex h-9 w-9 items-center justify-center rounded-full text-ink-muted transition-colors hover:text-rose-500"
                  >
                    <PiTrashLight className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>
              </li>
            ))}
          </ul>

          {/* Summary */}
          <aside
            aria-labelledby="summary-heading"
            className="rounded-3xl border border-border bg-white p-6 shadow-sm sm:p-8 lg:sticky lg:top-28"
          >
            <h2 id="summary-heading" className="mb-6 text-xl font-display text-ink">
              Order summary
            </h2>
            <div className="flex items-baseline justify-between border-t border-border pt-5">
              <span className="text-ink-soft">Total</span>
              <span className="text-2xl font-medium text-ink">{formatPrice(subtotalCents)}</span>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-ink-muted">
              Checkout opens WhatsApp with your order ready to send.
            </p>
            <Button onClick={handleCheckout} size="lg" className="mt-6 w-full">
              <span className="inline-flex items-center justify-center gap-2.5">
                <PiWhatsappLogoLight className="h-5 w-5" aria-hidden="true" />
                Checkout via WhatsApp
              </span>
            </Button>
            <Link
              href="/shop"
              className="focus-ring mt-4 block rounded-pill py-2 text-center text-sm text-ink-soft transition-colors hover:text-ink"
            >
              Continue shopping
            </Link>
          </aside>
        </div>
      </Container>
    </main>
  );
}