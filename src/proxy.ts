import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// يمرّر مسار الصفحة الحالي في هيدر `x-pathname` حتى يقرأه الـlayout
// ويضبط رابط canonical و og:url الذاتي لكل صفحة (SEO).
export function proxy(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", request.nextUrl.pathname);
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: [
    // كل المسارات ما عدا أصول Next الثابتة والملفات الساكنة
    "/((?!_next/static|_next/image|favicon.ico|icon.png|apple-icon.png|robots.txt|sitemap.xml|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp)).*)",
  ],
};
