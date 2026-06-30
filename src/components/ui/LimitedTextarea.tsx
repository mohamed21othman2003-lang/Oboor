"use client";

import { useState } from "react";

// منطقة نص بحدّ أقصى للحروف + عدّاد مباشر (للرسائل/الملاحظات في النماذج)
export default function LimitedTextarea({
  id,
  name,
  placeholder,
  required,
  rows = 4,
  maxLength = 500,
  className = "",
  dir,
  defaultValue = "",
}: {
  id?: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  rows?: number;
  maxLength?: number;
  className?: string;
  dir?: string;
  defaultValue?: string;
}) {
  const [count, setCount] = useState(defaultValue.length);
  const ratio = count / maxLength;
  const color = count >= maxLength ? "text-red-500" : ratio >= 0.9 ? "text-amber-600" : "text-ink-soft";
  return (
    <div>
      <textarea
        id={id}
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        rows={rows}
        maxLength={maxLength}
        dir={dir}
        onChange={(e) => setCount(e.currentTarget.value.length)}
        className={className}
      />
      <div className={`mt-1 text-end text-[11px] ${color}`} dir="ltr">{count} / {maxLength}</div>
    </div>
  );
}
