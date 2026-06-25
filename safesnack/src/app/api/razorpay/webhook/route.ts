import { NextResponse } from "next/server";
import { verifyWebhook } from "@/lib/razorpay";
import { adminClient } from "@/lib/supabase/admin";
import { fulfillOrder } from "@/lib/fulfill";

// Razorpay -> our server. Source-of-truth confirmation, independent of the browser.
export async function POST(req: Request) {
  const raw = await req.text();
  const signature = req.headers.get("x-razorpay-signature") ?? "";
  if (!verifyWebhook(raw, signature)) return NextResponse.json({ error: "bad signature" }, { status: 400 });

  const event = JSON.parse(raw);
  if (event.event === "payment.captured" || event.event === "order.paid") {
    const rzpOrderId = event.payload?.payment?.entity?.order_id;
    const paymentId = event.payload?.payment?.entity?.id;
    if (rzpOrderId) {
      const db = adminClient();
      const { data: order } = await db.from("order").select("id").eq("razorpay_order_id", rzpOrderId).maybeSingle();
      if (order) await fulfillOrder(order.id, paymentId);
    }
  }
  return NextResponse.json({ ok: true });
}
