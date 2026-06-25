"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [currentPath, setCurrentPath] = useState(pathname);
  const [displayChildren, setDisplayChildren] = useState(children);
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    if (pathname !== currentPath) {
      setTransitioning(true);
      const timer = setTimeout(() => {
        setCurrentPath(pathname);
        setDisplayChildren(children);
        setTransitioning(false);
      }, 160);
      return () => clearTimeout(timer);
    } else {
      setDisplayChildren(children);
    }
  }, [pathname, children, currentPath]);

  return (
    <div
      className={`transition-all duration-200 ease-out transform ${
        transitioning
          ? "opacity-0 translate-y-2"
          : "opacity-100 translate-y-0"
      }`}
    >
      {displayChildren}
    </div>
  );
}
