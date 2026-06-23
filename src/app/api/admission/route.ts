import { NextResponse } from "next/server";
import { addSubmission } from "@/lib/server/store";
import { forwardJson } from "@/lib/server/django";

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const data = Object.fromEntries([...form.entries()].map(([k, v]) => [k, String(v)]));
    if (!data.childName || !data.parentName || !data.phone) {
      return NextResponse.json({ ok: false, error: "بيانات الطفل وولي الأمر والجوال مطلوبة" }, { status: 400 });
    }
    if (await forwardJson("admission", {
      child_name: data.childName, child_age: data.childAge || "", gender: data.gender || "",
      city: data.city || "", branch: data.branch || "", parent_name: data.parentName,
      phone: data.phone, email: data.email || "", case_type: data.caseType || "", notes: data.notes || "",
    })) return NextResponse.json({ ok: true });
    const entry = await addSubmission("admission", data);
    return NextResponse.json({ ok: true, id: entry.id });
  } catch {
    return NextResponse.json({ ok: false, error: "خطأ في الخادم" }, { status: 500 });
  }
}
