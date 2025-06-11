from django.contrib import admin

from .models import User, HealthInformation, HealthGoal, GroupSchedule, Schedule, Session, \
    Tag, Exercise, ResultOfSession, ActualResult, PredictedResult, Instruct, UserSchedule, Diet, Menu, EatingMethod, \
    MenuOfDay, Meal, Nutrients, Ingredient, Dish, Reminder, HealthDiary, MenuIngredient, UserIngredient, Expert, \
    PersonalSchedule, UserPersonalSchedule
from django import forms
from django.utils import timezone
from django.db import models



class MyUserAdmin(admin.ModelAdmin):
    list_display = ['username', 'user_role', 'menu', 'coach', 'nutritionist']

    formfield_overrides = {
        models.IntegerField: {
            'widget': forms.Select(choices=[(y, y) for y in range(1900, timezone.now().year + 1)])
        }
    }


class MyHealthInfoAdmin(admin.ModelAdmin):
    list_display = ['user', 'height', 'weight', 'health_goal']


class GroupScheduleAdmin(admin.ModelAdmin):
    list_display = ['name']


class ExpertAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'certification', 'experience_years', 'specialties']


class TagAdmin(admin.ModelAdmin):
    list_display = ['name']


class ScheduleAdmin(admin.ModelAdmin):
    list_display = ['name', 'total_day', 'describe', 'group_schedule']


class SessionAdmin(admin.ModelAdmin):
    list_display = ['schedule', 'name']


class MenuIngredientAdmin(admin.ModelAdmin):
    list_display = ['id', 'menu_of_day', 'ingredient', 'unit']


class UserIngredientAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'meal', 'ingredient', 'unit']


class ExerciseAdmin(admin.ModelAdmin):
    list_display = ['name', 'describe', 'image']


class ResultOfSessionAdmin(admin.ModelAdmin):
    list_display = ['session', 'practice_time', 'calo', 'workout_notes']


class ActualResultAdmin(admin.ModelAdmin):
    list_display = ['exercise', 'schedule', 'set', 'rep', 'weight']


class PredictedResultAdmin(admin.ModelAdmin):
    list_display = ['user', 'exercise', 'session', 'set', 'rep', 'weight']


class InstructAdmin(admin.ModelAdmin):
    list_display = ['exercise', 'name', 'describe']


class UserScheduleAdmin(admin.ModelAdmin):
    list_display = ['user', 'schedule', 'flag']


class DietAdmin(admin.ModelAdmin):
    list_display = ['name', 'describe', 'image']


class MenuAdmin(admin.ModelAdmin):
    list_display = ['diet', 'name', 'total_day']


class EatingMethodAdmin(admin.ModelAdmin):
    list_display = ['diet', 'introduce', 'principle', 'menu_building']


class MenuOfDayAdmin(admin.ModelAdmin):
    list_display = ['menu', 'day']


class MealAdmin(admin.ModelAdmin):
    list_display = ['name', 'menu_of_day']


class IngredientAdmin(admin.ModelAdmin):
    list_display = [ 'name', 'image']


class NutrientsAdmin(admin.ModelAdmin):
    list_display = ['ingredient', 'unit', 'kcal', 'fat', 'protein', 'starch']


class HealthDiaryAdmin(admin.ModelAdmin):
    list_display = ['user', 'calo_burned', 'calo_intake', 'weight', 'notes']


class HealthAppAdminSite(admin.AdminSite):
    site_header = 'Hệ thống quản lý sức khỏe'


class ReminderAdminSite(admin.ModelAdmin):
    list_display = ['user', 'reminder_type', 'reminder_time', 'message']


class PersonalScheduleAdminSite(admin.ModelAdmin):
    list_display = ['id', 'name']


class UserPersonalScheduleAdminSite(admin.ModelAdmin):
    list_display = ['id', 'user', 'schedule', 'flag']

admin_site = HealthAppAdminSite(name='myadmin')

admin_site.register(User, MyUserAdmin)
admin_site.register(HealthInformation, MyHealthInfoAdmin)
admin_site.register(HealthGoal)
admin_site.register(Tag, TagAdmin)
admin_site.register(Schedule, ScheduleAdmin)
admin_site.register(GroupSchedule, GroupScheduleAdmin)
admin_site.register(Session, SessionAdmin)
admin_site.register(Exercise, ExerciseAdmin)
admin_site.register(ResultOfSession, ResultOfSessionAdmin)
admin_site.register(ActualResult, ActualResultAdmin)
admin_site.register(PredictedResult, PredictedResultAdmin)
admin_site.register(Instruct, InstructAdmin)
admin_site.register(UserSchedule, UserScheduleAdmin)
admin_site.register(Diet, DietAdmin)
admin_site.register(Menu, MenuAdmin)
admin_site.register(EatingMethod, EatingMethodAdmin)
admin_site.register(MenuOfDay, MenuOfDayAdmin)
admin_site.register(Meal, MealAdmin)
admin_site.register(Ingredient, IngredientAdmin)
admin_site.register(Nutrients, NutrientsAdmin)
admin_site.register(Dish)
admin_site.register(Reminder, ReminderAdminSite)
admin_site.register(HealthDiary, HealthDiaryAdmin)
admin_site.register(MenuIngredient, MenuIngredientAdmin)
admin_site.register(UserIngredient, UserIngredientAdmin)
admin_site.register(Expert, ExpertAdmin)
admin_site.register(PersonalSchedule, PersonalScheduleAdminSite)
admin_site.register(UserPersonalSchedule, UserPersonalScheduleAdminSite)
