# -*- coding: utf-8 -*-
from rest_framework import serializers, generics
from .m_assessment import AssessmentCard


class AssessmentCardSerializer(serializers.ModelSerializer):
    class Meta:
        model = AssessmentCard
        fields = ["slug", "key", "icon",
                  "title_ar", "title_en",
                  "desc_ar", "desc_en",
                  "duration_ar", "duration_en",
                  "questions_ar", "questions_en",
                  "age_range_ar", "age_range_en",
                  "question_list_ar", "question_list_en",
                  "order"]


from .preview import PreviewListMixin


class AssessmentCardList(PreviewListMixin, generics.ListAPIView):
    serializer_class = AssessmentCardSerializer

    def get_queryset(self):
        return AssessmentCard.objects.filter(published=True)
