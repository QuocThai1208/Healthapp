from collections import defaultdict
from rest_framework import viewsets, generics, permissions
from rest_framework.response import Response
from . import serializers
from .models import PredictedResult


class PredictedResultViewSet(viewsets.ViewSet, generics.CreateAPIView):
    queryset = PredictedResult.objects.filter(active=True)
    serializer_class = serializers.PredictedResultSerializer
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request, *args, **kwargs):
        result = self.queryset.filter(user=request.user,
                                      exercise=request.query_params.get('exercise_id'),
                                      session=request.query_params.get('session_id'),
                                      day=request.query_params.get('day')).order_by('-created_date')

        serializer_data = self.serializer_class(result, many=True).data

        group_data = defaultdict(list)
        for item in serializer_data:
            date = item['created_date_only']
            group_data[date].append(item)
        return Response(group_data)
