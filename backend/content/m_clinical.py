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
    about_list_ar = models.JSONField("قائمة النبذة (عربي)", default=list, blank=True)
    about_list_en = models.JSONField("قائمة النبذة (إنجليزي)", default=list, blank=True)
    about_tag_ar = models.JSONField("وسم النبذة (عربي)", default=dict, blank=True)
    about_tag_en = models.JSONField("وسم النبذة (إنجليزي)", default=dict, blank=True)
    blocks_ar = models.JSONField("المحتوى (عربي)", default=list, blank=True)
    blocks_en = models.JSONField("المحتوى (إنجليزي)", default=list, blank=True)

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
