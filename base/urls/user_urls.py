from django.urls import path
from base.views import user_views as views

#Se definenlas ruta que van a derivarse del modelo de usuarios, permitiendo su registro, su listado completo, además de los permisos que tienen los miembros de staff, los cuales 
#permiten ver los perfiles de los usuarios, modificarlos y eliminarlos
urlpatterns = [
    path('login/', views.MyTokenObtainPairView.as_view(),
         name='token_obtain_pair'),

    path('register/', views.registerUser, name='register'),

    path('profile/', views.getUserProfile, name="users-profile"),
    path('profile/update/', views.updateUserProfile, name="user-profile-update"),
    path('', views.getUsers, name="users"),

    path('<str:pk>/', views.getUserById, name='user'),

    path('update/<str:pk>/', views.updateUser, name='user-update'),

    path('delete/<str:pk>/', views.deleteUser, name='user-delete'),
]
