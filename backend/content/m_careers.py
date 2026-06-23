# -*- coding: utf-8 -*-
from django.db import models


class JobOpening(models.Model):
    slug = models.SlugField("المعرّف (slug)", max_length=140, unique=True)

    title_ar = models.CharField("المسمى الوظيفي (عربي)", max_length=300)
    title_en = models.CharField("المسمى الوظيفي (إنجليزي)", max_length=300, blank=True)
    department_ar = models.CharField("القسم (عربي)", max_length=300)
    department_en = models.CharField("القسم (إنجليزي)", max_length=300, blank=True)
    city_ar = models.CharField("المدينة (عربي)", max_length=300)
    city_en = models.CharField("المدينة (إنجليزي)", max_length=300, blank=True)
    employment_ar = models.CharField("نوع الدوام (عربي)", max_length=300)
    employment_en = models.CharField("نوع الدوام (إنجليزي)", max_length=300, blank=True)
    experience_ar = models.CharField("الخبرة المطلوبة (عربي)", max_length=300)
    experience_en = models.CharField("الخبرة المطلوبة (إنجليزي)", max_length=300, blank=True)
    date_ar = models.CharField("تاريخ الطرح (عربي)", max_length=300, blank=True)
    date_en = models.CharField("تاريخ الطرح (إنجليزي)", max_length=300, blank=True)
    start_date_ar = models.CharField("تاريخ المباشرة المتوقع (عربي)", max_length=300, blank=True)
    start_date_en = models.CharField("تاريخ المباشرة المتوقع (إنجليزي)", max_length=300, blank=True)

    description_ar = models.TextField("الوصف الوظيفي (عربي)")
    description_en = models.TextField("الوصف الوظيفي (إنجليزي)", blank=True)

    responsibilities_ar = models.JSONField("المهام والمسؤوليات (عربي)", default=list, blank=True)
    responsibilities_en = models.JSONField("المهام والمسؤوليات (إنجليزي)", default=list, blank=True)
    requirements_ar = models.JSONField("المتطلبات (عربي)", default=list, blank=True)
    requirements_en = models.JSONField("المتطلبات (إنجليزي)", default=list, blank=True)

    is_new = models.BooleanField("جديد", default=False)
    order = models.IntegerField("الترتيب", default=0)
    published = models.BooleanField("منشور", default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "وظيفة"
        verbose_name_plural = "الوظائف"
        ordering = ["order", "id"]

    def __str__(self):
        return self.title_ar
