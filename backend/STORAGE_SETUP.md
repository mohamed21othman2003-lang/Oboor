# تفعيل رفع الصور عبر Supabase Storage

الكود جاهز بالكامل. بدون مفاتيح Supabase، الرفع يعمل محلياً (مجلد `media/`). لتفعيل التخزين السحابي الدائم (الموصى به للنشر):

## 1) أنشئ Bucket عام
- Supabase Dashboard → **Storage** → **New bucket**
- الاسم: `media`
- فعّل **Public bucket** (عشان الصور تظهر على الموقع مباشرة).

## 2) أنشئ مفاتيح S3
- Supabase Dashboard → **Storage** → **S3 Connection** (أو Settings → Storage):
  - انسخ **Endpoint** (شكله: `https://<project-ref>.supabase.co/storage/v1/s3`)
  - انسخ **Region** (مثال: `eu-west-1`)
- اضغط **New access key** وانسخ **Access key ID** و **Secret access key** (تظهر مرة واحدة).

## 3) ضع القيم في `backend/.env` (شيل علامة #)
```
SUPABASE_S3_ENDPOINT=https://<project-ref>.supabase.co/storage/v1/s3
SUPABASE_S3_REGION=eu-west-1
SUPABASE_S3_BUCKET=media
SUPABASE_S3_KEY=<access-key-id>
SUPABASE_S3_SECRET=<secret-access-key>
```
أعد تشغيل سيرفر Django. أي صورة تُرفع من لوحة التحكّم (حقل «رفع صورة») ستُخزَّن في Supabase
وتظهر تلقائياً على الموقع. الصور القديمة (مسارات `/figma/...`) تبقى كما هي.

## ملاحظات
- الواجهة (`next.config.ts`) مهيّأة مسبقاً للسماح بصور `*.supabase.co`.
- حقل `image` القديم (المسار النصّي) يظل احتياطياً؛ لو رفعت صورة في `image_file` فهي تُستخدم بدلاً منه.
- للنشر: أضف نفس المتغيّرات الخمسة في بيئة استضافة Django.
