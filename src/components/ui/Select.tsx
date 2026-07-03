"use client";

import { Fragment, useEffect, useId, useRef, useState } from "react";

export type SelectOption = { value: string; label: string; group?: string };

/**
 * منسدلة مخصّصة بستايل الهوية (بديل عن <select> الأصلي القبيح).
 * - تعمل داخل النماذج: ترسل قيمتها عبر <input type="hidden" name=...>
 * - متاحة للوحة المفاتيح (أسهم/Enter/Esc) وقارئات الشاشة (listbox/option)
 * - تدعم RTL تلقائياً (تتبع اتجاه الصفحة)
 */
export default function Select({
  name,
  options,
  value: controlledValue,
  defaultValue = "",
  onChange,
  placeholder = "اختر",
  required,
  id,
  invalid,
  className = "",
}: {
  name?: string;
  options: (string | SelectOption)[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  id?: string;
  invalid?: boolean;
  className?: string;
}) {
  const opts: SelectOption[] = options.map((o) => (typeof o === "string" ? { value: o, label: o } : o));
  const isControlled = controlledValue !== undefined;
  const [internal, setInternal] = useState(defaultValue);
  const value = isControlled ? controlledValue : internal;
  const selected = opts.find((o) => o.value === value);

  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1); // العنصر المُميَّز بالكيبورد
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const reactId = useId();
  const listId = `${id || name || reactId}-list`;

  const choose = (v: string) => {
    if (!isControlled) setInternal(v);
    onChange?.(v);
    setOpen(false);
  };

  // إغلاق عند النقر خارج المكوّن
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  // عند الفتح: ابدأ التمييز من العنصر المختار
  useEffect(() => {
    if (open) setActive(opts.findIndex((o) => o.value === value));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // إبقاء العنصر المُميَّز ظاهراً أثناء التمرير (بالمعرّف حتى لا تُخلّ رؤوس المجموعات بالفهرسة)
  useEffect(() => {
    if (!open || active < 0) return;
    document.getElementById(`${listId}-${active}`)?.scrollIntoView({ block: "nearest" });
  }, [active, open, listId]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setOpen(true);
      }
      return;
    }
    if (e.key === "Escape") { e.preventDefault(); setOpen(false); }
    else if (e.key === "ArrowDown") { e.preventDefault(); setActive((i) => Math.min(i + 1, opts.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((i) => Math.max(i - 1, 0)); }
    else if (e.key === "Home") { e.preventDefault(); setActive(0); }
    else if (e.key === "End") { e.preventDefault(); setActive(opts.length - 1); }
    else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (active >= 0) choose(opts[active].value);
    }
  };

  return (
    <div ref={rootRef} className="relative">
      {name && <input type="hidden" name={name} value={value} required={required} />}
      <button
        type="button"
        id={id}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={open && active >= 0 ? `${listId}-${active}` : undefined}
        aria-invalid={invalid || undefined}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={onKeyDown}
        className={`flex w-full items-center justify-between gap-2 rounded-xl border bg-white px-3 py-2.5 text-start text-sm transition-colors focus:outline-none focus:ring-2 ${
          invalid ? "border-red-400 ring-2 ring-red-100 focus:ring-red-200" : "border-line focus:ring-brand/30"
        } ${open ? "ring-2 ring-brand/30" : ""} ${className}`}
      >
        <span className={selected ? "text-ink" : "text-ink-soft"}>{selected ? selected.label : placeholder}</span>
        <svg
          width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          className={`shrink-0 text-ink-muted transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          className="absolute z-30 mt-1.5 max-h-60 w-full overflow-auto rounded-xl border border-line bg-white p-1 shadow-xl shadow-brand-deep/10 ring-1 ring-black/5 motion-safe:animate-[fadeIn_0.12s_ease]"
        >
          {opts.map((o, i) => {
            const isSel = o.value === value;
            const isActive = i === active;
            const showHeader = !!o.group && o.group !== opts[i - 1]?.group;
            return (
              <Fragment key={o.value}>
                {showHeader && (
                  <li role="presentation" className="sticky top-0 z-10 flex items-center gap-1.5 bg-white px-3 pb-1 pt-2 text-[11px] font-bold text-brand-dark first:pt-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand/60" />
                    {o.group}
                  </li>
                )}
                <li
                  id={`${listId}-${i}`}
                  role="option"
                  aria-selected={isSel}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => choose(o.value)}
                  className={`flex cursor-pointer items-center justify-between gap-2 rounded-lg py-2 pe-3 ps-4 text-start text-sm transition-colors ${
                    isActive ? "bg-brand/10 text-brand-deep" : "text-ink"
                  } ${isSel ? "font-semibold text-brand-dark" : ""}`}
                >
                  <span>{o.label}</span>
                  {isSel && (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="shrink-0 text-brand">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20 6L9 17l-5-5" />
                    </svg>
                  )}
                </li>
              </Fragment>
            );
          })}
        </ul>
      )}
    </div>
  );
}
