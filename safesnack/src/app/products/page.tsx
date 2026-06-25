import Link from "next/link";
import { getCategories, getProducts } from "@/lib/queries";
import { ProductCard } from "@/components/ui/ProductCard";

const TAGS = ["sugar-free", "keto", "diabetic", "vegan"];

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; tag?: string }>;
}) {
  const { category, tag } = await searchParams;
  const [products, categories] = await Promise.all([getProducts({ category, tag }), getCategories()]);

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="font-serif text-4xl text-forest">All Snacks</h1>
      <div className="mt-10 grid gap-10 md:grid-cols-[200px_1fr]">
        <aside className="space-y-8 text-sm">
          <div>
            <p className="font-medium">Category</p>
            <ul className="mt-3 space-y-2">
              <li><Link href="/products" className={!category ? "text-clay" : "text-charcoal/70 hover:text-clay"}>All</Link></li>
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link href={`/products?category=${c.slug}`} className={category === c.slug ? "text-clay" : "text-charcoal/70 hover:text-clay"}>
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-medium">Dietary</p>
            <ul className="mt-3 space-y-2">
              {TAGS.map((t) => (
                <li key={t}>
                  <Link href={`/products?tag=${t}`} className={tag === t ? "text-clay" : "text-charcoal/70 hover:text-clay"}>
                    {t}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <div>
          {products.length === 0 ? (
            <p className="text-charcoal/60">No products match.</p>
          ) : (
            <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
              {products.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
