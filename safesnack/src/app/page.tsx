import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getOriginals, getProducts, getBundles } from "@/lib/queries";
import { ProductCard } from "@/components/ui/ProductCard";
import { FadeIn } from "@/components/ui/FadeIn";
import { inr } from "@/lib/format";

const GOALS = [
  { label: "Weight Loss", tag: "keto" },
  { label: "Diabetic-Friendly", tag: "diabetic" },
  { label: "Keto", tag: "keto" },
  { label: "Sugar-Free", tag: "sugar-free" },
  { label: "Vegan", tag: "vegan" },
];

const TRUST = ["100% Sugar-Free", "Nutritionist-Approved", "Diabetic-Friendly", "Fast Hyderabad Delivery"];

const FAQ = [
  { q: "Are these really sugar-free?", a: "Yes — sweetened only with stevia and monk fruit, no added sugar or artificial sweeteners." },
  { q: "Do you deliver in my area?", a: "We currently serve select Hyderabad pincodes with same-day delivery." },
  { q: "Are they diabetic-friendly?", a: "Our Originals are low-glycaemic and nutritionist-approved, but consult your doctor for your plan." },
];

export default async function Home() {
  const sb = await createClient();
  const { data: hc } = await sb.from("homepage_content").select("*").eq("id", 1).single();
  const [originals, all, bundles] = await Promise.all([getOriginals(), getProducts(), getBundles()]);
  const bestSellers = all.slice(0, 4);

  return (
    <main>
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 py-24 text-center">
        <p className="text-sm uppercase tracking-widest text-clay">SafeSnack</p>
        <h1 className="mx-auto mt-4 max-w-3xl font-serif text-5xl leading-tight text-forest md:text-6xl">
          {hc?.hero_title ?? "Guilt-Free Snacks, Delivered Fast"}
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-charcoal/70">
          {hc?.hero_subtitle ?? "Sugar-free treats your body will thank you for."}
        </p>
        <Link href="/products" className="mt-10 inline-block rounded-full bg-forest px-8 py-3 text-bone transition hover:bg-charcoal">
          {hc?.hero_cta ?? "Shop Originals"}
        </Link>
      </section>

      {/* Trust Bar */}
      <section className="border-y border-charcoal/10 bg-sage/30">
        <div className="mx-auto flex max-w-6xl flex-wrap justify-center gap-x-10 gap-y-3 px-6 py-5 text-sm text-forest">
          {TRUST.map((t) => <span key={t}>✓ {t}</span>)}
        </div>
      </section>

      {/* Shop By Goal */}
      <Section title="Shop By Goal">
        <div className="flex flex-wrap gap-3">
          {GOALS.map((g) => (
            <Link key={g.label} href={`/products?tag=${g.tag}`} className="rounded-full border border-charcoal/15 px-5 py-2 text-sm transition hover:border-forest hover:text-forest">
              {g.label}
            </Link>
          ))}
        </div>
      </Section>

      {/* SafeSnack Originals */}
      <Section title="SafeSnack Originals" subtitle="Our own range — crafted, not curated.">
        <Grid>{originals.map((p) => <ProductCard key={p.id} product={p} />)}</Grid>
      </Section>

      {/* Why SafeSnack */}
      <Section title="Why SafeSnack">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            ["No hidden sugar", "Only stevia & monk fruit. Never artificial sweeteners."],
            ["Nutritionist-approved", "Every Original is reviewed for real nutrition."],
            ["Delivered fresh", "Fast Hyderabad delivery, batch-tracked for freshness."],
          ].map(([h, b]) => (
            <div key={h} className="rounded-2xl border border-charcoal/10 p-6">
              <h3 className="font-serif text-xl text-forest">{h}</h3>
              <p className="mt-2 text-sm text-charcoal/70">{b}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Best Sellers */}
      <Section title="Best Sellers">
        <Grid>{bestSellers.map((p) => <ProductCard key={p.id} product={p} />)}</Grid>
      </Section>

      {/* Healthy Lifestyle */}
      <section className="bg-sage/30">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-20 md:grid-cols-2">
          <div>
            <h2 className="font-serif text-3xl text-forest">Snacking, without the guilt</h2>
            <p className="mt-4 text-charcoal/70">
              Real ingredients, honest labels, and treats that fit your goals — whether that&apos;s managing blood sugar or just eating better.
            </p>
          </div>
          <div className="aspect-[4/3] rounded-2xl bg-forest/10" />
        </div>
      </section>

      {/* Bundles */}
      <Section title="Healthy Bundles" subtitle="Curated packs that save more.">
        <Grid>
          {bundles.map((b) => (
            <Link key={b.id} href="/bundles" className="group block">
              <div className="flex aspect-square items-center justify-center rounded-2xl bg-clay/10 p-6 text-center font-serif text-forest transition group-hover:bg-clay/20">
                {b.name}
              </div>
              <p className="mt-3 text-sm text-charcoal/60">{inr(b.price)}</p>
            </Link>
          ))}
        </Grid>
      </Section>

      {/* Reviews */}
      <Section title="Loved by 50,000+ families">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            ["Finally snacks I can trust for my diabetic dad.", "Priya, Hyderabad"],
            ["The dark chocolate is unreal for sugar-free.", "Arjun, Madhapur"],
            ["Kids love them and I love the labels.", "Sneha, Gachibowli"],
          ].map(([q, a]) => (
            <figure key={a} className="rounded-2xl border border-charcoal/10 p-6">
              <blockquote className="text-charcoal/80">“{q}”</blockquote>
              <figcaption className="mt-3 text-sm text-charcoal/50">{a}</figcaption>
            </figure>
          ))}
        </div>
      </Section>

      {/* FAQ */}
      <Section title="Questions, answered">
        <div className="mx-auto max-w-2xl divide-y divide-charcoal/10">
          {FAQ.map((f) => (
            <details key={f.q} className="py-4">
              <summary className="cursor-pointer font-medium">{f.q}</summary>
              <p className="mt-2 text-sm text-charcoal/70">{f.a}</p>
            </details>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 py-20 text-center">
        <h2 className="font-serif text-4xl text-forest">Eat better, starting today.</h2>
        <Link href="/products" className="mt-8 inline-block rounded-full bg-forest px-8 py-3 text-bone transition hover:bg-charcoal">
          Shop all snacks
        </Link>
      </section>

      <FaqJsonLd faq={FAQ} />
    </main>
  );
}

function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <FadeIn>
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="font-serif text-3xl text-forest">{title}</h2>
        {subtitle && <p className="mt-2 text-charcoal/60">{subtitle}</p>}
        <div className="mt-8">{children}</div>
      </section>
    </FadeIn>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-2 gap-6 md:grid-cols-4">{children}</div>;
}

function FaqJsonLd({ faq }: { faq: { q: string; a: string }[] }) {
  const json = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }} />;
}
