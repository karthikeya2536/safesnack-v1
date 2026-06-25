import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-charcoal/10 bg-charcoal text-white">
      <div className="site-shell grid gap-12 py-16 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div className="max-w-sm">
          <p className="text-3xl font-extrabold tracking-[-0.06em]">Safe<span className="text-clay">Snack</span></p>
          <p className="mt-4 text-sm leading-7 text-white/60">Sugar-free snacks selected for clearer choices, better ingredients, and easier Hyderabad delivery.</p>
          <Link href="/products" className="btn-primary mt-7 px-6 text-sm">Shop snacks</Link>
        </div>
        <div className="text-sm">
          <p className="font-bold text-white">Shop</p>
          <ul className="mt-4 space-y-3 text-white/60">
            <li><Link href="/products" className="transition hover:text-white">All products</Link></li>
            <li><Link href="/bundles" className="transition hover:text-white">Bundles</Link></li>
            <li><Link href="/search" className="transition hover:text-white">Search</Link></li>
          </ul>
        </div>
        <div className="text-sm">
          <p className="font-bold text-white">Account</p>
          <ul className="mt-4 space-y-3 text-white/60">
            <li><Link href="/account" className="transition hover:text-white">My account</Link></li>
            <li><Link href="/account/orders" className="transition hover:text-white">Orders</Link></li>
            <li><Link href="/account/wishlist" className="transition hover:text-white">Wishlist</Link></li>
          </ul>
        </div>
        <div className="text-sm">
          <p className="font-bold text-white">Contact</p>
          <ul className="mt-4 space-y-3 text-white/60">
            <li>safesnack1@gmail.com</li>
            <li>+91 97053 16483</li>
            <li>Hyderabad, India</li>
          </ul>
        </div>
      </div>
      <div className="site-shell flex flex-col gap-2 border-t border-white/10 py-5 text-xs text-white/45 sm:flex-row sm:justify-between">
        <span>© 2026 SafeSnack</span>
        <span>Made for better everyday snacking.</span>
      </div>
    </footer>
  );
}
