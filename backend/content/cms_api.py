"""واجهة برمجية للـCMS المخصّص: تسجيل دخول + المستخدم الحالي + إحصائيات اللوحة."""
from django.contrib.auth import authenticate
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response

from submissions.models import ContactMessage, AdmissionRequest, JobApplication, AssessmentResult
from content.models import (
    NewsArticle, ProgramDetail, ClinicalService, Technique, Branch,
    Specialist, JobOpening, SuccessStory, AssessmentCard,
    HeroSlide, StatItem, FeatureItem, GalleryImage, ServiceCard, SectionItem, SiteSettings,
)


def _user_payload(user):
    return {
        "username": user.username,
        "name": (user.get_full_name() or user.username),
        "email": user.email,
        "is_staff": user.is_staff,
    }


@api_view(["POST"])
@permission_classes([AllowAny])
@authentication_classes([])
def login(request):
    username = (request.data.get("username") or "").strip()
    password = request.data.get("password") or ""
    user = authenticate(username=username, password=password)
    if not user or not user.is_staff:
        return Response({"detail": "بيانات الدخول غير صحيحة أو لا تملك صلاحية الدخول."}, status=status.HTTP_401_UNAUTHORIZED)
    token, _ = Token.objects.get_or_create(user=user)
    return Response({"token": token.key, "user": _user_payload(user)})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def me(request):
    return Response({"user": _user_payload(request.user)})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def stats(request):
    submissions = [
        {"key": "contact", "label": "رسائل التواصل", "count": ContactMessage.objects.count(), "icon": "mail"},
        {"key": "admission", "label": "طلبات الالتحاق", "count": AdmissionRequest.objects.count(), "icon": "user-plus"},
        {"key": "career", "label": "طلبات التوظيف", "count": JobApplication.objects.count(), "icon": "briefcase"},
        {"key": "assessment", "label": "نتائج التقييم", "count": AssessmentResult.objects.count(), "icon": "clipboard"},
    ]
    content = [
        {"key": "news", "label": "الأخبار والمقالات", "count": NewsArticle.objects.count()},
        {"key": "programs", "label": "البرامج التأهيلية", "count": ProgramDetail.objects.count()},
        {"key": "services", "label": "الخدمات العيادية", "count": ClinicalService.objects.count()},
        {"key": "techniques", "label": "التقنيات", "count": Technique.objects.count()},
        {"key": "branches", "label": "الفروع", "count": Branch.objects.count()},
        {"key": "specialists", "label": "الأخصائيون", "count": Specialist.objects.count()},
        {"key": "success", "label": "قصص النجاح", "count": SuccessStory.objects.count()},
        {"key": "careers", "label": "الوظائف", "count": JobOpening.objects.count()},
        {"key": "assessment-cards", "label": "بطاقات التقييم", "count": AssessmentCard.objects.count()},
    ]
    home = [
        {"key": "hero", "label": "شرائح الهيرو", "count": HeroSlide.objects.count()},
        {"key": "stats", "label": "أرقام الإنجاز", "count": StatItem.objects.count()},
        {"key": "features", "label": "مميزات «لماذا عبور»", "count": FeatureItem.objects.count()},
        {"key": "gallery", "label": "صور المعرض", "count": GalleryImage.objects.count()},
        {"key": "service-cards", "label": "بطاقات الخدمات", "count": ServiceCard.objects.count()},
        {"key": "sections", "label": "عناصر أقسام الصفحات", "count": SectionItem.objects.count()},
    ]
    return Response({
        "submissions": submissions,
        "content": content,
        "home": home,
        "totals": {
            "submissions": sum(s["count"] for s in submissions),
            "content": sum(c["count"] for c in content) + sum(h["count"] for h in home),
            "site_configured": SiteSettings.objects.exists(),
        },
    })
