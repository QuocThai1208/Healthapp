from datetime import datetime

from rest_framework import viewsets, generics, permissions
from django.utils import timezone
from . import serializers
from .models import HealthDiary


class HealthDiaryViewSet(viewsets.ViewSet, generics.ListCreateAPIView):
    serializer_class = serializers.HealthDiarySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        day = self.request.query_params.get('day')
        day = datetime.strptime(day, '%Y-%m-%d').date()
        return HealthDiary.objects.filter(user=self.request.user, created_date__date=day, active=True)
