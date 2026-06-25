import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { inr } from "@/lib/format";

export default async function OrdersPage() {
  const sb = await createClient();
  const { data: { user } } = await sb.auth.getUser();
  const { data: orders } = await sb
    .from("order")
    .select("id,status,total,created_at")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  return (
    <section>
      <h2 className="text-3xl font-bold">Orders</h2>
      {!orders || orders.length === 0 ? (
        <p className="mt-3 text-sm text-charcoal/60">No orders yet. <Link href="/products" className="text-clay hover:underline">Start shopping</Link>.</p>
      ) : (
        <ul className="mt-6 space-y-3">
          {orders.map((o) => (
            <li key={o.id}>
              <Link href={`/account/orders/${o.id}`} className="flex min-h-16 flex-col justify-between gap-3 rounded-2xl border border-charcoal/10 bg-bone p-4 transition hover:border-clay sm:flex-row sm:items-center">
                <span>
                  <span className="font-mono text-xs text-charcoal/50">#{o.id.slice(0, 8)}</span>
                  <span className="ml-3 text-sm">{new Date(o.created_at).toLocaleDateString("en-IN")}</span>
                </span>
                <span className="flex items-center gap-4 text-sm">
                  <span className="rounded-full bg-sage px-3 py-1 text-xs text-forest">{o.status.replaceAll("_", " ")}</span>
                  <span className="tabular-nums">{inr(Number(o.total))}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
