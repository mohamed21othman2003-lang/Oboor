from django.db import models


class NewsArticle(models.Model):
    SECTIONS = [
        ("workshops", "الورش التدريبية"),
        ("center", "أخبار المراكز"),
        ("events", "الفعاليات"),
        ("articles", "التوعية الأسرية"),
    ]
    slug = models.SlugField("المعرّف (slug)", max_length=120, unique=True)
    section = models.CharField("القسم", max_length=20, choices=SECTIONS)
    featured = models.BooleanField(
        "مميّز", default=False,
        help_text="عند تفعيله يظهر هذا العنصر كبطاقة كبيرة مميّزة في أعلى قسمه (الورش أو المقالات) بدل كارت عادي. فعّله لعنصر واحد فقط في كل قسم.",
    )

    title_ar = models.CharField("العنوان (عربي)", max_length=300)
    title_en = models.CharField("العنوان (إنجليزي)", max_length=300, blank=True)
    desc_ar = models.TextField("الوصف (عربي)")
    desc_en = models.TextField("الوصف (إنجليزي)", blank=True)
    category_ar = models.CharField("التصنيف (عربي)", max_length=80, blank=True)
    category_en = models.CharField("التصنيف (إنجليزي)", max_length=80, blank=True)
    date_ar = models.CharField("التاريخ (عربي)", max_length=60, blank=True)
    date_en = models.CharField("التاريخ (إنجليزي)", max_length=60, blank=True)

    # تفاصيل صفحة الخبر/الفعالية (محتوى الصفحة الداخلية)
    body_ar = models.JSONField("فقرات المحتوى (عربي)", default=list, blank=True)
    body_en = models.JSONField("فقرات المحتوى (إنجليزي)", default=list, blank=True)
    learn_ar = models.JSONField("ماذا ستتعلم / النقاط (عربي)", default=list, blank=True)
    learn_en = models.JSONField("ماذا ستتعلم / النقاط (إنجليزي)", default=list, blank=True)

    # كارت تفاصيل الفعالية (محتوى زمني — يظهر فقط إن عُبّئ)
    time_ar = models.CharField("الوقت (عربي)", max_length=120, blank=True)
    time_en = models.CharField("الوقت (إنجليزي)", max_length=120, blank=True)
    location_ar = models.CharField("المكان (عربي)", max_length=200, blank=True)
    location_en = models.CharField("المكان (إنجليزي)", max_length=200, blank=True)
    audience_ar = models.CharField("الفئة المستهدفة (عربي)", max_length=200, blank=True)
    audience_en = models.CharField("الفئة المستهدفة (إنجليزي)", max_length=200, blank=True)
    seats_ar = models.CharField("عدد المقاعد (عربي)", max_length=80, blank=True)
    seats_en = models.CharField("عدد المقاعد (إنجليزي)", max_length=80, blank=True)
    reg_status_ar = models.CharField("حالة التسجيل (عربي)", max_length=160, blank=True)
    reg_status_en = models.CharField("حالة التسجيل (إنجليزي)", max_length=160, blank=True)

    image = models.CharField("مسار الصورة", max_length=300, blank=True)
    image_file = models.ImageField("رفع صورة", upload_to="content/", blank=True)
    order = models.IntegerField("الترتيب", default=0)
    published = models.BooleanField("منشور", default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "خبر / مقال"
        verbose_name_plural = "الأخبار والفعاليات والمقالات"
        ordering = ["section", "order", "-created_at"]

    def __str__(self):
        return self.title_ar


# تجميع موديلات بقية أنواع المحتوى (كل نوع في وحدة مستقلة)
from .m_programs import *      # noqa: E402,F401,F403
from .m_clinical import *      # noqa: E402,F401,F403
from .m_techniques import *    # noqa: E402,F401,F403
from .m_branches import *      # noqa: E402,F401,F403
from .m_specialists import *   # noqa: E402,F401,F403
from .m_careers import *       # noqa: E402,F401,F403
from .m_success import *       # noqa: E402,F401,F403
from .m_assessment import *    # noqa: E402,F401,F403
from .m_home import *          # noqa: E402,F401,F403
from .m_sections import *      # noqa: E402,F401,F403
from .m_site import *          # noqa: E402,F401,F403


class ContentSnapshot(models.Model):
    """لقطة من المحتوى لاسترجاع «النسخة الافتراضية» لاحقاً."""
    type_key = models.CharField(max_length=40)
    obj_id = models.IntegerField()
    data = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "لقطة محتوى افتراضية"
        verbose_name_plural = "لقطات المحتوى الافتراضية"
        unique_together = ("type_key", "obj_id")

    def __str__(self):
        return f"{self.type_key}#{self.obj_id}"


class PreviewDraft(models.Model):
    """مسودّة معاينة: تعديلات غير محفوظة تُخزَّن مؤقتاً لعرضها في وضع المعاينة.
    تُحفظ في قاعدة البيانات لتعمل عبر كل عمّال الخادم وبعد إعادة التشغيل."""
    type_key = models.CharField(max_length=40)
    obj_id = models.CharField(max_length=40)
    data = models.JSONField(default=dict)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "مسودّة معاينة"
        verbose_name_plural = "مسودّات المعاينة"
        unique_together = ("type_key", "obj_id")

    def __str__(self):
        return f"{self.type_key}#{self.obj_id}"
