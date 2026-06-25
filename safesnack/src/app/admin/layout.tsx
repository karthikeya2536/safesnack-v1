import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { SignOutButton } from "@/components/auth/SignOutButton";

const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/coupons", label: "Coupons" },
  { href: "/admin/homepage", label: "Homepage" },
  { href: "/admin/users", label: "Users" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireRole(["ADMIN"]);
  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="grid gap-10 md:grid-cols-[180px_1fr]">
        <aside className="flex flex-col gap-3 text-sm">
          <p className="font-serif text-lg text-forest">Admin</p>
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="text-charcoal/70 transition hover:text-clay">{n.label}</Link>
          ))}
          <div className="pt-3"><SignOutButton /></div>
        </aside>
        <main>{children}</main>
      </div>
    </div>
  );
}
