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
  return { title: `${p.name} | SafeSnack`, description: p.description ?? undefined };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const tracker = await createClient();
  
  // Trigger analytics view insertion asynchronously (non-blocking)
  (async () => {
    try {
      await tracker.from("analytics_event").insert({ type: "PRODUCT_VIEW", product_id: product.id });
    } catch {}
  })();

  // Fetch user, reviews, and related products in parallel
  const [userRes, reviewsRes, relatedProducts] = await Promise.all([
    tracker.auth.getUser(),
    tracker.from("review")
      .select("rating,title,body,verified_purchase,created_at,profile:user_id(name)")
      .eq("product_id", product.id)
      .order("created_at", { ascending: false }),
    getProducts({ category: product.category?.slug }).then(all => all.filter((p) => p.id !== product.id).slice(0, 4))
  ]);

  const user = userRes.data?.user;
  const reviews = reviewsRes.data;
  const reviewList = reviews ?? [];
  const avg = reviewList.length ? reviewList.reduce((s, r) => s + r.rating, 0) / reviewList.length : 0;

  const gallery = product.product_image.length ? product.product_image : [];
  const related = relatedProducts;

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
    <main className="ep-page">
      <div>
      <div className="grid gap-12 lg:grid-cols-[1.1fr_.9fr]">
        {/* Gallery */}
        <div>
          <div className="aspect-square overflow-hidden rounded-[2rem] border border-charcoal/10 bg-white">
            {gallery[0] ? (
              <ClientImage
                src={gallery[0].url}
                alt={product.name}
                className="h-full w-full object-cover"
                fallback={<div className="flex h-full items-center justify-center p-8 text-center text-2xl font-bold text-charcoal/50">{product.name}</div>}
              />
            ) : (
              <div className="flex h-full items-center justify-center p-8 text-center text-2xl font-bold text-charcoal/50">{product.name}</div>
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
        <div className="h-fit lg:sticky lg:top-28">
          {product.brand?.is_house_brand && (
            <span className="ep-kicker">SafeSnack original</span>
          )}
          <h1 className="mt-3 text-4xl font-bold leading-[1.02] tracking-[-.055em] md:text-6xl">{product.name}</h1>
          <p className="mt-5 max-w-xl leading-7 text-charcoal/60">{product.description}</p>
          {product.dietary_tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {product.dietary_tags.map((t) => (
                <span key={t} className="ep-chip">{t}</span>
              ))}
            </div>
          )}
          <VariantPicker productName={product.name} variants={product.variant} />
          <div><WishlistButton productId={product.id} /></div>

          <div className="mt-10 space-y-3">
            <Story title="Benefits" body={product.benefits} />
            <Story title="Our Story" body={product.story} />
            <Story title="Featured Ingredients" body={product.featured_ingredients} />
            <Story title="Serving Suggestions" body={product.serving_suggestions} />
            <Story title="Ingredients" body={product.ingredients} />
          </div>
        </div>
      </div>

      {/* Reviews */}
      <section className="mt-24 border-t border-charcoal/10 pt-16">
        <div className="flex items-baseline gap-4">
          <h2 className="text-3xl font-bold">Reviews</h2>
          {reviewList.length > 0 && (
            <span className="text-sm text-charcoal/60">
              <span className="text-clay">★</span> {avg.toFixed(1)} · {reviewList.length} review{reviewList.length > 1 ? "s" : ""}
            </span>
          )}
        </div>

        <div className="mt-8 grid gap-12 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            {reviewList.length === 0 && <p className="text-sm text-charcoal/50">No reviews yet. Be the first.</p>}
            {reviewList.map((r, i) => (
              <figure key={i} className="ep-card p-5">
                <figcaption className="flex items-center gap-2 text-sm">
                  <span className="text-clay">{"★".repeat(r.rating)}<span className="text-charcoal/20">{"★".repeat(5 - r.rating)}</span></span>
                  <span className="font-medium">{(r.profile as unknown as { name: string | null } | null)?.name ?? "Customer"}</span>
                  {r.verified_purchase && <span className="ep-chip">Verified purchase</span>}
                </figcaption>
                {r.title && <p className="mt-3 text-lg font-bold">{r.title}</p>}
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
          <h2 className="text-3xl font-bold">Frequently bought together</h2>
          <div className="mt-6 grid grid-cols-2 gap-6 md:grid-cols-4">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <p className="sr-only">{inr(priceFrom(product))}</p>
      <Link href="/products" className="mt-12 inline-flex min-h-11 items-center text-sm font-bold text-clay">← Back to shop</Link>
      </div>
    </main>
  );
}

function Story({ title, body }: { title: string; body: string | null }) {
  if (!body) return null;
  return (
    <div className="rounded-2xl border border-charcoal/10 bg-white p-5">
      <h3 className="font-bold">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-charcoal/60">{body}</p>
    </div>
  );
}
