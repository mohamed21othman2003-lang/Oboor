"""تحليلات لوحة التحكّم (مصدرها قاعدة بيانات Django مباشرة).

يجمّع طلبات الالتحاق والتقييمات والتوظيف والرسائل في أرقام جاهزة للعرض
في صفحة /cms/analytics. للأدمن فقط. GA4 لا يستطيع إنتاج هذه الأرقام.
"""
import re
from django.db.models import Count
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from submissions.models import (
    AdmissionRequest, AssessmentResult, ContactMessage, JobApplication,
)

LEVEL_AR = {"high": "مرتفع", "medium": "متوسط", "low": "منخفض"}


def _group(qs, field, limit=12, label_map=None):
    """يرجّع [{label, count}] مرتّبة تنازليًا، مع دمج الفراغات في «غير محدّد»."""
    counts = {}
    for r in qs.values(field).annotate(n=Count("id")):
        raw = (r[field] or "").strip()
        label = (label_map.get(raw, raw) if label_map else raw) or "غير محدّد"
        counts[label] = counts.get(label, 0) + r["n"]
    rows = [{"label": k, "count": v} for k, v in counts.items()]
    rows.sort(key=lambda x: x["count"], reverse=True)
    return rows[:limit]


def _age_bands(qs):
    bands = {"0–3": 0, "4–7": 0, "8–14": 0, "15+": 0, "غير محدّد": 0}
    for v in qs.values_list("child_age", flat=True):
        m = re.search(r"\d+", v or "")
        if not m:
            bands["غير محدّد"] += 1
            continue
        a = int(m.group())
        if a <= 3:
            bands["0–3"] += 1
        elif a <= 7:
            bands["4–7"] += 1
        elif a <= 14:
            bands["8–14"] += 1
        else:
            bands["15+"] += 1
    return [{"label": k, "count": v} for k, v in bands.items() if v or k != "غير محدّد"]


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def analytics_overview(request):
    if not request.user.is_staff:
        return Response({"detail": "غير مصرّح."}, status=status.HTTP_403_FORBIDDEN)

    adm = AdmissionRequest.objects.all()
    ass = AssessmentResult.objects.all()
    con = ContactMessage.objects.all()
    job = JobApplication.objects.all()

    data = {
        "totals": {
            "admissions": adm.count(),
            "assessments": ass.count(),
            "contacts": con.count(),
            "careers": job.count(),
        },
        "admissions_by_branch": _group(adm, "branch"),
        "admissions_by_city": _group(adm, "city"),
        "admissions_by_gender": _group(adm, "gender"),
        "admissions_by_age": _age_bands(adm),
        "admissions_by_case_type": _group(adm, "case_type"),
        "assessments_by_type": _group(ass, "assessment"),
        "assessments_by_level": _group(ass, "level", label_map=LEVEL_AR),
        "careers_by_city": _group(job, "city"),
        "careers_by_position": _group(job, "job"),
    }
    return Response(data)
