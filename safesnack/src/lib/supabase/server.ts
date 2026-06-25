
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const store = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => store.getAll(),
        setAll: (
          toSet: Awaited<ReturnType<typeof store.getAll>>,
        ) =>
          toSet.forEach(({ name, value }) => store.set(name, value)),
      },
    },
  );
}
