from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path('all-quiz', views.all_quiz, name='all_quiz'),
    path('quiz', views.quiz, name='quiz'),
    path('all-question', views.all_question, name='all_question'),
    path('update_quiz/<int:pk>', views.update_quiz, name='update_quiz'),
    path("load-questions", views.load_questions, name="load_questions"),
    path("toggle-quiz-status", views.toggle_quiz_status, name="toggle_quiz_status"),

]
