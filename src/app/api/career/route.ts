import { NextResponse } from "next/server";
import { addSubmission, saveFile } from "@/lib/server/store";
import { DJANGO_API_URL, forwardForm } from "@/lib/server/django";

export const runtime = "nodejs";
const MAX = 10 * 1024 * 1024; // 10 MB
const CV_EXT = [".pdf", ".doc", ".docx"]; // صيغ السيرة الذاتية المسموحة

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const get = (k: string) => String(form.get(k) || "");
    const name = get("name");
    const phone = get("phone");
    if (!name || !phone) {
      return NextResponse.json({ ok: false, error: "الاسم ورقم الجوال مطلوبان" }, { status: 400 });
    }
    // تحقّق مبكّر من ملف السيرة الذاتية (يسري على كل المسارات: التوجيه والتخزين الاحتياطي)
    const cvFile = form.get("cv");
    if (cvFile && cvFile instanceof File && cvFile.size > 0) {
      const nameLower = cvFile.name.toLowerCase();
      if (!CV_EXT.some((e) => nameLower.endsWith(e))) {
        return NextResponse.json({ ok: false, error: "صيغة الملف غير مدعومة — المسموح: PDF أو DOC أو DOCX" }, { status: 400 });
      }
      if (cvFile.size > MAX) {
        return NextResponse.json({ ok: false, error: "حجم الملف أكبر من 10 ميغابايت" }, { status: 400 });
      }
    }

    // forward to Django when configured (maps currentRole -> current_role, includes the CV file)
    if (DJANGO_API_URL) {
      const fd = new FormData();
      fd.set("job", get("job")); fd.set("name", name); fd.set("phone", phone);
      fd.set("email", get("email")); fd.set("city", get("city"));
      fd.set("current_role", get("currentRole")); fd.set("experience", get("experience"));
      fd.set("about", get("about"));
      const cv = form.get("cv");
      if (cv && cv instanceof File && cv.size > 0) {
        if (cv.size > MAX) return NextResponse.json({ ok: false, error: "حجم الملف أكبر من 10 ميغابايت" }, { status: 400 });
        fd.set("cv", cv, cv.name);
      }
      // إن فشل التوجيه (باك إند بارد/معطّل) نسقط لتخزين الطلب فلا يضيع
      if (await forwardForm("career", fd)) return NextResponse.json({ ok: true });
    }

    let cvId = "";
    let cvName = "";
    const cv = form.get("cv");
    if (cv && cv instanceof File && cv.size > 0) {
      if (cv.size > MAX) {
        return NextResponse.json({ ok: false, error: "حجم الملف أكبر من 10 ميغابايت" }, { status: 400 });
      }
      const buf = Buffer.from(await cv.arrayBuffer());
      cvName = cv.name;
      cvId = await saveFile(cv.name, cv.type || "application/octet-stream", buf);
    }

    const entry = await addSubmission("career", {
      job: get("job"),
      name,
      phone,
      email: get("email"),
      city: get("city"),
      currentRole: get("currentRole"),
      experience: get("experience"),
      about: get("about"),
      cvId,
      cvName,
    });
    return NextResponse.json({ ok: true, id: entry.id });
  } catch {
    return NextResponse.json({ ok: false, error: "خطأ في الخادم" }, { status: 500 });
  }
}
