"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Ref = { id: string; name: string };
type VariantRow = { id?: string; label: string; price: string; sku: string };
type ImageRow = { id?: string; url: string; type: string };

const IMG_TYPES = ["PRIMARY", "HOVER", "GALLERY", "LIFESTYLE", "NUTRITION_LABEL", "INGREDIENT"];

export type ProductInit = {
  id?: string; name: string; slug: string; description: string;
  brand_id: string; category_id: string; dietary_tags: string;
  benefits: string; story: string; featured_ingredients: string; serving_suggestions: string; ingredients: string;
  is_active: boolean; variants: VariantRow[]; images: ImageRow[];
};

export function ProductForm({ init, brands, categories }: { init: ProductInit; brands: Ref[]; categories: Ref[] }) {
  const sb = createClient();
  const router = useRouter();
  const [f, setF] = useState(init);
  const [variants, setVariants] = useState<VariantRow[]>(init.variants);
  const [images, setImages] = useState<ImageRow[]>(init.images);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const set = (k: keyof ProductInit, v: unknown) => setF({ ...f, [k]: v });

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = {
        name: f.name, slug: f.slug, description: f.description,
        brand_id: f.brand_id || null, category_id: f.category_id || null,
        dietary_tags: f.dietary_tags.split(",").map((t) => t.trim()).filter(Boolean),
        benefits: f.benefits, story: f.story, featured_ingredients: f.featured_ingredients,
        serving_suggestions: f.serving_suggestions, ingredients: f.ingredients, is_active: f.is_active,
      };
      let productId = f.id;
      if (productId) {
        const { error: e1 } = await sb.from("product").update(payload).eq("id", productId);
        if (e1) throw e1;
      } else {
        const { data, error: e1 } = await sb.from("product").insert(payload).select("id").single();
        if (e1) throw e1;
        productId = data.id;
      }
      for (const v of variants) {
        if (!v.label || !v.price) continue;
        const row = { product_id: productId, label: v.label, price: Number(v.price), sku: v.sku || null };
        if (v.id) await sb.from("variant").update(row).eq("id", v.id);
        else await sb.from("variant").insert(row);
      }
      for (const im of images) {
        if (im.id || !im.url) continue;
        await sb.from("product_image").insert({ product_id: productId, url: im.url, type: im.type });
      }
      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={save} className="max-w-2xl space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <T label="Name" v={f.name} set={(v) => set("name", v)} req />
        <T label="Slug" v={f.slug} set={(v) => set("slug", v)} req />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Sel label="Brand" v={f.brand_id} set={(v) => set("brand_id", v)} opts={brands} />
        <Sel label="Category" v={f.category_id} set={(v) => set("category_id", v)} opts={categories} />
      </div>
      <T label="Dietary tags (comma separated)" v={f.dietary_tags} set={(v) => set("dietary_tags", v)} />
      <TA label="Description" v={f.description} set={(v) => set("description", v)} />
      <TA label="Benefits" v={f.benefits} set={(v) => set("benefits", v)} />
      <TA label="Story" v={f.story} set={(v) => set("story", v)} />
      <T label="Featured ingredients" v={f.featured_ingredients} set={(v) => set("featured_ingredients", v)} />
      <TA label="Serving suggestions" v={f.serving_suggestions} set={(v) => set("serving_suggestions", v)} />
      <T label="Ingredients" v={f.ingredients} set={(v) => set("ingredients", v)} />
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={f.is_active} onChange={(e) => set("is_active", e.target.checked)} /> Active
      </label>

      {/* Variants */}
      <fieldset className="rounded-xl border border-charcoal/15 p-4">
        <legend className="px-2 text-sm font-medium">Variants</legend>
        {variants.map((v, i) => (
          <div key={i} className="mt-2 grid grid-cols-[1fr_100px_120px_auto] gap-2">
            <input placeholder="Label (100g)" value={v.label} onChange={(e) => setVariants(variants.map((x, j) => j === i ? { ...x, label: e.target.value } : x))} className="rounded-lg border border-charcoal/20 px-3 py-2 text-sm" />
            <input placeholder="Price" value={v.price} onChange={(e) => setVariants(variants.map((x, j) => j === i ? { ...x, price: e.target.value } : x))} className="rounded-lg border border-charcoal/20 px-3 py-2 text-sm tabular-nums" />
            <input placeholder="SKU" value={v.sku} onChange={(e) => setVariants(variants.map((x, j) => j === i ? { ...x, sku: e.target.value } : x))} className="rounded-lg border border-charcoal/20 px-3 py-2 text-sm" />
            {!v.id && <button type="button" onClick={() => setVariants(variants.filter((_, j) => j !== i))} className="text-clay">✕</button>}
          </div>
        ))}
        <button type="button" onClick={() => setVariants([...variants, { label: "", price: "", sku: "" }])} className="mt-3 text-sm text-clay hover:underline">+ Add variant</button>
      </fieldset>

      {/* Images */}
      <fieldset className="rounded-xl border border-charcoal/15 p-4">
        <legend className="px-2 text-sm font-medium">Images</legend>
        {images.map((im, i) => (
          <div key={i} className="mt-2 grid grid-cols-[1fr_160px_auto] gap-2">
            <input placeholder="https://image-url" value={im.url} disabled={!!im.id} onChange={(e) => setImages(images.map((x, j) => j === i ? { ...x, url: e.target.value } : x))} className="rounded-lg border border-charcoal/20 px-3 py-2 text-sm disabled:opacity-60" />
            <select value={im.type} disabled={!!im.id} onChange={(e) => setImages(images.map((x, j) => j === i ? { ...x, type: e.target.value } : x))} className="rounded-lg border border-charcoal/20 px-3 py-2 text-sm">
              {IMG_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            {!im.id && <button type="button" onClick={() => setImages(images.filter((_, j) => j !== i))} className="text-clay">✕</button>}
          </div>
        ))}
        <button type="button" onClick={() => setImages([...images, { url: "", type: "PRIMARY" }])} className="mt-3 text-sm text-clay hover:underline">+ Add image URL</button>
      </fieldset>

      {error && <p className="text-sm text-clay">{error}</p>}
      <button disabled={saving} className="rounded-full bg-forest px-8 py-3 text-bone transition hover:bg-charcoal disabled:opacity-60">
        {saving ? "Saving…" : "Save product"}
      </button>
    </form>
  );
}

function T({ label, v, set, req }: { label: string; v: string; set: (v: string) => void; req?: boolean }) {
  return (
    <label className="block">
      <span className="text-sm text-charcoal/70">{label}</span>
      <input value={v} required={req} onChange={(e) => set(e.target.value)} className="mt-1 w-full rounded-xl border border-charcoal/20 px-4 py-2.5 outline-none focus:border-forest" />
    </label>
  );
}
function TA({ label, v, set }: { label: string; v: string; set: (v: string) => void }) {
  return (
    <label className="block">
      <span className="text-sm text-charcoal/70">{label}</span>
      <textarea value={v} rows={2} onChange={(e) => set(e.target.value)} className="mt-1 w-full rounded-xl border border-charcoal/20 px-4 py-2.5 outline-none focus:border-forest" />
    </label>
  );
}
function Sel({ label, v, set, opts }: { label: string; v: string; set: (v: string) => void; opts: Ref[] }) {
  return (
    <label className="block">
      <span className="text-sm text-charcoal/70">{label}</span>
      <select value={v} onChange={(e) => set(e.target.value)} className="mt-1 w-full rounded-xl border border-charcoal/20 px-4 py-2.5 outline-none focus:border-forest">
        <option value="">—</option>
        {opts.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
      </select>
    </label>
  );
}
