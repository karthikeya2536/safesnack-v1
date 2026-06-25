"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { inr } from "@/lib/format";

type Order = { id: string; status: string; total: number; created_at: string; customer: string | null };
const NEXT: Record<string, string[]> = {
  PAID: ["PROCESSING", "CANCELLED"],
  PROCESSING: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["OUT_FOR_DELIVERY"],
  OUT_FOR_DELIVERY: ["DELIVERED"],
};

export function OrderQueue({ initial }: { initial: Order[] }) {
  const sb = createClient();
  const [orders, setOrders] = useState(initial);
  const [error, setError] = useState<string | null>(null);

  async function advance(id: string, status: string) {
    setError(null);
    const prev = orders;
    setOrders(orders.map((o) => (o.id === id ? { ...o, status } : o)));
    const { error: err } = await sb.from("order").update({ status }).eq("id", id);
    if (err) { setError(err.message); setOrders(prev); }
  }

  if (orders.length === 0) return <p className="text-sm text-charcoal/60">No open orders. All caught up.</p>;

  return (
    <div>
      {error && <p className="mb-4 text-sm text-clay">{error}</p>}
      <ul className="divide-y divide-charcoal/10">
        {orders.map((o) => (
          <li key={o.id} className="flex flex-wrap items-center justify-between gap-3 py-4 text-sm">
            <span>
              <span className="font-mono text-xs text-charcoal/50">#{o.id.slice(0, 8)}</span>
              <span className="ml-3">{o.customer ?? "Customer"}</span>
              <span className="ml-3 text-charcoal/50">{new Date(o.created_at).toLocaleDateString("en-IN")}</span>
            </span>
            <span className="flex items-center gap-3">
              <span className="tabular-nums text-charcoal/60">{inr(Number(o.total))}</span>
              <span className="rounded-full bg-sage px-3 py-1 text-xs text-forest">{o.status.replaceAll("_", " ")}</span>
              {(NEXT[o.status] ?? []).map((s) => (
                <button key={s} onClick={() => advance(o.id, s)}
                  className={`rounded-full px-3 py-1 text-xs transition ${s === "CANCELLED" ? "border border-clay text-clay hover:bg-clay/10" : "bg-forest text-bone hover:bg-charcoal"}`}>
                  {s === "CANCELLED" ? "Cancel" : `→ ${s.replaceAll("_", " ")}`}
                </button>
              ))}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
