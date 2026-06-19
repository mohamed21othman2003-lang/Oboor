"use client";

import { useState } from "react";
import Icon from "./icons";
import FieldInput from "./AdminField";
import { useCollectionStore } from "./store";
import type { Collection, Entry, Bilingual, Field } from "@/lib/admin/types";

/* ---------- helpers ---------- */
const isBi = (v: unknown): v is Bilingual => typeof v === "object" && v !== null && "ar" in (v as object);

function asText(v: unknown): string {
  if (isBi(v)) return v.ar || v.en || "";
  if (Array.isArray(v)) return `${v.length} عنصر`;
  return v == null ? "" : String(v);
}

function blankValue(f: Field): Entry[string] {
  if (f.type === "list") return [];
  if (f.type === "boolean") return false;
  if (f.bilingual) return { ar: "", en: "" };
  return "";
}

function blankEntry(col: Collection): Entry {
  const e = { id: "new-" + Date.now() } as Entry;
  col.fields.forEach((f) => {
    e[f.key] = blankValue(f);
  });
  return e;
}

/* ---------- main ---------- */
export default function CollectionView({ collection }: { collection: Collection }) {
  const { entries, upsert, remove, reset } = useCollectionStore(collection.key, collection.seed);
  const [draft, setDraft] = useState<Entry | null>(null);
  const [lang, setLang] = useState<"ar" | "en">("ar");

  const titleOf = (e: Entry) => asText(e[collection.titleField]);
  const subOf = (e: Entry) => (collection.subtitleField ? asText(e[collection.subtitleField]) : "");
  const imgOf = (e: Entry) => (collection.imageField ? (e[collection.imageField] as string) : "");

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">{collection.label}</h1>
          <p className="mt-1 text-sm text-slate-500">{entries.length} {collection.singular}{entries.length > 1 ? " — أضف، عدّل، أو احذف" : ""}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={reset} className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-500 transition-colors hover:bg-slate-50">استعادة الافتراضي</button>
          <button onClick={() => { setDraft(blankEntry(collection)); setLang("ar"); }} className="flex items-center gap-2 rounded-xl bg-brand px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-brand-dark">
            <Icon name="plus" size={16} /> إضافة {collection.singular}
          </button>
        </div>
      </div>

      {/* List */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        {entries.length === 0 && <p className="p-10 text-center text-sm text-slate-400">لا يوجد محتوى بعد — اضغط «إضافة».</p>}
        {entries.map((e, i) => (
          <div key={e.id} className={`flex items-center gap-4 px-5 py-3.5 ${i !== entries.length - 1 ? "border-b border-slate-100" : ""}`}>
            {collection.imageField ? (
              <span className="h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                {imgOf(e) ? <img src={imgOf(e)} alt="" className="h-full w-full object-cover" /> : <span className="flex h-full w-full items-center justify-center text-slate-300"><Icon name="image" size={18} /></span>}
              </span>
            ) : (
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand-dark"><Icon name={collection.icon} size={18} /></span>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-slate-800">{titleOf(e) || "—"}</p>
              {subOf(e) && <p className="truncate text-xs text-slate-400">{subOf(e)}</p>}
            </div>
            <button onClick={() => { setDraft(structuredClone(e)); setLang("ar"); }} className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-brand/10 hover:text-brand-dark" aria-label="تعديل"><Icon name="edit" size={17} /></button>
            <button onClick={() => { if (confirm(`حذف «${titleOf(e)}»؟`)) remove(e.id); }} className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500" aria-label="حذف"><Icon name="trash" size={17} /></button>
          </div>
        ))}
      </div>

      {/* Editor drawer */}
      {draft && (
        <EntryEditor
          collection={collection}
          draft={draft}
          lang={lang}
          setLang={setLang}
          onChange={setDraft}
          onClose={() => setDraft(null)}
          onSave={() => { upsert(draft); setDraft(null); }}
        />
      )}
    </div>
  );
}

/* ---------- editor ---------- */
function EntryEditor({
  collection, draft, lang, setLang, onChange, onClose, onSave,
}: {
  collection: Collection; draft: Entry; lang: "ar" | "en";
  setLang: (l: "ar" | "en") => void; onChange: (e: Entry) => void; onClose: () => void; onSave: () => void;
}) {
  const set = (key: string, value: unknown) => onChange({ ...draft, [key]: value as Entry[string] });

  return (
    <div className="fixed inset-0 z-50 flex justify-start bg-black/40" onClick={onClose}>
      <div className="flex h-full w-full max-w-2xl flex-col bg-slate-50 shadow-2xl" onClick={(ev) => ev.stopPropagation()}>
        {/* header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
          <h2 className="text-lg font-extrabold text-slate-800">{String(draft.id).startsWith("new-") ? `إضافة ${collection.singular}` : `تعديل ${collection.singular}`}</h2>
          <button onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"><Icon name="close" size={18} /></button>
        </div>

        {/* lang tabs */}
        <div className="flex gap-1 border-b border-slate-200 bg-white px-6">
          {(["ar", "en"] as const).map((l) => (
            <button key={l} onClick={() => setLang(l)} className={`-mb-px border-b-2 px-4 py-2.5 text-sm font-bold transition-colors ${lang === l ? "border-brand text-brand-dark" : "border-transparent text-slate-400 hover:text-slate-600"}`}>
              {l === "ar" ? "العربية" : "English"}
            </button>
          ))}
        </div>

        {/* fields */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-2 gap-4">
            {collection.fields.map((f) => (
              <div key={f.key} className={f.colSpan === 2 || f.type === "list" || f.type === "textarea" || f.type === "richtext" ? "col-span-2" : "col-span-2 sm:col-span-1"}>
                <FieldInput field={f} value={draft[f.key]} lang={lang} onChange={(v) => set(f.key, v)} />
              </div>
            ))}
          </div>
        </div>

        {/* footer */}
        <div className="flex items-center justify-between border-t border-slate-200 bg-white px-6 py-4">
          <button onClick={onClose} className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-500 hover:bg-slate-50">إلغاء</button>
          <button onClick={onSave} className="flex items-center gap-2 rounded-xl bg-brand px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-brand-dark"><Icon name="save" size={16} /> حفظ</button>
        </div>
      </div>
    </div>
  );
}

