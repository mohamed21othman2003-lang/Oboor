from django.urls import path
from . import views
from .api_programs import ProgramList
from .api_clinical import ClinicalServiceList
from .api_techniques import TechniqueList
from .api_branches import BranchList
from .api_specialists import SpecialistList
from .api_careers import JobOpeningList
from .api_success import SuccessStoryList
from .api_assessment import AssessmentCardList
from .api_home import HeroSlideList, StatItemList, FeatureItemList, GalleryImageList
from .api_sections import SectionByPage, ServiceCardList
from .api_site import SiteSettingsView

urlpatterns = [
    path("news/", views.NewsList.as_view(), name="news-list"),
    path("programs/", ProgramList.as_view(), name="programs-list"),
    path("services/", ClinicalServiceList.as_view(), name="services-list"),
    path("techniques/", TechniqueList.as_view(), name="techniques-list"),
    path("branches/", BranchList.as_view(), name="branches-list"),
    path("specialists/", SpecialistList.as_view(), name="specialists-list"),
    path("careers/", JobOpeningList.as_view(), name="careers-list"),
    path("success/", SuccessStoryList.as_view(), name="success-list"),
    path("assessment/", AssessmentCardList.as_view(), name="assessment-list"),
    path("home/hero/", HeroSlideList.as_view(), name="home-hero-list"),
    path("home/stats/", StatItemList.as_view(), name="home-stats-list"),
    path("home/features/", FeatureItemList.as_view(), name="home-features-list"),
    path("gallery/", GalleryImageList.as_view(), name="gallery-list"),
    path("service-cards/", ServiceCardList.as_view(), name="service-cards-list"),
    path("site/", SiteSettingsView.as_view(), name="site-settings"),
    path("sections/<str:page>/", SectionByPage.as_view(), name="sections-by-page"),
]
