"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

type Address = { id: string; line1: string; line2: string | null; city: string; pincode: string };

export function AddressManager({ userId, initial }: { userId: string; initial: Address[] }) {
  const sb = createClient();
  const router = useRouter();
  const [list, setList] = useState(initial);
  const [form, setForm] = useState({ line1: "", line2: "", city: "Hyderabad", pincode: "" });
  const [error, setError] = useState<string | null>(null);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const { data, error: err } = await sb
      .from("address")
      .insert({ ...form, user_id: userId })
      .select("id,line1,line2,city,pincode")
      .single();
    if (err) return setError(err.message);
    setList([...list, data as Address]);
    setForm({ line1: "", line2: "", city: "Hyderabad", pincode: "" });
    router.refresh();
  }

  async function remove(id: string) {
    await sb.from("address").delete().eq("id", id);
    setList(list.filter((a) => a.id !== id));
  }

  return (
    <div className="space-y-8">
      <ul className="space-y-3">
        {list.length === 0 && <li className="text-sm text-charcoal/50">No saved addresses yet.</li>}
        {list.map((a) => (
          <li key={a.id} className="flex items-start justify-between rounded-xl border border-charcoal/10 p-4 text-sm">
            <span>{a.line1}{a.line2 ? `, ${a.line2}` : ""}, {a.city} — {a.pincode}</span>
            <button onClick={() => remove(a.id)} className="text-clay hover:underline">Remove</button>
          </li>
        ))}
      </ul>

      <form onSubmit={add} className="max-w-md space-y-3">
        <h3 className="font-medium text-forest">Add address</h3>
        <Inp ph="Address line 1" v={form.line1} set={(v) => setForm({ ...form, line1: v })} req />
        <Inp ph="Address line 2 (optional)" v={form.line2} set={(v) => setForm({ ...form, line2: v })} />
        <div className="flex gap-3">
          <Inp ph="City" v={form.city} set={(v) => setForm({ ...form, city: v })} req />
          <Inp ph="Pincode" v={form.pincode} set={(v) => setForm({ ...form, pincode: v })} req />
        </div>
        {error && <p className="text-sm text-clay">{error}</p>}
        <button className="rounded-full bg-forest px-6 py-3 text-bone transition hover:bg-charcoal">Save address</button>
      </form>
    </div>
  );
}

function Inp({ ph, v, set, req }: { ph: string; v: string; set: (v: string) => void; req?: boolean }) {
  return (
    <input
      placeholder={ph}
      value={v}
      required={req}
      onChange={(e) => set(e.target.value)}
      className="w-full rounded-xl border border-charcoal/20 px-4 py-3 outline-none focus:border-forest"
    />
  );
}
