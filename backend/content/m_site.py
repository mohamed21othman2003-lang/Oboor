from django.db import models


class SiteSettings(models.Model):
    """إعدادات الموقع العامة (صف واحد) — اللوجو، التواصل، السوشيال،
    نصوص الهيدر والفوتر. يتحكّم فيها فريق المركز من مكان واحد."""

    # الهوية
    logo = models.ImageField("اللوجو", upload_to="site/", blank=True)
    logo_path = models.CharField("مسار اللوجو (احتياطي)", max_length=300, blank=True,
                                 default="/figma/imgImage.png",
                                 help_text="يُستخدم لو لم تُرفع صورة لوجو")
    site_name_ar = models.CharField("اسم الموقع (عربي)", max_length=200, default="مركز عبور للرعاية والتأهيل")
    site_name_en = models.CharField("اسم الموقع (إنجليزي)", max_length=200, blank=True, default="Oboor Center for Care & Rehabilitation")
    brand_desc_ar = models.TextField("وصف المركز في الفوتر (عربي)", blank=True)
    brand_desc_en = models.TextField("وصف المركز في الفوتر (إنجليزي)", blank=True)

    # التواصل
    email = models.CharField("البريد الإلكتروني", max_length=120, blank=True)
    phone_unified = models.CharField("الرقم الموحّد", max_length=40, blank=True)
    phone_customer = models.CharField("خدمة العملاء", max_length=40, blank=True)
    whatsapp = models.CharField(
        "رقم الواتساب", max_length=40, blank=True,
        help_text="رقم الواتساب بالصيغة الدولية بدون + أو مسافات (مثال: 966920003452). يُستخدم في كل أزرار «تواصل عبر واتساب» بالموقع. إن تُرك فارغاً يُستخدم الرقم الافتراضي.",
    )
    website = models.CharField("الموقع الإلكتروني", max_length=120, blank=True)
    main_branch_ar = models.CharField("الفرع الرئيسي (عربي)", max_length=200, blank=True)
    main_branch_en = models.CharField("الفرع الرئيسي (إنجليزي)", max_length=200, blank=True)

    # روابط السوشيال (اتركها فارغة لإخفاء الأيقونة)
    x_url = models.CharField("رابط إكس (تويتر)", max_length=200, blank=True)
    instagram_url = models.CharField("رابط انستغرام", max_length=200, blank=True)
    tiktok_url = models.CharField("رابط تيك توك", max_length=200, blank=True)
    whatsapp_url = models.CharField("رابط واتساب", max_length=200, blank=True)
    youtube_url = models.CharField("رابط يوتيوب", max_length=200, blank=True)
    snapchat_url = models.CharField("رابط سناب شات", max_length=200, blank=True)

    # أزرار الهيدر
    cta_admission_ar = models.CharField("زر الالتحاق (عربي)", max_length=80, blank=True)
    cta_admission_en = models.CharField("زر الالتحاق (إنجليزي)", max_length=80, blank=True)
    cta_contact_ar = models.CharField("زر التواصل (عربي)", max_length=80, blank=True)
    cta_contact_en = models.CharField("زر التواصل (إنجليزي)", max_length=80, blank=True)

    # عناوين أقسام الفوتر
    footer_quick_title_ar = models.CharField("عنوان الروابط السريعة (عربي)", max_length=80, blank=True)
    footer_quick_title_en = models.CharField("عنوان الروابط السريعة (إنجليزي)", max_length=80, blank=True)
    footer_services_title_ar = models.CharField("عنوان الخدمات (عربي)", max_length=80, blank=True)
    footer_services_title_en = models.CharField("عنوان الخدمات (إنجليزي)", max_length=80, blank=True)
    footer_contact_title_ar = models.CharField("عنوان التواصل (عربي)", max_length=80, blank=True)
    footer_contact_title_en = models.CharField("عنوان التواصل (إنجليزي)", max_length=80, blank=True)
    privacy_label_ar = models.CharField("نص سياسة الخصوصية (عربي)", max_length=120, blank=True)
    privacy_label_en = models.CharField("نص سياسة الخصوصية (إنجليزي)", max_length=120, blank=True)
    copyright_ar = models.TextField("حقوق النشر (عربي)", blank=True)
    copyright_en = models.TextField("حقوق النشر (إنجليزي)", blank=True)

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "إعدادات الموقع"
        verbose_name_plural = "إعدادات الموقع"

    def __str__(self):
        return "إعدادات الموقع"

    def save(self, *args, **kwargs):
        # صف واحد فقط (singleton)
        self.pk = 1
        super().save(*args, **kwargs)
