from django.contrib import admin
from .models import *
# Register your models here.
#En esta parte se declaran los modelos que se van a utilizar y de los cuales el admin tiene acceso a través de django admin
admin.site.register(Product)
admin.site.register(Review)
admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(ShippingAddress)
