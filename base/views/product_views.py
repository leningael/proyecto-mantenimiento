from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
#Dentro de la vista de los productos se importan los componentes que van a formar parte de la misma, los datos del producto y las reviews que se van a mostrar
from base.models import Product, Review
from base.serializers import ProductSerializer

from rest_framework import status

#El API recopila todos los productos y los muestra , también recaba los productos que sean buscados por medio de la barra de búsqueda, si no existe ninguno, no se muestra nada 
#y la vista queda en blanco, además de eso, se paginan los productos en cantiades de 5, mostrando solo una peuqeña porción en la pantalla de inicio y se separan por diferentes páginas enumeradas
@api_view(['GET'])
def getProducts(request):
    query = request.query_params.get('keyword')
    if query == None:
        query = ''
    sort = request.query_params.get('sort')
    if sort == None:
        sort = ''
    if sort == 'createdAt':
        sort = '-createdAt'
    elif sort == 'price_asc':
        sort = 'price'
    elif sort == 'price_desc':
        sort = '-price'
    elif sort == 'name':
        sort = 'name'
    else:
        sort = '-createdAt'

    products = Product.objects.filter(name__icontains=query).order_by(
            sort)
    
    if sort == 'name':
        products = sorted(products, key=lambda x: x.name.lower())
    
    page = request.query_params.get('page')
    paginator = Paginator(products, 5)

    try:
        products = paginator.page(page)
    except PageNotAnInteger:
        products = paginator.page(1)
    except EmptyPage:
        products = paginator.page(paginator.num_pages)

    if page == None:
        page = 1

    page = int(page)
    print('Page:', page)
    serializer = ProductSerializer(products, many=True)
    return Response({'products': serializer.data, 'page': page, 'pages': paginator.num_pages})


@api_view(['GET'])
def getTopProducts(request):
    products = Product.objects.filter(rating__gte=4).order_by('-rating')[0:5]
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def getProduct(request, pk):
    product = Product.objects.get(_id=pk)
    serializer = ProductSerializer(product, many=False)
    return Response(serializer.data)

#Esta función define un permiso que tiene el usuario tipo admin, de crear o registrar un producto nuevo, introduciendo sus datos principales
@api_view(['POST'])
@permission_classes([IsAdminUser])
def createProduct(request):
    user = request.user

    product = Product.objects.create(
        user=user,
        name='Sample Name',
        price=0,
        brand='Sample Brand',
        countInStock=0,
        category='Sample Category',
        description=''
    )

    serializer = ProductSerializer(product, many=False)
    return Response(serializer.data)

#Esta función obtiene los productos creado anteriormente y los crea, agregandolos al listado de estos mismos
@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateProduct(request, pk):
    data = request.data
    product = Product.objects.get(_id=pk)

    product.name = data['name']
    product.price = data['price']
    product.brand = data['brand']
    product.countInStock = data['countInStock']
    product.category = data['category']
    product.description = data['description']

    product.save()

    serializer = ProductSerializer(product, many=False)
    return Response(serializer.data)

#Los usuarios admin tambien pueden eliminar productos con solos seleccionarlos y dar click en delete
@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deleteProduct(request, pk):
    product = Product.objects.get(_id=pk)
    product.delete()
    return Response('Producted Deleted')

#La función por la cual los usuarios pueden agregar imagenes a lo productos, por medio de un archivo o una url
@api_view(['POST'])
def uploadImage(request):
    data = request.data

    product_id = data['product_id']
    product = Product.objects.get(_id=product_id)

    product.image = request.FILES.get('image')
    product.save()

    return Response('Image was uploaded')

#Esta función permite crear reviews de los productos, pero solo está disponible para los usuarios que tenga cuenta y que su sesión esté inciada, pero por cada usuario debe existir solo una review
#por producto, si intenta crear otra del mismo producto, el sistema muestra un error.
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createProductReview(request, pk):
    user = request.user
    product = Product.objects.get(_id=pk)
    data = request.data

    # 1 - Review already exists
    alreadyExists = product.review_set.filter(user=user).exists()
    if alreadyExists:
        content = {'detail': 'Producto ya revisado'}
        return Response(content, status=status.HTTP_400_BAD_REQUEST)

    # 2 - No Rating or 0
    elif data['rating'] == 0:
        content = {'detail': 'Please select a rating'}
        return Response(content, status=status.HTTP_400_BAD_REQUEST)

    # 3 - Create review
    else:
        review = Review.objects.create(
            user=user,
            product=product,
            name=user.first_name,
            rating=data['rating'],
            comment=data['comment'],
        )

        reviews = product.review_set.all()
        product.numReviews = len(reviews)

        total = 0
        for i in reviews:
            total += i.rating

        product.rating = total / len(reviews)
        product.save()

        return Response('Review added')
