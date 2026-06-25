import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { priceCart } from "@/lib/checkout";
import { getPointsBalance } from "@/lib/points";
import { createRazorpayOrder } from "@/lib/razorpay";

const schema = z.object({
  cart: z.array(z.object({ variantId: z.string().uuid(), qty: z.number().int().positive() })).min(1),
  couponCode: z.string().trim().optional(),
  pincode: z.string().trim(),
  redeemPoints: z.number().int().min(0).optional(),
  address: z.object({ line1: z.string(), line2: z.string().optional(), city: z.string(), pincode: z.string() }),
});

export async function POST(req: Request) {
  const sb = await createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return NextResponse.json({ error: "Please sign in to check out." }, { status: 401 });

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid checkout details." }, { status: 400 });
  const { cart, couponCode, pincode, address, redeemPoints } = parsed.data;

  const balance = await getPointsBalance(sb, user.id);
  const clampedPoints = Math.min(redeemPoints ?? 0, balance);
  const p = await priceCart(cart, couponCode, pincode, clampedPoints);
  if (p.items.length === 0) return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
  if (!p.zoneFound) return NextResponse.json({ error: "We don't deliver to that pincode yet." }, { status: 400 });
  if (p.subtotal < p.minOrder)
    return NextResponse.json({ error: `Minimum order for this area is ₹${p.minOrder}.` }, { status: 400 });

  let razorpayOrderId: string;
  try {
    const rzp = await createRazorpayOrder(Math.round(p.total * 100), crypto.randomUUID());
    razorpayOrderId = rzp.id;
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Payment setup failed." }, { status: 502 });
  }

  const { data: order, error } = await sb
    .from("order")
    .insert({
      user_id: user.id, status: "PENDING_PAYMENT",
      subtotal: p.subtotal, discount: p.discount, delivery_fee: p.deliveryFee, total: p.total,
      coupon_id: p.couponId, delivery_zone_id: p.zoneId, address, razorpay_order_id: razorpayOrderId,
      points_redeemed: p.pointsRedeemed,
    })
    .select("id")
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await sb.from("order_item").insert(
    p.items.map((i) => ({ order_id: order.id, variant_id: i.variantId, qty: i.qty, unit_price: i.unitPrice, line_total: i.lineTotal })),
  );

  return NextResponse.json({
    orderId: order.id,
    razorpayOrderId,
    amount: Math.round(p.total * 100),
    keyId: process.env.RAZORPAY_KEY_ID,
    breakdown: { subtotal: p.subtotal, discount: p.discount, deliveryFee: p.deliveryFee, total: p.total },
  });
}
