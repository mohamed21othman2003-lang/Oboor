"use client";

import { useEffect, useState } from "react";

// أبعاد جاهزة تطابق أشكال الإطارات في صفحات الموقع
const ASPECTS: { key: string; label: string; v: number }[] = [
  { key: "free", label: "الأصلية (بدون قص)", v: 0 },
  { key: "wide", label: "عريض 16:9", v: 16 / 9 },
  { key: "landscape", label: "أفقي 4:3", v: 4 / 3 },
  { key: "square", label: "مربّع 1:1", v: 1 },
  { key: "portrait", label: "طولي 3:4", v: 3 / 4 },
];

// مواضع التركيز (الجزء الذي يبقى ظاهراً عند القص)
const FOCALS: { fx: number; fy: number; label: string }[] = [
  { fx: 0, fy: 0, label: "أعلى يمين" }, { fx: 0.5, fy: 0, label: "أعلى" }, { fx: 1, fy: 0, label: "أعلى يسار" },
  { fx: 0, fy: 0.5, label: "يمين" }, { fx: 0.5, fy: 0.5, label: "الوسط" }, { fx: 1, fy: 0.5, label: "يسار" },
  { fx: 0, fy: 1, label: "أسفل يمين" }, { fx: 0.5, fy: 1, label: "أسفل" }, { fx: 1, fy: 1, label: "أسفل يسار" },
];

export default function ImageCropModal({
  file,
  defaultAspect = 0,
  onCancel,
  onConfirm,
}: {
  file: File;
  defaultAspect?: number;
  onCancel: () => void;
  onConfirm: (out: Blob | File) => void;
}) {
  const [url, setUrl] = useState("");
  const [nat, setNat] = useState<{ w: number; h: number } | null>(null);
  const [aspect, setAspect] = useState(defaultAspect);
  const [focal, setFocal] = useState({ fx: 0.5, fy: 0.5 });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const u = URL.createObjectURL(file);
    setUrl(u);
    const im = new window.Image();
    im.onload = () => setNat({ w: im.naturalWidth, h: im.naturalHeight });
    im.src = u;
    return () => URL.revokeObjectURL(u);
  }, [file]);

  async function confirm() {
    // بدون قص → ارفع الملف الأصلي كما هو
    if (!aspect || !nat) { onConfirm(file); return; }
    setBusy(true);
    try {
      const im = new window.Image();
      im.src = url;
      await im.decode();
      const { w: nw, h: nh } = nat;
      const imgAspect = nw / nh;
      let sw: number, sh: number, sx: number, sy: number;
      if (imgAspect > aspect) { sh = nh; sw = nh * aspect; sx = (nw - sw) * focal.fx; sy = 0; }
      else { sw = nw; sh = nw / aspect; sx = 0; sy = (nh - sh) * focal.fy; }
      const outW = Math.min(1600, Math.round(sw));
      const outH = Math.round(outW / aspect);
      const canvas = document.createElement("canvas");
      canvas.width = outW; canvas.height = outH;
      const ctx = canvas.getContext("2d");
      if (!ctx) { onConfirm(file); return; }
      ctx.drawImage(im, sx, sy, sw, sh, 0, 0, outW, outH);
      canvas.toBlob((blob) => { onConfirm(blob ?? file); }, "image/jpeg", 0.9);
    } catch {
      onConfirm(file);
    } finally {
      setBusy(false);
    }
  }

  const objPos = `${focal.fx * 100}% ${focal.fy * 100}%`;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4" onClick={onCancel}>
      <div dir="rtl" className="max-h-[90vh] w-full max-w-2xl overflow-auto rounded-2xl bg-white p-5 shadow-2xl sm:p-6" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-extrabold text-ink">معاينة الصورة وضبطها</h3>
          <button type="button" onClick={onCancel} className="rounded-lg p-1.5 text-ink-soft hover:bg-surface" aria-label="إغلاق">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>
        </div>

        {/* المعاينة */}
        <div className="flex justify-center rounded-xl bg-surface p-4">
          <div
            className="relative max-h-[46vh] overflow-hidden rounded-lg ring-1 ring-line"
            style={aspect ? { aspectRatio: String(aspect), width: aspect >= 1 ? "min(100%, 520px)" : "auto", height: aspect >= 1 ? "auto" : "46vh" } : {}}
          >
            {url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={url}
                alt=""
                className={aspect ? "h-full w-full object-cover" : "max-h-[46vh] w-auto"}
                style={aspect ? { objectPosition: objPos } : {}}
              />
            )}
          </div>
        </div>

        {/* اختيار الأبعاد */}
        <div className="mt-5">
          <p className="mb-2 text-xs font-bold text-ink-soft">الأبعاد (اختر ما يناسب مكان الصورة في الصفحة)</p>
          <div className="flex flex-wrap gap-2">
            {ASPECTS.map((a) => (
              <button key={a.key} type="button" onClick={() => setAspect(a.v)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold ring-1 transition-colors ${aspect === a.v ? "bg-brand text-white ring-brand" : "bg-white text-ink-soft ring-line hover:ring-brand/40"}`}>
                {a.label}
              </button>
            ))}
          </div>
        </div>

        {/* تحديد الجزء الظاهر (يظهر فقط عند القص) */}
        {!!aspect && (
          <div className="mt-5">
            <p className="mb-2 text-xs font-bold text-ink-soft">الجزء الذي يبقى ظاهراً</p>
            <div className="grid w-28 grid-cols-3 gap-1">
              {FOCALS.map((p) => {
                const on = focal.fx === p.fx && focal.fy === p.fy;
                return (
                  <button key={p.label} type="button" title={p.label} onClick={() => setFocal({ fx: p.fx, fy: p.fy })}
                    className={`h-8 rounded transition-colors ${on ? "bg-brand" : "bg-surface ring-1 ring-line hover:bg-brand/20"}`} />
                );
              })}
            </div>
          </div>
        )}

        {/* أزرار */}
        <div className="mt-6 flex items-center justify-end gap-2 border-t border-line pt-4">
          <button type="button" onClick={onCancel} className="rounded-xl px-4 py-2.5 text-sm font-semibold text-ink-soft hover:bg-surface">إلغاء</button>
          <button type="button" onClick={confirm} disabled={busy} className="rounded-xl bg-brand px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-dark disabled:opacity-60">
            {busy ? "جارٍ التجهيز…" : "اعتماد الصورة"}
          </button>
        </div>
      </div>
    </div>
  );
}
