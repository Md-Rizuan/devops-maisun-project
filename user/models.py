from dashboard.models.choice_field import ROLE_CHOICES
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _


class CustomUser(AbstractUser):
    STATUS_CHOICES = (
        ('A', 'Active'),
        ('D', 'Deleted'),
        ('T', 'Transferred'),
    )

    email = models.EmailField(_('email address'), blank=True, null=True)
    contact_number = models.CharField(max_length=11, default="")
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='A')
    is_password_reset = models.BooleanField(default=False)
    
    REQUIRED_FIELDS = []

