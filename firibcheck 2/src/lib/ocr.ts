"use client";

/**
 * Brauzer ichida rasmdan matn o'qish (Tesseract.js).
 * Rasm hech qayerga yuborilmaydi. Til modellari ham shu saytning o'zidan (public/ocr) yuklanadi
 * va brauzer keshida saqlanadi — tashqi CDN yo'q.
 */

import type { Worker } from "tesseract.js";

export const ACCEPTED = ["image/png", "image/jpeg", "image/webp", "image/bmp", "image/gif"];
export const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

export type OcrProgress = { stage: "load" | "read"; progress: number };

let workerPromise: Promise<Worker> | null = null;

async function getWorker(onProgress?: (p: OcrProgress) => void): Promise<Worker> {
  if (!workerPromise) {
    workerPromise = (async () => {
      const { createWorker } = await import("tesseract.js");
      // Hammasi o'z domenimizdan (public/ocr) — uchinchi tomon CDN ishlatilmaydi
      const w = await createWorker(["uzb", "uzb_cyrl", "rus", "eng"], 1, {
        workerPath: "/ocr/worker.min.js",
        corePath: "/ocr/core",
        langPath: "/ocr/lang",
        logger: (m: { status: string; progress: number }) => {
          if (!progressRef.cb) return;
          if (m.status === "recognizing text") progressRef.cb({ stage: "read", progress: m.progress });
          else progressRef.cb({ stage: "load", progress: m.progress || 0 });
        },
      });
      return w;
    })();
    workerPromise.catch(() => { workerPromise = null; });
  }
  progressRef.cb = onProgress;
  return workerPromise;
}
const progressRef: { cb?: (p: OcrProgress) => void } = {};

export function validateImage(file: File): string | null {
  if (!ACCEPTED.includes(file.type)) return "Faqat PNG, JPG, WEBP, BMP yoki GIF rasm yuklang.";
  if (file.size > MAX_IMAGE_BYTES) return "Rasm hajmi 10 MB dan oshmasligi kerak.";
  return null;
}

/** Kichik skrinshotlarni kattalashtirib, kulrang qilib, OCR aniqligini oshiradi. */
async function prepare(file: File): Promise<HTMLCanvasElement> {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((res, rej) => {
      const i = new Image();
      i.onload = () => res(i);
      i.onerror = () => rej(new Error("Rasmni ochib bo'lmadi."));
      i.src = url;
    });
    const target = Math.min(2400, Math.max(1600, img.naturalWidth));
    const k = Math.min(3, target / img.naturalWidth);
    const c = document.createElement("canvas");
    c.width = Math.round(img.naturalWidth * k);
    c.height = Math.round(img.naturalHeight * k);
    const ctx = c.getContext("2d", { willReadFrequently: true })!;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, 0, 0, c.width, c.height);
    const data = ctx.getImageData(0, 0, c.width, c.height);
    const d = data.data;
    // kulrang + qorong'i fon bo'lsa (tungi rejim skrinshot) inversiya
    let sum = 0;
    for (let i = 0; i < d.length; i += 4) {
      const g = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
      d[i] = d[i + 1] = d[i + 2] = g;
      sum += g;
    }
    const avg = sum / (d.length / 4);
    if (avg < 110) for (let i = 0; i < d.length; i += 4) { d[i] = d[i + 1] = d[i + 2] = 255 - d[i]; }
    ctx.putImageData(data, 0, 0);
    return c;
  } finally {
    URL.revokeObjectURL(url);
  }
}

export async function recognize(file: File, onProgress?: (p: OcrProgress) => void): Promise<{ text: string; confidence: number }> {
  const worker = await getWorker(onProgress);
  const canvas = await prepare(file);
  const { data } = await worker.recognize(canvas);
  const text = (data.text || "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return { text, confidence: Math.round(data.confidence || 0) };
}
