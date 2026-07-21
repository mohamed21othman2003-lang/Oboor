import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // إخراج مستقل (standalone) — يبني ملف server.js صغير مع الملفات المطلوبة فقط،
  // فتصبح صورة Docker خفيفة بدون الحاجة لـ node_modules كاملة.
  output: "standalone",
  // لا نُفشي إطار العمل في الهيدرات (X-Powered-By) — نظافة أمنية بلا أثر وظيفي.
  poweredByHeader: false,
  images: {
    qualities: [75, 90],
    // AVIF أولًا (ضغط أعلى ~٢٠-٣٠٪ من WebP) ثم WebP كبديل — يقلّل وزن الصور على الموبايل.
    formats: ["image/avif", "image/webp"],
    // السماح بالصور المحلية مع query string (نستخدم ?v=2 لكسر كاش الصور بعد تحديثها)
    localPatterns: [{ pathname: "/**" }],
    remotePatterns: [
      // الصور المرفوعة على Supabase Storage (روابط القراءة العامة)
      { protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" },
      // تخزين MinIO في الإنتاج (يُقدَّم عبر nginx على نفس الدومين تحت /media)
      { protocol: "https", hostname: "oboor.ido.sa", pathname: "/media/**" },
      // التخزين المحلي لـ Django أثناء التطوير
      { protocol: "http", hostname: "127.0.0.1", port: "8000", pathname: "/media/**" },
      { protocol: "http", hostname: "localhost", port: "8000", pathname: "/media/**" },
    ],
  },
  // هيدرات أمان آمنة (بلا CSP كي لا تكسر GA/الخرائط) — تسري على كل الصفحات وتسافر مع الكود.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
        ],
      },
    ];
  },
};

export default nextConfig;
