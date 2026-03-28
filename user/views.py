from django.shortcuts import render
import json
from django.shortcuts import render, redirect
from django.contrib import auth
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from applibs.decorators import login_required
from django.contrib.auth import authenticate, update_session_auth_hash
from applibs.utils import is_ajax, get_logger
from django.db import transaction
from django.db.models import Q
from applibs.libs import get_paginated_page
from django.contrib.auth.hashers import make_password
from django.contrib.auth import get_user_model, update_session_auth_hash
import traceback
from django.urls import reverse
from applibs.libs import parse_date
from applibs.utils import generate_otp, is_ajax

from django.forms.models import model_to_dict
from .forms import CustomUserForm

from django.contrib.auth.hashers import check_password
from django.utils import timezone
from datetime import timedelta
import time
from applibs.decorators import check_permission
from django.db.models import Q, Case, When

User = get_user_model()
logger = get_logger()


def login(request):
    if request.user.is_authenticated:
        return redirect("dashboard:index")

    if is_ajax(request) and request.method == "POST":
        was_limited = getattr(request, "limited", False)
        
        if was_limited:
            return JsonResponse({"status": 101})

        username = request.POST.get("username", "")
        password = request.POST.get("password", "")

        if len(username) == 0:
            return JsonResponse({"status": 0})
        elif len(password) == 0:
            return JsonResponse({"status": 1})
        else:
            try:
                user = auth.authenticate(username=username, password=password)

            except Exception as e:
                print(e)
                return JsonResponse({"status": 100})

            if user is None:
                return JsonResponse({"status": 3})

            if not user.is_superuser and User.objects.filter(id=user.pk, status='D').exists():
                return JsonResponse({'status': 5})
            
            if user.is_superuser or user.is_password_reset:
                auth.login(request, user)
                return JsonResponse({"status": 2})
            else:
                request.session['force_password_change'] = True
                request.session['user_id_for_password_change'] = user.id
                return JsonResponse({"status": 6})
    return render(request, "users/login.html")


def logout(request):
    if request.user.is_authenticated:
        auth.logout(request)

    return redirect("user:login")



def pre_password_change(request):
    if request.user.is_authenticated:
        return redirect('dashboard:index')
    
    if not request.user.is_authenticated:
        user_id = request.session.get('user_id_for_password_change')
        
        if not user_id:
            return redirect('user:login')

        try:
            user = User.objects.filter(pk=user_id, status__in=["A", "T"]).first()
        except Exception as e:
            print(traceback.format_exc())
            return redirect('user:login')

    if request.method == "POST" and is_ajax(request):
        new_password = request.POST.get("new_password", "")
        confirm_password = request.POST.get("confirm_password", "")

        if len(new_password) < 8:
            return JsonResponse({"message": 1})
        if not confirm_password:
            return JsonResponse({"message": 2})
        elif confirm_password == new_password:
            try:
                auth.login(request, user)
                user.password = make_password(new_password)
                user.is_password_reset = True
                user.save()
                update_session_auth_hash(request, user)
                request.session['force_password_change'] = False
                request.session.pop('user_id_for_password_change', None)
                
                return JsonResponse({"message": 3})
            except Exception as e:
                print(traceback.format_exc())
                return JsonResponse({"message": 5})
        else:
            return JsonResponse({"message": 6})
    return render(request, "users/pre_password_change.html")


@login_required
def change_password(request):
    if request.method == "POST" and is_ajax(request):
        confirm_password = request.POST.get("confirm_password", "")
        new_password = request.POST.get("new_password", "")
        old_password = request.POST.get("old_password", "")
        
        if len(old_password) == 0:
            return JsonResponse({"message": 2})
        elif len(new_password) < 8:
            return JsonResponse({"message": 3})
        elif confirm_password == new_password:
            try:
                user = authenticate(
                    request, username=request.user, password=old_password
                )
                
                if user:
                    user.password = make_password(new_password)
                    user.save()
                    update_session_auth_hash(request, user)
                    return JsonResponse({"message": 1})
                else:
                    return JsonResponse({"message": 6})
                
            except Exception as e:
                print(e)
                return JsonResponse({"message": 7})
        else:
            JsonResponse({"message": 5})
            
    
    return render(request, "dashboard/user/change_password.html")


@login_required
def users(request):
    if is_ajax(request) and request.method == "POST":
        updated_request = request.POST.copy()
        the_action = updated_request.get("action")
        username = updated_request.get("username")
        
        if username:
            username = username.strip()
            
        email = updated_request.get("email")
        role = updated_request.get("role")
        contact_number = updated_request.get("contact_number")
        status = updated_request.get("status")
       
        if the_action == "save":
            if User.objects.filter(username=username).exists():
                return JsonResponse({"message": "উক্ত ইউজারনেম ইতোমধ্যে বিদ্যমান।"})

            if User.objects.filter(email=email).exclude(status='D').exists():
                return JsonResponse({"message": "উক্ত ইমেইল ইতোমধ্যে বিদ্যমান।"})
            
            if contact_number and User.objects.filter(contact_number=contact_number).exclude(status='D').exists():
                return JsonResponse({"message": "উক্ত মোবাইল নম্বর ইতোমধ্যে বিদ্যমান।"})
 
            
            updated_request['password'] = make_password("123456789#")
            the_form = CustomUserForm(updated_request)
            
            context = {
                "status": 100,
            }
            
            if not the_form.is_valid():
                logger.error(the_form.errors)
                return JsonResponse(context)

            the_form = the_form.save(commit=False)
            the_form.contact_number = contact_number
            the_form.save()
            
            context = {
                "status": 1,
            }
            
            return JsonResponse(context)

        elif the_action == "update":
            user_id = updated_request.get("user_id")

            if User.objects.filter(username=username).exclude(Q(id=user_id)|Q(status='D')).exists():
                return JsonResponse({"message": "উক্ত ইউজারনেম ইতোমধ্যে বিদ্যমান।"})

            if User.objects.filter(email=email, status__in=['A', 'T']).exclude(Q(id=user_id)|Q(status='D')).exists():
                return JsonResponse({"message": "উক্ত ইমেইল ইতোমধ্যে বিদ্যমান।"})
            
            if contact_number and User.objects.filter(contact_number=contact_number, status__in=['A', 'T']).exclude(Q(id=user_id)|Q(status='D')).exists():
                return JsonResponse({"message": "উক্ত মোবাইল নম্বর ইতোমধ্যে বিদ্যমান।"})
            

            context = {
                "status": 100,
            }

            try:
                user = User.objects.filter(id=user_id).first()

                with transaction.atomic():
                    updated_request['password'] = user.password
                    the_form = CustomUserForm(updated_request, instance=user)

                    if the_form.is_valid():
                        the_form = the_form.save(commit=False)
                        
                        if status == "T":
                            the_form.is_password_reset = False
                            the_form.password = make_password("123456789#")
                        
                        the_form.contact_number = contact_number
                    
                        the_form.save()
                      
                        context = {
                            "status": 10,
                        }
                    else:
                        logger.error(the_form.errors)
                        return JsonResponse(context)

            except Exception as e:
                logger.error(e)
            return JsonResponse(context)

        elif the_action == "delete":
            try:
                user_id = request.POST.get("user_id", "")
                user = User.objects.filter(id=user_id).first()
                user.status = 'D'
                user.username = user.username + "_deleted" + str(user_id)
                user.save()
               
                context = {
                    "status": 1,
                }
                return JsonResponse(context)
            except Exception as e:
                logger.error(e)
            return JsonResponse({"status": 2})

    page = request.GET.get("page", 1)
    users = User.objects.filter(status='A').exclude(Q(is_superuser=True)).order_by("-id")
    

    context = {
        "users": get_paginated_page(users, 20, page),
        "total_user": users.count(),

    }
    
    return render(request, 'dashboard/user/users.html', context)


@login_required
def reset_user_password(request):
    try:
        if is_ajax(request) and request.method == "POST":
            user_obj = User.objects.filter(
                id=request.POST.get("id", ""), status='A'
            ).first()
            
            if not user_obj:
                return JsonResponse({"message": 101})
            
            with transaction.atomic():
                user_obj.password = make_password("123456789#")
                user_obj.is_password_reset = False
                user_obj.save()


                return JsonResponse({"status": 1})
    except Exception as e:
        print(e)

    return JsonResponse({"message": 101})
