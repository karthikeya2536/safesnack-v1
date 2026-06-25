"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getCart, saveCart, cartTotal, type CartLine } from "@/lib/cart";
import { inr } from "@/lib/format";

const WHATSAPP = "919705316483";

export default function CartPage() {
  const [lines, setLines] = useState<CartLine[]>([]);

  useEffect(() => setLines(getCart()), []);

  function update(next: CartLine[]) {
    setLines(next);
    saveCart(next);
  }
  const setQty = (id: string, qty: number) =>
    update(lines.map((l) => (l.variantId === id ? { ...l, qty: Math.max(1, qty) } : l)));
  const remove = (id: string) => update(lines.filter((l) => l.variantId !== id));

  const total = cartTotal(lines);
  const waText = encodeURIComponent(
    "Hi SafeSnack, I'd like to order:\n" + lines.map((l) => `${l.qty}× ${l.name} (${l.label})`).join("\n"),
  );

  if (lines.length === 0)
    return (
      <main className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="font-serif text-3xl text-forest">Your cart is empty</h1>
        <p className="mt-3 text-charcoal/60">Find something guilt-free to snack on.</p>
        <Link href="/products" className="mt-8 inline-block rounded-full bg-forest px-8 py-3 text-bone transition hover:bg-charcoal">
          Shop snacks
        </Link>
      </main>
    );

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-serif text-4xl text-forest">Your Cart</h1>
      <ul className="mt-8 divide-y divide-charcoal/10">
        {lines.map((l) => (
          <li key={l.variantId} className="flex items-center justify-between gap-4 py-5">
            <div>
              <p className="font-serif text-lg">{l.name}</p>
              <p className="text-sm text-charcoal/60">{l.label} · {inr(l.price)}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center rounded-full border border-charcoal/20">
                <button onClick={() => setQty(l.variantId, l.qty - 1)} className="h-11 w-11 text-lg transition hover:text-clay" aria-label="Decrease quantity">−</button>
                <span className="w-8 text-center tabular-nums">{l.qty}</span>
                <button onClick={() => setQty(l.variantId, l.qty + 1)} className="h-11 w-11 text-lg transition hover:text-clay" aria-label="Increase quantity">+</button>
              </div>
              <span className="w-20 text-right tabular-nums">{inr(l.price * l.qty)}</span>
              <button onClick={() => remove(l.variantId)} className="text-sm text-clay hover:underline">Remove</button>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex items-center justify-between border-t border-charcoal/10 pt-6">
        <span className="text-charcoal/60">Subtotal</span>
        <span className="font-serif text-2xl text-forest tabular-nums">{inr(total)}</span>
      </div>
      <p className="mt-1 text-right text-xs text-charcoal/50">Delivery &amp; discounts calculated at checkout.</p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href="/checkout" className="flex-1 rounded-full bg-forest px-8 py-3 text-center text-bone transition hover:bg-charcoal">
          Checkout
        </Link>
        <a href={`https://wa.me/${WHATSAPP}?text=${waText}`} target="_blank" rel="noopener noreferrer"
          className="flex-1 rounded-full border border-forest px-8 py-3 text-center text-forest transition hover:bg-sage/40">
          Order on WhatsApp
        </a>
      </div>
    </main>
  );
}
