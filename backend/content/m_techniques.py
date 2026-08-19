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

    # قسم التواصل السفلي (CTA) الخاص بصفحة هذه التقنية — مستقل لكل تقنية
    cta_badge_ar = models.CharField("CTA — الترويسة الصغيرة (عربي)", max_length=200, blank=True, help_text="نص البادج في قسم التواصل السفلي بصفحة هذه التقنية (اتركه فارغاً للنص الافتراضي).")
    cta_badge_en = models.CharField("CTA — الترويسة الصغيرة (إنجليزي)", max_length=200, blank=True)
    cta_title_ar = models.TextField("CTA — العنوان (عربي)", blank=True, help_text="عنوان قسم التواصل السفلي بصفحة هذه التقنية (اتركه فارغاً للنص الافتراضي).")
    cta_title_en = models.TextField("CTA — العنوان (إنجليزي)", blank=True)
    cta_text_ar = models.TextField("CTA — النص (عربي)", blank=True)
    cta_text_en = models.TextField("CTA — النص (إنجليزي)", blank=True)

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
