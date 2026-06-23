# -*- coding: utf-8 -*-
from django.db import models


class Specialist(models.Model):
    slug = models.SlugField("المعرّف (slug)", max_length=140, unique=True)

    name_ar = models.CharField("الاسم (عربي)", max_length=300)
    name_en = models.CharField("الاسم (إنجليزي)", max_length=300, blank=True)
    specialty_ar = models.CharField("التخصص (عربي)", max_length=300)
    specialty_en = models.CharField("التخصص (إنجليزي)", max_length=300, blank=True)
    desc_ar = models.TextField("الوصف المختصر (عربي)")
    desc_en = models.TextField("الوصف المختصر (إنجليزي)", blank=True)
    days_ar = models.CharField("أيام العمل (عربي)", max_length=300)
    days_en = models.CharField("أيام العمل (إنجليزي)", max_length=300, blank=True)
    branch_ar = models.CharField("الفرع (عربي)", max_length=300)
    branch_en = models.CharField("الفرع (إنجليزي)", max_length=300, blank=True)
    experience_ar = models.CharField("الخبرة (عربي)", max_length=300)
    experience_en = models.CharField("الخبرة (إنجليزي)", max_length=300, blank=True)
    hours_ar = models.CharField("ساعات العمل (عربي)", max_length=300)
    hours_en = models.CharField("ساعات العمل (إنجليزي)", max_length=300, blank=True)
    branches_ar = models.CharField("الفروع المتواجد بها (عربي)", max_length=300)
    branches_en = models.CharField("الفروع المتواجد بها (إنجليزي)", max_length=300, blank=True)
    about_ar = models.TextField("نبذة عن الأخصائي (عربي)")
    about_en = models.TextField("نبذة عن الأخصائي (إنجليزي)", blank=True)
    qualifications_ar = models.JSONField("الشهادات والمؤهلات (عربي)", default=list, blank=True)
    qualifications_en = models.JSONField("الشهادات والمؤهلات (إنجليزي)", default=list, blank=True)

    image = models.CharField("مسار الصورة", max_length=300, blank=True)
    image_file = models.ImageField("رفع صورة", upload_to="content/", blank=True)
    order = models.IntegerField("الترتيب", default=0)
    published = models.BooleanField("منشور", default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "أخصائي"
        verbose_name_plural = "الأخصائيون"
        ordering = ["order", "id"]

    def __str__(self):
        return self.name_ar
