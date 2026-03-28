"""
URL configuration for maisun_site project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
import debug_toolbar
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
import dashboard.urls as dashboard_urls
import core.urls as core_urls
import user.urls as user_urls


urlpatterns = [
    path('admin/', admin.site.urls),
    path('dashboard/', include((dashboard_urls, 'dashboard'), namespace='dashboard')),
    path('', include((core_urls, 'core'), namespace='core')),
    path('user/', include((user_urls, 'user'), namespace='user')),
]

if settings.DEBUG:
    urlpatterns += [
        path('__debug__/', include(debug_toolbar.urls)),
    ] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)