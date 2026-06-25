import Link from "next/link";

export function EmptyState({ title, body, href, action }: { title: string; body: string; href?: string; action?: string }) {
  return (
    <div className="ep-card px-6 py-14 text-center">
      <p className="text-2xl font-bold text-charcoal">{title}</p>
      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-charcoal/60">{body}</p>
      {href && action && <Link href={href} className="btn-primary mt-7 px-6 text-sm">{action}</Link>}
    </div>
  );
}
