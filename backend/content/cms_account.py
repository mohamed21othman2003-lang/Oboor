"""حساب الأدمن: تعديل البريد، تغيير كلمة المرور، وتدفّق إعادة التعيين بالبريد.

يعتمد على مستخدم Django القياسي و DRF Token. لا يكشف وجود البريد من عدمه
(استجابة النجاح ثابتة في طلب إعادة التعيين).
"""
from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth.tokens import default_token_generator
from django.core.exceptions import ValidationError
from django.core.mail import send_mail, EmailMessage
from django.core.validators import validate_email
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode

from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes, authentication_classes, throttle_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle

from .m_email import EmailSettings

User = get_user_model()


class ResetRateThrottle(AnonRateThrottle):
    scope = "password_reset"


def _err(msg, code=status.HTTP_400_BAD_REQUEST):
    return Response({"detail": msg}, status=code)


def _send_system_mail(subject, body, recipients):
    """يرسل رسالة نظام عبر إعدادات SMTP المحفوظة في قاعدة البيانات إن كانت مفعّلة،
    وإلا يسقط على backend الإعدادات الافتراضي (console في التطوير). لا يرفع استثناء."""
    cfg = EmailSettings.load()
    try:
        if cfg.is_ready():
            msg = EmailMessage(subject, body, cfg.sender, recipients, connection=cfg.build_connection())
            msg.send(fail_silently=False)
        else:
            send_mail(subject, body, getattr(settings, "DEFAULT_FROM_EMAIL", None), recipients, fail_silently=True)
    except Exception:
        pass


# ============ تعديل البريد الإلكتروني (مسجّل الدخول) ============
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def update_email(request):
    email = (request.data.get("email") or "").strip()
    if not email:
        return _err("البريد الإلكتروني مطلوب.")
    try:
        validate_email(email)
    except ValidationError:
        return _err("البريد الإلكتروني غير صالح.")
    user = request.user
    user.email = email
    user.save(update_fields=["email"])
    return Response({"email": user.email})


# ============ تغيير كلمة المرور (مسجّل الدخول) ============
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def change_password(request):
    current = request.data.get("current_password") or ""
    new = request.data.get("new_password") or ""
    user = request.user
    if not user.check_password(current):
        return _err("كلمة المرور الحالية غير صحيحة.")
    try:
        validate_password(new, user)
    except ValidationError as e:
        return _err(" ".join(e.messages))
    user.set_password(new)
    user.save(update_fields=["password"])
    # جدّد التوكن حتى تبقى الجلسة الحالية صالحة بعد تغيير كلمة المرور
    Token.objects.filter(user=user).delete()
    token = Token.objects.create(user=user)
    return Response({"detail": "تم تحديث كلمة المرور بنجاح.", "token": token.key})


# ============ طلب رابط إعادة التعيين (عام) ============
@api_view(["POST"])
@permission_classes([AllowAny])
@authentication_classes([])
@throttle_classes([ResetRateThrottle])
def password_reset_request(request):
    email = (request.data.get("email") or "").strip()
    # نبعث الرابط فقط لموظّف فعّال له هذا البريد — دون كشف ذلك في الاستجابة.
    if email:
        user = User.objects.filter(email__iexact=email, is_active=True, is_staff=True).first()
        if user:
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = default_token_generator.make_token(user)
            base = getattr(settings, "FRONTEND_URL", "").rstrip("/")
            link = f"{base}/cms/reset-password?uid={uid}&token={token}"
            subject = "إعادة تعيين كلمة المرور — لوحة تحكّم عبور"
            body = (
                f"مرحبًا،\n\nلقد طلبت إعادة تعيين كلمة المرور لحسابك في لوحة تحكّم مركز عبور.\n"
                f"افتح الرابط التالي لتعيين كلمة مرور جديدة (صالح لفترة محدودة):\n\n{link}\n\n"
                f"إن لم تطلب ذلك، تجاهل هذه الرسالة.\n\nمركز عبور للرعاية والتأهيل"
            )
            _send_system_mail(subject, body, [user.email])
    # استجابة ثابتة دائمًا (عدم كشف وجود البريد)
    return Response({"detail": "إن كان البريد مسجّلًا لدينا، ستصلك رسالة تحتوي على رابط إعادة التعيين."})


# ============ تأكيد إعادة التعيين (عام) ============
@api_view(["POST"])
@permission_classes([AllowAny])
@authentication_classes([])
@throttle_classes([ResetRateThrottle])
def password_reset_confirm(request):
    uidb64 = request.data.get("uid") or ""
    token = request.data.get("token") or ""
    new = request.data.get("new_password") or ""
    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid, is_active=True, is_staff=True)
    except (User.DoesNotExist, ValueError, TypeError, OverflowError):
        user = None
    if not user or not default_token_generator.check_token(user, token):
        return _err("رابط إعادة التعيين غير صالح أو منتهي الصلاحية.", status.HTTP_400_BAD_REQUEST)
    try:
        validate_password(new, user)
    except ValidationError as e:
        return _err(" ".join(e.messages))
    user.set_password(new)
    user.save(update_fields=["password"])
    # أبطِل أي جلسات/توكنات قديمة بعد إعادة التعيين
    Token.objects.filter(user=user).delete()
    return Response({"detail": "تم تحديث كلمة المرور بنجاح."})


# ============ إعدادات البريد (SMTP) — للأدمن فقط ============
def _email_settings_payload(cfg):
    """تمثيل آمن للإعدادات: بدون كلمة المرور إطلاقًا، فقط مؤشّر أنها مضبوطة."""
    return {
        "enabled": cfg.enabled,
        "host": cfg.host,
        "port": cfg.port,
        "security": cfg.security,
        "username": cfg.username,
        "from_email": cfg.from_email,
        "from_name": cfg.from_name,
        "password_set": bool(cfg.password),
        "is_ready": cfg.is_ready(),
    }


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def email_settings(request):
    if not request.user.is_staff:
        return _err("غير مصرّح.", status.HTTP_403_FORBIDDEN)
    cfg = EmailSettings.load()

    if request.method == "GET":
        return Response(_email_settings_payload(cfg))

    d = request.data
    cfg.enabled = bool(d.get("enabled", cfg.enabled))
    cfg.host = (d.get("host") or "").strip()
    try:
        cfg.port = int(d.get("port") or 587)
    except (TypeError, ValueError):
        return _err("رقم المنفذ (Port) غير صالح.")
    sec = (d.get("security") or "tls").strip()
    cfg.security = sec if sec in {"tls", "ssl", "none"} else "tls"
    cfg.username = (d.get("username") or "").strip()
    cfg.from_email = (d.get("from_email") or "").strip()
    cfg.from_name = (d.get("from_name") or "").strip()
    # كلمة المرور تُحدَّث فقط عند إرسال قيمة جديدة غير فارغة (write-only)
    new_pw = d.get("password")
    if new_pw:
        cfg.password = new_pw
    cfg.save()
    return Response(_email_settings_payload(cfg))


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def email_settings_test(request):
    """يرسل رسالة تجريبية بالإعدادات المحفوظة، ويعيد خطأ SMTP الحقيقي عند الفشل."""
    if not request.user.is_staff:
        return _err("غير مصرّح.", status.HTTP_403_FORBIDDEN)
    cfg = EmailSettings.load()
    if not cfg.is_ready():
        return _err("أكمِل إعدادات البريد واحفظها أولًا (الخادم واسم المستخدم وكلمة المرور والتفعيل).")
    to = (request.data.get("to") or cfg.username or request.user.email or "").strip()
    if not to:
        return _err("حدّد بريدًا لإرسال الرسالة التجريبية إليه.")
    try:
        validate_email(to)
    except ValidationError:
        return _err("البريد المُدخَل غير صالح.")
    try:
        msg = EmailMessage(
            "رسالة تجريبية — إعدادات بريد لوحة عبور",
            "هذه رسالة تجريبية للتأكّد من صحّة إعدادات البريد (SMTP) في لوحة تحكّم مركز عبور.\n\nإن وصلتك هذه الرسالة فالإعدادات تعمل بنجاح.",
            cfg.sender, [to], connection=cfg.build_connection(),
        )
        msg.send(fail_silently=False)
    except Exception as e:
        return _err(f"فشل الإرسال: {e}", status.HTTP_400_BAD_REQUEST)
    return Response({"detail": f"تم إرسال رسالة تجريبية إلى {to} بنجاح."})
