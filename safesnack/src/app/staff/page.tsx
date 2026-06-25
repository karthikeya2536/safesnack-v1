import { createClient } from "@/lib/supabase/server";
import { OrderQueue } from "@/components/staff/OrderQueue";

export default async function StaffQueue() {
  const sb = await createClient();
  const { data } = await sb
    .from("order")
    .select("id,status,total,created_at,profile:user_id(name)")
    .in("status", ["PAID", "PROCESSING", "SHIPPED", "OUT_FOR_DELIVERY"])
    .order("created_at", { ascending: true });

  const orders = (data ?? []).map((o) => ({
    id: o.id, status: o.status, total: Number(o.total), created_at: o.created_at,
    customer: (o.profile as unknown as { name: string | null } | null)?.name ?? null,
  }));

  return (
    <section>
      <h1 className="font-serif text-3xl text-forest">Order queue</h1>
      <p className="mt-1 text-sm text-charcoal/60">Oldest first. Advance each order as you fulfil it.</p>
      <div className="mt-8"><OrderQueue initial={orders} /></div>
    </section>
  );
}
