"use server";

import { updateTag } from "next/cache";

// إبطال كاش محتوى الـCMS فورًا بعد الحفظ (read-your-own-writes):
// أول طلب للموقع بعد الحفظ ينتظر البيانات الجديدة بدل ما يعرض القديمة.
export async function bustContentCache() {
  updateTag("cms-content");
}
