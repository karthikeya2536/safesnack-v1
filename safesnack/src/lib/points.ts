import type { SupabaseClient } from "@supabase/supabase-js";

export async function getPointsBalance(sb: SupabaseClient, userId: string): Promise<number> {
  const { data } = await sb
    .from("reward_point_ledger")
    .select("balance")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  return data?.balance ?? 0;
}
