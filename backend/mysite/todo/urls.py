from django.urls import path

from . import views

app_name = 'polls'

urlpatterns = [
    path('', views.root, name='root'),
    path('login/', views.login, name='login'),
    path('logout/', views.logout, name='logout'),
    path('dashboard/', views.dashboard, name='dashboard'),
    path('signup/', views.signup, name='signup'),
    path('api/list/', views.list, name='api'),
    path('api/insert/', views.insert_todo, name='api_insert'),
    path('api/delete/<int:id>/', views.delete_todo, name='api_delete'),
    path('ping/', views.pinger, name='pinger'),
    path('api/edit/', views.edit_todo, name='api_edit'),
]