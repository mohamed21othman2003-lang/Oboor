# -*- coding: utf-8 -*-
from django.db import models


class JobOpening(models.Model):
    slug = models.SlugField("المعرّف (slug)", max_length=140, unique=True)

    title_ar = models.CharField("المسمى الوظيفي (عربي)", max_length=300, help_text="عنوان الوظيفة — يظهر في عنوان الصفحة وفي قائمة الوظائف.")
    title_en = models.CharField("المسمى الوظيفي (إنجليزي)", max_length=300, blank=True)
    department_ar = models.CharField("القسم (عربي)", max_length=300, help_text="يظهر في: وسوم أعلى الصفحة + جدول «تفاصيل الوظيفة».")
    department_en = models.CharField("القسم (إنجليزي)", max_length=300, blank=True)
    city_ar = models.CharField("المدينة (عربي)", max_length=300, help_text="يظهر في: الوسوم العلوية + جدول «تفاصيل الوظيفة» + كارت «ملخص الوظيفة» الجانبي.")
    city_en = models.CharField("المدينة (إنجليزي)", max_length=300, blank=True)
    employment_ar = models.CharField("نوع الدوام (عربي)", max_length=300, help_text="يظهر في: الوسوم العلوية + جدول «تفاصيل الوظيفة» + كارت «ملخص الوظيفة».")
    employment_en = models.CharField("نوع الدوام (إنجليزي)", max_length=300, blank=True)
    experience_ar = models.CharField("الخبرة المطلوبة (عربي)", max_length=300, help_text="سطر قصير (مثل: سنتان فأكثر) — يظهر في جدول «تفاصيل الوظيفة» + كارت «ملخص الوظيفة». (قائمة المتطلبات منفصلة بالأسفل.)")
    experience_en = models.CharField("الخبرة المطلوبة (إنجليزي)", max_length=300, blank=True)
    date_ar = models.CharField("تاريخ الطرح (عربي)", max_length=300, blank=True, help_text="يظهر في: الوسوم العلوية + جدول «تفاصيل الوظيفة».")
    date_en = models.CharField("تاريخ الطرح (إنجليزي)", max_length=300, blank=True)
    start_date_ar = models.CharField("تاريخ المباشرة المتوقع (عربي)", max_length=300, blank=True, help_text="يظهر في: جدول «تفاصيل الوظيفة» + كارت «ملخص الوظيفة».")
    start_date_en = models.CharField("تاريخ المباشرة المتوقع (إنجليزي)", max_length=300, blank=True)

    description_ar = models.TextField("الوصف الوظيفي (عربي)", help_text="فقرة «الوصف الوظيفي» في متن الصفحة.")
    description_en = models.TextField("الوصف الوظيفي (إنجليزي)", blank=True)

    responsibilities_ar = models.JSONField("المهام والمسؤوليات (عربي)", default=list, blank=True, help_text="قائمة «المهام والمسؤوليات» في متن الصفحة.")
    responsibilities_en = models.JSONField("المهام والمسؤوليات (إنجليزي)", default=list, blank=True)
    requirements_ar = models.JSONField("المتطلبات (عربي)", default=list, blank=True, help_text="قائمة «الخبرة المطلوبة» (النقاط) في متن الصفحة.")
    requirements_en = models.JSONField("المتطلبات (إنجليزي)", default=list, blank=True)

    is_new = models.BooleanField("جديد", default=False, help_text="عند تفعيله يظهر وسم «جديد» بجوار الوظيفة في القائمة.")
    order = models.IntegerField("الترتيب", default=0)
    published = models.BooleanField("منشور", default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "وظيفة"
        verbose_name_plural = "الوظائف"
        ordering = ["order", "id"]

    def __str__(self):
        return self.title_ar
