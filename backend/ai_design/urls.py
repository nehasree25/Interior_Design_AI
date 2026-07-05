from django.urls import path
from .views import GenerateDesignView, DesignHistoryView

urlpatterns = [
    path("generate/", GenerateDesignView.as_view(), name="generate-design"),
    path("history/", DesignHistoryView.as_view(), name="design-history"),
]
