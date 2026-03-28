import logging
import string
import random

def is_ajax(request):
    return request.headers.get('x-requested-with') == 'XMLHttpRequest'


def get_logger():
    return logging.getLogger("general")

def generate_otp(length):
    return ''.join(random.choices(string.digits, k=length))