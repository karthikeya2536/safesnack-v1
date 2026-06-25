"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const getLinkClass = (path: string) => {
    const base = "relative rounded-full px-4 py-2 text-sm font-semibold transition-colors ";
    const active = "bg-charcoal text-white";
    const inactive = "text-charcoal/65 hover:bg-white hover:text-charcoal";
    
    const isCurrent = path === "/" ? pathname === "/" : pathname?.startsWith(path);
    return `${base} ${isCurrent ? active : inactive}`;
  };

  return (
    <div className="sticky top-0 z-50 w-full px-3 pt-3">
      <header className="glass-nav mx-auto flex min-h-16 w-full max-w-[1440px] items-center justify-between rounded-2xl px-4 md:px-6">
        <Link href="/" className="text-xl font-extrabold tracking-[-0.06em] text-charcoal transition-colors hover:text-clay" onClick={() => setOpen(false)}>
          Safe<span className="text-clay">Snack</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary navigation">
          <Link href="/products" className={getLinkClass("/products")}>Shop</Link>
          <Link href="/bundles" className={getLinkClass("/bundles")}>Bundles</Link>
          <Link href="/products?tag=diabetic" className={getLinkClass("/products?tag=diabetic")}>Diabetic</Link>
          <Link href="/search" className={getLinkClass("/search")}>Search</Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/account" className="hidden min-h-11 items-center px-3 text-sm font-semibold text-charcoal/65 transition hover:text-charcoal sm:flex">Account</Link>
          <Link href="/cart" className="btn-primary min-h-11 px-5 text-sm">Cart</Link>
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-charcoal/10 bg-white text-xl md:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? "×" : "≡"}
          </button>
        </div>
      </header>

      {open && (
        <nav className="glass-nav mx-auto mt-2 grid w-full max-w-[1440px] gap-1 rounded-2xl p-3 md:hidden" aria-label="Mobile navigation">
          <Link href="/products" className={getLinkClass("/products")} onClick={() => setOpen(false)}>Shop</Link>
          <Link href="/bundles" className={getLinkClass("/bundles")} onClick={() => setOpen(false)}>Bundles</Link>
          <Link href="/products?tag=diabetic" className={getLinkClass("/products?tag=diabetic")} onClick={() => setOpen(false)}>Diabetic</Link>
          <Link href="/search" className={getLinkClass("/search")} onClick={() => setOpen(false)}>Search</Link>
          <Link href="/account" className={getLinkClass("/account")} onClick={() => setOpen(false)}>Account</Link>
        </nav>
      )}
    </div>
  );
}
