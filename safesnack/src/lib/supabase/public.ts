import { createClient } from "@supabase/supabase-js";

// Cookieless anon client for build-time / metadata routes (sitemap, etc.).
export const publicClient = () =>
  createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    auth: { persistSession: false },
  });

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://safesnack.in";
