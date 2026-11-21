"use client";
import {
  createContext,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";
import type { ReactNode } from "react";

export type CartItem = {
  id: string;
  productId: number;
  name: string;
  priceCents: number;
  quantity: number;
  scent?: string;
};

type CartContextValue = {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, "id">) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  subtotalCents: number;
  isMounted: boolean;
};

const CART_STORAGE_KEY = "denise_cart";
const EMPTY_CART_SNAPSHOT = "[]";
const cartListeners = new Set<() => void>();

function getCartSnapshot() {
  return localStorage.getItem(CART_STORAGE_KEY) ?? EMPTY_CART_SNAPSHOT;
}

function getServerCartSnapshot() {
  return EMPTY_CART_SNAPSHOT;
}

function subscribeToCart(listener: () => void) {
  cartListeners.add(listener);
  const handleStorage = (event: StorageEvent) => {
    if (event.key === CART_STORAGE_KEY || event.key === null) listener();
  };
  window.addEventListener("storage", handleStorage);

  return () => {
    cartListeners.delete(listener);
    window.removeEventListener("storage", handleStorage);
  };
}

function subscribeToHydration() {
  return () => {};
}

function getClientSnapshot() {
  return true;
}

function getServerHydrationSnapshot() {
  return false;
}

function updateStoredCart(update: (cart: CartItem[]) => CartItem[]) {
  const cart = JSON.parse(getCartSnapshot()) as CartItem[];
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(update(cart)));
  cartListeners.forEach((listener) => listener());
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({
  children,
}: {
  children: ReactNode;
}) {
  const cartSnapshot = useSyncExternalStore(
    subscribeToCart,
    getCartSnapshot,
    getServerCartSnapshot,
  );
  const cart = useMemo(
    () => JSON.parse(cartSnapshot) as CartItem[],
    [cartSnapshot],
  );
  const isMounted = useSyncExternalStore(
    subscribeToHydration,
    getClientSnapshot,
    getServerHydrationSnapshot,
  );

  const addToCart = (item: Omit<CartItem, "id">) => {
    const id = `${item.productId}-${item.scent || "none"}`;
    updateStoredCart((currentCart) => {
      const existing = currentCart.find((i) => i.id === id);
      if (existing) {
        return currentCart.map((i) =>
          i.id === id ? { ...i, quantity: i.quantity + item.quantity } : i,
        );
      }
      return [...currentCart, { ...item, id }];
    });
  };

  const removeFromCart = (id: string) =>
    updateStoredCart((currentCart) => currentCart.filter((i) => i.id !== id));
  const updateQuantity = (id: string, quantity: number) =>
    updateStoredCart((currentCart) => {
      if (quantity < 1) return currentCart.filter((item) => item.id !== id);
      return currentCart.map((item) =>
        item.id === id ? { ...item, quantity } : item,
      );
    });

  const clearCart = () => updateStoredCart(() => []);
  const subtotalCents = cart.reduce((sum, item) => sum + item.priceCents * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        subtotalCents,
        isMounted,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const cart = useContext(CartContext);
  if (!cart) {
    throw new Error("useCart must be used within a CartProvider.");
  }
  return cart;
}