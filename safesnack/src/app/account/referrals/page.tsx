import { createClient } from "@/lib/supabase/server";
import { getPointsBalance } from "@/lib/points";

export default async function ReferralsPage() {
  const sb = await createClient();
  const { data: { user } } = await sb.auth.getUser();
  const { data: profile } = await sb.from("profile").select("referral_code").eq("id", user!.id).single();
  const { count } = await sb.from("referral").select("*", { count: "exact", head: true }).eq("referrer_id", user!.id);
  const balance = await getPointsBalance(sb, user!.id);

  return (
    <section>
      <h2 className="font-serif text-2xl text-forest">Refer &amp; Earn</h2>
      <p className="mt-2 text-sm text-charcoal/60">Share your code. Friends get a welcome treat — you earn 100 points when their first order ships.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-charcoal/10 bg-sage/30 px-6 py-5">
          <span className="text-xs uppercase tracking-widest text-charcoal/50">Your code</span>
          <p className="mt-2 font-serif text-2xl text-forest">{profile?.referral_code}</p>
        </div>
        <div className="rounded-2xl border border-charcoal/10 px-6 py-5">
          <span className="text-xs uppercase tracking-widest text-charcoal/50">Points balance</span>
          <p className="mt-2 font-serif text-2xl text-forest tabular-nums">{balance}</p>
          <p className="mt-1 text-xs text-charcoal/40">1 point = ₹1 at checkout</p>
        </div>
      </div>

      <p className="mt-4 text-sm text-charcoal/60">{count ?? 0} friend(s) joined with your code.</p>
      <p className="mt-2 text-xs text-charcoal/40">Friends sign up via <span className="font-mono">/signup?ref={profile?.referral_code}</span></p>
    </section>
  );
}
