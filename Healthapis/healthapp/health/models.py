from datetime import timedelta
from django.db.models import Q
from django.db import models
from django.contrib.auth.models import AbstractUser
from ckeditor.fields import RichTextField
from cloudinary.models import CloudinaryField
from django.utils.timezone import now
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType


class BaseModel(models.Model):
    active = models.BooleanField(default=True)
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True
        ordering = ['-id']


class UserRole(models.IntegerChoices):
    ADMIN = 1, 'Admin'
    CUSTOMER = 2, 'Customer'
    NUTRITIONIST = 3, 'Nutritionist'
    COACH = 4, 'Coach'


class MealRole(models.IntegerChoices):
    BUA_SANG = 1, 'Bữa sáng (7-8 giờ sáng)'
    AN_VAT = 2, 'Ăn vặt (9-10 giờ sáng)'
    BUA_TRUA = 3, 'Bữa trưa (11-12 giờ trưa)'
    AN_CHIEU = 4, 'Ăn chiều (3-4 giờ chiều)'
    BUA_TOI = 5, 'Bữa tối (6-7 giờ tối)'


class User(AbstractUser):
    address = models.CharField(max_length=255, null=True)
    avatar = CloudinaryField(null=True, blank=True)
    menu = models.ForeignKey('Menu', null=True, blank=True, on_delete=models.SET_NULL)
    birth = models.IntegerField(null=True)
    user_role = models.IntegerField(
        choices=UserRole.choices,
        default=UserRole.CUSTOMER
    )
    coach = models.ForeignKey('self',
                              null=True,
                              blank=True,
                              on_delete=models.SET_NULL,
                              related_name='clients_as_coach',
                              limit_choices_to={'user_role': UserRole.COACH}
                              )

    nutritionist = models.ForeignKey('self',
                                     null=True,
                                     blank=True,
                                     on_delete=models.SET_NULL,
                                     related_name='clients_as_nutritionist',
                                     limit_choices_to={'user_role': UserRole.NUTRITIONIST}
                                     )


class Expert(BaseModel):
    user = models.OneToOneField('User',
                                on_delete=models.CASCADE,
                                limit_choices_to=Q(user_role=UserRole.COACH) | Q(user_role=UserRole.NUTRITIONIST))
    certification = CloudinaryField(null=True, blank=True)
    experience_years = models.PositiveIntegerField()
    specialties = models.TextField()


class UserSchedule(BaseModel):
    user = models.ForeignKey('User', on_delete=models.CASCADE)
    schedule = models.ForeignKey('Schedule', on_delete=models.CASCADE)
    flag = models.BooleanField(default=True)
    type = models.CharField(default='regular', max_length=20, editable=False)


class UserPersonalSchedule(BaseModel):
    user = models.ForeignKey('User', on_delete=models.CASCADE)
    schedule = models.ForeignKey('PersonalSchedule', on_delete=models.CASCADE)
    flag = models.BooleanField(default=True)
    type = models.CharField(default='personal', max_length=20, editable=False)


class HealthGoal(BaseModel):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name


class HealthInformation(BaseModel):
    user = models.OneToOneField('user', on_delete=models.CASCADE)
    health_goal = models.ForeignKey('HealthGoal', null=True, on_delete=models.SET_NULL, blank=True)
    height = models.FloatField()
    weight = models.FloatField()


class Tag(BaseModel):
    name = models.CharField(max_length=50)
    image = CloudinaryField(null=True, blank=True)

    def __str__(self):
        return self.name


class GroupSchedule(BaseModel):
    name = models.CharField(max_length=50)
    image = CloudinaryField(null=True, blank=True)

    def __str__(self):
        return self.name


class Schedule(BaseModel):
    Tags = models.ManyToManyField('Tag')
    name = models.CharField(max_length=50)
    total_day = models.FloatField()
    experience = models.CharField(max_length=255)
    describe = RichTextField()
    image = CloudinaryField(null=True, blank=True)
    group_schedule = models.ForeignKey('GroupSchedule', on_delete=models.CASCADE)

    def __str__(self):
        return self.name


class PersonalSchedule(BaseModel):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name


class Session(BaseModel):
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE, null=True)
    object_id = models.PositiveIntegerField(null=True)
    schedule = GenericForeignKey('content_type', 'object_id')
    name = models.CharField(max_length=50)
    exercise = models.ManyToManyField('Exercise')

    def __str__(self):
        return self.name


class ResultOfSession(BaseModel):
    session = models.ForeignKey('Session', on_delete=models.CASCADE)
    user = models.ForeignKey('User', on_delete=models.CASCADE, default=1)
    practice_time = models.DurationField(default=timedelta(seconds=0))
    calo = models.IntegerField(null=True, default=0)
    workout_notes = models.CharField(max_length=255, default="")


class Result(BaseModel):
    rep = models.IntegerField(null=True)
    weight = models.FloatField(null=True)
    set = models.IntegerField(null=True)

    class Meta:
        abstract = True


class Exercise(BaseModel):
    name = models.CharField(max_length=255)
    describe = models.CharField(max_length=255)
    image = CloudinaryField(null=True, blank=True)
    tag = models.ManyToManyField('Tag')

    def __str__(self):
        return self.name


class ActualResult(Result):
    exercise = models.ForeignKey('Exercise', on_delete=models.CASCADE)
    schedule = models.ForeignKey('Schedule', on_delete=models.CASCADE, default=1)


class PredictedResult(Result):
    exercise = models.ForeignKey('Exercise', on_delete=models.CASCADE)
    session = models.ForeignKey('Session', on_delete=models.CASCADE)
    user = models.ForeignKey('user', on_delete=models.CASCADE, blank=True)
    day = models.IntegerField(default=0)

    def save(self, *args, **kwargs):
        today = now().date()
        if self.set is None:
            last_result = PredictedResult.objects.filter(
                exercise=self.exercise,
                session=self.session,
                user=self.user,
                created_date__date=today
            ).order_by('-created_date').first()
            if last_result:
                self.set = last_result.set + 1
            else:
                self.set = 1

        super().save(*args, **kwargs)


class Instruct(BaseModel):
    exercise = models.ForeignKey('Exercise', on_delete=models.CASCADE)
    name = models.CharField(max_length=50)
    describe = models.CharField(max_length=255)

    class Meta:
        ordering: ['id']


class Diet(BaseModel):
    name = models.CharField(max_length=50)
    describe = models.CharField(max_length=255)
    image = CloudinaryField(null=True, blank=True)
    health_goal = models.ForeignKey('HealthGoal', null=True, on_delete=models.SET_NULL, blank=True)

    def __str__(self):
        return self.name


class Menu(BaseModel):
    diet = models.ForeignKey('Diet', on_delete=models.CASCADE)
    name = models.CharField(max_length=50)
    total_day = models.IntegerField()
    image = CloudinaryField(null=True, blank=True)

    def __str__(self):
        return self.name


class EatingMethod(BaseModel):
    diet = models.OneToOneField('Diet', on_delete=models.CASCADE)
    introduce = RichTextField()
    principle = RichTextField()
    menu_building = RichTextField()


class MenuOfDay(BaseModel):
    menu = models.ForeignKey('Menu', on_delete=models.CASCADE)
    day = models.IntegerField(default=1)

    class Meta:
        ordering = ['day']


class Dish(BaseModel):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class Meal(BaseModel):
    menu_of_day = models.ForeignKey('MenuOfDay', on_delete=models.CASCADE)
    name = models.IntegerField(
        choices=MealRole.choices,
        default=MealRole.BUA_SANG
    )
    suggest_dish = models.ManyToManyField('Dish')

    def __str__(self):
        return self.get_name_display()

    class Meta:
        ordering = ['name']


class Nutrients(BaseModel):
    ingredient = models.OneToOneField('Ingredient', on_delete=models.CASCADE)
    unit = models.IntegerField(default=1)
    kcal = models.FloatField(default=0)
    fat = models.FloatField(default=0)
    protein = models.FloatField(default=0)
    starch = models.FloatField(default=0)


class UserIngredient(BaseModel):
    user = models.ForeignKey('User', on_delete=models.CASCADE)
    meal = models.ForeignKey('Meal', on_delete=models.CASCADE)
    ingredient = models.ForeignKey('Ingredient', on_delete=models.CASCADE)
    unit = models.IntegerField(default=1)


class Ingredient(BaseModel):
    name = models.CharField(max_length=50)
    image = CloudinaryField(null=True, blank=True)

    def __str__(self):
        return self.name


class MenuIngredient(BaseModel):
    ingredient = models.ForeignKey('Ingredient', on_delete=models.CASCADE)
    menu_of_day = models.ForeignKey('MenuOfDay', on_delete=models.CASCADE)
    unit = models.IntegerField(default=1)


class Reminder(BaseModel):
    REMINDER_TYPES = [
        ('water', 'Uống nước'),
        ('exercise', 'Tập luyện'),
        ('rest', 'Nghỉ ngơi')
    ]

    user = models.ForeignKey('User', on_delete=models.CASCADE)
    reminder_type = models.CharField(max_length=20, choices=REMINDER_TYPES)
    reminder_time = models.TimeField()
    message = models.CharField(max_length=255, blank=True, default="")

    def __str__(self):
        return f"{self.get_reminder_type_display()} - {self.reminder_time}"


class HealthDiary(BaseModel):
    user = models.ForeignKey('User', on_delete=models.CASCADE)
    calo_burned = models.IntegerField(default=0)
    calo_intake = models.IntegerField(default=0)
    weight = models.FloatField(default=0, blank=True)
    notes = RichTextField(null=True, blank=True)


class Message(BaseModel):
    sender = models.ForeignKey('user', on_delete=models.CASCADE, related_name='send_messages')
    receiver = models.ForeignKey('user', on_delete=models.CASCADE, related_name='received_messages')
    content = models.TimeField(null=True, blank=True)
    image = CloudinaryField(null=True, blank=True)
    is_read = models.BooleanField(default=False)
