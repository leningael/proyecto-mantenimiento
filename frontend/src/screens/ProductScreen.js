//Paul Hernandez
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Row, Col, Image, ListGroup, Button, Card, Form } from 'react-bootstrap'
import Rating from '../components/Rating'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { listProductDetails, createProductReview } from '../actions/productActions'
import { PRODUCT_CREATE_REVIEW_RESET } from '../constants/productConstants'

/*Panatalla de un producto en especifico*/

function ProductScreen({ match, history }) {
    const [qty, setQty] = useState(1)
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')

    const dispatch = useDispatch()

    const productDetails = useSelector(state => state.productDetails)
    const { loading, error, product } = productDetails

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const productReviewCreate = useSelector(state => state.productReviewCreate)
    const {
        loading: loadingProductReview,
        error: errorProductReview,
        success: successProductReview,
    } = productReviewCreate

/*Verificar reseñas*/
    useEffect(() => {
        if (successProductReview) {
            setRating(0)
            setComment('')
            dispatch({ type: PRODUCT_CREATE_REVIEW_RESET })
        }

        dispatch(listProductDetails(match.params.id))

    }, [dispatch, match, successProductReview])

    const addToCartHandler = () => {
        history.push(`/cart/${match.params.id}?qty=${qty}`)
    }
/*Subir reseñas*/
    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(createProductReview(
            match.params.id, {
            rating,
            comment
        }
        ))
    }

    return (
        <div /*Regresar a pagina de incio*/>
            <Link to='/' className='btn btn-light my-3'>Regresar</Link >
            {loading ?
                <Loader />
                : error
                    ? <Message variant='danger'>{error}</Message>
                    : ( /*Mensaje de error en caso de algun fallo*/
                        <div>
                            <Row>
                                <Col xs={6}>
                                    <Image src={product.image} alt={product.name} fluid />
                                </Col>


                                <Col xs={3} /*Datos del producto elegido*/>
                                    <ListGroup variant="flush">
                                        <ListGroup.Item>
                                            <h3>{product.name}</h3>
                                        </ListGroup.Item>

                                        <ListGroup.Item>
                                            <Rating value={product.rating} text={`${product.numReviews} reviews`} color={'#f8e825'} />
                                        </ListGroup.Item>

                                        <ListGroup.Item>
                                            Precio: ${product.price}
                                        </ListGroup.Item>

                                        <ListGroup.Item>
                                            Descripción: {product.description}
                                        </ListGroup.Item>
                                    </ListGroup>
                                </Col>


                                <Col xs={3}  /*Datos del producto elegido*/>
                                    <Card>
                                        <ListGroup variant='flush'>
                                            <ListGroup.Item>
                                                <Row>
                                                    <Col>Precio:</Col>
                                                    <Col>
                                                        <strong>${product.price}</strong>
                                                    </Col>
                                                </Row>
                                            </ListGroup.Item>
                                            <ListGroup.Item>
                                                <Row>
                                                    <Col>En existencia:</Col>
                                                    <Col /*Verificar cantidad*/>
                                                        {product.countInStock > 0 ? '   En Stock' : 'Fuera de Stock'}
                                                    </Col>
                                                </Row>
                                            </ListGroup.Item>

                                            {product.countInStock > 0 && (
                                                <ListGroup.Item>
                                                    <Row>
                                                        <Col>Cant</Col>
                                                        <Col xs='auto' className='my-1'>
                                                            <Form.Control
                                                                as="select"
                                                                value={qty}
                                                                onChange={(e) => setQty(e.target.value)}
                                                            >
                                                                {

                                                                    [...Array(product.countInStock).keys()].map((x) => (
                                                                        <option key={x + 1} value={x + 1}>
                                                                            {x + 1}
                                                                        </option>
                                                                    ))
                                                                }

                                                            </Form.Control>
                                                        </Col>
                                                    </Row>
                                                </ListGroup.Item>
                                            )}


                                            <ListGroup.Item>
                                                <Button /*Boton para agrgar al carrito, envio de paramentros*/
                                                    onClick={addToCartHandler}
                                                    className='btn-block'
                                                    disabled={product.countInStock == 0}
                                                    type='button'>
                                                    Agregar al carrito
                                                </Button>
                                            </ListGroup.Item>
                                        </ListGroup>
                                    </Card>
                                </Col>
                            </Row>

                            <Row>
                                <Col xs={6}>
                                    <h4>Reseñas</h4>
                                    {product.reviews.length === 0 && <Message variant='info'>No hay reseñas</Message> /*Verifica si hay reseñas*/}

                                    <ListGroup variant='flush'>
                                        {product.reviews.map((review) => (
                                            <ListGroup.Item key={review._id}>
                                                <strong>{review.name}</strong>
                                                <Rating value={review.rating} color='#f8e825' />
                                                <p>{review.createdAt.substring(0, 10)}</p>
                                                <p>{review.comment}</p>
                                            </ListGroup.Item>
                                        ))}

                                        <ListGroup.Item /*Funcion para escribir una reseña*/>
                                            <h4>Escribe una reseña</h4>

                                            {loadingProductReview && <Loader />}
                                            {successProductReview && <Message variant='success'>Se ha subido tu reseña</Message>}
                                            {errorProductReview && <Message variant='danger'>{errorProductReview}</Message>}

                                            {userInfo ? (
                                                <Form onSubmit={submitHandler} /*Funcion para calificar el producto, valores para calificar*/>
                                                    <Form.Group controlId='rating'>
                                                        <Form.Label>Rating</Form.Label>
                                                        <Form.Control
                                                            as='select'
                                                            value={rating}
                                                            onChange={(e) => setRating(e.target.value)}
                                                        > 
                                                            <option value=''>Select...</option >
                                                            <option value='1'>1 - Bastante malo</option>
                                                            <option value='2'>2 - Malo</option>
                                                            <option value='3'>3 - Meh</option>
                                                            <option value='4'>4 - Bien</option>
                                                            <option value='5'>5 - Excelente</option>
                                                        </Form.Control>
                                                    </Form.Group>

                                                    <Form.Group controlId='comment'>
                                                        <Form.Label>Reseña</Form.Label>
                                                        <Form.Control
                                                            as='textarea'
                                                            row='5'
                                                            value={comment}
                                                            onChange={(e) => setComment(e.target.value)}
                                                        ></Form.Control>
                                                    </Form.Group>

                                                    <Button /*Boton para publcar reseña*/
                                                        disabled={loadingProductReview}
                                                        type='submit'
                                                        variant='primary'
                                                    >
                                                        Publicar
                                                    </Button>

                                                </Form>
                                            ) : ( /*Mensaje en caso de que no haya iicado sesion*/
                                                    <Message variant='info'>Necesitas <Link to='/login'>iniciar sesión </Link>para publicar reseñas</Message>
                                                )}
                                        </ListGroup.Item>
                                    </ListGroup>
                                </Col>
                            </Row>
                        </div>
                    )

            }


        </div >
    )
}

export default ProductScreen
