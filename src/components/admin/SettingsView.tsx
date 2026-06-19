"use client";

import { useState } from "react";
import { SETTINGS } from "@/lib/admin/settings";
import { useSettingsStore } from "./store";
import Icon from "./icons";
import FieldInput from "./AdminField";

type AllSettings = Record<string, Record<string, Record<string, unknown>>>;

function buildInitial(): AllSettings {
  const out: AllSettings = {};
  for (const g of SETTINGS) {
    out[g.key] = {};
    for (const s of g.sections) out[g.key][s.key] = structuredClone(s.value);
  }
  return out;
}

export default function SettingsView() {
  const { value, persist, loaded } = useSettingsStore("all", buildInitial());
  const data = value as AllSettings;
  const [active, setActive] = useState(SETTINGS[0].key);
  const [lang, setLang] = useState<"ar" | "en">("ar");
  const [savedAt, setSavedAt] = useState<string | null>(null);

  const group = SETTINGS.find((g) => g.key === active)!;

  const setField = (sectionKey: string, fieldKey: string, v: unknown) => {
    const next = structuredClone(data);
    if (!next[active]) next[active] = {};
    if (!next[active][sectionKey]) next[active][sectionKey] = {};
    next[active][sectionKey][fieldKey] = v;
    persist(next);
  };

  const save = () => { persist(structuredClone(data)); setSavedAt(new Date().toLocaleTimeString("ar-EG")); };

  if (!loaded) return null;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">الإعدادات العامة</h1>
          <p className="mt-1 text-sm text-slate-500">القائمة، التذييل، بيانات التواصل، الصفحة الرئيسية، و SEO.</p>
        </div>
        <div className="flex items-center gap-3">
          {savedAt && <span className="text-xs font-semibold text-green-600">✓ حُفظ {savedAt}</span>}
          <div className="flex gap-1 rounded-xl bg-slate-100 p-1">
            {(["ar", "en"] as const).map((l) => (
              <button key={l} onClick={() => setLang(l)} className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${lang === l ? "bg-white text-brand-dark shadow-sm" : "text-slate-500"}`}>{l === "ar" ? "العربية" : "English"}</button>
            ))}
          </div>
          <button onClick={save} className="flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-dark"><Icon name="save" size={16} /> حفظ</button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        {/* group tabs (grouped by category) */}
        <div className="space-y-4">
          {(["pages", "global"] as const).map((cat) => (
            <div key={cat}>
              <p className="px-2 pb-1.5 text-[11px] font-bold text-slate-400">{cat === "pages" ? "الصفحات" : "عام"}</p>
              <div className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
                {SETTINGS.filter((g) => g.category === cat).map((g) => (
                  <button key={g.key} onClick={() => setActive(g.key)} className={`flex shrink-0 items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${active === g.key ? "bg-brand text-white" : "bg-white text-slate-600 hover:bg-slate-50"}`}>
                    <Icon name={g.icon} size={17} /> {g.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* sections */}
        <div className="space-y-5">
          {group.sections.map((section) => (
            <div key={section.key} className="rounded-2xl border border-slate-200 bg-white p-6">
              <h3 className="mb-4 text-sm font-extrabold text-slate-700">{section.label}</h3>
              <div className="grid grid-cols-2 gap-4">
                {section.fields.map((f) => (
                  <div key={f.key} className={f.colSpan === 2 || f.type === "textarea" || f.type === "richtext" || f.type === "list" ? "col-span-2" : "col-span-2 sm:col-span-1"}>
                    <FieldInput field={f} value={data[active]?.[section.key]?.[f.key]} lang={lang} onChange={(v) => setField(section.key, f.key, v)} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

