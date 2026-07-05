"""اختبارات منع تكرار الطلبات (dedup) — تعمل على قاعدة اختبار معزولة."""
from rest_framework.test import APITestCase
from .models import ContactMessage, AdmissionRequest, AssessmentResult, JobApplication


class DuplicateGuardTests(APITestCase):
    def _post_twice(self, url, payload, model):
        r1 = self.client.post(url, payload, format="json")
        self.assertEqual(r1.status_code, 201, r1.content)
        r2 = self.client.post(url, payload, format="json")
        self.assertEqual(r2.status_code, 409, r2.content)
        self.assertEqual(r2.json().get("code"), "duplicate")
        self.assertEqual(model.objects.count(), 1)  # لم تُخزَّن نسخة ثانية

    def test_contact_duplicate_blocked(self):
        self._post_twice("/api/contact/", {
            "name": "Test User", "phone": "0500000001", "email": "t@e.com",
            "branch": "فرع النرجس", "type": "استفسار", "message": "hello",
        }, ContactMessage)

    def test_contact_different_message_allowed(self):
        base = {"name": "Test User", "phone": "0500000001", "branch": "فرع النرجس"}
        self.client.post("/api/contact/", {**base, "message": "one"}, format="json")
        r = self.client.post("/api/contact/", {**base, "message": "two"}, format="json")
        self.assertEqual(r.status_code, 201)
        self.assertEqual(ContactMessage.objects.count(), 2)

    def test_admission_duplicate_blocked(self):
        self._post_twice("/api/admission/", {
            "child_name": "Child", "child_age": "6", "gender": "ذكر", "city": "الرياض",
            "branch": "فرع النرجس", "parent_name": "Parent", "phone": "0500000002",
            "case_type": "اضطراب طيف التوحد", "notes": "n",
        }, AdmissionRequest)

    def test_career_duplicate_blocked(self):
        self._post_twice("/api/career/", {
            "job": "أخصائي", "name": "Applicant", "phone": "0500000003",
            "email": "a@e.com", "city": "الرياض", "branch": "فرع العليا",
            "current_role": "معلم", "experience": "3-5", "about": "about me",
        }, JobApplication)

    def test_assessment_duplicate_blocked(self):
        payload = {
            "assessment": "تقييم ADHD", "assessment_slug": "adhd",
            "level": "high", "score": 6, "answers": [{"q": "q1", "a": "لا"}],
            "parent_name": "Parent", "phone": "0500000004", "child_name": "Child",
            "age": "6", "gender": "ذكر", "city": "الرياض", "branch": "فرع النرجس",
        }
        self._post_twice("/api/assessment/", payload, AssessmentResult)

    def test_assessment_different_result_allowed(self):
        base = {
            "assessment": "تقييم ADHD", "assessment_slug": "adhd",
            "parent_name": "Parent", "phone": "0500000005", "child_name": "Child",
            "age": "6", "gender": "ذكر", "city": "الرياض", "branch": "فرع النرجس",
        }
        self.client.post("/api/assessment/", {**base, "level": "low", "score": 1, "answers": [{"q": "q1", "a": "نعم"}]}, format="json")
        r = self.client.post("/api/assessment/", {**base, "level": "high", "score": 6, "answers": [{"q": "q1", "a": "لا"}]}, format="json")
        self.assertEqual(r.status_code, 201)  # إعادة تقييم بنتيجة مختلفة تُقبل
        self.assertEqual(AssessmentResult.objects.count(), 2)
