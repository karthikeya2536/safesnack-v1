import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getProductBySlug, getProducts, priceFrom } from "@/lib/queries";
import { createClient } from "@/lib/supabase/server";
import { VariantPicker } from "@/components/ui/VariantPicker";
import { ProductCard } from "@/components/ui/ProductCard";
import { WishlistButton } from "@/components/wishlist/WishlistButton";
import { ReviewForm } from "@/components/reviews/ReviewForm";
import { ClientImage } from "@/components/ui/ClientImage";
import { inr } from "@/lib/format";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProductBySlug(slug);
  if (!p) return { title: "Not found" };
  return { title: `${p.name} — SafeSnack`, description: p.description ?? undefined };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const tracker = await createClient();
  await tracker.from("analytics_event").insert({ type: "PRODUCT_VIEW", product_id: product.id });

  const { data: { user } } = await tracker.auth.getUser();
  const { data: reviews } = await tracker
    .from("review")
    .select("rating,title,body,verified_purchase,created_at,profile:user_id(name)")
    .eq("product_id", product.id)
    .order("created_at", { ascending: false });
  const reviewList = reviews ?? [];
  const avg = reviewList.length ? reviewList.reduce((s, r) => s + r.rating, 0) / reviewList.length : 0;

  const gallery = product.product_image.length ? product.product_image : [];
  const related = (await getProducts({ category: product.category?.slug })).filter((p) => p.id !== product.id).slice(0, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    brand: product.brand?.name,
    offers: { "@type": "Offer", price: priceFrom(product), priceCurrency: "INR" },
    aggregateRating: product.rating ? { "@type": "AggregateRating", ratingValue: product.rating, reviewCount: 1 } : undefined,
  };

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <div className="grid gap-12 md:grid-cols-2">
        {/* Gallery */}
        <div>
          <div className="aspect-square overflow-hidden rounded-3xl bg-sage/50">
            {gallery[0] ? (
              <ClientImage
                src={gallery[0].url}
                alt={product.name}
                className="h-full w-full object-cover"
                fallback={<div className="flex h-full items-center justify-center font-serif text-2xl text-forest/60">{product.name}</div>}
              />
            ) : (
              <div className="flex h-full items-center justify-center font-serif text-2xl text-forest/60">{product.name}</div>
            )}
          </div>
          {gallery.length > 1 && (
            <div className="mt-4 grid grid-cols-4 gap-3">
              {gallery.slice(1, 5).map((g, i) => (
                <ClientImage
                  key={i}
                  src={g.url}
                  alt=""
                  className="aspect-square rounded-xl object-cover"
                  fallback={<div className="aspect-square rounded-xl bg-sage/50" />}
                />
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          {product.brand?.is_house_brand && (
            <span className="text-xs uppercase tracking-widest text-clay">SafeSnack Originals</span>
          )}
          <h1 className="mt-2 font-serif text-4xl text-forest">{product.name}</h1>
          <p className="mt-2 text-charcoal/70">{product.description}</p>
          {product.dietary_tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {product.dietary_tags.map((t) => (
                <span key={t} className="rounded-full bg-sage px-3 py-1 text-xs text-forest">{t}</span>
              ))}
            </div>
          )}
          <VariantPicker productName={product.name} variants={product.variant} />
          <div><WishlistButton productId={product.id} /></div>

          <div className="mt-10 space-y-6 text-sm">
            <Story title="Benefits" body={product.benefits} />
            <Story title="Our Story" body={product.story} />
            <Story title="Featured Ingredients" body={product.featured_ingredients} />
            <Story title="Serving Suggestions" body={product.serving_suggestions} />
            <Story title="Ingredients" body={product.ingredients} />
          </div>
        </div>
      </div>

      {/* Reviews */}
      <section className="mt-20 border-t border-charcoal/10 pt-12">
        <div className="flex items-baseline gap-4">
          <h2 className="font-serif text-2xl text-forest">Reviews</h2>
          {reviewList.length > 0 && (
            <span className="text-sm text-charcoal/60">
              <span className="text-clay">★</span> {avg.toFixed(1)} · {reviewList.length} review{reviewList.length > 1 ? "s" : ""}
            </span>
          )}
        </div>

        <div className="mt-6 grid gap-12 md:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            {reviewList.length === 0 && <p className="text-sm text-charcoal/50">No reviews yet. Be the first.</p>}
            {reviewList.map((r, i) => (
              <figure key={i} className="border-b border-charcoal/10 pb-5">
                <figcaption className="flex items-center gap-2 text-sm">
                  <span className="text-clay">{"★".repeat(r.rating)}<span className="text-charcoal/20">{"★".repeat(5 - r.rating)}</span></span>
                  <span className="font-medium">{(r.profile as unknown as { name: string | null } | null)?.name ?? "Customer"}</span>
                  {r.verified_purchase && <span className="rounded-full bg-sage px-2 py-0.5 text-[11px] text-forest">Verified purchase</span>}
                </figcaption>
                {r.title && <p className="mt-2 font-serif text-lg">{r.title}</p>}
                {r.body && <p className="mt-1 text-sm text-charcoal/70">{r.body}</p>}
              </figure>
            ))}
          </div>

          <div>
            {user ? (
              <>
                <h3 className="font-serif text-lg text-forest">Write a review</h3>
                <div className="mt-3"><ReviewForm productId={product.id} /></div>
              </>
            ) : (
              <p className="text-sm text-charcoal/60">
                <Link href={`/login?next=/products/${product.slug}`} className="text-clay hover:underline">Sign in</Link> to write a review.
              </p>
            )}
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="font-serif text-2xl text-forest">Frequently bought together</h2>
          <div className="mt-6 grid grid-cols-2 gap-6 md:grid-cols-4">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <p className="sr-only">{inr(priceFrom(product))}</p>
      <Link href="/products" className="mt-12 inline-block text-sm text-clay hover:underline">← Back to shop</Link>
    </main>
  );
}

function Story({ title, body }: { title: string; body: string | null }) {
  if (!body) return null;
  return (
    <div>
      <h3 className="font-medium text-forest">{title}</h3>
      <p className="mt-1 text-charcoal/70">{body}</p>
    </div>
  );
}
