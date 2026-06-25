import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProductForm } from "@/components/admin/ProductForm";

export default async function EditProduct({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sb = await createClient();
  const [{ data: p }, { data: brands }, { data: categories }] = await Promise.all([
    sb.from("product").select("*,variant(id,label,price,sku),product_image(id,url,type)").eq("id", id).single(),
    sb.from("brand").select("id,name").order("name"),
    sb.from("category").select("id,name").order("name"),
  ]);
  if (!p) notFound();

  return (
    <section>
      <h1 className="font-serif text-3xl text-forest">Edit · {p.name}</h1>
      <div className="mt-8">
        <ProductForm
          brands={brands ?? []}
          categories={categories ?? []}
          init={{
            id: p.id, name: p.name, slug: p.slug, description: p.description ?? "",
            brand_id: p.brand_id ?? "", category_id: p.category_id ?? "",
            dietary_tags: (p.dietary_tags ?? []).join(", "),
            benefits: p.benefits ?? "", story: p.story ?? "", featured_ingredients: p.featured_ingredients ?? "",
            serving_suggestions: p.serving_suggestions ?? "", ingredients: p.ingredients ?? "", is_active: p.is_active,
            variants: (p.variant ?? []).map((v: { id: string; label: string; price: number; sku: string | null }) => ({ id: v.id, label: v.label, price: String(v.price), sku: v.sku ?? "" })),
            images: (p.product_image ?? []).map((im: { id: string; url: string; type: string }) => ({ id: im.id, url: im.url, type: im.type })),
          }}
        />
      </div>
    </section>
  );
}
