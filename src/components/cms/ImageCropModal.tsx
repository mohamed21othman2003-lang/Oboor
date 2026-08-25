"use client";

import { useEffect, useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { useCmsLang } from "@/lib/cms/i18n";

type Area = { x: number; y: number; width: number; height: number };

// أبعاد جاهزة تطابق أشكال الإطارات في صفحات الموقع (0 = الأبعاد الأصلية للصورة)
const ASPECTS: { key: string; ar: string; en: string; v: number }[] = [
  { key: "free", ar: "الأصلية", en: "Original", v: 0 },
  { key: "wide", ar: "عريض 16:9", en: "Wide 16:9", v: 16 / 9 },
  { key: "landscape", ar: "أفقي 4:3", en: "Landscape 4:3", v: 4 / 3 },
  { key: "square", ar: "مربّع 1:1", en: "Square 1:1", v: 1 },
  { key: "portrait", ar: "طولي 3:4", en: "Portrait 3:4", v: 3 / 4 },
];

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((res, rej) => {
    const im = new window.Image();
    im.onload = () => res(im);
    im.onerror = rej;
    im.src = src;
  });
}

// يرسم الصورة بعد (الدوران + الفلتر + القص + إعادة الأبعاد) على canvas ويرجّع blob
async function renderEdited(
  src: string, area: Area | null, rotation: number, filter: string, outW: number | null,
): Promise<Blob | null> {
  const img = await loadImage(src);
  const rot = (rotation * Math.PI) / 180;
  const bw = Math.abs(Math.cos(rot)) * img.width + Math.abs(Math.sin(rot)) * img.height;
  const bh = Math.abs(Math.sin(rot)) * img.width + Math.abs(Math.cos(rot)) * img.height;
  // 1) ارسم الصورة كاملة (مع الدوران والفلتر) على canvas مؤقّت بحجم الإطار المحيط
  const tmp = document.createElement("canvas");
  tmp.width = Math.round(bw); tmp.height = Math.round(bh);
  const tctx = tmp.getContext("2d");
  if (!tctx) return null;
  tctx.filter = filter;
  tctx.translate(bw / 2, bh / 2);
  tctx.rotate(rot);
  tctx.drawImage(img, -img.width / 2, -img.height / 2);
  // 2) اقتطع الجزء المحدّد (area بإحداثيات react-easy-crop على الصورة المدوّرة)
  const a: Area = area && area.width > 0 ? area : { x: 0, y: 0, width: tmp.width, height: tmp.height };
  let cw = a.width, ch = a.height;
  if (outW && cw > 0 && outW < cw) { const s = outW / cw; cw = outW; ch = Math.round(ch * s); }
  const out = document.createElement("canvas");
  out.width = Math.max(1, Math.round(cw)); out.height = Math.max(1, Math.round(ch));
  const octx = out.getContext("2d");
  if (!octx) return null;
  octx.drawImage(tmp, a.x, a.y, a.width, a.height, 0, 0, out.width, out.height);
  return new Promise((res) => out.toBlob((b) => res(b), "image/jpeg", 0.92));
}

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

  const [url, setUrl] = useState("");
  const [nat, setNat] = useState<{ w: number; h: number } | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [aspectKey, setAspectKey] = useState(defaultAspect ? "custom" : "free");
  const [aspectV, setAspectV] = useState(defaultAspect);
  const [areaPx, setAreaPx] = useState<Area | null>(null);
  const [bright, setBright] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [sat, setSat] = useState(100);
  const [outW, setOutW] = useState<number | "">("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let u = "", revoke = false;
    if (file) { u = URL.createObjectURL(file); revoke = true; } else if (src) { u = src; }
    setUrl(u);
    if (u) loadImage(u).then((im) => setNat({ w: im.naturalWidth, h: im.naturalHeight })).catch(() => {});
    return () => { if (revoke && u) URL.revokeObjectURL(u); };
  }, [file, src]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onCancel(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [onCancel]);

  const onCropComplete = useCallback((_: Area, px: Area) => setAreaPx(px), []);
  const filter = `brightness(${bright}%) contrast(${contrast}%) saturate(${sat}%)`;
  // «الأصلية» = نسبة الصورة الطبيعية (إطار القص يغطّي الصورة كاملة)
  const effectiveAspect = aspectV || (nat ? nat.w / nat.h : 4 / 3);
  const changed = aspectV !== 0 || zoom !== 1 || rotation !== 0 || bright !== 100 || contrast !== 100 || sat !== 100 || outW !== "";

  async function confirm() {
    // لا تغيير + ملف جديد → ارفع الأصلي كما هو (أسرع، بلا إعادة ترميز)
    if (!changed && file) { onConfirm(file); return; }
    setBusy(true);
    try {
      const blob = await renderEdited(url, areaPx, rotation, filter, typeof outW === "number" ? outW : null);
      onConfirm(blob ?? file ?? new File([], "image.jpg"));
    } catch {
      if (file) onConfirm(file); else onCancel();
    } finally { setBusy(false); }
  }

  const reset = () => { setCrop({ x: 0, y: 0 }); setZoom(1); setRotation(0); setBright(100); setContrast(100); setSat(100); setOutW(""); setAspectKey("free"); setAspectV(0); };

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
          {/* المعاينة الحيّة (قص/دوران/تعديلات تظهر لحظياً) */}
          <div className="relative h-[52vh] min-h-[280px] overflow-hidden rounded-xl bg-[#111] ring-1 ring-line">
            {url && (
              <Cropper
                image={url}
                crop={crop}
                zoom={zoom}
                rotation={rotation}
                aspect={effectiveAspect}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onRotationChange={setRotation}
                onCropComplete={onCropComplete}
                showGrid
                restrictPosition={false}
                style={{ mediaStyle: { filter } }}
              />
            )}
          </div>

          {/* أدوات التحكّم */}
          <div className="space-y-4 text-start">
            {/* الأبعاد */}
            <div>
              <p className="mb-1.5 text-[11px] font-bold text-ink-soft">{t("الأبعاد / القص", "Aspect / Crop")}</p>
              <div className="flex flex-wrap gap-1.5">
                {ASPECTS.map((a) => {
                  const on = (a.v === 0 && aspectV === 0) || a.v === aspectV;
                  return (
                    <button key={a.key} type="button" onClick={() => { setAspectV(a.v); setAspectKey(a.key); }}
                      className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold ring-1 transition-colors ${on ? "bg-brand text-white ring-brand" : "bg-white text-ink-soft ring-line hover:ring-brand/40"}`}>
                      {en ? a.en : a.ar}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* التكبير */}
            <Slider label={t("تكبير", "Zoom")} min={1} max={3} step={0.01} value={zoom} onChange={setZoom} fmt={(v) => `${v.toFixed(1)}×`} />

            {/* الدوران */}
            <div>
              <div className="mb-1 flex items-center justify-between">
                <span className="text-[11px] font-bold text-ink-soft">{t("الدوران", "Rotation")}</span>
                <span className="text-[11px] text-ink-soft">{Math.round(rotation)}°</span>
              </div>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => setRotation((r) => (r - 90 + 360) % 360)} className="rounded-lg border border-line px-2 py-1 text-[11px] hover:border-brand">‑90°</button>
                <input type="range" min={0} max={359} step={1} value={rotation} onChange={(e) => setRotation(Number(e.target.value))} className="flex-1 accent-brand" />
                <button type="button" onClick={() => setRotation((r) => (r + 90) % 360)} className="rounded-lg border border-line px-2 py-1 text-[11px] hover:border-brand">+90°</button>
              </div>
            </div>

            {/* تعديلات الألوان */}
            <div className="space-y-2 rounded-xl bg-surface/60 p-2.5">
              <p className="text-[11px] font-bold text-ink-soft">{t("تعديلات", "Adjustments")}</p>
              <Slider label={t("السطوع", "Brightness")} min={50} max={150} step={1} value={bright} onChange={setBright} fmt={(v) => `${v}%`} />
              <Slider label={t("التباين", "Contrast")} min={50} max={150} step={1} value={contrast} onChange={setContrast} fmt={(v) => `${v}%`} />
              <Slider label={t("التشبّع", "Saturation")} min={0} max={200} step={1} value={sat} onChange={setSat} fmt={(v) => `${v}%`} />
            </div>

            {/* الأبعاد بالبكسل (تصغير عرض الإخراج) */}
            <div>
              <p className="mb-1.5 text-[11px] font-bold text-ink-soft">{t("عرض الإخراج (بكسل)", "Output width (px)")}</p>
              <div className="flex items-center gap-2">
                <input type="number" min={100} placeholder={nat ? String(Math.min(nat.w, 1600)) : "auto"} value={outW} onChange={(e) => setOutW(e.target.value === "" ? "" : Math.max(50, Number(e.target.value)))}
                  className="w-full rounded-lg border border-line bg-white px-2.5 py-1.5 text-sm text-ink outline-none focus:border-brand" />
                <span className="shrink-0 text-[11px] text-ink-soft">{t("اتركه فارغاً = بلا تصغير", "empty = keep")}</span>
              </div>
            </div>

            <button type="button" onClick={reset} className="text-[11px] font-semibold text-brand hover:underline">{t("إعادة ضبط الكل", "Reset all")}</button>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-line px-5 py-3">
          <button type="button" onClick={onCancel} className="rounded-xl px-4 py-2.5 text-sm font-semibold text-ink-soft hover:bg-surface">{t("إلغاء", "Cancel")}</button>
          <button type="button" onClick={confirm} disabled={busy || !url} className="rounded-xl bg-brand px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-dark disabled:opacity-60">
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
