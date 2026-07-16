import type { Metadata } from "next";
import { headers } from "next/headers";

// الصورة الموحّدة الافتراضية لبطاقات المشاركة (يمكن تمرير صورة خاصة بالصفحة)
const DEFAULT_OG_IMAGE = "/figma/home/imgImageWithFallback.jpg";
// وصف افتراضي للصفحات التي لا تمرّر وصفًا خاصًا بها
const DEFAULT_DESC =
  "مركز عبور للرعاية والتأهيل — برامج تأهيلية وخدمات عيادية متخصصة لذوي الإعاقة والأطفال ذوي الاحتياجات.";

/**
 * يبني وسوم Open Graph و Twitter الخاصة بالصفحة من عنوانها ووصفها،
 * حتى تظهر بطاقة المشاركة الصحيحة لكل صفحة على السوشيال (بدل بطاقة الرئيسية).
 *
 * ملاحظة: canonical و og:url يُضبطان مركزيًا في الـlayout حسب مسار الصفحة،
 * ونعيد ضبط og:url هنا أيضًا لأن تعريف openGraph في الصفحة يستبدل تعريف الـlayout.
 */
export async function pageMeta(
  title: string,
  description?: string,
  image?: string,
): Promise<Metadata> {
  const path = (await headers()).get("x-pathname") || "/";
  const img = image || DEFAULT_OG_IMAGE;
  const desc = description || DEFAULT_DESC;
  return {
    title,
    description: desc,
    openGraph: {
      type: "website",
      siteName: "عبور | Oboor",
      title,
      description: desc,
      url: path,
      locale: "ar_SA",
      images: [{ url: img, alt: "مركز عبور للرعاية والتأهيل" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: desc,
      images: [img],
    },
  };
}
