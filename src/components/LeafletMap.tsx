"use client";

import { useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, AttributionControl } from "react-leaflet";
import type { Map as LeafletMapType, CircleMarker as LeafletCircleMarker } from "leaflet";
import "leaflet/dist/leaflet.css";
import { useRouter } from "next/navigation";
import { pick, type Locale } from "@/i18n/config";
import type { Branch } from "@/lib/branchesData";

type Region = { name: string; count: number; color: string };

// مراكز المناطق (احتياطي للفروع التي لم تُضبط إحداثياتها بعد)
const COORDS: Record<string, [number, number]> = {
  "الرياض": [24.7136, 46.6753],
  "مكة المكرمة": [21.3891, 39.8579],
  "الشرقية": [26.2999, 50.2083],
  "المنطقة الشرقية": [26.2999, 50.2083],
  "المدينة المنورة": [24.5247, 39.5692],
  "عسير": [18.2465, 42.5117],
  "القصيم": [26.3260, 43.9750],
  "جازان": [16.8892, 42.5511],
  "الجوف": [29.9697, 40.2064],
  "جدة": [21.4858, 39.1925],
  "تبوك": [28.3838, 36.555],
};

const norm = (s: string) => (s || "").replace(/جده/g, "جدة").replace(/المنطقة|المكرمة|المنورة/g, "").trim();
const BRAND = "#2cbcc8";

export default function LeafletMap({ locale, branches, regions }: { locale: Locale; branches: Branch[]; regions: Region[] }) {
  const router = useRouter();
  const [map, setMap] = useState<LeafletMapType | null>(null);
  const markerRefs = useRef<Record<string, LeafletCircleMarker | null>>({});

  const colorOf = useMemo(() => {
    return (b: Branch) => {
      const key = norm(`${b.region} ${b.city}`);
      const r = regions.find((x) => key.includes(norm(x.name)) || norm(x.name).includes(norm(b.region)));
      return r?.color || BRAND;
    };
  }, [regions]);

  const regionCenter = (b: Branch): [number, number] | null => {
    for (const name of Object.keys(COORDS)) {
      if (norm(`${b.region} ${b.city} ${b.area}`).includes(norm(name))) return COORDS[name];
    }
    return COORDS[b.region as keyof typeof COORDS] || null;
  };

  // موضع كل فرع: إحداثياته الدقيقة إن وُجدت، وإلا مركز المنطقة مع إزاحة بسيطة لتجنّب التكدّس
  const placed = useMemo(() => {
    const perRegionCount: Record<string, number> = {};
    return branches.map((b) => {
      let pos: [number, number] | null = null;
      if (typeof b.lat === "number" && typeof b.lng === "number") {
        pos = [b.lat, b.lng];
      } else {
        const c = regionCenter(b);
        if (c) {
          const key = `${c[0]},${c[1]}`;
          const n = perRegionCount[key] = (perRegionCount[key] || 0) + 1;
          const ang = n * 1.2;
          pos = [c[0] + Math.sin(ang) * 0.06 * n, c[1] + Math.cos(ang) * 0.06 * n];
        }
      }
      return { b, pos };
    }).filter((x) => x.pos);
  }, [branches]); // eslint-disable-line react-hooks/exhaustive-deps

  const selectRegion = (name: string) => {
    const c = COORDS[name];
    if (map && c) map.flyTo(c, 9, { duration: 1.2 });
    const hit = placed.find((p) => norm(`${p.b.region} ${p.b.city}`).includes(norm(name)));
    if (hit) markerRefs.current[hit.b.slug]?.openPopup();
  };

  const dirUrl = (b: Branch) =>
    b.mapUrl
      ? b.mapUrl
      : typeof b.lat === "number" && typeof b.lng === "number"
      ? `https://www.google.com/maps/dir/?api=1&destination=${b.lat},${b.lng}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([b.address, b.city, "السعودية"].filter(Boolean).join("، "))}`;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-line shadow-sm">
      <MapContainer ref={setMap} center={[24.5, 45]} zoom={5} scrollWheelZoom attributionControl={false} className="z-0 h-[520px] w-full">
        {/* حقوق OpenStreetMap فقط (إلزامية) — بدون شعار Leaflet وعلمه */}
        <AttributionControl prefix={false} position="bottomright" />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {placed.map(({ b, pos }) => {
          const color = colorOf(b);
          return (
            <CircleMarker
              key={b.slug}
              center={pos as [number, number]}
              radius={8}
              pathOptions={{ color: "#fff", weight: 2, fillColor: color, fillOpacity: 1 }}
              ref={(m) => { markerRefs.current[b.slug] = m; }}
            >
              <Popup className="oboor-popup" closeButton={false}>
                <div className="w-[260px] max-w-[78vw] p-4 text-start" dir={locale === "en" ? "ltr" : "rtl"}>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      {b.isNew && <span className="rounded-md bg-brand/10 px-2 py-0.5 text-[10px] font-bold text-brand">{pick(locale, "جديد", "New")}</span>}
                      <span className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold" style={{ background: `${color}1a`, color }}>
                        <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
                        {b.region || b.city}
                      </span>
                    </div>
                    <button type="button" onClick={() => map?.closePopup()} className="text-ink-soft transition-colors hover:text-ink" aria-label={pick(locale, "إغلاق", "Close")}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
                    </button>
                  </div>
                  <p className="mt-2 text-sm font-bold text-ink">{b.name}</p>
                  <p className="mt-1 flex items-start gap-1.5 text-xs leading-5 text-ink-muted"><PinIcon />{b.address}</p>
                  {b.hours && <p className="mt-1 flex items-center gap-1.5 text-xs text-ink-soft"><ClockIcon />{b.hours}</p>}
                  {b.phone && <p className="mt-0.5 flex items-center gap-1.5 text-xs text-ink-soft" dir="ltr"><PhoneIcon />{b.phone}</p>}
                  <div className="mt-3 flex gap-2">
                    <button type="button" onClick={() => router.push(`/branches/${b.slug}`)} className="flex-1 rounded-lg bg-brand py-2 text-center text-xs font-semibold text-white transition-colors hover:bg-brand-dark">
                      {pick(locale, "عرض التفاصيل", "View Details")}
                    </button>
                    <a href={dirUrl(b)} target="_blank" rel="noopener" className="flex items-center justify-center gap-1 rounded-lg border border-brand px-3 py-2 text-center text-xs font-semibold text-brand transition-colors hover:bg-brand hover:text-white">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11l19-9-9 19-2-8-8-2z" /></svg>
                      {pick(locale, "الاتجاهات", "Directions")}
                    </a>
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>

      {/* Legend overlay */}
      <div className="absolute right-4 top-4 z-[1000] hidden w-48 rounded-xl bg-white/95 p-3 shadow-lg backdrop-blur sm:block">
        <p className="mb-2 border-b border-line pb-1.5 text-start text-xs font-bold text-ink">{pick(locale, "المناطق", "Regions")}</p>
        <ul className="space-y-0.5">
          {regions.map((r) => (
            <li key={r.name}>
              <button
                type="button"
                onClick={() => selectRegion(r.name)}
                className="flex w-full items-center justify-between rounded-lg px-2 py-1 text-[11px] transition-colors hover:bg-surface"
              >
                <span className="text-ink-soft">{r.count}</span>
                <span className="flex items-center gap-1.5 text-ink-muted">
                  {r.name}
                  <span className="h-2 w-2 rounded-full" style={{ background: r.color }} />
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <span className="absolute bottom-4 left-4 z-[1000] rounded-lg bg-brand px-3 py-1.5 text-xs font-bold text-white shadow">{pick(locale, `${branches.length} فرع`, `${branches.length} Branches`)}</span>
    </div>
  );
}

function PinIcon() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0 text-brand"><path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>;
}
function ClockIcon() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-brand"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" strokeLinecap="round" /></svg>;
}
function PhoneIcon() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-brand"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" /></svg>;
}
