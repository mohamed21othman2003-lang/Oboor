"use client";

import { useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import type { Map as LeafletMapType, CircleMarker as LeafletCircleMarker } from "leaflet";
import "leaflet/dist/leaflet.css";
import Link from "next/link";
import { pick, type Locale } from "@/i18n/config";
import type { Branch } from "@/lib/branchesData";

type Region = { name: string; count: number; color: string };

// إحداثيات تقريبية لمراكز المناطق (lat, lng)
const COORDS: Record<string, [number, number]> = {
  "الرياض": [24.7136, 46.6753],
  "مكة المكرمة": [21.3891, 39.8579],
  "المنطقة الشرقية": [26.2999, 50.2083],
  "المدينة المنورة": [24.5247, 39.5692],
  "عسير": [18.2465, 42.5117],
  "جدة": [21.4858, 39.1925],
  "تبوك": [28.3838, 36.555],
};

const norm = (s: string) => (s || "").replace(/جده/g, "جدة").replace(/المنطقة|المكرمة|المنورة/g, "").trim();

export default function LeafletMap({ locale, branches, regions }: { locale: Locale; branches: Branch[]; regions: Region[] }) {
  const [map, setMap] = useState<LeafletMapType | null>(null);
  const markerRefs = useRef<Record<string, LeafletCircleMarker | null>>({});

  const branchOf = useMemo(() => {
    return (regionName: string) => {
      const key = norm(regionName);
      return branches.find((b) => norm(`${b.region} ${b.city} ${b.area}`).includes(key) || key.includes(norm(b.city)));
    };
  }, [branches]);

  // الضغط على المنطقة في الـlegend: يطيّر للمكان ويفتح كارد الفرع
  const selectRegion = (name: string) => {
    const c = COORDS[name];
    const marker = markerRefs.current[name];
    if (map && c) map.flyTo(c, 9, { duration: 1.2 });
    if (marker) marker.openPopup();
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-line shadow-sm">
      <MapContainer ref={setMap} center={[24.5, 45]} zoom={5} scrollWheelZoom className="z-0 h-[520px] w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {regions.map((r) => {
          const c = COORDS[r.name];
          if (!c) return null;
          const b = branchOf(r.name);
          return (
            <CircleMarker
              key={r.name}
              center={c}
              radius={9}
              pathOptions={{ color: "#fff", weight: 2, fillColor: r.color, fillOpacity: 1 }}
              ref={(m) => { markerRefs.current[r.name] = m; }}
            >
              <Popup>
                <div className="min-w-[200px] text-start" dir={locale === "en" ? "ltr" : "rtl"}>
                  <span className="mb-1 inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold" style={{ background: `${r.color}1a`, color: r.color }}>
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: r.color }} />
                    {r.name}
                  </span>
                  {b ? (
                    <>
                      <p className="text-sm font-bold text-ink">{b.name}</p>
                      <p className="mt-0.5 text-xs leading-5 text-ink-muted">{b.address}</p>
                      <p className="mt-1 text-xs text-ink-soft">{b.hours}</p>
                      <p className="mt-0.5 text-xs text-ink-soft" dir="ltr">{b.phone}</p>
                      <Link href={`/branches/${b.slug}`} className="mt-2 inline-block rounded-lg bg-brand px-3 py-1.5 text-xs font-semibold text-white">{pick(locale, "عرض التفاصيل", "View Details")}</Link>
                    </>
                  ) : (
                    <>
                      <p className="text-sm font-bold text-ink">{pick(locale, `منطقة ${r.name}`, r.name)}</p>
                      <p className="mt-0.5 text-xs text-ink-muted">{pick(locale, `لدينا ${r.count} فرع في هذه المنطقة.`, `${r.count} branches in this region.`)}</p>
                    </>
                  )}
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>

      {/* Legend overlay — click flies to the region AND opens its card */}
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

      <span className="absolute bottom-4 left-4 z-[1000] rounded-lg bg-brand px-3 py-1.5 text-xs font-bold text-white shadow">{pick(locale, "42 فرع", "42 Branches")}</span>
    </div>
  );
}
