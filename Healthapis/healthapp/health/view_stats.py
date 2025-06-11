from datetime import timedelta, date

from django.db.models.functions import TruncDate, TruncMonth
from rest_framework.response import Response
from rest_framework import viewsets, status, permissions
from django.db.models import Sum, F, Avg, Count
from django.utils import timezone
from rest_framework.decorators import action
from .models import PredictedResult, ResultOfSession, HealthDiary, ActualResult, Session, MenuIngredient, Nutrients, \
    UserIngredient


class StatsViewSet(viewsets.ViewSet):
    @staticmethod
    def calculate_exercise_complete(user, exercise_id, session_id, schedule_id, day):
        data_predicted_result = PredictedResult.objects.filter(user=user,
                                                               session=session_id,
                                                               exercise=exercise_id,
                                                               day=day).aggregate(
            total_sets=Count('id'),
            total_reps=Sum('rep'),
            total_weight=Sum(F('weight') * F('rep'))
        )
        data_actual_result = ActualResult.objects.filter(exercise=exercise_id, schedule=schedule_id).annotate(
            total_reps=F('rep') * F('set'),
            total_weight=F('weight') * F('rep') * F('set')
        ).values('set', 'total_reps', 'total_weight')

        if data_actual_result:
            actual = data_actual_result[0]

            set_persent = (data_predicted_result['total_sets'] or 0) / (actual['set'] or 1)
            rep_persent = (data_predicted_result['total_reps'] or 0) / (actual['total_reps'] or 1)
            weight_persent = (data_predicted_result['total_weight'] or 0) / (actual['total_weight'] or 1)

            percent_complete = (set_persent + rep_persent + weight_persent) / 3.0
        else:
            set_persent = 1.0 if data_predicted_result['total_sets'] else 0
            rep_persent = 1.0 if data_predicted_result['total_reps'] else 0
            weight_persent = 1.0 if data_predicted_result['total_weight'] else 0

            percent_complete = (set_persent + rep_persent + weight_persent) / 3.0
        return percent_complete

    @action(methods=['get'], detail=False, permission_classes=[permissions.IsAuthenticated])
    def get_session_complete(self, request):
        user = request.user
        session_id = request.query_params.get('session_id')
        schedule_id = request.query_params.get('schedule_id')
        day = request.query_params.get('day')

        exercise = Session.objects.get(id=session_id).exercise.all()
        total_persent = 0
        count = 0

        for e in exercise:
            persent = StatsViewSet.calculate_exercise_complete(user=user, exercise_id=e.id, session_id=session_id,
                                                               schedule_id=schedule_id, day=day)

            total_persent += persent
            count += 1
        session_persent = total_persent / count
        return Response(session_persent)

    @action(methods=['get'], detail=False, permission_classes=[permissions.IsAuthenticated])
    def get_exercise_complete(self, request):
        user = request.user
        session_id = request.query_params.get('session_id')
        exercise_id = request.query_params.get('exercise_id')
        schedule_id = request.query_params.get('schedule_id')
        day = request.query_params.get('day')

        percent_complete = StatsViewSet.calculate_exercise_complete(user=user,
                                                                    exercise_id=exercise_id,
                                                                    session_id=session_id,
                                                                    schedule_id=schedule_id,
                                                                    day=day)

        return Response(percent_complete)

    @action(methods=['get'], detail=False)
    def get_total_nutrients(self, request):
        menu_of_day = self.request.query_params.get('menu-of-day')

        data_menu_ingredient = MenuIngredient.objects.filter(menu_of_day=menu_of_day)

        total_kcal = 0
        total_fat = 0
        total_protein = 0
        total_starch = 0

        for d in data_menu_ingredient:
            nutrient = Nutrients.objects.filter(ingredient=d.ingredient).first()
            total_kcal += (d.unit * nutrient.kcal / nutrient.unit)
            total_fat += (d.unit * nutrient.fat / nutrient.unit)
            total_protein += (d.unit * nutrient.protein / nutrient.unit)
            total_starch += (d.unit * nutrient.starch / nutrient.unit)

        return Response({
            "kcal": round(total_kcal, 1),
            "fat": round(total_fat, 1),
            "protein": round(total_protein, 1),
            "starch": round(total_starch, 1)
        })

    @action(methods=['get'], detail=False)
    def get_nutrients_intake(self, request):
        menu_of_day_id = self.request.query_params.get('menu-of-day')
        user = self.request.user

        user_ingre = UserIngredient.objects.filter(user=user, meal__menu_of_day_id=menu_of_day_id)

        total_kcal = 0
        total_fat = 0
        total_protein = 0
        total_starch = 0

        for i in user_ingre:
            nutrient = Nutrients.objects.filter(ingredient=i.ingredient).first()
            total_kcal += (i.unit * nutrient.kcal / nutrient.unit)
            total_fat += (i.unit * nutrient.fat / nutrient.unit)
            total_protein += (i.unit * nutrient.protein / nutrient.unit)
            total_starch += (i.unit * nutrient.starch / nutrient.unit)

        return Response({
            "kcal": round(total_kcal, 1),
            "fat": round(total_fat, 1),
            "protein": round(total_protein, 1),
            "starch": round(total_starch, 1)
        })

    @action(methods=['get'], detail=False, permission_classes=[permissions.IsAuthenticated])
    def get_actual_result_session(self, request):
        day = request.query_params.get('day')
        session_id = request.query_params.get('session_id')
        user_id = request.user.id

        data = PredictedResult.objects.filter(user=user_id, session=session_id, day=day).aggregate(
            total_reps=Sum('rep'),
            total_weight=Sum(F('weight') * F('rep'))
        )

        return Response(data)

    @action(methods=['get'], detail=False, permission_classes=[permissions.IsAuthenticated])
    def get_expected_result_session(self, request):
        schedule_id = request.query_params.get('schedule_id')
        session_id = request.query_params.get('session_id')

        session = Session.objects.get(id=session_id)
        exercise = session.exercise.all()

        total_rep = 0
        total_weight = 0

        if exercise:
            for e in exercise:
                a = ActualResult.objects.filter(schedule=schedule_id, exercise=e.id).first()
                if a:
                    total_rep += a.rep
                    total_weight += (a.rep * a.weight)

        return Response({"total_rep": total_rep, "total_weight": total_weight})

    @action(methods=['get'], detail=False, url_path='practice')
    def get_practice(self, request):
        today = timezone.now().date()
        user_id = request.query_params.get('id', None)
        month = request.query_params.get('month', None)
        year = request.query_params.get('year', None)

        if month and year:
            # tính ngày đầu tiên và ngày cuối cùng của tháng
            start_of_month = date(int(year), int(month), 1)
            end_of_month = start_of_month.replace(month=int(month) % 12 + 1, day=1) - timedelta(days=1)

            # truy vấn dữ liệu trong khoản thời gian trên
            data = ResultOfSession.objects.filter(user_id=user_id,
                                                  created_date__range=(start_of_month, end_of_month)).annotate(
                created_day=TruncDate('created_date')).values('created_day', 'practice_time', 'calo')

            # tính trung bình cho mỗi tuần
            week_data = []
            week_index = 1
            current_start = start_of_month
            while current_start <= end_of_month:

                current_end = current_start + timedelta(days=6)
                if current_end > end_of_month:
                    current_end = end_of_month

                # lấy dữ liệu của tuần đó
                week_entries = [entry for entry in data if current_start <= entry['created_day'] <= current_end]

                # tính giá trị trung bình các chỉ số
                week_practice_time = sum((entry['practice_time'] for entry in week_entries), timedelta(0)) / len(
                    week_entries) if week_entries else 0

                week_calo = sum(entry['calo'] for entry in week_entries) / len(
                    week_entries) if week_entries else 0

                week_data.append({
                    'label': 'Tuần' + str(week_index),
                    'date': str(current_start) + ' đến ' + str(current_end),
                    'practice_time': week_practice_time,
                    'calo': week_calo,
                })
                week_index += 1

                # lấy ngày đầu của tuần kế tiếp
                current_start = current_end + timedelta(days=1)

            return Response(week_data, status=status.HTTP_200_OK)
        else:
            # today.weekday trả về 0 nếu là thứ 2
            start_of_week = today - timedelta(days=today.weekday())
            end_of_week = start_of_week + timedelta(days=6)

            data = ResultOfSession.objects.filter(user_id=user_id,
                                                  created_date__range=(start_of_week, end_of_week)).annotate(
                created_day=TruncDate('created_date')).values('created_day', 'practice_time', 'calo')

            data_dict = {entry['created_day']: {
                'practice_time': entry['practice_time'],
                'calo': entry['calo'],
            } for entry in data}

            week_data = []
            for i in range(7):
                current_day = start_of_week + timedelta(days=i)
                info = data_dict.get(current_day, {})
                week_data.append({
                    'label': current_day.strftime("%A"),
                    'date': current_day.isoformat(),
                    'practice_time': info.get('practice_time', 0),
                    'calo': info.get('calo', 0),
                })
            return Response(week_data, status=status.HTTP_200_OK)

    @action(methods=['get'], detail=False, url_path='health-progress')
    def get_health_progress(self, request):
        today = timezone.now().date()
        month = request.query_params.get('month', None)
        year = request.query_params.get('year', None)
        user_id = request.query_params.get('id', None)

        if month and year:
            # tính ngày đầu tiên và ngày cuối cùng của tháng
            start_of_month = date(int(year), int(month), 1)
            end_of_month = start_of_month.replace(month=int(month) % 12 + 1, day=1) - timedelta(days=1)

            # truy vấn dữ liệu trong khoản thời gian trên
            data = HealthDiary.objects.filter(user_id=user_id,
                                              created_date__range=(start_of_month, end_of_month)).annotate(
                created_day=TruncDate('created_date')).values('created_day', 'calo_burned', 'calo_intake', 'weight')

            # tính trung bình cho mỗi tuần
            week_data = []
            week_index = 1
            current_start = start_of_month
            while current_start <= end_of_month:

                current_end = current_start + timedelta(days=6)
                if current_end > end_of_month:
                    current_end = end_of_month

                # lấy dữ liệu của tuần đó
                week_entries = [entry for entry in data if current_start <= entry['created_day'] <= current_end]

                # tính giá trị trung bình các chỉ số
                week_calo_burned = sum((entry['calo_burned'] for entry in week_entries)) / len(
                    week_entries) if week_entries else 0

                week_calo_intake = sum(entry['calo_intake'] for entry in week_entries) / len(
                    week_entries) if week_entries else 0

                week_weight = sum(entry['weight'] for entry in week_entries) / len(
                    week_entries) if week_entries else 0

                week_data.append({
                    'label': 'Tuần' + str(week_index),
                    'date': str(current_start) + ' đến ' + str(current_end),
                    'calo_burned': week_calo_burned,
                    'calo_intake': week_calo_intake,
                    'weight': week_weight,
                })
                week_index += 1

                # lấy ngày đầu của tuần kế tiếp
                current_start = current_end + timedelta(days=1)

            return Response(week_data, status=status.HTTP_200_OK)
        if year:
            start_of_year = date(int(year), 1, 1)
            end_of_year = date(int(year), 12, 31)

            data = HealthDiary.objects.filter(user_id=user_id,
                                              created_date__range=(start_of_year, end_of_year)).annotate(
                month=TruncMonth('created_date')).values('month').annotate(
                avg_calo_burned=Avg('calo_burned'),
                avg_calo_intake=Avg('calo_intake'),
                avg_weight=Avg('weight'),
            )
            result = []
            for entry in data:
                result.append({
                    'label': entry['month'].strftime('%B'),
                    'date': '',
                    'calo_burned': entry['avg_calo_burned'] if entry['avg_calo_burned'] else 0,
                    'calo_intake': entry['avg_calo_intake'] if entry['avg_calo_intake'] else 0,
                    'weight': round(entry['avg_weight'], 2) if entry['avg_weight'] else 0
                })
            return Response(result, status=status.HTTP_200_OK)
        else:
            # today.weekday trả về 0 nếu là thứ 2
            start_of_week = today - timedelta(days=today.weekday())
            end_of_week = start_of_week + timedelta(days=6)

            data = HealthDiary.objects.filter(user_id=user_id,
                                              created_date__range=(start_of_week, end_of_week)).annotate(
                created_day=TruncDate('created_date')).values('created_day', 'calo_burned', 'calo_intake', 'weight')

            data_dict = {entry['created_day']: {
                'calo_burned': entry['calo_burned'],
                'calo_intake': entry['calo_intake'],
                'weight': entry['weight'],
            } for entry in data}

            week_data = []
            for i in range(7):
                current_day = start_of_week + timedelta(days=i)
                info = data_dict.get(current_day, {})
                week_data.append({
                    'label': current_day.strftime("%A"),
                    'date': current_day.isoformat(),
                    'calo_burned': info.get('calo_burned', 0),
                    'calo_intake': info.get('calo_intake', 0),
                    'weight': info.get('weight', 0),
                })
            return Response(week_data, status=status.HTTP_200_OK)
