from django.contrib.auth import get_user_model
from django.urls import reverse
from applibs.decorators import login_required
from django.shortcuts import render, redirect
from django.http import JsonResponse
from applibs.utils import is_ajax, get_logger
from applibs.libs import get_paginated_page
from django.db.models import Count, Q
from django.db import transaction
import os
import uuid
from .models.quiz_models import Quiz, Question, QuizQuestion
import json

User = get_user_model()
logger = get_logger()


@login_required
def index(request):
    try:
        context = {

        }

        return render(request, 'dashboard/index.html', context)
    except Exception as e:
        print(e)
        # return redirect("user:login")
        return render(request, 'dashboard/index.html', context)


@login_required
def all_quiz(request):
    if is_ajax(request) and request.method == "POST":
        updated_request = request.POST.copy()
        the_action = updated_request.get("action")
        week_start = updated_request.get("week_start")
        week_end = updated_request.get("week_end")
        title = updated_request.get("title")
        questions = json.loads(updated_request.get("questions", "[]"))
        
        if the_action == "save":
            
            print('updated_request',updated_request)
            if Quiz.objects.filter(week_start=week_start, week_end=week_end).exists():
                return JsonResponse({"status": 2})

            try:
                with transaction.atomic():
                    quiz = Quiz.objects.create(
                        week_start=week_start,
                        week_end=week_end,
                        is_active=True,
                        title=title
                    )

                    for q in questions:
                        
                        question = Question.objects.create(
                            text=q["text"],
                            option_a=q["options"][0],
                            option_b=q["options"][1],
                            option_c=q["options"][2],
                            option_d=q["options"][3],
                            correct_answer=q["correct_answer"]
                        )

                        QuizQuestion.objects.create(
                            quiz=quiz,
                            question=question,
                            order=q["order"]
                        )

            except Exception as e:
                logger.error(e)
                return JsonResponse({"status": 100})

            return JsonResponse({"status": 1})

        elif the_action == "update":
            quiz_id = updated_request.get("quiz_id")

            if Quiz.objects.filter(week_start=week_start, week_end=week_end).exclude(id=quiz_id).exists():
                return JsonResponse({"status": 2})

            try:
                with transaction.atomic():
                    quiz = Quiz.objects.get(id=quiz_id)
                    quiz.week_start = week_start
                    quiz.week_end = week_end
                    quiz.title = title
                    quiz.save()

                    for q in questions:
                        question_id = q.get("question_id", 0)  
                        if QuizQuestion.objects.filter(id=question_id, quiz=quiz).exists():
                            quiz_question = QuizQuestion.objects.get(id=question_id, quiz=quiz)
                            question = quiz_question.question
                            question.text = q["text"]
                            question.option_a = q["options"][0]
                            question.option_b = q["options"][1]
                            question.option_c = q["options"][2]
                            question.option_d = q["options"][3]
                            question.correct_answer = q["correct_answer"]
                            question.save()

                            quiz_question.order = q["order"]
                            quiz_question.save()

                        else:
                            question = Question.objects.create(
                                text=q["text"],
                                option_a=q["options"][0],
                                option_b=q["options"][1],
                                option_c=q["options"][2],
                                option_d=q["options"][3],
                                correct_answer=q["correct_answer"]
                            )
                            QuizQuestion.objects.create(
                                quiz=quiz,
                                question=question,
                                order=q["order"]
                            )
            
                           
                return JsonResponse({"status": 10})

            except Exception as e:
                print(str(e))
                return JsonResponse({"status": 100})

        elif the_action == "delete":
            try:
                quiz_id = updated_request.get("quiz_id")
                quiz = Quiz.objects.get(id=quiz_id)
                quiz.is_active = False
                quiz.status = "D"
                quiz.save()

                # create_log(
                #     action=3,
                #     model_name="Quiz",
                #     data=f"{quiz.week_start} - {quiz.week_end}",
                #     requested_user=request.user
                # )

                return JsonResponse({"status": 1})

            except Exception as e:
                logger.error(e)
                return JsonResponse({"status": 100})
        elif the_action == "delete_quiz_question":
            try:
                question_id = updated_request.get("question_id")
                quiz_question = QuizQuestion.objects.get(id=question_id )
                quiz_question.delete()

                # create_log(
                #     action=3,
                #     model_name="Quiz",
                #     data=f"{quiz.week_start} - {quiz.week_end}",
                #     requested_user=request.user
                # )

                return JsonResponse({"status": 1})

            except Exception as e:
                logger.error(e)
                return JsonResponse({"status": 100})

    page = request.GET.get("page", 1)
   

    quizzes = Quiz.objects.filter(status='A').annotate(
        question_count=Count('quizquestion__question', filter=Q(quizquestion__question__status='A'))
    ).order_by('-id')


    search_start = request.GET.get("week_start", "")
    search_end = request.GET.get("week_end", "")
    action = request.GET.get("action", "")

    if action == "search":
        if search_start:
            quizzes = quizzes.filter(week_start__gte=search_start)
        if search_end:
            quizzes = quizzes.filter(week_end__lte=search_end)

    context = {
        "quizzes": get_paginated_page(quizzes, 30, page),
        "search_start": search_start,
        "search_end": search_end,
        "total_quiz": quizzes.count()
    }

    return render(request, "dashboard/quiz/all_quiz.html", context)


@login_required
def quiz(request):

    context = {
       
    }

    return render(request, 'dashboard/quiz/quiz.html',context)


@login_required
def update_quiz(request, pk):
    quiz = Quiz.objects.get(id=pk)
    quiz_questions = QuizQuestion.objects.filter(quiz=quiz).select_related('question').order_by('order')

    context = {
       'quiz': quiz,
       'quiz_questions': quiz_questions
    }

    return render(request, 'dashboard/quiz/quiz.html',context)


@login_required
def all_question(request):
    questions = Question.objects.filter(status='A')

    context = {
        'questions': questions,
        'total_question': questions.count()
    }

    return render(request, 'dashboard/quiz/all_question.html',context)


@login_required
def load_questions(request):

    if is_ajax(request) and request.method == "POST":
       
        updated_request = request.POST.copy()
        the_action = updated_request.get("action")
        week_start = updated_request.get("week_start")
        week_end = updated_request.get("week_end")
        title = updated_request.get("title")
        quiz_id = updated_request.get("quiz_id")
      
        question_ids = updated_request.get("question_ids")
        question_ids = json.loads(question_ids)

        selected_questions = Question.objects.filter(id__in=question_ids)
        print(' updated_request', updated_request)
        try:
            with transaction.atomic():
                if quiz_id and Quiz.objects.filter(id=quiz_id).exists():
                    quiz = Quiz.objects.get(id=quiz_id)
                else:
                    quiz = Quiz.objects.create(
                        week_start=week_start,
                        week_end=week_end,
                        is_active=True,
                        title=title
                    )

                for index, q in enumerate(selected_questions, start=1):

                    QuizQuestion.objects.create(
                        quiz=quiz,
                        question=q,
                        order=index
                    )
                preview_url = reverse("dashboard:update_quiz", kwargs={'pk': quiz.id})
                return JsonResponse({"status": 1,'preview_url':preview_url})
        except Exception as e:
            logger.error(e)
            return JsonResponse({"status": 100})

           
    question_type = request.GET.get("type")
    count = request.GET.get("count")

    if count:
        count = int(count)
    else:
        count = 0

    if question_type == "random":
        questions = Question.objects.filter(status='A').order_by("?")[:count]

    elif question_type == "previous":
        questions = Question.objects.filter(status='A').order_by("-id")[:count]

    else:
        questions = Question.objects.none()

    return render(request, "dashboard/quiz/partial/check_question.html", {
        "questions": questions
    })


def toggle_quiz_status(request):

    if request.method == "POST":

        quiz_id = request.POST.get("quiz_id")

        quiz = Quiz.objects.get(id=quiz_id)

        quiz.is_active = not quiz.is_active
        quiz.save()

        return JsonResponse({
            "status": 1,
            "is_active": quiz.is_active
        })

    return JsonResponse({"status": 0})