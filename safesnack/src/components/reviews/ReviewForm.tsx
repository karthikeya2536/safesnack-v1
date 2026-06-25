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

  if (done) return <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">Thanks for your review.</p>;

  return (
    <form onSubmit={submit} className="max-w-md space-y-3">
      <div className="flex items-center gap-1" role="radiogroup" aria-label="Rating">
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} type="button" onClick={() => setRating(n)} aria-label={`${n} stars`}
            className={`text-2xl transition ${n <= rating ? "text-clay" : "text-charcoal/25"}`}>★</button>
        ))}
      </div>
      <label className="block"><span className="text-sm font-bold">Title</span>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Optional" className="mt-2 w-full px-4" />
      </label>
      <label className="block"><span className="text-sm font-bold">Review</span>
        <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={4} placeholder="Share your thoughts" className="mt-2 w-full px-4 py-3" />
      </label>
      {error && <p className="text-sm text-red-700" role="alert">{error}</p>}
      <button disabled={saving} className="btn-primary px-6 disabled:opacity-60">
        {saving ? "Submitting..." : "Submit review"}
      </button>
    </form>
  );
}
