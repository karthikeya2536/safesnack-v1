import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type Role = "CUSTOMER" | "STAFF" | "ADMIN";

// Server guard for portal pages. Redirects if the user lacks an allowed role.
export async function requireRole(allowed: Role[]) {
  const sb = await createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile } = await sb.from("profile").select("role").eq("id", user.id).single();
  const role = (profile?.role ?? "CUSTOMER") as Role;
  if (!allowed.includes(role)) redirect("/");
  return { user, role };
}
