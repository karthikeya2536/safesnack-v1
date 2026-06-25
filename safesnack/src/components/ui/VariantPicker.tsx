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
    <div className="mt-6">
      <div className="flex flex-wrap gap-2">
        {variants.map((v) => (
          <button
            key={v.id}
            onClick={() => setSel(v)}
            className={`rounded-full border px-4 py-2 text-sm transition ${
              sel.id === v.id ? "border-forest bg-forest text-bone" : "border-charcoal/20 hover:border-forest"
            }`}
          >
            {v.label}
          </button>
        ))}
      </div>
      <p className="mt-4 font-serif text-2xl text-forest">{inr(sel.price)}</p>
      <button
        onClick={() => {
          addToCart({ variantId: sel.id, name: productName, label: sel.label, price: sel.price });
          setAdded(true);
          setTimeout(() => setAdded(false), 1500);
        }}
        className="mt-4 rounded-full bg-forest px-8 py-3 text-bone transition hover:bg-charcoal"
      >
        {added ? "Added ✓" : "Add to cart"}
      </button>
    </div>
  );
}
