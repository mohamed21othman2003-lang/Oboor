// تفعيل وضع المعاينة (Draft Mode): يعرض تعديلات غير محفوظة على الصفحة الحقيقية.
// يُستدعى من لوحة التحكّم بعد تخزين المسودّة في الباك إند.
import { draftMode, cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";

function safePath(to: string | null): string {
  // يمنع إعادة التوجيه لمواقع خارجية (open redirect)
  if (!to || !to.startsWith("/") || to.startsWith("//")) return "/";
  return to;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const ref = searchParams.get("ref") || "";
  const to = safePath(searchParams.get("to"));

  // ref بصيغة type:id (النوع أحرف/شرطات، المعرّف رقم)
  if (!/^[a-z-]+:\d+$/.test(ref)) {
    return new Response("Invalid preview reference", { status: 400 });
  }

  (await draftMode()).enable();
  (await cookies()).set("oboor_preview", ref, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 30, // 30 دقيقة
  });

  redirect(to);
}
