//Paul Hernandez
import React, { useEffect } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { listOrders } from '../actions/orderActions'
import { useNavigate } from 'react-router-dom'

function OrderListScreen() {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const orderList = useSelector(state => state.orderList)
    const { loading, error, orders } = orderList

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

//Verificar si se ha inicado sesion
    useEffect(() => {
        if (userInfo && userInfo.isAdmin) {
            dispatch(listOrders())
        } else {
            navigate('/login')
        }

    }, [dispatch, userInfo])


    return (
        //Muestra la información de una orden, entre ellos los datos del usuario
        <div>
            <h1>Ordenes</h1>
            {loading
                ? (<Loader />)
                : error
                    ? (<Message variant='danger'>{error}</Message>)
                    : (
                        <Table striped bordered hover responsive className='table-sm'>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>USUARIO</th>
                                    <th>FECHA</th>
                                    <th>Total</th>
                                    <th>PAGADO</th>
                                    <th>ENTREGADO</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map(order => (//Datos de la orden
                                    <tr key={order._id}>
                                        <td>{order._id}</td>
                                        <td>{order.user && order.user.name}</td>
                                        <td>{order.createdAt.substring(0, 10)}</td>
                                        <td>${order.totalPrice}</td>

                                        <td>{order.isPaid ? (/*Verificar pago de la orden*/
                                            order.paidAt.substring(0, 10)
                                        ) : (
                                                <i className='fas fa-times' style={{ color: 'red' }}></i>
                                            )}
                                        </td>

                                        <td>{order.isDelivered ? (
                                            order.deliveredAt.substring(0, 10)
                                        ) : (
                                                <i className='fas fa-times' style={{ color: 'red' }}></i>
                                            )}
                                        </td>

                                        <td>
                                            <LinkContainer to={`/order/${order._id}`}/*Boton para los detalles de la orden*/>
                                                <Button variant='light' className='btn-sm'>
                                                    Detalles
                                                </Button>
                                            </LinkContainer>

                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
        </div>
    )
}

export default OrderListScreen