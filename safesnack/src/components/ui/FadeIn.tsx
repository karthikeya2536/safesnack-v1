"use client";

import { useEffect, useRef, useState } from "react";

type Direction = "up" | "down" | "left" | "right" | "scale";

export function FadeIn({
  children,
  className,
  delay = 0,
  direction = "up",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: Direction;
}) {
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
        if (entry.isIntersecting) {
          const timer = window.setTimeout(() => {
            setShown(true);
          }, delay);
          ob.disconnect();
          return () => window.clearTimeout(timer);
        }
      },
      { threshold: 0.12 },
    );
    ob.observe(el);
    return () => ob.disconnect();
  }, [delay]);

  const getDirectionStyles = () => {
    if (shown) return "translate-x-0 translate-y-0 scale-100 opacity-100";
    switch (direction) {
      case "up":
        return "translate-y-6 opacity-0";
      case "down":
        return "-translate-y-6 opacity-0";
      case "left":
        return "translate-x-8 opacity-0";
      case "right":
        return "-translate-x-8 opacity-0";
      case "scale":
        return "scale-95 opacity-0";
    }
  };

  return (
    <div
      ref={ref}
      className={`${className ?? ""} transition-all duration-500 ${getDirectionStyles()}`}
      style={{
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      {children}
    </div>
  );
}
