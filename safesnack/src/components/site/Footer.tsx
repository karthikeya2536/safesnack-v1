import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-charcoal/10 bg-sage/40">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-14 md:grid-cols-4">
        <div>
          <p className="font-serif text-lg text-forest">SafeSnack</p>
          <p className="mt-2 text-sm text-charcoal/60">Guilt-free snacks, delivered fast across Hyderabad.</p>
        </div>
        <div className="text-sm">
          <p className="font-medium">Shop</p>
          <ul className="mt-3 space-y-2 text-charcoal/70">
            <li><Link href="/products" className="hover:text-clay">All Products</Link></li>
            <li><Link href="/bundles" className="hover:text-clay">Bundles</Link></li>
          </ul>
        </div>
        <div className="text-sm">
          <p className="font-medium">Company</p>
          <ul className="mt-3 space-y-2 text-charcoal/70">
            <li>safesnack1@gmail.com</li>
            <li>+91 97053 16483</li>
          </ul>
        </div>
        <div className="text-sm text-charcoal/60">© 2026 SafeSnacks</div>
      </div>
    </footer>
  );
}
