import { createClient } from "@supabase/supabase-js";

// Service-role client — bypasses RLS. Server-only. Never import into client code.
export const adminClient = () =>
  createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
