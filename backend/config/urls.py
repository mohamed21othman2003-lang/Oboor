from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include

admin.site.site_header = "لوحة تحكّم مركز عبور"
admin.site.site_title = "إدارة عبور"
admin.site.index_title = "الطلبات والمحتوى"

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("submissions.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
