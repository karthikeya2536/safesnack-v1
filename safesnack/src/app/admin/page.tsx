import { getDashboard } from "@/lib/analytics";
import { inr } from "@/lib/format";

export default async function AdminDashboard() {
  const d = await getDashboard();
  const funnelMax = Math.max(d.funnel.view, 1);

  return (
    <section className="space-y-10">
      <div>
        <h1 className="font-serif text-3xl text-forest">Dashboard</h1>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        <Stat label="Revenue · today" value={inr(d.revenue.today)} />
        <Stat label="Revenue · 7d" value={inr(d.revenue.week)} />
        <Stat label="Revenue · 30d" value={inr(d.revenue.month)} />
        <Stat label="Paid orders" value={String(d.orders.total)} />
        <Stat label="Customers" value={String(d.customers.total)} />
        <Stat label="Returning" value={String(d.customers.returning)} />
      </div>

      {/* Funnel */}
      <div>
        <h2 className="font-serif text-xl text-forest">Conversion funnel</h2>
        <div className="mt-4 space-y-2">
          {([["Viewed", d.funnel.view], ["Added to cart", d.funnel.cart], ["Checkout", d.funnel.checkout], ["Purchased", d.funnel.purchase]] as const).map(
            ([label, n]) => (
              <div key={label} className="flex items-center gap-3 text-sm">
                <span className="w-32 text-charcoal/60">{label}</span>
                <div className="h-6 flex-1 rounded bg-sage/40">
                  <div className="h-6 rounded bg-forest transition-all" style={{ width: `${(n / funnelMax) * 100}%` }} />
                </div>
                <span className="w-10 text-right tabular-nums">{n}</span>
              </div>
            ),
          )}
        </div>
      </div>

      <div className="grid gap-10 md:grid-cols-2">
        <Panel title="Top products">
          {d.topProducts.length === 0 ? <Empty /> : d.topProducts.map((p) => (
            <Row key={p.name} a={p.name} b={`${p.qty} sold · ${inr(p.revenue)}`} />
          ))}
        </Panel>
        <Panel title="Revenue by category">
          {d.revenueByCategory.length === 0 ? <Empty /> : d.revenueByCategory.map((c) => (
            <Row key={c.category} a={c.category} b={inr(c.revenue)} />
          ))}
        </Panel>
      </div>

      <Panel title="Top searches">
        {d.topSearches.length === 0 ? <Empty /> : d.topSearches.map((s) => <Row key={s.query} a={s.query} b={`${s.count}×`} />)}
      </Panel>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-charcoal/10 p-5">
      <p className="text-xs uppercase tracking-wider text-charcoal/50">{label}</p>
      <p className="mt-2 font-serif text-2xl text-forest tabular-nums">{value}</p>
    </div>
  );
}
function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-serif text-xl text-forest">{title}</h2>
      <div className="mt-4 divide-y divide-charcoal/10">{children}</div>
    </div>
  );
}
function Row({ a, b }: { a: string; b: string }) {
  return <div className="flex justify-between py-2 text-sm"><span className="text-charcoal/70">{a}</span><span className="tabular-nums">{b}</span></div>;
}
function Empty() {
  return <p className="py-2 text-sm text-charcoal/40">No data yet.</p>;
}
