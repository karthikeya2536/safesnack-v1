"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function WishlistButton({ productId }: { productId: string }) {
  const sb = createClient();
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [ready, setReady] = useState(false);
  const [uid, setUid] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await sb.auth.getUser();
      setUid(user?.id ?? null);
      if (user) {
        const { data } = await sb.from("wishlist_item").select("id").eq("user_id", user.id).eq("product_id", productId).maybeSingle();
        setSaved(!!data);
      }
      setReady(true);
    })();
  }, [sb, productId]);

  async function toggle() {
    if (!uid) { router.push("/login?next=/products"); return; }
    if (saved) {
      await sb.from("wishlist_item").delete().eq("user_id", uid).eq("product_id", productId);
      setSaved(false);
    } else {
      await sb.from("wishlist_item").insert({ user_id: uid, product_id: productId });
      setSaved(true);
    }
  }

  return (
    <button onClick={toggle} disabled={!ready} aria-pressed={saved}
      className="btn-secondary mt-3 w-full gap-2 px-5 text-sm disabled:opacity-50">
      <span className={saved ? "text-clay" : "text-charcoal/40"}>{saved ? "♥" : "♡"}</span>
      {saved ? "Saved to wishlist" : "Save to wishlist"}
    </button>
  );
}
