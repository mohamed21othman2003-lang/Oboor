import Icon from "@/components/admin/icons";

const MEDIA: { group: string; items: { src: string; label: string }[] }[] = [
  {
    group: "الهوية",
    items: [{ src: "/logo.png", label: "شعار المركز" }],
  },
  {
    group: "الصفحة الرئيسية",
    items: [
      { src: "/figma/home/imgImageWithFallback.jpg", label: "خلفية الهيرو" },
      { src: "/figma/home/imgImageWithFallback1.jpg", label: "صورة عن عبور 1" },
      { src: "/figma/home/imgImageWithFallback2.jpg", label: "صورة عن عبور 2" },
      { src: "/figma/home/imgImageWithFallback6.png", label: "المعرض — كبيرة" },
      { src: "/figma/home/imgImageWithFallback7.jpg", label: "المعرض 1" },
      { src: "/figma/home/imgImageWithFallback8.png", label: "المعرض 2" },
    ],
  },
  {
    group: "قصص النجاح",
    items: [
      { src: "/figma/success-stories/tameem.jpg", label: "تميم" },
      { src: "/figma/success-stories/fahd.jpg", label: "فهد" },
      { src: "/figma/success-stories/sara.jpg", label: "سارة" },
    ],
  },
  {
    group: "الأخصائيون والفروع",
    items: [
      { src: "/figma/specialists/team.jpg", label: "فريق الأخصائيين" },
      { src: "/figma/branches-map.png", label: "خريطة الفروع" },
    ],
  },
];

export default function MediaPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-800">مكتبة الوسائط</h1>
        <p className="mt-1 text-sm text-slate-500">كل الصور المستخدمة في الموقع. يمكنك استبدال أي صورة من خلال حقل الصورة في القسم الخاص بها.</p>
      </div>

      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10 text-brand-dark"><Icon name="image" /></span>
        <p className="mt-3 text-sm font-bold text-slate-700">رفع صورة جديدة</p>
        <p className="text-xs text-slate-400">(يُفعّل بعد ربط الباك-إند — حالياً تُدار الصور عبر المسارات)</p>
      </div>

      {MEDIA.map((g) => (
        <div key={g.group} className="mt-8">
          <h2 className="mb-3 text-sm font-bold text-slate-500">{g.group}</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {g.items.map((m) => (
              <div key={m.src} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <div className="relative h-32 w-full bg-slate-100">
                  <img src={m.src} alt={m.label} className="h-full w-full object-cover" />
                </div>
                <div className="p-3">
                  <p className="truncate text-xs font-bold text-slate-700">{m.label}</p>
                  <p dir="ltr" className="truncate text-[10px] text-slate-400">{m.src}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
