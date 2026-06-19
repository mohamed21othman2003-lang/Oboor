import { NextResponse } from "next/server";
import { addSubmission } from "@/lib/server/store";

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const data = Object.fromEntries([...form.entries()].map(([k, v]) => [k, String(v)]));
    if (!data.name || !data.phone) {
      return NextResponse.json({ ok: false, error: "الاسم ورقم الجوال مطلوبان" }, { status: 400 });
    }
    const entry = await addSubmission("contact", data);
    return NextResponse.json({ ok: true, id: entry.id });
  } catch {
    return NextResponse.json({ ok: false, error: "خطأ في الخادم" }, { status: 500 });
  }
}
