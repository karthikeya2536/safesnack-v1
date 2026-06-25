import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const TYPES = ["PRODUCT_VIEW", "ADD_TO_CART", "BEGIN_CHECKOUT", "PURCHASE", "SEARCH"];

export async function POST(req: Request) {
  const { type, productId } = await req.json().catch(() => ({}));
  if (!TYPES.includes(type)) return NextResponse.json({ error: "bad type" }, { status: 400 });
  const sb = await createClient();
  const { data: { user } } = await sb.auth.getUser();
  await sb.from("analytics_event").insert({ type, product_id: productId ?? null, user_id: user?.id ?? null });
  return NextResponse.json({ ok: true });
}
