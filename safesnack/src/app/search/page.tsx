import Link from "next/link";
import { searchProducts } from "@/lib/queries";
import { ProductCard } from "@/components/ui/ProductCard";

export const metadata = { title: "Search — SafeSnack" };

const SUGGESTIONS = ["high protein", "low sugar", "diabetic", "keto", "kids snacks"];

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const results = q ? await searchProducts(q) : [];

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="font-serif text-4xl text-forest">Search</h1>
      <form action="/search" className="mt-8 flex max-w-xl gap-3">
        <input
          name="q"
          defaultValue={q ?? ""}
          placeholder="Try ingredient, goal, or product…"
          className="flex-1 rounded-full border border-charcoal/20 px-5 py-3 outline-none focus:border-forest"
        />
        <button className="rounded-full bg-forest px-6 py-3 text-bone transition hover:bg-charcoal">Go</button>
      </form>

      <div className="mt-4 flex flex-wrap gap-2 text-sm">
        {SUGGESTIONS.map((s) => (
          <Link key={s} href={`/search?q=${encodeURIComponent(s)}`} className="rounded-full border border-charcoal/15 px-4 py-1.5 text-charcoal/70 transition hover:border-forest hover:text-forest">
            {s}
          </Link>
        ))}
      </div>

      {q && (
        <div className="mt-10">
          <p className="text-sm text-charcoal/60">{results.length} result(s) for “{q}”</p>
          <div className="mt-6 grid grid-cols-2 gap-6 md:grid-cols-4">
            {results.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}
    </main>
  );
}
