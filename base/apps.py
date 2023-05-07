from django.apps import AppConfig

#Configuración base de la aplicación
class BaseConfig(AppConfig):
    name = 'base'

    def ready(self):
        import base.signals
