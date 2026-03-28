from django.conf import settings
from datetime import datetime



def default_context(request):
    context_data = {
        'main_server': settings.MAIN_SERVER,
        'static_server': settings.STATIC_SERVER,
        'dashboard_theme_server': settings.DASHBOARD_THEME_SERVER,
        'home_theme_server': settings.HOME_THEME_SERVER,
        'media_server': settings.MEDIA_SERVER,
        'app_name': "Maisun World",
        'client_name': "Maisun"
    }

    return context_data


