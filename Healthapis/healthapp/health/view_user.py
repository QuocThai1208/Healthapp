from rest_framework.response import Response
from rest_framework import viewsets, generics, status, permissions
from . import serializers
from rest_framework.decorators import action, permission_classes
from .models import User, Menu
from .google_fit import get_google_fit_water_intake, get_google_fit_steps, get_google_fit_heart_rate
from django.db.models import Q


class UserViewSet(viewsets.ViewSet, generics.ListCreateAPIView):
    queryset = User.objects.filter(is_active=True)
    serializer_class = serializers.UserSerializer

    def get_queryset(self):
        queryset = self.queryset
        key = self.request.query_params.get('key')

        if key == "expert":
            queryset = queryset.filter(Q(user_role=3) | Q(user_role=4))

        return queryset

    @action(methods=['get', 'patch'], url_path="current-user", detail=False,
            permission_classes=[permissions.IsAuthenticated])
    def get_current_user(self, request):
        if request.method.__eq__('PATCH'):
            u = request.user

            for key in request.data:
                if key in ['first_name', 'last_name', 'username', 'address', 'avatar', 'user_role']:
                    setattr(u, key, request.data[key])
                elif key in ['coach', 'nutritionist']:
                    if request.data[key]:
                        expert = User.objects.get(id=request.data[key])
                        setattr(u, key, expert)
                    else:
                        setattr(u, key, None)
                elif key.__eq__('password'):
                    u.set_password(request.data[key])
            u.save()
            return Response(serializers.UserSerializer(u).data)
        else:
            return Response(serializers.UserSerializer(request.user).data)

    @action(methods=['get'], url_path='current-user/health-data', detail=False)
    def get_health_data_current_user(self, request):
        access_token = request.GET.get("access_token")
        if not access_token:
            return Response({"error": "Access token is missing"})
        return Response({'steps': get_google_fit_steps(access_token),
                         'heart_rate()': get_google_fit_heart_rate(access_token),
                         'water_inTake(Lit)': get_google_fit_water_intake(access_token)}, status=status.HTTP_200_OK)

    @action(methods=['post'], url_path='current-user/menu', detail=False,
            permission_classes=[permissions.IsAuthenticated])
    def post_schedule(self, request):
        u = request.user
        u.menu = Menu.objects.get(id=request.data.get('menu'))
        u.save()
        return Response(serializers.UserSerializer(u).data, status=status.HTTP_200_OK)
