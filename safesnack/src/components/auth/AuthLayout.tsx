import { Suspense } from "react";

export function AuthShell({ title, intro, children }: { title: string; intro: string; children: React.ReactNode }) {
  return (
    <main className="mx-auto grid min-h-[80vh] max-w-6xl items-stretch gap-0 px-6 py-12 md:grid-cols-2">
      {/* Promise panel */}
      <div className="hidden flex-col justify-between rounded-l-3xl bg-forest p-12 text-bone md:flex">
        <p className="text-sm uppercase tracking-widest text-bone/60">SafeSnack</p>
        <div>
          <h2 className="font-serif text-4xl leading-tight">Snacks you can trust, every single time.</h2>
          <p className="mt-4 text-bone/70">Sugar-free, nutritionist-approved, delivered fresh across Hyderabad.</p>
        </div>
        <p className="text-sm text-bone/50">Trusted by 50,000+ families</p>
      </div>

      {/* Form panel */}
      <div className="flex flex-col justify-center rounded-r-3xl border border-charcoal/10 bg-bone p-12 md:rounded-l-none">
        <h1 className="font-serif text-3xl text-forest">{title}</h1>
        <p className="mt-2 text-sm text-charcoal/60">{intro}</p>
        <div className="mt-8">
          <Suspense>{children}</Suspense>
        </div>
      </div>
    </main>
  );
}
