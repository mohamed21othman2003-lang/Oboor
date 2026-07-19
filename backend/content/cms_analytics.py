"""تحليلات لوحة التحكّم (مصدرها قاعدة بيانات Django مباشرة).

يجمّع طلبات الالتحاق والتقييمات والتوظيف والرسائل في أرقام جاهزة للعرض
في صفحة /cms/analytics. للأدمن فقط. GA4 لا يستطيع إنتاج هذه الأرقام.
"""
import os
import re
import time
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


# ======================= زيارات الموقع (GA4 Data API) =======================
_GA_CACHE = {"ts": 0.0, "data": None}
_GA_TTL = 900  # ثوانٍ — كاش 15 دقيقة لتجنّب استهلاك حصّة GA


def _ga_client():
    from google.analytics.data_v1beta import BetaAnalyticsDataClient
    from google.oauth2 import service_account
    path = os.environ.get("GA4_CREDENTIALS_FILE", "/app/secrets/ga-service-account.json")
    creds = service_account.Credentials.from_service_account_file(
        path, scopes=["https://www.googleapis.com/auth/analytics.readonly"]
    )
    return BetaAnalyticsDataClient(credentials=creds)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def traffic_overview(request):
    """زيارات الموقع من GA4 (Sessions/Users/Devices/Cities/…). للأدمن فقط، مع كاش."""
    if not request.user.is_staff:
        return Response({"detail": "غير مصرّح."}, status=status.HTTP_403_FORBIDDEN)

    now = time.time()
    if _GA_CACHE["data"] is not None and now - _GA_CACHE["ts"] < _GA_TTL:
        return Response(_GA_CACHE["data"])

    prop = os.environ.get("GA4_PROPERTY_ID", "545831946")
    try:
        from google.analytics.data_v1beta.types import (
            RunReportRequest, DateRange, Dimension, Metric, OrderBy,
        )
        client = _ga_client()
        pid = f"properties/{prop}"
        dr = [DateRange(start_date="28daysAgo", end_date="today")]

        totals_metrics = ["sessions", "totalUsers", "newUsers", "screenPageViews",
                          "engagementRate", "bounceRate", "averageSessionDuration"]
        tresp = client.run_report(RunReportRequest(
            property=pid, date_ranges=dr,
            metrics=[Metric(name=m) for m in totals_metrics],
        ))
        tv = tresp.rows[0].metric_values if tresp.rows else None

        def mv(i, cast=float):
            try:
                return cast(tv[i].value) if tv else 0
            except (ValueError, TypeError, IndexError):
                return 0

        totals = {
            "sessions": int(mv(0, int)), "users": int(mv(1, int)), "new_users": int(mv(2, int)),
            "views": int(mv(3, int)), "engagement_rate": round(mv(4) * 100, 1),
            "bounce_rate": round(mv(5) * 100, 1), "avg_engagement_sec": round(mv(6), 1),
        }

        def by_dim(dim, limit=8, metric="sessions"):
            resp = client.run_report(RunReportRequest(
                property=pid, date_ranges=dr,
                dimensions=[Dimension(name=dim)], metrics=[Metric(name=metric)],
                order_bys=[OrderBy(metric=OrderBy.MetricOrderBy(metric_name=metric), desc=True)],
                limit=limit,
            ))
            out = []
            for r in resp.rows:
                label = (r.dimension_values[0].value or "").strip() or "غير محدّد"
                out.append({"label": label, "count": int(r.metric_values[0].value or 0)})
            return out

        data = {
            "connected": True,
            "range_days": 28,
            "totals": totals,
            "by_device": by_dim("deviceCategory", 5),
            "by_channel": by_dim("sessionDefaultChannelGroup", 6),
            "by_city": by_dim("city", 8),
            "top_landing": by_dim("landingPage", 8),
        }
        _GA_CACHE.update(ts=now, data=data)
        return Response(data)
    except Exception as e:
        # لا نكسر الداشبورد — نُبلّغ الواجهة أن GA غير متاح مع السبب
        return Response({"connected": False, "error": str(e)[:300]})


# ======================= أداء البحث (Google Search Console) =======================
_GSC_CACHE = {"ts": 0.0, "data": None}


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def seo_overview(request):
    """كلمات البحث والنقرات والظهور من Search Console. للأدمن فقط، مع كاش."""
    if not request.user.is_staff:
        return Response({"detail": "غير مصرّح."}, status=status.HTTP_403_FORBIDDEN)

    now = time.time()
    if _GSC_CACHE["data"] is not None and now - _GSC_CACHE["ts"] < _GA_TTL:
        return Response(_GSC_CACHE["data"])

    import datetime
    site = os.environ.get("GSC_SITE_URL", "https://oboor.ido.sa/")
    try:
        from googleapiclient.discovery import build
        from google.oauth2 import service_account
        path = os.environ.get("GA4_CREDENTIALS_FILE", "/app/secrets/ga-service-account.json")
        creds = service_account.Credentials.from_service_account_file(
            path, scopes=["https://www.googleapis.com/auth/webmasters.readonly"]
        )
        svc = build("searchconsole", "v1", credentials=creds, cache_discovery=False)

        end = datetime.date.today()
        start = end - datetime.timedelta(days=28)

        def q(dims, limit):
            body = {"startDate": start.isoformat(), "endDate": end.isoformat(),
                    "dimensions": dims, "rowLimit": limit}
            return svc.searchanalytics().query(siteUrl=site, body=body).execute().get("rows", [])

        tr = (q([], 1) or [{}])[0]
        totals = {
            "clicks": int(tr.get("clicks", 0)),
            "impressions": int(tr.get("impressions", 0)),
            "ctr": round(tr.get("ctr", 0) * 100, 2),
            "position": round(tr.get("position", 0), 1),
        }
        queries = [{
            "label": r["keys"][0], "clicks": int(r["clicks"]), "impressions": int(r["impressions"]),
            "ctr": round(r["ctr"] * 100, 1), "position": round(r["position"], 1),
        } for r in q(["query"], 15)]
        pages = [{
            "label": r["keys"][0], "clicks": int(r["clicks"]), "impressions": int(r["impressions"]),
        } for r in q(["page"], 10)]

        data = {"connected": True, "range_days": 28, "totals": totals,
                "top_queries": queries, "top_pages": pages}
        _GSC_CACHE.update(ts=now, data=data)
        return Response(data)
    except Exception as e:
        return Response({"connected": False, "error": str(e)[:300]})
