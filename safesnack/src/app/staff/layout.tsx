import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { SignOutButton } from "@/components/auth/SignOutButton";

const NAV = [
  { href: "/staff", label: "Order queue" },
  { href: "/staff/inventory", label: "Inventory" },
];

export default async function StaffLayout({ children }: { children: React.ReactNode }) {
  await requireRole(["STAFF", "ADMIN"]);
  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <div className="grid gap-10 md:grid-cols-[160px_1fr]">
        <aside className="flex flex-col gap-3 text-sm">
          <p className="font-serif text-lg text-forest">Staff</p>
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
