import Image from "next/image";
import Link from "next/link";
import { publicClient } from "@/lib/supabase/public";
import { getOriginals } from "@/lib/queries";
import { ProductCard } from "@/components/ui/ProductCard";
import { FadeIn } from "@/components/ui/FadeIn";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const revalidate = 60;

const TRUST = ["Sugar-free choices", "Diabetic-friendly range", "Ingredient-first curation", "Hyderabad delivery"];
const DIETS = [
  { title: "Diabetic-friendly", body: "Explore products selected for people making more careful sugar choices.", href: "/products?tag=diabetic", tone: "bg-[#E9EFFB]" },
  { title: "Keto", body: "Low-carb snacks for routines that need fewer compromises.", href: "/products?tag=keto", tone: "bg-[#E7F0E9]" },
  { title: "Vegan", body: "Plant-based picks with clear ingredient information.", href: "/products?tag=vegan", tone: "bg-[#F8E7EC]" },
  { title: "Sugar-free", body: "Everyday treats without added sugar.", href: "/products?tag=sugar-free", tone: "bg-[#F2EBDD]" },
];
const INGREDIENTS = [
  ["Maltitol and maltodextrin", "Monk fruit and stevia"],
  ["Palm oil and trans fats", "Nut fats and better oils"],
  ["Refined flour", "Almond flour and millets"],
];
const FAQ = [
  ["What makes SafeSnack different?", "SafeSnack brings sugar-free, diabetic-friendly, keto, and clean-label options into one carefully organized store."],
  ["Do you deliver across Hyderabad?", "Delivery availability and timing depend on your saved pincode. Checkout shows the current service area, fee, and estimate."],
  ["Can I shop by dietary need?", "Yes. Use catalog filters for diabetic-friendly, keto, vegan, and sugar-free products."],
  ["Where can I see complete ingredients?", "Each product page includes available ingredients, benefits, serving suggestions, and dietary tags."],
];

export default async function Home() {
  const sb = publicClient();
  const [{ data: hc }, originals] = await Promise.all([
    sb.from("homepage_content").select("*").eq("id", 1).single(),
    getOriginals(),
  ]);
  const featured = originals.slice(0, 4);
  const heroTitle = hc?.hero_title || "Snacks that fit real life.";
  const heroSubtitle = hc?.hero_subtitle || "Sugar-free and diet-conscious picks, curated in Hyderabad with ingredients kept clear.";
  const heroCta = hc?.hero_cta || "Shop snacks";

  return (
    <main>
      <section className="site-shell grid min-h-[calc(100dvh-5rem)] items-center gap-8 py-10 lg:grid-cols-[.9fr_1.1fr] lg:py-16">
        <FadeIn>
          <div className="max-w-2xl">
            <p className="ep-kicker">SafeSnack Hyderabad</p>
            <h1 className="ep-title mt-5">{heroTitle}</h1>
            <p className="ep-copy mt-6 text-lg">{heroSubtitle}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/products" className="btn-primary px-7">{heroCta}</Link>
              <Link href="/bundles" className="btn-secondary px-7">Explore bundles</Link>
            </div>
          </div>
        </FadeIn>
        <FadeIn direction="scale" delay={100}>
          <div className="snack-window relative min-h-[420px] overflow-hidden rounded-[2rem] bg-[#eadde1] lg:min-h-[640px]">
            <Image
              src="/images/safesnack/hero-snack-window.png"
              alt="SafeSnack beetroot chips with snack ingredients"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 56vw"
              className="object-cover"
            />
            <div className="absolute bottom-4 right-4 max-w-[210px] rounded-2xl bg-white/90 p-4 backdrop-blur">
              <p className="text-sm font-bold">Made to be chosen clearly.</p>
              <p className="mt-1 text-xs leading-5 text-charcoal/60">Dietary tags, variants, ingredients, and pricing stay easy to scan.</p>
            </div>
          </div>
        </FadeIn>
      </section>

      <section className="border-y border-charcoal/10 bg-white">
        <div className="site-shell grid grid-cols-2 md:grid-cols-4">
          {TRUST.map((item) => (
            <p key={item} className="flex min-h-20 items-center justify-center border-charcoal/10 px-4 text-center text-xs font-bold uppercase tracking-[.1em] text-charcoal/65 md:border-r md:last:border-r-0">
              {item}
            </p>
          ))}
        </div>
      </section>

      <section className="site-shell py-24 lg:py-32">
        <FadeIn><SectionHeading kicker="SafeSnack Originals" title="Start with our own shelf." body="House-brand products get first place, with clean product details and no visual clutter." /></FadeIn>
        {featured.length > 0 ? (
          <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-7">
            {featured.map((product, index) => (
              <FadeIn key={product.id} delay={index * 45}><ProductCard product={product} /></FadeIn>
            ))}
          </div>
        ) : (
          <div className="ep-card mt-10 p-8">
            <p className="font-bold">Originals are being stocked.</p>
            <Link href="/products" className="mt-3 inline-block text-sm font-bold text-clay">Browse all products</Link>
          </div>
        )}
      </section>

      <section className="site-shell pb-24 lg:pb-32">
        <div className="grid overflow-hidden rounded-[2rem] border border-charcoal/10 bg-white lg:grid-cols-2">
          <div className="relative min-h-[440px]">
            <Image src="/images/safesnack/ingredients-flatlay.png" alt="Almonds, cocoa, millet flour, stevia and other snack ingredients" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
          </div>
          <div className="flex flex-col justify-center p-7 md:p-12 lg:p-16">
            <SectionHeading kicker="Ingredient clarity" title="What leaves matters too." body="A quick way to understand the ingredient direction behind cleaner snacking." />
            <div className="mt-8 space-y-3">
              {INGREDIENTS.map(([avoid, choose]) => (
                <div key={avoid} className="grid gap-2 rounded-2xl bg-bone p-4 sm:grid-cols-2">
                  <div><span className="text-xs font-bold text-charcoal/45">Less of</span><p className="mt-1 font-bold">{avoid}</p></div>
                  <div><span className="text-xs font-bold text-clay">Look for</span><p className="mt-1 font-bold">{choose}</p></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-charcoal py-24 text-white lg:py-32">
        <div className="site-shell">
          <SectionHeading kicker="Shop your way" title="One store. Different needs." body="Choose a dietary path without learning a new interface." />
          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {DIETS.map((diet) => (
              <Link key={diet.title} href={diet.href} className={`${diet.tone} group min-h-64 rounded-2xl p-7 text-charcoal transition-transform duration-300 hover:-translate-y-1 md:p-10`}>
                <h3 className="text-3xl font-bold">{diet.title}</h3>
                <p className="mt-4 max-w-sm leading-7 text-charcoal/65">{diet.body}</p>
                <span className="mt-10 inline-block font-bold text-clay transition-transform group-hover:translate-x-1">Browse range</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="site-shell py-24 lg:py-32">
        <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_.85fr]">
          <div className="relative min-h-[420px] overflow-hidden rounded-[2rem] lg:min-h-[620px]">
            <Image src="/images/safesnack/bundle-feature.png" alt="SafeSnack bundle selection with cookies, chocolate, nuts and beetroot chips" fill sizes="(max-width: 1024px) 100vw, 58vw" className="object-cover" />
          </div>
          <div className="lg:pl-8">
            <SectionHeading kicker="Bundles" title="A better stocked snack shelf." body="Curated combinations make it easier to try more while keeping one clear checkout." />
            <Link href="/bundles" className="btn-primary mt-8 px-7">See bundles</Link>
          </div>
        </div>
      </section>

      <section className="site-shell pb-24 lg:pb-32">
        <div className="grid gap-5 lg:grid-cols-[.8fr_1.2fr]">
          <div className="ep-card flex flex-col justify-center p-7 md:p-12">
            <SectionHeading kicker="Local roots" title="Prepared with care in Hyderabad." body="Our storefront connects thoughtful product curation with local service and a direct line to SafeSnack." />
            <a href="https://www.instagram.com/safesnack.in/" target="_blank" rel="noreferrer" className="btn-secondary mt-8 w-fit px-7">Visit Instagram</a>
          </div>
          <div className="relative min-h-[480px] overflow-hidden rounded-[2rem]">
            <Image src="/images/safesnack/brand-kitchen.png" alt="Baker preparing a fresh batch in a clean kitchen" fill sizes="(max-width: 1024px) 100vw, 60vw" className="object-cover" />
          </div>
        </div>
      </section>

      <section className="border-y border-charcoal/10 bg-white py-24">
        <div className="site-shell grid gap-12 lg:grid-cols-[.8fr_1.2fr]">
          <SectionHeading title="Questions, answered plainly." body="Useful details before you choose a snack." />
          <div className="divide-y divide-charcoal/10">
            {FAQ.map(([question, answer]) => (
              <details key={question} className="group py-5">
                <summary className="flex min-h-11 cursor-pointer items-center justify-between gap-5 text-lg font-bold">
                  {question}<span className="text-2xl font-normal text-clay transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="max-w-2xl pb-2 pr-10 leading-7 text-charcoal/60">{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="site-shell py-24 text-center lg:py-32">
        <h2 className="mx-auto max-w-3xl text-5xl font-bold leading-[.98] tracking-[-.06em] md:text-7xl">Find your next safe snack.</h2>
        <p className="mx-auto mt-6 max-w-xl text-charcoal/60">Browse by category, dietary preference, or product name.</p>
        <Link href="/products" className="btn-primary mt-8 px-8">Shop snacks</Link>
      </section>
    </main>
  );
}
