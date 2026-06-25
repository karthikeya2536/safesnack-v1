import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { inr } from "@/lib/format";
import { RemoveWishlist } from "@/components/wishlist/RemoveButton";

export default async function WishlistPage() {
  const sb = await createClient();
  const { data: { user } } = await sb.auth.getUser();
  const { data } = await sb
    .from("wishlist_item")
    .select("product:product_id(id,name,slug,variant(price),product_image(url,type))")
    .eq("user_id", user!.id);

  const items = (data ?? [])
    .map((w) => w.product as unknown as { id: string; name: string; slug: string; variant: { price: number }[]; product_image: { url: string; type: string }[] } | null)
    .filter(Boolean) as { id: string; name: string; slug: string; variant: { price: number }[]; product_image: { url: string; type: string }[] }[];

  return (
    <section>
      <h2 className="font-serif text-2xl text-forest">Wishlist</h2>
      {items.length === 0 ? (
        <p className="mt-3 text-sm text-charcoal/60">Nothing saved yet. <Link href="/products" className="text-clay hover:underline">Browse snacks</Link>.</p>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-6 md:grid-cols-3">
          {items.map((p) => {
            const from = p.variant.length ? Math.min(...p.variant.map((v) => Number(v.price))) : 0;
            const img = p.product_image.find((i) => i.type === "PRIMARY")?.url ?? p.product_image[0]?.url ?? null;
            return (
              <div key={p.id}>
                <Link href={`/products/${p.slug}`} className="group block">
                  <div className="aspect-square overflow-hidden rounded-2xl bg-sage/50">
                    {img ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={img} alt={p.name} className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]" />
                    ) : (
                      <div className="flex h-full items-center justify-center p-4 text-center font-serif text-forest/70">{p.name}</div>
                    )}
                  </div>
                  <h3 className="mt-2 font-serif">{p.name}</h3>
                </Link>
                <div className="mt-1 flex items-center justify-between text-sm">
                  <span className="text-charcoal/60">from {inr(from)}</span>
                  <RemoveWishlist productId={p.id} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
