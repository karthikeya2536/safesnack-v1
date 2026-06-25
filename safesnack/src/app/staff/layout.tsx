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
    <div className="ep-page">
      <div className="grid gap-8 lg:grid-cols-[200px_1fr]">
        <aside className="ep-card flex h-fit flex-row flex-wrap gap-1 p-3 text-sm lg:sticky lg:top-28 lg:flex-col">
          <p className="px-4 py-3 text-lg font-extrabold">Staff</p>
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="flex min-h-11 items-center rounded-xl px-4 font-bold text-charcoal/65 transition hover:bg-bone hover:text-charcoal">{n.label}</Link>
          ))}
          <div className="pt-3"><SignOutButton /></div>
        </aside>
        <main className="ep-card min-w-0 overflow-hidden p-5 md:p-8">{children}</main>
      </div>
    </div>
  );
}
