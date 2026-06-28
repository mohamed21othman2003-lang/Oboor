from rest_framework import generics, serializers
from .m_clinical import ClinicalService
from .image_utils import ResolvedImageMixin


class ClinicalServiceSerializer(ResolvedImageMixin):
    class Meta:
        model = ClinicalService
        fields = ["slug", "title_ar", "title_en", "subtitle_ar", "subtitle_en",
                  "about_heading_ar", "about_heading_en", "about_ar", "about_en",
                  "about_list_ar", "about_list_en", "about_tag_ar", "about_tag_en",
                  "blocks_ar", "blocks_en", "image", "order", "published"]


from .preview import PreviewListMixin


class ClinicalServiceList(PreviewListMixin, generics.ListAPIView):
    serializer_class = ClinicalServiceSerializer

    def get_queryset(self):
        return ClinicalService.objects.filter(published=True)
