import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { verifyPaymentSignature } from "@/lib/razorpay";
import { fulfillOrder } from "@/lib/fulfill";

const schema = z.object({
  orderId: z.string().uuid(),
  razorpay_order_id: z.string(),
  razorpay_payment_id: z.string(),
  razorpay_signature: z.string(),
});

export async function POST(req: Request) {
  const sb = await createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = parsed.data;

  // Ownership check (RLS lets owner read their order).
  const { data: order } = await sb.from("order").select("id,razorpay_order_id").eq("id", orderId).single();
  if (!order || order.razorpay_order_id !== razorpay_order_id)
    return NextResponse.json({ error: "Order mismatch" }, { status: 400 });

  if (!verifyPaymentSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature))
    return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });

  await fulfillOrder(orderId, razorpay_payment_id);
  return NextResponse.json({ ok: true, orderId });
}
