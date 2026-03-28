
from django.core.paginator import Paginator
from datetime import datetime, date
import re
import random
import string
from django.http import JsonResponse
from django.core.paginator import Paginator

regex = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'


def validate_email(email):
    return True if re.match(regex, email) else False


def parse_date(the_date):
    if the_date:
        new_date = datetime.strptime(the_date, "%d-%m-%Y")
        return new_date.strftime("%Y-%m-%d")
    return False


def parse_time(time):
    return datetime.strptime(time, "%I:%M %p").time()

def get_paginated_page(queryset, num_of_objects, page_no):
    try:
        return Paginator(queryset, num_of_objects).page(page_no)
    except Exception as e:
        print(e, "<<<<<<<< paginator")
        return Paginator(queryset, num_of_objects).page(1)