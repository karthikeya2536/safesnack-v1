import { createClient } from "@/lib/supabase/server";
import { InventoryManager } from "@/components/staff/InventoryManager";

export default async function StaffInventory() {
  const sb = await createClient();
  const [{ data: vars }, { data: moves }] = await Promise.all([
    sb.from("variant").select("id,label,product:product_id(name),batch(id,batch_number,mfg_date,expiry_date,quantity)").order("label"),
    sb.from("inventory_movement").select("type,qty,created_at,variant:variant_id(label,product:product_id(name))").order("created_at", { ascending: false }).limit(20),
  ]);

  const variants = (vars ?? []).map((v) => ({
    id: v.id, label: v.label,
    product_name: (v.product as unknown as { name: string } | null)?.name ?? "—",
    batches: (v.batch as unknown as { id: string; batch_number: string | null; mfg_date: string | null; expiry_date: string | null; quantity: number }[]) ?? [],
  }));

  return (
    <section>
      <h1 className="font-serif text-3xl text-forest">Inventory</h1>
      <p className="mt-1 text-sm text-charcoal/60">Add stock batches with expiry, or edit a batch quantity to adjust. Sales deduct oldest-expiry first (FEFO).</p>

      <div className="mt-8"><InventoryManager initial={variants} /></div>

      <h2 className="mt-12 font-serif text-xl text-forest">Recent movements</h2>
      <ul className="mt-4 divide-y divide-charcoal/10 text-sm">
        {(moves ?? []).map((m, i) => {
          const v = m.variant as unknown as { label: string; product: { name: string } | null } | null;
          return (
            <li key={i} className="flex items-center justify-between py-2">
              <span>{v?.product?.name} <span className="text-charcoal/50">({v?.label})</span></span>
              <span className="flex items-center gap-3">
                <span className={`rounded-full px-2 py-0.5 text-xs ${m.type === "SALE" || m.type === "EXPIRED" ? "bg-clay/15 text-clay" : "bg-sage text-forest"}`}>{m.type}</span>
                <span className="tabular-nums">{Number(m.qty) > 0 ? `+${m.qty}` : m.qty}</span>
                <span className="text-xs text-charcoal/40">{new Date(m.created_at).toLocaleDateString("en-IN")}</span>
              </span>
            </li>
          );
        })}
        {(!moves || moves.length === 0) && <li className="py-2 text-charcoal/40">No movements yet.</li>}
      </ul>
    </section>
  );
}
