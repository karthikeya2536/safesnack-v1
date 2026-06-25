"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getCart, saveCart, cartTotal, type CartLine } from "@/lib/cart";
import { inr } from "@/lib/format";

const WHATSAPP = "919705316483";

export default function CartPage() {
  const [lines, setLines] = useState<CartLine[]>([]);
  useEffect(() => setLines(getCart()), []);
  const update = (next: CartLine[]) => { setLines(next); saveCart(next); };
  const total = cartTotal(lines);
  const waText = encodeURIComponent("Hi SafeSnack, I'd like to order:\n" + lines.map((line) => `${line.qty}x ${line.name} (${line.label})`).join("\n"));

  if (lines.length === 0) {
    return (
      <main className="ep-page">
        <div className="ep-card mx-auto max-w-2xl px-6 py-16 text-center">
          <p className="ep-kicker">Your cart</p>
          <h1 className="mt-4 text-4xl font-bold">Ready when you are.</h1>
          <p className="mt-4 text-charcoal/60">Your cart is empty. Find a snack that fits your day.</p>
          <Link href="/products" className="btn-primary mt-8 px-7">Shop snacks</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="ep-page">
      <div>
        <p className="ep-kicker">Your selection</p>
        <h1 className="ep-title mt-4">Cart.</h1>
        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_360px]">
          <ul className="space-y-3">
            {lines.map((line) => (
              <li key={line.variantId} className="ep-card grid gap-5 p-5 sm:grid-cols-[1fr_auto] sm:items-center">
                <div>
                  <p className="text-lg font-bold">{line.name}</p>
                  <p className="mt-1 text-sm text-charcoal/55">{line.label} • {inr(line.price)}</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center rounded-full border border-charcoal/10 bg-white">
                    <button onClick={() => update(lines.map((item) => item.variantId === line.variantId ? { ...item, qty: Math.max(1, item.qty - 1) } : item))} className="h-11 w-11 text-lg" aria-label="Decrease quantity">−</button>
                    <span className="w-9 text-center font-bold tabular-nums">{line.qty}</span>
                    <button onClick={() => update(lines.map((item) => item.variantId === line.variantId ? { ...item, qty: item.qty + 1 } : item))} className="h-11 w-11 text-lg" aria-label="Increase quantity">+</button>
                  </div>
                  <span className="min-w-20 text-right font-bold tabular-nums">{inr(line.price * line.qty)}</span>
                  <button onClick={() => update(lines.filter((item) => item.variantId !== line.variantId))} className="min-h-11 px-2 text-sm font-bold text-clay">Remove</button>
                </div>
              </li>
            ))}
          </ul>

          <aside className="ep-card h-fit p-6 lg:sticky lg:top-28">
            <h2 className="text-xl font-bold">Order summary</h2>
            <div className="mt-6 flex justify-between border-t border-charcoal/10 pt-5">
              <span className="text-charcoal/60">Subtotal</span>
              <span className="text-xl font-extrabold tabular-nums">{inr(total)}</span>
            </div>
            <p className="mt-2 text-xs leading-5 text-charcoal/45">Delivery and discounts are calculated at checkout.</p>
            <Link href="/checkout" className="btn-primary mt-6 w-full">Checkout</Link>
            <a href={`https://wa.me/${WHATSAPP}?text=${waText}`} target="_blank" rel="noopener noreferrer" className="btn-secondary mt-3 w-full">Order on WhatsApp</a>
          </aside>
        </div>
      </div>
    </main>
  );
}
