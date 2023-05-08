from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
#Se importan las funciones que se van a utilizar para el manejo de usuarios por medio de REST 
from django.contrib.auth.models import User
from base.serializers import ProductSerializer, UserSerializer, UserSerializerWithToken
# Create your views here.
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from rest_framework import status
#**********************************************
from backend.settings import GOOGLE_CLIENT_ID
from google.oauth2 import id_token
from google.auth.transport import requests
import jwt
from django.contrib.auth.models import User
from django.http import JsonResponse
import hashlib
from django.contrib.auth.hashers import make_password

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        attrs['password'] = hashlib.md5(attrs['password'].encode()).hexdigest()
        data = super().validate(attrs)

        serializer = UserSerializerWithToken(self.user).data
        for k, v in serializer.items():
            data[k] = v

        return data


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer
#La función de registrar usuario permite que se creen cuentas, pero solo pueden ser emails no antes registrados

# Google sign in handler view
@api_view(['POST'])
def google_sign_in(request):
    token = request.data.get('token')
    try:
        idinfo = id_token.verify_oauth2_token(
            token, requests.Request(), GOOGLE_CLIENT_ID)
    except ValueError:
        return JsonResponse({'error': 'Invalid token', 'message': f'{token} not valid'})
    
    user_email = idinfo['email']
    try:
    # Check if user exists in Django database, create new user if not
        user = User.objects.get(email=user_email)
    except User.DoesNotExist:
        message = {'detail': 'User not created'}
        return Response(message, status=status.HTTP_401_UNAUTHORIZED)
    # Response user
    response = UserSerializerWithToken(user, many=False)
    return JsonResponse(response.data)



@api_view(['POST'])
def registerUser(request):
    data = request.data
    try:
        unhashed_password = hashlib.md5(data['password'].encode()).hexdigest()
        user = User.objects.create(
            first_name=data['name'],
            username=data['email'],
            email=data['email'],
            password=make_password(unhashed_password),
        )

        serializer = UserSerializerWithToken(user, many=False)
        return Response(serializer.data)
    except:
        message = {'detail': 'User with this email already exists'}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)

#Los amiembros de staff y tambien los usuarios pueden modificar sus cuentas, editando su nombre, contraseña, correo y eso se guarda para después enviarse al sistema
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateUserProfile(request):
    user = request.user
    serializer = UserSerializerWithToken(user, many=False)

    data = request.data
    user.first_name = data['name']
    user.username = data['email']
    user.email = data['email']

    if data['password'] != '':
        user.password = data['password']

    user.save()

    return Response(serializer.data)

#Los admins o staff pueden obtener la información de los usuarios por medio de sus perfiles
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserProfile(request):
    user = request.user
    serializer = UserSerializer(user, many=False)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def getUsers(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)

#Esta función permite que los Admins puedan ver los datos especificos de un solo usuario
@api_view(['GET'])
@permission_classes([IsAdminUser])
def getUserById(request, pk):
    user = User.objects.get(id=pk)
    serializer = UserSerializer(user, many=False)
    return Response(serializer.data)

#La función para actualizar los datos de un usuario, permitiendo modificar los registros que están en el sistema
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateUser(request, pk):
    user = User.objects.get(id=pk)

    data = request.data

    user.first_name = data['name']
    user.username = data['email']
    user.email = data['email']
    user.is_staff = data['isAdmin']

    user.save()

    serializer = UserSerializer(user, many=False)

    return Response(serializer.data)

#Los admins pueden eliminar usuarios
@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deleteUser(request, pk):
    userForDeletion = User.objects.get(id=pk)
    userForDeletion.delete()
    return Response('User was deleted')
