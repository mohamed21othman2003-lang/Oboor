import { NextResponse } from "next/server";
import { addSubmission } from "@/lib/server/store";
import { forwardJson } from "@/lib/server/django";

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const data = Object.fromEntries([...form.entries()].map(([k, v]) => [k, String(v)]));
    // الفرع إجباري ليعرف الأدمن مصدر كل رسالة (حارس خادمي نهائي)
    if (!data.name || !data.phone || !String(data.branch || "").trim()) {
      return NextResponse.json({ ok: false, error: "الاسم ورقم الجوال والفرع مطلوبة" }, { status: 400 });
    }
    const outcome = await forwardJson("contact", {
      name: data.name, phone: data.phone, email: data.email || "",
      branch: data.branch || "", type: data.type || "", message: data.message || "",
    });
    if (outcome === "duplicate") return NextResponse.json({ ok: false, duplicate: true, error: "تم إرسال هذا الطلب مسبقاً بالفعل." }, { status: 409 });
    if (outcome === "ok") return NextResponse.json({ ok: true });
    const entry = await addSubmission("contact", data);
    return NextResponse.json({ ok: true, id: entry.id });
  } catch {
    return NextResponse.json({ ok: false, error: "خطأ في الخادم" }, { status: 500 });
  }
}
