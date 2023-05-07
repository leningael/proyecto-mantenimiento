//Paul Hernandez y Vianey Martinez 
import React, { useState } from 'react'
import { Form, Button, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import FormContainer from '../components/FormContainer'
import CheckoutSteps from '../components/CheckoutSteps'
import { savePaymentMethod } from '../actions/cartActions'
import { useNavigate } from 'react-router-dom'

function PaymentScreen() {

    const cart = useSelector(state => state.cart)
    const navigate = useNavigate()
    const { shippingAddress } = cart

    const dispatch = useDispatch()

    const [paymentMethod, setPaymentMethod] = useState('PayPal')

    /*Verificar dirección de entrega*/
    if (!shippingAddress.address) {
        navigate('/shipping')
    }

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(savePaymentMethod(paymentMethod))
        navigate('/placeorder')
    }

    return (
        <FormContainer>
            <CheckoutSteps step1 step2 step3 />
            
            <Form onSubmit={submitHandler}  /*Tipos de metodos de pago*/>
                <Form.Group>
                    <Form.Label as='legend'>Selecciona un método</Form.Label>
                    <Col>
                        <Form.Check
                            type='radio'
                            label='PayPal or Credit Card'
                            id='paypal'
                            name='paymentMethod'
                            checked
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        >
                        </Form.Check>
                    </Col>
                </Form.Group>

                <Button type='submit' variant='primary' /**/>
                    Continuar
                </Button>
          
            </Form>
        </FormContainer>
        
    )
}

export default PaymentScreen
