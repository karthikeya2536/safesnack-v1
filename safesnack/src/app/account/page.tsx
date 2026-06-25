import { createClient } from "@/lib/supabase/server";
import { ProfileForm } from "@/components/account/ProfileForm";

export default async function ProfilePage() {
  const sb = await createClient();
  const { data: { user } } = await sb.auth.getUser();
  const { data: profile } = await sb.from("profile").select("name,phone").eq("id", user!.id).single();

  return (
    <section>
      <h2 className="font-serif text-2xl text-forest">Profile</h2>
      <p className="mt-1 text-sm text-charcoal/60">{user!.email}</p>
      <div className="mt-6">
        <ProfileForm id={user!.id} name={profile?.name ?? ""} phone={profile?.phone ?? ""} />
      </div>
    </section>
  );
}
