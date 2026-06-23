# -*- coding: utf-8 -*-
from django.db import models


class SuccessStory(models.Model):
    slug = models.SlugField("المعرّف (slug)", max_length=140, unique=True)

    name_ar = models.CharField("الاسم (عربي)", max_length=300)
    name_en = models.CharField("الاسم (إنجليزي)", max_length=300, blank=True)
    age_ar = models.CharField("العمر (عربي)", max_length=300)
    age_en = models.CharField("العمر (إنجليزي)", max_length=300, blank=True)
    category_ar = models.CharField("الفئة (عربي)", max_length=300)
    category_en = models.CharField("الفئة (إنجليزي)", max_length=300, blank=True)
    duration_label_ar = models.CharField("شارة المدة (عربي)", max_length=300)
    duration_label_en = models.CharField("شارة المدة (إنجليزي)", max_length=300, blank=True)
    before_ar = models.TextField("قبل الالتحاق (عربي)")
    before_en = models.TextField("قبل الالتحاق (إنجليزي)", blank=True)
    after_ar = models.TextField("بعد البرنامج (عربي)")
    after_en = models.TextField("بعد البرنامج (إنجليزي)", blank=True)
    quote_ar = models.TextField("الاقتباس (عربي)")
    quote_en = models.TextField("الاقتباس (إنجليزي)", blank=True)
    meta_duration_ar = models.CharField("مدة العلاج (عربي)", max_length=300)
    meta_duration_en = models.CharField("مدة العلاج (إنجليزي)", max_length=300, blank=True)
    meta_age_ar = models.CharField("الفئة العمرية (عربي)", max_length=300)
    meta_age_en = models.CharField("الفئة العمرية (إنجليزي)", max_length=300, blank=True)
    author_ar = models.CharField("راوي القصة (عربي)", max_length=300)
    author_en = models.CharField("راوي القصة (إنجليزي)", max_length=300, blank=True)

    image = models.CharField("مسار الصورة", max_length=300, blank=True)
    image_file = models.ImageField("رفع صورة", upload_to="content/", blank=True)
    order = models.IntegerField("الترتيب", default=0)
    published = models.BooleanField("منشور", default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "قصة نجاح"
        verbose_name_plural = "قصص النجاح"
        ordering = ["order", "id"]

    def __str__(self):
        return self.name_ar
