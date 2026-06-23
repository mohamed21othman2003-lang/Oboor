from django.db import models


class Technique(models.Model):
    slug = models.SlugField("المعرّف (slug)", max_length=140, unique=True)

    title_ar = models.CharField("العنوان (عربي)", max_length=300)
    title_en = models.CharField("العنوان (إنجليزي)", max_length=300, blank=True)
    badge_ar = models.CharField("حالة التوفر (عربي)", max_length=300, blank=True)
    badge_en = models.CharField("حالة التوفر (إنجليزي)", max_length=300, blank=True)

    about_ar = models.JSONField("نبذة (عربي)", default=list, blank=True)
    about_en = models.JSONField("نبذة (إنجليزي)", default=list, blank=True)
    targets_ar = models.JSONField("الفئات المستهدفة (عربي)", default=list, blank=True)
    targets_en = models.JSONField("الفئات المستهدفة (إنجليزي)", default=list, blank=True)
    offers_ar = models.JSONField("ما تقدمه (عربي)", default=list, blank=True)
    offers_en = models.JSONField("ما تقدمه (إنجليزي)", default=list, blank=True)
    offer_icons = models.JSONField("أيقونات العروض", default=list, blank=True)
    help_section_ar = models.JSONField("قسم المساعدة (عربي)", default=dict, blank=True)
    help_section_en = models.JSONField("قسم المساعدة (إنجليزي)", default=dict, blank=True)

    image = models.CharField("مسار الصورة", max_length=300, blank=True)
    image_file = models.ImageField("رفع صورة", upload_to="content/", blank=True)
    order = models.IntegerField("الترتيب", default=0)
    published = models.BooleanField("منشور", default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "تقنية تأهيلية"
        verbose_name_plural = "التقنيات التأهيلية"
        ordering = ["order", "id"]

    def __str__(self):
        return self.title_ar
