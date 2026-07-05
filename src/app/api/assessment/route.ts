import { NextResponse } from "next/server";
import { addSubmission } from "@/lib/server/store";
import { forwardJson } from "@/lib/server/django";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { parentName, phone } = body ?? {};
    if (!parentName || !phone || !String(body?.branch || "").trim()) {
      return NextResponse.json({ ok: false, error: "اسم ولي الأمر ورقم الجوال والفرع مطلوبة" }, { status: 400 });
    }
    const outcome = await forwardJson("assessment", {
      assessment: body.assessment || "", assessment_slug: body.assessmentSlug || "",
      level: body.level || "", score: body.score || 0, answers: body.answers || [],
      parent_name: parentName, phone, email: body.email || "", child_name: body.childName || "",
      age: body.age || "", gender: body.gender || "", city: body.city || "", branch: body.branch || "",
    });
    if (outcome === "duplicate") return NextResponse.json({ ok: false, duplicate: true, error: "تم إرسال هذا الطلب مسبقاً بالفعل." }, { status: 409 });
    if (outcome === "ok") return NextResponse.json({ ok: true });
    const entry = await addSubmission("assessment", body);
    return NextResponse.json({ ok: true, id: entry.id });
  } catch {
    return NextResponse.json({ ok: false, error: "خطأ في الخادم" }, { status: 500 });
  }
}
