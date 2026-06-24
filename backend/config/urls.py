from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include
from content import cms_api

admin.site.site_header = "لوحة تحكّم مركز عبور"
admin.site.site_title = "إدارة عبور"
admin.site.index_title = "الطلبات والمحتوى"

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("submissions.urls")),
    path("api/content/", include("content.urls")),
    # CMS المخصّص
    path("api/cms/login/", cms_api.login),
    path("api/cms/me/", cms_api.me),
    path("api/cms/stats/", cms_api.stats),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
