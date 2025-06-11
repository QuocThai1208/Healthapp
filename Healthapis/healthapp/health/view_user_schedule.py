from rest_framework.response import Response
from rest_framework import viewsets, generics, status, permissions
from . import serializers
from rest_framework.decorators import action
from .models import  UserSchedule, UserPersonalSchedule
from .paginators import ItemPaginator


class UserScheduleViewSet(viewsets.ViewSet, generics.ListCreateAPIView, generics.UpdateAPIView, generics.DestroyAPIView):
    queryset = UserSchedule.objects.filter(active=True)
    serializer_class = serializers.UserScheduleSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class =ItemPaginator

    def destroy(self, request, *args, **kwargs):
        us = self.get_object()
        if us:
            us.delete()
            record = UserSchedule.objects.filter(user=request.user.id).first()
            if not record:
                record = UserPersonalSchedule.objects.filter(user=request.user.id).first()
            if record:
                record.flag = True
                record.save()
            return Response(None, status=status.HTTP_204_NO_CONTENT)
        return Response("Không tìm thấy bản ghi", status=status.HTTP_404_NOT_FOUND)

    def partial_update(self, request, *args, **kwargs):
        user=self.request.user
        ups = UserPersonalSchedule.objects.filter(user=user, flag=True).first()
        if ups:
            ups.flag = False
            ups.save()
        else:
            us = UserSchedule.objects.filter(flag=True).first()
            if us:
                us.flag = False
                us.save()
        us_select = self.get_object()
        us_select.flag = True
        us_select.save()
        return Response("Cập nhật thành công", status=status.HTTP_200_OK)

    def get_queryset(self):
        schedules = self.request.user.userschedule_set.filter(active=True)
        return schedules

    @action(methods=['get'], detail=False, url_path='schedule-active')
    def get_schedule_active(self, request):
        schedule_active = UserSchedule.objects.filter(user=request.user.id, flag=True)
        return Response(serializers.UserScheduleSerializer(schedule_active, many=True).data, status=status.HTTP_200_OK)
