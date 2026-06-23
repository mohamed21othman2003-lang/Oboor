from django.db import models


class ProgramDetail(models.Model):
    slug = models.SlugField("المعرّف (slug)", max_length=140, unique=True)

    title_ar = models.CharField("العنوان (عربي)", max_length=300)
    title_en = models.CharField("العنوان (إنجليزي)", max_length=300, blank=True)
    subtitle_ar = models.TextField("العنوان الفرعي (عربي)")
    subtitle_en = models.TextField("العنوان الفرعي (إنجليزي)", blank=True)

    about_ar = models.JSONField("نبذة (عربي)", default=list, blank=True)
    about_en = models.JSONField("نبذة (إنجليزي)", default=list, blank=True)

    philosophy_intro_ar = models.TextField("مقدمة الفلسفة (عربي)", blank=True)
    philosophy_intro_en = models.TextField("مقدمة الفلسفة (إنجليزي)", blank=True)
    philosophy_ar = models.JSONField("الفلسفة (عربي)", default=list, blank=True)
    philosophy_en = models.JSONField("الفلسفة (إنجليزي)", default=list, blank=True)

    methods_ar = models.JSONField("المنهج العلمي (عربي)", default=list, blank=True)
    methods_en = models.JSONField("المنهج العلمي (إنجليزي)", default=list, blank=True)

    duration_ar = models.TextField("مدة البرنامج (عربي)", blank=True)
    duration_en = models.TextField("مدة البرنامج (إنجليزي)", blank=True)

    target_ar = models.TextField("الفئة المستهدفة (عربي)", blank=True)
    target_en = models.TextField("الفئة المستهدفة (إنجليزي)", blank=True)
    target_tags_ar = models.JSONField("وسوم الفئة المستهدفة (عربي)", default=list, blank=True)
    target_tags_en = models.JSONField("وسوم الفئة المستهدفة (إنجليزي)", default=list, blank=True)

    training_intro_ar = models.TextField("مقدمة مجالات التدريب (عربي)", blank=True)
    training_intro_en = models.TextField("مقدمة مجالات التدريب (إنجليزي)", blank=True)
    training_areas_ar = models.JSONField("مجالات التدريب (عربي)", default=list, blank=True)
    training_areas_en = models.JSONField("مجالات التدريب (إنجليزي)", default=list, blank=True)

    target_list_ar = models.JSONField("قائمة الفئة المستهدفة (عربي)", default=list, blank=True)
    target_list_en = models.JSONField("قائمة الفئة المستهدفة (إنجليزي)", default=list, blank=True)

    stations_intro_ar = models.TextField("مقدمة المحطات (عربي)", blank=True)
    stations_intro_en = models.TextField("مقدمة المحطات (إنجليزي)", blank=True)
    stations_ar = models.JSONField("المحطات التطبيقية (عربي)", default=list, blank=True)
    stations_en = models.JSONField("المحطات التطبيقية (إنجليزي)", default=list, blank=True)

    image = models.CharField("مسار الصورة", max_length=300, blank=True)
    image_file = models.ImageField("رفع صورة", upload_to="content/", blank=True)
    order = models.IntegerField("الترتيب", default=0)
    published = models.BooleanField("منشور", default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "برنامج تأهيلي"
        verbose_name_plural = "البرامج التأهيلية"
        ordering = ["order", "id"]

    def __str__(self):
        return self.title_ar
