from django.urls import path, include
from . import views

urlpatterns = [
    path('users', views.users, name='users'),
    path("login", views.login, name="login"),
    path("logout", views.logout, name="logout"),
    path("change-password", views.change_password, name="change_password"),
    path("pre-password-change", views.pre_password_change, name="pre_password_change"),
    path("reset-user-password", views.reset_user_password, name="reset_user_password")
]
