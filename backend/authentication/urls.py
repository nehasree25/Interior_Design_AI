from django.urls import path
from .views import (
    UserSignupView,
    UserLoginView,
    UserProfileView,
    UserLogoutView,
    CustomTokenRefreshView
)

app_name = 'authentication'

urlpatterns = [
    path('signup/', UserSignupView.as_view(), name='signup'),
    path('login/', UserLoginView.as_view(), name='login'),
    path('logout/', UserLogoutView.as_view(), name='logout'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('token/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),
]
