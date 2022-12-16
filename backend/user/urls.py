from django.urls import path
from user.views import MyTokenObtainPairView

urlpatterns = [
    path('api/auth/jwt/create',MyTokenObtainPairView.as_view(),name='token_obtain_pair'),
]
