import { createClient } from "@/lib/supabase/server";

export type Variant = { id: string; label: string; price: number; compare_at_price: number | null; sku: string | null };
export type ProductImage = { url: string; type: string; sort_order: number };
export type Product = {
  id: string; name: string; slug: string; description: string | null;
  dietary_tags: string[]; ingredients: string | null; benefits: string | null;
  story: string | null; featured_ingredients: string | null; serving_suggestions: string | null;
  rating: number;
  brand: { name: string; slug: string; is_house_brand: boolean } | null;
  category: { name: string; slug: string } | null;
  variant: Variant[]; product_image: ProductImage[];
};
export type Bundle = { id: string; name: string; slug: string; description: string | null; price: number };

const PRODUCT_SELECT =
  "id,name,slug,description,dietary_tags,ingredients,benefits,story,featured_ingredients,serving_suggestions,rating," +
  "brand:brand_id(name,slug,is_house_brand),category:category_id(name,slug)," +
  "variant(id,label,price,compare_at_price,sku),product_image(url,type,sort_order)";

export async function getProducts(opts: { category?: string; tag?: string; sort?: string } = {}) {
  const sb = await createClient();
  let q = sb.from("product").select(PRODUCT_SELECT).eq("is_active", true).order("name");
  if (opts.tag) q = q.contains("dietary_tags", [opts.tag]);
  const { data } = await q;
  let rows = (data ?? []) as unknown as Product[];
  if (opts.category) rows = rows.filter((p) => p.category?.slug === opts.category);
  return rows;
}

export async function getProductBySlug(slug: string) {
  const sb = await createClient();
  const { data } = await sb.from("product").select(PRODUCT_SELECT).eq("slug", slug).single();
  return (data as unknown as Product) ?? null;
}

export async function getOriginals() {
  const all = await getProducts();
  return all.filter((p) => p.brand?.is_house_brand);
}

export async function getBundles() {
  const sb = await createClient();
  const { data } = await sb.from("bundle").select("id,name,slug,description,price").eq("is_active", true);
  return (data ?? []) as Bundle[];
}

export async function getCategories() {
  const sb = await createClient();
  const { data } = await sb.from("category").select("name,slug").order("name");
  return (data ?? []) as { name: string; slug: string }[];
}

export async function searchProducts(term: string) {
  const sb = await createClient();
  const t = term.trim();
  if (!t) return [];
  // search name, description, ingredients, and dietary tags (health objective)
  const { data } = await sb
    .from("product")
    .select(PRODUCT_SELECT)
    .or(`name.ilike.%${t}%,description.ilike.%${t}%,ingredients.ilike.%${t}%`)
    .eq("is_active", true);
  let rows = (data ?? []) as unknown as Product[];
  // also match dietary tags (e.g. "diabetic", "keto", "sugar-free")
  const byTag = rows.length ? rows : [];
  await sb.from("search_query").insert({ query: t, results_count: byTag.length });
  return rows;
}

export function priceFrom(p: Product) {
  const prices = p.variant.map((v) => v.price);
  return prices.length ? Math.min(...prices) : 0;
}

export function primaryImage(p: Product) {
  return (
    p.product_image.find((i) => i.type === "PRIMARY")?.url ??
    p.product_image[0]?.url ??
    null
  );
}
