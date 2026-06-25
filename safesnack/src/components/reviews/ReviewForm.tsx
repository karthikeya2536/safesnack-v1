"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function ReviewForm({ productId }: { productId: string }) {
  const router = useRouter();
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, rating, title, body }),
    });
    setSaving(false);
    if (!res.ok) { setError((await res.json()).error ?? "Could not submit."); return; }
    setDone(true);
    router.refresh();
  }

  if (done) return <p className="text-sm text-forest">Thanks for your review!</p>;

  return (
    <form onSubmit={submit} className="max-w-md space-y-3">
      <div className="flex items-center gap-1" role="radiogroup" aria-label="Rating">
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} type="button" onClick={() => setRating(n)} aria-label={`${n} stars`}
            className={`text-2xl transition ${n <= rating ? "text-clay" : "text-charcoal/25"}`}>★</button>
        ))}
      </div>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title (optional)"
        className="w-full rounded-xl border border-charcoal/20 px-4 py-2.5 outline-none focus:border-forest" />
      <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={3} placeholder="Share your thoughts…"
        className="w-full rounded-xl border border-charcoal/20 px-4 py-2.5 outline-none focus:border-forest" />
      {error && <p className="text-sm text-clay">{error}</p>}
      <button disabled={saving} className="rounded-full bg-forest px-6 py-2.5 text-bone transition hover:bg-charcoal disabled:opacity-60">
        {saving ? "Submitting…" : "Submit review"}
      </button>
    </form>
  );
}
