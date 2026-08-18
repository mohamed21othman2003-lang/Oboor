"""يزرع «الكل» — عناوين أقسام صفحة الأخبار (الترويسة + العنوان + الوصف) كعناصر قابلة
للتحرير في بلوك overview بصفحة news. آمن: get_or_create (لا يمسّ الموجود).
شغّله مرّة بعد النشر:  python manage.py seed_news_overview
"""
from django.core.management.base import BaseCommand
from content.m_sections import SectionItem

ITEMS = [
    dict(key="workshops", order=0,
         tagline_ar="تعلّم واحتمل", tagline_en="Learn & Grow",
         title_ar="أحدث الورش التدريبية", title_en="Latest Training Workshops"),
    dict(key="center", order=1,
         tagline_ar="من داخل عبور", tagline_en="Inside Oboor",
         title_ar="أخبار المراكز", title_en="Center News"),
    dict(key="events", order=2,
         tagline_ar="شارك معنا", tagline_en="Join Us",
         title_ar="الفعاليات", title_en="Events"),
    dict(key="articles", order=3,
         tagline_ar="ثقّف وابنِ الثقة", tagline_en="Inform & Build Confidence",
         title_ar="المحتوى التوعوي للأسر", title_en="Awareness Content for Families",
         text_ar="مقالات وأدلة متخصصة أُعدّت بعناية لمساعدة أسر المستفيدين على فهم الحالة ودعم أبنائهم.",
         text_en="Specialized articles and guides carefully prepared to help families understand their child's condition and support them."),
]


class Command(BaseCommand):
    help = "Seed the news 'overview' block (section headings shown on the All tab)."

    def handle(self, *args, **opts):
        created = 0
        for it in ITEMS:
            defaults = {k: v for k, v in it.items() if k != "key"}
            defaults["published"] = True
            _, was = SectionItem.objects.get_or_create(
                page="news", block="overview", key=it["key"], defaults=defaults,
            )
            created += 1 if was else 0
            self.stdout.write(("created " if was else "exists  ") + it["key"])
        self.stdout.write(self.style.SUCCESS(f"News overview: {created} created, {len(ITEMS) - created} existed."))
