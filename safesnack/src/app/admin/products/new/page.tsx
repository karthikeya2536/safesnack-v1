import { createClient } from "@/lib/supabase/server";
import { ProductForm } from "@/components/admin/ProductForm";

export default async function NewProduct() {
  const sb = await createClient();
  const [{ data: brands }, { data: categories }] = await Promise.all([
    sb.from("brand").select("id,name").order("name"),
    sb.from("category").select("id,name").order("name"),
  ]);

  return (
    <section>
      <h1 className="font-serif text-3xl text-forest">New product</h1>
      <div className="mt-8">
        <ProductForm
          brands={brands ?? []}
          categories={categories ?? []}
          init={{
            name: "", slug: "", description: "", brand_id: "", category_id: "", dietary_tags: "",
            benefits: "", story: "", featured_ingredients: "", serving_suggestions: "", ingredients: "",
            is_active: true, variants: [{ label: "", price: "", sku: "" }], images: [],
          }}
        />
      </div>
    </section>
  );
}
