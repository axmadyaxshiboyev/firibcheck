"use client";
import { useEffect, useState } from "react";

/** Katta ekran (>=1024px) va harakat cheklanmagan bo'lsa true. SSR'da false — mobil yengil qoladi. */
export function useDesktop(): boolean {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const m = matchMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)");
    const f = () => setOn(m.matches);
    f();
    m.addEventListener("change", f);
    return () => m.removeEventListener("change", f);
  }, []);
  return on;
}
