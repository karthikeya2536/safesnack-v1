"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const supabase = createClient();
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") ?? "/account";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error: signErr } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { name } },
        });
        if (signErr) throw signErr;
        const { error: inErr } = await supabase.auth.signInWithPassword({ email, password });
        if (inErr) {
          setNotice("Account created. Check your email to confirm, then sign in.");
          return;
        }
        const ref = params.get("ref");
        if (ref) await supabase.rpc("claim_referral", { p_code: ref });
      } else {
        const { error: inErr } = await supabase.auth.signInWithPassword({ email, password });
        if (inErr) throw inErr;
      }
      router.push(next);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {mode === "signup" && (
        <Field label="Name" value={name} onChange={setName} type="text" autoComplete="name" />
      )}
      <Field label="Email" value={email} onChange={setEmail} type="email" autoComplete="email" required />
      <Field
        label="Password"
        value={password}
        onChange={setPassword}
        type="password"
        autoComplete={mode === "signup" ? "new-password" : "current-password"}
        required
      />

      {error && <p className="text-sm text-clay">{error}</p>}
      {notice && <p className="text-sm text-forest">{notice}</p>}

      <button
        disabled={loading}
        className="w-full rounded-full bg-forest px-6 py-3 text-bone transition hover:bg-charcoal disabled:opacity-60"
      >
        {loading ? "Please wait…" : mode === "signup" ? "Create account" : "Sign in"}
      </button>

      <p className="pt-2 text-center text-sm text-charcoal/60">
        {mode === "signup" ? (
          <>Already have an account? <Link href="/login" className="text-clay hover:underline">Sign in</Link></>
        ) : (
          <>New to SafeSnack? <Link href="/signup" className="text-clay hover:underline">Create account</Link></>
        )}
      </p>
    </form>
  );
}

function Field({
  label, value, onChange, type, autoComplete, required,
}: {
  label: string; value: string; onChange: (v: string) => void;
  type: string; autoComplete?: string; required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-sm text-charcoal/70">{label}</span>
      <input
        type={type}
        value={value}
        required={required}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-xl border border-charcoal/20 px-4 py-3 outline-none transition focus:border-forest"
      />
    </label>
  );
}
