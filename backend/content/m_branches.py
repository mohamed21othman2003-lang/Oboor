# -*- coding: utf-8 -*-
from django.db import models


class Branch(models.Model):
    slug = models.SlugField("المعرّف (slug)", max_length=140, unique=True)

    name_ar = models.CharField("اسم الفرع (عربي)", max_length=300)
    name_en = models.CharField("اسم الفرع (إنجليزي)", max_length=300, blank=True)

    area_ar = models.CharField("الحي (عربي)", max_length=300, blank=True)
    area_en = models.CharField("الحي (إنجليزي)", max_length=300, blank=True)

    city_ar = models.CharField("المدينة (عربي)", max_length=300)
    city_en = models.CharField("المدينة (إنجليزي)", max_length=300, blank=True)

    region_ar = models.CharField("المنطقة (عربي)", max_length=300, blank=True)
    region_en = models.CharField("المنطقة (إنجليزي)", max_length=300, blank=True)

    address_ar = models.TextField("العنوان (عربي)", blank=True)
    address_en = models.TextField("العنوان (إنجليزي)", blank=True)

    hours_ar = models.CharField("ساعات العمل (عربي)", max_length=300, blank=True)
    hours_en = models.CharField("ساعات العمل (إنجليزي)", max_length=300, blank=True)

    phone = models.CharField("رقم الهاتف", max_length=40, blank=True)

    services_ar = models.JSONField("الخدمات (عربي)", default=list, blank=True)
    services_en = models.JSONField("الخدمات (إنجليزي)", default=list, blank=True)

    is_new = models.BooleanField("فرع جديد", default=False)

    order = models.IntegerField("الترتيب", default=0)
    published = models.BooleanField("منشور", default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "فرع"
        verbose_name_plural = "الفروع"
        ordering = ["order", "id"]

    def __str__(self):
        return self.name_ar
