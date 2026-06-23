import { NextResponse } from "next/server";
import { addSubmission, saveFile } from "@/lib/server/store";

export const runtime = "nodejs";
const MAX = 5 * 1024 * 1024; // 5 MB

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const get = (k: string) => String(form.get(k) || "");
    const name = get("name");
    const phone = get("phone");
    if (!name || !phone) {
      return NextResponse.json({ ok: false, error: "الاسم ورقم الجوال مطلوبان" }, { status: 400 });
    }

    let cvId = "";
    let cvName = "";
    const cv = form.get("cv");
    if (cv && cv instanceof File && cv.size > 0) {
      if (cv.size > MAX) {
        return NextResponse.json({ ok: false, error: "حجم الملف أكبر من 5 ميغابايت" }, { status: 400 });
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
