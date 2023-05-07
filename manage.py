#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys

#Se define el entorno en el que se van a instalar todos los modulos y componentes de Django, si no se encuentra al momento de producción, muestra un mensaje de error indicando 
#que no se encuentra Django.
def main():
    """Run administrative tasks."""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
