# -*- coding: utf-8 -*-
from django.db import models


class AssessmentCard(models.Model):
    """بطاقة تقييم (قيّم ابنك) — نوع تقييم مع بياناته القابلة للعرض وأسئلته."""

    # unique key derived from the data's slug
    slug = models.SlugField("المعرّف (slug)", max_length=140, unique=True)
    key = models.SlugField("المفتاح", max_length=140, blank=True)
    icon = models.CharField("الأيقونة", max_length=60, blank=True)

    # bilingual short text
    title_ar = models.CharField("العنوان (عربي)", max_length=300)
    title_en = models.CharField("العنوان (إنجليزي)", max_length=300, blank=True)
    duration_ar = models.CharField("المدة (عربي)", max_length=300, blank=True)
    duration_en = models.CharField("المدة (إنجليزي)", max_length=300, blank=True)
    questions_ar = models.CharField("عدد الأسئلة (عربي)", max_length=300, blank=True)
    questions_en = models.CharField("عدد الأسئلة (إنجليزي)", max_length=300, blank=True)
    age_range_ar = models.CharField("الفئة العمرية (عربي)", max_length=300, blank=True)
    age_range_en = models.CharField("الفئة العمرية (إنجليزي)", max_length=300, blank=True)

    # bilingual long text
    desc_ar = models.TextField("الوصف (عربي)")
    desc_en = models.TextField("الوصف (إنجليزي)", blank=True)

    # bilingual nested arrays (assessment questions per type)
    question_list_ar = models.JSONField("قائمة الأسئلة (عربي)", default=list, blank=True)
    question_list_en = models.JSONField("قائمة الأسئلة (إنجليزي)", default=list, blank=True)

    order = models.IntegerField("الترتيب", default=0)
    published = models.BooleanField("منشور", default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "بطاقة تقييم"
        verbose_name_plural = "بطاقات التقييم"
        ordering = ["order", "id"]

    def __str__(self):
        return self.title_ar
