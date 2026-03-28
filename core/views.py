from django.shortcuts import render, redirect
from django.http import JsonResponse
from applibs.utils import is_ajax, get_logger
from django.db.models import Q, Count
from django.utils import timezone 
from django.db.models import Prefetch
import traceback
from applibs.libs import get_paginated_page
from dashboard.models.quiz_models import Quiz, Question, QuizQuestion
logger = get_logger()


def home(request):
 
    context = {
      
    }
    return render(request, 'home/index.html', context)


def about(request):
 
    context = {
      
    }
    return render(request, 'home/about.html', context)


def book(request):
 
    context = {
      
    }
    return render(request, 'home/book.html', context)


def book_details(request):
 
    context = {
      
    }
    return render(request, 'home/book_details.html', context)


def travel(request):
 
    context = {
      
    }
    return render(request, 'home/travel.html', context)


def quiz(request):
    today = timezone.now().date()

    quiz = Quiz.objects.filter(
        week_start__lte=today,
        week_end__gte=today,
        is_active=True
    ).last()

    quiz_questions = []
    if quiz:
        quiz_questions = QuizQuestion.objects.filter(
            quiz=quiz
        ).select_related("question").order_by("order")

    context = {
        "quiz": quiz,
        "quiz_questions": quiz_questions
    }

    return render(request, 'home/quiz.html', context)