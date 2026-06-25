"use client";

import { useEffect, useRef, useState } from "react";

export function FadeIn({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }
    const ob = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setShown(true); ob.disconnect(); }
      },
      { threshold: 0.1 },
    );
    ob.observe(el);
    return () => ob.disconnect();
  }, []);

  return (
    <div ref={ref} className={`${className ?? ""} transition-all duration-300 ease-out ${shown ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"}`}>
      {children}
    </div>
  );
}
