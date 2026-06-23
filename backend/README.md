# Oboor Backend — Django (API + Admin)

باك إند Django لمركز عبور: لوحة تحكّم (Django Admin) + REST API تستهلكه واجهة Next.js.

## التشغيل محليًا (بعد تثبيت Python سليم)

```bash
cd backend
python -m venv venv
venv\Scripts\activate            # ويندوز  (Linux/Mac: source venv/bin/activate)
pip install -r requirements.txt

copy .env.example .env           # ثم عدّل القيم (DATABASE_URL ...)

python manage.py migrate
python manage.py createsuperuser   # لإنشاء حساب الدخول للوحة الإدارة
python manage.py runserver         # http://127.0.0.1:8000
```

- **لوحة الإدارة:** http://127.0.0.1:8000/admin/
- **الـ API:**
  - `POST /api/contact/`
  - `POST /api/admission/`
  - `POST /api/assessment/`
  - `POST /api/career/`  (multipart — يقبل ملف `cv`)

## قاعدة البيانات (Supabase)
- ضع `DATABASE_URL` في `.env`.
- **للـ migrations استخدم "Session pooler" (port 5432)** أو الاتصال المباشر — لأن "Transaction pooler" (6543) لا يدعم بعض عمليات الـ migration.

## ربط واجهة Next
في مشروع Next، ضع المتغيّر:
```
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api
```
والفورمز ترسل إليه. (لو غير موجود، ترجع الفورمز للـ API routes القديمة داخل Next.)

## النشر لاحقًا
- استضافة Python (Railway / Render / VPS). شغّل: `gunicorn config.wsgi`.
- اضبط `DJANGO_DEBUG=0`, `DJANGO_ALLOWED_HOSTS`, `CORS_ALLOWED_ORIGINS` (دومين Vercel), و`DATABASE_URL`.
- `python manage.py collectstatic` (whitenoise يخدم static الأدمن).
- لتخزين الـ CV على Supabase Storage بدل قرص السيرفر: نضيف `django-storages` لاحقًا.
