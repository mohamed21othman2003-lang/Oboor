from django.db import models


class EmailSettings(models.Model):
    """إعدادات خادم البريد (SMTP) — صف واحد (singleton).

    يملؤها الأدمن من صفحة «حسابي» ببيانات إيميله الرسمي، وتُستخدم لإرسال
    رسائل النظام (أهمّها رابط إعادة تعيين كلمة المرور).

    مهم أمنيًا: كلمة المرور (app password) لا تُعاد أبدًا في أي استجابة API؛
    تُكتب فقط. وهذا الموديل غير معروض في الـAPI العامة إطلاقًا.
    """

    SECURITY_CHOICES = [
        ("tls", "TLS (STARTTLS)"),
        ("ssl", "SSL"),
        ("none", "بدون تشفير"),
    ]

    enabled = models.BooleanField("مُفعّل", default=False)
    host = models.CharField("خادم SMTP", max_length=200, blank=True)
    port = models.PositiveIntegerField("المنفذ (Port)", default=587)
    security = models.CharField("نوع التشفير", max_length=10, choices=SECURITY_CHOICES, default="tls")
    username = models.CharField("اسم المستخدم (الإيميل)", max_length=200, blank=True)
    password = models.CharField("كلمة المرور (App Password)", max_length=500, blank=True)
    from_email = models.CharField("عنوان المُرسِل (From)", max_length=200, blank=True,
                                  help_text="إن تُرك فارغًا يُستخدم اسم المستخدم")
    from_name = models.CharField("اسم المُرسِل الظاهر", max_length=200, blank=True,
                                 default="مركز عبور للرعاية والتأهيل")

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "إعدادات البريد (SMTP)"
        verbose_name_plural = "إعدادات البريد (SMTP)"

    def __str__(self):
        return "إعدادات البريد (SMTP)"

    def save(self, *args, **kwargs):
        self.pk = 1  # صف واحد فقط
        super().save(*args, **kwargs)

    @classmethod
    def load(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj

    @property
    def sender(self):
        """عنوان المُرسِل الفعلي، مع الاسم الظاهر إن وُجد."""
        addr = (self.from_email or self.username or "").strip()
        name = (self.from_name or "").strip()
        return f"{name} <{addr}>" if name and addr else addr

    def is_ready(self):
        return bool(self.enabled and self.host and self.username and self.password)

    def build_connection(self):
        """ينشئ اتصال SMTP من هذه الإعدادات (بدون الاعتماد على settings)."""
        from django.core.mail import get_connection
        return get_connection(
            backend="django.core.mail.backends.smtp.EmailBackend",
            host=self.host,
            port=self.port,
            username=self.username,
            password=self.password,
            use_tls=(self.security == "tls"),
            use_ssl=(self.security == "ssl"),
            timeout=15,
        )
