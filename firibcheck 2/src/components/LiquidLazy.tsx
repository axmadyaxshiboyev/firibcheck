"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

/**
 * Suv effekti (WebGL) faqat kerak bo'lganda yuklanadi:
 *  - sahifa ochilganda emas, foydalanuvchi birinchi marta harakat qilgandan keyin;
 *  - faqat sichqonchali, quvvatli qurilmada (telefon, kam xotira, "tejash" rejimida emas);
 *  - dasturiy (software) renderer bo'lsa umuman yoqilmaydi.
 * Aks holda fon sifatida yengil CSS gradient qoladi — sayt shundoq ham chiroyli va tez.
 */
const Liquid = dynamic(() => import("./LiquidCanvas").then((m) => m.LiquidCanvas), { ssr: false });

type NavExt = Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };

function gpuIsReal(): boolean {
  try {
    const c = document.createElement("canvas");
    const gl = c.getContext("webgl") as WebGLRenderingContext | null;
    if (!gl) return false;
    const ext = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = ext ? String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)) : "";
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return !/swiftshader|llvmpipe|software|basic render|microsoft basic|softpipe/i.test(renderer);
  } catch {
    return false;
  }
}

export function LiquidLazy({ className }: { className?: string }) {
  const [on, setOn] = useState(false);

  useEffect(() => {
    const nav = navigator as NavExt;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = matchMedia("(pointer: fine)").matches && matchMedia("(min-width: 900px)").matches;
    const weak = (nav.deviceMemory ?? 8) < 4 || (nav.hardwareConcurrency ?? 4) < 4 || !!nav.connection?.saveData;
    if (reduce || !fine || weak) return;

    const events = ["pointermove", "pointerdown", "keydown", "scroll"] as const;
    let started = false;
    const cleanup = () => events.forEach((e) => window.removeEventListener(e, start));
    function start() {
      if (started) return;
      started = true;
      cleanup();
      const run = () => { if (gpuIsReal()) setOn(true); };
      if ("requestIdleCallback" in window) (window as Window & typeof globalThis).requestIdleCallback(run, { timeout: 1500 });
      else setTimeout(run, 200);
    }
    events.forEach((e) => window.addEventListener(e, start, { passive: true }));
    return cleanup;
  }, []);

  if (!on) return null;
  return (
    <div className="fc-fade absolute inset-0">
      <Liquid className={className} />
    </div>
  );
}
