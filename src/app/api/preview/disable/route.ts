// إنهاء وضع المعاينة (Draft Mode) والعودة للمحتوى المنشور.
import { draftMode, cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";

function safePath(to: string | null): string {
  if (!to || !to.startsWith("/") || to.startsWith("//")) return "/";
  return to;
}

export async function GET(request: NextRequest) {
  const to = safePath(new URL(request.url).searchParams.get("to"));
  (await draftMode()).disable();
  (await cookies()).delete("oboor_preview");
  redirect(to);
}
