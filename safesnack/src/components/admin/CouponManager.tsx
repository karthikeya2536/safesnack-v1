"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Coupon = { id: string; code: string; type: string; value: number; min_order: number; active: boolean };

export function CouponManager({ initial }: { initial: Coupon[] }) {
  const sb = createClient();
  const [list, setList] = useState(initial);
  const [form, setForm] = useState({ code: "", type: "PERCENT", value: "", min_order: "" });
  const [error, setError] = useState<string | null>(null);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const { data, error: err } = await sb.from("coupon").insert({
      code: form.code.toUpperCase(), type: form.type, value: Number(form.value),
      min_order: Number(form.min_order || 0), active: true,
    }).select("id,code,type,value,min_order,active").single();
    if (err) return setError(err.message);
    setList([data as Coupon, ...list]);
    setForm({ code: "", type: "PERCENT", value: "", min_order: "" });
  }
  async function toggle(c: Coupon) {
    await sb.from("coupon").update({ active: !c.active }).eq("id", c.id);
    setList(list.map((x) => (x.id === c.id ? { ...x, active: !x.active } : x)));
  }
  async function remove(id: string) {
    await sb.from("coupon").delete().eq("id", id);
    setList(list.filter((x) => x.id !== id));
  }

  return (
    <div className="space-y-8">
      <form onSubmit={add} className="grid max-w-2xl grid-cols-[1fr_120px_100px_120px_auto] items-end gap-3">
        <L label="Code"><input value={form.code} required onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} className="inp" /></L>
        <L label="Type">
          <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="inp">
            <option value="PERCENT">PERCENT</option><option value="FLAT">FLAT</option>
          </select>
        </L>
        <L label="Value"><input value={form.value} required onChange={(e) => setForm({ ...form, value: e.target.value })} className="inp tabular-nums" /></L>
        <L label="Min order"><input value={form.min_order} onChange={(e) => setForm({ ...form, min_order: e.target.value })} className="inp tabular-nums" /></L>
        <button className="rounded-full bg-forest px-5 py-2.5 text-sm text-bone transition hover:bg-charcoal">Add</button>
      </form>
      {error && <p className="text-sm text-clay">{error}</p>}

      <ul className="divide-y divide-charcoal/10">
        {list.map((c) => (
          <li key={c.id} className="flex items-center justify-between py-3 text-sm">
            <span><span className="font-mono">{c.code}</span> — {c.type === "PERCENT" ? `${c.value}%` : `₹${c.value}`} {c.min_order > 0 && `· min ₹${c.min_order}`}</span>
            <span className="flex items-center gap-4">
              <button onClick={() => toggle(c)} className={c.active ? "text-forest" : "text-charcoal/40"}>{c.active ? "Active" : "Inactive"}</button>
              <button onClick={() => remove(c.id)} className="text-clay hover:underline">Delete</button>
            </span>
          </li>
        ))}
      </ul>

      <style>{`.inp{margin-top:.25rem;width:100%;border-radius:.75rem;border:1px solid rgba(28,27,23,.2);padding:.5rem .75rem;outline:none}.inp:focus{border-color:#2F3D2E}`}</style>
    </div>
  );
}

function L({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block text-sm text-charcoal/70">{label}{children}</label>;
}
