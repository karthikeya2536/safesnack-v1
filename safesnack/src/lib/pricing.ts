export const lineTotal = (price: number, qty: number) => price * qty;

export function applyCoupon(
  subtotal: number,
  coupon: { type: "PERCENT" | "FLAT"; value: number; minOrder?: number; maxDiscount?: number },
): number {
  if (coupon.minOrder && subtotal < coupon.minOrder) return 0;
  const raw = coupon.type === "PERCENT" ? (subtotal * coupon.value) / 100 : coupon.value;
  const capped = coupon.maxDiscount ? Math.min(raw, coupon.maxDiscount) : raw;
  return Math.min(capped, subtotal);
}
