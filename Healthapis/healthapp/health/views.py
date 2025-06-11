from collections import defaultdict
from datetime import timedelta
from django.contrib.contenttypes.models import ContentType
from django.utils import timezone
from django.db.models import Q
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework import viewsets, generics, status, permissions

from . import serializers, perms, paginators
from rest_framework.decorators import action, permission_classes
from .models import Tag, Schedule, GroupSchedule, Session, ActualResult, Diet, Menu, MenuOfDay, Ingredient, Reminder, \
    HealthInformation, HealthGoal, ResultOfSession, MenuIngredient, Meal, UserIngredient, Message, Expert, \
    User, \
    PersonalSchedule


class UserIngredientViewSet(viewsets.ViewSet, generics.ListCreateAPIView):
    queryset = UserIngredient.objects.filter(active=True)
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return serializers.UserIngredientCreateSerializer
        return serializers.UserIngredientSerializer

    def get_queryset(self):
        queryset = self.queryset
        menu_of_day_id = self.request.query_params.get('menu-of-day')
        user = self.request.user

        if menu_of_day_id:
            queryset = queryset.filter(user=user, meal__menu_of_day_id=menu_of_day_id)

        return queryset


class MenuIngredientViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = MenuIngredient.objects.filter(active=True)
    serializer_class = serializers.MenuIngredientSerializer

    def get_queryset(self):
        queryset = self.queryset

        menu_id = self.request.query_params.get('menu_id')
        if menu_id:
            queryset = queryset.filter(menu_of_day=menu_id)
        return queryset


class CustomerViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = User.objects.filter(is_active=True)
    serializer_class = serializers.UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = self.queryset
        u = self.request.user

        if u.user_role == 3:
            queryset = u.clients_as_nutritionist.filter(is_active=True)
        if u.user_role == 4:
            queryset = u.clients_as_coach.filter(is_active=True)
        return queryset


class ExpertViewSet(viewsets.ViewSet, generics.ListCreateAPIView):
    queryset = Expert.objects.all()
    serializer_class = serializers.ExpertSerializer

    @action(methods=['patch'], url_path="expert", detail=False,
            permission_classes=[permissions.IsAuthenticated])
    def patch_expert(self, request):
        u = request.user

        expert = Expert.objects.filter(user=u).first()

        for key in request.data:
            if key in ['certification', 'experience_years', 'specialties']:
                setattr(expert, key, request.data[key])
        expert.save()
        return Response(serializers.ExpertSerializer(expert).data)

    @action(methods=['get'], url_path="expert", detail=False, permission_classes=[permissions.IsAuthenticated])
    def get_expert(self, request):
        user = request.user
        expert = Expert.objects.filter(user=user).first()
        return Response(serializers.ExpertSerializer(expert).data)


class HealthGoalViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = HealthGoal.objects.filter(active=True)
    serializer_class = serializers.HealthGoalSerializer

    def get_queryset(self):
        queryset = self.queryset

        id = self.request.query_params.get('id')
        if id:
            queryset = queryset.filter(id=id)
        return queryset


class HealthInfoViewSet(viewsets.ViewSet, generics.ListAPIView, generics.CreateAPIView, generics.UpdateAPIView):
    serializer_class = serializers.HealthInfoSerializer
    permission_classes = [perms.IsHealthInfoOwner]

    def get_queryset(self):
        return HealthInformation.objects.filter(user=self.request.user, active=True)


class GroupScheduleSViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = GroupSchedule.objects.filter(active=True)
    serializer_class = serializers.GroupScheduleSerializer
    pagination_class = paginators.ItemPracticePaginator

    @action(methods=['get'], url_path='schedules', detail=True)
    def get_schedule(self, request, pk):
        tag_ids = self.request.query_params.get('tag_ids')
        if tag_ids:
            schedules = self.get_object().schedule_set.filter(active=True, Tags__in=tag_ids)
        else:
            schedules = self.get_object().schedule_set.filter(active=True)

        page = self.paginate_queryset(schedules)
        if page:
            serializer = serializers.ScheduleSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        return Response(serializers.ScheduleSerializer(schedules, many=True).data, status=status.HTTP_200_OK)


class TagViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Tag.objects.filter(active=True)
    serializer_class = serializers.TagSerializer


class ScheduleViewSet(viewsets.ViewSet, generics.RetrieveAPIView):
    queryset = Schedule.objects.prefetch_related('Tags').filter(active=True)
    serializer_class = serializers.ScheduleDetailSerializer

    @action(methods=['get'], detail=True, url_path='session')
    def get_session(self, request, pk):
        parent_obj = self.get_object()
        content_type = ContentType.objects.get_for_model(parent_obj.__class__)

        sessions = Session.objects.filter(
            content_type=content_type,
            object_id=parent_obj.id,
            active=True,
        ).prefetch_related('exercise').order_by('id')
        return Response(serializers.SessionSerializer(sessions, many=True).data, status=status.HTTP_200_OK)


class PersonalScheduleViewSet(viewsets.ViewSet, generics.RetrieveDestroyAPIView, generics.CreateAPIView,
                              generics.UpdateAPIView):
    queryset = PersonalSchedule.objects.filter(active=True)
    serializer_class = serializers.PersonalScheduleSerializer
    permission_classes = [permissions.IsAuthenticated]


    @action(methods=['get'], detail=True, url_path='session')
    def get_session(self, request, pk):
        parent_obj = self.get_object()
        content_type = ContentType.objects.get_for_model(parent_obj.__class__)

        sessions = Session.objects.filter(
            content_type=content_type,
            object_id=parent_obj.id,
            active=True,
        ).prefetch_related('exercise').order_by('id')
        return Response(serializers.SessionSerializer(sessions, many=True).data, status=status.HTTP_200_OK)


class SessionViewSet(viewsets.ViewSet, generics.RetrieveAPIView, generics.CreateAPIView, generics.DestroyAPIView):
    queryset = Session.objects.prefetch_related('exercise').filter(active=True)
    serializer_class = serializers.SessionDetailSerializer

    @action(methods=['get'], url_path='result', detail=True)
    def get_result(self, request, pk):
        results = self.get_object().resultofsession_set.filter(active=True)
        return Response(serializers.ResultOfSessionSerializer(results, many=True).data, status=status.HTTP_200_OK)


class ResultOfSessionViewSet(viewsets.ViewSet, generics.ListCreateAPIView, generics.UpdateAPIView):
    queryset = ResultOfSession.objects.filter(active=True)
    serializer_class = serializers.ResultOfSessionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = self.queryset
        user_id = self.request.user.id
        if user_id:
            queryset = queryset.filter(user=user_id)

        return queryset


class ActualResultViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = ActualResult.objects.filter(active=True)
    serializer_class = serializers.ActualResultSerializer

    def get_queryset(self):
        queryset = self.queryset

        exercise_id = self.request.query_params.get('exercise_id')
        schedule_id = self.request.query_params.get('schedule_id')
        if exercise_id and schedule_id:
            queryset = queryset.filter(exercise=exercise_id, schedule=schedule_id)
        return queryset


class DietViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Diet.objects.filter(active=True)
    serializer_class = serializers.DietSerializer
    pagination_class = paginators.ItemDietPaginator

    def get_queryset(self):
        queryset = self.queryset
        health_goal = self.request.query_params.get('health_goal')

        if health_goal:
            queryset = queryset.filter(health_goal=health_goal)
        return queryset

    @action(methods=['get'], url_path='menu', detail=True)
    def get_menu(self, request, pk):
        menus = self.get_object().menu_set.filter(active=True)
        page = self.paginate_queryset(menus)
        if page:
            serializer = serializers.MenuSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        return Response(serializers.MenuSerializer(menus, many=True).data, status=status.HTTP_200_OK)

    @action(methods=['get'], url_path='eating-method', detail=True)
    def get_eating_method(self, request, pk):
        eating_method = self.get_object().eatingmethod
        return Response(serializers.EatingMethodSerializer(eating_method).data, status=status.HTTP_200_OK)


class MenuViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Menu.objects.filter(active=True)
    serializer_class = serializers.MenuSerializer

    @action(methods=['get'], url_path='menu-of-day', detail=True)
    def get_menu_of_day(self, request, pk):
        menu_of_days = self.get_object().menuofday_set.filter(active=True)
        return Response(serializers.MenuOfDaySerializer(menu_of_days, many=True).data, status=status.HTTP_200_OK)


class MenuOfDayViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = MenuOfDay.objects.filter(active=True)
    serializer_class = serializers.MenuOfDayDetailSerializer

    @action(methods=['get'], url_path='meal', detail=True)
    def get_menu_of_day(self, request, pk):
        meals = self.get_object().meal_set.filter(active=True)
        return Response(serializers.MealSerializer(meals, many=True).data, status=status.HTTP_200_OK)


class MealViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Meal.objects.filter(active=True)
    serializer_class = serializers.MealSerializer

    def get_queryset(self):
        queryset = self.queryset
        menu_of_day_id = self.request.query_params.get('menu-of-day')
        if menu_of_day_id:
            queryset = queryset.filter(menu_of_day=menu_of_day_id)
        return queryset

class IngredientViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Ingredient.objects.filter(active=True)
    serializer_class = serializers.IngredientDetailSerializer
    pagination_class = paginators.ItemIngredientPaginator

    def get_queryset(self):
        queryset = self.queryset
        q = self.request.query_params.get('q')
        if q:
            queryset = queryset.filter(name__icontains=q)
        return queryset


    @action(methods=['get'], detail=True, url_path='nutrients')
    def get_nutrients(self, request, pk):
        nutrients = self.get_object().nutrients
        return Response(serializers.NutrientsSerializer(nutrients).data, status=status.HTTP_200_OK)


class ReminderViewSet(viewsets.ViewSet, generics.ListAPIView, generics.CreateAPIView, generics.DestroyAPIView,
                      generics.UpdateAPIView):
    serializer_class = serializers.ReminderSerializer
    permission_classes = [perms.IsReminderOwner]

    def get_queryset(self):
        return Reminder.objects.filter(user=self.request.user).order_by('reminder_time')


class MessageViewSet(viewsets.ViewSet, generics.ListCreateAPIView):
    serializer_class = serializers.MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Message.objects.filter(Q(sender=user) | Q(receiver=user), active=True).order_by('created_date')

    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)
