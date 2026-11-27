"use client";

import { useEffect, useRef } from "react";

/**
 * Jonli suv effekti (WebGL). Figma'dagi "FiribCheck Liquid Water" shader'ining GLSL versiyasi:
 * domen-buzilishli oqim, kaustik yorug'lik va kursor/bosish orqali tarqaladigan to'lqinlar.
 * Ekrandan tashqarida yoki tab yashirin bo'lsa to'xtaydi; reduced-motion'da bitta kadr chiziladi.
 */

const VERT = `attribute vec2 p; void main(){ gl_Position = vec4(p,0.0,1.0); }`;

const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;
uniform float uMouseOn;
uniform vec4 uRip[8];

float hash(vec2 q){ return fract(sin(dot(q, vec2(127.1,311.7))) * 43758.5453); }
float noise(vec2 q){
  vec2 i = floor(q); vec2 f = fract(q); vec2 w = f*f*(3.0-2.0*f);
  float a = hash(i), b = hash(i+vec2(1.0,0.0)), c = hash(i+vec2(0.0,1.0)), d = hash(i+vec2(1.0,1.0));
  return mix(mix(a,b,w.x), mix(c,d,w.x), w.y);
}
float fbm(vec2 q){
  float v = 0.0; float a = 0.5;
  for(int k=0;k<5;k++){ v += a*noise(q); q = q*2.03 + vec2(1.7,9.2); a *= 0.5; }
  return v;
}
float caustic(vec2 p, float t){
  vec2 q = p; float c = 1.0; float inten = 0.005;
  for(int n=0;n<4;n++){
    float tt = t * (1.0 - 3.5 / float(n+1));
    q = p + vec2(cos(tt - q.x) + sin(tt + q.y), sin(tt - q.y) + cos(tt + q.x));
    float den = length(vec2(p.x / (sin(q.x+tt)/inten), p.y / (cos(q.y+tt)/inten)));
    c += 1.0 / max(den, 0.0001);
  }
  c /= 4.0; c = 1.17 - pow(c, 1.4);
  return clamp(pow(abs(c), 8.0), 0.0, 1.0);
}

void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  uv.y = 1.0 - uv.y;
  float aspect = uRes.x / uRes.y;
  vec2 st = vec2(uv.x * aspect, uv.y);
  float t = uTime;

  // to'lqinlar (ripples)
  vec2 off = vec2(0.0); float shine = 0.0;
  for(int i=0;i<8;i++){
    vec4 r = uRip[i];
    float age = t - r.z;
    if(r.w > 0.0 && age > 0.0 && age < 3.2){
      vec2 rp = vec2(r.x * aspect, r.y);
      vec2 dv = st - rp; float d = length(dv);
      float front = age * 0.42;
      float wave = sin((d - front) * 46.0) * exp(-abs(d - front) * 14.0) * exp(-age * 1.15) * r.w;
      off += (dv / max(d, 0.001)) * wave * 0.018;
      shine += wave * 0.55;
    }
  }
  // kursor linzasi
  if(uMouseOn > 0.5){
    vec2 mp = vec2(uMouse.x * aspect, uMouse.y);
    float md = length(st - mp);
    off += (st - mp) * exp(-md * 7.0) * 0.06;
    shine += exp(-md * 9.0) * 0.12;
  }
  st += off;

  vec2 warp = vec2(fbm(st*1.6 + vec2(t*0.06, -t*0.04)), fbm(st*1.6 + vec2(3.1 - t*0.05, 1.3 + t*0.03)));
  float flow = fbm(st*1.2 + warp*1.4 + vec2(t*0.02, 0.0));
  vec2 cp = (st + warp*0.45) * 6.28318 * 1.25;
  float ca = caustic(cp - 250.0, t*0.45);
  float cb = caustic(cp*1.35 + vec2(13.0,7.0) - 250.0, t*0.33 + 2.0);
  float caus = clamp(ca*0.7 + cb*0.5, 0.0, 1.0);

  vec3 light = vec3(0.925, 0.955, 1.0);
  vec3 deep  = vec3(0.37, 0.58, 0.98);
  vec3 col = mix(light, deep, smoothstep(0.25, 0.88, flow));
  float ridge = smoothstep(0.47, 0.53, fract(flow*6.0 + t*0.05));
  col += vec3(0.05) * ridge * 0.4;
  col = mix(col, vec3(1.0), caus * 0.62 + clamp(shine, -0.2, 0.6));

  // yuqori qism matn uchun oqroq
  float topFade = smoothstep(0.08, 0.78, uv.y);
  col = mix(vec3(1.0), col, mix(0.22, 1.0, topFade));
  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}`;

export function LiquidCanvas({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false, premultipliedAlpha: false, powerPreference: "low-power" });
    if (!gl) { canvas.style.display = "none"; return; }

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { console.warn(gl.getShaderInfoLog(s)); return null; }
      return s;
    };
    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) { canvas.style.display = "none"; return; }
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { canvas.style.display = "none"; return; }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "uRes");
    const uTime = gl.getUniformLocation(prog, "uTime");
    const uMouse = gl.getUniformLocation(prog, "uMouse");
    const uMouseOn = gl.getUniformLocation(prog, "uMouseOn");
    const uRip = gl.getUniformLocation(prog, "uRip");

    const ripples = new Float32Array(32);
    let ripIdx = 0;
    const mouse = { x: 0.5, y: 0.5, on: 0 };
    const start = performance.now();
    const now = () => (performance.now() - start) / 1000;
    let lastRip = 0;

    const addRipple = (x: number, y: number, strength: number) => {
      const o = ripIdx * 4;
      ripples[o] = x; ripples[o + 1] = y; ripples[o + 2] = now(); ripples[o + 3] = strength;
      ripIdx = (ripIdx + 1) % 8;
    };

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let scale = 0.62;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5) * scale;
      const w = Math.max(1, Math.floor(canvas.clientWidth * dpr));
      const h = Math.max(1, Math.floor(canvas.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
      gl.viewport(0, 0, w, h);
    };

    const host = canvas.parentElement || canvas;
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = (e.clientX - r.left) / r.width;
      mouse.y = (e.clientY - r.top) / r.height;
      mouse.on = 1;
      const t = now();
      if (t - lastRip > 0.16) { addRipple(mouse.x, mouse.y, 0.45); lastRip = t; }
    };
    const onLeave = () => { mouse.on = 0; };
    const onDown = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      addRipple((e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height, 1.0);
    };
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);
    host.addEventListener("pointerdown", onDown);

    let raf = 0;
    let visible = true;
    const draw = () => {
      resize();
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, reduce ? 12.0 : now());
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.uniform1f(uMouseOn, mouse.on);
      gl.uniform4fv(uRip, ripples);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };
    // Kadr vaqtini kuzatamiz: qurilma sekin bo'lsa sifatni pasaytiramiz, juda sekin bo'lsa to'xtatamiz
    let frames = 0, acc = 0, last = 0, dropped = 0;
    const loop = (ts: number = performance.now()) => {
      if (last) { acc += ts - last; frames++; }
      last = ts;
      if (frames >= 40) {
        const avg = acc / frames;
        frames = 0; acc = 0;
        if (avg > 30) {
          dropped++;
          if (dropped === 1) scale = 0.4;
          else { canvas.style.display = "none"; return; }
        }
      }
      draw();
      if (visible && !document.hidden && !reduce) raf = requestAnimationFrame(loop);
    };
    const io = new IntersectionObserver(([en]) => {
      visible = en.isIntersecting;
      cancelAnimationFrame(raf);
      last = 0; if (visible) raf = requestAnimationFrame(loop);
    });
    io.observe(canvas);
    const onVis = () => { cancelAnimationFrame(raf); last = 0; if (!document.hidden && visible) raf = requestAnimationFrame(loop); };
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("resize", draw);
    // dastlabki "tomchi"
    setTimeout(() => addRipple(0.5, 0.62, 1.0), 300);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("resize", draw);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      host.removeEventListener("pointerdown", onDown);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return <canvas ref={ref} className={className} aria-hidden />;
}
