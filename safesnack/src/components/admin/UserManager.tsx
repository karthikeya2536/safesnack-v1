"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type U = { id: string; name: string | null; role: string; referral_code: string | null };
const ROLES = ["CUSTOMER", "STAFF", "ADMIN"];

export function UserManager({ initial }: { initial: U[] }) {
  const sb = createClient();
  const [list, setList] = useState(initial);
  const [error, setError] = useState<string | null>(null);

  async function setRole(id: string, role: string) {
    setError(null);
    const prev = list;
    setList(list.map((u) => (u.id === id ? { ...u, role } : u)));
    const { error: err } = await sb.from("profile").update({ role }).eq("id", id);
    if (err) { setError(err.message); setList(prev); }
  }

  return (
    <div>
      {error && <p className="mb-4 text-sm text-clay">{error}</p>}
      <ul className="divide-y divide-charcoal/10">
        {list.map((u) => (
          <li key={u.id} className="flex items-center justify-between py-3 text-sm">
            <span>
              <span className="font-medium">{u.name ?? "—"}</span>
              <span className="ml-3 font-mono text-xs text-charcoal/40">{u.referral_code}</span>
            </span>
            <select value={u.role} onChange={(e) => setRole(u.id, e.target.value)} className="rounded-lg border border-charcoal/20 px-3 py-1.5">
              {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </li>
        ))}
      </ul>
    </div>
  );
}
