# -*- coding: utf-8 -*-
from rest_framework import generics, serializers
from .m_success import SuccessStory
from .image_utils import ResolvedImageMixin


class SuccessStorySerializer(ResolvedImageMixin):
    class Meta:
        model = SuccessStory
        fields = [
            "slug",
            "name_ar", "name_en",
            "age_ar", "age_en",
            "category_ar", "category_en",
            "duration_label_ar", "duration_label_en",
            "before_ar", "before_en",
            "after_ar", "after_en",
            "quote_ar", "quote_en",
            "meta_duration_ar", "meta_duration_en",
            "meta_age_ar", "meta_age_en",
            "author_ar", "author_en",
            "image", "order",
        ]


from .preview import PreviewListMixin


class SuccessStoryList(PreviewListMixin, generics.ListAPIView):
    serializer_class = SuccessStorySerializer

    def get_queryset(self):
        return SuccessStory.objects.filter(published=True)
