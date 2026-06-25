import { createClient } from "@/lib/supabase/server";
import { applyCoupon } from "@/lib/pricing";

export type CartInput = { variantId: string; qty: number }[];

export type PricedItem = {
  variantId: string; qty: number; unitPrice: number; lineTotal: number; name: string; label: string;
};

export type PricedCart = {
  items: PricedItem[];
  subtotal: number; discount: number; deliveryFee: number; total: number; pointsRedeemed: number;
  couponId: string | null; zoneId: string | null; minOrder: number; zoneFound: boolean;
};

// Authoritative server-side pricing. Client prices are never trusted.
// redeemPoints is the points the user wants to spend (1 point = ₹1), already clamped to their balance by the caller.
export async function priceCart(cart: CartInput, couponCode?: string, pincode?: string, redeemPoints = 0): Promise<PricedCart> {
  const sb = await createClient();
  const ids = cart.map((c) => c.variantId);
  const { data: variants } = await sb
    .from("variant")
    .select("id,price,label,product:product_id(name)")
    .in("id", ids);
  const vmap = new Map((variants ?? []).map((v) => [v.id, v]));

  let subtotal = 0;
  const items: PricedItem[] = [];
  for (const c of cart) {
    const v = vmap.get(c.variantId);
    if (!v) continue;
    const lineTotal = Number(v.price) * c.qty;
    subtotal += lineTotal;
    items.push({
      variantId: c.variantId, qty: c.qty, unitPrice: Number(v.price), lineTotal,
      name: (v.product as unknown as { name: string } | null)?.name ?? "Item", label: v.label,
    });
  }

  let discount = 0;
  let couponId: string | null = null;
  if (couponCode) {
    const { data: cp } = await sb.from("coupon").select("*").eq("code", couponCode).eq("active", true).maybeSingle();
    if (cp) {
      discount = applyCoupon(subtotal, {
        type: cp.type, value: Number(cp.value), minOrder: Number(cp.min_order), maxDiscount: cp.max_discount ? Number(cp.max_discount) : undefined,
      });
      if (discount > 0) couponId = cp.id;
    }
  }

  let deliveryFee = 0;
  let zoneId: string | null = null;
  let minOrder = 0;
  let zoneFound = false;
  if (pincode) {
    const { data: z } = await sb.from("delivery_zone").select("*").eq("pincode", pincode).maybeSingle();
    if (z) {
      deliveryFee = Number(z.delivery_fee);
      minOrder = Number(z.min_order);
      zoneId = z.id;
      zoneFound = true;
    }
  }

  const afterCoupon = Math.max(0, subtotal - discount);
  const pointsRedeemed = Math.max(0, Math.min(Math.floor(redeemPoints), afterCoupon));
  const total = Math.max(0, afterCoupon - pointsRedeemed) + deliveryFee;
  return { items, subtotal, discount, deliveryFee, total, pointsRedeemed, couponId, zoneId, minOrder, zoneFound };
}
