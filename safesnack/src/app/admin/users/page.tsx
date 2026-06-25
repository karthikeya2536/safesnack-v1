import { createClient } from "@/lib/supabase/server";
import { UserManager } from "@/components/admin/UserManager";

export default async function AdminUsers() {
  const sb = await createClient();
  const { data } = await sb.from("profile").select("id,name,role,referral_code").order("created_at", { ascending: false });
  return (
    <section>
      <h1 className="font-serif text-3xl text-forest">Users</h1>
      <p className="mt-1 text-sm text-charcoal/60">Promote customers to staff or admin.</p>
      <div className="mt-8"><UserManager initial={data ?? []} /></div>
    </section>
  );
}
