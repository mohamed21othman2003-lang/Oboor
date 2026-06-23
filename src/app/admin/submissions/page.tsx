import { getSubmissions } from "@/lib/server/store";
import Icon from "@/components/admin/icons";

export const dynamic = "force-dynamic";

const LABELS: Record<string, string> = {
  name: "الاسم", phone: "الجوال", branch: "الفرع", type: "النوع", message: "الرسالة",
  childName: "اسم الطفل", childAge: "العمر", age: "العمر", gender: "الجنس", city: "المدينة",
  parentName: "ولي الأمر", email: "البريد", caseType: "الحالة", "prev-sessions": "جلسات سابقة", notes: "ملاحظات",
  assessment: "نوع التقييم", level: "مستوى الحالة", score: "الدرجة",
  job: "الوظيفة", currentRole: "المسمى الحالي", experience: "الخبرة", about: "نبذة",
};

// حقول لا نعرضها في الشبكة (تُعرض بشكل خاص أو مخفية)
const HIDDEN = ["id", "createdAt", "answers", "assessmentSlug", "cvId", "cvName"];
const LEVEL_AR: Record<string, string> = { high: "مرتفع", medium: "متوسط", low: "منخفض" };

function fmtDate(iso: string) {
  try { return new Date(iso).toLocaleString("ar-EG", { dateStyle: "medium", timeStyle: "short" }); } catch { return iso; }
}

export default async function SubmissionsPage() {
  const [contact, admission, assessment, career] = await Promise.all([
    getSubmissions("contact"), getSubmissions("admission"), getSubmissions("assessment"), getSubmissions("career"),
  ]);

  const Block = ({ title, icon, items }: { title: string; icon: string; items: Awaited<ReturnType<typeof getSubmissions>> }) => (
    <div className="mb-10">
      <h2 className="mb-4 flex items-center gap-2 text-lg font-extrabold text-slate-800">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand/10 text-brand-dark"><Icon name={icon} size={18} /></span>
        {title}
        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-500">{items.length}</span>
      </h2>
      {items.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-400">لا توجد طلبات بعد.</p>
      ) : (
        <div className="space-y-3">
          {items.map((s) => (
            <div key={s.id} className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="mb-3 flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-bold text-brand-dark">#{s.id.slice(-6)}</span>
                <span className="text-xs text-slate-400">{fmtDate(s.createdAt)}</span>
              </div>
              <div className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
                {Object.entries(s).filter(([k]) => !HIDDEN.includes(k)).map(([k, v]) => (
                  <div key={k} className="text-sm">
                    <span className="font-semibold text-slate-500">{LABELS[k] || k}: </span>
                    <span className="text-slate-800">{k === "level" ? (LEVEL_AR[String(v)] || String(v)) : (String(v) || "—")}</span>
                  </div>
                ))}
              </div>
              {typeof s.cvId === "string" && s.cvId && (
                <a href={`/api/career/cv/${s.cvId}`} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-brand/10 px-3 py-1.5 text-xs font-bold text-brand-dark hover:bg-brand/20">
                  <Icon name="image" size={14} /> {String(s.cvName) || "السيرة الذاتية"}
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-800">الطلبات والرسائل</h1>
        <p className="mt-1 text-sm text-slate-500">كل ما يصلك من نموذج «طلب الالتحاق» و«تواصل معنا» يظهر هنا مباشرةً.</p>
      </div>
      <Block title="طلبات الالتحاق" icon="clipboard" items={admission} />
      <Block title="نتائج التقييم" icon="check-circle" items={assessment} />
      <Block title="طلبات التوظيف" icon="users" items={career} />
      <Block title="رسائل التواصل" icon="phone" items={contact} />
    </div>
  );
}
