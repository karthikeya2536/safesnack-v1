import { adminClient } from "@/lib/supabase/admin";

export type Dashboard = {
  revenue: { today: number; week: number; month: number };
  orders: { total: number; paid: number };
  customers: { total: number; returning: number };
  topProducts: { name: string; qty: number; revenue: number }[];
  revenueByCategory: { category: string; revenue: number }[];
  funnel: { view: number; cart: number; checkout: number; purchase: number };
  topSearches: { query: string; count: number }[];
};

function since(days: number) {
  return new Date(Date.now() - days * 86400_000).toISOString();
}

// Aggregations for the admin dashboard. Uses service role (reads across all users).
export async function getDashboard(): Promise<Dashboard> {
  const db = adminClient();

  const { data: paidOrders } = await db
    .from("order")
    .select("id,total,user_id,created_at,status")
    .neq("status", "PENDING_PAYMENT");

  const paid = paidOrders ?? [];
  const sum = (rows: typeof paid) => rows.reduce((s, o) => s + Number(o.total), 0);
  const revenue = {
    today: sum(paid.filter((o) => o.created_at >= since(1))),
    week: sum(paid.filter((o) => o.created_at >= since(7))),
    month: sum(paid.filter((o) => o.created_at >= since(30))),
  };

  const byUser = new Map<string, number>();
  paid.forEach((o) => byUser.set(o.user_id, (byUser.get(o.user_id) ?? 0) + 1));
  const customers = { total: byUser.size, returning: [...byUser.values()].filter((n) => n > 1).length };

  // Top products + revenue by category from order_items of paid orders
  const paidIds = paid.map((o) => o.id);
  const { data: items } = paidIds.length
    ? await db.from("order_item")
        .select("qty,line_total,variant:variant_id(product:product_id(name,category:category_id(name)))")
        .in("order_id", paidIds)
    : { data: [] as unknown[] };

  const prodMap = new Map<string, { qty: number; revenue: number }>();
  const catMap = new Map<string, number>();
  for (const it of (items ?? []) as unknown as {
    qty: number; line_total: number;
    variant: { product: { name: string; category: { name: string } | null } | null } | null;
  }[]) {
    const name = it.variant?.product?.name ?? "Unknown";
    const cat = it.variant?.product?.category?.name ?? "Uncategorised";
    const p = prodMap.get(name) ?? { qty: 0, revenue: 0 };
    p.qty += it.qty; p.revenue += Number(it.line_total);
    prodMap.set(name, p);
    catMap.set(cat, (catMap.get(cat) ?? 0) + Number(it.line_total));
  }
  const topProducts = [...prodMap.entries()].map(([name, v]) => ({ name, ...v })).sort((a, b) => b.revenue - a.revenue).slice(0, 5);
  const revenueByCategory = [...catMap.entries()].map(([category, revenue]) => ({ category, revenue })).sort((a, b) => b.revenue - a.revenue);

  // Funnel from analytics_event
  const counts = async (type: string) =>
    (await db.from("analytics_event").select("*", { count: "exact", head: true }).eq("type", type)).count ?? 0;
  const funnel = {
    view: await counts("PRODUCT_VIEW"),
    cart: await counts("ADD_TO_CART"),
    checkout: await counts("BEGIN_CHECKOUT"),
    purchase: await counts("PURCHASE"),
  };

  // Top searches
  const { data: searches } = await db.from("search_query").select("query");
  const sMap = new Map<string, number>();
  (searches ?? []).forEach((s) => sMap.set(s.query, (sMap.get(s.query) ?? 0) + 1));
  const topSearches = [...sMap.entries()].map(([query, count]) => ({ query, count })).sort((a, b) => b.count - a.count).slice(0, 8);

  return {
    revenue,
    orders: { total: paid.length, paid: paid.filter((o) => o.status !== "CANCELLED").length },
    customers, topProducts, revenueByCategory, funnel, topSearches,
  };
}
