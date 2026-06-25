import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-charcoal/10 bg-bone/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-serif text-xl text-forest">SafeSnack</Link>
        <nav className="hidden gap-8 text-sm md:flex">
          <Link href="/products" className="transition hover:text-clay">Shop</Link>
          <Link href="/bundles" className="transition hover:text-clay">Bundles</Link>
          <Link href="/products?tag=diabetic" className="transition hover:text-clay">Diabetic</Link>
          <Link href="/search" className="transition hover:text-clay">Search</Link>
        </nav>
        <div className="flex gap-5 text-sm">
          <Link href="/account" className="transition hover:text-clay">Account</Link>
          <Link href="/cart" className="transition hover:text-clay">Cart</Link>
        </div>
      </div>
    </header>
  );
}
