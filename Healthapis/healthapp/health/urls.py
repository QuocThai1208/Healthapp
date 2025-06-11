from django.urls import path, include
from . import views, view_stats, view_user, view_predicted_result, view_health_diary, view_exercise, view_personal, \
    view_user_schedule
from rest_framework.routers import DefaultRouter
from .view_google_fit import google_fit_login, google_fit_callback

router = DefaultRouter()
# User-related
router.register('users', view_user.UserViewSet, basename='user')
router.register('user-schedule', view_user_schedule.UserScheduleViewSet, basename='user-schedule')
router.register('personal-user-schedule', view_personal.PersonalUserScheduleViewSet, basename='personal-user-schedule')

# Exercise & Session
router.register('exercises', view_exercise.ExerciseViewSet, basename='exercise')
router.register('sessions', views.SessionViewSet, basename='session')
router.register('result-session', views.ResultOfSessionViewSet, basename='result-session')

# Nutrition
router.register('diets', views.DietViewSet, basename='diet')
router.register('menus', views.MenuViewSet, basename='menu')
router.register('menu-of-days', views.MenuOfDayViewSet, basename='menu-of-day')
router.register('menu-ingredients', views.MenuIngredientViewSet, basename='menu-ingredient')
router.register('meals', views.MealViewSet, basename='meal')
router.register('ingredient', views.IngredientViewSet, basename='ingredient')
router.register('user-ingredient', views.UserIngredientViewSet, basename='user-ingredient')

# Health tracking
router.register('health-info', views.HealthInfoViewSet, basename='health-info')
router.register('health-diarys', view_health_diary.HealthDiaryViewSet, basename='health-diary')
router.register('health-goals', views.HealthGoalViewSet, basename='health-goal')
router.register('stats', view_stats.StatsViewSet, basename='stats')

# Scheduling
router.register('schedules', views.ScheduleViewSet, basename='schedule')
router.register('personal-schedules', views.PersonalScheduleViewSet, basename='personal-schedule')
router.register('group-schedules', views.GroupScheduleSViewSet, basename='group-schedule')

# Results
router.register('actual-result', views.ActualResultViewSet, basename='actual')
router.register('predicted-result', view_predicted_result.PredictedResultViewSet, basename='predicted')

# Communication
router.register('messages', views.MessageViewSet, basename='message')
router.register('reminders', views.ReminderViewSet, basename='reminder')
router.register('tags', views.TagViewSet, basename='tag')

# People
router.register('experts', views.ExpertViewSet, basename='experts')
router.register('customers', views.CustomerViewSet, basename='customer')

urlpatterns = [
    path('', include(router.urls)),
    path('o/', include('oauth2_provider.urls', namespace='oauth2_provider')),
    path("login/google-fit/", google_fit_login, name="google_fit_login"),
    path("callback/google-fit/", google_fit_callback, name="google_fit_callback"),
]
