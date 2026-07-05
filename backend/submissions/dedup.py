"""منع تكرار الطلبات: لو وصل طلب بنفس البيانات المُحدِّدة لطلب سابق نرفضه
ونرجّع 409 برسالة واضحة بدل تخزين نسخة مكرّرة."""
from rest_framework import status
from rest_framework.response import Response

# رسالة موحّدة تظهر للمستخدم (تُترجَم في الواجهة حسب اللغة)
DUPLICATE_MESSAGE = "تم إرسال هذا الطلب مسبقاً بالفعل."


class DuplicateGuardMixin:
    """يمنع إنشاء سجل مطابق لسجل سابق في الحقول المُحدِّدة (dedup_fields).

    يُدمج قبل generics.CreateAPIView. عند العثور على تطابق يرجّع 409
    مع {"code": "duplicate"} حتى تميّزه الواجهة عن بقية الأخطاء."""

    dedup_fields: list[str] = []

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        if self.dedup_fields:
            data = serializer.validated_data
            # الحقول غير المُرسَلة تُعامَل كنص فارغ (مثلما تُخزَّن في قاعدة البيانات)،
            # مع الحفاظ على القيم الرقمية كما هي (مثل score=0) حتى يصحّ التطابق.
            filters = {}
            for f in self.dedup_fields:
                val = data.get(f, "")
                filters[f] = "" if val is None else val
            if self.get_queryset().filter(**filters).exists():
                return Response(
                    {"code": "duplicate", "detail": DUPLICATE_MESSAGE},
                    status=status.HTTP_409_CONFLICT,
                )

        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
