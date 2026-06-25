import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getPointsBalance } from "@/lib/points";
import { CheckoutClient } from "@/components/checkout/CheckoutClient";

export const metadata = { title: "Checkout — SafeSnack" };

export default async function CheckoutPage() {
  const sb = await createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) redirect("/login?next=/checkout");

  const [{ data: addresses }, { data: zones }, pointsBalance] = await Promise.all([
    sb.from("address").select("id,line1,line2,city,pincode").eq("user_id", user.id),
    sb.from("delivery_zone").select("pincode,area,delivery_fee,min_order,eta_minutes"),
    getPointsBalance(sb, user.id),
  ]);

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-serif text-4xl text-forest">Checkout</h1>
      <CheckoutClient addresses={addresses ?? []} zones={zones ?? []} pointsBalance={pointsBalance} />
    </main>
  );
}
