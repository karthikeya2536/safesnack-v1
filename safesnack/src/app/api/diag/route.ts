import { NextRequest, NextResponse } from "next/server";
import { publicClient } from "@/lib/supabase/public";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const sb = publicClient();
  
  // Test basic connection
  const { data: products, error: productsError } = await sb
    .from("product")
    .select("id, name, is_active")
    .limit(5);

  // Test category connection
  const { data: categories, error: categoriesError } = await sb
    .from("category")
    .select("name, slug");

  return NextResponse.json({
    env: {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL ? "DEFINED" : "UNDEFINED",
      url_val: process.env.NEXT_PUBLIC_SUPABASE_URL || null,
      anon_key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "DEFINED" : "UNDEFINED",
      anon_key_start: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 15) : null,
    },
    products: {
      count: products?.length ?? 0,
      data: products,
      error: productsError,
    },
    categories: {
      count: categories?.length ?? 0,
      data: categories,
      error: categoriesError,
    }
  });
}
