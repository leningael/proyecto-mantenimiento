from django.urls import path
from base.views import order_views as views

#Declaración de las urls o dirreciones que el sistema permite al momento de navegar entre los templates de la página, en este caso se refiere a 
#la vista de las ordenes, que incluye una vista completa de las ordenes, la opción de pagar y revisar si ya fue entregada o no
urlpatterns = [

    path('', views.getOrders, name='orders'),
    path('add/', views.addOrderItems, name='orders-add'),
    path('myorders/', views.getMyOrders, name='myorders'),

    path('<str:pk>/deliver/', views.updateOrderToDelivered, name='order-delivered'),

    path('<str:pk>/', views.getOrderById, name='user-order'),
    path('<str:pk>/pay/', views.updateOrderToPaid, name='pay'),
]
