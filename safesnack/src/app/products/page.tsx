import Link from "next/link";
import { getCategories, getProducts } from "@/lib/queries";
import { ProductCard } from "@/components/ui/ProductCard";
import { EmptyState } from "@/components/ui/EmptyState";

const TAGS = ["sugar-free", "keto", "diabetic", "vegan"];

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ category?: string; tag?: string }> }) {
  const { category, tag } = await searchParams;
  const [products, categories] = await Promise.all([getProducts({ category, tag }), getCategories()]);
  const active = category || tag;

  const linkClass = (selected: boolean) =>
    `flex min-h-11 items-center rounded-full px-4 text-sm font-bold transition ${
      selected ? "bg-charcoal text-white" : "border border-charcoal/10 bg-white text-charcoal/65 hover:border-charcoal hover:text-charcoal"
    }`;

  return (
    <main className="ep-page">
      <div>
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="ep-kicker">SafeSnack shelf</p>
            <h1 className="ep-title mt-4">Find your kind of snack.</h1>
            <p className="ep-copy mt-5">Browse by category or dietary preference. Product details stay clear at every step.</p>
          </div>
          <p className="text-sm font-bold text-charcoal/55">{products.length} products</p>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[240px_1fr]">
          <aside className="h-fit space-y-7 lg:sticky lg:top-28">
            <div>
              <p className="mb-3 text-sm font-bold">Category</p>
              <div className="flex flex-wrap gap-2 lg:grid">
                <Link href={`/products${tag ? `?tag=${tag}` : ""}`} className={linkClass(!category)}>All categories</Link>
                {categories.map((item) => (
                  <Link key={item.slug} href={`/products?category=${item.slug}${tag ? `&tag=${tag}` : ""}`} className={linkClass(category === item.slug)}>
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-3 text-sm font-bold">Dietary preference</p>
              <div className="flex flex-wrap gap-2 lg:grid">
                <Link href={`/products${category ? `?category=${category}` : ""}`} className={linkClass(!tag)}>All dietary</Link>
                {TAGS.map((item) => (
                  <Link key={item} href={`/products?tag=${item}${category ? `&category=${category}` : ""}`} className={linkClass(tag === item)}>
                    {item}
                  </Link>
                ))}
              </div>
            </div>
            {active && <Link href="/products" className="inline-flex min-h-11 items-center text-sm font-bold text-clay">Clear filters</Link>}
          </aside>

          {products.length === 0 ? (
            <EmptyState title="No matching snacks" body="Clear one or more filters to see the complete SafeSnack range." href="/products" action="Reset filters" />
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-7 xl:grid-cols-4">
              {products.map((product) => <ProductCard key={product.id} product={product} />)}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
