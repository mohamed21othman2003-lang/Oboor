"use client";

import { useState } from "react";
import Icon, { ICON_NAMES } from "./icons";
import type { Field, Bilingual } from "@/lib/admin/types";

type V = unknown;

export default function FieldInput({ field, value, lang, onChange }: { field: Field; value: V; lang: "ar" | "en"; onChange: (v: V) => void }) {
  const cls = "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/20";
  const label = (
    <label className="mb-1.5 flex items-center gap-2 text-xs font-bold text-slate-600">
      {field.label}
      {field.bilingual && <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold text-slate-400">{lang === "ar" ? "عربي" : "EN"}</span>}
      {field.help && <span className="font-normal text-slate-400">— {field.help}</span>}
    </label>
  );

  const bi = (value as Bilingual) || { ar: "", en: "" };
  const setBi = (v: string) => onChange({ ...bi, [lang]: v });

  if (field.type === "select") {
    return <div>{label}<select className={cls} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)}><option value="">— اختر —</option>{field.options?.map((o) => <option key={o} value={o}>{o}</option>)}</select></div>;
  }

  if (field.type === "boolean") {
    return (
      <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3.5 py-2.5">
        <span className="text-xs font-bold text-slate-600">{field.label}</span>
        <button type="button" onClick={() => onChange(!value)} className={`relative h-6 w-11 rounded-full transition-colors ${value ? "bg-brand" : "bg-slate-300"}`}>
          <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${value ? "left-0.5" : "right-0.5"}`} />
        </button>
      </div>
    );
  }

  if (field.type === "color") {
    return <div>{label}<div className="flex items-center gap-2"><input type="color" value={String(value || "#2cbcc8")} onChange={(e) => onChange(e.target.value)} className="h-10 w-12 shrink-0 cursor-pointer rounded-lg border border-slate-200" /><input className={cls} dir="ltr" value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} /></div></div>;
  }

  if (field.type === "icon") {
    return <div>{label}<IconPicker value={String(value ?? "")} onChange={onChange} /></div>;
  }

  if (field.type === "image") {
    return (
      <div>{label}
        <div className="flex items-center gap-3">
          <span className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
            {value ? <img src={String(value)} alt="" className="h-full w-full object-cover" /> : <span className="flex h-full w-full items-center justify-center text-slate-300"><Icon name="image" /></span>}
          </span>
          <input className={cls} dir="ltr" placeholder="مسار الصورة أو رابطها" value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} />
        </div>
      </div>
    );
  }

  if (field.type === "textarea" || field.type === "richtext") {
    return <div>{label}<textarea rows={field.type === "richtext" ? 5 : 3} className={cls} value={field.bilingual ? bi[lang] : String(value ?? "")} onChange={(e) => (field.bilingual ? setBi(e.target.value) : onChange(e.target.value))} /></div>;
  }

  if (field.type === "list") {
    const arr = (Array.isArray(value) ? value : []) as (string | Bilingual)[];
    const update = (i: number, v: string) => {
      const next = [...arr];
      next[i] = field.bilingual ? { ...((next[i] as Bilingual) || { ar: "", en: "" }), [lang]: v } : v;
      onChange(next);
    };
    const itemText = (it: string | Bilingual) => (field.bilingual ? (it as Bilingual)?.[lang] ?? "" : (it as string) ?? "");
    return (
      <div>{label}
        <div className="space-y-2">
          {arr.map((it, i) => (
            <div key={i} className="flex items-center gap-2">
              <input className={cls} dir={field.bilingual && lang === "en" ? "ltr" : undefined} value={itemText(it)} onChange={(e) => update(i, e.target.value)} />
              <button onClick={() => onChange(arr.filter((_, j) => j !== i))} className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-500"><Icon name="trash" size={16} /></button>
            </div>
          ))}
          <button onClick={() => onChange([...arr, field.bilingual ? { ar: "", en: "" } : ""])} className="flex items-center gap-1.5 rounded-lg border border-dashed border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-500 hover:border-brand hover:text-brand-dark"><Icon name="plus" size={14} /> إضافة عنصر</button>
        </div>
      </div>
    );
  }

  return <div>{label}<input type={field.type === "number" ? "number" : "text"} className={cls} dir={field.bilingual && lang === "en" ? "ltr" : undefined} value={field.bilingual ? bi[lang] : String(value ?? "")} onChange={(e) => (field.bilingual ? setBi(e.target.value) : onChange(e.target.value))} /></div>;
}

function IconPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button type="button" onClick={() => setOpen((o) => !o)} className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 hover:border-brand">
        <span className="flex items-center gap-2"><span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand/10 text-brand-dark"><Icon name={value || "grid"} size={16} /></span>{value || "اختر أيقونة"}</span>
        <Icon name="search" size={15} className="text-slate-400" />
      </button>
      {open && (
        <div className="absolute z-30 mt-1 grid max-h-56 w-full grid-cols-6 gap-1 overflow-y-auto rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
          {ICON_NAMES.map((n) => (
            <button key={n} type="button" title={n} onClick={() => { onChange(n); setOpen(false); }} className={`flex h-10 items-center justify-center rounded-lg transition-colors ${value === n ? "bg-brand text-white" : "text-slate-500 hover:bg-slate-100"}`}>
              <Icon name={n} size={18} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
