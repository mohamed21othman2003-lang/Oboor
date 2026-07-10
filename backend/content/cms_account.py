"""حساب الأدمن: تعديل البريد، تغيير كلمة المرور، وتدفّق إعادة التعيين بالبريد.

يعتمد على مستخدم Django القياسي و DRF Token. لا يكشف وجود البريد من عدمه
(استجابة النجاح ثابتة في طلب إعادة التعيين).
"""
from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth.tokens import default_token_generator
from django.core.exceptions import ValidationError
from django.core.mail import send_mail
from django.core.validators import validate_email
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode

from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes, authentication_classes, throttle_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle

User = get_user_model()


class ResetRateThrottle(AnonRateThrottle):
    scope = "password_reset"


def _err(msg, code=status.HTTP_400_BAD_REQUEST):
    return Response({"detail": msg}, status=code)


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
            try:
                send_mail(
                    subject="إعادة تعيين كلمة المرور — لوحة تحكّم عبور",
                    message=(
                        f"مرحبًا،\n\nلقد طلبت إعادة تعيين كلمة المرور لحسابك في لوحة تحكّم مركز عبور.\n"
                        f"افتح الرابط التالي لتعيين كلمة مرور جديدة (صالح لفترة محدودة):\n\n{link}\n\n"
                        f"إن لم تطلب ذلك، تجاهل هذه الرسالة.\n\nمركز عبور للرعاية والتأهيل"
                    ),
                    from_email=getattr(settings, "DEFAULT_FROM_EMAIL", None),
                    recipient_list=[user.email],
                    fail_silently=True,
                )
            except Exception:
                pass
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
