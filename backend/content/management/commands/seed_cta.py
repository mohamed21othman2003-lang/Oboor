"""يزرع «قسم التواصل السفلي (CTA)» لكل صفحة — البادج (tagline) + العنوان + الوصف —
كعنصر واحد key=main في بلوك cta. آمن: get_or_create.
النجمتان **...** في العنوان تلوّن ذلك الجزء بلون التصميم على الموقع.
شغّله مرّة بعد النشر:  python manage.py seed_cta
"""
from django.core.management.base import BaseCommand
from content.m_sections import SectionItem

# page -> dict(tagline_ar/en = البادج, title_ar/en = العنوان (بـ** للتلوين), text_ar/en = الوصف)
CTA = {
    "programs": dict(
        tagline_ar="خدمة العملاء متاحة على مدار الساعة", tagline_en="Customer service available around the clock",
        title_ar="هل تحتاج مساعدة في اختيار **الخدمة المناسبة؟**", title_en="Need help choosing **the right service?**",
        text_ar="يمكنك التواصل معنا لمساعدتك في اختيار البرنامج أو الخدمة الأنسب وفق احتياجات طفلك.",
        text_en="Contact us and we'll help you choose the program or service that best fits your child's needs."),
    "branches": dict(
        tagline_ar="فريقنا معك، في كل وقت", tagline_en="Our team is with you at all times.",
        title_ar="أتحتاجنا بجانبك لاختيار الوجهة؟", title_en="Need help choosing the right option?",
        text_ar="نحن هنا لنكون بوصلتك؛ نختار معًا الفرع الأقرب لروح طفلك، والأنسب لتحقيق طموحه.",
        text_en="We are here to guide you in finding the most suitable branch for your child's needs and potential, ensuring the best path toward their goals."),
    "success": dict(
        tagline_ar="الخطوة الأولى نحو التغير", tagline_en="The first step toward change",
        title_ar="ابدأ تقييم طفلك الآن", title_en="Start your child's assessment now",
        text_ar="التقييم المبكر هو بداية كل قصة نجاح. فريقنا من الأخصائيين المعتمدين جاهز لتقديم تقييم شامل ودقيق لوضع طفلك ورسم خطة تأهيلية مخصصة له.",
        text_en="Early assessment is the beginning of every success story. Our team of certified specialists is ready to provide a comprehensive, accurate assessment of your child and design a personalized rehabilitation plan.",
        data_ar=["تقييم شامل ومتخصص", "خطة علاجية مخصصة", "متابعة دورية مستمرة", "دعم الأسرة الكامل"],
        data_en=["Comprehensive specialized assessment", "Personalized treatment plan", "Ongoing periodic follow-up", "Full family support"]),
}


class Command(BaseCommand):
    help = "Seed the bottom CTA section (badge + title + subtitle) per page into the 'cta' block."

    def handle(self, *args, **opts):
        created = 0
        for page, fields in CTA.items():
            defaults = dict(fields); defaults["order"] = 0; defaults["published"] = True
            _, was = SectionItem.objects.get_or_create(page=page, block="cta", key="main", defaults=defaults)
            created += 1 if was else 0
            self.stdout.write(("created " if was else "exists  ") + page + "/cta")
        self.stdout.write(self.style.SUCCESS(f"CTA: {created} created, {len(CTA) - created} existed."))
