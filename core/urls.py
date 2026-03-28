from django.urls import path
from . import views

urlpatterns = [
    path("", views.home, name="home"),
    path("about", views.about, name="about"),
    path("book", views.book, name="book"),
    path("book-details", views.book_details, name="book_details"),
    path("travel", views.travel, name="travel"),
    path("quiz", views.quiz, name="quiz"),
]
