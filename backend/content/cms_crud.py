"""CRUD عام للـCMS مبني على سجل أنواع المحتوى — قائمة/تفاصيل/إضافة/تعديل/حذف + مخطّط الحقول."""
from django.db import models as djm
from rest_framework import serializers, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from submissions.models import ContactMessage, AdmissionRequest, JobApplication, AssessmentResult
from content.models import (
    NewsArticle, ProgramDetail, ClinicalService, Technique, Branch,
    Specialist, JobOpening, SuccessStory, AssessmentCard,
    HeroSlide, StatItem, FeatureItem, GalleryImage, ServiceCard, SectionItem, SiteSettings,
    ContentSnapshot,
)

# مفتاح النوع → (الموديل، حقل العنوان للعرض، حقل التجميع الاختياري)
CONTENT = {
    "news": (NewsArticle, "title_ar", "section"),
    "programs": (ProgramDetail, "title_ar", None),
    "services": (ClinicalService, "title_ar", None),
    "techniques": (Technique, "title_ar", None),
    "branches": (Branch, "name_ar", "region_ar"),
    "specialists": (Specialist, "name_ar", None),
    "success": (SuccessStory, "name_ar", None),
    "careers": (JobOpening, "title_ar", None),
    "assessment-cards": (AssessmentCard, "title_ar", None),
    "hero": (HeroSlide, "heading_ar", None),
    "stats": (StatItem, "label_ar", None),
    "features": (FeatureItem, "title_ar", None),
    "gallery": (GalleryImage, "caption_ar", None),
    "service-cards": (ServiceCard, "title_ar", "tab"),
    "sections": (SectionItem, "title_ar", "page"),
    "site": (SiteSettings, "site_name_ar", None),
}
# الطلبات (قراءة فقط + حذف)
SUBMISSIONS = {
    "contact": (ContactMessage, "name"),
    "admission": (AdmissionRequest, "child_name"),
    "career": (JobApplication, "name"),
    "assessment": (AssessmentResult, "name"),
}

# الحقول اللي ما تظهرش في الفورم
HIDDEN = {"id", "created_at", "updated_at"}


def _serializer_for(Model):
    Meta = type("Meta", (), {"model": Model, "fields": "__all__"})
    return type(f"{Model.__name__}CMS", (serializers.ModelSerializer,), {"Meta": Meta})


def _field_type(f):
    if isinstance(f, djm.BooleanField):
        return "bool"
    if isinstance(f, (djm.ImageField, djm.FileField)):
        return "image"
    if isinstance(f, djm.JSONField):
        return "json"
    if isinstance(f, (djm.IntegerField, djm.FloatField)):
        return "number"
    if isinstance(f, djm.TextField):
        return "textarea"
    if getattr(f, "choices", None):
        return "select"
    return "text"


def _schema(Model):
    fields = []
    for f in Model._meta.get_fields():
        if not isinstance(f, djm.Field):
            continue
        if f.name in HIDDEN or f.auto_created or not f.editable:
            continue
        name = f.name
        item = {
            "name": name,
            "label": str(getattr(f, "verbose_name", name)),
            "type": _field_type(f),
            "required": not f.blank and not f.null and f.default is djm.NOT_PROVIDED,
            "bilingual": name.endswith("_ar") or name.endswith("_en"),
            "lang": "ar" if name.endswith("_ar") else ("en" if name.endswith("_en") else None),
            "base": name[:-3] if (name.endswith("_ar") or name.endswith("_en")) else name,
        }
        if item["type"] == "select" and getattr(f, "choices", None):
            item["choices"] = [{"value": c[0], "label": str(c[1])} for c in f.choices]
        fields.append(item)
    return fields


def _resolve(type_key):
    if type_key in CONTENT:
        return CONTENT[type_key][0], False
    if type_key in SUBMISSIONS:
        return SUBMISSIONS[type_key][0], True
    return None, False


def snapshot_fields(obj):
    """قيم الحقول القابلة للتحرير بصيغة JSON-safe (نتجاهل ملفات الصور)."""
    out = {}
    for f in obj._meta.get_fields():
        if not isinstance(f, djm.Field):
            continue
        if f.name in HIDDEN or f.auto_created or not f.editable:
            continue
        if isinstance(f, (djm.ImageField, djm.FileField)):
            continue
        out[f.name] = getattr(obj, f.name)
    return out


def capture_snapshot(type_key, obj):
    """تخزين لقطة افتراضية لمرة واحدة (لا تُكتب فوق الموجودة)."""
    ContentSnapshot.objects.get_or_create(
        type_key=type_key, obj_id=obj.pk,
        defaults={"data": snapshot_fields(obj)},
    )


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def collection(request, type_key):
    Model, is_sub = _resolve(type_key)
    if Model is None:
        return Response({"detail": "نوع غير معروف."}, status=404)
    Ser = _serializer_for(Model)

    if request.method == "GET":
        qs = Model.objects.all()
        title_field = (SUBMISSIONS if is_sub else CONTENT)[type_key][1]
        group_by = CONTENT[type_key][2] if (not is_sub and len(CONTENT[type_key]) > 2) else None
        data = Ser(qs, many=True, context={"request": request}).data
        groups = None
        if group_by:
            try:
                f = Model._meta.get_field(group_by)
                if getattr(f, "choices", None):
                    groups = [{"value": c[0], "label": str(c[1])} for c in f.choices]
            except Exception:
                pass
        return Response({
            "items": data,
            "title_field": title_field,
            "group_by": group_by,
            "groups": groups,  # ترتيب/تسميات المجموعات إن وُجدت قوائم اختيار
            "readonly": is_sub,
            "count": qs.count(),
        })

    # POST (create) — للمحتوى فقط
    if is_sub:
        return Response({"detail": "غير مسموح."}, status=403)
    ser = Ser(data=request.data, context={"request": request})
    ser.is_valid(raise_exception=True)
    ser.save()
    return Response(ser.data, status=status.HTTP_201_CREATED)


@api_view(["GET", "PUT", "PATCH", "DELETE"])
@permission_classes([IsAuthenticated])
def item(request, type_key, pk):
    Model, is_sub = _resolve(type_key)
    if Model is None:
        return Response({"detail": "نوع غير معروف."}, status=404)
    try:
        obj = Model.objects.get(pk=pk)
    except Model.DoesNotExist:
        return Response({"detail": "غير موجود."}, status=404)
    Ser = _serializer_for(Model)

    if request.method == "GET":
        data = Ser(obj, context={"request": request}).data
        if not is_sub:
            data["_has_default"] = ContentSnapshot.objects.filter(type_key=type_key, obj_id=pk).exists()
        return Response(data)
    if request.method == "DELETE":
        obj.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    if is_sub:
        return Response({"detail": "غير مسموح."}, status=403)
    ser = Ser(obj, data=request.data, partial=(request.method == "PATCH"), context={"request": request})
    ser.is_valid(raise_exception=True)
    ser.save()
    return Response(ser.data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def schema(request, type_key):
    Model, is_sub = _resolve(type_key)
    if Model is None:
        return Response({"detail": "نوع غير معروف."}, status=404)
    return Response({"fields": _schema(Model), "readonly": is_sub})


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def reset_default(request, type_key, pk):
    """استرجاع العنصر إلى نسخته الافتراضية (اللقطة المخزّنة)."""
    Model, is_sub = _resolve(type_key)
    if Model is None or is_sub:
        return Response({"detail": "غير مسموح."}, status=400)
    try:
        obj = Model.objects.get(pk=pk)
    except Model.DoesNotExist:
        return Response({"detail": "غير موجود."}, status=404)
    try:
        snap = ContentSnapshot.objects.get(type_key=type_key, obj_id=pk)
    except ContentSnapshot.DoesNotExist:
        return Response({"detail": "لا توجد نسخة افتراضية محفوظة لهذا العنصر."}, status=404)
    for name, value in snap.data.items():
        setattr(obj, name, value)
    obj.save()
    return Response(_serializer_for(Model)(obj, context={"request": request}).data)
