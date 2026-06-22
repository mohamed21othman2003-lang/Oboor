import { NextResponse } from "next/server";
import { addSubmission } from "@/lib/server/store";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { parentName, phone } = body ?? {};
    if (!parentName || !phone) {
      return NextResponse.json({ ok: false, error: "اسم ولي الأمر ورقم الجوال مطلوبان" }, { status: 400 });
    }
    const entry = await addSubmission("assessment", body);
    return NextResponse.json({ ok: true, id: entry.id });
  } catch {
    return NextResponse.json({ ok: false, error: "خطأ في الخادم" }, { status: 500 });
  }
}
