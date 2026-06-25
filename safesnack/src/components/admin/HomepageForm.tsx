"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Ref = { id: string; name: string };
type HC = {
  hero_title: string; hero_subtitle: string; hero_cta: string;
  featured_product_ids: string[]; featured_bundle_ids: string[];
};

export function HomepageForm({ initial, products, bundles }: { initial: HC; products: Ref[]; bundles: Ref[] }) {
  const sb = createClient();
  const [f, setF] = useState(initial);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggle = (key: "featured_product_ids" | "featured_bundle_ids", id: string) =>
    setF({ ...f, [key]: f[key].includes(id) ? f[key].filter((x) => x !== id) : [...f[key], id] });

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const { error: err } = await sb.from("homepage_content").update({
      hero_title: f.hero_title, hero_subtitle: f.hero_subtitle, hero_cta: f.hero_cta,
      featured_product_ids: f.featured_product_ids, featured_bundle_ids: f.featured_bundle_ids,
    }).eq("id", 1);
    if (err) setError(err.message);
    else { setSaved(true); setTimeout(() => setSaved(false), 1500); }
  }

  return (
    <form onSubmit={save} className="max-w-2xl space-y-5">
      <Field label="Hero title" v={f.hero_title} set={(v) => setF({ ...f, hero_title: v })} />
      <Field label="Hero subtitle" v={f.hero_subtitle} set={(v) => setF({ ...f, hero_subtitle: v })} />
      <Field label="Hero CTA" v={f.hero_cta} set={(v) => setF({ ...f, hero_cta: v })} />

      <Picker title="Featured products" items={products} selected={f.featured_product_ids} onToggle={(id) => toggle("featured_product_ids", id)} />
      <Picker title="Featured bundles" items={bundles} selected={f.featured_bundle_ids} onToggle={(id) => toggle("featured_bundle_ids", id)} />

      {error && <p className="text-sm text-clay">{error}</p>}
      <button className="rounded-full bg-forest px-8 py-3 text-bone transition hover:bg-charcoal">{saved ? "Saved ✓" : "Save homepage"}</button>
    </form>
  );
}

function Field({ label, v, set }: { label: string; v: string; set: (v: string) => void }) {
  return (
    <label className="block">
      <span className="text-sm text-charcoal/70">{label}</span>
      <input value={v} onChange={(e) => set(e.target.value)} className="mt-1 w-full rounded-xl border border-charcoal/20 px-4 py-2.5 outline-none focus:border-forest" />
    </label>
  );
}
function Picker({ title, items, selected, onToggle }: { title: string; items: Ref[]; selected: string[]; onToggle: (id: string) => void }) {
  return (
    <fieldset className="rounded-xl border border-charcoal/15 p-4">
      <legend className="px-2 text-sm font-medium">{title}</legend>
      <div className="mt-2 grid gap-2 md:grid-cols-2">
        {items.map((i) => (
          <label key={i.id} className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={selected.includes(i.id)} onChange={() => onToggle(i.id)} /> {i.name}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
