from rest_framework import generics, serializers
from .m_site import SiteSettings


class SiteSettingsSerializer(serializers.ModelSerializer):
    logo_url = serializers.SerializerMethodField()

    class Meta:
        model = SiteSettings
        exclude = ["id", "updated_at", "logo"]

    def get_logo_url(self, obj):
        # ترجع رابط اللوجو المرفوع لو موجود، وإلا المسار الاحتياطي
        if obj.logo:
            request = self.context.get("request")
            url = obj.logo.url
            return request.build_absolute_uri(url) if request else url
        return obj.logo_path


class SiteSettingsView(generics.RetrieveAPIView):
    serializer_class = SiteSettingsSerializer

    def get_object(self):
        return SiteSettings.objects.first()
