import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SignOutButton } from "@/components/auth/SignOutButton";

const NAV = [
  { href: "/account", label: "Profile" },
  { href: "/account/orders", label: "Orders" },
  { href: "/account/addresses", label: "Addresses" },
  { href: "/account/wishlist", label: "Wishlist" },
  { href: "/account/referrals", label: "Refer & Earn" },
];

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const sb = await createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) redirect("/login?next=/account");

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="font-serif text-4xl text-forest">My Account</h1>
      <div className="mt-10 grid gap-10 md:grid-cols-[200px_1fr]">
        <aside className="flex flex-col gap-3 text-sm">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="text-charcoal/70 transition hover:text-clay">{n.label}</Link>
          ))}
          <div className="pt-3"><SignOutButton /></div>
        </aside>
        <div>{children}</div>
      </div>
    </main>
  );
}
