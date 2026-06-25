import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function AdminProducts() {
  const sb = await createClient();
  const { data: products } = await sb
    .from("product")
    .select("id,name,is_active,category:category_id(name),variant(price)")
    .order("name");

  return (
    <section>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl text-forest">Products</h1>
        <Link href="/admin/products/new" className="rounded-full bg-forest px-5 py-2.5 text-sm text-bone transition hover:bg-charcoal">+ New product</Link>
      </div>
      <ul className="mt-8 divide-y divide-charcoal/10">
        {(products ?? []).map((p) => {
          const prices = (p.variant as unknown as { price: number }[]).map((v) => Number(v.price));
          const from = prices.length ? Math.min(...prices) : 0;
          return (
            <li key={p.id}>
              <Link href={`/admin/products/${p.id}`} className="flex items-center justify-between py-4 transition hover:text-clay">
                <span>
                  <span className="font-serif">{p.name}</span>
                  <span className="ml-3 text-xs text-charcoal/50">{(p.category as unknown as { name: string } | null)?.name}</span>
                </span>
                <span className="flex items-center gap-4 text-sm">
                  {!p.is_active && <span className="rounded-full bg-clay/15 px-2 py-0.5 text-xs text-clay">inactive</span>}
                  <span className="tabular-nums text-charcoal/60">₹{from}+</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
