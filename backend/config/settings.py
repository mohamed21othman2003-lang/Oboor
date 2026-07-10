"""Django settings for the Oboor backend (API + Django Admin)."""
from pathlib import Path
import os
import dj_database_url
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")

SECRET_KEY = os.environ.get("DJANGO_SECRET_KEY", "dev-insecure-change-me")
# افتراضات آمنة: DEBUG مطفأ والمضيفات محدّدة ما لم تُضبط البيئة صراحةً
# (الإنتاج والتطوير المحلي كلاهما يضبط هذه المتغيّرات — الافتراض يحمي أي نشر ينساها).
DEBUG = os.environ.get("DJANGO_DEBUG", "0") == "1"
ALLOWED_HOSTS = os.environ.get("DJANGO_ALLOWED_HOSTS", "localhost,127.0.0.1").split(",")
CSRF_TRUSTED_ORIGINS = [o for o in os.environ.get("CSRF_TRUSTED_ORIGINS", "").split(",") if o]

INSTALLED_APPS = [
    "unfold",
    "unfold.contrib.filters",
    "unfold.contrib.forms",
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",
    "rest_framework.authtoken",
    "corsheaders",
    "submissions",
    "content",
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "config.urls"
TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {"context_processors": [
            "django.template.context_processors.request",
            "django.contrib.auth.context_processors.auth",
            "django.contrib.messages.context_processors.messages",
        ]},
    },
]
WSGI_APPLICATION = "config.wsgi.application"

# Database — uses DATABASE_URL (Supabase Postgres) if set, else local SQLite for quick start.
_db_url = os.environ.get("DATABASE_URL")
if _db_url:
    # SSL مطلوب مع Supabase؛ يُطفأ لـPostgres محلي بلا TLS عبر DATABASE_SSL=disable
    _ssl_require = os.environ.get("DATABASE_SSL", "require") != "disable"
    _db = dj_database_url.parse(_db_url, conn_max_age=0, ssl_require=_ssl_require)
    # pgbouncer/Supabase pooler safe: disable prepared statements (psycopg3)
    _db.setdefault("OPTIONS", {})["prepare_threshold"] = None
    DATABASES = {"default": _db}
    DISABLE_SERVER_SIDE_CURSORS = True
else:
    DATABASES = {"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": BASE_DIR / "db.sqlite3"}}

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

LANGUAGE_CODE = "ar"
TIME_ZONE = "Asia/Riyadh"
USE_I18N = True
USE_TZ = True

STATIC_URL = "static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
STATICFILES_DIRS = [BASE_DIR / "static"]
MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"

# حدود رفع الملفات (السير الذاتية حتى 10 ميجا)
DATA_UPLOAD_MAX_MEMORY_SIZE = 12 * 1024 * 1024
FILE_UPLOAD_MAX_MEMORY_SIZE = 12 * 1024 * 1024

# تخزين الصور المرفوعة:
# - لو مفاتيح Supabase Storage (S3) موجودة في البيئة → الرفع يروح لـ Supabase (مناسب للنشر).
# - وإلا → تخزين محلي على القرص (للتجربة المحلية). الصور القديمة (مسارات /figma) تظل تعمل في الحالتين.
_s3_key = os.environ.get("SUPABASE_S3_KEY")
_s3_endpoint = os.environ.get("SUPABASE_S3_ENDPOINT", "")  # مثال: https://<ref>.supabase.co/storage/v1/s3
_s3_bucket = os.environ.get("SUPABASE_S3_BUCKET", "media")
if _s3_key and _s3_endpoint:
    # رابط القراءة العام لملفات Supabase: .../storage/v1/object/public/<bucket>
    _public = os.environ.get("SUPABASE_PUBLIC_BASE") or (
        _s3_endpoint.replace("/storage/v1/s3", f"/storage/v1/object/public/{_s3_bucket}")
    )
    _custom_domain = _public.split("://", 1)[-1]  # بدون البروتوكول لـ django-storages
    STORAGES = {
        "default": {
            "BACKEND": "storages.backends.s3.S3Storage",
            "OPTIONS": {
                "bucket_name": _s3_bucket,
                "endpoint_url": _s3_endpoint,
                "region_name": os.environ.get("SUPABASE_S3_REGION", "us-east-1"),
                "access_key": _s3_key,
                "secret_key": os.environ.get("SUPABASE_S3_SECRET", ""),
                "addressing_style": "path",
                "querystring_auth": False,
                "custom_domain": _custom_domain,
                # بروتوكول روابط القراءة العامة: https افتراضياً، http لـMinIO محلي بدون TLS.
                "url_protocol": os.environ.get("S3_URL_PROTOCOL", "https:"),
                "file_overwrite": False,
                "default_acl": None,
            },
        },
        "staticfiles": {"BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage"},
    }
else:
    STORAGES = {
        "default": {"BACKEND": "django.core.files.storage.FileSystemStorage"},
        "staticfiles": {"BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage"},
    }

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# CORS — allow the Next.js frontend to call the API
CORS_ALLOWED_ORIGINS = [o for o in os.environ.get("CORS_ALLOWED_ORIGINS", "http://localhost:3000").split(",") if o]

REST_FRAMEWORK = {
    "DEFAULT_PARSER_CLASSES": [
        "rest_framework.parsers.JSONParser",
        "rest_framework.parsers.MultiPartParser",
        "rest_framework.parsers.FormParser",
    ],
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework.authentication.TokenAuthentication",
        "rest_framework.authentication.SessionAuthentication",
    ],
    # القراءة العامة مفتوحة؛ نقاط الـCMS تتطلب IsAuthenticated صراحةً
    "DEFAULT_PERMISSION_CLASSES": ["rest_framework.permissions.AllowAny"],
    # ملاحظة: لا نضع throttle افتراضياً عاماً لأن قراءات المحتوى تأتي من خادم Next
    # (نفس الـIP) فتُحسب كمستخدم واحد. الحدّ يُطبَّق حيث ينفع (تسجيل الدخول من المتصفح مباشرةً).
    "DEFAULT_THROTTLE_RATES": {
        "login": os.environ.get("LOGIN_THROTTLE_RATE", "10/min"),
        "password_reset": os.environ.get("RESET_THROTTLE_RATE", "5/min"),
    },
}

# ===================== البريد الإلكتروني (إعادة تعيين كلمة المرور) =====================
# افتراضياً console (يُطبع في سجلّ الخادم)؛ يتحوّل تلقائياً إلى SMTP عند ضبط EMAIL_HOST.
EMAIL_HOST = os.environ.get("EMAIL_HOST", "")
if EMAIL_HOST:
    EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
    EMAIL_PORT = int(os.environ.get("EMAIL_PORT", "587"))
    EMAIL_USE_TLS = os.environ.get("EMAIL_USE_TLS", "1") == "1"
    EMAIL_HOST_USER = os.environ.get("EMAIL_HOST_USER", "")
    EMAIL_HOST_PASSWORD = os.environ.get("EMAIL_HOST_PASSWORD", "")
else:
    EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"
DEFAULT_FROM_EMAIL = os.environ.get("DEFAULT_FROM_EMAIL", "Oboor <no-reply@oboor.ido.sa>")

# الرابط العام للواجهة لبناء روابط إعادة التعيين
FRONTEND_URL = os.environ.get("FRONTEND_URL", "https://oboor.ido.sa")

# ===================== تقوية أمان الإنتاج =====================
# تُفعَّل تلقائياً خارج وضع DEBUG. خلف بروكسي (Render/Nginx) نثق بترويسة البروتوكول.
if not DEBUG:
    SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
    # إعادة التوجيه لـHTTPS قابلة للإطفاء بمتغيّر بيئة لتجنّب حلقات إعادة توجيه على بروكسي غير مضبوط
    SECURE_SSL_REDIRECT = os.environ.get("SECURE_SSL_REDIRECT", "1") == "1"
    SECURE_HSTS_SECONDS = int(os.environ.get("SECURE_HSTS_SECONDS", "31536000"))
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_PRELOAD = True
    SECURE_CONTENT_TYPE_NOSNIFF = True
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True

# ===================== هوية لوحة التحكّم (Unfold) =====================
from django.templatetags.static import static  # noqa: E402
from django.urls import reverse_lazy  # noqa: E402


def _nav(model, label, icon):
    return {"title": label, "icon": icon, "link": reverse_lazy(f"admin:{model}_changelist")}


UNFOLD = {
    "SITE_TITLE": "إدارة مركز عبور",
    "SITE_HEADER": "مركز عبور",
    "SITE_SUBHEADER": "لوحة التحكّم في محتوى الموقع",
    "SITE_LOGO": lambda request: static("oboor/logo.png"),
    "SITE_ICON": lambda request: static("oboor/logo.png"),
    "SITE_SYMBOL": "favorite",
    "SHOW_HISTORY": True,
    "SHOW_VIEW_ON_SITE": True,
    "SHOW_LANGUAGES": False,
    "BORDER_RADIUS": "10px",
    "COLORS": {
        "primary": {
            "50": "240 250 251",
            "100": "216 243 245",
            "200": "181 233 236",
            "300": "132 217 223",
            "400": "76 196 205",
            "500": "44 188 200",
            "600": "23 150 163",
            "700": "21 125 136",
            "800": "22 100 112",
            "900": "21 85 96",
            "950": "13 61 69",
        },
    },
    "SIDEBAR": {
        "show_search": True,
        "show_all_applications": False,
        "navigation": [
            {
                "title": "الطلبات والرسائل",
                "separator": True,
                "items": [
                    _nav("submissions_contactmessage", "رسائل التواصل", "mail"),
                    _nav("submissions_admissionrequest", "طلبات الالتحاق", "person_add"),
                    _nav("submissions_jobapplication", "طلبات التوظيف", "work"),
                    _nav("submissions_assessmentresult", "نتائج التقييم", "fact_check"),
                ],
            },
            {
                "title": "محتوى الموقع",
                "separator": True,
                "items": [
                    _nav("content_newsarticle", "الأخبار والمقالات", "newspaper"),
                    _nav("content_programdetail", "البرامج التأهيلية", "school"),
                    _nav("content_clinicalservice", "الخدمات العيادية", "medical_services"),
                    _nav("content_technique", "التقنيات التأهيلية", "memory"),
                    _nav("content_branch", "الفروع", "location_on"),
                    _nav("content_specialist", "الأخصائيون", "stethoscope"),
                    _nav("content_successstory", "قصص النجاح", "star"),
                    _nav("content_jobopening", "الوظائف", "campaign"),
                    _nav("content_assessmentcard", "بطاقات التقييم", "checklist"),
                ],
            },
            {
                "title": "الرئيسية والأقسام",
                "separator": True,
                "items": [
                    _nav("content_heroslide", "شرائح الهيرو", "view_carousel"),
                    _nav("content_statitem", "أرقام الإنجاز", "bar_chart"),
                    _nav("content_featureitem", "مميزات «لماذا عبور»", "workspace_premium"),
                    _nav("content_galleryimage", "صور المعرض", "image"),
                    _nav("content_servicecard", "بطاقات الخدمات (الفهرس)", "grid_view"),
                    _nav("content_sectionitem", "عناصر أقسام الصفحات", "dashboard_customize"),
                ],
            },
            {
                "title": "الإعدادات والمستخدمون",
                "separator": True,
                "items": [
                    _nav("content_sitesettings", "إعدادات الموقع", "settings"),
                    _nav("auth_user", "المستخدمون", "person"),
                    _nav("auth_group", "المجموعات", "group"),
                ],
            },
        ],
    },
}
