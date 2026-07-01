from django.db import models


class HeroSlide(models.Model):
    key = models.SlugField("المعرّف (key)", max_length=140, unique=True)

    badge_ar = models.CharField("الشارة العلوية (عربي)", max_length=300)
    badge_en = models.CharField("الشارة العلوية (إنجليزي)", max_length=300, blank=True)
    heading_ar = models.CharField("العنوان الرئيسي (عربي)", max_length=300)
    heading_en = models.CharField("العنوان الرئيسي (إنجليزي)", max_length=300, blank=True)
    desc_ar = models.TextField("الوصف (عربي)")
    desc_en = models.TextField("الوصف (إنجليزي)", blank=True)
    cta_ar = models.CharField("زر الإجراء (عربي)", max_length=300)
    cta_en = models.CharField("زر الإجراء (إنجليزي)", max_length=300, blank=True)
    cta_href = models.CharField(
        "رابط زر الإجراء", max_length=300, blank=True,
        help_text="وجهة الزر عند الضغط: رابط داخلي مثل /programs أو /branches، أو رابط كامل https://…. إن تُرك فارغاً يذهب إلى صفحة البرامج.",
    )

    image = models.CharField("صورة الخلفية", max_length=300, blank=True)
    image_file = models.ImageField("رفع صورة", upload_to="content/", blank=True)
    order = models.IntegerField("الترتيب", default=0)
    published = models.BooleanField("منشور", default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "شريحة هيرو"
        verbose_name_plural = "شرائح الهيرو"
        ordering = ["order", "id"]

    def __str__(self):
        return self.heading_ar


class StatItem(models.Model):
    key = models.SlugField("المعرّف (key)", max_length=140, unique=True)

    label_ar = models.CharField("العنوان (عربي)", max_length=300)
    label_en = models.CharField("العنوان (إنجليزي)", max_length=300, blank=True)
    note_ar = models.CharField("الوصف (عربي)", max_length=300, blank=True)
    note_en = models.CharField("الوصف (إنجليزي)", max_length=300, blank=True)

    value = models.CharField("الرقم", max_length=60, blank=True)
    icon = models.CharField("الأيقونة", max_length=60, blank=True)
    order = models.IntegerField("الترتيب", default=0)
    published = models.BooleanField("منشور", default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "رقم إنجاز"
        verbose_name_plural = "أرقام الإنجاز"
        ordering = ["order", "id"]

    def __str__(self):
        return self.label_ar


class FeatureItem(models.Model):
    key = models.SlugField("المعرّف (key)", max_length=140, unique=True)

    title_ar = models.CharField("العنوان (عربي)", max_length=300)
    title_en = models.CharField("العنوان (إنجليزي)", max_length=300, blank=True)
    note_ar = models.TextField("الوصف (عربي)", blank=True)
    note_en = models.TextField("الوصف (إنجليزي)", blank=True)

    icon = models.CharField("الأيقونة", max_length=60, blank=True)
    order = models.IntegerField("الترتيب", default=0)
    published = models.BooleanField("منشور", default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "ميزة «لماذا عبور»"
        verbose_name_plural = "مميزات «لماذا عبور»"
        ordering = ["order", "id"]

    def __str__(self):
        return self.title_ar


class GalleryImage(models.Model):
    key = models.SlugField("المعرّف (key)", max_length=140, unique=True)

    caption_ar = models.CharField("الوصف (عربي)", max_length=300)
    caption_en = models.CharField("الوصف (إنجليزي)", max_length=300, blank=True)

    image = models.CharField("الصورة", max_length=300, blank=True)
    image_file = models.ImageField("رفع صورة", upload_to="content/", blank=True)
    order = models.IntegerField("الترتيب", default=0)
    published = models.BooleanField("منشور", default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "صورة المعرض"
        verbose_name_plural = "صور المعرض"
        ordering = ["order", "id"]

    def __str__(self):
        return self.caption_ar
