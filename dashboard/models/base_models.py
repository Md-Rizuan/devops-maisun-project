from django.db import models


class TimeStampedBaseModel(models.Model):
    STATUS_CHOICES = (
        ('D', 'Deleted'),
        ('A', 'Active'),
    )
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    status = models.CharField(choices=STATUS_CHOICES, max_length=5, default='A')

    class Meta:
        abstract = True
