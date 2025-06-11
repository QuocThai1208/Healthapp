from collections import defaultdict
from datetime import timedelta, date

from cloudinary.cache.responsive_breakpoints_cache import instance
from django.utils import timezone

from django.db import transaction

from .models import User, HealthInformation, HealthGoal, Schedule, Tag, GroupSchedule, Exercise, Session, ActualResult, \
    PredictedResult, ResultOfSession, Instruct, UserSchedule, Diet, Menu, EatingMethod, MenuOfDay, Ingredient, \
    Nutrients, Dish, Meal, Reminder, HealthDiary, MenuIngredient, UserIngredient, Message, Expert, PersonalSchedule, \
    UserPersonalSchedule
from rest_framework import serializers
from django.contrib.contenttypes.models import ContentType


class HealthGoalSerializer(serializers.ModelSerializer):
    class Meta:
        model = HealthGoal
        fields = ['id', 'name']


class HealthInfoSerializer(serializers.ModelSerializer):
    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['health_goal'] = HealthGoalSerializer(instance.health_goal).data

        return data

    def create(self, validated_data):
        user = self.context['request'].user
        return HealthInfoSerializer.objects.create(user=user, **validated_data)

    class Meta:
        model = HealthInformation
        fields = ['id', 'height', 'weight', 'health_goal']


class TagSerializer(serializers.ModelSerializer):
    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['image'] = instance.image.url if instance.image else ''
        return data

    class Meta:
        model = Tag
        fields = ['id', 'name', 'image']


class GroupScheduleSerializer(serializers.ModelSerializer):
    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['image'] = instance.image.url if instance.image else ''
        return data

    class Meta:
        model = GroupSchedule
        fields = ['id', 'name', 'image']


class ScheduleSerializer(serializers.ModelSerializer):
    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['image'] = instance.image.url if instance.image else ''
        return data

    class Meta:
        model = Schedule
        fields = ['id', 'name', 'experience', 'image']


class PersonalScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = PersonalSchedule
        fields = ['id', 'name']


class ScheduleDetailSerializer(ScheduleSerializer):
    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['group_schedule'] = instance.group_schedule.name
        data['Tags'] = [tag.name for tag in instance.Tags.all()]
        return data

    class Meta:
        model = ScheduleSerializer.Meta.model
        fields = ScheduleSerializer.Meta.fields + ['Tags', 'total_day', 'describe', 'group_schedule']


class SessionSerializer(serializers.ModelSerializer):
    content_type = serializers.SlugRelatedField(
        slug_field='model',
        queryset=ContentType.objects.all()
    )

    class Meta:
        model = Session
        fields = ['id', 'name', 'content_type', 'object_id']


class ExerciseSerializer(serializers.ModelSerializer):
    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['image'] = instance.image.url if instance.image else ''
        return data

    class Meta:
        model = Exercise
        fields = ['id', 'name', 'image']


class ExerciseDetailSerializer(ExerciseSerializer):
    tag = TagSerializer(many=True)

    class Meta:
        model = ExerciseSerializer.Meta.model
        fields = ExerciseSerializer.Meta.fields + ['describe', 'tag']


class SessionDetailSerializer(SessionSerializer):
    exercise_write = serializers.PrimaryKeyRelatedField(queryset=Exercise.objects.all(), many=True, write_only=True)
    exercise = ExerciseSerializer(many=True, read_only=True)

    class Meta:
        model = SessionSerializer.Meta.model
        fields = SessionSerializer.Meta.fields + ['exercise', 'exercise_write']

    def create(self, validated_data):
        exercises = validated_data.pop('exercise_write', [])
        session = super().create(validated_data)
        session.exercise.set(exercises)
        return session


class ExpertSerializer(serializers.ModelSerializer):
    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['certification'] = instance.certification.url if instance.certification else ''
        data['user'] = UserSerializer(instance.user).data
        return data

    class Meta:
        model = Expert
        fields = '__all__'


class ResultOfSessionSerializer(serializers.ModelSerializer):
    created_date = serializers.SerializerMethodField()

    def validate_practice_time(self, value):
        if isinstance(value, int):
            return timedelta(seconds=value)
        return value

    def get_created_date(self, obj):
        return obj.created_date.strftime("%d/%m/%Y")

    def create(self, validated_data):
        today = timezone.now().date()
        user = self.context['request'].user
        session = validated_data.get('session')
        practice_time = validated_data.get('practice_time')

        r = ResultOfSession.objects.filter(user=user, session=session, created_date__date=today).first()
        if r:
            r.practice_time += practice_time
            r.save()
            instance = r
            return instance
        else:
            return ResultOfSession.objects.create(user=user, **validated_data)

    class Meta:
        model = ResultOfSession
        fields = ['id', 'session', 'user', 'practice_time', 'calo', 'workout_notes', 'created_date']


class ActualResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = ActualResult
        fields = ['id', 'exercise', 'schedule', 'set', 'rep', 'weight']


class PredictedResultSerializer(serializers.ModelSerializer):
    created_time_only = serializers.SerializerMethodField()
    created_date_only = serializers.SerializerMethodField()

    class Meta:
        model = PredictedResult
        fields = ['id', 'exercise', 'session', 'user', 'set', 'rep', 'weight', 'day', 'created_time_only',
                  'created_date_only']

    def get_created_time_only(self, obj):
        return obj.created_date.strftime("%H:%M")

    def get_created_date_only(self, obj):
        return obj.created_date.strftime("%d/%m/%Y")

    def create(self, validated_data):
        user = self.context['request'].user
        with transaction.atomic():
            # lưu đối tượng vừa được tạo
            predicted_result = PredictedResult.objects.create(user=user, **validated_data)

            result_session, _ = ResultOfSession.objects.get_or_create(
                session=predicted_result.session,
                user=predicted_result.user,
                created_date__date=predicted_result.created_date,
                defaults={
                    'practice_time': timedelta(seconds=0),
                    'calo': 0
                }
            )
            result_session.calo += (0.1 * predicted_result.weight * predicted_result.rep * predicted_result.set)
            result_session.save()

            health_diary, _ = HealthDiary.objects.get_or_create(
                user=user,
                created_date__date=predicted_result.created_date,
                defaults={
                    'calo_burned': result_session.calo,
                    'calo_intake': 0,
                    'weight': 0
                }
            )
            health_diary.calo_burned = result_session.calo
            health_diary.save()
            return predicted_result

class InstructSerializer(serializers.ModelSerializer):
    class Meta:
        model = Instruct
        fields = ['id', 'exercise', 'name', 'describe']


class UserScheduleSerializer(serializers.ModelSerializer):
    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['schedule'] = ScheduleDetailSerializer(instance.schedule).data
        return data

    def create(self, validated_data):
        user=self.context['request'].user
        schedule = validated_data.get('schedule')

        if UserSchedule.objects.filter(user=user, schedule=schedule, flag=True).exists():
            return serializers.ValidationError('Kế hoạch tập này đang được thưc hiện')

        us_exists = UserSchedule.objects.filter(user=user, schedule=schedule, flag=False).first()
        if us_exists:
            us_exists.flag = True
            us_exists.save()
            UserSchedule.objects.filter(user=user, flag=True).exclude(id=us_exists.id).update(flag=False)
            UserPersonalSchedule.objects.filter(user=user, flag=True).update(flag=False)
            return us_exists

        us = UserSchedule.objects.create(
            user=user,
            schedule=schedule,
        )
        UserSchedule.objects.filter(user=user).exclude(schedule=schedule).update(flag=False)
        UserPersonalSchedule.objects.filter(user=user, flag=True).update(flag=False)
        return us

    class Meta:
        model = UserSchedule
        fields = ['id', 'user', 'schedule', 'flag', 'type']


class UserPersonalScheduleSerializer(serializers.ModelSerializer):
    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['schedule'] = PersonalScheduleSerializer(instance.schedule).data
        return data

    def create(self, validated_data):
        user = self.context['request'].user
        schedule = validated_data['schedule']

        instance = UserPersonalSchedule.objects.create(user=user,**validated_data)

        UserPersonalSchedule.objects.filter(user=user).exclude(schedule=schedule).update(flag=False)
        UserSchedule.objects.filter(user=user).update(flag=False)

        return instance

    class Meta:
        model = UserPersonalSchedule
        fields = ['id','schedule', 'flag', 'type']


class DietSerializer(serializers.ModelSerializer):
    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['image'] = instance.image.url if instance.image else ''
        data['health_goal'] = HealthGoalSerializer(instance.health_goal).data
        return data

    class Meta:
        model = Diet
        fields = ['id', 'name', 'describe', 'health_goal', 'image']


class MenuSerializer(serializers.ModelSerializer):
    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['image'] = instance.image.url if instance.image else ''
        return data

    class Meta:
        model = Menu
        fields = ['id', 'diet', 'name', 'total_day']


class MenuOfDaySerializer(serializers.ModelSerializer):
    class Meta:
        model = MenuOfDay
        fields = ['id', 'day']


class IngredientSerializer(serializers.ModelSerializer):
    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['image'] = instance.image.url if instance.image else ''
        return data

    class Meta:
        model = Ingredient
        fields = ['id', 'name']


class MenuIngredientSerializer(serializers.ModelSerializer):
    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['ingredient'] = IngredientSerializer(instance.ingredient).data
        return data

    class Meta:
        model = MenuIngredient
        fields = '__all__'


class IngredientDetailSerializer(IngredientSerializer):
    class Meta:
        model = IngredientSerializer.Meta.model
        fields = IngredientSerializer.Meta.fields + ['image']


class MenuOfDayDetailSerializer(MenuOfDaySerializer):
    ingredient = IngredientSerializer(many=True)

    class Meta:
        model = MenuOfDaySerializer.Meta.model
        fields = MenuOfDaySerializer.Meta.fields + ['id', 'ingredient']


class NutrientsSerializer(serializers.ModelSerializer):
    ingredient = IngredientSerializer()

    class Meta:
        model = Nutrients
        fields = ['id', 'ingredient', 'unit', 'kcal', 'fat', 'protein', 'starch']


class EatingMethodSerializer(serializers.ModelSerializer):
    class Meta:
        model = EatingMethod
        fields = ['diet', 'introduce', 'principle', 'menu_building']


class DishSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dish
        fields = ['id', 'name']


class UserIngredientSerializer(serializers.ModelSerializer):
    ingredient = IngredientSerializer(read_only=True)

    class Meta:
        model = UserIngredient
        fields = '__all__'
        read_only_fields = ['user']


class UserIngredientCreateSerializer(UserIngredientSerializer):
    unit = serializers.FloatField()
    ingredient = serializers.PrimaryKeyRelatedField(queryset=Ingredient.objects.all())
    meal = serializers.PrimaryKeyRelatedField(queryset=Meal.objects.all())

    class Meta:
        model = UserIngredientSerializer.Meta.model
        fields = ['id', 'ingredient', 'unit', 'meal']

    def create(self, validated_data):
        user = self.context['request'].user
        ingredient = validated_data['ingredient']
        unit = validated_data['unit']
        meal = validated_data['meal']
        today = date.today()

        with transaction.atomic():
            exists = UserIngredient.objects.filter(user=user, meal=meal, ingredient=ingredient).first()
            if exists:
                exists.unit += unit
                exists.save()
                instance = exists
            else:
                instance = UserIngredient.objects.create(user=user, **validated_data)

            user_ingre = UserIngredient.objects.filter(
                user=user,
                created_date__date=today
            )
            total_kcal = 0
            for i in user_ingre:
                nutrient = i.ingredient.nutrients
                total_kcal += (nutrient.kcal * i.unit / nutrient.unit)

            health_diary, _ = HealthDiary.objects.get_or_create(
                user=user,
                created_date__date=today,
                defaults={'calo_burned': 0, 'calo_intake': total_kcal, 'weight': 0}
            )
            health_diary.calo_intake = total_kcal
            health_diary.save()
            return instance


class MealSerializer(serializers.ModelSerializer):
    name_display = serializers.SerializerMethodField()
    suggest_dish = DishSerializer(many=True)

    class Meta:
        model = Meal
        fields = ['id', 'name', 'name_display', 'suggest_dish']

    def get_name_display(self, obj):
        return obj.get_name_display()


class UserSerializer(serializers.ModelSerializer):
    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['avatar'] = instance.avatar.url if instance.avatar else ''
        data['menu'] = MenuSerializer(instance.menu).data if instance.menu else None
        return data

    def create(self, validated_data):
        data = validated_data.copy()
        u = User(**data)
        u.set_password(u.password)
        u.save()
        return u

    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'username', 'address', 'birth', 'avatar', 'user_role', 'menu',
                  'password',
                  'coach', 'nutritionist']
        extra_kwargs = {
            'password': {
                'write_only': True
            }
        }


class ReminderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reminder
        fields = ['id', 'reminder_type', 'reminder_time', 'message', 'active']

    def validate(self, data):
        user = self.context['request'].user
        reminder_type = data.get('reminder_type')
        reminder_time = data.get('reminder_time')
        if Reminder.objects.filter(user=user, reminder_type=reminder_type,
                                   reminder_time=reminder_time).exists():
            raise serializers.ValidationError({"detail": "Bạn đã tạo lời nhắc trùng giờ và loại rồi!"})
        return data

    def create(self, validated_data):
        user = self.context['request'].user
        return Reminder.objects.create(user=user, **validated_data)


class HealthDiarySerializer(serializers.ModelSerializer):
    class Meta:
        model = HealthDiary
        fields = ['calo_burned', 'calo_intake', 'weight', 'notes']

    def create(self, validated_data):
        user = self.context['request'].user
        today = timezone.now().date()

        health_diary = HealthDiary.objects.filter(user=user, created_date__date=today).first()

        if health_diary:
            health_diary.weight = validated_data.get('weight', health_diary.weight)
            health_diary.notes = validated_data.get('notes', health_diary.notes)
            health_diary.save()
            instance = health_diary
            return instance
        else:
            return HealthDiary.objects.create(user=user, **validated_data)


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['id', 'sender', 'receiver', 'content', 'image']
