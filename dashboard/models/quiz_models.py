from django.db import models
from .base_models import TimeStampedBaseModel
from .choice_field import ANSWER_CHOICES


class Quiz(TimeStampedBaseModel):
    title = models.CharField(max_length=255, default='')
    week_start = models.DateField()
    week_end = models.DateField()
    is_active = models.BooleanField(default=True)


class Question(TimeStampedBaseModel):
    text = models.TextField()

    option_a = models.CharField(max_length=100, default='')
    option_b = models.CharField(max_length=100, default='')
    option_c = models.CharField(max_length=100, default='')
    option_d = models.CharField(max_length=100, default='')

    correct_answer = models.CharField(
        max_length=2,
        choices=ANSWER_CHOICES, default='A'
    )

    def is_correct(self, selected_answer):
        return selected_answer == self.correct_answer


class QuizQuestion(TimeStampedBaseModel):
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    order = models.PositiveIntegerField()

    class Meta:
        unique_together = ('quiz', 'question')