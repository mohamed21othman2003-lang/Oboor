"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css";
import { useCmsLang } from "@/lib/cms/i18n";

// أبعاد القص: «حر» = قص يدوي بأي مقاس (تسحب المقابض بحرّية)، «الأصلية» = نسبة الصورة، والباقي نسب جاهزة.
const ASPECTS: { key: string; ar: string; en: string; v: number }[] = [
  { key: "free", ar: "حر", en: "Free", v: 0 },
  { key: "orig", ar: "الأصلية", en: "Original", v: -1 },
  { key: "wide", ar: "عريض 16:9", en: "Wide 16:9", v: 16 / 9 },
  { key: "landscape", ar: "أفقي 4:3", en: "Landscape 4:3", v: 4 / 3 },
  { key: "square", ar: "مربّع 1:1", en: "Square 1:1", v: 1 },
  { key: "portrait", ar: "طولي 3:4", en: "Portrait 3:4", v: 3 / 4 },
];

export default function ImageCropModal({
  file, src, defaultAspect = 0, onCancel, onConfirm,
}: {
  file?: File;
  src?: string;
  defaultAspect?: number;
  onCancel: () => void;
  onConfirm: (out: Blob | File) => void;
}) {
  const { lang } = useCmsLang();
  const en = lang === "en";
  const t = (ar: string, e: string) => (en ? e : ar);

  const imgRef = useRef<HTMLImageElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const cropperRef = useRef<Cropper | null>(null);
  const baseZoomRef = useRef(1);

  const [url, setUrl] = useState("");
  const [nat, setNat] = useState<{ w: number; h: number } | null>(null);
  const [ready, setReady] = useState(false);
  const [aspectV, setAspectV] = useState<number>(defaultAspect || 0);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [bright, setBright] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [sat, setSat] = useState(100);
  const [outW, setOutW] = useState<number | "">("");
  const [touched, setTouched] = useState(false);
  const [busy, setBusy] = useState(false);

  const filter = useMemo(() => `brightness(${bright}%) contrast(${contrast}%) saturate(${sat}%)`, [bright, contrast, sat]);

  // تجهيز رابط الصورة
  useEffect(() => {
    let u = "", revoke = false;
    if (file) { u = URL.createObjectURL(file); revoke = true; } else if (src) { u = src; }
    setUrl(u);
    return () => { if (revoke && u) URL.revokeObjectURL(u); };
  }, [file, src]);

  // تهيئة cropper بعد تحميل الصورة
  useEffect(() => {
    if (!url || !imgRef.current) return;
    const el = imgRef.current;
    const startAspect = (defaultAspect && defaultAspect > 0) ? defaultAspect : NaN;
    const c = new Cropper(el, {
      viewMode: 1,
      dragMode: "crop",
      autoCropArea: 1,
      aspectRatio: startAspect,
      background: true,
      responsive: true,
      checkOrientation: false,
      guides: true,
      center: true,
      zoomable: true,
      ready() {
        try {
          const cd = c.getCanvasData(); const id = c.getImageData();
          baseZoomRef.current = cd.width / (id.naturalWidth || cd.width);
          setNat({ w: id.naturalWidth, h: id.naturalHeight });
        } catch {}
        setReady(true);
      },
      zoom(e) {
        const b = baseZoomRef.current || 1;
        setZoom(Math.max(1, Math.min(3, e.detail.ratio / b)));
      },
      cropstart() { setTouched(true); },
    });
    cropperRef.current = c;
    return () => { c.destroy(); cropperRef.current = null; setReady(false); };
  }, [url, defaultAspect]);

  // إغلاق بالمفتاح Esc + قفل تمرير الصفحة
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onCancel(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [onCancel]);

  const setAspect = (v: number) => {
    setAspectV(v); setTouched(true);
    const c = cropperRef.current; if (!c) return;
    c.setAspectRatio(v === -1 ? (nat ? nat.w / nat.h : NaN) : (v === 0 ? NaN : v));
  };
  const applyZoom = (v: number) => { setZoom(v); setTouched(true); cropperRef.current?.zoomTo(baseZoomRef.current * v); };
  const applyRotation = (deg: number) => { setRotation(deg); setTouched(true); cropperRef.current?.rotateTo(deg); };
  const rotateBy = (delta: number) => { let d = rotation + delta; while (d > 180) d -= 360; while (d < -180) d += 360; applyRotation(d); };

  async function confirm() {
    const c = cropperRef.current;
    if (!touched && file) { onConfirm(file); return; }
    if (!c) { if (file) onConfirm(file); else onCancel(); return; }
    setBusy(true);
    try {
      const srcCanvas = c.getCroppedCanvas({ imageSmoothingEnabled: true, imageSmoothingQuality: "high", maxWidth: 6000, maxHeight: 6000 });
      if (!srcCanvas) throw new Error("no canvas");
      let cw = srcCanvas.width, ch = srcCanvas.height;
      if (typeof outW === "number" && outW > 0 && outW < cw) { const s = outW / cw; cw = outW; ch = Math.round(ch * s); }
      const out = document.createElement("canvas");
      out.width = Math.max(1, Math.round(cw)); out.height = Math.max(1, Math.round(ch));
      const ctx = out.getContext("2d");
      if (!ctx) throw new Error("no ctx");
      ctx.filter = filter;
      ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = "high";
      ctx.drawImage(srcCanvas, 0, 0, out.width, out.height);
      const blob = await new Promise<Blob | null>((res) => out.toBlob((b) => res(b), "image/jpeg", 0.95));
      onConfirm(blob ?? file ?? new File([], "image.jpg"));
    } catch {
      if (file) onConfirm(file); else onCancel();
    } finally { setBusy(false); }
  }

  const reset = () => {
    setAspectV(0); setZoom(1); setRotation(0); setBright(100); setContrast(100); setSat(100); setOutW(""); setTouched(false);
    const c = cropperRef.current; if (c) { c.reset(); c.setAspectRatio(NaN); }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 p-3 sm:p-4" onClick={onCancel}>
      <div dir={en ? "ltr" : "rtl"} className="flex max-h-[94vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-line px-5 py-3">
          <h3 className="text-base font-extrabold text-ink">{t("محرّر الصورة", "Image Editor")}</h3>
          <button type="button" onClick={onCancel} className="rounded-lg p-1.5 text-ink-soft hover:bg-surface" aria-label={t("إغلاق", "Close")}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="grid gap-4 overflow-auto p-5 lg:grid-cols-[1fr_260px]">
          {/* المعاينة الحيّة: اسحب المقابض لقص أي جزء بحرّية */}
          <div ref={boxRef} className="ic-crop relative h-[52vh] min-h-[280px] overflow-hidden rounded-xl bg-[#111] ring-1 ring-line">
            {/* فلاتر الألوان تُطبَّق عبر قاعدة CSS (تصمد أمام إعادة رسم cropper وتتحدّث فورياً) */}
            <style>{`.ic-crop .cropper-canvas > img, .ic-crop .cropper-view-box > img { filter: ${filter} !important; }`}</style>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {url && <img ref={imgRef} src={url} alt="" className="block max-w-full" />}
          </div>

          {/* أدوات التحكّم */}
          <div className="space-y-4 text-start">
            <div>
              <p className="mb-1.5 text-[11px] font-bold text-ink-soft">{t("الأبعاد / القص", "Aspect / Crop")}</p>
              <div className="flex flex-wrap gap-1.5">
                {ASPECTS.map((a) => {
                  const on = a.v === aspectV;
                  return (
                    <button key={a.key} type="button" onClick={() => setAspect(a.v)}
                      className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold ring-1 transition-colors ${on ? "bg-brand text-white ring-brand" : "bg-white text-ink-soft ring-line hover:ring-brand/40"}`}>
                      {en ? a.en : a.ar}
                    </button>
                  );
                })}
              </div>
              <p className="mt-1.5 text-[10px] leading-4 text-ink-soft">{t("«حر» = اسحب أطراف الإطار لقص الصورة بأي مقاس تحبّه.", "“Free” = drag the frame's edges to crop at any size you like.")}</p>
            </div>

            <Slider label={t("تكبير", "Zoom")} min={1} max={3} step={0.01} value={zoom} onChange={applyZoom} fmt={(v) => `${v.toFixed(1)}×`} />

            <div>
              <div className="mb-1 flex items-center justify-between">
                <span className="text-[11px] font-bold text-ink-soft">{t("الدوران", "Rotation")}</span>
                <span className="text-[11px] text-ink-soft">{Math.round(rotation)}°</span>
              </div>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => rotateBy(-90)} className="rounded-lg border border-line px-2 py-1 text-[11px] hover:border-brand">‑90°</button>
                <input type="range" min={-180} max={180} step={1} value={rotation} onChange={(e) => applyRotation(Number(e.target.value))} className="flex-1 accent-brand" />
                <button type="button" onClick={() => rotateBy(90)} className="rounded-lg border border-line px-2 py-1 text-[11px] hover:border-brand">+90°</button>
              </div>
            </div>

            <div className="space-y-2 rounded-xl bg-surface/60 p-2.5">
              <p className="text-[11px] font-bold text-ink-soft">{t("تعديلات", "Adjustments")}</p>
              <Slider label={t("السطوع", "Brightness")} min={50} max={150} step={1} value={bright} onChange={(v) => { setBright(v); setTouched(true); }} fmt={(v) => `${v}%`} />
              <Slider label={t("التباين", "Contrast")} min={50} max={150} step={1} value={contrast} onChange={(v) => { setContrast(v); setTouched(true); }} fmt={(v) => `${v}%`} />
              <Slider label={t("التشبّع", "Saturation")} min={0} max={200} step={1} value={sat} onChange={(v) => { setSat(v); setTouched(true); }} fmt={(v) => `${v}%`} />
            </div>

            <div>
              <p className="mb-1.5 text-[11px] font-bold text-ink-soft">{t("عرض الإخراج (بكسل)", "Output width (px)")}</p>
              <div className="flex items-center gap-2">
                <input type="number" min={100} placeholder={nat ? String(Math.min(nat.w, 1600)) : "auto"} value={outW} onChange={(e) => { setOutW(e.target.value === "" ? "" : Math.max(50, Number(e.target.value))); setTouched(true); }}
                  className="w-full rounded-lg border border-line bg-white px-2.5 py-1.5 text-sm text-ink outline-none focus:border-brand" />
                <span className="shrink-0 text-[11px] text-ink-soft">{t("اتركه فارغاً = بلا تصغير", "empty = keep")}</span>
              </div>
            </div>

            <button type="button" onClick={reset} className="text-[11px] font-semibold text-brand hover:underline">{t("إعادة ضبط الكل", "Reset all")}</button>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-line px-5 py-3">
          <button type="button" onClick={onCancel} className="rounded-xl px-4 py-2.5 text-sm font-semibold text-ink-soft hover:bg-surface">{t("إلغاء", "Cancel")}</button>
          <button type="button" onClick={confirm} disabled={busy || !url || !ready} className="rounded-xl bg-brand px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-dark disabled:opacity-60">
            {busy ? t("جارٍ التجهيز…", "Processing…") : t("اعتماد", "Apply")}
          </button>
        </div>
      </div>
    </div>
  );
}

function Slider({ label, min, max, step, value, onChange, fmt }: { label: string; min: number; max: number; step: number; value: number; onChange: (v: number) => void; fmt: (v: number) => string }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <span className="text-[11px] font-bold text-ink-soft">{label}</span>
        <span className="text-[11px] text-ink-soft">{fmt(value)}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full accent-brand" />
    </div>
  );
}
