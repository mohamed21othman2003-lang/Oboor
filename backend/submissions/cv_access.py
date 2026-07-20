"""تنزيل السير الذاتية عبر رابط موقّع قصير الأجل بدل رابط عام دائم.

قبل هذا الملف كانت السيرة تُفتح برابط ثابت على التخزين، أي أن أي شخص
يعرف المسار (أو يستعرض المجلد) يستطيع تنزيل سير المتقدّمين دون تسجيل دخول.
الآن: التخزين مغلق أمام العامة، والطريق الوحيد لفتح الملف هو هذا العرض،
ولا يُصدر رابطه إلا داخل قائمة الطلبات التي تتطلّب دخول الـCMS.
"""

import os

from django.core import signing
from django.core.files.storage import default_storage
from django.http import FileResponse, Http404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny

from .models import JobApplication

CV_SALT = "oboor.cv.download"
CV_TTL = 3600  # الرابط صالح ساعة من لحظة عرض قائمة الطلبات


def cv_signed_url(obj) -> str:
    """رابط تنزيل موقّع لطلب التوظيف، أو نص فارغ إن لم تكن هناك سيرة مرفقة."""
    if not getattr(obj, "cv", None):
        return ""
    return f"/api/cms/cv/{signing.dumps(obj.pk, salt=CV_SALT)}/"


@api_view(["GET"])
@permission_classes([AllowAny])  # التوقيع المؤقّت نفسه هو التصريح
def serve_cv(request, token: str):
    try:
        pk = signing.loads(token, salt=CV_SALT, max_age=CV_TTL)
    except signing.SignatureExpired:
        raise Http404("انتهت صلاحية الرابط — أعد تحميل صفحة الطلبات.")
    except signing.BadSignature:
        raise Http404("رابط غير صالح.")

    obj = JobApplication.objects.filter(pk=pk).first()
    if not obj or not obj.cv:
        raise Http404("لا توجد سيرة ذاتية لهذا الطلب.")

    try:
        fh = default_storage.open(obj.cv.name, "rb")
    except Exception:
        raise Http404("تعذّر فتح الملف.")

    resp = FileResponse(fh, as_attachment=True, filename=os.path.basename(obj.cv.name))
    # حاسم: يمنع Cloudflare/الوسطاء من تخزين نسخة تبقى متاحة بعد انتهاء الرابط
    resp["Cache-Control"] = "private, no-store, max-age=0"
    return resp
