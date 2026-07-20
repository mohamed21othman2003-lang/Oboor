import { NextResponse } from "next/server";
import { addSubmission } from "@/lib/server/store";
import { forwardJson } from "@/lib/server/django";

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const data = Object.fromEntries([...form.entries()].map(([k, v]) => [k, String(v)]));
    // تحقّق خادمي من الحقول الإلزامية (حارس نهائي حتى لو تخطّى المستخدم تحقّق الواجهة)
    const requiredFields = ["childName", "childAge", "gender", "city", "branch", "parentName", "phone"];
    const missing = requiredFields.filter((k) => !String(data[k] || "").trim());
    if (missing.length) {
      return NextResponse.json({ ok: false, error: "الرجاء تعبئة جميع الحقول الإلزامية (بما فيها الفرع والمدينة)." }, { status: 400 });
    }
    const outcome = await forwardJson("admission", {
      child_name: data.childName, child_age: data.childAge || "", gender: data.gender || "",
      city: data.city || "", branch: data.branch || "", parent_name: data.parentName,
      phone: data.phone, email: data.email || "", case_type: data.caseType || "", notes: data.notes || "",
      prev_sessions: data["prev-sessions"] || "",
    });
    if (outcome === "duplicate") return NextResponse.json({ ok: false, duplicate: true, error: "تم إرسال هذا الطلب مسبقاً بالفعل." }, { status: 409 });
    if (outcome === "ok") return NextResponse.json({ ok: true });
    const entry = await addSubmission("admission", data);
    return NextResponse.json({ ok: true, id: entry.id });
  } catch {
    return NextResponse.json({ ok: false, error: "خطأ في الخادم" }, { status: 500 });
  }
}
