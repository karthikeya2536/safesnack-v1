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
    <main className="ep-page">
      <div>
      <p className="ep-kicker">Customer space</p>
      <h1 className="mt-3 text-5xl font-bold tracking-[-.06em]">My account</h1>
      <div className="mt-10 grid gap-8 lg:grid-cols-[230px_1fr]">
        <aside className="ep-card flex h-fit flex-row flex-wrap gap-2 p-3 text-sm lg:sticky lg:top-28 lg:flex-col">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="flex min-h-11 items-center rounded-full px-4 font-bold text-charcoal/65 transition hover:bg-bone hover:text-charcoal">{n.label}</Link>
          ))}
          <div className="pt-3"><SignOutButton /></div>
        </aside>
        <div className="ep-card min-w-0 p-5 md:p-8">{children}</div>
      </div>
      </div>
    </main>
  );
}
