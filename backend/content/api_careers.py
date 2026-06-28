# -*- coding: utf-8 -*-
from rest_framework import generics, serializers
from .m_careers import JobOpening


class JobOpeningSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobOpening
        fields = [
            "slug", "is_new",
            "title_ar", "title_en",
            "department_ar", "department_en",
            "city_ar", "city_en",
            "employment_ar", "employment_en",
            "experience_ar", "experience_en",
            "date_ar", "date_en",
            "start_date_ar", "start_date_en",
            "description_ar", "description_en",
            "responsibilities_ar", "responsibilities_en",
            "requirements_ar", "requirements_en",
            "order",
        ]


from .preview import PreviewListMixin


class JobOpeningList(PreviewListMixin, generics.ListAPIView):
    serializer_class = JobOpeningSerializer

    def get_queryset(self):
        return JobOpening.objects.filter(published=True)
