import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { inr } from "@/lib/format";

const FLOW = ["PAID", "PROCESSING", "SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED"];

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sb = await createClient();
  const { data: { user } } = await sb.auth.getUser();

  const { data: order } = await sb
    .from("order")
    .select("id,status,subtotal,discount,delivery_fee,total,points_earned,address,created_at")
    .eq("id", id).eq("user_id", user!.id).single();
  if (!order) notFound();

  const { data: items } = await sb
    .from("order_item")
    .select("qty,unit_price,line_total,variant:variant_id(label,product:product_id(name))")
    .eq("order_id", id);

  const cancelled = order.status === "CANCELLED" || order.status === "REFUNDED";
  const currentIdx = FLOW.indexOf(order.status);
  const addr = order.address as { line1: string; line2?: string; city: string; pincode: string } | null;

  return (
    <section>
      <Link href="/account/orders" className="text-sm text-clay hover:underline">← Orders</Link>
      <h2 className="mt-3 font-serif text-2xl text-forest">Order #{order.id.slice(0, 8)}</h2>
      <p className="text-sm text-charcoal/50">{new Date(order.created_at).toLocaleString("en-IN")}</p>

      {/* Tracking */}
      {cancelled ? (
        <p className="mt-6 rounded-lg bg-clay/10 px-4 py-3 text-sm text-clay">This order is {order.status.toLowerCase()}.</p>
      ) : (
        <ol className="mt-6 flex flex-wrap gap-2">
          {FLOW.map((s, i) => (
            <li key={s} className={`rounded-full px-3 py-1 text-xs transition ${i <= currentIdx ? "bg-forest text-bone" : "bg-sage/40 text-charcoal/50"}`}>
              {s.replaceAll("_", " ")}
            </li>
          ))}
        </ol>
      )}

      {/* Items */}
      <ul className="mt-8 divide-y divide-charcoal/10">
        {(items ?? []).map((it, idx) => {
          const v = it.variant as unknown as {
            label: string;
            product: { name: string } | null;
          } | null;
          return (
            <li key={idx} className="flex justify-between py-3 text-sm">
              <span>{it.qty}× {v?.product?.name} <span className="text-charcoal/50">({v?.label})</span></span>
              <span className="tabular-nums">{inr(Number(it.line_total))}</span>
            </li>
          );
        })}
      </ul>

      {/* Totals */}
      <div className="mt-6 space-y-1 text-sm">
        <Row label="Subtotal" value={Number(order.subtotal)} />
        {Number(order.discount) > 0 && <Row label="Discount" value={-Number(order.discount)} />}
        <Row label="Delivery" value={Number(order.delivery_fee)} />
        <div className="flex justify-between border-t border-charcoal/10 pt-2 font-serif text-lg text-forest">
          <span>Total</span><span className="tabular-nums">{inr(Number(order.total))}</span>
        </div>
        {order.points_earned > 0 && <p className="pt-1 text-xs text-clay">You earned {order.points_earned} reward points.</p>}
      </div>

      {addr && (
        <p className="mt-6 text-sm text-charcoal/60">
          Delivering to: {addr.line1}{addr.line2 ? `, ${addr.line2}` : ""}, {addr.city} — {addr.pincode}
        </p>
      )}
    </section>
  );
}

function Row({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex justify-between text-charcoal/70">
      <span>{label}</span>
      <span className="tabular-nums">{inr(value)}</span>
    </div>
  );
}
