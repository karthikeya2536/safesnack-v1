"use client";

export type CartLine = { variantId: string; name: string; label: string; price: number; qty: number };

const KEY = "safesnack_cart";

export function getCart(): CartLine[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function saveCart(lines: CartLine[]) {
  localStorage.setItem(KEY, JSON.stringify(lines));
  window.dispatchEvent(new Event("cart-change"));
}

export function addToCart(line: Omit<CartLine, "qty">, qty = 1) {
  const cart = getCart();
  const found = cart.find((l) => l.variantId === line.variantId);
  if (found) found.qty += qty;
  else cart.push({ ...line, qty });
  saveCart(cart);
  fetch("/api/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type: "ADD_TO_CART" }),
  }).catch(() => {});
}

export const cartTotal = (lines: CartLine[]) => lines.reduce((s, l) => s + l.price * l.qty, 0);
