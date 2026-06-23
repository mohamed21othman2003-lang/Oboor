from django.db import models


class SectionItem(models.Model):
    """عنصر محتوى عام لأقسام الصفحات (إحصائيات، مميزات، خطوات، بطاقات،
    فلاتر، أسئلة...). يُميَّز بـ page + block ويُجمَّع في الواجهة."""

    PAGES = [
        ("home", "الرئيسية"),
        ("success", "قصص النجاح"),
        ("specialists", "الأخصائيون"),
        ("assessment", "التقييم"),
        ("branches", "الفروع"),
        ("careers", "الوظائف"),
        ("news", "الأخبار"),
        ("header", "الهيدر (القائمة العلوية)"),
        ("footer", "الفوتر (التذييل)"),
    ]

    page = models.CharField("الصفحة", max_length=40, choices=PAGES)
    block = models.CharField("القسم", max_length=40, help_text="مثال: stats, features, steps, cards")
    key = models.SlugField("المعرّف", max_length=160, blank=True)
    order = models.IntegerField("الترتيب", default=0)
    published = models.BooleanField("منشور", default=True)

    icon = models.CharField("الأيقونة", max_length=60, blank=True)
    value = models.CharField("القيمة/الرقم", max_length=60, blank=True)
    color = models.CharField("اللون", max_length=20, blank=True)

    title_ar = models.CharField("العنوان (عربي)", max_length=400, blank=True)
    title_en = models.CharField("العنوان (إنجليزي)", max_length=400, blank=True)
    text_ar = models.TextField("النص (عربي)", blank=True)
    text_en = models.TextField("النص (إنجليزي)", blank=True)
    data_ar = models.JSONField("بيانات إضافية (عربي)", default=list, blank=True)
    data_en = models.JSONField("بيانات إضافية (إنجليزي)", default=list, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "عنصر قسم"
        verbose_name_plural = "عناصر أقسام الصفحات"
        ordering = ["page", "block", "order", "id"]

    def __str__(self):
        return f"{self.page}/{self.block}: {self.title_ar or self.value or self.key}"


class ServiceCard(models.Model):
    """بطاقات صفحة الخدمات/البرامج (تبويبات: برامج، خدمات عيادية، تقنيات)."""

    TABS = [
        ("programs", "برامج تأهيلية"),
        ("clinical", "خدمات عيادية"),
        ("techniques", "تقنيات تأهيلية"),
    ]

    tab = models.CharField("التبويب", max_length=20, choices=TABS)
    slug = models.SlugField("المعرّف (slug)", max_length=140, blank=True)
    href = models.CharField("رابط مخصّص", max_length=200, blank=True)
    order = models.IntegerField("الترتيب", default=0)
    published = models.BooleanField("منشور", default=True)

    badge_ar = models.CharField("الشارة (عربي)", max_length=120, blank=True)
    badge_en = models.CharField("الشارة (إنجليزي)", max_length=120, blank=True)
    title_ar = models.CharField("العنوان (عربي)", max_length=300)
    title_en = models.CharField("العنوان (إنجليزي)", max_length=300, blank=True)
    desc_ar = models.TextField("الوصف (عربي)", blank=True)
    desc_en = models.TextField("الوصف (إنجليزي)", blank=True)
    suits_ar = models.CharField("يناسب (عربي)", max_length=300, blank=True)
    suits_en = models.CharField("يناسب (إنجليزي)", max_length=300, blank=True)
    age_ar = models.CharField("الفئة العمرية (عربي)", max_length=120, blank=True)
    age_en = models.CharField("الفئة العمرية (إنجليزي)", max_length=120, blank=True)
    features_ar = models.JSONField("المميزات (عربي)", default=list, blank=True)
    features_en = models.JSONField("المميزات (إنجليزي)", default=list, blank=True)
    regions_ar = models.JSONField("المناطق (عربي)", default=list, blank=True)
    regions_en = models.JSONField("المناطق (إنجليزي)", default=list, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "بطاقة خدمة"
        verbose_name_plural = "بطاقات الخدمات (الفهرس)"
        ordering = ["tab", "order", "id"]

    def __str__(self):
        return f"{self.tab}: {self.title_ar}"
