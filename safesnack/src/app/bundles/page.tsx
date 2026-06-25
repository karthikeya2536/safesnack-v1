import Image from "next/image";
import { getBundles } from "@/lib/queries";
import { inr } from "@/lib/format";
import { EmptyState } from "@/components/ui/EmptyState";

export const metadata = { title: "Healthy Bundles | SafeSnack" };
export const revalidate = 60;

export default async function BundlesPage() {
  const bundles = await getBundles();
  return (
    <main className="ep-page">
      <div>
        <p className="ep-kicker">Curated combinations</p>
        <h1 className="ep-title mt-4">A fuller shelf, one simple choice.</h1>
        <p className="ep-copy mt-5">Explore grouped picks built for discovery, gifting, and better-value restocking.</p>
        <div className="relative mt-12 min-h-[380px] overflow-hidden rounded-[2rem] md:min-h-[560px]">
          <Image src="/images/safesnack/bundle-feature.png" alt="SafeSnack bundle range with cookies, chocolate, nuts and beetroot chips" fill priority sizes="100vw" className="object-cover" />
        </div>

        {bundles.length === 0 ? (
          <div className="mt-10"><EmptyState title="Bundles are being prepared" body="Browse individual products while the next bundle range is assembled." href="/products" action="Shop products" /></div>
        ) : (
          <div className="mt-14 grid gap-4 md:grid-cols-2">
            {bundles.map((bundle, index) => (
              <article key={bundle.id} className={`ep-card min-h-64 p-7 md:p-10 ${index % 3 === 0 ? "md:col-span-2" : ""}`}>
                <p className="text-sm font-bold text-clay">Bundle</p>
                <h2 className="mt-3 max-w-xl text-3xl font-bold">{bundle.name}</h2>
                <p className="mt-4 max-w-xl leading-7 text-charcoal/60">{bundle.description}</p>
                <p className="mt-8 text-2xl font-extrabold tabular-nums">{inr(bundle.price)}</p>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
