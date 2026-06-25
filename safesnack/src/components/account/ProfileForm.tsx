"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function ProfileForm({ id, name, phone }: { id: string; name: string; phone: string }) {
  const [n, setN] = useState(name);
  const [p, setP] = useState(phone);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const { error: err } = await createClient().from("profile").update({ name: n, phone: p }).eq("id", id);
    if (err) setError(err.message);
    else {
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    }
  }

  return (
    <form onSubmit={save} className="max-w-md space-y-4">
      <label className="block">
        <span className="text-sm text-charcoal/70">Name</span>
        <input value={n} onChange={(e) => setN(e.target.value)} className="mt-1 w-full rounded-xl border border-charcoal/20 px-4 py-3 outline-none focus:border-forest" />
      </label>
      <label className="block">
        <span className="text-sm text-charcoal/70">Phone</span>
        <input value={p} onChange={(e) => setP(e.target.value)} className="mt-1 w-full rounded-xl border border-charcoal/20 px-4 py-3 outline-none focus:border-forest" />
      </label>
      {error && <p className="text-sm text-clay">{error}</p>}
      <button className="rounded-full bg-forest px-6 py-3 text-bone transition hover:bg-charcoal">
        {saved ? "Saved ✓" : "Save changes"}
      </button>
    </form>
  );
}
