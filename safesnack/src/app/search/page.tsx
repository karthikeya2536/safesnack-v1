import Link from "next/link";
import { searchProducts } from "@/lib/queries";
import { ProductCard } from "@/components/ui/ProductCard";
import { EmptyState } from "@/components/ui/EmptyState";

export const metadata = { title: "Search | SafeSnack" };
const SUGGESTIONS = ["high protein", "low sugar", "diabetic", "keto", "kids snacks"];

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const results = q ? await searchProducts(q) : [];

  return (
    <main className="ep-page">
      <div>
        <p className="ep-kicker">Search SafeSnack</p>
        <h1 className="ep-title mt-4">What are you craving?</h1>
        <form action="/search" className="mt-10 flex max-w-3xl flex-col gap-3 sm:flex-row">
          <label className="sr-only" htmlFor="site-search">Search products</label>
          <input id="site-search" name="q" defaultValue={q ?? ""} placeholder="Ingredient, goal, or product" className="min-w-0 flex-1 px-5" />
          <button className="btn-primary px-8">Search</button>
        </form>
        <div className="mt-4 flex flex-wrap gap-2">
          {SUGGESTIONS.map((item) => <Link key={item} href={`/search?q=${encodeURIComponent(item)}`} className="ep-chip hover:border-charcoal">{item}</Link>)}
        </div>

        {q && (
          <section className="mt-16">
            <p className="mb-8 text-sm font-bold text-charcoal/55">{results.length} result{results.length === 1 ? "" : "s"} for “{q}”</p>
            {results.length ? (
              <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4 md:gap-x-7">
                {results.map((product) => <ProductCard key={product.id} product={product} />)}
              </div>
            ) : (
              <EmptyState title="No products found" body="Try a dietary preference, ingredient, or broader product name." href="/products" action="Browse all products" />
            )}
          </section>
        )}
      </div>
    </main>
  );
}
