from django.urls import path
from .views import GenerateDesignView

urlpatterns = [
    path(
        "generate/",
        GenerateDesignView.as_view(),
        name="generate-design"
    ),
]