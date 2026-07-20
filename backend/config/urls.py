from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include
from content import cms_api, cms_crud, cms_account, cms_analytics, preview as cms_preview
from submissions import cv_access

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
    path("api/cms/analytics/", cms_analytics.analytics_overview),
    path("api/cms/analytics/traffic/", cms_analytics.traffic_overview),
    path("api/cms/analytics/seo/", cms_analytics.seo_overview),
    # حساب الأدمن + إعادة تعيين كلمة المرور
    path("api/cms/account/email/", cms_account.update_email),
    path("api/cms/account/password/", cms_account.change_password),
    path("api/cms/account/smtp/", cms_account.email_settings),
    path("api/cms/account/smtp/test/", cms_account.email_settings_test),
    path("api/cms/password-reset/", cms_account.password_reset_request),
    path("api/cms/password-reset/confirm/", cms_account.password_reset_confirm),
    path("api/cms/upload/", cms_crud.upload),
    path("api/cms/cv/<str:token>/", cv_access.serve_cv),
    path("api/cms/preview/", cms_preview.save_preview),
    path("api/cms/collections/<str:type_key>/schema/", cms_crud.schema),
    path("api/cms/collections/<str:type_key>/reorder/", cms_crud.reorder),
    path("api/cms/collections/<str:type_key>/<int:pk>/reset/", cms_crud.reset_default),
    path("api/cms/collections/<str:type_key>/<int:pk>/", cms_crud.item),
    path("api/cms/collections/<str:type_key>/", cms_crud.collection),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
