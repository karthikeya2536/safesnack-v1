import { createClient } from "@/lib/supabase/server";
import { AddressManager } from "@/components/account/AddressManager";

export default async function AddressesPage() {
  const sb = await createClient();
  const { data: { user } } = await sb.auth.getUser();
  const { data } = await sb.from("address").select("id,line1,line2,city,pincode").eq("user_id", user!.id);

  return (
    <section>
      <h2 className="text-3xl font-bold">Addresses</h2>
      <div className="mt-6">
        <AddressManager userId={user!.id} initial={data ?? []} />
      </div>
    </section>
  );
}
