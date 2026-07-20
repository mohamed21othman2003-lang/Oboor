"""تحليلات لوحة التحكّم (مصدرها قاعدة بيانات Django مباشرة).

يجمّع طلبات الالتحاق والتقييمات والتوظيف والرسائل في أرقام جاهزة للعرض
في صفحة /cms/analytics. للأدمن فقط. GA4 لا يستطيع إنتاج هذه الأرقام.
"""
import datetime
import os
import re
import time
from django.db.models import Count
from django.db.models.functions import TruncWeek
from django.utils import timezone

from .m_branches import Branch
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from submissions.models import (
    AdmissionRequest, AssessmentResult, ContactMessage, JobApplication,
)
from .m_programs import ProgramDetail
from .m_clinical import ClinicalService
from .m_techniques import Technique
from .models import NewsArticle

LEVEL_AR = {"high": "مرتفع", "medium": "متوسط", "low": "منخفض"}

# ===== تحويل مسارات الصفحات إلى أسماء حقيقية (للتقارير) =====
_ROUTE_NAMES = {
    "": ("الصفحة الرئيسية", "Home"), "admission": ("طلب الالتحاق", "Admission"),
    "about": ("عن عبور", "About"), "branches": ("المراكز", "Branches"),
    "programs": ("البرامج", "Programs"), "assessment": ("التقييم", "Assessment"),
    "contact": ("التواصل", "Contact"), "news": ("إعلامنا", "News"),
    "specialists": ("الأخصائيون", "Specialists"), "success-stories": ("قصص النجاح", "Success Stories"),
    "careers": ("الوظائف", "Careers"), "gallery": ("المعرض", "Gallery"),
}
_SECTION_NAMES = {"branches": ("مركز", "Branch"), "programs": ("برنامج", "Program"),
                  "services": ("خدمة", "Service"), "techniques": ("تقنية", "Technique"), "news": ("خبر", "News")}


def _slug_maps():
    """{ section: {slug: (name_ar, name_en)} } من قاعدة البيانات."""
    out = {}
    for sec, (M, af, ef) in {
        "branches": (Branch, "name_ar", "name_en"),
        "programs": (ProgramDetail, "title_ar", "title_en"),
        "services": (ClinicalService, "title_ar", "title_en"),
        "techniques": (Technique, "title_ar", "title_en"),
        "news": (NewsArticle, "title_ar", "title_en"),
    }.items():
        d = {}
        try:
            for o in M.objects.all():
                ar = getattr(o, af, "") or o.slug
                d[o.slug] = (ar, getattr(o, ef, "") or ar)
        except Exception:
            pass
        out[sec] = d
    return out


def _page_label(path, maps):
    """يرجّع {ar, en} لاسم الصفحة، أو None لصفحات النظام الداخلية (cms/admin)."""
    clean = (path or "/").split("?")[0].strip("/")
    parts = clean.split("/") if clean else []
    if not parts:
        return {"ar": _ROUTE_NAMES[""][0], "en": _ROUTE_NAMES[""][1]}
    if parts[0] in ("cms", "admin", "_next", "api"):
        return None
    if len(parts) == 1 and parts[0] in _ROUTE_NAMES:
        n = _ROUTE_NAMES[parts[0]]
        return {"ar": n[0], "en": n[1]}
    if len(parts) >= 2 and parts[0] in maps:
        hit = maps[parts[0]].get(parts[1])
        if hit:
            return {"ar": hit[0], "en": hit[1]}
        s = _SECTION_NAMES.get(parts[0])
        if s:
            return {"ar": f"{s[0]}: {parts[1]}", "en": f"{s[1]}: {parts[1]}"}
    return {"ar": clean, "en": clean}


def _resolve_page_rows(rows, maps):
    """يحوّل صفوف الصفحات إلى label_ar/label_en، ويستبعد صفحات النظام الداخلية."""
    out = []
    for r in rows:
        lbl = _page_label(r.get("label", ""), maps)
        if lbl is None:
            continue
        item = {"label_ar": lbl["ar"], "label_en": lbl["en"]}
        for k, v in r.items():
            if k != "label":
                item[k] = v
        out.append(item)
    return out


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


def _group_branch(adm):
    """تجميع الطلبات حسب الفرع مع اسمي الفرع (عربي/إنجليزي) من قاعدة البيانات."""
    name_map = {}
    for na, ne in Branch.objects.values_list("name_ar", "name_en"):
        if na and na.strip():
            name_map[na.strip()] = (ne or na).strip()
    counts = {}
    for b in adm.values_list("branch", flat=True):
        key = (b or "").strip() or "غير محدّد"
        counts[key] = counts.get(key, 0) + 1
    rows = [{"label_ar": k, "label_en": name_map.get(k, k), "count": v} for k, v in counts.items()]
    rows.sort(key=lambda x: x["count"], reverse=True)
    return rows[:12]


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
        "admissions_by_branch": _group_branch(adm),
        "admissions_by_city": _group(adm, "city"),
        "admissions_by_gender": _group(adm, "gender"),
        "admissions_by_age": _age_bands(adm),
        "admissions_by_case_type": _group(adm, "case_type"),
        "assessments_by_type": _group(ass, "assessment"),
        "assessments_by_level": _group(ass, "level", label_map=LEVEL_AR),
        "careers_by_city": _group(job, "city"),
        "careers_by_position": _group(job, "job"),
        "careers_trend": _careers_trend(job),
        "branch_city_mismatch": _branch_city_mismatch(adm),
    }
    return Response(data)


def _careers_trend(job):
    """طلبات التوظيف أسبوعيًا لآخر 8 أسابيع."""
    since = timezone.now() - datetime.timedelta(weeks=8)
    rows = (job.filter(created_at__gte=since)
            .annotate(w=TruncWeek("created_at")).values("w").annotate(n=Count("id")).order_by("w"))
    return [{"label": r["w"].strftime("%m/%d"), "count": r["n"]} for r in rows if r["w"]]


def _branch_city_mismatch(adm):
    """طلبات الالتحاق من مدن ليس بها فرع (فرصة توسّع)."""
    served = set()
    for city_ar, region_ar in Branch.objects.values_list("city_ar", "region_ar"):
        for v in (city_ar, region_ar):
            if v and v.strip():
                served.add(v.strip())
    cities = [(c or "").strip() for c in adm.values_list("city", flat=True) if (c or "").strip()]
    total = len(cities)
    unserved = {}
    for c in cities:
        if c not in served:
            unserved[c] = unserved.get(c, 0) + 1
    n_unserved = sum(unserved.values())
    top = sorted(({"label": k, "count": v} for k, v in unserved.items()), key=lambda x: x["count"], reverse=True)[:8]
    return {
        "pct": round(n_unserved / total * 100) if total else 0,
        "unserved": n_unserved,
        "total": total,
        "top": top,
    }


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
            RunReportRequest, DateRange, Dimension, Metric, OrderBy, FilterExpression, Filter,
        )
        client = _ga_client()
        pid = f"properties/{prop}"
        dr = [DateRange(start_date="28daysAgo", end_date="today")]

        # فلتر السوق الواحد (السعودية) — يستبعد الزيارات الأجنبية (ومنها ضوضاء الاختبار).
        # قابل للتعطيل بضبط GA4_COUNTRY="" في البيئة.
        _country = os.environ.get("GA4_COUNTRY", "Saudi Arabia")
        GEO = FilterExpression(filter=Filter(
            field_name="country", string_filter=Filter.StringFilter(value=_country))) if _country else None

        totals_metrics = ["sessions", "totalUsers", "newUsers", "screenPageViews",
                          "engagementRate", "bounceRate", "averageSessionDuration"]
        tresp = client.run_report(RunReportRequest(
            property=pid, date_ranges=dr, dimension_filter=GEO,
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
                property=pid, date_ranges=dr, dimension_filter=GEO,
                dimensions=[Dimension(name=dim)], metrics=[Metric(name=metric)],
                order_bys=[OrderBy(metric=OrderBy.MetricOrderBy(metric_name=metric), desc=True)],
                limit=limit,
            ))
            out = []
            for r in resp.rows:
                label = (r.dimension_values[0].value or "").strip() or "غير محدّد"
                out.append({"label": label, "count": int(r.metric_values[0].value or 0)})
            return out

        # عدّادات الأحداث المخصّصة (ضغطات/فورمات/تقييم/بحث)
        OUR_EVENTS = ["whatsapp_click", "phone_click", "email_click", "generate_lead",
                      "form_submit", "assessment_start", "assessment_complete", "smart_search", "download_pdf"]
        events = {e: 0 for e in OUR_EVENTS}
        ev_resp = client.run_report(RunReportRequest(
            property=pid, date_ranges=dr, dimension_filter=GEO,
            dimensions=[Dimension(name="eventName")], metrics=[Metric(name="eventCount")], limit=200,
        ))
        for r in ev_resp.rows:
            name = r.dimension_values[0].value
            if name in events:
                events[name] = int(r.metric_values[0].value or 0)

        # خط الجلسات عبر الأيام
        tr_resp = client.run_report(RunReportRequest(
            property=pid, date_ranges=dr, dimension_filter=GEO,
            dimensions=[Dimension(name="date")], metrics=[Metric(name="sessions")],
            order_bys=[OrderBy(dimension=OrderBy.DimensionOrderBy(dimension_name="date"))],
        ))

        def _fmt(d):
            return f"{d[6:8]}/{d[4:6]}" if len(d) == 8 else d
        trend = [{"label": _fmt(r.dimension_values[0].value), "count": int(r.metric_values[0].value or 0)} for r in tr_resp.rows]

        data = {
            "connected": True,
            "range_days": 28,
            "totals": totals,
            "by_device": by_dim("deviceCategory", 5),
            "by_channel": by_dim("sessionDefaultChannelGroup", 6),
            "by_city": by_dim("city", 8),
            "top_landing": _resolve_page_rows(by_dim("landingPage", 20), _slug_maps())[:8],
            "events": events,
            "trend": trend,
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
        pages_raw = [{
            "label": r["keys"][0].replace("https://oboor.ido.sa", ""),
            "clicks": int(r["clicks"]), "impressions": int(r["impressions"]),
        } for r in q(["page"], 20)]
        pages = _resolve_page_rows(pages_raw, _slug_maps())[:10]

        data = {"connected": True, "range_days": 28, "totals": totals,
                "top_queries": queries, "top_pages": pages}
        _GSC_CACHE.update(ts=now, data=data)
        return Response(data)
    except Exception as e:
        return Response({"connected": False, "error": str(e)[:300]})
