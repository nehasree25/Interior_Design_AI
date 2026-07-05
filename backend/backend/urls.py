from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),

    path('api/design/', include('ai_design.urls')),

    path('api/auth/', include('authentication.urls')),
]