"use client";

import { useEffect, useState, useCallback } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const start = useCallback(() => {
    setLoading(true);
    setProgress(10);
    const t1 = setTimeout(() => setProgress(40), 100);
    const t2 = setTimeout(() => setProgress(65), 400);
    const t3 = setTimeout(() => setProgress(80), 900);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  const done = useCallback(() => {
    setProgress(100);
    const t = setTimeout(() => { setLoading(false); setProgress(0); }, 300);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const cleanup = done();
    return cleanup;
  }, [pathname, searchParams, done]);

  // Intercept link clicks to trigger start
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;
      const href = target.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("http") || href.startsWith("mailto") || target.target === "_blank") return;
      if (href === pathname) return;
      start();
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [pathname, start]);

  if (!loading && progress === 0) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[9999] h-[3px] bg-transparent pointer-events-none"
      style={{ transition: "opacity 300ms" }}
    >
      <div
        className="h-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)]"
        style={{
          width: `${progress}%`,
          transition: progress === 100 ? "width 200ms ease-out" : "width 600ms ease",
        }}
      />
    </div>
  );
}
