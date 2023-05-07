from django.urls import path
from base.views import product_views as views
#Se definen las rutas que pueden ser accedidas desde el modelo producto, como la vista individual de los productos, ver toda la lista de los mismos, además del permiso que tienen los 
#miembros de staff, como modificar, agregar y borrar productos, todas estás rutas se derivan de la vista de los productos
urlpatterns = [

    path('', views.getProducts, name="products"),

    path('create/', views.createProduct, name="product-create"),
    path('upload/', views.uploadImage, name="image-upload"),

    path('<str:pk>/reviews/', views.createProductReview, name="create-review"),
    path('top/', views.getTopProducts, name='top-products'),
    path('<str:pk>/', views.getProduct, name="product"),

    path('update/<str:pk>/', views.updateProduct, name="product-update"),
    path('delete/<str:pk>/', views.deleteProduct, name="product-delete"),
]
