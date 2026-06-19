import Image from "next/image";
import { pick, type Locale } from "@/i18n/config";

const REGIONS = [
  { name: "الرياض", nameEn: "Riyadh", count: 12, color: "#2cbcc8" },
  { name: "مكة المكرمة", nameEn: "Makkah", count: 8, color: "#e67e22" },
  { name: "المنطقة الشرقية", nameEn: "Eastern Province", count: 8, color: "#3498db" },
  { name: "المدينة المنورة", nameEn: "Madinah", count: 4, color: "#9b59b6" },
  { name: "عسير", nameEn: "Asir", count: 4, color: "#27ae60" },
  { name: "جده", nameEn: "Jeddah", count: 3, color: "#ad78c4" },
  { name: "تبوك", nameEn: "Tabuk", count: 3, color: "#e74c3c" },
];

// نقاط تقريبية للفروع على الخريطة (نسبة مئوية)
const PINS = [
  { top: "22%", left: "38%", color: "#e74c3c" },
  { top: "26%", left: "43%", color: "#e74c3c" },
  { top: "30%", left: "30%", color: "#2cbcc8" },
  { top: "44%", left: "57%", color: "#2cbcc8" },
  { top: "55%", left: "55%", color: "#2cbcc8" },
  { top: "50%", left: "30%", color: "#9b59b6" },
  { top: "62%", left: "34%", color: "#27ae60" },
  { top: "70%", left: "30%", color: "#ad78c4" },
  { top: "40%", left: "44%", color: "#3498db" },
  { top: "18%", left: "60%", color: "#e67e22" },
];

function ZoomBtn({ children }: { children: React.ReactNode }) {
  return (
    <button className="flex h-9 w-9 items-center justify-center bg-white text-ink-muted transition-colors hover:bg-surface">
      {children}
    </button>
  );
}

export default function BranchMap({ locale }: { locale: Locale }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-line shadow-sm">
      <Image
        src="/figma/imgBasemapImage.png"
        alt={pick(locale, "خريطة فروع مركز عبور", "Map of Oboor Center branches")}
        width={1233}
        height={600}
        className="h-[520px] w-full object-cover"
      />

      {/* Pins */}
      {PINS.map((p, i) => (
        <span
          key={i}
          className="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-white"
          style={{ top: p.top, left: p.left, backgroundColor: p.color }}
        />
      ))}

      {/* Zoom controls (physical left) */}
      <div className="absolute left-4 top-4 flex flex-col overflow-hidden rounded-lg border border-line shadow-sm divide-y divide-line">
        <ZoomBtn>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="M11 8v6M8 11h6M20 20l-3-3" strokeLinecap="round" /></svg>
        </ZoomBtn>
        <ZoomBtn>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="M8 11h6M20 20l-3-3" strokeLinecap="round" /></svg>
        </ZoomBtn>
        <ZoomBtn>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M8 21H5a2 2 0 0 1-2-2v-3M16 21h3a2 2 0 0 0 2-2v-3" strokeLinecap="round" /></svg>
        </ZoomBtn>
      </div>

      {/* Region legend (physical right) */}
      <div className="absolute right-4 top-4 w-40 rounded-lg bg-white/95 p-3 shadow-md backdrop-blur">
        <p className="mb-2 text-start text-[11px] font-semibold text-ink-soft">{pick(locale, "المناطق", "Regions")}</p>
        <ul className="space-y-1.5">
          {REGIONS.map((r) => (
            <li key={r.name} className="flex items-center justify-between text-[11px] text-ink-muted">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: r.color }} />
              <span className="flex-1 px-2 text-start">{pick(locale, r.name, r.nameEn)}</span>
              <span className="font-semibold text-ink">{r.count}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 42 فرع badge (physical bottom-left) */}
      <div className="absolute bottom-4 left-4 rounded-[14px] bg-brand px-4 py-2 text-sm font-medium text-white shadow-lg">
        {pick(locale, "42 فرع", "42 branches")}
      </div>

      {/* Branch detail card */}
      <div className="absolute bottom-6 left-1/2 w-72 -translate-x-1/2 rounded-xl bg-white p-4 text-start shadow-xl">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-[#fde8e8] px-2 py-0.5 text-[10px] font-semibold text-[#c0392b]">{pick(locale, "● مغلق", "● Closed")}</span>
            <span className="rounded-full bg-[#ffe2e2] px-2 py-0.5 text-[10px] font-semibold text-[#e7000b]">{pick(locale, "جديد", "New")}</span>
          </div>
          <button aria-label={pick(locale, "إغلاق", "Close")} className="text-ink-soft hover:text-ink">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </div>
        <h4 className="mt-2 text-sm font-bold text-night">{pick(locale, "فرع النرجس", "Al-Narjis Branch")}</h4>

        <ul className="mt-3 space-y-2 text-[12px] text-ink-muted">
          <li className="flex items-start justify-start gap-2">
            <span className="leading-5">{pick(locale, "حي النرجس، طريق الأمير محمد بن سلمان، الرياض", "Al-Narjis District, Prince Mohammed bin Salman Road, Riyadh")}</span>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 shrink-0 text-brand"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
          </li>
          <li className="flex items-center justify-start gap-2">
            <span>{pick(locale, "الأحد – الخميس: ٨ص – ٨م", "Sunday – Thursday: 8 AM – 8 PM")}</span>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-brand"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" strokeLinecap="round" /></svg>
          </li>
          <li className="flex items-center justify-start gap-2">
            <span dir="ltr">0561000274</span>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-brand"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
          </li>
        </ul>

        <div className="mt-4 flex items-center gap-2">
          <button className="flex-1 rounded-lg bg-brand py-2 text-[12px] font-semibold text-white transition-colors hover:bg-brand-dark">
            {pick(locale, "عرض التفاصيل", "View Details")}
          </button>
          <button className="flex items-center gap-1 rounded-lg border border-line px-3 py-2 text-[12px] font-semibold text-ink-muted transition-colors hover:bg-surface">
            {pick(locale, "الاتجاهات", "Directions")}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17L17 7M17 7H8M17 7v9" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
