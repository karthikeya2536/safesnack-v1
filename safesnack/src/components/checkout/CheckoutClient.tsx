"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getCart, cartTotal, saveCart, type CartLine } from "@/lib/cart";
import { inr } from "@/lib/format";

type Address = { id: string; line1: string; line2: string | null; city: string; pincode: string };
type Zone = { pincode: string; area: string; delivery_fee: number; min_order: number; eta_minutes: number };

declare global {
  interface Window { Razorpay?: new (opts: Record<string, unknown>) => { open: () => void } }
}

function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

export function CheckoutClient({ addresses, zones, pointsBalance }: { addresses: Address[]; zones: Zone[]; pointsBalance: number }) {
  const router = useRouter();
  const [lines, setLines] = useState<CartLine[]>([]);
  const [addressId, setAddressId] = useState(addresses[0]?.id ?? "");
  const [coupon, setCoupon] = useState("");
  const [usePoints, setUsePoints] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => setLines(getCart()), []);

  const address = addresses.find((a) => a.id === addressId);
  const zone = useMemo(() => zones.find((z) => z.pincode === address?.pincode), [zones, address]);
  const subtotal = cartTotal(lines);
  const redeemable = Math.min(pointsBalance, subtotal);
  const redeemPoints = usePoints ? redeemable : 0;

  async function pay() {
    setError(null);
    if (!address) return setError("Please add a delivery address first.");
    if (lines.length === 0) return setError("Your cart is empty.");
    setLoading(true);
    fetch("/api/track", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "BEGIN_CHECKOUT" }) }).catch(() => {});
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cart: lines.map((l) => ({ variantId: l.variantId, qty: l.qty })),
          couponCode: coupon || undefined,
          redeemPoints,
          pincode: address.pincode,
          address: { line1: address.line1, line2: address.line2 ?? undefined, city: address.city, pincode: address.pincode },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Checkout failed.");

      const ok = await loadRazorpay();
      if (!ok || !window.Razorpay) throw new Error("Could not load payment. Check your connection.");

      const rzp = new window.Razorpay({
        key: data.keyId,
        amount: data.amount,
        currency: "INR",
        name: "SafeSnack",
        description: "Order payment",
        order_id: data.razorpayOrderId,
        handler: async (resp: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          const confirm = await fetch("/api/checkout/confirm", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderId: data.orderId, ...resp }),
          });
          if (confirm.ok) {
            saveCart([]);
            router.push(`/account/orders/${data.orderId}`);
          } else {
            setError("Payment captured but confirmation failed. We'll sort it via webhook — check your orders.");
          }
        },
        theme: { color: "#2F3D2E" },
      });
      rzp.open();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  if (lines.length === 0)
    return (
      <p className="mt-8 text-charcoal/60">
        Your cart is empty. <Link href="/products" className="text-clay hover:underline">Shop snacks</Link>.
      </p>
    );

  return (
    <div className="mt-10 grid gap-10 md:grid-cols-[1fr_320px]">
      {/* Address */}
      <section>
        <h2 className="font-serif text-2xl text-forest">Delivery address</h2>
        {addresses.length === 0 ? (
          <p className="mt-3 text-sm text-charcoal/60">
            No saved address. <Link href="/account/addresses" className="text-clay hover:underline">Add one</Link> to continue.
          </p>
        ) : (
          <div className="mt-4 space-y-3">
            {addresses.map((a) => (
              <label key={a.id} className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 text-sm transition ${addressId === a.id ? "border-forest bg-sage/30" : "border-charcoal/15"}`}>
                <input type="radio" name="addr" checked={addressId === a.id} onChange={() => setAddressId(a.id)} className="mt-1" />
                <span>{a.line1}{a.line2 ? `, ${a.line2}` : ""}, {a.city} — {a.pincode}</span>
              </label>
            ))}
            <Link href="/account/addresses" className="inline-block text-sm text-clay hover:underline">+ Add another address</Link>
          </div>
        )}

        {address && !zone && (
          <p className="mt-4 rounded-lg bg-clay/10 px-4 py-3 text-sm text-clay">We don&apos;t deliver to {address.pincode} yet.</p>
        )}
        {zone && (
          <p className="mt-4 text-sm text-charcoal/60">Delivers to {zone.area} · ~{zone.eta_minutes} min · fee {inr(zone.delivery_fee)} · min {inr(zone.min_order)}</p>
        )}
      </section>

      {/* Summary */}
      <aside className="h-fit rounded-2xl border border-charcoal/10 p-6">
        <h2 className="font-serif text-xl text-forest">Order summary</h2>
        <ul className="mt-4 space-y-2 text-sm">
          {lines.map((l) => (
            <li key={l.variantId} className="flex justify-between">
              <span className="text-charcoal/70">{l.qty}× {l.name}</span>
              <span className="tabular-nums">{inr(l.price * l.qty)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-between border-t border-charcoal/10 pt-4 text-sm">
          <span className="text-charcoal/60">Subtotal</span>
          <span className="tabular-nums">{inr(subtotal)}</span>
        </div>

        <label className="mt-4 block">
          <span className="text-sm text-charcoal/70">Coupon code</span>
          <input value={coupon} onChange={(e) => setCoupon(e.target.value.toUpperCase())} placeholder="WELCOME10"
            className="mt-1 w-full rounded-xl border border-charcoal/20 px-4 py-3 outline-none focus:border-forest" />
        </label>

        {pointsBalance > 0 && (
          <label className="mt-4 flex items-center justify-between rounded-xl bg-sage/30 px-4 py-3 text-sm">
            <span>Use {redeemable} points <span className="text-charcoal/50">(₹{redeemable} off)</span></span>
            <input type="checkbox" checked={usePoints} onChange={(e) => setUsePoints(e.target.checked)} />
          </label>
        )}
        {redeemPoints > 0 && (
          <div className="mt-2 flex justify-between text-sm text-clay">
            <span>Points</span><span className="tabular-nums">−{inr(redeemPoints)}</span>
          </div>
        )}

        {error && <p className="mt-4 text-sm text-clay" role="alert">{error}</p>}

        <button onClick={pay} disabled={loading || !address || !zone}
          className="mt-5 w-full rounded-full bg-forest px-6 py-3 text-bone transition hover:bg-charcoal disabled:opacity-60">
          {loading ? "Processing…" : "Pay with Razorpay"}
        </button>
        <p className="mt-2 text-center text-xs text-charcoal/40">Final total incl. delivery &amp; discount shown on the payment screen.</p>
      </aside>
    </div>
  );
}
