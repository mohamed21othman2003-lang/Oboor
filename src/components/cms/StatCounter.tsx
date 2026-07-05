"use client";

/* بطاقة إحصائية قابلة للضغط للفلترة السريعة — مُوحّدة عبر جداول الطلبات في الـCMS
   (رسائل التواصل، طلبات الالتحاق، طلبات التوظيف). */
export default function StatCounter({
  icon, value, label, onClick, active, hint,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
  onClick?: () => void;
  active?: boolean;
  hint?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex items-center gap-3 rounded-2xl border bg-white px-4 py-3 text-start shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${active ? "border-[#1FA6A8] ring-1 ring-[#1FA6A8]/40" : "border-line hover:border-[#1FA6A8]/40"}`}
    >
      <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${active ? "bg-[#1FA6A8] text-white" : "bg-[#1FA6A8]/10 text-[#0F6C73]"}`}>{icon}</span>
      <div className="min-w-0 flex-1">
        <p className="text-xl font-extrabold text-ink">{value}</p>
        <p className="text-xs text-ink-soft">{label}</p>
      </div>
      {hint && <span className={`shrink-0 text-[10px] font-semibold ${active ? "text-[#1FA6A8]" : "text-ink-soft/60 group-hover:text-[#1FA6A8]"}`}>{hint}</span>}
    </button>
  );
}
