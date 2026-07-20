from django.db import models


class ContactMessage(models.Model):
    name = models.CharField("الاسم", max_length=200)
    phone = models.CharField("الجوال", max_length=40)
    email = models.EmailField("البريد", blank=True)
    branch = models.CharField("الفرع", max_length=120, blank=True)
    type = models.CharField("النوع", max_length=60, blank=True)
    message = models.TextField("الرسالة", blank=True)
    created_at = models.DateTimeField("التاريخ", auto_now_add=True)

    class Meta:
        verbose_name = "رسالة تواصل"
        verbose_name_plural = "رسائل التواصل"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.name} — {self.phone}"


class AdmissionRequest(models.Model):
    child_name = models.CharField("اسم الطفل", max_length=200)
    child_age = models.CharField("العمر", max_length=40, blank=True)
    gender = models.CharField("الجنس", max_length=20, blank=True)
    city = models.CharField("المدينة", max_length=80, blank=True)
    branch = models.CharField("الفرع", max_length=120, blank=True)
    parent_name = models.CharField("ولي الأمر", max_length=200)
    phone = models.CharField("الجوال", max_length=40)
    email = models.EmailField("البريد", blank=True)
    case_type = models.CharField("نوع الحالة", max_length=120, blank=True)
    prev_sessions = models.CharField("جلسات تأهيل سابقة", max_length=20, blank=True)
    notes = models.TextField("ملاحظات", blank=True)
    created_at = models.DateTimeField("التاريخ", auto_now_add=True)

    class Meta:
        verbose_name = "طلب التحاق"
        verbose_name_plural = "طلبات الالتحاق"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.child_name} ({self.parent_name})"


class AssessmentResult(models.Model):
    LEVELS = [("high", "مرتفع"), ("medium", "متوسط"), ("low", "منخفض")]
    assessment = models.CharField("نوع التقييم", max_length=120, blank=True, default="")
    assessment_slug = models.CharField("المعرّف", max_length=60, blank=True)
    level = models.CharField("مستوى الحالة", max_length=10, choices=LEVELS, blank=True)
    score = models.IntegerField("الدرجة", default=0)
    answers = models.JSONField("الإجابات", default=list, blank=True)
    parent_name = models.CharField("ولي الأمر", max_length=200)
    phone = models.CharField("الجوال", max_length=40)
    email = models.EmailField("البريد", blank=True)
    child_name = models.CharField("اسم الطفل", max_length=200, blank=True)
    age = models.CharField("العمر", max_length=40, blank=True)
    gender = models.CharField("الجنس", max_length=20, blank=True)
    city = models.CharField("المدينة", max_length=80, blank=True)
    branch = models.CharField("الفرع", max_length=120, blank=True)
    created_at = models.DateTimeField("التاريخ", auto_now_add=True)

    class Meta:
        verbose_name = "نتيجة تقييم"
        verbose_name_plural = "نتائج التقييم"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.assessment} — {self.child_name or self.parent_name}"


class JobApplication(models.Model):
    job = models.CharField("الوظيفة", max_length=200, blank=True)
    name = models.CharField("الاسم", max_length=200)
    phone = models.CharField("الجوال", max_length=40)
    email = models.EmailField("البريد", blank=True)
    city = models.CharField("المدينة", max_length=80, blank=True)
    branch = models.CharField("الفرع", max_length=120, blank=True)
    current_role = models.CharField("المسمى الحالي", max_length=200, blank=True)
    experience = models.CharField("الخبرة", max_length=80, blank=True)
    about = models.TextField("نبذة", blank=True)
    cv = models.FileField("السيرة الذاتية", upload_to="cvs/", blank=True, null=True)
    created_at = models.DateTimeField("التاريخ", auto_now_add=True)

    class Meta:
        verbose_name = "طلب توظيف"
        verbose_name_plural = "طلبات التوظيف"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.name} — {self.job}"
