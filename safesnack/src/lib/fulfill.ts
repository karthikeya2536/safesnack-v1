import { adminClient } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/email";

// Idempotent: marks order PAID, decrements stock FEFO, awards points, notifies.
// Safe to call from both the client-confirm route and the Razorpay webhook.
export async function fulfillOrder(orderId: string, paymentId?: string) {
  const db = adminClient();
  const { data: order } = await db.from("order").select("*").eq("id", orderId).single();
  if (!order || order.status !== "PENDING_PAYMENT") return; // already handled or missing

  await db.from("order").update({
    status: "PAID", payment_status: "paid", payment_id: paymentId ?? order.payment_id,
  }).eq("id", orderId);

  // FEFO stock allocation
  const { data: items } = await db.from("order_item").select("variant_id,qty").eq("order_id", orderId);
  for (const it of items ?? []) {
    let remaining = it.qty as number;
    const { data: batches } = await db
      .from("batch").select("id,quantity").eq("variant_id", it.variant_id).gt("quantity", 0)
      .order("expiry_date", { ascending: true });
    for (const b of batches ?? []) {
      if (remaining <= 0) break;
      const take = Math.min(remaining, b.quantity as number);
      await db.from("batch").update({ quantity: (b.quantity as number) - take }).eq("id", b.id);
      await db.from("inventory_movement").insert({ variant_id: it.variant_id, batch_id: b.id, type: "SALE", qty: take, ref: orderId });
      remaining -= take;
    }
  }

  // Loyalty ledger: spend redeemed points, then earn 1 point per ₹10 of total.
  const redeemed = Number(order.points_redeemed) || 0;
  const earn = Math.floor(Number(order.total) / 10);
  {
    const { data: last } = await db
      .from("reward_point_ledger").select("balance").eq("user_id", order.user_id)
      .order("created_at", { ascending: false }).limit(1).maybeSingle();
    let balance = last?.balance ?? 0;
    if (redeemed > 0) {
      balance -= redeemed;
      await db.from("reward_point_ledger").insert({ user_id: order.user_id, delta: -redeemed, reason: "REDEEM", order_id: orderId, balance });
    }
    if (earn > 0) {
      balance += earn;
      await db.from("reward_point_ledger").insert({ user_id: order.user_id, delta: earn, reason: "ORDER", order_id: orderId, balance });
      await db.from("order").update({ points_earned: earn }).eq("id", orderId);
    }
  }

  // Referral reward: grant the referrer points when this referee completes their FIRST order.
  const { count } = await db.from("order").select("*", { count: "exact", head: true })
    .eq("user_id", order.user_id).neq("status", "PENDING_PAYMENT");
  if (count === 1) {
    const { data: ref } = await db.from("referral")
      .select("id,referrer_id").eq("referee_id", order.user_id).eq("reward_granted", false).maybeSingle();
    if (ref) {
      const REWARD = 100;
      const { data: rlast } = await db.from("reward_point_ledger").select("balance")
        .eq("user_id", ref.referrer_id).order("created_at", { ascending: false }).limit(1).maybeSingle();
      await db.from("reward_point_ledger").insert({
        user_id: ref.referrer_id, delta: REWARD, reason: "REFERRAL", balance: (rlast?.balance ?? 0) + REWARD,
      });
      await db.from("referral").update({ reward_granted: true, status: "REWARDED" }).eq("id", ref.id);
    }
  }

  await db.from("analytics_event").insert({ type: "PURCHASE", user_id: order.user_id, value: Number(order.total) });

  await db.from("notification").insert({
    user_id: order.user_id, type: "ORDER", title: "Order confirmed",
    body: `Your order is confirmed. Total ₹${order.total}.`,
  });

  const { data: u } = await db.auth.admin.getUserById(order.user_id);
  if (u?.user?.email) {
    await sendEmail(
      u.user.email,
      "Your SafeSnack order is confirmed",
      `<p>Thanks for your order! Total <strong>₹${order.total}</strong>. We'll let you know as it ships.</p>`,
    );
  }
}
