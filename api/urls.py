from django.urls import path, re_path

from . import views

urlpatterns = [
    path('login/', views.login_user, name='login'),
    path('logout/', views.logout_view, name='logout'),
    re_path(r'callback/?$', views.callback, name='callback'),
    path('add_print/', views.add_print, name='api-add_print'),
    path('get_user_blueprints/', views.get_user_blueprints, name='api-get_user_blueprints'),
    path('get_materials/', views.get_materials, name='api-get_materials'),

    path('session/', views.session_view, name='api-session'),
]
