import { createClient } from "@/lib/supabase/server";
import { HomepageForm } from "@/components/admin/HomepageForm";

export default async function AdminHomepage() {
  const sb = await createClient();
  const [{ data: hc }, { data: products }, { data: bundles }] = await Promise.all([
    sb.from("homepage_content").select("*").eq("id", 1).single(),
    sb.from("product").select("id,name").order("name"),
    sb.from("bundle").select("id,name").order("name"),
  ]);

  return (
    <section>
      <h1 className="font-serif text-3xl text-forest">Homepage</h1>
      <p className="mt-1 text-sm text-charcoal/60">Edit hero copy and featured items — no code deploy needed.</p>
      <div className="mt-8">
        <HomepageForm
          products={products ?? []}
          bundles={bundles ?? []}
          initial={{
            hero_title: hc?.hero_title ?? "", hero_subtitle: hc?.hero_subtitle ?? "", hero_cta: hc?.hero_cta ?? "",
            featured_product_ids: hc?.featured_product_ids ?? [], featured_bundle_ids: hc?.featured_bundle_ids ?? [],
          }}
        />
      </div>
    </section>
  );
}
