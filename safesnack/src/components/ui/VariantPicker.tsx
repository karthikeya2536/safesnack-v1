"use client";

import { useState } from "react";
import { addToCart } from "@/lib/cart";
import { inr } from "@/lib/format";
import type { Variant } from "@/lib/queries";

export function VariantPicker({ productName, variants }: { productName: string; variants: Variant[] }) {
  const [sel, setSel] = useState(variants[0]);
  const [added, setAdded] = useState(false);
  if (!sel) return null;

  return (
    <div className="mt-8">
      <p className="mb-3 text-sm font-bold text-charcoal">Choose size</p>
      <div className="flex flex-wrap gap-2">
        {variants.map((v) => (
          <button
            key={v.id}
            onClick={() => setSel(v)}
            className={`min-h-11 rounded-full border px-5 py-2 text-sm font-bold transition ${
              sel.id === v.id ? "border-charcoal bg-charcoal text-white" : "border-charcoal/15 bg-white hover:border-charcoal"
            }`}
          >
            {v.label}
          </button>
        ))}
      </div>
      <p className="mt-6 text-3xl font-extrabold text-charcoal tabular-nums">{inr(sel.price)}</p>
      <button
        onClick={() => {
          addToCart({ variantId: sel.id, name: productName, label: sel.label, price: sel.price });
          setAdded(true);
          setTimeout(() => setAdded(false), 1500);
        }}
        className="btn-primary mt-5 w-full px-8"
      >
        {added ? "Added to cart" : "Add to cart"}
      </button>
    </div>
  );
}
