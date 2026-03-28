from typing import List

from django.shortcuts import redirect
from django.contrib.auth import get_user_model

User = get_user_model()


def login_required(function):
    def wrapper(request, *args, **kwargs):
        if not request.user.is_authenticated:
            return redirect('user:login')
        return function(request, *args, **kwargs)

    return wrapper


def employee_required(function):
    def wrapper(request, *args, **kwargs):
        if not (request.user.is_authenticated and request.user.role == "RU"):
            return redirect('user:login')
        return function(request, *args, **kwargs)

    return wrapper


def check_permission(user_roles: List = None):
    def checker(function):
        def wrapper(request, *args, **kwargs):
            if not request.user.is_authenticated:
                return redirect('user:login')

            if not request.user.is_superuser and request.user.role not in user_roles:
                return redirect(
                    'dashboard:index' if request.user.role in ['DFO', 'DM', 'ICTM', 'A'] else 'dashboard:nu_index')

            return function(request, *args, **kwargs)

        return wrapper

    return checker


def superuser_required(function):
    def wrapper(request, *args, **kwargs):
        if not request.user.is_authenticated:
            return redirect('user:login')
        if not request.user.is_superuser:
            return redirect('dashboard:index')
        return function(request, *args, **kwargs)

    return wrapper


def superuser_or_admin_required(function):
    def wrapper(request, *args, **kwargs):
        try:
            if not request.user.is_authenticated:
                return redirect('user:login')
            if not (request.user.is_superuser or request.user.role == "Admin"):
                return redirect('dashboard:index')
            return function(request, *args, **kwargs)
        except:
            return redirect('dashboard:index')

    return wrapper



