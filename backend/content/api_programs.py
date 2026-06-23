from rest_framework import serializers, generics
from .m_programs import ProgramDetail
from .image_utils import ResolvedImageMixin


class ProgramDetailSerializer(ResolvedImageMixin):
    class Meta:
        model = ProgramDetail
        fields = [
            "slug",
            "title_ar", "title_en",
            "subtitle_ar", "subtitle_en",
            "about_ar", "about_en",
            "philosophy_intro_ar", "philosophy_intro_en",
            "philosophy_ar", "philosophy_en",
            "methods_ar", "methods_en",
            "duration_ar", "duration_en",
            "target_ar", "target_en",
            "target_tags_ar", "target_tags_en",
            "training_intro_ar", "training_intro_en",
            "training_areas_ar", "training_areas_en",
            "target_list_ar", "target_list_en",
            "stations_intro_ar", "stations_intro_en",
            "stations_ar", "stations_en",
            "image", "order", "published",
        ]


class ProgramList(generics.ListAPIView):
    serializer_class = ProgramDetailSerializer

    def get_queryset(self):
        return ProgramDetail.objects.filter(published=True)
