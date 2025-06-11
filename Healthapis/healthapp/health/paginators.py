from rest_framework.pagination import PageNumberPagination


class ItemPaginator(PageNumberPagination):
    page_size = 2


class ItemPracticePaginator(PageNumberPagination):
    page_size = 5


class ItemExercisePaginator(PageNumberPagination):
    page_size = 7


class ItemDietPaginator(PageNumberPagination):
    page_size = 3


class ItemMenuPaginator(PageNumberPagination):
    page_size = 3


class ItemIngredientPaginator(PageNumberPagination):
    page_size = 8
