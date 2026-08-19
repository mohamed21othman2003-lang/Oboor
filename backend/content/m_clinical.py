from django.db import models


class ClinicalService(models.Model):
    slug = models.SlugField("المعرّف (slug)", max_length=140, unique=True)

    title_ar = models.CharField("العنوان (عربي)", max_length=300)
    title_en = models.CharField("العنوان (إنجليزي)", max_length=300, blank=True)
    subtitle_ar = models.TextField("العنوان الفرعي (عربي)")
    subtitle_en = models.TextField("العنوان الفرعي (إنجليزي)", blank=True)
    about_heading_ar = models.CharField("عنوان النبذة (عربي)", max_length=300)
    about_heading_en = models.CharField("عنوان النبذة (إنجليزي)", max_length=300, blank=True)

    about_ar = models.JSONField("النبذة (عربي)", default=list, blank=True)
    about_en = models.JSONField("النبذة (إنجليزي)", default=list, blank=True)
    about_list_ar = models.JSONField("نقاط النبذة (عربي)", default=list, blank=True)
    about_list_en = models.JSONField("نقاط النبذة (إنجليزي)", default=list, blank=True)
    about_tag_ar = models.JSONField("بطاقة مميّزة (عربي)", default=dict, blank=True)
    about_tag_en = models.JSONField("بطاقة مميّزة (إنجليزي)", default=dict, blank=True)
    blocks_ar = models.JSONField("المحتوى (عربي)", default=list, blank=True)
    blocks_en = models.JSONField("المحتوى (إنجليزي)", default=list, blank=True)

    # قسم التواصل السفلي (CTA) الخاص بصفحة هذه الخدمة — مستقل لكل خدمة
    cta_badge_ar = models.CharField("CTA — الترويسة الصغيرة (عربي)", max_length=200, blank=True, help_text="نص البادج في قسم التواصل السفلي بصفحة هذه الخدمة (اتركه فارغاً للنص الافتراضي).")
    cta_badge_en = models.CharField("CTA — الترويسة الصغيرة (إنجليزي)", max_length=200, blank=True)
    cta_title_ar = models.TextField("CTA — العنوان (عربي)", blank=True, help_text="عنوان قسم التواصل السفلي بصفحة هذه الخدمة (اتركه فارغاً للنص الافتراضي).")
    cta_title_en = models.TextField("CTA — العنوان (إنجليزي)", blank=True)
    cta_text_ar = models.TextField("CTA — النص (عربي)", blank=True)
    cta_text_en = models.TextField("CTA — النص (إنجليزي)", blank=True)

    image = models.CharField("مسار الصورة", max_length=300, blank=True)
    image_file = models.ImageField("رفع صورة", upload_to="content/", blank=True)
    order = models.IntegerField("الترتيب", default=0)
    published = models.BooleanField("منشور", default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "خدمة عيادية"
        verbose_name_plural = "الخدمات العيادية"
        ordering = ["order", "id"]

    def __str__(self):
        return self.title_ar
