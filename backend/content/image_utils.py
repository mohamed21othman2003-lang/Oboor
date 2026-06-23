from rest_framework import serializers


class ResolvedImageMixin(serializers.ModelSerializer):
    """يجعل حقل `image` في الـ API يرجّع رابط الصورة المرفوعة (image_file) إن وُجدت،
    وإلا المسار النصّي القديم (image). الواجهة تظل تقرأ `image` كما هي."""

    image = serializers.SerializerMethodField()

    def get_image(self, obj):
        f = getattr(obj, "image_file", None)
        if f:
            request = self.context.get("request")
            try:
                url = f.url
            except ValueError:
                url = ""
            if url:
                return request.build_absolute_uri(url) if request else url
        return getattr(obj, "image", "") or ""
