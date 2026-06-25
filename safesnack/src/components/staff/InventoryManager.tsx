"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Batch = { id: string; batch_number: string | null; mfg_date: string | null; expiry_date: string | null; quantity: number };
type Variant = { id: string; label: string; product_name: string; batches: Batch[] };

export function InventoryManager({ initial }: { initial: Variant[] }) {
  const sb = createClient();
  const [variants, setVariants] = useState(initial);
  const [open, setOpen] = useState<string | null>(null);
  const [uid, setUid] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    sb.auth.getUser().then(({ data }) => setUid(data.user?.id ?? null));
  }, [sb]);

  const total = (v: Variant) => v.batches.reduce((s, b) => s + Number(b.quantity), 0);

  async function addBatch(variantId: string, form: { batch_number: string; mfg_date: string; expiry_date: string; quantity: string }) {
    setError(null);
    const qty = Number(form.quantity);
    const { data, error: e1 } = await sb.from("batch").insert({
      variant_id: variantId, batch_number: form.batch_number || null,
      mfg_date: form.mfg_date || null, expiry_date: form.expiry_date || null, quantity: qty,
    }).select("id,batch_number,mfg_date,expiry_date,quantity").single();
    if (e1) return setError(e1.message);
    await sb.from("inventory_movement").insert({ variant_id: variantId, batch_id: data.id, type: "IN", qty, staff_id: uid });
    setVariants(variants.map((v) => (v.id === variantId ? { ...v, batches: [...v.batches, data as Batch] } : v)));
  }

  async function adjust(variantId: string, batch: Batch, newQty: number) {
    setError(null);
    const delta = newQty - Number(batch.quantity);
    if (delta === 0) return;
    const { error: e1 } = await sb.from("batch").update({ quantity: newQty }).eq("id", batch.id);
    if (e1) return setError(e1.message);
    await sb.from("inventory_movement").insert({ variant_id: variantId, batch_id: batch.id, type: "ADJUST", qty: delta, staff_id: uid });
    setVariants(variants.map((v) => v.id === variantId
      ? { ...v, batches: v.batches.map((b) => (b.id === batch.id ? { ...b, quantity: newQty } : b)) } : v));
  }

  return (
    <div>
      {error && <p className="mb-4 text-sm text-clay">{error}</p>}
      <ul className="divide-y divide-charcoal/10">
        {variants.map((v) => {
          const stock = total(v);
          return (
            <li key={v.id} className="py-3">
              <button onClick={() => setOpen(open === v.id ? null : v.id)} className="flex w-full items-center justify-between text-left text-sm">
                <span>{v.product_name} <span className="text-charcoal/50">({v.label})</span></span>
                <span className={`tabular-nums ${stock <= 20 ? "text-clay" : "text-charcoal/70"}`}>{stock} in stock</span>
              </button>

              {open === v.id && (
                <div className="mt-3 space-y-3 rounded-xl bg-sage/20 p-4 text-sm">
                  {v.batches.length === 0 && <p className="text-charcoal/50">No batches yet.</p>}
                  {v.batches.map((b) => (
                    <div key={b.id} className="flex items-center justify-between gap-3">
                      <span>
                        <span className="font-mono text-xs">{b.batch_number ?? "—"}</span>
                        {b.expiry_date && <span className="ml-2 text-charcoal/50">exp {b.expiry_date}</span>}
                      </span>
                      <span className="flex items-center gap-2">
                        <input type="number" defaultValue={b.quantity} className="w-20 rounded border border-charcoal/20 px-2 py-1 tabular-nums"
                          onBlur={(e) => adjust(v.id, b, Number(e.target.value))} />
                        <span className="text-xs text-charcoal/40">qty (edit to adjust)</span>
                      </span>
                    </div>
                  ))}
                  <AddBatch onAdd={(form) => addBatch(v.id, form)} />
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function AddBatch({ onAdd }: { onAdd: (f: { batch_number: string; mfg_date: string; expiry_date: string; quantity: string }) => void }) {
  const [f, setF] = useState({ batch_number: "", mfg_date: "", expiry_date: "", quantity: "" });
  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onAdd(f); setF({ batch_number: "", mfg_date: "", expiry_date: "", quantity: "" }); }}
      className="mt-2 grid grid-cols-[1fr_1fr_1fr_80px_auto] items-center gap-2 border-t border-charcoal/10 pt-3"
    >
      <input placeholder="Batch #" value={f.batch_number} onChange={(e) => setF({ ...f, batch_number: e.target.value })} className="rounded border border-charcoal/20 px-2 py-1" />
      <input type="date" title="Manufacture date" value={f.mfg_date} onChange={(e) => setF({ ...f, mfg_date: e.target.value })} className="rounded border border-charcoal/20 px-2 py-1" />
      <input type="date" title="Expiry date" value={f.expiry_date} onChange={(e) => setF({ ...f, expiry_date: e.target.value })} className="rounded border border-charcoal/20 px-2 py-1" />
      <input type="number" placeholder="Qty" required value={f.quantity} onChange={(e) => setF({ ...f, quantity: e.target.value })} className="rounded border border-charcoal/20 px-2 py-1 tabular-nums" />
      <button className="rounded-full bg-forest px-4 py-1.5 text-xs text-bone transition hover:bg-charcoal">Add</button>
    </form>
  );
}
