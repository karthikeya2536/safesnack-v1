import { createClient } from "@/lib/supabase/server";
import { CouponManager } from "@/components/admin/CouponManager";

export default async function AdminCoupons() {
  const sb = await createClient();
  const { data } = await sb.from("coupon").select("id,code,type,value,min_order,active").order("code");
  return (
    <section>
      <h1 className="font-serif text-3xl text-forest">Coupons</h1>
      <div className="mt-8"><CouponManager initial={data ?? []} /></div>
    </section>
  );
}
