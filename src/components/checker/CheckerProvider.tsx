"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { analyze, validate, MAX_LENGTH as MAX_LEN, type AnalysisResult } from "@/lib/analyzer";
import { SAMPLES } from "@/lib/samples";
import { recognize, validateImage, type OcrProgress } from "@/lib/ocr";
import { processFile, validateFile, fileErrorMessage, isImageFile } from "@/lib/files";

export type Mode = "text" | "link" | "image" | "file";
export type Status = "idle" | "ocr" | "loading" | "done";

export interface AiResult {
  summary: string;
  extraSignals: { title: string; detail: string; severity: "high" | "medium" | "low" }[];
  advice: string[];
  adjustment: number;
}

interface ImageState {
  file: File;
  url: string;
  progress: OcrProgress | null;
  confidence?: number;
  error?: string;
}

interface FileState {
  name: string;
  size: number;
  kind: "text" | "apk";
  busy?: boolean;
}

interface Ctx {
  mode: Mode;
  setMode: (m: Mode) => void;
  text: string;
  setText: (t: string) => void;
  status: Status;
  error: string | null;
  result: AnalysisResult | null;
  ai: AiResult | null;
  aiError: string | null;
  aiAvailable: boolean;
  aiOn: boolean;
  setAiOn: (v: boolean) => void;
  image: ImageState | null;
  file: FileState | null;
  handleFile: (file: File) => Promise<void>;
  clearFile: () => void;
  run: (override?: string) => Promise<void>;
  loadSample: (id: string) => void;
  handleImage: (file: File) => Promise<void>;
  clearImage: () => void;
  reset: () => void;
  submitFromHero: (t: string) => void;
}

const C = createContext<Ctx | null>(null);
export const useChecker = () => {
  const v = useContext(C);
  if (!v) throw new Error("useChecker must be inside CheckerProvider");
  return v;
};

const scrollToChecker = () => document.getElementById("tekshiruv")?.scrollIntoView({ behavior: "smooth", block: "start" });

export function CheckerProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<Mode>("text");
  const [text, setTextState] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [ai, setAi] = useState<AiResult | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiAvailable, setAiAvailable] = useState(false);
  const [aiOn, setAiOnState] = useState(false);
  const [image, setImage] = useState<ImageState | null>(null);
  const [file, setFile] = useState<FileState | null>(null);
  const busy = useRef(false);

  useEffect(() => {
    fetch("/api/analyze").then((r) => r.json()).then((d) => setAiAvailable(!!d.aiEnabled)).catch(() => {});
    try { setAiOnState(localStorage.getItem("fc-ai") === "1"); } catch {}
    // /?namuna=prize kabi havola orqali kelganda
    const p = new URLSearchParams(window.location.search);
    const s = p.get("namuna");
    if (s) {
      const found = SAMPLES.find((x) => x.id === s);
      const fromType = p.get("matn");
      if (found) setTextState(found.text);
      else if (fromType) setTextState(fromType.slice(0, 4000));
      setTimeout(scrollToChecker, 400);
    }
  }, []);

  const setAiOn = (v: boolean) => { setAiOnState(v); try { localStorage.setItem("fc-ai", v ? "1" : "0"); } catch {} };
  const setText = (t: string) => { setTextState(t); if (error) setError(null); };

  const run = useCallback(async (override?: string) => {
    if (busy.current) return; // takroriy yuborishning oldini olish
    const value = (override ?? text).trim();
    const v = validate(value);
    if (v) { setError(v.error); return; }
    busy.current = true;
    setError(null); setAi(null); setAiError(null);
    setStatus("loading");
    const t0 = performance.now();
    try {
      const r = analyze(value);
      let aiRes: AiResult | null = null;
      if (aiAvailable && aiOn) {
        try {
          const res = await fetch("/api/analyze", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ text: value }) });
          const d = await res.json();
          if (res.ok) aiRes = d as AiResult; else setAiError(d.error || "AI tahlili mavjud emas.");
        } catch { setAiError("AI xizmatiga ulanib bo'lmadi. Qoidalarga asoslangan natija ko'rsatildi."); }
      }
      const wait = 650 - (performance.now() - t0); // animatsiya ko'rinishi uchun qisqa pauza
      if (wait > 0) await new Promise((res) => setTimeout(res, wait));
      if (aiRes) {
        const score = Math.max(0, Math.min(99, r.score + aiRes.adjustment));
        r.score = score;
        r.level = score >= 60 ? "high" : score >= 25 ? "medium" : "low";
      }
      setResult(r); setAi(aiRes); setStatus("done");
      requestAnimationFrame(() => document.getElementById("natija")?.scrollIntoView({ behavior: "smooth", block: "nearest" }));
    } finally {
      busy.current = false;
    }
  }, [text, aiAvailable, aiOn]);

  const loadSample = (id: string) => {
    const s = SAMPLES.find((x) => x.id === id);
    if (!s) return;
    setMode("text"); setTextState(s.text); setError(null);
  };

  const handleImage = useCallback(async (file: File) => {
    const bad = validateImage(file);
    setMode("image");
    if (bad) { setError(bad); return; }
    setError(null);
    if (image?.url) URL.revokeObjectURL(image.url);
    const url = URL.createObjectURL(file);
    setImage({ file, url, progress: { stage: "load", progress: 0 } });
    setStatus("ocr");
    try {
      const { text: t, confidence } = await recognize(file, (p) => setImage((s) => (s ? { ...s, progress: p } : s)));
      setImage((s) => (s ? { ...s, progress: null, confidence } : s));
      setStatus("idle");
      if (!t || t.replace(/\W/g, "").length < 4) {
        setError("Rasmdan matn topilmadi. Aniqroq skrinshot yuklang yoki matnni qo'lda kiriting.");
        return;
      }
      setTextState(t);
    } catch {
      setStatus("idle");
      setImage((s) => (s ? { ...s, progress: null, error: "OCR ishlamadi" } : s));
      setError("Rasmni o'qib bo'lmadi. Sahifani yangilab qayta urinib ko'ring yoki matnni qo'lda kiriting.");
    }
  }, [image]);

  const handleFile = useCallback(async (f: File) => {
    if (isImageFile(f)) { await handleImage(f); return; }
    setMode("file");
    setResult(null); setAi(null); setAiError(null);
    const bad = validateFile(f);
    if (bad) { setError(bad); setFile(null); return; }
    setError(null);
    const isApk = /\.apk$/i.test(f.name);
    setFile({ name: f.name, size: f.size, kind: isApk ? "apk" : "text", busy: true });
    setStatus("loading");
    try {
      const out = await processFile(f);
      if (out.kind === "apk") {
        setTextState("");
        setResult(out.result); setStatus("done");
        setFile({ name: f.name, size: f.size, kind: "apk" });
        requestAnimationFrame(() => document.getElementById("natija")?.scrollIntoView({ behavior: "smooth", block: "nearest" }));
      } else {
        setStatus("idle");
        setFile({ name: f.name, size: f.size, kind: "text" });
        if (!out.text || out.text.replace(/\W/g, "").length < 4) { setError("Fayldan matn topilmadi."); return; }
        const truncated = out.text.length > MAX_LEN;
        setTextState(out.text.slice(0, MAX_LEN));
        if (truncated) setError(`Fayl uzun: faqat birinchi ${MAX_LEN} belgi tekshiriladi.`);
      }
    } catch (e) {
      setStatus("idle"); setFile(null);
      setError(fileErrorMessage(e));
    }
  }, [handleImage]);

  const clearFile = () => { setFile(null); setTextState(""); setResult(null); setStatus("idle"); setError(null); };

  const clearImage = () => { if (image?.url) URL.revokeObjectURL(image.url); setImage(null); };

  const reset = () => {
    setTextState(""); setResult(null); setAi(null); setAiError(null); setError(null); setStatus("idle"); clearImage(); setFile(null); setMode("text");
    requestAnimationFrame(() => { scrollToChecker(); document.getElementById("fc-input")?.focus({ preventScroll: true }); });
  };

  const submitFromHero = (t: string) => {
    setMode(/^\s*(https?:\/\/|www\.)\S+\s*$/i.test(t) ? "link" : "text");
    setTextState(t);
    scrollToChecker();
    setTimeout(() => run(t), 450);
  };

  const value = useMemo<Ctx>(() => ({
    mode, setMode, text, setText, status, error, result, ai, aiError, aiAvailable, aiOn, setAiOn, image, file, handleFile, clearFile,
    run, loadSample, handleImage, clearImage, reset, submitFromHero,
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [mode, text, status, error, result, ai, aiError, aiAvailable, aiOn, image, file, run, handleImage, handleFile]);

  return <C.Provider value={value}>{children}</C.Provider>;
}
