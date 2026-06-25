"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function RemoveWishlist({ productId }: { productId: string }) {
  const router = useRouter();
  return (
    <button
      onClick={async () => {
        const sb = createClient();
        const { data: { user } } = await sb.auth.getUser();
        if (user) await sb.from("wishlist_item").delete().eq("user_id", user.id).eq("product_id", productId);
        router.refresh();
      }}
      className="text-xs text-clay hover:underline"
    >
      Remove
    </button>
  );
}
