import type { MetadataRoute } from "next";
import { publicClient, SITE_URL } from "@/lib/supabase/public";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sb = publicClient();
  const { data: products } = await sb.from("product").select("slug").eq("is_active", true);

  const staticRoutes = ["", "/products", "/bundles", "/search"].map((p) => ({
    url: `${SITE_URL}${p}`,
    changeFrequency: "weekly" as const,
    priority: p === "" ? 1 : 0.8,
  }));

  const productRoutes = (products ?? []).map((p) => ({
    url: `${SITE_URL}/products/${p.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...productRoutes];
}
