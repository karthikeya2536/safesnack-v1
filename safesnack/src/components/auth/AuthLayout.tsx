import { Suspense } from "react";

export function AuthShell({ title, intro, children }: { title: string; intro: string; children: React.ReactNode }) {
  return (
    <main className="site-shell grid min-h-[calc(100dvh-5rem)] gap-0 py-8 md:grid-cols-2 md:py-12">
      <div className="relative hidden min-h-[680px] overflow-hidden rounded-l-[2rem] md:block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/safesnack/auth-lifestyle.png" alt="Customer enjoying SafeSnack beetroot chips at home" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-10 text-white">
          <p className="text-sm font-bold uppercase tracking-[.15em] text-white/70">SafeSnack</p>
        <div>
            <h2 className="mt-4 text-4xl font-bold leading-tight">Your shelf, saved your way.</h2>
            <p className="mt-4 text-white/75">Keep orders, addresses, rewards, and favourites together.</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-center rounded-[2rem] border border-charcoal/10 bg-white p-7 md:rounded-l-none md:p-12">
        <h1 className="text-4xl font-bold">{title}</h1>
        <p className="mt-2 text-sm text-charcoal/60">{intro}</p>
        <div className="mt-8">
          <Suspense>{children}</Suspense>
        </div>
      </div>
    </main>
  );
}
