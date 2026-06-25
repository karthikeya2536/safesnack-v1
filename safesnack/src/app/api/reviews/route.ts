import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { adminClient } from "@/lib/supabase/admin";

const schema = z.object({
  productId: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  title: z.string().trim().max(120).optional(),
  body: z.string().trim().max(2000).optional(),
});

export async function POST(req: Request) {
  const sb = await createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in to review." }, { status: 401 });

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid review." }, { status: 400 });
  const { productId, rating, title, body } = parsed.data;

  // Server-determined verified-purchase flag (client can't fake it).
  const [{ data: orders }, { data: variants }] = await Promise.all([
    sb.from("order").select("id").eq("user_id", user.id).neq("status", "PENDING_PAYMENT"),
    sb.from("variant").select("id").eq("product_id", productId),
  ]);
  let verified = false;
  const orderIds = (orders ?? []).map((o) => o.id);
  const variantIds = (variants ?? []).map((v) => v.id);
  if (orderIds.length && variantIds.length) {
    const { data: hit } = await sb.from("order_item").select("id").in("order_id", orderIds).in("variant_id", variantIds).limit(1);
    verified = !!hit?.length;
  }

  const { error } = await sb.from("review").insert({
    product_id: productId, user_id: user.id, rating, title: title || null, body: body || null, verified_purchase: verified,
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Recompute cached average rating (product writes are admin-only).
  const db = adminClient();
  const { data: all } = await db.from("review").select("rating").eq("product_id", productId);
  const avg = all && all.length ? all.reduce((s, r) => s + r.rating, 0) / all.length : 0;
  await db.from("product").update({ rating: Math.round(avg * 10) / 10 }).eq("id", productId);

  return NextResponse.json({ ok: true, verified });
}
