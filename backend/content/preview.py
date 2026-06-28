"""معاينة المسودّات (Draft Preview).

يخزّن تعديلات غير محفوظة من الـCMS ويعرضها على الموقع في وضع المعاينة فقط
(عند تفعيل Draft Mode من Next عبر ?preview=type:id) دون كتابتها في المحتوى الفعلي.
"""
from django.db import models as djm
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import PreviewDraft


def set_preview_draft(type_key, pid, data):
    PreviewDraft.objects.update_or_create(
        type_key=type_key, obj_id=str(pid), defaults={"data": data or {}}
    )


def get_preview_draft(type_key, pid):
    row = PreviewDraft.objects.filter(type_key=type_key, obj_id=str(pid)).first()
    return row.data if row else None


def apply_draft(obj, draft):
    """يطبّق قيم المسودّة على نسخة الموديل في الذاكرة (بدون حفظ).
    يتجاهل حقول الصور/الملفات (الصور تُدار بالرفع، والمعاينة تُبقي الصورة الحالية)."""
    fmap = {f.name: f for f in obj._meta.get_fields() if isinstance(f, djm.Field)}
    for k, v in (draft or {}).items():
        f = fmap.get(k)
        if not f or f.auto_created or not f.editable:
            continue
        if isinstance(f, (djm.ImageField, djm.FileField)):
            continue
        try:
            setattr(obj, k, f.to_python(v) if v not in (None, "") else v)
        except Exception:
            try:
                setattr(obj, k, v)
            except Exception:
                pass
    return obj


def overlay_preview(request, queryset):
    """يرجّع عناصر القائمة مع تطبيق مسودّة المعاينة على العنصر المطابق إن وُجدت."""
    items = list(queryset)
    raw = ""
    try:
        raw = request.query_params.get("preview") or ""
    except Exception:
        raw = request.GET.get("preview") or ""
    if ":" not in raw:
        return items
    type_key, _, pid = raw.partition(":")
    from .cms_crud import CONTENT
    entry = CONTENT.get(type_key)
    if not entry or entry[0] is not queryset.model:
        return items
    draft = get_preview_draft(type_key, pid)
    if not draft:
        return items
    try:
        pid_int = int(pid)
    except (TypeError, ValueError):
        return items
    for o in items:
        if o.pk == pid_int:
            apply_draft(o, draft)
            break
    return items


class PreviewListMixin:
    """يطبّق مسودّة المعاينة على نتائج ListAPIView عند وجود ?preview=type:id.
    بدون باراميتر المعاينة يتصرّف كقائمة عادية تماماً."""

    def list(self, request, *args, **kwargs):
        qs = self.filter_queryset(self.get_queryset())
        items = overlay_preview(request, qs)
        serializer = self.get_serializer(items, many=True)
        return Response(serializer.data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def save_preview(request):
    """يخزّن مسودّة (تعديلات غير محفوظة) لعرضها في المعاينة. body: {type, id, data}."""
    type_key = request.data.get("type")
    pid = request.data.get("id")
    data = request.data.get("data")
    if not type_key or pid in (None, "") or not isinstance(data, dict):
        return Response({"detail": "بيانات ناقصة."}, status=400)
    from .cms_crud import CONTENT
    if type_key not in CONTENT:
        return Response({"detail": "نوع غير معروف."}, status=404)
    set_preview_draft(type_key, pid, data)
    return Response({"ok": True})
