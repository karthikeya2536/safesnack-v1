import Link from "next/link";
import { inr } from "@/lib/format";
import { priceFrom, primaryImage, type Product } from "@/lib/queries";

export function ProductCard({ product }: { product: Product }) {
  const img = primaryImage(product);
  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="aspect-square overflow-hidden rounded-2xl bg-sage/50">
        {img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={img}
            alt={product.name}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-center justify-center p-6 text-center font-serif text-forest/70">
            {product.name}
          </div>
        )}
      </div>
      <div className="mt-3">
        {product.brand?.is_house_brand && (
          <span className="text-[11px] uppercase tracking-wider text-clay">Originals</span>
        )}
        <h3 className="font-serif text-lg leading-snug">{product.name}</h3>
        <p className="mt-1 text-sm text-charcoal/60">from {inr(priceFrom(product))}</p>
      </div>
    </Link>
  );
}
