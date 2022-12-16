from django.shortcuts import render
from rest_framework_simplejwt.views import TokenObtainPairView
from user.serializers import MyTokenObtainPairSerializer

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer