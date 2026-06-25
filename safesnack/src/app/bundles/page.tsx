import { getBundles } from "@/lib/queries";
import { inr } from "@/lib/format";

export const metadata = { title: "Healthy Bundles — SafeSnack" };

export default async function BundlesPage() {
  const bundles = await getBundles();
  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="font-serif text-4xl text-forest">Healthy Bundles</h1>
      <p className="mt-2 text-charcoal/60">Curated packs for every goal — save more, snack better.</p>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {bundles.map((b) => (
          <div key={b.id} className="rounded-2xl border border-charcoal/10 p-6">
            <div className="flex aspect-video items-center justify-center rounded-xl bg-clay/10 font-serif text-forest">
              {b.name}
            </div>
            <h2 className="mt-4 font-serif text-xl">{b.name}</h2>
            <p className="mt-1 text-sm text-charcoal/70">{b.description}</p>
            <p className="mt-3 font-serif text-lg text-forest">{inr(b.price)}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
