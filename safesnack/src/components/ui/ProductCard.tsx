import Link from "next/link";
import { inr } from "@/lib/format";
import { priceFrom, primaryImage, type Product } from "@/lib/queries";
import { ClientImage } from "@/components/ui/ClientImage";

export function ProductCard({ product }: { product: Product }) {
  const img = primaryImage(product);

  return (
    <Link href={`/products/${product.slug}`} className="group flex h-full flex-col">
      <div className="relative aspect-square overflow-hidden rounded-2xl border border-charcoal/10 bg-white">
        {img ? (
          <ClientImage
            src={img}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.035]"
            fallback={<Fallback name={product.name} />}
          />
        ) : (
          <Fallback name={product.name} />
        )}
        {product.brand?.is_house_brand && (
          <span className="absolute left-3 top-3 rounded-full bg-charcoal px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.12em] text-white">
            SafeSnack original
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col pt-4">
        {product.dietary_tags?.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-1.5">
            {product.dietary_tags.slice(0, 2).map((tag) => (
              <span key={tag} className="ep-chip">{tag}</span>
            ))}
          </div>
        )}
        <h3 className="text-lg font-bold leading-tight text-charcoal transition-colors group-hover:text-clay">
          {product.name}
        </h3>
        <div className="mt-auto flex items-center justify-between pt-4">
          <span className="font-bold tabular-nums text-charcoal">{inr(priceFrom(product))}</span>
          <span className="text-sm font-bold text-clay transition-transform group-hover:translate-x-1">View</span>
        </div>
      </div>
    </Link>
  );
}

function Fallback({ name }: { name: string }) {
  return (
    <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_30%_20%,#fff_0,#f4f6f3_62%)] p-8 text-center">
      <div>
        <span className="text-4xl font-black tracking-[-.08em] text-clay">SS</span>
        <p className="mt-3 text-sm font-bold text-charcoal/65">{name}</p>
      </div>
    </div>
  );
}
