from rest_framework import generics, serializers
from .m_techniques import Technique
from .image_utils import ResolvedImageMixin


class TechniqueSerializer(ResolvedImageMixin):
    class Meta:
        model = Technique
        fields = ["slug", "title_ar", "title_en", "badge_ar", "badge_en",
                  "about_ar", "about_en", "targets_ar", "targets_en",
                  "offers_ar", "offers_en", "offer_icons",
                  "help_section_ar", "help_section_en", "image", "order"]


class TechniqueList(generics.ListAPIView):
    serializer_class = TechniqueSerializer

    def get_queryset(self):
        return Technique.objects.filter(published=True)
